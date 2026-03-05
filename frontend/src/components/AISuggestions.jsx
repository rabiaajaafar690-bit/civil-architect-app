export default function AISuggestions({ suggestions, loading }) {
  if (!suggestions && !loading) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-3">
        AI Suggestions
      </h2>

      {loading ? (
        <div className="flex items-center gap-2 text-blue-600">
          <svg
            className="animate-spin h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Analysing plan with AI…
        </div>
      ) : (
        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
          {suggestions}
        </div>
      )}
    </div>
  );
}
