import React, { useEffect, useState } from "react";
import { getPotholes } from "../services/api";
import { getWard } from "../services/wardService";

const severityScore = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1, critical: 4, high: 3, medium: 2, low: 1 };
const repairCost = { CRITICAL: 50000, HIGH: 25000, MEDIUM: 10000, LOW: 5000, critical: 50000, high: 25000, medium: 10000, low: 5000 };
const trafficDensity = { CRITICAL: 3, HIGH: 2.5, MEDIUM: 2, LOW: 1 };

export default function PriorityList() {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    getPotholes().then((res) => {
      const data = res.status === "success" ? res.data : [];
      const mockData = [
        { incident_id: "mock-1", latitude: "12.9172", longitude: "77.6101", severity: "CRITICAL", status: "reported", report_count: 3 },
        { incident_id: "mock-2", latitude: "12.9352", longitude: "77.6245", severity: "HIGH", status: "reported", report_count: 2 },
        { incident_id: "mock-3", latitude: "12.9592", longitude: "77.6974", severity: "MEDIUM", status: "reported", report_count: 1 },
      ];

        const all = [...data].map((p) => {
        const sev = severityScore[p.severity] || 1;
        const count = parseInt(p.report_count) || 1;
        const traffic = trafficDensity[p.severity] || 1;
        const cost = repairCost[p.severity] || 10000;
        const priority = Math.round((sev * count * traffic * 1000) / cost);
        const ward = getWard(parseFloat(p.latitude), parseFloat(p.longitude));
        return { ...p, priority, ward: ward.ward, wardNo: ward.wardNo };
      });

      const sorted = all.sort((a, b) => b.priority - a.priority).slice(0, 8);
      setIncidents(sorted);
    });
  }, []);

  const severityColor = { CRITICAL: "red", HIGH: "orange", MEDIUM: "goldenrod", LOW: "green", critical: "red", high: "orange", medium: "goldenrod", low: "green" };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔧 BBMP Repair Priority List</h2>
      <p style={{ fontSize: "13px", color: "#666" }}>
        Priority = (Severity × Reports × Traffic) / Repair Cost — higher score = fix first
      </p>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead style={{ background: "#ebf8ff" }}>
          <tr>
            <th>#</th>
            <th>Ward</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Priority Score</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((p, i) => (
            <tr key={p.incident_id} style={{ background: i === 0 ? "#fff5f5" : "white" }}>
              <td>{i + 1}</td>
              <td><strong>{p.ward}</strong> (Ward {p.wardNo})</td>
              <td style={{ color: severityColor[p.severity] }}>
                <strong>{p.severity}</strong>
              </td>
              <td>{p.status}</td>
              <td>
                <strong style={{ color: p.priority > 5 ? "red" : "orange" }}>
                  {p.priority}
                </strong>
              </td>
              <td>
                {p.priority > 5
                  ? "🚨 Immediate"
                  : p.priority > 2
                  ? "⚠️ This Week"
                  : "📅 Scheduled"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
