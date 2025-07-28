import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false); // NEW

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:3000/", {
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
    setSearchAttempted(true); // Mark that search was attempted

    try {
      const res = await axios.post("http://localhost:3000/scrape", { name });
      setRecords(res.data.records || []);
    } catch (err) {
      console.error("Scraping failed", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  return user ? (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome, {user.email}</h2>
      <h3>Search Candidate Criminal Record</h3>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter candidate name"
        style={{ padding: "8px", marginRight: "10px" }}
      />
      <button onClick={handleSearch} style={{ padding: "8px" }}>
        Search
      </button>

      {loading && <p>Searching...</p>}

      {!loading && searchAttempted && records.length > 0 && (
        <div style={{ marginTop: "1rem" }}>
          <h4>Matching Records:</h4>
          <ul>
            {records.map((record, index) => (
              <li key={index}>
                <strong>Name:</strong> {record.name}, <strong>Offense:</strong> {record.offense}, <strong>Status:</strong> {record.status}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && searchAttempted && records.length === 0 && (
        <p>No criminal records found for "{name}".</p>
      )}
    </div>
  ) : (
    <p>Loading...</p>
  );
}
