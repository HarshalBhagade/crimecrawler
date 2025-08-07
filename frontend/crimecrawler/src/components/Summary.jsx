import { OctagonAlertIcon, ClipboardList, OctagonAlert, Shield } from "lucide-react";

export default function Summary({ records, loading }) {
  if (!records || records.length === 0) return null;

  // Group by status with counts
  const statusCounts = records.reduce((acc, rec) => {
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

  if (loading) {
    return (null);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-gray-900">Search Summary</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Records Card */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-md bg-amber-100 text-amber-600">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-medium text-gray-500">Total Records</h4>
            </div>
            <p className="text-3xl font-bold text-gray-900">{records.length}</p>
          </div>

          {/* All Statuses Card */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-md bg-blue-100 text-blue-600">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-medium text-gray-500">All Statuses</h4>
            </div>
            <div className="space-y-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                  <span className="text-sm font-semibold text-blue-800">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Offenses Card */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-md bg-red-100 text-red-600">
                <OctagonAlertIcon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-medium text-gray-500">Top Offenses</h4>
            </div>
            <ul className="space-y-2">
              {topOffenses.map(([offense, count], idx) => (
                <li key={idx} className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700 truncate">{offense}</span>
                  <span className="text-sm font-semibold text-red-600">{count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}