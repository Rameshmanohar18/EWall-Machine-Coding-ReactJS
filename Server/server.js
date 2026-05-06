import express    from "express";
import cors       from "cors";
import morgan     from "morgan";
import dotenv     from "dotenv";
import { connectDB } from "./config/db.js";

// Routes
import authRoutes     from "./routes/auth.routes.js";
import problemRoutes  from "./routes/problem.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import noteRoutes     from "./routes/note.routes.js";
import statsRoutes    from "./routes/stats.routes.js";

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Connect DB ──────────────────────────────────────────────
connectDB();

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// ── Health check ────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "MachineCoding API running", timestamp: new Date() });
});

// ── Routes ──────────────────────────────────────────────────
app.use("/api/auth",     authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/notes",    noteRoutes);
app.use("/api/stats",    statsRoutes);

// ── 404 handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV}`);
  console.log(`🗄  MongoDB: ${process.env.MONGO_URI}\n`);
});

export default app;
