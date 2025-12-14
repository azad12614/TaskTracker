import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(() => {
    const savedEmail = localStorage.getItem("userEmail");
    return savedEmail || "";
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const BASE_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000"
      : import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/session`);

        const email = localStorage.getItem("userEmail") || res.data.email;

        setUserEmail(email);
        setIsAuthenticated(true);
      } catch (error) {
        setUserEmail("");
        localStorage.removeItem("userEmail");
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async ({ email, password }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/admin/login`, {
        email,
        password,
      });

      setUserEmail(res.data.email);
      localStorage.setItem("userEmail", res.data.email);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      setIsAuthenticated(false);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/admin/logout`); // Server clears the cookie
    } catch (error) {
      console.error("Error during server logout", error);
    } finally {
      setIsAuthenticated(false);
      setUserEmail("");
      localStorage.removeItem("userEmail");
    }
  };

  if (isLoading) {
    return <div>Loading session...</div>;
  }

  return (
    <AuthContext.Provider value={{ userEmail, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
