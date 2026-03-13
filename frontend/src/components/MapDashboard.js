import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { getPotholes, getComplaint } from "../services/api";
import "leaflet/dist/leaflet.css";

const severityColor = {
  CRITICAL: "red", critical: "red",
  HIGH: "orange", high: "orange",
  MEDIUM: "gold", medium: "gold",
  LOW: "green", low: "green"
};

const mockData = [
  { incident_id: "mock-1", latitude: "12.9172", longitude: "77.6101", severity: "CRITICAL", status: "reported", description: "Large pothole at Silk Board", timestamp: new Date().toISOString() },
  { incident_id: "mock-2", latitude: "12.9352", longitude: "77.6245", severity: "HIGH", status: "reported", description: "Multiple potholes on ORR", timestamp: new Date().toISOString() },
  { incident_id: "mock-3", latitude: "12.9592", longitude: "77.6974", severity: "MEDIUM", status: "reported", description: "Road surface damage", timestamp: new Date().toISOString() },
  { incident_id: "mock-4", latitude: "12.9698", longitude: "77.7499", severity: "HIGH", status: "reported", description: "Pothole near Marathahalli", timestamp: new Date().toISOString() },
  { incident_id: "mock-5", latitude: "12.9082", longitude: "77.5994", severity: "LOW", status: "resolved", description: "Minor surface crack", timestamp: new Date().toISOString() }
];

export default function MapDashboard() {
  const [potholes, setPotholes] = useState([]);
  const [complaints, setComplaints] = useState({});
  const [loadingComplaint, setLoadingComplaint] = useState({});

  useEffect(() => {
    getPotholes().then((res) => {
      const real = res.status === "success" ? res.data : [];
      setPotholes([...real, ...mockData]);
    }).catch(() => setPotholes(mockData));
  }, []);

  const handleGenerateComplaint = async (incidentId) => {
    // skip mock data
    if (incidentId.startsWith("mock")) {
      setComplaints(prev => ({ ...prev, [incidentId]: "This is a demo incident. Upload a real pothole to generate a complaint." }));
      return;
    }
    setLoadingComplaint(prev => ({ ...prev, [incidentId]: true }));
    try {
      const res = await getComplaint(incidentId);
      if (res.status === "success") {
        setComplaints(prev => ({ ...prev, [incidentId]: res.data.complaint }));
      } else {
        setComplaints(prev => ({ ...prev, [incidentId]: "Failed to generate complaint." }));
      }
    } catch {
      setComplaints(prev => ({ ...prev, [incidentId]: "Error generating complaint." }));
    }
    setLoadingComplaint(prev => ({ ...prev, [incidentId]: false }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🗺️ Live Pothole Map — Bengaluru</h2>
      <div style={{ marginBottom: "10px" }}>
        <span style={{ marginRight: "15px" }}>🔴 Critical</span>
        <span style={{ marginRight: "15px" }}>🟠 High</span>
        <span style={{ marginRight: "15px" }}>🟡 Medium</span>
        <span>🟢 Low</span>
      </div>
      <div style={{ height: "500px", width: "100%" }}>
        <MapContainer
          center={[12.9352, 77.6245]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          {potholes.map((p) => (
            <CircleMarker
              key={p.incident_id}
              center={[parseFloat(p.latitude), parseFloat(p.longitude)]}
              radius={12}
              fillColor={severityColor[p.severity] || "gold"}
              color="#333"
              weight={1}
              fillOpacity={0.85}
            >
              <Popup minWidth={250}>
                <strong>Severity: {p.severity}</strong><br />
                Status: {p.status}<br />
                {p.description && <><em>{p.description}</em><br /></>}
                {new Date(p.timestamp).toLocaleString()}<br /><br />

                {!complaints[p.incident_id] ? (
                  <button
                    onClick={() => handleGenerateComplaint(p.incident_id)}
                    disabled={loadingComplaint[p.incident_id]}
                    style={{
                      background: "#e53e3e",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      width: "100%"
                    }}
                  >
                    {loadingComplaint[p.incident_id] ? "Generating..." : "📋 Generate BBMP Complaint"}
                  </button>
                ) : (
                  <div style={{ marginTop: "8px" }}>
                    <div style={{
                      background: "#f0fff4",
                      border: "1px solid #68d391",
                      borderRadius: "4px",
                      padding: "8px",
                      fontSize: "12px",
                      maxHeight: "120px",
                      overflowY: "auto"
                    }}>
                      {complaints[p.incident_id]}
                    </div>
                    <p style={{ color: "green", fontSize: "12px", marginTop: "4px" }}>✅ Complaint Sent</p>
                  </div>
                )}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
