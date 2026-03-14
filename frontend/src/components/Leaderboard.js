import React, { useEffect, useState } from "react";
import { getPotholes } from "../services/api";

const ZONES = {
  "Silk Board": { lat: 12.9172, lng: 77.6101 },
  "Outer Ring Road": { lat: 12.9352, lng: 77.6245 },
  "Marathahalli": { lat: 12.9698, lng: 77.7499 },
  "Hebbal": { lat: 13.0358, lng: 77.5970 },
  "Whitefield": { lat: 12.9698, lng: 77.7499 },
  "KR Puram": { lat: 12.9592, lng: 77.6974 },
};

const severityScore = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1, critical: 4, high: 3, medium: 2, low: 1 };

function getZone(lat, lng) {
  let closest = "Unknown";
  let minDist = Infinity;
  for (const [name, coords] of Object.entries(ZONES)) {
    const dist = Math.sqrt(Math.pow(lat - coords.lat, 2) + Math.pow(lng - coords.lng, 2));
    if (dist < minDist) { minDist = dist; closest = name; }
  }
  return closest;
}

export default function Leaderboard() {
  const [zones, setZones] = useState([]);

  useEffect(() => {
    getPotholes().then((res) => {
      const incidents = res.status === "success" ? res.data : [];

      // add mock incidents too
      const mockIncidents = [
        { latitude: "12.9172", longitude: "77.6101", severity: "CRITICAL" },
        { latitude: "12.9352", longitude: "77.6245", severity: "HIGH" },
        { latitude: "12.9592", longitude: "77.6974", severity: "MEDIUM" },
        { latitude: "12.9698", longitude: "77.7499", severity: "HIGH" },
        { latitude: "12.9082", longitude: "77.5994", severity: "LOW" },
      ];

      const all = [...incidents];
      const zoneMap = {};

      all.forEach((p) => {
        const zone = getZone(parseFloat(p.latitude), parseFloat(p.longitude));
        if (!zoneMap[zone]) zoneMap[zone] = { name: zone, count: 0, score: 0, critical: 0 };
        zoneMap[zone].count += 1;
        zoneMap[zone].score += severityScore[p.severity] || 1;
        if (p.severity === "CRITICAL" || p.severity === "critical") zoneMap[zone].critical += 1;
      });

      const sorted = Object.values(zoneMap).sort((a, b) => b.score - a.score).slice(0, 5);
      setZones(sorted);
    });
  }, []);

  const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

  return (
    <div style={{ padding: "20px" }}>
      <h2>🏆 Worst Zones Leaderboard</h2>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead style={{ background: "#fee2e2" }}>
          <tr>
            <th>Rank</th>
            <th>Zone</th>
            <th>Total Potholes</th>
            <th>Critical</th>
            <th>Risk Score</th>
          </tr>
        </thead>
        <tbody>
          {zones.map((z, i) => (
            <tr key={z.name} style={{ background: i === 0 ? "#fff5f5" : "white" }}>
              <td>{medals[i]}</td>
              <td><strong>{z.name}</strong></td>
              <td>{z.count}</td>
              <td style={{ color: "red" }}>{z.critical}</td>
              <td><strong>{z.score}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
