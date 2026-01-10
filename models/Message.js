const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  content: { type: String, required: true },
  deleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", MessageSchema);
