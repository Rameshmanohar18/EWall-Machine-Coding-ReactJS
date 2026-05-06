import Note    from "../models/Note.model.js";
import Problem from "../models/Problem.model.js";

// ── Get all notes for current user ────────────────────────────
// GET /api/notes
export const getMyNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user.id })
      .populate("problem", "title category difficulty")
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: notes.length, notes });
  } catch (err) {
    next(err);
  }
};

// ── Get notes for a specific problem ─────────────────────────
// GET /api/notes/:problemId
export const getProblemNotes = async (req, res, next) => {
  try {
    const problem = await Problem.findOne({ problemId: req.params.problemId });
    if (!problem) return res.status(404).json({ success: false, message: "Problem not found" });

    const notes = await Note.find({ user: req.user.id, problem: problem._id })
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: notes.length, notes });
  } catch (err) {
    next(err);
  }
};

// ── Create note ───────────────────────────────────────────────
// POST /api/notes/:problemId
export const createNote = async (req, res, next) => {
  try {
    const { content, tags, isPrivate } = req.body;

    const problem = await Problem.findOne({ problemId: req.params.problemId });
    if (!problem) return res.status(404).json({ success: false, message: "Problem not found" });

    const note = await Note.create({
      user:      req.user.id,
      problem:   problem._id,
      problemId: req.params.problemId,
      content,
      tags:      tags || [],
      isPrivate: isPrivate !== undefined ? isPrivate : true,
    });

    res.status(201).json({ success: true, note });
  } catch (err) {
    next(err);
  }
};

// ── Update note ───────────────────────────────────────────────
// PUT /api/notes/:noteId
export const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.noteId, user: req.user.id });
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    const { content, tags, isPrivate } = req.body;
    if (content   !== undefined) note.content   = content;
    if (tags      !== undefined) note.tags      = tags;
    if (isPrivate !== undefined) note.isPrivate = isPrivate;

    await note.save();
    res.json({ success: true, note });
  } catch (err) {
    next(err);
  }
};

// ── Delete note ───────────────────────────────────────────────
// DELETE /api/notes/:noteId
export const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.noteId, user: req.user.id });
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    res.json({ success: true, message: "Note deleted" });
  } catch (err) {
    next(err);
  }
};
