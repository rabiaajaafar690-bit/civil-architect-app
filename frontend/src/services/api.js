import axios from "axios";

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
});

export async function generatePlan(buildingInput) {
  const response = await api.post("/generate-plan", buildingInput);
  return response.data;
}

export async function getAISuggestions(plan) {
  const response = await api.post("/ai/suggest", { plan });
  return response.data;
}
