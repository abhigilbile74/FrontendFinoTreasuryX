import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { logoutUser } from "../store/slices/authSlice";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { to: "/dashboard", icon: "🏠", label: "Dashboard" },
    { to: "/dashboard/investment", icon: "💰", label: "Investment" },
    { to: "/dashboard/chatbot", icon: "🤖", label: "Chatbot" },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-700 to-gray-600 text-white z-50 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold"
            style={{ fontFamily: "'Broadway', sans-serif" }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="text-blue-400">Fino</span>_
            <span className="text-emerald-400">Treasury</span>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-600 transition"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed top-0 left-0 h-screen bg-gradient-to-b from-gray-700 to-gray-300 text-white w-64 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-16">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3 text-gray-200 hover:bg-gray-600 hover:text-white rounded-lg transition"
              >
                <span className="text-xl">{link.icon}</span>
                <span className="text-base font-medium">{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="border-t border-gray-600 px-4 py-4">
            {isAuthenticated ? (
              <>
                <p className="text-sm text-gray-200 mb-3 px-2">
                  Welcome, <span className="font-semibold text-white">{user?.username}</span>
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-md transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-md transition text-center"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block group fixed top-0 left-0 h-screen bg-gradient-to-b from-gray-700 to-gray-300 text-white flex flex-col justify-between items-center transition-all duration-300 ease-in-out w-10 hover:w-64 rounded-r-2xl shadow-lg z-50 overflow-hidden">
        {/* Logo Section */}
        <div className="flex flex-col items-center mt-6 w-full">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold tracking-wide mb-10 px-4"
            style={{ fontFamily: "'Broadway', sans-serif" }}
          >
            <span className="text-blue-500">Fino</span>_
            <span className="text-emerald-400 hidden group-hover:inline">
              Treasury
            </span>
          </Link>

          {/* Sidebar Links */}
          <nav className="flex flex-col gap-3 w-full">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-4 px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition rounded-r-2xl"
              >
                <span className="text-lg">{link.icon}</span>
                <span className="hidden group-hover:inline text-sm font-medium">
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* User Section */}
        <div className="w-full border-t border-gray-700 py-4 px-4 text-center">
          {isAuthenticated ? (
            <>
              <p className="text-sm text-gray-200 mb-2 hidden group-hover:block">
                Welcome,{" "}
                <span className="font-semibold text-white">{user?.username}</span>
              </p>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-4 py-2 rounded-full w-full text-sm font-medium hover:shadow-md transition hidden group-hover:block"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-full w-full text-sm font-medium hover:shadow-md transition hidden group-hover:block"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Spacer for mobile header */}
      <div className="md:hidden h-16" />
    </>
  );
};

export default Sidebar;
