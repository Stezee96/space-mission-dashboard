from fastapi import FastAPI
from functools import lru_cache
from fastapi.middleware.cors import CORSMiddleware
from database import get_db_connection  
from urllib.parse import unquote
import psycopg2.extras
from fastapi import Request
from typing import Optional
from fastapi import Query
import joblib
import pandas as pd
import os
import csv

VALID_ROCKETS = set()
VALID_COMPANIES = set()
VALID_LOCATIONS = set()

def load_validation_data():
    global VALID_ROCKETS, VALID_COMPANIES, VALID_LOCATIONS
    with open("rocket company and location.csv", mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            VALID_ROCKETS.add(row["rocket"].strip())
            VALID_COMPANIES.add(row["company"].strip())
            VALID_LOCATIONS.add(row["location"].strip())

load_validation_data()

def standardize_country_filter(country: Optional[str]) -> Optional[str]:
    """
    Maps the country filter to a consistent label used in your SQL queries.
    Returns None if no country filter is applied.
    """
    if not country or country == "All":
        return None

    # Match country filter to location substring
    mapping = {
        "United States": "USA",
        "Russia": "Russia",
        "China": "China",
        "Japan": "Japan",
        "India": "India",
        "France": "France",  # or 'Guiana'
        "New Zealand": "New Zealand",
        "Iran": "Iran",
        "South Korea": "South Korea",
        "North Korea": "North Korea",
        "Kenya": "Kenya",
        "Brazil": "Brazil"
    }

    return mapping.get(country, None)



app = FastAPI()

# Allow frontend (React) to talk to this API later
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Test route
@app.get("/")
def read_root():
    return {"message": "API is working"}

import psycopg2.extras  # Needed for dict-style row fetching


#MISSION status

@lru_cache(maxsize=50)
def cached_mission_status(start_year, end_year, status, country):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
            SELECT mission_status, COUNT(*) as count
            FROM space_missions
            WHERE DATE_PART('year', launch_date) BETWEEN %s AND %s
        """
        params = [start_year, end_year]

        if status:
            query += " AND mission_status = %s"
            params.append(status)

        country_filter = standardize_country_filter(country)
        if country_filter:
            query += " AND location ILIKE %s"
            params.append(f"%{country_filter}%")

        query += " GROUP BY mission_status ORDER BY count DESC;"

        cursor.execute(query, tuple(params))
        results = cursor.fetchall()

        cursor.close()
        conn.close()

        return [{"mission_status": row[0], "count": row[1]} for row in results]

    except Exception as e:
        return {"error": str(e)}
    
@lru_cache(maxsize=50)
def cached_mission_status(start_year, end_year, status, country):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
            SELECT mission_status, COUNT(*) as count
            FROM space_missions
            WHERE DATE_PART('year', launch_date) BETWEEN %s AND %s
        """
        params = [start_year, end_year]

        if status:
            query += " AND mission_status = %s"
            params.append(status)

        country_filter = standardize_country_filter(country)
        if country_filter:
            query += " AND location ILIKE %s"
            params.append(f"%{country_filter}%")

        query += " GROUP BY mission_status ORDER BY count DESC;"

        cursor.execute(query, tuple(params))
        results = cursor.fetchall()

        cursor.close()
        conn.close()

        return [{"mission_status": row[0], "count": row[1]} for row in results]

    except Exception as e:
        return {"error": str(e)}

#TOP COMPANIES
@lru_cache(maxsize=50)
def cached_top_companies(start_year, end_year, status, country):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
            SELECT company, COUNT(*) as mission_count
            FROM space_missions
            WHERE DATE_PART('year', launch_date) BETWEEN %s AND %s
        """
        params = [start_year, end_year]

        if status:
            query += " AND mission_status = %s"
            params.append(status)

        if country:
            query += " AND (CASE " \
                     "WHEN location ILIKE '%%USA%%' THEN 'United States' " \
                     "WHEN location ILIKE '%%Russia%%' THEN 'Russia' " \
                     "WHEN location ILIKE '%%China%%' THEN 'China' " \
                     "WHEN location ILIKE '%%Japan%%' THEN 'Japan' " \
                     "WHEN location ILIKE '%%India%%' THEN 'India' " \
                     "WHEN location ILIKE '%%France%%' OR location ILIKE '%%Guiana%%' THEN 'France' " \
                     "WHEN location ILIKE '%%New Zealand%%' THEN 'New Zealand' " \
                     "WHEN location ILIKE '%%Iran%%' THEN 'Iran' " \
                     "WHEN location ILIKE '%%South Korea%%' THEN 'South Korea' " \
                     "WHEN location ILIKE '%%North Korea%%' THEN 'North Korea' " \
                     "WHEN location ILIKE '%%Kenya%%' THEN 'Kenya' " \
                     "WHEN location ILIKE '%%Brazil%%' THEN 'Brazil' " \
                     "ELSE 'Other' END) = %s"
            params.append(country)

        query += """
            GROUP BY company
            ORDER BY mission_count DESC
            LIMIT 10;
        """

        cursor.execute(query, tuple(params))
        results = cursor.fetchall()

        cursor.close()
        conn.close()

        return [{"company": row[0], "mission_count": row[1]} for row in results]

    except Exception as e:
        return {"error": str(e)}


@app.get("/api/top-companies")
def get_top_companies(
    start_year: int = Query(1957),
    end_year: int = Query(2023),
    status: str = Query(None),
    country: str = Query(None)
):
    return cached_top_companies(start_year, end_year, status, country)

# Example for /api/launches-per-year
@lru_cache(maxsize=50)
def cached_launches_per_year(start_year, end_year, status, country):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        query = """
            SELECT DATE_PART('year', launch_date) AS year, COUNT(*) as count
            FROM space_missions
            WHERE DATE_PART('year', launch_date) BETWEEN %s AND %s
        """
        params = [start_year, end_year]

        if status:
            query += " AND mission_status = %s"
            params.append(status)

        if country and country != "All":
            query += """
                AND (CASE
                    WHEN location ILIKE '%%USA%%' THEN 'United States'
                    WHEN location ILIKE '%%Russia%%' THEN 'Russia'
                    WHEN location ILIKE '%%China%%' THEN 'China'
                    WHEN location ILIKE '%%Japan%%' THEN 'Japan'
                    WHEN location ILIKE '%%India%%' THEN 'India'
                    WHEN location ILIKE '%%France%%' OR location ILIKE '%%Guiana%%' THEN 'France'
                    WHEN location ILIKE '%%New Zealand%%' THEN 'New Zealand'
                    WHEN location ILIKE '%%Iran%%' THEN 'Iran'
                    WHEN location ILIKE '%%South Korea%%' THEN 'South Korea'
                    WHEN location ILIKE '%%North Korea%%' THEN 'North Korea'
                    WHEN location ILIKE '%%Kenya%%' THEN 'Kenya'
                    WHEN location ILIKE '%%Brazil%%' THEN 'Brazil'
                    ELSE 'Other' END) = %s
            """
            params.append(country)

        query += " GROUP BY year ORDER BY year;"

        cursor.execute(query, tuple(params))
        results = cursor.fetchall()

        cursor.close()
        conn.close()
        return results

    except Exception as e:
        return {"error": str(e)}


@app.get("/api/launches-per-year")
def get_launches_per_year(
    start_year: int = 1957,
    end_year: int = 2023,
    status: Optional[str] = None,
    country: Optional[str] = None
):
    return cached_launches_per_year(start_year, end_year, status, country)

#launch locations
@app.get("/api/top-launch-locations")
def get_top_launch_locations(request: Request):
    try:
        start_year = request.query_params.get("start_year")
        end_year = request.query_params.get("end_year")
        status = request.query_params.get("status")
        country = request.query_params.get("country")

        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        query = """
            SELECT location, COUNT(*) as count
            FROM space_missions
            WHERE (%s IS NULL OR DATE_PART('year', launch_date) >= %s)
              AND (%s IS NULL OR DATE_PART('year', launch_date) <= %s)
              AND (%s IS NULL OR mission_status = %s)
        """
        params = (
            start_year, start_year,
            end_year, end_year,
            status, status
        )

        if country and country != "All":
            # Use country mapping logic for accurate filtering
            query += " AND (CASE " \
                     "WHEN location ILIKE '%%USA%%' THEN 'United States' " \
                     "WHEN location ILIKE '%%Russia%%' THEN 'Russia' " \
                     "WHEN location ILIKE '%%China%%' THEN 'China' " \
                     "WHEN location ILIKE '%%Japan%%' THEN 'Japan' " \
                     "WHEN location ILIKE '%%India%%' THEN 'India' " \
                     "WHEN location ILIKE '%%France%%' OR location ILIKE '%%Guiana%%' THEN 'France' " \
                     "WHEN location ILIKE '%%New Zealand%%' THEN 'New Zealand' " \
                     "WHEN location ILIKE '%%Iran%%' THEN 'Iran' " \
                     "WHEN location ILIKE '%%South Korea%%' THEN 'South Korea' " \
                     "WHEN location ILIKE '%%North Korea%%' THEN 'North Korea' " \
                     "WHEN location ILIKE '%%Kenya%%' THEN 'Kenya' " \
                     "WHEN location ILIKE '%%Brazil%%' THEN 'Brazil' " \
                     "ELSE 'Other' END) = %s"
            params += (country,)

        query += """
            GROUP BY location
            ORDER BY count DESC
            LIMIT 10;
        """

        cursor.execute(query, params)
        results = cursor.fetchall()
        cursor.close()
        conn.close()

        return results

    except Exception as e:
        return {"error": str(e)}


#Mission Status by company
@lru_cache(maxsize=50)
def cached_mission_status(start_year, end_year, status, country):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
            SELECT mission_status, COUNT(*) as count
            FROM space_missions
            WHERE DATE_PART('year', launch_date) BETWEEN %s AND %s
        """
        params = [start_year, end_year]

        if status:
            query += " AND mission_status = %s"
            params.append(status)

        country_filter = standardize_country_filter(country)
        if country_filter:
            query += " AND location ILIKE %s"
            params.append(f"%{country_filter}%")

        query += " GROUP BY mission_status ORDER BY count DESC;"

        cursor.execute(query, tuple(params))
        results = cursor.fetchall()

        cursor.close()
        conn.close()

        return [{"mission_status": row[0], "count": row[1]} for row in results]

    except Exception as e:
        return {"error": str(e)}
    
@app.get("/api/mission-status")
def get_mission_status(
    start_year: int = Query(1957),
    end_year: int = Query(2023),
    status: str = Query(None),
    country: str = Query(None)
):
    return cached_mission_status(start_year, end_year, status, country)

#rocket type
@app.get("/api/top-rocket-types")
def get_top_rocket_types(start_year: int, end_year: int, status: Optional[str] = None, country: Optional[str] = None):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        query = """
        SELECT rocket, COUNT(*) as count
        FROM space_missions
        WHERE EXTRACT(YEAR FROM launch_date) BETWEEN %s AND %s
        """
        params = [start_year, end_year]

        if status and status != "All":
            query += " AND mission_status = %s"
            params.append(status)

        if country and country != "All":
            # Use same country mapping logic as mission-status
            query += " AND (CASE " \
                     "WHEN location ILIKE '%%USA%%' THEN 'United States' " \
                     "WHEN location ILIKE '%%Russia%%' THEN 'Russia' " \
                     "WHEN location ILIKE '%%China%%' THEN 'China' " \
                     "WHEN location ILIKE '%%Japan%%' THEN 'Japan' " \
                     "WHEN location ILIKE '%%India%%' THEN 'India' " \
                     "WHEN location ILIKE '%%France%%' OR location ILIKE '%%Guiana%%' THEN 'France' " \
                     "WHEN location ILIKE '%%New Zealand%%' THEN 'New Zealand' " \
                     "WHEN location ILIKE '%%Iran%%' THEN 'Iran' " \
                     "WHEN location ILIKE '%%South Korea%%' THEN 'South Korea' " \
                     "WHEN location ILIKE '%%North Korea%%' THEN 'North Korea' " \
                     "WHEN location ILIKE '%%Kenya%%' THEN 'Kenya' " \
                     "WHEN location ILIKE '%%Brazil%%' THEN 'Brazil' " \
                     "ELSE 'Other' END) = %s"
            params.append(country)

        query += """
        GROUP BY rocket
        ORDER BY count DESC
        LIMIT 10;
        """

        cursor.execute(query, params)
        results = cursor.fetchall()
        cursor.close()
        conn.close()

        return results

    except Exception as e:
        return {"error": str(e)}




# Launch Outcome Breakdown
@app.get("/api/launch-outcome")
def get_launch_outcome(start_year: int, end_year: int, status: Optional[str] = None, country: Optional[str] = None):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        query = """
            SELECT mission_status AS outcome, COUNT(*) AS count
            FROM space_missions
            WHERE EXTRACT(YEAR FROM launch_date) BETWEEN %s AND %s
        """
        params = [start_year, end_year]

        if status and status != "All":
            query += " AND mission_status = %s"
            params.append(status)

        if country and country != "All":
            # Use the same CASE logic for country mapping
            query += """
                AND (CASE
                    WHEN location ILIKE '%%USA%%' THEN 'United States'
                    WHEN location ILIKE '%%Russia%%' THEN 'Russia'
                    WHEN location ILIKE '%%China%%' THEN 'China'
                    WHEN location ILIKE '%%Japan%%' THEN 'Japan'
                    WHEN location ILIKE '%%India%%' THEN 'India'
                    WHEN location ILIKE '%%France%%' OR location ILIKE '%%Guiana%%' THEN 'France'
                    WHEN location ILIKE '%%New Zealand%%' THEN 'New Zealand'
                    WHEN location ILIKE '%%Iran%%' THEN 'Iran'
                    WHEN location ILIKE '%%South Korea%%' THEN 'South Korea'
                    WHEN location ILIKE '%%North Korea%%' THEN 'North Korea'
                    WHEN location ILIKE '%%Kenya%%' THEN 'Kenya'
                    WHEN location ILIKE '%%Brazil%%' THEN 'Brazil'
                    ELSE 'Other' END) = %s
            """
            params.append(country)

        query += " GROUP BY mission_status ORDER BY count DESC"

        cursor.execute(query, tuple(params))
        results = cursor.fetchall()

        cursor.close()
        conn.close()
        return results

    except Exception as e:
        return {"error": str(e)}


    
    
@app.get("/api/launch-summary-by-country")
def get_launch_summary_by_country():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        query = """
        SELECT 
            CASE
                WHEN location ILIKE '%USA%' THEN 'United States'
                WHEN location ILIKE '%Russia%' THEN 'Russia'
                WHEN location ILIKE '%China%' THEN 'China'
                WHEN location ILIKE '%Japan%' THEN 'Japan'
                WHEN location ILIKE '%India%' THEN 'India'
                WHEN location ILIKE '%France%' OR location ILIKE '%Guiana%' THEN 'France'
                WHEN location ILIKE '%New Zealand%' THEN 'New Zealand'
                WHEN location ILIKE '%Iran%' THEN 'Iran'
                WHEN location ILIKE '%South Korea%' THEN 'South Korea'
                WHEN location ILIKE '%North Korea%' THEN 'North Korea'
                WHEN location ILIKE '%Kenya%' THEN 'Kenya'
                WHEN location ILIKE '%Brazil%' THEN 'Brazil'
                ELSE 'Other'
            END AS country,
            COUNT(*) AS total_launches,
            SUM(CASE WHEN mission_status = 'Success' THEN 1 ELSE 0 END) AS successful,
            SUM(CASE WHEN mission_status = 'Failure' THEN 1 ELSE 0 END) AS failed,
            COUNT(DISTINCT company) AS active_programs
        FROM space_missions
        GROUP BY country
        ORDER BY total_launches DESC;
        """

        cursor.execute(query)
        results = cursor.fetchall()

        cursor.close()
        conn.close()

        return results

    except Exception as e:
        return {"error": str(e)}

@app.get("/api/launch-sites-by-country")
def get_launch_sites_by_country(country: str):
    from fastapi.responses import JSONResponse

    try:
        decoded_country = unquote(country)
        print("▶ Decoded country:", decoded_country)

        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        # Test count to confirm table is loaded
        cursor.execute("SELECT COUNT(*) FROM space_missions")
        total_rows = cursor.fetchone()
        print(f"🔍 Total rows in space_missions: {total_rows['count']}")

        query = """
        SELECT
            sm.location,
            COUNT(*) AS total_launches,
            SUM(CASE WHEN sm.mission_status = 'Success' THEN 1 ELSE 0 END) AS successful,
            SUM(CASE WHEN sm.mission_status = 'Failure' THEN 1 ELSE 0 END) AS failed,
            COUNT(DISTINCT sm.company) AS active_programs
        FROM space_missions sm
        WHERE sm.location IS NOT NULL
          AND sm.company IS NOT NULL
          AND sm.mission_status IS NOT NULL
          AND (
              (%s = 'United States' AND sm.location ILIKE '%%USA%%')
              OR (%s = 'Russia' AND sm.location ILIKE '%%Russia%%')
              OR (%s = 'China' AND sm.location ILIKE '%%China%%')
              OR (%s = 'Japan' AND sm.location ILIKE '%%Japan%%')
              OR (%s = 'India' AND sm.location ILIKE '%%India%%')
              OR (%s = 'France' AND (sm.location ILIKE '%%France%%' OR sm.location ILIKE '%%Guiana%%'))
              OR (%s = 'New Zealand' AND sm.location ILIKE '%%New Zealand%%')
              OR (%s = 'Iran' AND sm.location ILIKE '%%Iran%%')
              OR (%s = 'South Korea' AND sm.location ILIKE '%%South Korea%%')
              OR (%s = 'North Korea' AND sm.location ILIKE '%%North Korea%%')
              OR (%s = 'Kenya' AND sm.location ILIKE '%%Kenya%%')
              OR (%s = 'Brazil' AND sm.location ILIKE '%%Brazil%%')
              OR (%s = 'Other' AND sm.location NOT ILIKE '%%USA%%' AND sm.location NOT ILIKE '%%Russia%%' AND
                  sm.location NOT ILIKE '%%China%%' AND sm.location NOT ILIKE '%%Japan%%' AND
                  sm.location NOT ILIKE '%%India%%' AND sm.location NOT ILIKE '%%France%%' AND
                  sm.location NOT ILIKE '%%Guiana%%' AND sm.location NOT ILIKE '%%New Zealand%%' AND
                  sm.location NOT ILIKE '%%Iran%%' AND sm.location NOT ILIKE '%%South Korea%%' AND
                  sm.location NOT ILIKE '%%North Korea%%' AND sm.location NOT ILIKE '%%Kenya%%' AND
                  sm.location NOT ILIKE '%%Brazil%%')
          )
        GROUP BY sm.location
        ORDER BY total_launches DESC;
        """

        # Pass decoded_country 13 times
        cursor.execute(query, tuple([decoded_country] * 13))
        results = cursor.fetchall()

        print(f"✅ Query returned {len(results)} rows for {decoded_country}")
        return results

    except Exception as e:
        print("🚨 Exception occurred:", str(e))
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.get("/api/launch-stat-summary")
def get_launch_stat_summary():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Total Missions
        cursor.execute("SELECT COUNT(*) FROM space_missions;")
        total_missions = cursor.fetchone()[0]

        # First Launch Year
        cursor.execute("""
            SELECT MIN(DATE_PART('year', launch_date)) 
            FROM space_missions
            WHERE launch_date IS NOT NULL;
        """)
        first_launch = int(cursor.fetchone()[0])

        # Most Used Rocket
        cursor.execute("""
            SELECT rocket
            FROM space_missions
            GROUP BY rocket
            ORDER BY COUNT(*) DESC
            LIMIT 1;
        """)
        most_used_rocket = cursor.fetchone()[0]

        # Top Launch Company
        cursor.execute("""
            SELECT company
            FROM space_missions
            GROUP BY company
            ORDER BY COUNT(*) DESC
            LIMIT 1;
        """)
        top_company = cursor.fetchone()[0]

        # Most Active Launch Site
        cursor.execute("""
            SELECT location
            FROM space_missions
            GROUP BY location
            ORDER BY COUNT(*) DESC
            LIMIT 1;
        """)
        top_location = cursor.fetchone()[0]

        cursor.close()
        conn.close()

        return {
            "total_missions": total_missions,
            "first_launch": first_launch,
            "most_used_rocket": most_used_rocket,
            "top_company": top_company,
            "top_location": top_location
        }

    except Exception as e:
        return {"error": str(e)}

@app.get("/api/launch-insights")
def get_launch_insights():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Peak launch year
        cursor.execute("""
            SELECT DATE_PART('year', launch_date) AS year, COUNT(*) AS count
            FROM space_missions
            WHERE launch_date IS NOT NULL
            GROUP BY year
            ORDER BY count DESC
            LIMIT 1;
        """)
        peak_year, peak_count = cursor.fetchone()

        # Country with highest failure rate
        cursor.execute("""
            SELECT
                CASE
                    WHEN location ILIKE '%USA%' THEN 'United States'
                    WHEN location ILIKE '%Russia%' THEN 'Russia'
                    WHEN location ILIKE '%China%' THEN 'China'
                    WHEN location ILIKE '%Japan%' THEN 'Japan'
                    WHEN location ILIKE '%India%' THEN 'India'
                    WHEN location ILIKE '%France%' OR location ILIKE '%Guiana%' THEN 'France'
                    WHEN location ILIKE '%New Zealand%' THEN 'New Zealand'
                    WHEN location ILIKE '%Iran%' THEN 'Iran'
                    WHEN location ILIKE '%South Korea%' THEN 'South Korea'
                    WHEN location ILIKE '%North Korea%' THEN 'North Korea'
                    WHEN location ILIKE '%Kenya%' THEN 'Kenya'
                    WHEN location ILIKE '%Brazil%' THEN 'Brazil'
                    ELSE 'Other'
                END AS country,
                COUNT(*) AS total,
                SUM(CASE WHEN mission_status = 'Failure' THEN 1 ELSE 0 END) AS failures,
                ROUND(SUM(CASE WHEN mission_status = 'Failure' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS fail_rate
            FROM space_missions
            GROUP BY country
            HAVING COUNT(*) > 10
            ORDER BY fail_rate DESC
            LIMIT 1;
        """)
        country, total, failures, fail_rate = cursor.fetchone()

        # Most used rocket again (reusing logic)
        cursor.execute("""
            SELECT rocket
            FROM space_missions
            GROUP BY rocket
            ORDER BY COUNT(*) DESC
            LIMIT 1;
        """)
        top_rocket = cursor.fetchone()[0]

        cursor.close()
        conn.close()

        return [
            f"📈 Launch activity peaked in {int(peak_year)} with {peak_count} missions.",
            f"🧨 {country} has the highest failure rate at {fail_rate}%.",
            f"🚀 {top_rocket} is the most used rocket in history."
        ]
    except Exception as e:
        return {"error": str(e)}

# 🚀 NEW: Search endpoint
@app.get("/api/search")
def search(q: str):
    # Example static data (for testing) — replace with real DB queries later!
    return [
        {"title": f"Search result for '{q}' - 1", "link": "/result1"},
        {"title": f"Search result for '{q}' - 2", "link": "/result2"},
        {"title": f"Search result for '{q}' - 3", "link": "/result3"}
    ]

# Load model and features
MODEL_PATH = os.path.join(os.path.dirname(__file__), "mission_success_model.pkl")
FEATURES_PATH = os.path.join(os.path.dirname(__file__), "feature_names.pkl")

model = joblib.load(MODEL_PATH)
feature_names = joblib.load(FEATURES_PATH)

@app.post("/api/predict-mission-success")
async def predict_mission_success(request: Request):
    try:
        user_input = await request.json()

        # Convert input to DataFrame
        input_df = pd.DataFrame([user_input])
        input_df = pd.get_dummies(input_df)

        # Ensure it matches model features
        for col in feature_names:
            if col not in input_df.columns:
                input_df[col] = 0  # add missing columns

        input_df = input_df[feature_names]  # ensure correct column order

        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0][1]

        return {
            "prediction": "Success" if prediction == 1 else "Failure",
            "probability": round(probability * 100, 2)
        }

    except Exception as e:
        return {"error": str(e)}
    
    # 🚀 Autocomplete Support Endpoints for PredictForm.jsx
@app.get("/api/options/rockets")
def get_rocket_names():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT rocket FROM space_missions WHERE rocket IS NOT NULL ORDER BY rocket;")
        rockets = [row[0] for row in cursor.fetchall()]
        cursor.close()
        conn.close()
        return rockets
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/options/companies")
def get_companies():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT company FROM space_missions WHERE company IS NOT NULL ORDER BY company;")
        companies = [row[0] for row in cursor.fetchall()]
        cursor.close()
        conn.close()
        return companies
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/options/locations")
def get_locations():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT location FROM space_missions WHERE location IS NOT NULL ORDER BY location;")
        locations = [row[0] for row in cursor.fetchall()]
        cursor.close()
        conn.close()
        return locations
    except Exception as e:
        return {"error": str(e)}
    
@app.get("/api/distinct-values")
def get_distinct_values():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Get distinct rocket names
        cursor.execute("SELECT DISTINCT rocket FROM space_missions ORDER BY rocket;")
        rockets = [row[0] for row in cursor.fetchall()]

        # Get distinct company names
        cursor.execute("SELECT DISTINCT company FROM space_missions ORDER BY company;")
        companies = [row[0] for row in cursor.fetchall()]

        # Get simplified launch locations
        cursor.execute("""
            SELECT DISTINCT
              CASE
                WHEN location ILIKE '%Baikonur%' THEN 'Baikonur Cosmodrome, Kazakhstan'
                WHEN location ILIKE '%Cape Canaveral%' THEN 'Cape Canaveral, USA'
                WHEN location ILIKE '%Kennedy Space Center%' THEN 'Kennedy Space Center, USA'
                WHEN location ILIKE '%Vostochny%' THEN 'Vostochny Cosmodrome, Russia'
                WHEN location ILIKE '%Tanegashima%' THEN 'Tanegashima Space Center, Japan'
                WHEN location ILIKE '%Satish Dhawan%' THEN 'Satish Dhawan Space Center, India'
                WHEN location ILIKE '%Wallops%' THEN 'Wallops Flight Facility, USA'
                WHEN location ILIKE '%Jiuquan%' THEN 'Jiuquan Satellite Launch Center, China'
                WHEN location ILIKE '%Guiana%' THEN 'Guiana Space Centre, France'
                WHEN location ILIKE '%Kourou%' THEN 'Guiana Space Centre, France'
                WHEN location ILIKE '%Blue Origin Launch Site%' THEN 'Blue Origin Launch Site, Texas, USA'
                ELSE location
              END AS simplified_location
            FROM space_missions
            WHERE location IS NOT NULL
            ORDER BY simplified_location;
        """)
        locations = [row[0] for row in cursor.fetchall()]

        cursor.close()
        conn.close()

        return {
            "rockets": rockets,
            "companies": companies,
            "locations": locations
        }

    except Exception as e:
        return {"error": str(e)}

@app.get("/api/mission-options")
def get_mission_options():
    return {
        "rockets": sorted(VALID_ROCKETS),
        "companies": sorted(VALID_COMPANIES),
        "locations": sorted(VALID_LOCATIONS)
    }

@app.get("/api/Rocket-Status-BarChart")
def get_heatmap_data():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        query = """
        SELECT rocket_status, mission_status, COUNT(*) AS count
        FROM space_missions
        GROUP BY rocket_status, mission_status
        ORDER BY rocket_status, mission_status;
        """

        cursor.execute(query)
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        return rows

    except Exception as e:
        return {"error": str(e)}

@app.get("/api/missions")
def get_filtered_missions(
    start_year: int = Query(1957),
    end_year: int = Query(2023),
    rocket: Optional[str] = Query(None),
    company: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        query = """
            SELECT mission, rocket, company, location, mission_status, launch_date
            FROM space_missions
            WHERE EXTRACT(YEAR FROM launch_date) BETWEEN %s AND %s
        """
        params = [start_year, end_year]

        if rocket:
            query += " AND rocket = %s"
            params.append(rocket)

        if company:
            query += " AND company = %s"
            params.append(company)

        if status:
            query += " AND mission_status = %s"
            params.append(status)

        if search:
            query += " AND LOWER(mission) LIKE %s"
            params.append(f"%{search.lower()}%")

        query += " ORDER BY launch_date DESC LIMIT 200"

        cursor.execute(query, tuple(params))
        results = cursor.fetchall()

        cursor.close()
        conn.close()
        return results

    except Exception as e:
        return {"error": str(e)}
    
@app.get("/api/heatmap-data")
def get_heatmap_data():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        query = """
        SELECT rocket_status, mission_status, COUNT(*) AS count
        FROM space_missions
        GROUP BY rocket_status, mission_status
        ORDER BY rocket_status, mission_status;
        """

        cursor.execute(query)
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        return rows

    except Exception as e:
        return {"error": str(e)}

from fastapi import Query

@app.get("/api/dashboard-summary")
def dashboard_summary(
    start_year: int = Query(1957),
    end_year: int = Query(2023),
    status: Optional[str] = Query(None),
    country: Optional[str] = Query(None)
):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        # Common WHERE clauses
        where_clauses = ["EXTRACT(YEAR FROM launch_date) BETWEEN %s AND %s"]
        params = [start_year, end_year]

        if status and status != "All":
            where_clauses.append("mission_status = %s")
            params.append(status)

        if country and country != "All":
            where_clauses.append("""
                (CASE
                    WHEN location ILIKE '%USA%' THEN 'United States'
                    WHEN location ILIKE '%Russia%' THEN 'Russia'
                    WHEN location ILIKE '%China%' THEN 'China'
                    WHEN location ILIKE '%Japan%' THEN 'Japan'
                    WHEN location ILIKE '%India%' THEN 'India'
                    WHEN location ILIKE '%France%' OR location ILIKE '%Guiana%' THEN 'France'
                    WHEN location ILIKE '%New Zealand%' THEN 'New Zealand'
                    WHEN location ILIKE '%Iran%' THEN 'Iran'
                    WHEN location ILIKE '%South Korea%' THEN 'South Korea'
                    WHEN location ILIKE '%North Korea%' THEN 'North Korea'
                    WHEN location ILIKE '%Kenya%' THEN 'Kenya'
                    WHEN location ILIKE '%Brazil%' THEN 'Brazil'
                    ELSE 'Other'
                END) = %s
            """)
            params.append(country)

        where_sql = " AND ".join(where_clauses)

        # Total Missions
        cursor.execute(f"SELECT COUNT(*) FROM space_missions WHERE {where_sql}", tuple(params))
        total_missions = cursor.fetchone()["count"]

        # First Launch
        cursor.execute(f"SELECT MIN(EXTRACT(YEAR FROM launch_date)) AS first_launch FROM space_missions WHERE {where_sql}", tuple(params))
        row = cursor.fetchone()
        first_launch = int(row["first_launch"]) if row and row["first_launch"] else None
        
        # Most Used Rocket
        cursor.execute(f"""
            SELECT rocket
            FROM space_missions
            WHERE {where_sql}
            GROUP BY rocket
            ORDER BY COUNT(*) DESC
            LIMIT 1
        """, tuple(params))
        row = cursor.fetchone()
        most_used_rocket = row["rocket"] if row else None

        # Top Company
        cursor.execute(f"""
            SELECT company
            FROM space_missions
            WHERE {where_sql}
            GROUP BY company
            ORDER BY COUNT(*) DESC
            LIMIT 1
        """, tuple(params))
        row = cursor.fetchone()
        top_company = row["company"] if row else None

        # Top Location
        cursor.execute(f"""
            SELECT location
            FROM space_missions
            WHERE {where_sql}
            GROUP BY location
            ORDER BY COUNT(*) DESC
            LIMIT 1
        """, tuple(params))
        row = cursor.fetchone()
        top_location = row["location"] if row else None

        # Mission Status Counts
        cursor.execute(f"""
            SELECT mission_status, COUNT(*) AS count
            FROM space_missions
            WHERE {where_sql}
            GROUP BY mission_status
            ORDER BY count DESC
        """, tuple(params))
        mission_status_counts = cursor.fetchall()

        # Top Companies
        cursor.execute(f"""
            SELECT company, COUNT(*) AS mission_count
            FROM space_missions
            WHERE {where_sql}
            GROUP BY company
            ORDER BY mission_count DESC
            LIMIT 10
        """, tuple(params))
        top_companies = cursor.fetchall()

        # Top Launch Locations
        cursor.execute(f"""
            SELECT location, COUNT(*) AS count
            FROM space_missions
            WHERE {where_sql}
            GROUP BY location
            ORDER BY count DESC
            LIMIT 10
        """, tuple(params))
        top_launch_locations = cursor.fetchall()

        # Launches per Year
        cursor.execute(f"""
            SELECT EXTRACT(YEAR FROM launch_date) AS year, COUNT(*) AS count
            FROM space_missions
            WHERE {where_sql}
            GROUP BY year
            ORDER BY year
        """, tuple(params))
        launches_per_year = cursor.fetchall()

        # Top Rocket Types
        cursor.execute(f"""
            SELECT rocket, COUNT(*) AS count
            FROM space_missions
            WHERE {where_sql}
            GROUP BY rocket
            ORDER BY count DESC
            LIMIT 10
        """, tuple(params))
        top_rocket_types = cursor.fetchall()

        # Launch Outcomes
        cursor.execute(f"""
            SELECT mission_status AS outcome, COUNT(*) AS count
            FROM space_missions
            WHERE {where_sql}
            GROUP BY mission_status
            ORDER BY count DESC
        """, tuple(params))
        launch_outcomes = cursor.fetchall()

        # Insights (example: re-run the insights query or re-use if you prefer)
        insights = [
            f"📈 {total_missions} launches between {start_year} and {end_year}.",
            f"🚀 Most used rocket: {most_used_rocket or 'N/A'}.",
            f"🏢 Top company: {top_company or 'N/A'}."
        ]

        cursor.close()
        conn.close()

        return {
            "total_missions": total_missions,
            "first_launch": first_launch,
            "most_used_rocket": most_used_rocket,
            "top_company": top_company,
            "top_location": top_location,
            "mission_status_counts": mission_status_counts,
            "top_companies": top_companies,
            "top_launch_locations": top_launch_locations,
            "launches_per_year": launches_per_year,
            "top_rocket_types": top_rocket_types,
            "launch_outcomes": launch_outcomes,
            "insights": insights
        }

    except Exception as e:
        return {"error": str(e)}
