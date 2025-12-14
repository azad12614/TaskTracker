import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./index.css";
import Auth from "./Pages/Auth";
import Home from "./Pages/Home";
import TaskForm from "./Pages/TaskForm";
import TaskList from "./Pages/TaskList";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/your-tasks"
              element={<ProtectedRoute element={<TaskList />} />}
            />
            <Route
              path="/your-task"
              element={<ProtectedRoute element={<TaskForm />} />}
            />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
