import express from "express";
import { createSolution, deleteSolution, getSolutions } from "../controllers/solution.Controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/:problemId", authMiddleware, createSolution);
router.get("/:problemId", getSolutions);
router.delete("/:id", authMiddleware, deleteSolution);

export default router;
