import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  { label: "Plastic", emoji: "🧴", color: "bg-blue-50 border-blue-200 hover:border-blue-400" },
  { label: "Paper", emoji: "📄", color: "bg-yellow-50 border-yellow-200 hover:border-yellow-400" },
  { label: "Battery", emoji: "🔋", color: "bg-red-50 border-red-200 hover:border-red-400" },
  { label: "Glass", emoji: "🍶", color: "bg-purple-50 border-purple-200 hover:border-purple-400" },
];

const statusStyle = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/items/pending")
      .then((r) => setPendingItems(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-green-50 pb-10">
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          {user?.image && (
            <img src={user.image} alt="avatar" className="w-14 h-14 rounded-full border-2 border-white" />
          )}
          <div>
            <h2 className="text-2xl font-bold">Hello, {user?.name?.split(" ")[0]}! 👋</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-300">🪙</span>
              <span className="font-semibold">{user?.points || 0} Points</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <h3 className="text-xl font-bold text-gray-700 mb-4">Select Category</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => navigate(`/upload/${cat.label}`)}
              className={`border-2 ${cat.color} rounded-2xl p-5 flex flex-col items-center gap-2 hover:scale-105 transition shadow-sm bg-white`}
            >
              <span className="text-5xl">{cat.emoji}</span>
              <span className="font-semibold text-gray-700">{cat.label}</span>
            </button>
          ))}
        </div>

        <h3 className="text-xl font-bold text-gray-700 mb-4">Pending Requests</h3>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : pendingItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-gray-500">No pending request available. Upload anything</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingItems.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                {item.image
                  ? <img src={item.image} alt="item" className="w-20 h-20 rounded-xl object-cover border" />
                  : <div className="w-20 h-20 rounded-xl bg-green-100 flex items-center justify-center text-3xl">♻️</div>
                }
                <div className="flex-1">
                  <p className="font-bold text-gray-700">{item.category}</p>
                  <p className="text-gray-500 text-sm">📍 {item.address}</p>
                  <p className="text-gray-500 text-sm">📦 {item.quantity}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyle[item.status]}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
