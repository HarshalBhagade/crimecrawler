export default function Summary({ records }) {
  if (!records || records.length === 0) return null;

  // Group by status
  const statusCount = records.reduce((acc, rec) => {
    const status = rec.status?.toLowerCase() || "unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Group by offense
  const offenseCount = records.reduce((acc, rec) => {
    const offense = rec.offense || "Unknown";
    acc[offense] = (acc[offense] || 0) + 1;
    return acc;
  }, {});

  // Get top 3 offenses
  const topOffenses = Object.entries(offenseCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Summary</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-gray-700">
        <div>
          <p className="font-medium">Total Records:</p>
          <p className="text-xl font-semibold text-red-600">{records.length}</p>
        </div>

        <div>
          <p className="font-medium">Statuses:</p>
          <ul className="list-disc list-inside space-y-1">
            {Object.entries(statusCount).map(([status, count], idx) => (
              <li key={idx}>
                {status.charAt(0).toUpperCase() + status.slice(1)}:{" "}
                <span className="font-medium">{count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-medium">Top Offenses:</p>
          <ul className="list-disc list-inside space-y-1">
            {topOffenses.map(([offense, count], idx) => (
              <li key={idx}>
                {offense}: <span className="font-medium">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
