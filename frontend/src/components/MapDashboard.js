import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { getPotholes, getComplaint, updateStatus } from "../services/api";
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

const fetchTrafficIncidents = async () => {
  const key = process.env.REACT_APP_TOMTOM_KEY;
  const bbox = "77.4,12.8,77.8,13.2";
  try {
    const res = await fetch(
      `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${key}&bbox=${bbox}&fields={incidents{type,geometry{type,coordinates},properties{iconCategory,magnitudeOfDelay,events{description,code},startTime,endTime,from,to,length,delay,roadNumbers,timeValidity}}}&language=en-GB&categoryFilter=0,1,2,3,4,5,6,7,8,9,10,11&timeValidityFilter=present`
    );
    const data = await res.json();
    return data.incidents || [];
  } catch {
    return [];
  }
};

export default function MapDashboard() {
  const [potholes, setPotholes] = useState([]);
  const [trafficIncidents, setTrafficIncidents] = useState([]);
  const [complaints, setComplaints] = useState({});
  const [loadingComplaint, setLoadingComplaint] = useState({});
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    const load = async () => {
      const [potholesRes, trafficData] = await Promise.all([
        getPotholes(),
        fetchTrafficIncidents()
      ]);
      const real = potholesRes.status === "success" ? potholesRes.data : [];
      setPotholes(real);
      setTrafficIncidents(trafficData);
    };
    load().catch(() => setPotholes(mockData));
  }, []);

  const handleGenerateComplaint = async (incidentId) => {
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

  const handleStatusUpdate = async (incidentId, newStatus) => {
    if (incidentId.startsWith("mock")) return;
    try {
      await updateStatus(incidentId, newStatus);
      setStatuses(prev => ({ ...prev, [incidentId]: newStatus }));
    } catch {
      alert("Failed to update status");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🗺️ Live Pothole Map — Bengaluru</h2>
      <div style={{ marginBottom: "10px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <span>🔴 Critical</span>
        <span>🟠 High</span>
        <span>🟡 Medium</span>
        <span>🟢 Low</span>
        <span>🟣 Traffic Incident</span>
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

          {/* Pothole markers */}
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
                Status: {statuses[p.incident_id] || p.status}<br />
                {p.description && <><em>{p.description}</em><br /></>}
                {new Date(p.timestamp).toLocaleString()}<br /><br />

                {/* Complaint button */}
                {!complaints[p.incident_id] ? (
                  <button
                    onClick={() => handleGenerateComplaint(p.incident_id)}
                    disabled={loadingComplaint[p.incident_id]}
                    style={{
                      background: "#e53e3e", color: "white", border: "none",
                      padding: "6px 12px", borderRadius: "4px", cursor: "pointer", width: "100%"
                    }}
                  >
                    {loadingComplaint[p.incident_id] ? "Generating..." : "📋 Generate BBMP Complaint"}
                  </button>
                ) : (
                  <div style={{ marginTop: "8px" }}>
                    <div style={{
                      background: "#f0fff4", border: "1px solid #68d391",
                      borderRadius: "4px", padding: "8px", fontSize: "12px",
                      maxHeight: "120px", overflowY: "auto"
                    }}>
                      {complaints[p.incident_id]}
                    </div>
                    <p style={{ color: "green", fontSize: "12px", marginTop: "4px" }}>✅ Complaint Sent</p>
                  </div>
                )}

                {/* Status update dropdown */}
                {!p.incident_id.startsWith("mock") && (
                  <div style={{ marginTop: "8px" }}>
                    <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>Update Status:</div>
                    <select
                      value={statuses[p.incident_id] || p.status}
                      onChange={(e) => handleStatusUpdate(p.incident_id, e.target.value)}
                      style={{
                        width: "100%", padding: "4px", borderRadius: "4px",
                        border: "1px solid #e2e8f0", fontSize: "12px", cursor: "pointer"
                      }}
                    >
                      <option value="reported">📌 Reported</option>
                      <option value="under_review">🔍 Under Review</option>
                      <option value="in_progress">🔧 In Progress</option>
                      <option value="fixed">✅ Fixed</option>
                    </select>
                  </div>
                )}
              </Popup>
            </CircleMarker>
          ))}

          {/* TomTom Traffic markers */}
          {trafficIncidents.slice(0, 20).map((incident, i) => {
            const coords = incident.geometry?.coordinates;
            if (!coords) return null;
            const lat = Array.isArray(coords[0]) ? coords[0][1] : coords[1];
            const lng = Array.isArray(coords[0]) ? coords[0][0] : coords[0];
            if (isNaN(lat) || isNaN(lng)) return null;
            return (
              <CircleMarker
                key={`traffic-${i}`}
                center={[lat, lng]}
                radius={8}
                fillColor="#6366f1"
                color="#4f46e5"
                weight={1}
                fillOpacity={0.7}
              >
                <Popup>
                  <strong>🚦 Traffic Incident</strong><br />
                  {incident.properties?.events?.[0]?.description || "Traffic disruption"}<br />
                  {incident.properties?.from && <span>From: {incident.properties.from}<br /></span>}
                  {incident.properties?.to && <span>To: {incident.properties.to}<br /></span>}
                  Delay: {incident.properties?.delay ? `${Math.round(incident.properties.delay / 60)} mins` : "Unknown"}
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
      {trafficIncidents.length > 0 && (
        <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
          🟣 Showing {Math.min(trafficIncidents.length, 20)} live traffic incidents from TomTom
        </p>
      )}
    </div>
  );
}
