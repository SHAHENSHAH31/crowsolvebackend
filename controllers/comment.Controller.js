import Comment from "../models/Comment.js";
import Solution from "../models/Solution.js";

// Create a comment for a solution
export const createComment = async (req, res) => {
  try {
    const { solutionId } = req.params;
    const { text } = req.body;

    const solution = await Solution.findById(solutionId);
    if (!solution) return res.status(404).json({ success: false, message: "Solution not found" });

    const comment = await Comment.create({
      solution: solutionId,
      author: req.user.id,
      text,
    });

    res.status(201).json({ success: true, comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all comments for a solution
export const getCommentsBySolution = async (req, res) => {
  try {
    const { solutionId } = req.params;
    const comments = await Comment.find({ solution: solutionId })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await comment.deleteOne();
    res.json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

