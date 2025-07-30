import { AlertCircle, CheckCircle, Clock } from "lucide-react";

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

const RecordField = ({ label, value }) => (
  <div>
    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
      {label}
    </label>
    <p className="mt-1 text-base text-gray-900">{value || "N/A"}</p>
  </div>
);

export default function Results({
  records,
  loading,
  searchAttempted,
  searchedName,
}) {
  if (!searchAttempted) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      {!loading && records.length > 0 ? (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-6 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
              <h4 className="text-xl font-bold text-gray-900">
                Records Found for "{searchedName}"
              </h4>
            </div>
            <span className="self-start sm:self-center bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap">
              {records.length} {records.length === 1 ? "record" : "records"}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {records.map((record, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-6 hover:shadow transition-shadow bg-white"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <RecordField label="Name" value={record.name} />
                  <RecordField label="Gender" value={record.gender} />
                  <RecordField
                    label="DOB"
                    value={new Date(record.dob).toLocaleDateString()}
                  />
                  <RecordField label="National ID" value={record.national_id} />
                  <RecordField label="Location" value={record.location} />
                  <RecordField label="Offense" value={record.offense} />
                  <RecordField
                    label="Offense Date"
                    value={new Date(record.offense_date).toLocaleDateString()}
                  />
                  <RecordField label="Officer" value={record.officer} />
                  <RecordField label="Case ID" value={record.case_id} />
                  <RecordField label="Sentence" value={record.sentence} />
                  <div>
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Status
                    </label>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border whitespace-nowrap ${getStatusColor(
                          record.status
                        )}`}
                      >
                        {getStatusIcon(record.status)}
                        <span className="truncate">{record.status}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        !loading && (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">
              No Records Found
            </h4>
            <p className="text-gray-600">
              No criminal records found for "{searchedName}". This is a clean
              result.
            </p>
          </div>
        )
      )}
    </div>
  );
}
