import { ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header({ showSignOut = false, onSignOut }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Clear authentication token
    localStorage.removeItem("token");
    
    // If parent component provided custom signout handler
    if (onSignOut) {
      onSignOut();
    } 
    // Otherwise use react-router navigation
    else {
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg sticky top-0 z-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo with home link */}
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="h-10 w-10 bg-red-600 rounded-full flex items-center justify-center shadow-md">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-red-400 tracking-tight">
              CRIMECRAWLER
            </h1>
          </div>

          {/* Sign Out Button */}
          {showSignOut && (
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-md border border-red-700 shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}