import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  problemId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    // e.g. "p01", "p02" ... "p48"
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "FAANG / General",
      "Finance / Payments",
      "ServiceNow / VMware / Broadcom",
      "E-Commerce / Retail",
      "Social / CRM / SaaS",
      "Dev Tools",
      "Mobility / Delivery",
      "Fintech / Payments",
      "Social / Career",
    ],
  },
  companies: {
    type: [String],
    default: [],
  },
  tags: {
    type: [String],
    default: [],
  },
  requirements: {
    type: [String],
    default: [],
  },
  hints: {
    type: [String],
    default: [],
  },
  timeComplexity: {
    type: String,
    default: "",
  },
  spaceComplexity: {
    type: String,
    default: "",
  },
  componentFile: {
    type: String,
    default: "",
    // e.g. "P01_InfiniteScrollGrid"
  },
  order: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  solveCount: {
    type: Number,
    default: 0,
  },
  attemptCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Index for fast queries
problemSchema.index({ category: 1, difficulty: 1 });
problemSchema.index({ companies: 1 });
problemSchema.index({ tags: 1 });

export default mongoose.model("Problem", problemSchema);
