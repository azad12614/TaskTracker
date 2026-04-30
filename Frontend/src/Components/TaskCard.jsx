import React from "react";
import "./TaskCard.css";

const IconButton = ({ onClick, label, children }) => (
  <button
    className="tc-icon-btn"
    onClick={onClick}
    aria-label={label}
    title={label}
  >
    {children}
  </button>
);

const TaskCard = ({ task, onEdit, onDelete, view = "grid" }) => {
  const id = task?._id;
  const statusClass =
    (task?.status || "").toLowerCase().replace(/ /g, "-") || "unknown";
  const priorityClass = (task?.priority || "").toLowerCase() || "unknown";
  const severityClass = (task?.severity || "").toLowerCase() || "unknown";

  const dueDisplay = task?.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "N/A";

  return (
    <article
      className={`tl-task-card tc-card ${view === "list" ? "tc-list" : ""} tl-status-${statusClass} tl-priority-${priorityClass} tl-severity-${severityClass}`}
      aria-labelledby={`task-${id}-title`}
    >
      {/* Middle glassy actions for grid view */}
      {view === "grid" && (
        <div className="tc-middle-actions" aria-hidden>
          <IconButton onClick={() => onEdit(task)} label="Edit task">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
                fill="currentColor"
              />
              <path
                d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                fill="currentColor"
              />
            </svg>
          </IconButton>
          <IconButton onClick={() => onDelete(id)} label="Delete task">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 7h12v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7z"
                fill="currentColor"
              />
              <path d="M9 3h6l1 2H8l1-2z" fill="currentColor" />
            </svg>
          </IconButton>
        </div>
      )}
      {/* top-right actions for list view only */}
      {view === "list" && (
        <div className="tc-top-right-actions" aria-hidden>
          <IconButton onClick={() => onEdit(task)} label="Edit task">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
                fill="currentColor"
              />
              <path
                d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                fill="currentColor"
              />
            </svg>
          </IconButton>
          <IconButton onClick={() => onDelete(id)} label="Delete task">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 7h12v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7z"
                fill="currentColor"
              />
              <path d="M9 3h6l1 2H8l1-2z" fill="currentColor" />
            </svg>
          </IconButton>
        </div>
      )}

      <header className="tl-card-header">
        <h3 id={`task-${id}-title`} className="tl-task-title">
          {task?.title || "Untitled"}
        </h3>
        <div className="tl-header-badges">
          <span
            className={`tl-badge tl-task-priority tl-priority-${priorityClass}`}
          >
            {task?.priority || "-"}
          </span>
          <span
            className={`tl-badge tl-task-severity tl-severity-${severityClass}`}
          >
            {task?.severity || "-"}
          </span>
        </div>
      </header>

      <p className="tl-task-description">
        {task?.description || "No description"}
      </p>

      <div className="tl-card-footer-group">
        <div className="tl-task-info-row">
          <span className="tl-task-due-date">
            Due: <strong>{dueDisplay}</strong> {task?.time || ""}
          </span>
          <span className={`tl-task-status tl-status tl-status-${statusClass}`}>
            {task?.status || "Unknown"}
          </span>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
