const Task = require("../models/Task");

const validateDateTime = (dueDate, time) => {
  const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  if (!dateRegex.test(dueDate)) {
    return { error: true, message: "Invalid date format. Use YYYY-MM-DD." };
  }

  const timeRegex = /^([01]\d|2[0-3]):?([0-5]\d)$/;
  if (time && !timeRegex.test(time)) {
    return { error: true, message: "Invalid time format. Use HH:MM." };
  }

  const fullDateTimeString = `${dueDate}T${time || "00:00"}:00`;
  const inputDate = new Date(fullDateTimeString);

  if (isNaN(inputDate.getTime())) {
    return { error: true, message: "Invalid date or time value." };
  }

  const now = new Date();

  if (inputDate < now) {
    return {
      error: true,
      message:
        "Please try to forget the Past! The date and time must be in the future.",
    };
  }

  return { error: false };
};

const addTask = async (req, res) => {
  const { title, description, priority, severity, dueDate, time, status } =
    req.body;
  const userEmail = req.user.email;

  try {
    const validation = validateDateTime(dueDate, time);
    if (validation.error) {
      return res.status(400).json({ message: validation.message });
    }

    const newTask = new Task({
      title,
      description,
      priority,
      severity,
      dueDate,
      time,
      status,
      userEmail,
    });

    try {
      await newTask.save();
      res.status(200).json({
        message: "Task Added Sucessfully!",
        task: newTask,
      });
    } catch (error) {
      console.error("❌ Error saving task:", error);
      res.status(500).json({
        message: "Sorry! Server is Sleeping!",
      });
    }
  } catch (error) {
    console.error("❌ Task error:", error);
    res
      .status(500)
      .json({ message: "An unexpected error occurred during task creation." });
  }
};

const editTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, severity, dueDate, time, status } =
    req.body;
  const userEmail = req.user.email;

  try {
    if (status != "Completed" && status != "Canceled") {
      const validation = validateDateTime(dueDate, time);
      if (validation.error) {
        return res.status(400).json({ message: validation.message });
      }
    }

    const updateFields = {
      title,
      description,
      priority,
      severity,
      dueDate,
      time,
      status,
    };

    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: id,
        userEmail: userEmail,
      },
      updateFields,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found or you are not authorized to edit this task.",
      });
    }

    res.status(200).json({
      message: "Task Updated Successfully!",
      task: updatedTask,
    });
  } catch (error) {
    console.error("❌ Task update error:", error);
    res
      .status(500)
      .json({ message: "An unexpected error occurred during task update." });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const userEmail = req.user.email;

  try {
    const deletedTask = await Task.deleteOne({
      _id: id,
      userEmail: userEmail,
    });

    if (deletedTask.deletedCount === 0) {
      return res.status(404).json({
        message:
          "Task not found or you are not authorized to delete this task.",
      });
    }

    res.status(200).json({
      message: "Task Deleted Successfully!",
    });
  } catch (error) {
    console.error("❌ Task delete error:", error);
    res
      .status(500)
      .json({ message: "An unexpected error occurred during task remove." });
  }
};

const allTasks = async (req, res) => {
  const userEmail = req.user.email;

  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  const skip = (page - 1) * limit;

  try {
    const totalTasks = await Task.countDocuments({ userEmail });

    const tasks = await Task.find({ userEmail })
      .sort({ dueDate: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      tasks,
      totalPages: Math.ceil(totalTasks / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("❌ Fetch tasks error:", error);
    res
      .status(500)
      .json({ message: "An unexpected error occurred while fetching tasks." });
  }
};

module.exports = {
  addTask,
  editTask,
  deleteTask,
  allTasks,
};
