const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const { protect } = require("../middleware/auth");
const { upload } = require("../middleware/cloudinary");


router.post("/upload", protect, (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      console.error("Cloudinary upload error:", err);
      return res.status(500).json({ message: "Image upload failed: " + err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { category, address, quantity } = req.body;
    const item = await Item.create({
      userId: req.user._id,
      userName: req.user.name,
      category,
      address,
      quantity,
      image: req.file?.secure_url || req.file?.path || "",
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/pending", protect, async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user._id, status: "Pending" }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/my", protect, async (req, res) => {
  try {
    const items = await Item.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/redeem", protect, async (req, res) => {
  try {
    const { accountNumber, points } = req.body;
    
    
    const Redeem = require("../models/Redeem");

    const redeemReq = await Redeem.create({
      userId: req.user._id,
      userName: req.user.name,
      accountNumber,
      points,
    });
    res.status(201).json(redeemReq);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/my-redeems", protect, async (req, res) => {
  try {
    const Redeem = require("../models/Redeem");
    const redeems = await Redeem.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(redeems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
