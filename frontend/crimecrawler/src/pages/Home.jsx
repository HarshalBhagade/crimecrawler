import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import { Search, User, AlertCircle, CheckCircle, Clock } from "lucide-react";

const RecordField = ({ label, value }) => (
  <div>
    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
      {label}
    </label>
    <p className="mt-1 text-base text-gray-900">{value || "N/A"}</p>
  </div>
);

export default function Home() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(res.data.user);
      } catch (error) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    };
    fetchUser();
  }, []);

  const handleSearch = async () => {
    if (!name) return;
    setLoading(true);
    setSearchAttempted(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/scrape",
        { name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRecords(res.data.records || []);
    } catch (err) {
      console.error("Scraping failed", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "convicted":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "escaped":
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case "cleared":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "under investigation":
        return <Clock className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "convicted":
        return "text-red-600 bg-red-50 border-red-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "escaped":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "cleared":
        return "text-green-600 bg-green-50 border-green-200";
      case "under investigation":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return user ? (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-3">
            <User className="w-8 h-8 text-slate-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              Criminal Record Search
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Enter a candidate's name to search for criminal records. Please
              ensure you have proper authorization before conducting searches.
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter candidate's full name"
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

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

        {/* Results Section */}
        {searchAttempted && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {!loading && records.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-6">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <h4 className="text-xl font-bold text-gray-900">
                    Records Found for "{name}"
                  </h4>
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {records.length}{" "}
                    {records.length === 1 ? "record" : "records"}
                  </span>
                </div>

                <div className="space-y-6">
                  {records.map((record, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow transition-shadow bg-white"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <RecordField label="Name" value={record.name} />
                        <RecordField label="Gender" value={record.gender} />
                        <RecordField
                          label="Date of Birth"
                          value={new Date(record.dob).toLocaleDateString()}
                        />
                        <RecordField
                          label="National ID"
                          value={record.national_id}
                        />
                        <RecordField label="Location" value={record.location} />
                        <RecordField label="Offense" value={record.offense} />
                        <RecordField
                          label="Offense Date"
                          value={new Date(
                            record.offense_date
                          ).toLocaleDateString()}
                        />
                        <RecordField label="Officer" value={record.officer} />
                        <RecordField label="Case ID" value={record.case_id} />
                        <RecordField label="Sentence" value={record.sentence} />
                        <div>
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Status
                          </label>
                          <div className="mt-1 flex items-center space-x-2">
                            {getStatusIcon(record.status)}
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                                record.status
                              )}`}
                            >
                              {record.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && searchAttempted && records.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  No Records Found
                </h4>
                <p className="text-gray-600">
                  No criminal records found for "{name}". This is a clean
                  result.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  ) : (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  );
}
