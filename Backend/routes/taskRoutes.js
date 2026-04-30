import express from "express";
import {
  addTask,
  editTask,
  allTasks,
  deleteTask,
} from "../controllers/taskController.js";
const router = express.Router();
import { protect } from "../middleware/authMiddleware.js";

router.post("/task", protect, addTask);
router.put("/:id", protect, editTask);
router.delete("/:id", protect, deleteTask);
router.get("/", protect, allTasks);

export default router;
