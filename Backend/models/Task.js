import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, required: true },
    severity: { type: String, required: true },
    dueDate: { type: String, required: true },
    time: { type: String },
    status: { type: String, required: true },
    userEmail: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Task", taskSchema);
