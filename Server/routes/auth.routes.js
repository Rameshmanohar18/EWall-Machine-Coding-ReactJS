import { Router } from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// Public
router.post("/register", register);
router.post("/login",    login);

// Protected
router.get("/me",           protect, getMe);
router.put("/profile",      protect, updateProfile);
router.put("/password",     protect, changePassword);

export default router;
