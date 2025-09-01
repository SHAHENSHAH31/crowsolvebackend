import Comment from "../models/Comment.js";
import Solution from "../models/Solution.js";

// Upvote a comment
export const upvoteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    // Prevent duplicate upvotes
    if (comment.upvotes.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: "Already upvoted" });
    }

    comment.upvotes.push(req.user.id);
    await comment.save();

    res.json({ success: true, message: "Comment upvoted", comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const voteSolution = async (req, res) => {
  try {
    const { solutionId } = req.params;
    const userId = req.user.id; // from authMiddleware

    const solution = await Solution.findById(solutionId);
    if (!solution) {
      return res.status(404).json({ message: "Solution not found" });
    }

    const alreadyVoted = solution.upvotes.includes(userId);

    if (alreadyVoted) {
      // remove vote (un-vote)
      solution.upvotes = solution.upvotes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // add vote
      solution.upvotes.push(userId);
    }

    await solution.save();

    res.status(200).json({
      message: alreadyVoted ? "Vote removed" : "Voted successfully",
      upvotesCount: solution.upvotes.length,
      solution,
    });
  } catch (error) {
    console.error("Error voting solution:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
