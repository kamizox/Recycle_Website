const admin = require("./firebase");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Firebase token verify karo
    const decoded = await admin.auth().verifyIdToken(token);

    // MongoDB mein user dhundo ya banao
    let user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user) {
      // Pehli baar login — user banao
      user = await User.create({
        firebaseUid: decoded.uid,
        name: decoded.name || "User",
        email: decoded.email,
        image: decoded.picture || "",
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.isAdmin) return next();
  return res.status(403).json({ message: "Admin access only" });
};

module.exports = { protect, adminOnly };
