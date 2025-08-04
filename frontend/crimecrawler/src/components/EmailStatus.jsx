import { CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export default function EmailStatus({ status, onDismiss }) {
  if (!status) return null;

  const statusConfig = {
    sending: {
      icon: <Clock className="h-5 w-5 text-yellow-500" />,
      text: "Sending email...",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
    },
    success: {
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      text: "Email sent successfully!",
      bgColor: "bg-green-50",
      textColor: "text-green-800",
    },
    error: {
      icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
      text: "Failed to send email",
      bgColor: "bg-red-50",
      textColor: "text-red-800",
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <div className={`rounded-md p-4 mb-4 ${currentStatus.bgColor}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">{currentStatus.icon}</div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${currentStatus.textColor}`}>
            {currentStatus.text}
          </p>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={onDismiss}
            className={`rounded-md p-1.5 ${currentStatus.textColor} hover:bg-opacity-80`}
          >
            <span className="sr-only">Dismiss</span>
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}