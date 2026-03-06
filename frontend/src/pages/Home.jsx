import { useState, useEffect } from "react";
import InputForm from "../components/InputForm";
import PlanCanvas from "../components/PlanCanvas";
import Building3DView from "../components/Building3DView";
import Plan2DViewer from "../components/Plan2DViewer";
import Plan3DViewer from "../components/Plan3DViewer";
import AISuggestions from "../components/AISuggestions";
import WebGLErrorBoundary from "../components/WebGLErrorBoundary";
import { generatePlan, getAISuggestions, fetchBasicPlan } from "../services/api";

export default function Home() {
  const [plan, setPlan] = useState(null);
  const [suggestions, setSuggestions] = useState("");
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("2d"); // "2d" | "3d"

  // ---- Basic house plan (HousePlan) ----
  const [basicPlan, setBasicPlan] = useState(null);
  const [basicView, setBasicView] = useState("2d"); // "2d" | "3d"
  const [loadingBasic, setLoadingBasic] = useState(false);

  // Tab: "building" (existing multi-floor) or "basic" (new basic house)
  const [activeTab, setActiveTab] = useState("basic");

  // Auto-load the basic plan on mount
  useEffect(() => {
    loadBasicPlan();

    async function loadBasicPlan() {
      setLoadingBasic(true);
      setError("");
      try {
        const data = await fetchBasicPlan();
        setBasicPlan(data);
      } catch {
        setError("Failed to load basic plan.");
      } finally {
        setLoadingBasic(false);
      }
    }
  }, []);

  async function handleFetchBasic() {
    setLoadingBasic(true);
    setError("");
    try {
      const data = await fetchBasicPlan();
      setBasicPlan(data);
    } catch {
      setError("Failed to load basic plan.");
    } finally {
      setLoadingBasic(false);
    }
  }

  async function handleGenerate(input) {
    setError("");
    setPlan(null);
    setSuggestions("");
    setLoadingPlan(true);
    setActiveTab("building");
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

      {/* ── Top navigation tabs ── */}
      <nav className="max-w-7xl mx-auto px-4 pt-6 flex gap-2">
        <button
          onClick={() => setActiveTab("basic")}
          className={`px-5 py-2 rounded-t-lg text-sm font-semibold transition-colors ${
            activeTab === "basic"
              ? "bg-white text-blue-700 border border-b-0 border-gray-300"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          🏠 Basic House Plan
        </button>
        <button
          onClick={() => setActiveTab("building")}
          className={`px-5 py-2 rounded-t-lg text-sm font-semibold transition-colors ${
            activeTab === "building"
              ? "bg-white text-blue-700 border border-b-0 border-gray-300"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          🏢 Multi-Floor Building
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-4 pb-8 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        {/* ── Sidebar ── */}
        <aside className="space-y-4 pt-4">
          {activeTab === "basic" ? (
            /* Basic plan sidebar */
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Basic House</h2>
              <p className="text-sm text-gray-500">
                A simple 10 × 8 m house with two rooms, generated automatically.
              </p>
              <button
                onClick={handleFetchBasic}
                disabled={loadingBasic}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition-colors"
              >
                {loadingBasic ? "Loading…" : "Reload Basic Plan"}
              </button>

              {basicPlan && (
                <div className="flex rounded-lg overflow-hidden border border-gray-300">
                  <button
                    onClick={() => setBasicView("2d")}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${
                      basicView === "2d"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Plan 2D
                  </button>
                  <button
                    onClick={() => setBasicView("3d")}
                    className={`flex-1 py-2 text-sm font-medium transition-colors ${
                      basicView === "3d"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    Maquette 3D
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Building plan sidebar */
            <>
              <InputForm onSubmit={handleGenerate} loading={loadingPlan} />

              {plan && (
                <>
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

                  <button
                    onClick={handleAISuggest}
                    disabled={loadingAI}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold py-2.5 rounded-lg transition-colors"
                  >
                    {loadingAI ? "Analysing…" : "🤖 Get AI Suggestions"}
                  </button>
                </>
              )}
            </>
          )}
        </aside>

        {/* ── Main content ── */}
        <section className="space-y-6 pt-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
              {error}
            </div>
          )}

          {activeTab === "basic" ? (
            /* ── Basic house viewers ── */
            <>
              {loadingBasic && (
                <div className="text-center text-gray-500 py-12">Loading basic house plan…</div>
              )}
              {basicPlan && (
                basicView === "2d" ? (
                  <Plan2DViewer plan={basicPlan} />
                ) : (
                  <WebGLErrorBoundary>
                    <Plan3DViewer plan={basicPlan} />
                  </WebGLErrorBoundary>
                )
              )}
            </>
          ) : (
            /* ── Multi-floor building viewers ── */
            <>
              {loadingPlan && (
                <div className="text-center text-gray-500 py-12">Generating building plan…</div>
              )}
              {plan && (
                <>
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
                    <WebGLErrorBoundary>
                      <Building3DView plan={plan} />
                    </WebGLErrorBoundary>
                  )}
                </>
              )}
              <AISuggestions suggestions={suggestions} loading={loadingAI} />
            </>
          )}
        </section>
      </main>
    </div>
  );
}
