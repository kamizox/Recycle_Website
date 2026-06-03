import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  
  

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const token = await result.user.getIdToken();
      
      
      const res = await axios.post("/api/auth/sync", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.data.isAdmin) {
        
        await auth.signOut();
        toast.error("Access denied. Admin privileges required.");
      } else {
        toast.success("Admin login successful");
        navigate("/admin");
      }
    } catch (err) {
      toast.error("Login failed. Check credentials.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-10 w-full max-w-md text-center border border-gray-700">
        <div className="text-5xl mb-4">🛡</div>
        <h1 className="text-3xl font-bold text-white">Admin Login</h1>
        <p className="text-gray-400 mt-2 mb-8">Access the RecycleApp control panel</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white rounded-xl py-4 font-semibold hover:bg-green-700 transition disabled:opacity-60 mt-4"
          >
            {loading ? "Authenticating..." : "Login as Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
