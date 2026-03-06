import axios from "axios";
import { generatePlanLocal } from "./geometryEngine";

// In Electron (file:// protocol) there is no Vite dev proxy, so we must
// point directly at the backend.  During normal web development the empty
// string lets the Vite proxy handle routing.
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.protocol === "file:"
    ? "http://127.0.0.1:8000"
    : "");

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 5000,
});

/**
 * Generate a building plan.  Tries the backend first; if it is unreachable
 * (e.g. Electron without a running server) falls back to the client-side
 * geometry engine so the user always gets a result.
 */
export async function generatePlan(buildingInput) {
  try {
    const response = await api.post("/generate-plan", buildingInput);
    return response.data;
  } catch {
    // Backend unavailable — generate locally
    return generatePlanLocal(buildingInput);
  }
}

export async function getAISuggestions(plan) {
  const response = await api.post("/ai/suggest", { plan });
  return response.data;
}
