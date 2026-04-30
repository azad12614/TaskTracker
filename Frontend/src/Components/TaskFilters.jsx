import React from "react";
import "./TaskFilters.css";

const TaskFilters = ({
  search,
  setSearch,
  status,
  setStatus,
  showSearch = true,
  showStatusSelect = true,
}) => {
  return (
    <div className="tf-filters">
      {showSearch && (
        <input
          className="tf-search"
          placeholder="Search title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}

      {showStatusSelect && (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="tf-select"
        >
          <option value="">All</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Canceled">Canceled</option>
          <option value="Reopened">Reopened</option>
        </select>
      )}
    </div>
  );
};

export default TaskFilters;
