import React, { useState } from "react";
import { uploadIncident } from "../services/api";

export default function UploadForm({ onUploadSuccess }) {
  const [image, setImage] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [locationName, setLocationName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleLocationInput = async (value) => {
    setLocationSearch(value);
    setLocationName("");
    if (value.length < 3) { setSuggestions([]); return; }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5&countrycodes=in&viewbox=77.4,12.8,77.8,13.2&bounded=1`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (place) => {
    setLatitude(place.lat);
    setLongitude(place.lon);
    setLocationName(place.display_name.split(",").slice(0, 3).join(","));
    setLocationSearch(place.display_name.split(",").slice(0, 2).join(","));
    setSuggestions([]);
  };

  const handleAutoDetect = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        setLocationName("Current Location");
        setLocationSearch("Current Location");
        setSuggestions([]);
      },
      () => alert("Could not get location. Please allow location access.")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // ← THIS was missing, causing page reload
    
    if (!image || !latitude || !longitude) {
      setError("Please select an image and set a location.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await uploadIncident(image, latitude, longitude);

      // res is the full response: { status, message, data }
      if (res.status === "error") {
        setError(res.message || "Could not analyze image.");
        setLoading(false);
        return;
      }

      if (res.status === "success") {
        setResult(res.data); // res.data has severity, confidence, etc.
        if (onUploadSuccess) onUploadSuccess();
      }
    } catch (err) {
      setError("Upload failed. Please check your connection and try again.");
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

        <div style={{ marginBottom: "10px", position: "relative" }}>
          <label>Location:</label><br />
          <div style={{ display: "flex", gap: "8px", marginTop: "5px" }}>
            <input
              type="text"
              placeholder="Type a location in Bengaluru..."
              value={locationSearch}
              onChange={(e) => handleLocationInput(e.target.value)}
              style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
            <button type="button" onClick={handleAutoDetect}
              style={{ padding: "6px 12px", background: "#38a169", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", whiteSpace: "nowrap" }}>
              📍 My Location
            </button>
          </div>

          {suggestions.length > 0 && (
            <div style={{
              position: "absolute", zIndex: 1000, background: "white",
              border: "1px solid #ccc", borderRadius: "4px", width: "100%",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)", maxHeight: "200px", overflowY: "auto"
            }}>
              {suggestions.map((place, i) => (
                <div key={i}
                  onClick={() => handleSelectSuggestion(place)}
                  style={{ padding: "10px", cursor: "pointer", borderBottom: "1px solid #eee", fontSize: "13px" }}
                  onMouseEnter={(e) => e.target.style.background = "#f0f4ff"}
                  onMouseLeave={(e) => e.target.style.background = "white"}
                >
                  📍 {place.display_name.split(",").slice(0, 3).join(",")}
                </div>
              ))}
            </div>
          )}

          {latitude && longitude && (
            <p style={{ fontSize: "12px", color: "green", marginTop: "5px" }}>
              ✅ Location set: {locationName}
            </p>
          )}
        </div>

        <button type="submit" disabled={loading}
          style={{ padding: "8px 20px", background: loading ? "#999" : "#e53e3e", color: "white", border: "none", borderRadius: "4px", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "⏳ Analyzing with AI..." : "🚨 Submit Report"}
        </button>
      </form>

      {/* ERROR MESSAGE */}
      {error && (
        <div style={{
          marginTop: "15px", padding: "12px", background: "#fff5f5",
          border: "1px solid #feb2b2", borderRadius: "8px", color: "#c53030"
        }}>
          {error}
        </div>
      )}

      {/* SUCCESS RESULT */}
      {result && (
        <div style={{ marginTop: "15px", padding: "16px", background: "#f0fff4", border: "1px solid #68d391", borderRadius: "8px" }}>
          <p style={{ fontWeight: "700", color: "#276749", marginBottom: "8px" }}>✅ Pothole Reported Successfully!</p>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
            <div style={{ background: "white", padding: "8px", borderRadius: "6px", textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: "#666" }}>Severity</div>
              <div style={{ fontWeight: "700", color: result.severity === "CRITICAL" ? "#e53e3e" : result.severity === "HIGH" ? "#dd6b20" : "#d69e2e" }}>
                {result.severity}
              </div>
            </div>
            <div style={{ background: "white", padding: "8px", borderRadius: "6px", textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: "#666" }}>Confidence</div>
              <div style={{ fontWeight: "700", color: "#2b6cb0" }}>{result.confidence}%</div>
            </div>
            <div style={{ background: "white", padding: "8px", borderRadius: "6px", textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: "#666" }}>Size</div>
              <div style={{ fontWeight: "700" }}>{result.size_estimate}</div>
            </div>
            <div style={{ background: "white", padding: "8px", borderRadius: "6px", textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: "#666" }}>Risk</div>
              <div style={{ fontWeight: "700", color: "#c05621" }}>{result.risk_level}</div>
            </div>
          </div>

          {result.description && (
            <p style={{ fontSize: "13px", color: "#4a5568", marginBottom: "12px", fontStyle: "italic" }}>
              "{result.description}"
            </p>
          )}

          <div style={{ borderTop: "1px solid #c6f6d5", paddingTop: "10px" }}>
            <p style={{ fontSize: "13px", margin: "4px 0" }}>💸 Vehicle damage/day: <strong>₹{Number(result.vehicle_damage_cost_per_day || 0).toLocaleString()}</strong></p>
            <p style={{ fontSize: "13px", margin: "4px 0" }}>🔧 Repair cost: <strong>₹{Number(result.repair_cost || 0).toLocaleString()}</strong></p>
            <p style={{ fontSize: "13px", margin: "4px 0" }}>💰 Monthly savings if fixed: <strong>₹{Number(result.monthly_savings_if_fixed || 0).toLocaleString()}</strong></p>
          </div>

          <p style={{ fontSize: "11px", color: "#999", marginTop: "8px" }}>ID: {result.incident_id}</p>
        </div>
      )}
    </div>
  );
}