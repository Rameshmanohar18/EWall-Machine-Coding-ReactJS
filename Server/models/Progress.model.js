import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  problemId: {
    type: String,
    required: true,
    // denormalized for fast lookup
  },
  status: {
    type: String,
    enum: ["not_started", "in_progress", "completed", "revisit"],
    default: "not_started",
  },
  attempts: {
    type: Number,
    default: 0,
  },
  timeSpentMinutes: {
    type: Number,
    default: 0,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  selfRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  bookmarked: {
    type: Boolean,
    default: false,
  },
  lastAttemptAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

// One progress record per user per problem
progressSchema.index({ user: 1, problem: 1 }, { unique: true });
progressSchema.index({ user: 1, status: 1 });
progressSchema.index({ user: 1, bookmarked: 1 });

export default mongoose.model("Progress", progressSchema);
