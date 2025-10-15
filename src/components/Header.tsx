import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const avatarRef = useRef<HTMLLIElement | null>(null);

  const baseLinks = [
    { name: "Home", path: "/" },
    ...(user?.role !== "Instructor" 
      ? [{ name: "Courses", path: "/courses" }] 
      : []
    ),
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target as Node)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(false);
    logout();
    navigate("/");
  };

  const getDashboardPath = () => {
    if (!user) return "/dashboard";
    return user.role === "Admin" ? "/admin/dashboard" : "/dashboard";
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* ===== NAVBAR ===== */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <nav className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 hidden sm:inline group-hover:opacity-80 transition-opacity">
              Lernify
            </span>
          </Link>

          {/* ===== DESKTOP MENU ===== */}
          <ul className="hidden md:flex items-center gap-2">
            {baseLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}

            {/* Instructor link */}
            {user?.role === "Instructor" && (
              <li>
                <Link
                  to="/instructor/my-courses"
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    isActive("/instructor/my-courses")
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  My Courses
                </Link>
              </li>
            )}

            {/* ===== AUTH BUTTONS ===== */}
            {!user && (
              <>
                <li>
                  <Link
                    to="/login"
                    className="px-5 py-2 rounded-lg text-gray-700 font-medium border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}

            {/* ===== AVATAR MENU ===== */}
            {user && (
              <li className="relative ml-4" ref={avatarRef}>
                <button
                  onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${
                      avatarMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {avatarMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-2 animate-fadeIn z-50">
                    <p className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-100">
                      {user.name}
                    </p>
                    <Link
                      to={getDashboardPath()}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors duration-200"
                      onClick={() => setAvatarMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setAvatarMenuOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>

          {/* ===== MOBILE TOGGLE ===== */}
          <button
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* ===== MOBILE MENU ===== */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 animate-fadeIn">
            <ul className="flex flex-col py-2">
              {baseLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-6 py-3 font-medium transition-all duration-300 ${
                      isActive(link.path)
                        ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

              {/* My Courses link for instructors in mobile */}
              {user?.role === "Instructor" && (
                <li>
                  <Link
                    to="/instructor/my-courses"
                    onClick={() => setMenuOpen(false)}
                    className={`block px-6 py-3 font-medium transition-all duration-300 ${
                      isActive("/instructor/my-courses")
                        ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    My Courses
                  </Link>
                </li>
              )}

              {!user && (
                <>
                  <li className="border-t border-gray-100 mt-2 pt-2">
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="block px-6 py-3 text-indigo-600 font-semibold hover:bg-indigo-50 transition-all duration-300"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}

              {user && (
                <>
                  <li className="border-t border-gray-100 mt-2 pt-2">
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setMenuOpen(false)}
                      className="block px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setShowLogoutModal(true);
                      }}
                      className="block w-full text-left px-6 py-3 text-red-600 font-medium hover:bg-red-50 transition-all duration-300"
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </header>

      {/* ===== LOGOUT MODAL ===== */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center animate-slideUp">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-xl">⚠</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Logout
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to logout of your account?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-6 py-2.5 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 shadow-sm hover:shadow-md transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;