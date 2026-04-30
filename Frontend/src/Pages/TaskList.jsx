import axios from "axios";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./TaskList.css";
import TaskCardCompact from "../Components/TaskCardCompact";
import TaskBoard from "../Components/TaskBoard";
import TaskFilters from "../Components/TaskFilters";
import ConfirmModal from "../Components/ConfirmModal";

const TaskList = () => {
  const navigate = useNavigate();
  const { userEmail } = useAuth();

  const API_URL = useMemo(
    () =>
      import.meta.env.MODE === "development"
        ? "http://localhost:5000"
        : import.meta.env.VITE_API_BASE_URL,
    [],
  );

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("status");
  const [sortOrder, setSortOrder] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // user requested 10 per page

  // filters (only visible in list view)
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // task id pending delete
  const taskToDelete = tasks.find((t) => t._id === deleteConfirm) || null;

  const renderSkeletons = (count = 6) => {
    return Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`tl-task-card tc-card tc-skeleton ${viewMode === "list" ? "tc-list" : ""}`}
      ></div>
    ));
  };

  const sortTasks = useCallback((taskList, by, order) => {
    const createDateTime = (dueDate, time) => {
      const fullDateTimeString = `${dueDate}T${time || "00:00"}:00`;
      return new Date(fullDateTimeString);
    };

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
        if (Number(valA) === Number(valB)) {
          valA = severityOrder[a.severity?.toLowerCase()] ?? 3;
          valB = severityOrder[b.severity?.toLowerCase()] ?? 3;
          if (Number(valA) === Number(valB)) {
            valA = statusOrder[a.status?.toLowerCase()] ?? 5;
            valB = statusOrder[b.status?.toLowerCase()] ?? 5;
            if (Number(valA) === Number(valB)) {
              valA = createDateTime(a.dueDate, a.time);
              valB = createDateTime(b.dueDate, b.time);
            }
          }
        }
        comparison = valA - valB;
      } else if (by === "severity") {
        valA = severityOrder[a.severity?.toLowerCase()] ?? 3;
        valB = severityOrder[b.severity?.toLowerCase()] ?? 3;
        if (Number(valA) === Number(valB)) {
          valA = priorityOrder[a.priority?.toLowerCase()] ?? 3;
          valB = priorityOrder[b.priority?.toLowerCase()] ?? 3;
          if (Number(valA) === Number(valB)) {
            valA = statusOrder[a.status?.toLowerCase()] ?? 5;
            valB = statusOrder[b.status?.toLowerCase()] ?? 5;
            if (Number(valA) === Number(valB)) {
              valA = createDateTime(a.dueDate, a.time);
              valB = createDateTime(b.dueDate, b.time);
            }
          }
        }
        comparison = valA - valB;
      } else if (by === "dueDate") {
        valA = createDateTime(a.dueDate, a.time);
        valB = createDateTime(b.dueDate, b.time);
        if (Number(valA) === Number(valB)) {
          valA = priorityOrder[a.priority?.toLowerCase()] ?? 3;
          valB = priorityOrder[b.priority?.toLowerCase()] ?? 3;
          if (Number(valA) === Number(valB)) {
            valA = severityOrder[a.severity?.toLowerCase()] ?? 3;
            valB = severityOrder[b.severity?.toLowerCase()] ?? 3;
            if (Number(valA) === Number(valB)) {
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
  }, []);

  useEffect(() => {
    const fetchTasks = async (retries = 2) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `${API_URL}/api/tasks?page=${currentPage}&limit=${limit}`,
          { withCredentials: true },
        );

        // Expecting { tasks: [], totalPages: X, currentPage: Y } from backend
        const data = res.data.tasks;
        const pages = res.data.totalPages;

        if (data.length === 0) {
          setTasks([]);
        } else {
          setTasks(sortTasks(data, sortBy, sortOrder));
        }
        setTotalPages(pages);
      } catch (err) {
        if (
          retries > 0 &&
          err.code !== "ECONNABORTED" &&
          err.response?.status !== 401
        ) {
          setTimeout(() => fetchTasks(retries - 1), 60000);
        } else {
          const errorMsg =
            err.response?.data?.message || "Failed to load tasks.";
          setError(errorMsg);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [userEmail, sortBy, sortOrder, currentPage, API_URL, sortTasks]);

  const handleEditClick = (task) => {
    navigate(`/your-task`, { state: { taskToEdit: task } });
  };

  const handleToggleExpand = (taskId) => {
    setExpandedTaskId((current) => (current === taskId ? null : taskId));
  };

  const deleteTask = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    const id = deleteConfirm;
    setDeleteConfirm(null);
    try {
      const response = await axios.delete(`${API_URL}/api/tasks/${id}`, {
        withCredentials: true,
      });
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

  const handleSortChange = (e) => {
    const { name, value } = e.target;

    if (name === "sortByType") {
      setSortBy(value);
    } else if (name === "sortByOrder") {
      setSortOrder(value);
    }
  };

  return (
    <div className="tl-wrapper">
      <div
        className={`tl-list-controls ${viewMode === "list" ? "view-list" : ""}`}
      >
        <button
          className="tl-btn-add btn btn-primary"
          onClick={() => navigate("/your-task")}
        >
          + Add New Task
        </button>

        {/* top sort removed — sorting is available only in List view filter row */}

        <div className="tl-view-group" role="tablist" aria-label="View toggle">
          <button
            className={`btn ${viewMode === "grid" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setViewMode("grid")}
            aria-pressed={viewMode === "grid"}
            title="Grid view"
          >
            ▦
          </button>
          <button
            className={`btn ${viewMode === "list" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setViewMode("list")}
            aria-pressed={viewMode === "list"}
            title="List view"
          >
            ☰
          </button>
        </div>
      </div>

      {deleteConfirm && (
        <ConfirmModal
          title="Are you sure?"
          message={
            taskToDelete
              ? `Delete task "${taskToDelete.title}" permanently?`
              : "Delete this task permanently?"
          }
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      <h2 className="tl-headline">Your Tasks</h2>

      {isLoading ? (
        <div className="tl-task-grid">{renderSkeletons(limit)}</div>
      ) : error ? (
        <p className="tl-status-message tl-error">{error}</p>
      ) : tasks.length === 0 ? (
        <div className="tl-empty-state" role="status">
          <h3>No tasks yet</h3>
          <p>Create your first task to get started. Click the button above.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/your-task")}
          >
            Add First Task
          </button>
        </div>
      ) : (
        <>
          {viewMode === "list" && (
            <div className="tl-list-filter-row">
              <TaskFilters
                showSearch={true}
                showStatusSelect={false}
                search={searchQuery}
                setSearch={setSearchQuery}
              />

              <div className="tl-sort-inline">
                <label htmlFor="sortByTypeInline" className="tl-label">
                  Sort By:
                </label>
                <select
                  id="sortByTypeInline"
                  name="sortByType"
                  onChange={handleSortChange}
                  className="tl-select"
                  value={sortBy}
                  aria-label="Sort by"
                >
                  <option value="priority">Priority</option>
                  <option value="severity">Severity</option>
                  <option value="status">Status</option>
                  <option value="dueDate">Due Date</option>
                </select>

                <label htmlFor="sortByOrderInline" className="tl-label">
                  Order:
                </label>
                <select
                  id="sortByOrderInline"
                  name="sortByOrder"
                  onChange={handleSortChange}
                  className="tl-select"
                  value={sortOrder}
                  aria-label="Sort order"
                >
                  <option value="asc">ASC</option>
                  <option value="desc">DESC</option>
                </select>
              </div>

              <TaskFilters
                showSearch={false}
                showStatusSelect={true}
                status={filterStatus}
                setStatus={setFilterStatus}
              />
            </div>
          )}

          {viewMode === "grid" ? (
            <TaskBoard
              tasks={tasks}
              onEdit={handleEditClick}
              onDelete={deleteTask}
            />
          ) : (
            <div className={`tl-task-grid tl-list-view`}>
              {tasks
                .filter((t) => {
                  if (filterStatus && filterStatus !== "")
                    return (t.status || "") === filterStatus;
                  if (searchQuery && searchQuery.trim() !== "")
                    return (t.title || "")
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase());
                  return true;
                })
                .map((task) => (
                  <TaskCardCompact
                    key={task._id}
                    task={task}
                    onEdit={handleEditClick}
                    onDelete={deleteTask}
                    view={viewMode}
                    expanded={expandedTaskId === task._id}
                    onToggleExpand={() => handleToggleExpand(task._id)}
                  />
                ))}
            </div>
          )}
        </>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="tl-pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="btn btn-secondary tl-pagination-btn"
          >
            Previous
          </button>

          <div className="tl-page-numbers">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`tl-page-num ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="btn btn-secondary tl-pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskList;
