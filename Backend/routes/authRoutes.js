const express = require("express");
const {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/login", loginAdmin);
router.post("/register", registerAdmin);
router.post("/logout", protect, logoutAdmin);

router.get("/session", protect, (req, res) => {
  res.status(200).json({
    message: "Session valid",
    email: req.user.email,
  });
});

module.exports = router;
