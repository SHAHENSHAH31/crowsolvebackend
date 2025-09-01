import Problem from "../models/Problem.js";
import Solution from "../models/Solution.js";
import Comment from "../models/Comment.js";
import cloudinary from "cloudinary"; 


export const createProblem = async (req, res) => {
  try {
    const { title, description, location } = req.body;
    const author = req.user.id;

    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    const imageFile = req.files.image;

    // Convert buffer to base64
    const base64 = `data:${imageFile.mimetype};base64,${imageFile.data.toString("base64")}`;

    // Upload to cloudinary
    const result = await cloudinary.v2.uploader.upload(base64, {
      folder: "problems",
    });

    const problem = await Problem.create({
      author,
      title,
      description,
      location,
      image: { url: result.secure_url, public_id: result.public_id },
    });

    res.status(201).json({ success: true, problem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Get all problems
export const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find().populate("author", "name email");
    res.json({ success: true, problems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single problem by ID
export const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).populate("author", "name email");

    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    // Fetch all solutions related to this problem
    const solutions = await Solution.find({ problem: problem._id })
      .populate("author", "name email")
      .sort({ createdAt: -1 }); // latest first

    res.json({
      success: true,
      problem,
      solutions
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete problem
export const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    if (problem.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Delete image from Cloudinary if exists
    if (problem.image?.public_id) {
      await cloudinary.v2.uploader.destroy(problem.image.public_id);
    }

    // Find all solutions related to this problem
    const solutions = await Solution.find({ problem: problem._id });

    // Delete all comments related to those solutions
    const solutionIds = solutions.map((s) => s._id);
    await Comment.deleteMany({ solution: { $in: solutionIds } });

    // Delete all solutions
    await Solution.deleteMany({ problem: problem._id });

    // Finally, delete the problem itself
    await problem.deleteOne();

    res.json({ success: true, message: "Problem, its solutions, and comments deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
