import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./TaskList.css";

const TaskList = () => {
  const navigate = useNavigate();

  const API_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000"
      : import.meta.env.VITE_API_BASE_URL;

  const { userEmail } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("status");
  const [sortOrder, setSortOrder] = useState("asc");

  const createDateTime = (dueDate, time) => {
    const fullDateTimeString = `${dueDate}T${time || "00:00"}:00`;
    return new Date(fullDateTimeString);
  };

  const sortTasks = (taskList, by, order) => {
    const sorted = [...taskList];
    const statusOrder = {
      "in progress": 0,
      "to do": 1,
      reopened: 2,
      completed: 3,
      canceled: 4,
    };
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const severityOrder = { critical: 0, major: 1, minor: 2 };

    sorted.sort((a, b) => {
      let comparison = 0;
      let valA, valB;

      if (by === "priority") {
        valA = priorityOrder[a.priority?.toLowerCase()] ?? 3;
        valB = priorityOrder[b.priority?.toLowerCase()] ?? 3;
        if (valA === valB) {
          valA = severityOrder[a.severity?.toLowerCase()] ?? 3;
          valB = severityOrder[b.severity?.toLowerCase()] ?? 3;
          if (valA === valB) {
            valA = statusOrder[a.status?.toLowerCase()] ?? 5;
            valB = statusOrder[b.status?.toLowerCase()] ?? 5;
            if (valA === valB) {
              valA = createDateTime(a.dueDate, a.time);
              valB = createDateTime(b.dueDate, b.time);
            }
          }
        }
        comparison = valA - valB;
      } else if (by === "severity") {
        valA = severityOrder[a.severity?.toLowerCase()] ?? 3;
        valB = severityOrder[b.severity?.toLowerCase()] ?? 3;
        if (valA === valB) {
          valA = priorityOrder[a.priority?.toLowerCase()] ?? 3;
          valB = priorityOrder[b.priority?.toLowerCase()] ?? 3;
          if (valA === valB) {
            valA = statusOrder[a.status?.toLowerCase()] ?? 5;
            valB = statusOrder[b.status?.toLowerCase()] ?? 5;
            if (valA === valB) {
              valA = createDateTime(a.dueDate, a.time);
              valB = createDateTime(b.dueDate, b.time);
            }
          }
        }
        comparison = valA - valB;
      } else if (by === "dueDate") {
        valA = createDateTime(a.dueDate, a.time);
        valB = createDateTime(b.dueDate, b.time);
        if (valA === valB) {
          valA = priorityOrder[a.priority?.toLowerCase()] ?? 3;
          valB = priorityOrder[b.priority?.toLowerCase()] ?? 3;
          if (valA === valB) {
            valA = severityOrder[a.severity?.toLowerCase()] ?? 3;
            valB = severityOrder[b.severity?.toLowerCase()] ?? 3;
            if (valA === valB) {
              valA = statusOrder[a.status?.toLowerCase()] ?? 5;
              valB = statusOrder[b.status?.toLowerCase()] ?? 5;
            }
          }
        }
        comparison = valA - valB;
      } else if (by === "status") {
        valA = statusOrder[a.status?.toLowerCase()] ?? 5;
        valB = statusOrder[b.status?.toLowerCase()] ?? 5;
        if (valA === valB) {
          valA = priorityOrder[a.priority?.toLowerCase()] ?? 3;
          valB = priorityOrder[b.priority?.toLowerCase()] ?? 3;
          if (valA === valB) {
            valA = severityOrder[a.severity?.toLowerCase()] ?? 3;
            valB = severityOrder[b.severity?.toLowerCase()] ?? 3;
            if (valA === valB) {
              valA = createDateTime(a.dueDate, a.time);
              valB = createDateTime(b.dueDate, b.time);
            }
          }
        }
        comparison = valA - valB;
      }

      return order === "asc" ? comparison : -comparison;
    });
    return sorted;
  };

  const fetchTasks = async (retries = 2) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/task/all-tasks`);
      const data = response.data;
      if (data.length === 0) {
        setTasks([]);
      } else {
        setTasks(sortTasks(data, sortBy, sortOrder));
      }
    } catch (err) {
      if (
        retries > 0 &&
        err.code !== "ECONNABORTED" &&
        err.response?.status !== 401
      ) {
        setTimeout(() => fetchTasks(retries - 1), 60000);
      } else {
        const errorMsg = err.response?.data?.message || "Failed to load tasks.";
        setError(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    try {
      const response = await axios.delete(
        `${API_URL}/api/task/delete-task/${id}`
      );
      if (response.status != 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setTasks((prevTasks) => {
        const filteredTasks = prevTasks.filter((task) => task._id !== id);
        return sortTasks(filteredTasks, sortBy, sortOrder);
      });
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  const handleEditClick = (task) => {
    navigate(`/your-task`, { state: { taskToEdit: task } });
  };

  const handleSortChange = (e) => {
    const { name, value } = e.target;

    if (name === "sortByType") {
      setSortBy(value);
    } else if (name === "sortByOrder") {
      setSortOrder(value);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [userEmail, sortBy, sortOrder]);

  return (
    <div className="tl-wrapper">
      <div className="tl-list-controls">
        <button
          className="tl-btn-add btn btn-primary"
          onClick={() => navigate("/your-task")}
        >
          + Add New Task
        </button>

        <div className="tl-sort-group">
          <label htmlFor="sortByType" className="tl-label">
            Sort By:
          </label>
          <select
            id="sortByType"
            name="sortByType"
            onChange={handleSortChange}
            className="tl-select"
            value={sortBy}
          >
            <option value="priority">Priority</option>
            <option value="severity">Severity</option>
            <option value="status">Status</option>
            <option value="dueDate">Due Date</option>
          </select>

          <label htmlFor="sortByOrder" className="tl-label">
            Order:
          </label>
          <select
            id="sortByOrder"
            name="sortByOrder"
            onChange={handleSortChange}
            className="tl-select"
            value={sortOrder}
          >
            <option value="asc">ASC</option>
            <option value="desc">DESC</option>
          </select>
        </div>
      </div>

      <h2 className="tl-headline">Your Tasks</h2>

      {isLoading ? (
        <p className="tl-status-message tl-loading">Loading tasks...</p>
      ) : error ? (
        <p className="tl-status-message tl-error">{error}</p>
      ) : tasks.length === 0 ? (
        <div className="tl-status-message tl-no-tasks">
          <p>No tasks yet! Click "Add New Task" to start.</p>
        </div>
      ) : (
        <div className="tl-task-grid">
          {tasks.map((task) => (
            <div
              key={task._id}
              className={`tl-task-card 
                tl-status-${
                  task.status.toLowerCase().replace(/ /g, "-") || "unknown"
                } 
                tl-priority-${task.priority.toLowerCase() || "unknown"}
                tl-severity-${task.severity.toLowerCase() || "unknown"}`}
            >
              <div className="tl-card-header">
                <h3 className="tl-task-title">{task.title}</h3>
                <div className="tl-header-badges">
                  <span
                    className={`tl-task-priority tl-badge tl-priority-${task.priority.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>
                  <span
                    className={`tl-task-severity tl-badge tl-severity-${task.severity.toLowerCase()}`}
                  >
                    {task.severity}
                  </span>
                </div>
              </div>

              <p className="tl-task-description">{task.description}</p>

              <div className="tl-task-footer">
                <span className="tl-task-due-date">
                  Due:{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "N/A"}{" "}
                  {task.time ? task.time : "N/A"}
                </span>
                <span
                  className={`tl-task-status tl-status tl-status-${task.status
                    .toLowerCase()
                    .replace(/ /g, "-")}`}
                >
                  {task.status}
                </span>
              </div>

              <div className="tl-task-actions-overlay">
                <button
                  onClick={() => handleEditClick(task)}
                  className="btn btn-primary tl-tasks-actions"
                  aria-label="Edit Task"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="btn btn-secondary tl-tasks-actions"
                  aria-label="Delete Task"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
