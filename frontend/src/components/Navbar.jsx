import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { auth, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-sky-700">
          TravelX
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-sky-700">
            Feed
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/create" className="hover:text-sky-700">
                Create Listing
              </Link>
              <span className="text-sm text-slate-600">
                Hi, {auth?.user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-sky-700">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-sky-600 text-white px-4 py-2 rounded-lg"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}