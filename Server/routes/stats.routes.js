import { Router } from "express";
import {
  getDashboardStats,
  getLeaderboard,
  getProblemStats,
} from "../controllers/stats.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/dashboard",  protect, getDashboardStats);
router.get("/leaderboard",         getLeaderboard);
router.get("/problems",            getProblemStats);

export default router;
