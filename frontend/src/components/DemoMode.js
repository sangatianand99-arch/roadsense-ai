import React, { useState } from "react";

const demoSteps = [
  { id: 1, title: "📸 Image Uploaded", description: "Pothole image captured at Silk Board Junction", duration: 2000 },
  { id: 2, title: "🤖 AI Analyzing...", description: "Bedrock Vision scanning road surface for damage", duration: 2500 },
  { id: 3, title: "⚠️ Severity Detected", description: "CRITICAL severity — Large pothole, 90% confidence", duration: 2000 },
  { id: 4, title: "💰 Economic Impact", description: "Vehicle damage: ₹15,000/day | Repair cost: ₹8,000", duration: 2000 },
  { id: 5, title: "📍 Location Tagged", description: "GPS: 12.9172°N, 77.6101°E — Silk Board, Ward 177", duration: 2000 },
  { id: 6, title: "☁️ Saved to AWS", description: "Image stored in S3 | Incident logged in DynamoDB", duration: 2000 },
  { id: 7, title: "📋 RTI Complaint Generated", description: "Formal BBMP complaint letter created via Bedrock AI", duration: 2500 },
  { id: 8, title: "✅ Complete!", description: "Incident reported | Complaint sent | Map updated", duration: 0 },
];

const mockResult = {
  severity: "CRITICAL",
  confidence: 92,
  size_estimate: "very large",
  description: "Large pothole with severe road surface damage posing critical risk to vehicles.",
  vehicle_damage_cost_per_day: 15000,
  repair_cost: 8000,
  monthly_savings_if_fixed: 45000,
};

export default function DemoMode() {
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const runDemo = async () => {
    setRunning(true);
    setCompleted(false);
    setShowResult(false);
    setCurrentStep(0);

    for (let i = 0; i < demoSteps.length; i++) {
      setCurrentStep(i + 1);
      if (demoSteps[i].duration > 0) {
        await new Promise(r => setTimeout(r, demoSteps[i].duration));
      }
    }
    setRunning(false);
    setCompleted(true);
    setShowResult(true);
  };

  const reset = () => {
    setRunning(false);
    setCompleted(false);
    setShowResult(false);
    setCurrentStep(0);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <h2 style={{ marginBottom: "4px" }}>🎬 Live Demo Mode</h2>
          <p style={{ fontSize: "13px", color: "#64748b" }}>Auto-plays the full RoadSense AI pipeline for presentations</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {completed && (
            <button onClick={reset} style={{
              padding: "10px 20px", background: "#f1f5f9", color: "#374151",
              border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", fontWeight: "600"
            }}>
              🔄 Reset
            </button>
          )}
          <button onClick={runDemo} disabled={running} style={{
            padding: "10px 24px",
            background: running ? "#94a3b8" : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            color: "white", border: "none", borderRadius: "8px", cursor: running ? "not-allowed" : "pointer",
            fontWeight: "600", fontSize: "14px", boxShadow: "0 2px 8px rgba(59,130,246,0.4)"
          }}>
            {running ? "▶ Running Demo..." : "▶ Start Demo"}
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
        {demoSteps.map((step) => {
          const isDone = currentStep > step.id;
          const isActive = currentStep === step.id;
          return (
            <div key={step.id} style={{
              padding: "14px",
              borderRadius: "10px",
              border: `2px solid ${isActive ? "#3b82f6" : isDone ? "#22c55e" : "#e2e8f0"}`,
              background: isActive ? "#eff6ff" : isDone ? "#f0fdf4" : "#f8fafc",
              transition: "all 0.3s",
              position: "relative",
              overflow: "hidden"
            }}>
              {isActive && (
                <div style={{
                  position: "absolute", top: 0, left: 0, height: "3px",
                  background: "#3b82f6", width: "100%",
                  animation: "progress 2s linear"
                }} />
              )}
              <div style={{ fontSize: "18px", marginBottom: "6px" }}>
                {isDone ? "✅" : isActive ? "⏳" : "⭕"} {step.title.split(" ").slice(1).join(" ")}
              </div>
              <div style={{ fontSize: "11px", color: "#64748b", lineHeight: "1.4" }}>
                {step.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* Result Panel */}
      {showResult && (
        <div style={{
          background: "linear-gradient(135deg, #0f172a, #1e3a5f)",
          borderRadius: "12px", padding: "24px", color: "white"
        }}>
          <div style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>
            🎯 Demo Result — Silk Board Junction
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "16px" }}>
            <div style={{ background: "rgba(239,68,68,0.15)", borderRadius: "8px", padding: "14px", border: "1px solid rgba(239,68,68,0.3)" }}>
              <div style={{ fontSize: "11px", opacity: 0.7, marginBottom: "4px" }}>AI SEVERITY</div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: "#ef4444" }}>{mockResult.severity}</div>
              <div style={{ fontSize: "11px", opacity: 0.7 }}>{mockResult.confidence}% confidence</div>
            </div>
            <div style={{ background: "rgba(234,179,8,0.15)", borderRadius: "8px", padding: "14px", border: "1px solid rgba(234,179,8,0.3)" }}>
              <div style={{ fontSize: "11px", opacity: 0.7, marginBottom: "4px" }}>DAILY DAMAGE</div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: "#eab308" }}>₹{mockResult.vehicle_damage_cost_per_day.toLocaleString()}</div>
              <div style={{ fontSize: "11px", opacity: 0.7 }}>per day if ignored</div>
            </div>
            <div style={{ background: "rgba(34,197,94,0.15)", borderRadius: "8px", padding: "14px", border: "1px solid rgba(34,197,94,0.3)" }}>
              <div style={{ fontSize: "11px", opacity: 0.7, marginBottom: "4px" }}>MONTHLY SAVINGS</div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: "#22c55e" }}>₹{mockResult.monthly_savings_if_fixed.toLocaleString()}</div>
              <div style={{ fontSize: "11px", opacity: 0.7 }}>if fixed now</div>
            </div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "8px", padding: "14px", fontSize: "13px", lineHeight: "1.8" }}>
            <strong>📋 Auto-Generated RTI Complaint:</strong><br />
            To: Public Information Officer, BBMP | Date: {new Date().toLocaleDateString('en-IN')}<br />
            Subject: Urgent Road Repair — CRITICAL Severity Pothole at Silk Board<br />
            A critical pothole has been detected at Silk Board Junction (12.9172°N, 77.6101°E).
            Vehicle damage estimated at ₹15,000/day. Repair cost: ₹8,000.
            Immediate repair requested within 48 hours per BBMP SLA.<br />
            — RoadSense AI Automated Monitoring System
          </div>
        </div>
      )}

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}