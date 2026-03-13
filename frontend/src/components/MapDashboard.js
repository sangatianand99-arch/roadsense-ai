import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { getPotholes } from "../services/api";
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

  useEffect(() => {
    getPotholes().then((res) => {
      const real = res.status === "success" ? res.data : [];
      setPotholes([...real, ...mockData]);
    }).catch(() => setPotholes(mockData));
  }, []);

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
              <Popup>
                <strong>Severity: {p.severity}</strong><br />
                Status: {p.status}<br />
                {p.description && <><em>{p.description}</em><br /></>}
                {new Date(p.timestamp).toLocaleString()}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}