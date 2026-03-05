import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

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
