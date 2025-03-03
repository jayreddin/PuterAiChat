import { createRoot } from "react-dom/client";
import { SpeedInsights } from "@vercel/speed-insights/react"; // Changed from 'next' to 'react'
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <SpeedInsights />
  </>
);
