import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

export default function Redeem() {
  const { user } = useAuth();
  const [accountNumber, setAccountNumber] = useState("");
  const [pointsToRedeem, setPointsToRedeem] = useState("");
  const [loading, setLoading] = useState(false);
  const [refNumber, setRefNumber] = useState("");
  const [myRedeems, setMyRedeems] = useState([]);
  
  const fetchMyRedeems = async () => {
    try {
      const res = await axios.get("/api/items/my-redeems");
      setMyRedeems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    
    const randomNum1 = Math.floor(1000 + Math.random() * 9000);
    const randomNum2 = Math.floor(1000 + Math.random() * 9000);
    setRefNumber(`RCL-${randomNum1}-${randomNum2}`);
    
    if (user) {
      fetchMyRedeems();
    }
  }, [user]);

  const handleRedeem = async (e) => {
    e.preventDefault();
    const points = Number(pointsToRedeem);
    if (!user || user.points <= 0) {
      toast.error("Insufficient points for redemption.");
      return;
    }
    if (points <= 0 || points > user.points) {
      toast.error("Insufficient points.");
      return;
    }
    
    setLoading(true);
    try {
      await axios.post("/api/items/redeem", {
        accountNumber,
        points: points,
      });
      toast.success(`Redemption request submitted! Reference: ${refNumber}. Admin will process within 24 hours.`);
      setAccountNumber("");
      setPointsToRedeem("");
      fetchMyRedeems();
      
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit redeem request.");
    } finally {
      setLoading(false);
    }
  };

  const remainingPoints = user ? user.points - (Number(pointsToRedeem) || 0) : 0;
  const isOverLimit = user ? (Number(pointsToRedeem) || 0) > user.points : false;

  return (
    <div className="min-h-screen bg-green-50 pb-10">
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 pt-8 pb-20">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold">Redeem Points</h1>
          <p className="mt-2 text-green-100">Convert your points into rewards</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-12 space-y-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
          <div className="w-20 h-20 rounded-full mx-auto bg-green-100 flex items-center justify-center text-4xl mb-4">
            🪙
          </div>
          <h2 className="text-gray-500 font-medium">Available Balance</h2>
          <p className="text-5xl font-bold text-green-600 mt-2">{user?.points || 0}</p>

          <form onSubmit={handleRedeem} className="mt-8 text-left space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Points to Redeem
              </label>
              <input
                type="number"
                placeholder="Enter points"
                value={pointsToRedeem}
                onChange={(e) => setPointsToRedeem(e.target.value)}
                max={user?.points || 0}
                min="1"
                required
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${isOverLimit ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-green-500'}`}
              />
              <p className={`text-sm mt-1 font-medium ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
                {isOverLimit ? "Insufficient points" : `Remaining points: ${remainingPoints}`}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                placeholder="Enter your account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !user || user.points <= 0 || isOverLimit || !pointsToRedeem}
              className="w-full bg-green-600 text-white rounded-xl py-4 font-bold hover:bg-green-700 transition disabled:opacity-60 disabled:hover:bg-green-600"
            >
              {loading ? "Processing..." : "Redeem Points"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400">Reference Number (for display only)</p>
            <p className="text-sm font-mono font-semibold text-gray-600 mt-1">{refNumber}</p>
          </div>
        </div>

        {/* History Section */}
        {myRedeems.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Redeem History</h2>
            <div className="space-y-3">
              {myRedeems.map((req) => (
                <div key={req._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <p className="font-bold text-gray-700">{req.points} Points</p>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">{req.accountNumber}</p>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      req.status === "Approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                    }`}>
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
