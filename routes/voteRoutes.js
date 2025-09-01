import express from "express";
import {  upvoteComment,voteSolution } from "../controllers/vote.Controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();


// Upvote a comment
router.post("/upvote/:id", authMiddleware, upvoteComment);
router.post("/:solutionId", authMiddleware, voteSolution);

export default router;
