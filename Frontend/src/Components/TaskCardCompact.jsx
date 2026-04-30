import React from "react";
import "./TaskCard.css";
import "./TaskCardCompact.css";

const IconButton = ({ onClick, label, children }) => (
  <button
    type="button"
    className="tc-icon-btn"
    onClick={(event) => {
      event.stopPropagation();
      onClick?.();
    }}
    aria-label={label}
    title={label}
  >
    {children}
  </button>
);

const EditIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor" />
    <path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
  </svg>
);

const DeleteIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 7h12v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7z" fill="currentColor" />
    <path d="M9 3h6l1 2H8l1-2z" fill="currentColor" />
  </svg>
);

const TaskCardCompact = ({
  task,
  onEdit,
  onDelete,
  view = "list",
  expanded = false,
  onToggleExpand,
}) => {
  const id = task?._id;
  const statusClass =
    (task?.status || "").toLowerCase().replace(/ /g, "-") || "unknown";
  const priorityClass = (task?.priority || "").toLowerCase() || "unknown";
  const severityClass = (task?.severity || "").toLowerCase() || "unknown";

  const handleToggle = (e) => {
    if (e.target.closest(".tc-icon-btn")) return;
    onToggleExpand?.();
  };

  return (
    <article
      className={`tl-task-card tc-card tc-compact ${view === "list" ? "tc-list" : ""} ${view === "grid" ? "tc-grid" : ""} tl-status-${statusClass} tl-priority-${priorityClass} tl-severity-${severityClass}`}
      onClick={handleToggle}
      aria-expanded={expanded}
      aria-labelledby={`task-${id}-title`}
    >
      <header className="tl-card-header">
        <h4 id={`task-${id}-title`} className="tl-task-title">
          {task?.title}
        </h4>

        {/* right side of header: badges + action buttons side-by-side */}
        <div className="tc-header-meta">
          <div className="tl-header-badges">
            <span className={`tl-badge tl-task-priority tl-priority-${(task?.priority || "").toLowerCase()}`}>
              {task?.priority}
            </span>
            <span className={`tl-badge tl-task-severity tl-severity-${(task?.severity || "").toLowerCase()}`}>
              {task?.severity}
            </span>
          </div>
          <div className="tc-card-actions">
            <IconButton onClick={() => onEdit?.(task)} label="Edit task">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete?.(id)} label="Delete task">
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      </header>

      {/* description: always in grid, only when expanded in list */}
      {(view === "grid" || expanded) && (
        <p className="tl-task-description">
          {task?.description || "No description"}
        </p>
      )}

      <div className="tl-card-footer-group">
        <div className="tl-task-info-row">
          <span className="tl-task-due-date">
            Due:{" "}
            {task?.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"}
            {task?.time ? ` ${task.time}` : ""}
          </span>
          <span className={`tl-task-status tl-status tl-status-${statusClass}`}>
            {task?.status}
          </span>
        </div>
      </div>
    </article>
  );
};

export default TaskCardCompact;
