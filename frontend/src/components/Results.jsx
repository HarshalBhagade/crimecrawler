import {
  CheckCircle,
  TriangleAlert,
  Clock,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
} from "lucide-react";

const statusConfig = {
  convicted: {
    icon: <ShieldAlert className="w-5 h-5 text-red-500" />,
    color: "bg-red-50 text-red-700 border-red-100",
  },
  pending: {
    icon: <Clock className="w-5 h-5 text-amber-500" />,
    color: "bg-amber-50 text-amber-700 border-amber-100",
  },
  escaped: {
    icon: <ShieldOff className="w-5 h-5 text-blue-500" />,
    color: "bg-blue-50 text-blue-700 border-blue-100",
  },
  cleared: {
    icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  "under investigation": {
    icon: <Shield className="w-5 h-5 text-orange-500" />,
    color: "bg-orange-50 text-orange-700 border-orange-100",
  },
  default: {
    icon: <Shield className="w-5 h-5 text-gray-400" />,
    color: "bg-gray-50 text-gray-700 border-gray-100",
  },
};

const RecordField = ({ label, value, className = "" }) => (
  <div className={className}>
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
      {label}
    </label>
    <p className="text-sm font-medium text-gray-900 truncate">
      {value || <span className="text-gray-400">Not available</span>}
    </p>
  </div>
);

export default function Results({
  records,
  loading,
  searchAttempted,
  searchedName,
}) {
  if (!searchAttempted) return null;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white mt-8 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {records.length > 0 ? (
        <>
          <div className="bg-gray-50 border-b border-gray-200 px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-start space-x-2">
                  <div className="p-2 rounded-lg bg-red-100 text-red-600">
                    <TriangleAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      Criminal Records Found
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Search results for "{searchedName}"
                    </p>
                  </div>
                </div>
              </div>
              <span className="mt-3 sm:mt-0 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                {records.length} {records.length === 1 ? "record" : "records"}
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {records.map((record, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RecordField label="Full Name" value={record.name} />
                    <RecordField label="Gender" value={record.gender} />
                    <RecordField
                      label="Date of Birth"
                      value={
                        record.dob
                          ? new Date(record.dob).toLocaleDateString()
                          : null
                      }
                    />
                    <RecordField
                      label="National ID"
                      value={record.national_id}
                    />
                    <RecordField label="Location" value={record.location} />
                    <RecordField label="Offense" value={record.offense} />
                    <RecordField
                      label="Offense Date"
                      value={
                        record.offense_date
                          ? new Date(record.offense_date).toLocaleDateString()
                          : null
                      }
                    />
                    <RecordField label="Officer" value={record.officer} />
                    <RecordField label="Case ID" value={record.case_id} />
                    <RecordField label="Sentence" value={record.sentence} />
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                        Status
                      </label>
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
                            statusConfig[record.status?.toLowerCase()]?.color ||
                            statusConfig.default.color
                          }`}
                        >
                          {statusConfig[record.status?.toLowerCase()]?.icon ||
                            statusConfig.default.icon}
                          <span className="truncate capitalize">
                            {record.status || "Unknown"}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 px-8">
          <div className="mx-auto h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">
            No Criminal Records Found
          </h4>
          <p className="text-gray-600 max-w-md mx-auto">
            Our system found no criminal records associated with "{searchedName}
            ".
          </p>
        </div>
      )}
    </div>
  );
}
