const express = require("express");
const {
  addTask,
  editTask,
  allTasks,
  deleteTask,
} = require("../controllers/taskController");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.post("/task", protect, addTask);
router.put("/:id", protect, editTask);
router.delete("/:id", protect, deleteTask);
router.get("/", protect, allTasks);

module.exports = router;
