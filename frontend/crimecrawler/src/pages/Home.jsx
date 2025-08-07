import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Welcome from "../components/Welcome";
import SearchSection from "../components/Search";
import Results from "../components/Results";
import Summary from "../components/Summary";
import EmailStatus from "../components/EmailStatus";

export default function Home() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [searchedName, setSearchedName] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const eventSource = new EventSource(
      `http://localhost:3000/api/email?token=${encodeURIComponent(token)}`
    );

    eventSource.onopen = () => {
      console.log("SSE connection opened");
    };

    eventSource.onmessage = (e) => {
      if (e.data === "connected") {
        console.log("SSE connected");
        return;
      }
      if (e.data === ":ping") return;

      try {
        const data = JSON.parse(e.data);
        if (data.type === "email-status") {
          handleEmailStatus(data.status);
        }
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Error:", err);
      // Reconnect after 3 seconds if connection fails
      setTimeout(() => {
        eventSource.close();
      }, 3000);
    };

    return () => {
      eventSource.close();
      console.log("SSE connection closed");
    };
  }, []);

  const handleSearch = async () => {
    if (!name) return;
    setSearchedName(name);
    setLoading(true);
    setSearchAttempted(true);
    setEmailStatus(null);

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
    } catch (error) {
      setRecords([]);

      // Check for 401 Unauthorized (likely due to expired JWT)
      if (error.response?.status === 401) {
        localStorage.removeItem("token"); // remove invalid token
        window.location.href = "/login"; // redirect to login page
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleEmailStatus = (status) => {
    setEmailStatus(status);
    // Auto-dismiss after 5 seconds for success/error states
    if (status === "success" || status === "error") {
      setTimeout(() => {
        setEmailStatus(null);
      }, 7000);
    }
  };

  const dismissEmailStatus = () => {
    setEmailStatus(null);
  };

  return user ? (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header showSignOut={true} onSignOut={handleSignOut} />
      <main className="flex-1 w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="w-full">
            <Welcome user={user} />
          </div>

          <div className="w-full">
            <SearchSection
              name={name}
              setName={setName}
              handleSearch={handleSearch}
              loading={loading}
            />
          </div>
          <Summary records={records} loading={loading}/>
          <EmailStatus status={emailStatus} onDismiss={dismissEmailStatus} />
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
