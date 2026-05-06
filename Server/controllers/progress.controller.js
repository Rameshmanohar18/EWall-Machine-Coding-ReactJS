import Progress from "../models/Progress.model.js";
import Problem  from "../models/Problem.model.js";
import User     from "../models/User.model.js";

// ── Get all progress for current user ─────────────────────────
// GET /api/progress
export const getMyProgress = async (req, res, next) => {
  try {
    const { status, bookmarked } = req.query;
    const filter = { user: req.user.id };
    if (status)    filter.status    = status;
    if (bookmarked) filter.bookmarked = bookmarked === "true";

    const progress = await Progress.find(filter)
      .populate("problem", "title category difficulty companies tags order")
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: progress.length, progress });
  } catch (err) {
    next(err);
  }
};

// ── Get progress for a specific problem ───────────────────────
// GET /api/progress/:problemId
export const getProblemProgress = async (req, res, next) => {
  try {
    const problem = await Problem.findOne({ problemId: req.params.problemId });
    if (!problem) return res.status(404).json({ success: false, message: "Problem not found" });

    let progress = await Progress.findOne({ user: req.user.id, problem: problem._id });

    if (!progress) {
      // Return default (not started)
      return res.json({
        success: true,
        progress: {
          problemId: req.params.problemId,
          status: "not_started",
          attempts: 0,
          timeSpentMinutes: 0,
          bookmarked: false,
          selfRating: null,
        },
      });
    }

    res.json({ success: true, progress });
  } catch (err) {
    next(err);
  }
};

// ── Update / create progress ──────────────────────────────────
// PUT /api/progress/:problemId
export const updateProgress = async (req, res, next) => {
  try {
    const { status, timeSpentMinutes, selfRating, bookmarked } = req.body;

    const problem = await Problem.findOne({ problemId: req.params.problemId });
    if (!problem) return res.status(404).json({ success: false, message: "Problem not found" });

    const update = {};
    if (status !== undefined)           update.status           = status;
    if (timeSpentMinutes !== undefined)  update.timeSpentMinutes = timeSpentMinutes;
    if (selfRating !== undefined)        update.selfRating       = selfRating;
    if (bookmarked !== undefined)        update.bookmarked       = bookmarked;

    update.lastAttemptAt = new Date();
    update.$inc = { attempts: 1 };

    if (status === "completed") {
      update.completedAt = new Date();
      // Increment problem solve count
      await Problem.findByIdAndUpdate(problem._id, { $inc: { solveCount: 1 } });
    }

    const progress = await Progress.findOneAndUpdate(
      { user: req.user.id, problem: problem._id },
      { ...update, problemId: req.params.problemId },
      { new: true, upsert: true, runValidators: true }
    );

    // Update user streak
    await updateStreak(req.user.id);

    res.json({ success: true, progress });
  } catch (err) {
    next(err);
  }
};

// ── Toggle bookmark ───────────────────────────────────────────
// PATCH /api/progress/:problemId/bookmark
export const toggleBookmark = async (req, res, next) => {
  try {
    const problem = await Problem.findOne({ problemId: req.params.problemId });
    if (!problem) return res.status(404).json({ success: false, message: "Problem not found" });

    const existing = await Progress.findOne({ user: req.user.id, problem: problem._id });
    const newBookmarked = existing ? !existing.bookmarked : true;

    const progress = await Progress.findOneAndUpdate(
      { user: req.user.id, problem: problem._id },
      { bookmarked: newBookmarked, problemId: req.params.problemId },
      { new: true, upsert: true }
    );

    res.json({ success: true, bookmarked: progress.bookmarked, progress });
  } catch (err) {
    next(err);
  }
};

// ── Get bookmarked problems ───────────────────────────────────
// GET /api/progress/bookmarks
export const getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Progress.find({ user: req.user.id, bookmarked: true })
      .populate("problem", "title category difficulty companies tags order")
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: bookmarks.length, bookmarks });
  } catch (err) {
    next(err);
  }
};

// ── Reset progress for a problem ─────────────────────────────
// DELETE /api/progress/:problemId
export const resetProgress = async (req, res, next) => {
  try {
    const problem = await Problem.findOne({ problemId: req.params.problemId });
    if (!problem) return res.status(404).json({ success: false, message: "Problem not found" });

    await Progress.findOneAndUpdate(
      { user: req.user.id, problem: problem._id },
      { status: "not_started", attempts: 0, timeSpentMinutes: 0, completedAt: null, selfRating: null },
      { new: true }
    );

    res.json({ success: true, message: "Progress reset" });
  } catch (err) {
    next(err);
  }
};

// ── Helper: update streak ─────────────────────────────────────
async function updateStreak(userId) {
  const user = await User.findById(userId);
  const today = new Date().toDateString();
  const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate).toDateString() : null;
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (lastActive === today) return; // already active today

  const newStreak = lastActive === yesterday ? user.streak + 1 : 1;
  await User.findByIdAndUpdate(userId, { streak: newStreak, lastActiveDate: new Date() });
}
