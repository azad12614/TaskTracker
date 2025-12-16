import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const Home = () => {
  const { isAuthenticated } = useAuth();
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
            <Link to="/your-tasks" className="btn btn-primary">
              Start Managing Tasks
            </Link>
            {!isAuthenticated && (
              <Link to="/auth" className="btn btn-secondary">
                Go To Login
              </Link>
            )}
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
              Quickly add tasks using a comprehensive schema with 7 properties:
              status, priority, severity, and more.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3 className="feature-card-title">Full CRUD Functionality</h3>
            <p className="feature-card-description">
              Easily manage your workflow with simple view, edit, and secure
              deletion options for all tasks.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🕰️</div>
            <h3 className="feature-card-title">Time-Aware Validation</h3>
            <p className="feature-card-description">
              Tasks cannot be created or edited for a date or time that has
              already passed, helping you focus forward.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3 className="feature-card-title">Dynamic Sorting Engine</h3>
            <p className="feature-card-description">
              Tasks are automatically sorted by priority, severity, status, and
              due date to ensure you see the most critical items first.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3 className="feature-card-title">JWT Secure Authentication</h3>
            <p className="feature-card-description">
              User sessions are secured using JWT and HttpOnly cookies,
              providing a robust and safe experience against XSS attacks.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚙️</div>
            <h3 className="feature-card-title">Modern MERN Stack</h3>
            <p className="feature-card-description">
              Built on MongoDB, Express, React, and Node.js for high
              performance, utilizing a modern, scalable architecture.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
