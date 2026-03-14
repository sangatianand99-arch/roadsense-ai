import React, { useEffect, useState } from "react";
import { getStats, getPotholes } from "../services/api";

export default function StatsPanel() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStats(), getPotholes()]).then(([statsRes, potholesRes]) => {
      const s = statsRes.status === "success" ? statsRes.data : null;
      const incidents = potholesRes.status === "success" ? potholesRes.data : [];

      // find worst zone
      const zones = {};
      incidents.forEach(p => {
        const zone = p.latitude > 12.95 ? "Hebbal" : p.latitude > 12.93 ? "ORR" : "Silk Board";
        zones[zone] = (zones[zone] || 0) + 1;
      });
      const worstZone = Object.entries(zones).sort((a, b) => b[1] - a[1])[0]?.[0] || "Silk Board";

      setStats({ ...s, worstZone, complaints_sent: incidents.filter(p => p.complaint_sent).length });
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading stats...</p>;
  if (!stats) return <p>No stats available</p>;

const cards = [
    { label: "Total Incidents", value: stats.total_incidents, color: "#3b82f6", icon: "🕳️" },
    { label: "Critical", value: stats.by_severity?.critical || 0, color: "#ef4444", icon: "🚨" },
    { label: "High Severity", value: stats.by_severity?.high || 0, color: "#f97316", icon: "⚠️" },
    { label: "Resolved", value: stats.by_status?.resolved || 0, color: "#22c55e", icon: "✅" },
    { label: "Complaints Sent", value: stats.complaints_sent || 0, color: "#8b5cf6", icon: "📋" },
    { label: "Worst Zone", value: stats.worstZone, color: "#f59e0b", icon: "📍" },
];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
      {cards.map((card) => (
        <div key={card.label} style={{
          background: "white", borderRadius: "12px", padding: "16px",
          borderLeft: `4px solid ${card.color}`,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
        }}>
          <div style={{ fontSize: "22px", marginBottom: "6px" }}>{card.icon}</div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: card.color }}>{card.value}</div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{card.label}</div>
        </div>
      ))}
    </div>
  );
}
