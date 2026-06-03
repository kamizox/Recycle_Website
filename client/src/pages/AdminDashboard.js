import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const statusStyle = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Processed: "bg-green-100 text-green-700",
};

export default function AdminDashboard() {
  const [tab, setTab] = useState("pending");
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (tab === "redeems") {
        const [itemsRes, statsRes] = await Promise.all([
          axios.get("/api/admin/redeems"),
          axios.get("/api/admin/stats"),
        ]);
        setItems(itemsRes.data);
        setStats(statsRes.data);
      } else {
        const [itemsRes, statsRes] = await Promise.all([
          axios.get(tab === "pending" ? "/api/admin/pending" : "/api/admin/all"),
          axios.get("/api/admin/stats"),
        ]);
        setItems(itemsRes.data);
        setStats(statsRes.data);
      }
    } catch { toast.error("Data is not loaded"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [tab]);

  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/admin/approve/${id}`);
      toast.success("+100 points earned");
      fetchData();
    } catch { toast.error("Error"); }
  };

  const handleReject = async (id) => {
    try {
      await axios.put(`/api/admin/reject/${id}`);
      toast.success("Reject kar diya");
      fetchData();
    } catch { toast.error("Error"); }
  };

  const handleApproveRedeem = async (id) => {
    try {
      await axios.put(`/api/admin/redeems/${id}/approve`);
      toast.success("Redeem request approved!");
      fetchData();
    } catch { toast.error("Error processing request"); }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-gray-900 text-white px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold">🛡 Admin Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Recycle requests manage karo</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6">
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {[
              { label: "Total", value: stats.total, color: "text-gray-700" },
              { label: "Pending", value: stats.pending, color: "text-yellow-600" },
              { label: "Approved", value: stats.approved, color: "text-green-600" },
              { label: "Rejected", value: stats.rejected, color: "text-red-600" },
              { label: "Users", value: stats.users, color: "text-blue-600" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-gray-500 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
          {["pending", "all", "redeems"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-xl font-semibold transition whitespace-nowrap ${tab === t ? "bg-gray-900 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}>
              {t === "pending" ? "⏳ Pending" : t === "all" ? "📋 All" : "🪙 Redeem Requests"}
            </button>
          ))}
        </div>

        {loading ? <p className="text-gray-400">Loading...</p>
          : items.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
              <p className="text-4xl mb-2">✅</p>
              <p className="text-gray-500">No {tab} request available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-4">
                    {tab === "redeems" ? (
                      <div className="w-20 h-20 rounded-xl bg-green-100 flex items-center justify-center text-3xl">🪙</div>
                    ) : (
                      item.image
                        ? <img src={item.image} alt="item" className="w-20 h-20 rounded-xl object-cover border" />
                        : <div className="w-20 h-20 rounded-xl bg-green-100 flex items-center justify-center text-3xl">♻️</div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-gray-800">{item.userName}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyle[item.status]}`}>{item.status}</span>
                        {item.category && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{item.category}</span>}
                      </div>
                      
                      {tab === "redeems" ? (
                        <>
                          <p className="text-gray-500 text-sm mt-1">💳 Account: <span className="font-mono text-gray-700 font-medium">{item.accountNumber}</span></p>
                          <p className="text-gray-500 text-sm">💰 Points to Redeem: <span className="font-bold text-green-600">{item.points}</span></p>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-500 text-sm mt-1">📍 {item.address}</p>
                          <p className="text-gray-500 text-sm">📦 {item.quantity}</p>
                        </>
                      )}
                      
                      <p className="text-gray-400 text-xs mt-1">{new Date(item.createdAt).toLocaleDateString("en-PK", { year: "numeric", month: "short", day: "numeric" })}</p>
                    </div>
                  </div>
                  
                  {tab === "redeems" && item.status === "Pending" && (
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => handleApproveRedeem(item._id)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition">
                        ✅ Approve
                      </button>
                    </div>
                  )}

                  {tab !== "redeems" && item.status === "Pending" && (
                    <div className="flex gap-3 mt-4">
                      <button onClick={() => handleApprove(item._id)}
                        className="flex-1 bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition">
                        ✅ Approve (+100 pts)
                      </button>
                      <button onClick={() => handleReject(item._id)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-xl font-semibold hover:bg-red-600 transition">
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
}
