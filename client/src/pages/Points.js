import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const statusStyle = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

export default function Points() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([axios.get("/api/items/my"), axios.get("/api/user/profile")])
      .then(([i, p]) => { setItems(i.data); setProfile(p.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const approved = items.filter((i) => i.status === "Approved").length;
  const pending = items.filter((i) => i.status === "Pending").length;

  return (
    <div className="min-h-screen bg-green-50 pb-10">
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-8">
        <div className="max-w-4xl mx-auto"><h1 className="text-2xl font-bold">My Points & History</h1></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 flex items-center gap-6">
          <div className="w-20 h-20 bg-yellow-100 rounded-2xl flex items-center justify-center text-4xl">🪙</div>
          <div>
            <p className="text-gray-500 font-medium">Total Points Earned</p>
            <p className="text-4xl font-bold text-green-600">{profile?.points ?? user?.points ?? 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Uploads", value: items.length, color: "text-gray-700" },
            { label: "Approved", value: approved, color: "text-green-600" },
            { label: "Pending", value: pending, color: "text-yellow-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-bold text-gray-700 mb-4">Request History</h3>
        {loading ? <p className="text-gray-400">Loading...</p>
          : items.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
              <p className="text-4xl mb-2">📦</p>
              <p className="text-gray-500">Abhi koi request nahi</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                  {item.image
                    ? <img src={item.image} alt="item" className="w-16 h-16 rounded-xl object-cover border" />
                    : <div className="w-16 h-16 rounded-xl bg-green-100 flex items-center justify-center text-2xl">♻️</div>
                  }
                  <div className="flex-1">
                    <p className="font-bold text-gray-700">{item.category}</p>
                    <p className="text-gray-400 text-sm">📍 {item.address}</p>
                    <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[item.status]}`}>{item.status}</span>
                    {item.status === "Approved" && <p className="text-green-600 font-bold text-sm mt-1">+100 pts</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
