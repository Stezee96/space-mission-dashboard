from sqlalchemy import create_engine
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
import joblib

# Connect to DB
engine = create_engine('postgresql://space_analysis_db_user:wsohryjH1VouT59Oi4CKREKhcT3BBJW8@dpg-d1kreibe5dus73euh4r0-a.oregon-postgres.render.com:5432/space_analysis_db')
query = "SELECT * FROM space_missions"
df = pd.read_sql(query, engine)

# Preprocess
df = df.dropna(subset=['mission_status', 'rocket', 'company', 'location'])  # ensure clean data
df['mission_status'] = df['mission_status'].apply(lambda x: 1 if x == 'Success' else 0)

# Encode categorical features
df = pd.get_dummies(df, columns=['rocket', 'company', 'location'])

# Select features (drop columns we don't want)
X = df.drop(columns=['id', 'mission', 'price', 'launch_date', 'rocket_status', 'mission_status'], errors='ignore')
y = df['mission_status']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# Save model and feature list
joblib.dump(model, 'mission_success_model.pkl')
joblib.dump(X.columns.tolist(), 'feature_names.pkl')

print("✅ Model trained and saved!")
