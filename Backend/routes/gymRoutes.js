const express = require("express");
const router = express.Router();
const Gym = require("../models/Gym");
const CheckInLog = require("../models/CheckInLog");

router.post("/gyms", async (req, res) => {
    try {
      const { name, location, capacity, isActive, openHours } = req.body;
      const gym = new Gym({ name, location, capacity, isActive, openHours });
      await gym.save();
      res.status(201).json(gym);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.patch("/gyms/:id/crowd", async (req, res) => {
    try {
      const { currentCount } = req.body;
      const gym = await Gym.findByIdAndUpdate(
        req.params.id,
        { currentCount },
        { new: true }
      );
      if (!gym) return res.status(404).json({ error: "Gym not found" });
      res.json(gym);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  router.get("/gyms", async (req, res) => {
    try {
      const gyms = await Gym.find();
  
      const enriched = gyms.map((gym) => {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        const isClosed =
          !gym.isActive ||
          (gym.openHours?.from && gym.openHours?.to &&
            (currentTime < gym.openHours.from || currentTime > gym.openHours.to));
  
        let color = "grey";
        if (!isClosed) {
          const percent = (gym.currentCount / gym.capacity) * 100;
          if (percent < 40) color = "green";
          else if (percent <= 80) color = "yellow";
          else color = "red";
        }
  
        return {
          _id: gym._id,
          name: gym.name,
          location: gym.location,
          capacity: gym.capacity,
          currentCount: gym.currentCount,
          color,
        };
      });
  
      res.json(enriched);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  





  
module.exports = router;
  