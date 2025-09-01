import express from "express";
import { createProblem, getProblems, getProblemById, deleteProblem } from "../controllers/problem.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js"; 

const router = express.Router();


router.post("/", authMiddleware, createProblem);
router.get("/", getProblems);
router.get("/:id", getProblemById);
router.delete("/:id", authMiddleware, deleteProblem);

export default router;
