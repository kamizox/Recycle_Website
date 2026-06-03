const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/auth");


router.get("/pending", protect, adminOnly, async (req, res) => {
  try {
    const items = await Item.find({ status: "Pending" }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/all", protect, adminOnly, async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/approve/:id", protect, adminOnly, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, { status: "Approved" }, { new: true });
    if (!item) return res.status(404).json({ message: "Item not found" });
    await User.findByIdAndUpdate(item.userId, { $inc: { points: 100 } });
    res.json({ message: "Approved! +100 points", item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/reject/:id", protect, adminOnly, async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, { status: "Rejected" }, { new: true });
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Rejected", item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const total = await Item.countDocuments();
    const pending = await Item.countDocuments({ status: "Pending" });
    const approved = await Item.countDocuments({ status: "Approved" });
    const rejected = await Item.countDocuments({ status: "Rejected" });
    const users = await User.countDocuments({ isAdmin: false });
    res.json({ total, pending, approved, rejected, users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/redeems", protect, adminOnly, async (req, res) => {
  try {
    const Redeem = require("../models/Redeem");
    const redeems = await Redeem.find().sort({ createdAt: -1 });
    res.json(redeems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/redeems/:id/approve", protect, adminOnly, async (req, res) => {
  try {
    const Redeem = require("../models/Redeem");
    const redeem = await Redeem.findByIdAndUpdate(req.params.id, { status: "Approved" }, { new: true });
    if (!redeem) return res.status(404).json({ message: "Redeem request not found" });
    
    await User.findByIdAndUpdate(redeem.userId, { $inc: { points: -redeem.points } });
    res.json({ message: "Approved successfully", redeem });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
