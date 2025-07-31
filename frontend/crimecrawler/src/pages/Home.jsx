import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Welcome from "../components/Welcome";
import SearchSection from "../components/Search";
import Results from "../components/Results";
import Summary from "../components/Summary";

export default function Home() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [searchedName, setSearchedName] = useState("");
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
      } catch {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    };
    fetchUser();
  }, []);

  const handleSearch = async () => {
    if (!name) return;
    setSearchedName(name);
    setLoading(true);
    setSearchAttempted(true);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/scrape",
        { query: name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRecords(res.data.records || []);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return user ? (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header showSignOut={true} onSignOut={handleSignOut} />
      <main className="flex-1 w-full">
        {/* Constrained width container for all content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Welcome component with fixed width */}
          <div className="w-full">
            <Welcome user={user} />
          </div>

          {/* Search section with fixed width */}
          <div className="w-full">
            <SearchSection
              name={name}
              setName={setName}
              handleSearch={handleSearch}
              loading={loading}
            />
          </div>

          {/* Results and Summary - will match same width as above */}
          {records.length > 0 && <Summary records={records} />}
          <Results
            records={records}
            loading={loading}
            searchAttempted={searchAttempted}
            searchedName={searchedName}
          />
        </div>
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
