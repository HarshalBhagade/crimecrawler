import { User } from "lucide-react";

export default function Welcome({ user }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center space-x-3">
        <User className="w-8 h-8 text-slate-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
    </div>
  );
}
