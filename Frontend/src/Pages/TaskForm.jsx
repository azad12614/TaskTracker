import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./TaskForm.css";

const TaskForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userEmail } = useAuth();

  const taskToEdit = location.state?.taskToEdit;

  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000"
      : import.meta.env.VITE_API_BASE_URL;

  const initialFormData = {
    title: "",
    description: "",
    dueDate: "",
    time: "",
    status: "To Do",
    priority: "Medium",
    severity: "Major",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "", show: false });

  const isEditing = !!taskToEdit;
  const headline = isEditing ? "Edit Task" : "Add New Task";
  const buttonText = isEditing ? "Update Task" : "Create Task";

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title || "",
        description: taskToEdit.description || "",
        dueDate: taskToEdit.dueDate,
        time: taskToEdit.time,
        status: taskToEdit.status || "To Do",
        priority: taskToEdit.priority || "Medium",
        severity: taskToEdit.severity || "Major",
      });
    } else {
      setFormData(initialFormData);
    }

    /* Prevent Past Date Selection */
    const dateInput = document.getElementById("dueDate");
    if (!dateInput) throw new Error("Date input not found");

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    const todayStr = `${yyyy}-${mm}-${dd}`;

    dateInput.setAttribute("min", todayStr);
  }, [navigate, taskToEdit]);

  const showToast = (message, type = "success") => {
    setToast({ message, type, show: true });
    setTimeout(() => {
      setToast({ message: "", type: "", show: false });
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!userEmail) {
      showToast("User not authenticated. Please log in.", "error");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      userEmail,
    };

    try {
      if (isEditing) {
        await axios.put(
          `${API_URL}/api/task/edit-task/${taskToEdit._id}`,
          payload
        );
        showToast("Task updated successfully!", "success");
        setFormData(initialFormData);
      } else {
        await axios.post(`${API_URL}/api/task/add-task`, payload);
        showToast("Task created successfully!", "success");
        setFormData(initialFormData);
      }

      setTimeout(() => navigate("/your-tasks", { replace: true }), 1500);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        `Failed to ${isEditing ? "update" : "create"} task.`;
      showToast(message, "error");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tf-wrapper">
      <div
        className="tf-toast-notification"
        data-show={toast.show}
        data-type={toast.type}
      >
        {toast.message}
      </div>

      <div className="tf-form-section">
        <h2 className="tf-headline">{headline}</h2>

        <form onSubmit={handleSubmit} className="tf-task-form">
          {/* Title */}
          <div className="tf-form-group">
            <label htmlFor="title" className="tf-label">
              Task Title <span>*</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="tf-input"
              placeholder="e.g., Deploy production hotfix"
              maxLength="100"
            />
          </div>

          {/* Description */}
          <div className="tf-form-group">
            <label htmlFor="description" className="tf-label">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="tf-textarea"
              placeholder="Detailed steps or notes for the task..."
            ></textarea>
          </div>

          <div className="tf-form-row">
            {/* Priority */}
            <div className="tf-form-group">
              <label htmlFor="priority" className="tf-label">
                Priority <span>*</span>
              </label>
              <select
                name="priority"
                id="priority"
                value={formData.priority}
                onChange={handleChange}
                className="tf-select"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Severity  */}
            <div className="tf-form-group">
              <label htmlFor="severity" className="tf-label">
                Severity <span>*</span>
              </label>
              <select
                name="severity"
                id="severity"
                value={formData.severity}
                onChange={handleChange}
                className="tf-select"
              >
                <option value="Critical">Critical</option>
                <option value="Major">Major</option>
                <option value="Minor">Minor</option>
              </select>
            </div>
          </div>

          <div className="tf-form-row">
            {/* Due Date */}
            <div className="tf-form-group">
              <label htmlFor="dueDate" className="tf-label">
                Due Date <span>*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                id="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="tf-input"
              />
            </div>

            <div className="tf-form-group">
              <label htmlFor="time" className="tf-label">
                Time
              </label>
              <input
                type="time"
                name="time"
                id="time"
                value={formData.time}
                onChange={handleChange}
                className="tf-input"
              />
            </div>
          </div>

          {/* Status (Only visible when editing) */}
          {isEditing && (
            <div className="tf-form-row">
              <div className="tf-form-group">
                <label htmlFor="status" className="tf-label">
                  Status <span>*</span>
                </label>
                <select
                  name="status"
                  id="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="tf-select"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Canceled">Canceled</option>
                  <option value="Reopened">Reopened</option>
                </select>
              </div>
            </div>
          )}

          <div className="tf-actions">
            <button
              type="submit"
              className={`btn btn-primary tf-btn-submit`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : buttonText}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate("/your-tasks", { replace: true })}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
