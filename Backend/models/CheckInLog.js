const mongoose = require("mongoose");

const checkInLogSchema = new mongoose.Schema({
  gym: { type: mongoose.Schema.Types.ObjectId, ref: "Gym", required: true },
  userId: { type: String, required: true }, // Unique user identifier (from RFID/barcode)
  checkInTime: { type: Date, default: Date.now },
  checkOutTime: { type: Date }, // Will be set when user checks out
});

module.exports = mongoose.model("CheckInLog", checkInLogSchema);
