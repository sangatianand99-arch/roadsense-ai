import React, { useEffect, useState } from "react";
import { getStats } from "../services/api";

export default function StatsPanel() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then((res) => {
      if (res.status === "success") setStats(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading stats...</p>;
  if (!stats) return <p>No stats available</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Incident Stats</h2>
      <p>Total Incidents: <strong>{stats.total_incidents}</strong></p>
      <h4>By Severity:</h4>
      <ul>
        <li>🟢 Low: {stats.by_severity.low}</li>
        <li>🟡 Medium: {stats.by_severity.medium}</li>
        <li>🔴 High: {stats.by_severity.high}</li>
      </ul>
      <h4>By Status:</h4>
      <ul>
        <li>📌 Reported: {stats.by_status.reported}</li>
        <li>✅ Resolved: {stats.by_status.resolved}</li>
      </ul>
    </div>
  );
}