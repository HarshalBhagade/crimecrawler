// Search.jsx
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

export default function SearchSection({
  name,
  setName,
  handleSearch,
  loading,
  logs,
  onSelectLog,
}) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!name) {
      setSuggestions([]);
      return;
    }

    // filter logs (case insensitive contains match)
    const filtered = logs.filter((log) =>
      log.query.toLowerCase().includes(name.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5)); // show max 5
  }, [name, logs]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8 relative">
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          Criminal Record Search
        </h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Enter a candidate's name/ criminal ID or a city to search for criminal
          records. Ensure proper authorization.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        {/* Input + Suggestions */}
        <div className="relative">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter candidate's name/ id or city"
            className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        {/* Suggestions list sits in flow, not absolute */}
        {suggestions.length > 0 && (
          <div className="mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
            {suggestions.map((log) => (
              <div
                key={log.id}
                onClick={() => onSelectLog(log)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center"
              >
                <span>{log.query}</span>
                <span className="text-xs text-gray-500">
                  {log.results.length} records
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Button always after suggestions */}
        <button
          onClick={handleSearch}
          disabled={!name || loading}
          className="w-full mt-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              <span>Search Records</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
