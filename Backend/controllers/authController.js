const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = regex.test(email);

    if (!isValidEmail) {
      return res.status(400).json({
        message: "Email format is invalid.",
      });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("jwt_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      success: true,
      email: admin.email,
      message: "Login successful",
    });
  } catch (error) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error during login." });
  }
};

const logoutAdmin = (req, res) => {
  res.cookie("jwt_token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

const registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (username.length < 3) {
      return res.status(400).json({
        message: "Username must be at least 3 characters long.",
      });
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = regex.test(email);

    if (!isValidEmail) {
      return res.status(400).json({
        message: "Email format is invalid.",
      });
    }

    const minLength = password.length >= 6;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    if (!minLength || !hasUpper || !hasLower || !hasNumber || !hasSymbol) {
      return res.status(400).json({
        message:
          "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { username }],
    });

    if (existingAdmin) {
      return res
        .status(409)
        .json({ message: "Username or email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 11);

    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
    });

    try {
      await newAdmin.save();
      return res.status(201).json({ message: "Admin registered successfully" });
    } catch (saveErr) {
      console.error("❌ Error saving admin:", saveErr);
      return res
        .status(500)
        .json({ message: "Failed to save admin to database." });
    }
  } catch (err) {
    console.error("❌ Register error:", err);
    res
      .status(500)
      .json({ message: "An unexpected error occurred during registration." });
  }
};

module.exports = {
  loginAdmin,
  logoutAdmin,
  registerAdmin,
};
