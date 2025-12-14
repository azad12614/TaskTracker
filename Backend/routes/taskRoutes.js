const express = require("express");
const {
  addTask,
  editTask,
  allTasks,
  deleteTask,
} = require("../controllers/taskController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.post("/add-task", protect, addTask);
router.put("/edit-task/:id", protect, editTask);
router.delete("/delete-task/:id", protect, deleteTask);
router.get("/all-tasks", protect, allTasks);

module.exports = router;
