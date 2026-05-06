import { Router } from "express";
import {
  getAllProblems,
  getProblem,
  getProblemsByCategory,
  getCategories,
  getCompanies,
  searchProblems,
  createProblem,
  updateProblem,
  deleteProblem,
} from "../controllers/problem.controller.js";
import { protect, optionalAuth, adminOnly } from "../middleware/auth.middleware.js";

const router = Router();

// Public / optional auth
router.get("/",                    optionalAuth, getAllProblems);
router.get("/search",              optionalAuth, searchProblems);
router.get("/meta/categories",     getCategories);
router.get("/meta/companies",      getCompanies);
router.get("/category/:category",  optionalAuth, getProblemsByCategory);
router.get("/:id",                 optionalAuth, getProblem);

// Admin only
router.post("/",    protect, adminOnly, createProblem);
router.put("/:id",  protect, adminOnly, updateProblem);
router.delete("/:id", protect, adminOnly, deleteProblem);

export default router;
