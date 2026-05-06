import Problem  from "../models/Problem.model.js";
import Progress from "../models/Progress.model.js";

// ── Get all problems ──────────────────────────────────────────
// GET /api/problems
export const getAllProblems = async (req, res, next) => {
  try {
    const { category, difficulty, company, tag, search, page = 1, limit = 50 } = req.query;

    const filter = { isActive: true };
    if (category)   filter.category   = category;
    if (difficulty) filter.difficulty = difficulty;
    if (company)    filter.companies  = { $in: [company] };
    if (tag)        filter.tags       = { $in: [tag] };
    if (search)     filter.title      = { $regex: search, $options: "i" };

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Problem.countDocuments(filter);

    const problems = await Problem.find(filter)
      .sort({ order: 1 })
      .skip(skip)
      .limit(Number(limit))
      .select("-__v");

    // If user is authenticated, attach their progress
    let progressMap = {};
    if (req.user) {
      const progresses = await Progress.find({ user: req.user.id }).select("problemId status bookmarked");
      progresses.forEach(p => { progressMap[p.problemId] = p; });
    }

    const enriched = problems.map(p => ({
      ...p.toObject(),
      userProgress: progressMap[p.problemId] || null,
    }));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      problems: enriched,
    });
  } catch (err) {
    next(err);
  }
};

// ── Get single problem ────────────────────────────────────────
// GET /api/problems/:id
export const getProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findOne({
      $or: [{ problemId: req.params.id }, { slug: req.params.id }],
      isActive: true,
    });

    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    // Increment attempt count
    await Problem.findByIdAndUpdate(problem._id, { $inc: { attemptCount: 1 } });

    let userProgress = null;
    if (req.user) {
      userProgress = await Progress.findOne({ user: req.user.id, problem: problem._id });
    }

    res.json({ success: true, problem, userProgress });
  } catch (err) {
    next(err);
  }
};

// ── Get problems by category ──────────────────────────────────
// GET /api/problems/category/:category
export const getProblemsByCategory = async (req, res, next) => {
  try {
    const problems = await Problem.find({
      category: decodeURIComponent(req.params.category),
      isActive: true,
    }).sort({ order: 1 });

    res.json({ success: true, count: problems.length, problems });
  } catch (err) {
    next(err);
  }
};

// ── Get all categories ────────────────────────────────────────
// GET /api/problems/meta/categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Problem.distinct("category", { isActive: true });
    const result = await Promise.all(
      categories.map(async (cat) => ({
        name: cat,
        count: await Problem.countDocuments({ category: cat, isActive: true }),
      }))
    );
    res.json({ success: true, categories: result });
  } catch (err) {
    next(err);
  }
};

// ── Get all companies ─────────────────────────────────────────
// GET /api/problems/meta/companies
export const getCompanies = async (req, res, next) => {
  try {
    const companies = await Problem.distinct("companies", { isActive: true });
    res.json({ success: true, companies: companies.sort() });
  } catch (err) {
    next(err);
  }
};

// ── Search problems ───────────────────────────────────────────
// GET /api/problems/search?q=kanban
export const searchProblems = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: "Query required" });

    const problems = await Problem.find({
      isActive: true,
      $or: [
        { title:       { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags:        { $in: [new RegExp(q, "i")] } },
        { companies:   { $in: [new RegExp(q, "i")] } },
      ],
    }).sort({ order: 1 }).limit(20);

    res.json({ success: true, count: problems.length, problems });
  } catch (err) {
    next(err);
  }
};

// ── Admin: Create problem ─────────────────────────────────────
// POST /api/problems  (admin only)
export const createProblem = async (req, res, next) => {
  try {
    const problem = await Problem.create(req.body);
    res.status(201).json({ success: true, problem });
  } catch (err) {
    next(err);
  }
};

// ── Admin: Update problem ─────────────────────────────────────
// PUT /api/problems/:id  (admin only)
export const updateProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findOneAndUpdate(
      { problemId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!problem) return res.status(404).json({ success: false, message: "Problem not found" });
    res.json({ success: true, problem });
  } catch (err) {
    next(err);
  }
};

// ── Admin: Delete problem ─────────────────────────────────────
// DELETE /api/problems/:id  (admin only)
export const deleteProblem = async (req, res, next) => {
  try {
    await Problem.findOneAndUpdate({ problemId: req.params.id }, { isActive: false });
    res.json({ success: true, message: "Problem deactivated" });
  } catch (err) {
    next(err);
  }
};
