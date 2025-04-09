const mongoose = require("mongoose");

const gymSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: { type: String, default: "Point" },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  capacity: { type: Number, required: true }, // Max gym capacity
  currentCount: { type: Number, default: 0 }, // People currently inside
  isActive: { type: Boolean, default: true }, // Is the gym operating
  openHours: {
    from: { type: String }, // e.g. "06:00"
    to: { type: String },   // e.g. "22:00"
  },
});

gymSchema.index({ location: "2dsphere" }); // Enables geospatial queries

module.exports = mongoose.model("Gym", gymSchema);
