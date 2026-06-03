const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const User = require("../models/User");


router.post("/sync", protect, async (req, res) => {
  try {
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      image: req.user.image,
      points: req.user.points,
      isAdmin: req.user.isAdmin,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/make-admin/:email", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { isAdmin: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: `${user.email} is now admin!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
