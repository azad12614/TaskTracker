import React from "react";
import "./Loading.css";

const logoText = "Task Tracker";

const Loading = () => {
  return (
    <div className="loading-screen-overlay">
      <h1 className="loading-logo">
        {logoText.split("").map((char, index) => (
          <span
            key={index}
            style={{ animationDelay: `${index * 0.1}s` }}
            className="logo-char"
          >
            {char}
          </span>
        ))}
      </h1>
      <p className="loading-message">Loading Session...</p>
    </div>
  );
};

export default Loading;
