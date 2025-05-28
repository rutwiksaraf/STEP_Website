// AnalyticsHandler.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initGA, logPageView } from "./analytics"; // ✅ Correct path


export default function AnalyticsHandler() {
  const location = useLocation();

  useEffect(() => {
    initGA(); // Initialize once
  }, []);

  useEffect(() => {
    logPageView(location.pathname + location.search); // Log on every page change
  }, [location]);

  return null;
}
