import express from "express";
import { createComment, getCommentsBySolution, deleteComment } from "../controllers/comment.Controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Create a comment on a solution
router.post("/:solutionId", authMiddleware, createComment);

// Get all comments for a solution
router.get("/:solutionId", getCommentsBySolution);

// Delete a comment
router.delete("/:id", authMiddleware, deleteComment);



export default router;
