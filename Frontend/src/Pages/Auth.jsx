import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [show, setShow] = useState(true);
  const [showPassword, setShowPassword] = useState("0");
  const [error, setError] = useState("");

  const [formUp, setFormUp] = useState({
    username: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const [formIn, setFormIn] = useState({
    email: "",
    password: "",
  });

  const BASE_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:5000"
      : import.meta.env.VITE_API_BASE_URL;

  const handleChangeUp = (e) => {
    setFormUp({ ...formUp, [e.target.name]: e.target.value });
  };

  const handleChangeIn = (e) => {
    setFormIn({ ...formIn, [e.target.name]: e.target.value });
  };

  const handleSubmitUp = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(`${BASE_URL}/api/admin/register`, formUp);
      alert("✅ Registration successful! Now Please Login!");
      setShow(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  const handleSubmitIn = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(formIn);
    if (result.success) {
      alert("✅ Login successful!");
      navigate("/your-tasks");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="Auth-Contrainer">
      <div
        className={show ? "RevealLayer reveal-in" : "RevealLayer reveal-up"}
      />
      <div className={show ? "Sign-in Form Show" : "Sign-in Form"}>
        <h1>Welcome Back</h1>
        <p>Please Sign-in to continue!</p>
        <form className="Form-in" onSubmit={handleSubmitIn}>
          <div>
            <input
              type="email"
              name="email"
              id="emailIn"
              placeholder="Email"
              value={formIn.email}
              onChange={handleChangeIn}
              required
            />
            <label htmlFor="emailIn">Email</label>
          </div>
          <div>
            <input
              type={showPassword == "1" ? "text" : "password"}
              name="password"
              id="passwordIn"
              placeholder="Password"
              value={formIn.password}
              onChange={handleChangeIn}
              required
            />
            <label htmlFor="passwordIn">Password</label>
            <span
              className="toggle-icon"
              onClick={() => {
                setShowPassword(showPassword == "1" ? "0" : "1");
              }}
            >
              {showPassword == "1" ? "👁️" : "🙈"}
            </span>
          </div>
          <p className="error">{error}</p>
          {/* <p>Forget your Password?</p> */}
          <button type="submit" className="btn btn-primary">
            Signin
          </button>
          <p className="account-text">
            Don't have an account?{" "}
            <span
              onClick={() => {
                setShow(false);
                setError("");
              }}
            >
              Signup
            </span>
          </p>
        </form>
      </div>
      <div className={show ? "Sign-up Form" : "Sign-up Form Show"}>
        <h1>Create Account</h1>
        <p>Please sign-up to continue!</p>
        <form className="Form-up" onSubmit={handleSubmitUp}>
          <div>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Full Name"
              value={formUp.username}
              onChange={handleChangeUp}
              required
            />
            <label htmlFor="username">Full Name</label>
          </div>
          <div>
            <input
              type="email"
              name="email"
              id="emailUp"
              placeholder="Email"
              value={formUp.email}
              onChange={handleChangeUp}
              required
            />
            <label htmlFor="emailUp">Email</label>
          </div>
          <div>
            <input
              type={showPassword == "2" ? "text" : "password"}
              name="password"
              id="passwordUp"
              placeholder="Password"
              value={formUp.password}
              onChange={handleChangeUp}
              required
            />
            <label htmlFor="passwordUp">Password</label>

            <span
              className="toggle-icon"
              onClick={() => {
                setShowPassword(showPassword == "2" ? "0" : "2");
              }}
            >
              {showPassword == "2" ? "👁️" : "🙈"}
            </span>
          </div>
          <div>
            <input
              type={showPassword == "3" ? "text" : "password"}
              name="cpassword"
              id="cpassword"
              placeholder="Confirm Password"
              value={formUp.cpassword}
              onChange={handleChangeUp}
              required
            />
            <label htmlFor="cpassword">Confirm Password</label>

            <span
              className="toggle-icon"
              onClick={() => {
                setShowPassword(showPassword == "3" ? "0" : "3");
              }}
            >
              {showPassword == "3" ? "👁️" : "🙈"}
            </span>
          </div>
          <p className="error">{error}</p>
          <button type="submit" className="btn btn-primary">
            Signup
          </button>
          <p className="account-text">
            Already have an account?{" "}
            <span
              onClick={() => {
                setShow(true);
                setError("");
              }}
            >
              Signin
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
