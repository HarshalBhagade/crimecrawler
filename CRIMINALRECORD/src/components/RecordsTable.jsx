import { useEffect, useState } from "react";
import { fetchCriminalRecords } from "./FetchRecords.jsx";

export default function RecordsTable() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCriminalRecords().then(setRecords);
  }, []);

  const filtered = records.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.case_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-screen-xl mx-auto text-gray-100">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          🕵️‍♂️ Criminal Records Database
        </h1>
        <p className="text-gray-400">
          Search and explore simulated criminal records.
        </p>
      </header>

      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search by name, location, or case ID..."
          className="w-full p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto border border-gray-700 rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-700 table-auto text-sm">
          <thead className="bg-gray-800 text-gray-300 sticky top-0 z-10">
            <tr>
              {[
                "Name",
                "DOB",
                "Gender",
                "National ID",
                "Location",
                "Offense",
                "Offense Date",
                "Status",
                "Officer",
                "Case ID",
                "Sentence",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 whitespace-nowrap text-left font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center p-4 text-gray-400">
                  No matching records found.
                </td>
              </tr>
            ) : (
              filtered.map((record) => (
                <tr key={record.id} className="hover:bg-gray-800">
                  <td className="px-4 py-2">{record.name}</td>
                  <td className="px-4 py-2">{record.dob}</td>
                  <td className="px-4 py-2">{record.gender}</td>
                  <td className="px-4 py-2">{record.national_id}</td>
                  <td className="px-4 py-2">{record.location}</td>
                  <td className="px-4 py-2">{record.offense}</td>
                  <td className="px-4 py-2">{record.offense_date}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium max-w-[140px] text-center whitespace-nowrap ${
                        record.status === "Convicted"
                          ? "bg-red-700 text-red-100"
                          : record.status === "Pending"
                          ? "bg-yellow-700 text-yellow-100"
                          : record.status === "Cleared"
                          ? "bg-green-700 text-green-100"
                          : record.status === "Escaped"
                          ? "bg-purple-700 text-purple-100"
                          : "bg-gray-700 text-gray-100"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{record.officer}</td>
                  <td className="px-4 py-2 font-mono text-xs truncate max-w-[100px]">
                    {record.case_id}
                  </td>
                  <td className="px-4 py-2">{record.sentence}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
