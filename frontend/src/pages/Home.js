import React, { useState } from "react";
import UploadForm from "../components/UploadForm";
import StatsPanel from "../components/statsPanel";
import MapDashboard from "../components/MapDashboard";
import Leaderboard from "../components/Leaderboard";
import PriorityList from "../components/PriorityList";
import ROICalculator from "../components/ROICalculator";
import DemoMode from "../components/DemoMode";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [refresh, setRefresh] = useState(0);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "report", label: "Report Pothole", icon: "📸" },
    { id: "map", label: "Live Map", icon: "🗺️" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "demo", label: "Demo Mode", icon: "🎬" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#f0f4f8" }}>

      {/* TOP NAVBAR */}
      <nav style={{
        background: "linear-gradient(135deg, #1a1f36 0%, #2d3561 100%)",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "60px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        flexShrink: 0
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "24px" }}>🚗</span>
          <span style={{ color: "white", fontWeight: "700", fontSize: "18px", letterSpacing: "-0.5px" }}>
            Road<span style={{ color: "#60a5fa" }}>Sense</span>.ai
          </span>
          <span style={{
            background: "#10b981", color: "white", fontSize: "10px",
            padding: "2px 8px", borderRadius: "10px", fontWeight: "600", letterSpacing: "1px"
          }}>LIVE</span>
        </div>

        {/* TAB NAVIGATION */}
        <div style={{ display: "flex", gap: "4px" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              background: activeTab === tab.id ? "rgba(96,165,250,0.2)" : "transparent",
              color: activeTab === tab.id ? "#60a5fa" : "#94a3b8",
              border: activeTab === tab.id ? "1px solid rgba(96,165,250,0.4)" : "1px solid transparent",
              padding: "6px 16px", borderRadius: "8px", cursor: "pointer",
              fontSize: "13px", fontWeight: "500", transition: "all 0.2s"
            }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div style={{ color: "#64748b", fontSize: "12px" }}>📍 Bengaluru, Karnataka</div>
      </nav>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, overflow: "auto", padding: "24px" }}>

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1e293b", marginBottom: "20px" }}>
              Overview
            </h2>
            <div style={{ marginBottom: "24px" }}>
              <StatsPanel key={refresh} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <Leaderboard />
              </div>
              <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <PriorityList />
              </div>
            </div>
          </div>
        )}

        {/* REPORT TAB */}
        {activeTab === "report" && (
          <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1e293b", marginBottom: "20px" }}>
              Report a Pothole
            </h2>
            <div style={{ background: "white", borderRadius: "12px", padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              <UploadForm onUploadSuccess={() => { setRefresh(r => r + 1); setActiveTab("dashboard"); }} />
            </div>
          </div>
        )}

        {/* MAP TAB */}
        {activeTab === "map" && (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1e293b", marginBottom: "20px" }}>
              Live Incident Map
            </h2>
            <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              <MapDashboard key={`map-${refresh}`} />
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "analytics" && (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#1e293b", marginBottom: "20px" }}>
              Analytics & Priority
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
              <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <Leaderboard />
              </div>
              <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                <PriorityList />
              </div>
            </div>
            <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              <ROICalculator />
            </div>
          </div>
        )}

        {/* DEMO TAB */}
        {activeTab === "demo" && (
          <div>
            <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
              <DemoMode />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}