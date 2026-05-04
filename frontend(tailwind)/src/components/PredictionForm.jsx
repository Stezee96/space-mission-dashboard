import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PredictForm() {
  const [formData, setFormData] = useState({
    rocket: '',
    company: '',
    location: '',
    rocket_status: '',
    mission_status: '',
  });

  const [dropdowns, setDropdowns] = useState({
    rockets: [],
    companies: [],
    locations: [],
  });

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/distinct-values")
        setDropdowns({
          rockets: res.data.rockets || [],
          companies: res.data.companies || [],
          locations: res.data.locations || [],
        });
      } catch (err) {
        console.error("Failed to load dropdown data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDropdowns();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://space-analysis-backend.onrender.com/api/predict-mission-success', formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setResult({ error: 'Prediction failed.' });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-bounce text-4xl">🚀</div>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Loading options...</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🚀 Mission Success Prediction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select name="rocket" value={formData.rocket} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select Rocket</option>
          {dropdowns.rockets.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>

        <select name="company" value={formData.company} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select Company</option>
          {dropdowns.companies.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select name="location" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select Location</option>
          {dropdowns.locations.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>

        <select name="rocket_status" value={formData.rocket_status} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select Rocket Status</option>
          <option value="Active">Active</option>
          <option value="Retired">Retired</option>
          <option value="Unknown">Unknown</option>
        </select>

        <select name="mission_status" value={formData.mission_status} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select Mission Status</option>
          <option value="Success">Success</option>
          <option value="Failure">Failure</option>
          <option value="Partial Failure">Partial Failure</option>
          <option value="Prelaunch Failure">Prelaunch Failure</option>
        </select>

        <button type="submit" className="bg-violet-500 text-white px-4 py-2 rounded">Predict</button>
      </form>

      {result && (
        <div className="mt-4 p-4 border rounded bg-gray-100 dark:bg-gray-700">
          {result.error ? (
            <p className="text-red-500">{result.error}</p>
          ) : (
            <>
              <p><strong>Prediction:</strong> {result.prediction}</p>
              <p><strong>Confidence:</strong> {result.probability.toFixed(2)}%</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default PredictForm;
