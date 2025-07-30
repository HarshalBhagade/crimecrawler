import { ShieldCheck } from "lucide-react";

export default function Header({ showSignOut = false, onSignOut }) {
  return (
    <header className="bg-slate-900 text-white shadow-lg">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-red-600 rounded-full flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-red-400">CRIMECRAWLER</h1>
          </div>

          {/* Sign Out */}
          {showSignOut && (
            <button
              onClick={onSignOut}
              className="bg-red-600 text-white font-medium px-4 py-2 rounded-md border border-red-700 shadow-sm transform transition-transform hover:scale-105 hover:bg-red-700"
            >
              Sign Out
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
