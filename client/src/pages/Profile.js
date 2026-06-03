import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-green-50 pb-10">
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 pt-8 pb-20">
        <div className="max-w-4xl mx-auto"><h1 className="text-2xl font-bold">My Profile</h1></div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-12">
        <div className="bg-white rounded-2xl shadow-md p-6 text-center mb-5">
          {user?.image
            ? <img src={user.image} alt="avatar" className="w-24 h-24 rounded-full mx-auto border-4 border-green-500 object-cover" />
            : <div className="w-24 h-24 rounded-full mx-auto bg-green-500 text-white flex items-center justify-center text-4xl border-4 border-green-500 font-bold uppercase">
                {user?.name?.substring(0, 2) || "U"}
              </div>
          }
          <h2 className="text-xl font-bold text-gray-800 mt-3">{user?.name}</h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <div className="mt-3 inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
            <span>🪙</span>
            <span className="font-bold text-green-700">{user?.points ?? 0} Points</span>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { icon: "🏠", label: "Home", to: "/" },
            { icon: "📦", label: "My Requests & Points", to: "/points" },
          ].map((item) => (
            <button key={item.label} onClick={() => navigate(item.to)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 hover:bg-green-50 transition">
              <span className="text-2xl">{item.icon}</span>
              <span className="font-semibold text-gray-700">{item.label}</span>
              <span className="ml-auto text-gray-400">›</span>
            </button>
          ))}

          {user?.isAdmin && (
            <button onClick={() => navigate("/admin")}
              className="w-full bg-gray-900 text-white rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-800 transition">
              <span className="text-2xl">🛡</span>
              <span className="font-semibold">Admin Panel</span>
              <span className="ml-auto">›</span>
            </button>
          )}

          <button onClick={handleLogout}
            className="w-full bg-red-500 text-white rounded-2xl p-4 flex items-center gap-4 hover:bg-red-600 transition">
            <span className="text-2xl">🚪</span>
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
