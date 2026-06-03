import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out!");
    navigate("/login");
  };

  const link = (to, label) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg font-medium transition text-sm ${
        location.pathname === to ? "bg-green-700 text-white" : "text-white hover:bg-green-700"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-green-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">♻️</span>
          <span className="text-white font-bold text-lg">RecycleApp</span>
        </Link>
        <div className="flex items-center gap-1">
          {!user?.isAdmin && link("/", "Home")}
          {!user?.isAdmin && link("/points", "My Points")}
          {!user?.isAdmin && link("/redeem", "Redeem Points")}
          {!user?.isAdmin && link("/profile", "Profile")}
          {user?.isAdmin && link("/admin", "🛡 Admin Dashboard")}
          <button
            onClick={handleLogout}
            className="ml-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
