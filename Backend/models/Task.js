const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: String, required: true },
  time: { type: String },
  status: { type: String, required: true },
  priority: { type: String, required: true },
  severity: { type: String, required: true },
  userEmail: { type: String, required: true },
});

module.exports = mongoose.model("Task", taskSchema);
