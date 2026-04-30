import React from "react";
import TaskCardCompact from "./TaskCardCompact";
import "./TaskBoard.css";

const DEFAULT_COLUMNS = [
  "To Do",
  "In Progress",
  "Completed",
  "Canceled",
  "Reopened",
];

const TaskBoard = ({
  tasks = [],
  onEdit,
  onDelete,
  columns = DEFAULT_COLUMNS,
}) => {
  const byStatus = (status) =>
    tasks.filter(
      (t) => (t.status || "").toLowerCase() === (status || "").toLowerCase(),
    );

  return (
    <div className="tb-board">
      {columns.map((col) => (
        <section key={col} className="tb-column">
          <div className="tb-column-header">
            <h4>{col}</h4>
            <span className="tb-count">{byStatus(col).length}</span>
          </div>
          <div className="tb-column-body">
            {byStatus(col).map((task) => (
              <TaskCardCompact
                key={task._id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                view="grid"
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default TaskBoard;
