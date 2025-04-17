const express = require("express");
const router = express.Router();
const CheckInLog = require("../models/CheckInLog");
const Gym = require("../models/Gym");

// @route   POST /check-in
// @desc    Logs a user check-in to a gym and updates gym's currentCount
// @access  Public (no auth needed)
router.post("/check-in", async (req, res) => {
  try {
    const { userId, gymId } = req.body;

    // 1. Check if the gym exists
    const gym = await Gym.findById(gymId);
    if (!gym) return res.status(404).json({ error: "Gym not found" });

    // 2. Optional: prevent double check-in (user already inside)
    const existingLog = await CheckInLog.findOne({
      userId,
      gym: gymId,
      checkOutTime: null, // user hasn't checked out yet
    });

    if (existingLog) {
      return res.status(400).json({ error: "User already checked in" });
    }

    // 3. Create a new check-in log
    const newLog = new CheckInLog({ userId, gym: gymId });
    await newLog.save();

    // 4. Increment currentCount in Gym
    gym.currentCount += 1;
    await gym.save();

    // 5. Respond with success
    res.status(201).json({
      message: "Check-in successful",
      currentCount: gym.currentCount,
      log: newLog,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ POST /check-out
router.post("/check-out", async (req, res) => {
  try {
    const { userId, gymId } = req.body;

    // 1. Make sure gym exists
    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({ error: "Gym not found" });
    }

    // 2. Find latest open check-in log
    const checkInLog = await CheckInLog.findOne({
      userId,
      gym: gymId,
      checkOutTime: null,
    });

    if (!checkInLog) {
      return res.status(404).json({ error: "No active check-in found for this user" });
    }

    // 3. Set checkOutTime to now
    checkInLog.checkOutTime = new Date();
    await checkInLog.save();

    // 4. Decrement currentCount
    gym.currentCount = Math.max(gym.currentCount - 1, 0); // don't go negative
    await gym.save();

    // 5. Respond with success
    res.status(200).json({
      message: "Check-out successful",
      currentCount: gym.currentCount,
      log: checkInLog,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
