import React, { useState } from "react";
import { uploadIncident } from "../services/api";

export default function UploadForm({ onUploadSuccess }) {
  const [image, setImage] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !latitude || !longitude) {
      setError("Please fill all fields");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await uploadIncident(image, latitude, longitude);
      setResult(res);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setError("Upload failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>Report a Pothole</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Image:</label><br />
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Latitude:</label><br />
          <input type="number" step="any" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="e.g. 12.9716" />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Longitude:</label><br />
          <input type="number" step="any" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="e.g. 77.5946" />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Submit Report"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && result.status === "success" && (
  <div style={{ marginTop: "15px", padding: "10px", background: "#e0ffe0", borderRadius: "8px" }}>
    <p>✅ Incident reported!</p>
    <p>Severity: <strong>{result.data.severity}</strong></p>
    <p>Confidence: <strong>{result.data.confidence}%</strong></p>
    <p>Size: <strong>{result.data.size_estimate}</strong></p>
    <p>Description: <em>{result.data.description}</em></p>
    <p style={{fontSize: "12px", color: "#666"}}>ID: {result.data.incident_id}</p>
  </div>
)}
    </div>
  );
}