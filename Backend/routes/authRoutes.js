import express from "express";
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
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

export default router;
