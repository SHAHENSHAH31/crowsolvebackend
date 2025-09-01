import Solution from "../models/Solution.js";
import Problem from "../models/Problem.js";
import Comment from "../models/Comment.js";

// Create solution for a problem
export const createSolution = async (req, res) => {
  try {
     console.log('hi');
    const { text } = req.body;
     console.log(text);
    const problem = await Problem.findById(req.params.problemId);
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    const solution = await Solution.create({
      text,
      problem: problem._id,
      author: req.user.id,
    });

    res.status(201).json({ success: true, solution });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all solutions for a problem
export const getSolutions = async (req, res) => {
  try {
    const solutions = await Solution.find({ problem: req.params.problemId })
      .populate("author", "name email")
      .populate("problem", "title description image");

    res.json({ success: true, solutions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a solution and its comments
export const deleteSolution = async (req, res) => {
  try {
    const solution = await Solution.findById(req.params.id);
    if (!solution) {
      return res.status(404).json({ success: false, message: "Solution not found" });
    }

    if (solution.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Delete all comments under this solution
    await Comment.deleteMany({ solution: solution._id });

    // Delete solution itself
    await solution.deleteOne();

    res.json({ success: true, message: "Solution and its comments deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
