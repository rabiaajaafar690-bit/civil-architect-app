import { useState } from "react";
import InputForm from "../components/InputForm";
import PlanCanvas from "../components/PlanCanvas";
import Building3DView from "../components/Building3DView";
import AISuggestions from "../components/AISuggestions";
import { generatePlan, getAISuggestions } from "../services/api";

export default function Home() {
  const [plan, setPlan] = useState(null);
  const [suggestions, setSuggestions] = useState("");
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("2d"); // "2d" | "3d"

  async function handleGenerate(input) {
    setError("");
    setPlan(null);
    setSuggestions("");
    setLoadingPlan(true);
    try {
      const data = await generatePlan(input);
      setPlan(data);
      setSelectedFloor(0);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to generate plan. Please check your parameters and try again.");
    } finally {
      setLoadingPlan(false);
    }
  }

  async function handleAISuggest() {
    if (!plan) return;
    setLoadingAI(true);
    setSuggestions("");
    try {
      const data = await getAISuggestions(plan);
      setSuggestions(data.suggestions);
    } catch {
      setSuggestions("Failed to get AI suggestions. Please try again.");
    } finally {
      setLoadingAI(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-700 text-white py-4 px-6 shadow-md">
        <h1 className="text-2xl font-bold">Civil Architect — AI Building Plan Generator</h1>
        <p className="text-blue-200 text-sm mt-1">
          Generate 2D / 3D building plans and get AI-powered suggestions
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="space-y-4">
          <InputForm onSubmit={handleGenerate} loading={loadingPlan} />

          {plan && (
            <>
              {/* 2D / 3D toggle */}
              <div className="flex rounded-lg overflow-hidden border border-gray-300">
                <button
                  onClick={() => setViewMode("2d")}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    viewMode === "2d"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  2D Plan
                </button>
                <button
                  onClick={() => setViewMode("3d")}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    viewMode === "3d"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  3D View
                </button>
              </div>

              {/* AI Suggestions button */}
              <button
                onClick={handleAISuggest}
                disabled={loadingAI}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-2.5 rounded-lg transition-colors"
              >
                {loadingAI ? "Analysing…" : "🤖 Get AI Suggestions"}
              </button>
            </>
          )}
        </aside>

        {/* Main content */}
        <section className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
              {error}
            </div>
          )}

          {loadingPlan && (
            <div className="text-center text-gray-500 py-12">
              Generating building plan…
            </div>
          )}

          {plan && (
            <>
              {/* Floor selector (only in 2D mode) */}
              {viewMode === "2d" && plan.floors.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {plan.floors.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedFloor(i)}
                      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        i === selectedFloor
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      Floor {i + 1}
                    </button>
                  ))}
                </div>
              )}

              {viewMode === "2d" ? (
                <PlanCanvas
                  floorPlan={plan.floors[selectedFloor]}
                  floorIndex={selectedFloor}
                />
              ) : (
                <Building3DView plan={plan} />
              )}
            </>
          )}

          <AISuggestions suggestions={suggestions} loading={loadingAI} />
        </section>
      </main>
    </div>
  );
}
