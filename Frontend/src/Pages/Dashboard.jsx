import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Pending",
    priority: "Medium",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "", show: false });

  const userEmail = localStorage.getItem("userEmail");

  const showToast = (message, type = "success") => {
    setToast({ message, type, show: true });
    setTimeout(() => {
      setToast({ message: "", type: "", show: false });
    }, 3000);
  };

  const sortTasks = (taskList) => {
    const statusOrder = { pending: 0, completed: 1 };
    const priorityOrder = { high: 0, medium: 1, low: 2 };

    return [...taskList].sort((a, b) => {
      const statusA = a.status?.toLowerCase();
      const statusB = b.status?.toLowerCase();
      if (statusOrder[statusA] !== statusOrder[statusB]) {
        return statusOrder[statusA] - statusOrder[statusB];
      }

      const priorityA = a.priority?.toLowerCase();
      const priorityB = b.priority?.toLowerCase();
      if (priorityOrder[priorityA] !== priorityOrder[priorityB]) {
        return priorityOrder[priorityA] - priorityOrder[priorityB];
      }

      const dateA = new Date(a.dueDate || Infinity);
      const dateB = new Date(b.dueDate || Infinity);
      if (dateA - dateB !== 0) return dateA - dateB;

      return 0;
    });
  };

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/tasks?email=${userEmail}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(sortTasks(data));
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError("Failed to load tasks. Please try again.");
      showToast("Failed to load tasks.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (task) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newTask = await response.json();
      setTasks((prevTasks) => sortTasks([...prevTasks, newTask]));
      showToast("Task added successfully!", "success");
    } catch (err) {
      console.error("Failed to add task:", err);
      setError("Failed to add task. Please try again.");
      showToast("Failed to add task.", "error");
    }
  };

  const updateTask = async (id, updatedFields) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        sortTasks(
          prevTasks.map((task) => (task._id === id ? updatedTask : task))
        )
      );
      showToast("Task updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update task:", err);
      setError("Failed to update task. Please try again.");
      showToast("Failed to update task.", "error");
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    try {
      const response = await fetch(`/api/tasks/${id}?email=${userEmail}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
      showToast("Task deleted successfully!", "success");
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError("Failed to delete task. Please try again.");
      showToast("Failed to delete task.", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast("Task title cannot be empty.", "error");
      return;
    }

    const dataToSend = { ...formData, userEmail: userEmail };

    if (editingTask) {
      await updateTask(editingTask._id, dataToSend);
      setEditingTask(null);
    } else {
      await addTask(dataToSend);
    }
    clearForm();
  };

  const clearForm = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      status: "Pending",
      priority: "Medium",
    });
    setEditingTask(null);
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
      status: task.status,
      priority: task.priority,
    });
  };

  useEffect(() => {
    if (userEmail) {
      fetchTasks();
    }
  }, [userEmail]);

  return (
    <div className="dashboard-wrapper">
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.message}
        </div>
      )}

      <section className="task-form-section">
        <h2 className="section-headline">
          {editingTask ? "Edit Task" : "Add New Task"}
        </h2>
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Buy groceries"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="e.g., Milk, eggs, bread, fruits"
              rows="3"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date:</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="due-date"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority:</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingTask ? "Update Task" : "Add Task"}
            </button>
            {editingTask && (
              <button
                type="button"
                onClick={clearForm}
                className="btn btn-secondary"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="task-list-section">
        <h2 className="section-headline">Your Tasks</h2>
        {isLoading ? (
          <p className="loading-message">Loading tasks...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : tasks.length === 0 ? (
          <p className="no-tasks-message">No tasks yet! Add one above.</p>
        ) : (
          <div className="task-grid">
            {tasks.map((task) => (
              <div
                key={task._id}
                className={`task-card status-${task.status.toLowerCase()} priority-${task.priority.toLowerCase()}`}
              >
                <h3 className="task-title">{task.title}</h3>
                <p className="task-description">{task.description}</p>
                <div className="task-details">
                  <span className="detail-item">
                    <strong>Due:</strong>{" "}
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                  <span
                    className={`detail-item status-${task.status.toLowerCase()}`}
                  >
                    <strong>Status:</strong> {task.status}
                  </span>
                  <span
                    className={`detail-item priority-${task.priority.toLowerCase()}`}
                  >
                    <strong>Priority:</strong> {task.priority}
                  </span>
                </div>
                <div className="task-actions">
                  <button
                    onClick={() => handleEditClick(task)}
                    className="btn btn-edit"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="btn btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
