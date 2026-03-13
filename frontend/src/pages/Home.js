import React, { useState } from "react";
import UploadForm from "../components/UploadForm";
import StatsPanel from "../components/statsPanel";
import MapDashboard from "../components/MapDashboard";

export default function Home() {
  const [refresh, setRefresh] = useState(0);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>🚗 RoadSense AI</h1>
      <UploadForm onUploadSuccess={() => setRefresh(r => r + 1)} />
      <hr />
      <StatsPanel key={refresh} />
      <hr />
      <MapDashboard key={`map-${refresh}`} />
    </div>
  );
}