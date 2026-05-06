import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
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
  },
  content: {
    type: String,
    required: [true, "Note content is required"],
    maxlength: [5000, "Note cannot exceed 5000 characters"],
  },
  tags: {
    type: [String],
    default: [],
  },
  isPrivate: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

noteSchema.index({ user: 1, problem: 1 });
noteSchema.index({ user: 1, problemId: 1 });

export default mongoose.model("Note", noteSchema);
