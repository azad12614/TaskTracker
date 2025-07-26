import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-wrapper">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Organize Your Day, <br /> Accomplish Your Goals.
          </h1>
          <p className="hero-description">
            TaskTracker is your ultimate tool for managing tasks, boosting
            productivity, and staying on top of your deadlines. Simple,
            intuitive, and effective.
          </p>
          <div className="hero-buttons">
            <Link to="/dashboard" className="btn btn-primary">
              Start Managing Tasks
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Go To Login
            </Link>
          </div>
        </div>
      </section>
      <section className="features-section">
        <h2 className="features-headline">Why Choose TaskTracker?</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3 className="feature-card-title">Effortless Task Creation</h3>
            <p className="feature-card-description">
              Quickly add tasks with all essential details: title, description,
              due date, status, and priority.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3 className="feature-card-title">Intuitive Task Management</h3>
            <p className="feature-card-description">
              View, edit, and delete tasks with a user-friendly interface. Keep
              your list clean and up-to-date.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-card-title">Stay Organized & Focused</h3>
            <p className="feature-card-description">
              Prioritize your workload with 'Low', 'Medium', and 'High' settings
              to tackle what's most important.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3 className="feature-card-title">Smart Task Sorting</h3>
            <p className="feature-card-description">
              Tasks are automatically sorted by status, priority, and due date —
              so you always see the most urgent and important items first.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3 className="feature-card-title">Track Your Progress</h3>
            <p className="feature-card-description">
              Mark tasks as 'Pending' or 'Completed' to visualize your
              achievements and maintain momentum.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
