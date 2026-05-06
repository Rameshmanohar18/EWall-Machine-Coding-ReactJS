import Progress from "../models/Progress.model.js";
import Problem  from "../models/Problem.model.js";
import User     from "../models/User.model.js";

// ── Get dashboard stats for current user ──────────────────────
// GET /api/stats/dashboard
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Progress counts
    const [total, completed, inProgress, bookmarked] = await Promise.all([
      Problem.countDocuments({ isActive: true }),
      Progress.countDocuments({ user: userId, status: "completed" }),
      Progress.countDocuments({ user: userId, status: "in_progress" }),
      Progress.countDocuments({ user: userId, bookmarked: true }),
    ]);

    // Completion by category
    const allProblems = await Problem.find({ isActive: true }).select("problemId category difficulty");
    const userProgress = await Progress.find({ user: userId, status: "completed" }).select("problemId");
    const completedIds = new Set(userProgress.map(p => p.problemId));

    const categoryStats = {};
    allProblems.forEach(p => {
      if (!categoryStats[p.category]) {
        categoryStats[p.category] = { total: 0, completed: 0 };
      }
      categoryStats[p.category].total++;
      if (completedIds.has(p.problemId)) categoryStats[p.category].completed++;
    });

    // Difficulty breakdown
    const difficultyStats = { Easy: { total: 0, completed: 0 }, Medium: { total: 0, completed: 0 }, Hard: { total: 0, completed: 0 } };
    allProblems.forEach(p => {
      difficultyStats[p.difficulty].total++;
      if (completedIds.has(p.problemId)) difficultyStats[p.difficulty].completed++;
    });

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
    const recentActivity = await Progress.find({
      user: userId,
      lastAttemptAt: { $gte: sevenDaysAgo },
    })
      .populate("problem", "title category difficulty")
      .sort({ lastAttemptAt: -1 })
      .limit(10);

    // User streak
    const user = await User.findById(userId).select("streak lastActiveDate");

    // Total time spent
    const timeResult = await Progress.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, totalMinutes: { $sum: "$timeSpentMinutes" } } },
    ]);
    const totalTimeMinutes = timeResult[0]?.totalMinutes || 0;

    res.json({
      success: true,
      stats: {
        overview: {
          total,
          completed,
          inProgress,
          bookmarked,
          notStarted: total - completed - inProgress,
          completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        },
        streak: user.streak,
        totalTimeMinutes,
        categoryStats,
        difficultyStats,
        recentActivity,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ── Get leaderboard (top users by completion) ─────────────────
// GET /api/stats/leaderboard
export const getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await Progress.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: "$user", completed: { $sum: 1 } } },
      { $sort: { completed: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          "user.name": 1,
          "user.avatar": 1,
          completed: 1,
        },
      },
    ]);

    res.json({ success: true, leaderboard });
  } catch (err) {
    next(err);
  }
};

// ── Get problem-level stats (admin / public) ──────────────────
// GET /api/stats/problems
export const getProblemStats = async (req, res, next) => {
  try {
    const problems = await Problem.find({ isActive: true })
      .select("problemId title category difficulty solveCount attemptCount")
      .sort({ solveCount: -1 })
      .limit(20);

    res.json({ success: true, problems });
  } catch (err) {
    next(err);
  }
};
