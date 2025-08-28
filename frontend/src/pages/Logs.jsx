import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Summary from "./../components/Summary";
import Results from "./../components/Results";
import Header from "../components/Header";
import { ArrowLeft, ChevronRight } from "lucide-react";

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/api/logs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch logs");
        }

        const data = await response.json();
        setLogs(data.logs);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [navigate]);

  const handleLogSelect = (log) => {
    setSelectedLog(log);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header showSignOut />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showSignOut />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Search History
          </h2>
          <p className="text-gray-600">View your previous search results</p>
        </div>

        {selectedLog ? (
          <>
            <button
              onClick={() => setSelectedLog(null)}
              className="mb-6 flex items-center text-red-600 hover:text-red-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to all logs
            </button>

            <div className="space-y-8">
              <Summary records={selectedLog.results} />
              <Results
                records={selectedLog.results}
                loading={false}
                searchAttempted={true}
                searchedName={selectedLog.query}
              />
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Searches</h3>
            </div> */}

            <div className="divide-y divide-gray-200">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleLogSelect(log)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {log.query}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {log.results.length} records
                        </span>
                        <ChevronRight className="h-5 w-5 ml-2 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No search history found
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
