import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const categoryEmoji = { Plastic: "🧴", Paper: "📄", Battery: "🔋", Glass: "🍶" };

export default function UploadItem() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address || !quantity) { toast.error("Sab fields bharo"); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("category", category);
      formData.append("address", address);
      formData.append("quantity", quantity);
      if (image) formData.append("image", image);

      await axios.post("/api/items/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Your Request is submited 🎉");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 pb-10">
      <div className="max-w-lg mx-auto px-4 pt-8">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate("/")} className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition text-lg">←</button>
          <h1 className="text-2xl font-bold text-gray-800">{categoryEmoji[category]} Upload {category}</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <label className="block cursor-pointer mb-6">
            <div className={`h-48 rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden ${preview ? "border-green-400" : "border-gray-300 hover:border-green-400"} transition`}>
              {preview
                ? <img src={preview} alt="preview" className="w-full h-full object-cover rounded-2xl" />
                : <div className="text-center text-gray-400"><p className="text-4xl mb-2">📸</p><p className="text-sm">Image click karke upload karo</p></div>
              }
            </div>
            <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </label>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">📍 Pickup Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Apna address enter karo" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">📦 Quantity</label>
              <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. 3 bags, 5 bottles" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition disabled:opacity-60">
              {loading ? "Uploading..." : "Submit Request"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
