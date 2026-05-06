import { Router } from "express";
import {
  getMyNotes,
  getProblemNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/note.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.get("/",                  getMyNotes);
router.get("/:problemId",        getProblemNotes);
router.post("/:problemId",       createNote);
router.put("/:noteId",           updateNote);
router.delete("/:noteId",        deleteNote);

export default router;
