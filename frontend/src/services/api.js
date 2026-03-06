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

/**
 * Fetch the basic house plan from GET /api/generate-basic-plan.
 * Falls back to a minimal local plan when the backend is unreachable.
 */
export async function fetchBasicPlan() {
  try {
    const response = await api.get("/api/generate-basic-plan");
    return response.data;
  } catch {
    // Fallback: simple 10×8 house with an interior partition
    const W = 10, L = 8, T = 0.2, H = 2.8;
    return {
      walls: [
        { x1: 0, y1: 0, x2: W, y2: 0, thickness: T, height: H },
        { x1: W, y1: 0, x2: W, y2: L, thickness: T, height: H },
        { x1: W, y1: L, x2: 0, y2: L, thickness: T, height: H },
        { x1: 0, y1: L, x2: 0, y2: 0, thickness: T, height: H },
        { x1: W / 2, y1: 0, x2: W / 2, y2: L, thickness: T, height: H },
      ],
    };
  }
}
