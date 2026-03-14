import React, { useEffect, useState } from "react";
import { getPotholes } from "../services/api";

const repairCost = { CRITICAL: 50000, HIGH: 25000, MEDIUM: 10000, LOW: 5000, critical: 50000, high: 25000, medium: 10000, low: 5000 };
const dailyDamage = { CRITICAL: 15000, HIGH: 8000, MEDIUM: 3000, LOW: 1000, critical: 15000, high: 8000, medium: 3000, low: 1000 };

export default function ROICalculator() {
  const [incidents, setIncidents] = useState([]);
  const [days, setDays] = useState(30);

  useEffect(() => {
    getPotholes().then((res) => {
      const real = res.status === "success" ? res.data : [];
      const mock = [
        { incident_id: "m1", severity: "CRITICAL", status: "reported", description: "Silk Board" },
        { incident_id: "m2", severity: "HIGH", status: "reported", description: "ORR" },
        { incident_id: "m3", severity: "MEDIUM", status: "reported", description: "Marathahalli" },
      ];
      setIncidents([...real, ...mock]);
    });
  }, []);

  const totalRepairCost = incidents.reduce((sum, p) => sum + (repairCost[p.severity] || 5000), 0);
  const totalDailyDamage = incidents.reduce((sum, p) => sum + (dailyDamage[p.severity] || 1000), 0);
  const totalLossIfIgnored = totalDailyDamage * days;
  const savings = totalLossIfIgnored - totalRepairCost;
  const roi = totalRepairCost > 0 ? Math.round((savings / totalRepairCost) * 100) : 0;
  const rupeesPerRupee = totalRepairCost > 0 ? Math.round(savings / totalRepairCost) : 0;

  const fmt = (n) => "₹" + Math.abs(n).toLocaleString("en-IN");

  const severityColor = { CRITICAL: "#ef4444", HIGH: "#f97316", MEDIUM: "#eab308", LOW: "#22c55e", critical: "#ef4444", high: "#f97316", medium: "#eab308", low: "#22c55e" };

  return (
    <div>
      <h2 style={{ marginBottom: "4px" }}>💰 Repair ROI Calculator</h2>
      <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>
        How much does BBMP save by fixing potholes now vs ignoring them?
      </p>

      {/* Days slider */}
      <div style={{ marginBottom: "20px", background: "#f8fafc", padding: "16px", borderRadius: "10px" }}>
        <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>
          If ignored for: <span style={{ color: "#3b82f6", fontSize: "16px" }}>{days} days</span>
        </label>
        <input type="range" min="1" max="365" value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          style={{ width: "100%", marginTop: "8px", accentColor: "#3b82f6" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#94a3b8" }}>
          <span>1 day</span><span>6 months</span><span>1 year</span>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
        <div style={{ background: "#eff6ff", borderRadius: "10px", padding: "16px", borderLeft: "4px solid #3b82f6" }}>
          <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Cost to Fix ALL Now</div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: "#1d4ed8" }}>{fmt(totalRepairCost)}</div>
        </div>
        <div style={{ background: "#fef2f2", borderRadius: "10px", padding: "16px", borderLeft: "4px solid #ef4444" }}>
          <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Loss if Ignored ({days}d)</div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: "#dc2626" }}>{fmt(totalLossIfIgnored)}</div>
        </div>
        <div style={{ background: "#f0fdf4", borderRadius: "10px", padding: "16px", borderLeft: "4px solid #22c55e" }}>
          <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Net Savings if Fixed</div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: "#16a34a" }}>{fmt(savings)}</div>
        </div>
        <div style={{ background: "#fefce8", borderRadius: "10px", padding: "16px", borderLeft: "4px solid #eab308" }}>
          <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>ROI of Fixing</div>
          <div style={{ fontSize: "22px", fontWeight: "700", color: "#ca8a04" }}>{roi}% 🔥</div>
        </div>
      </div>

      {/* Key insight */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f, #1e40af)", borderRadius: "10px", padding: "16px", marginBottom: "20px", color: "white" }}>
        <div style={{ fontSize: "13px", opacity: 0.8, marginBottom: "4px" }}>💡 Key Insight for BBMP</div>
        <div style={{ fontSize: "16px", fontWeight: "600" }}>
          Every ₹1 spent on repairs saves ₹{rupeesPerRupee} in vehicle damage over {days} days
        </div>
      </div>

      {/* Per pothole breakdown */}
      <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", color: "#374151" }}>Per Pothole Breakdown</h3>
      <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%", fontSize: "13px" }}>
        <thead style={{ background: "#f1f5f9" }}>
          <tr>
            <th>Severity</th>
            <th>Repair Cost</th>
            <th>Daily Damage</th>
            <th>Loss in {days}d</th>
            <th>ROI</th>
          </tr>
        </thead>
        <tbody>
          {incidents.slice(0, 8).map((p, i) => {
            const rc = repairCost[p.severity] || 5000;
            const dd = dailyDamage[p.severity] || 1000;
            const loss = dd * days;
            const r = Math.round(((loss - rc) / rc) * 100);
            return (
              <tr key={p.incident_id}>
                <td style={{ color: severityColor[p.severity], fontWeight: "600" }}>{p.severity}</td>
                <td>{fmt(rc)}</td>
                <td>{fmt(dd)}/day</td>
                <td style={{ color: "#dc2626" }}>{fmt(loss)}</td>
                <td style={{ color: "#16a34a", fontWeight: "600" }}>{r}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}