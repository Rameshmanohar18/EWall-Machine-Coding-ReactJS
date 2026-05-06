import { Router } from "express";
import {
  getMyProgress,
  getProblemProgress,
  updateProgress,
  toggleBookmark,
  getBookmarks,
  resetProgress,
} from "../controllers/progress.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// All progress routes require authentication
router.use(protect);

router.get("/",                          getMyProgress);
router.get("/bookmarks",                 getBookmarks);
router.get("/:problemId",                getProblemProgress);
router.put("/:problemId",                updateProgress);
router.patch("/:problemId/bookmark",     toggleBookmark);
router.delete("/:problemId",             resetProgress);

export default router;
