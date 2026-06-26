import { Router } from "express";
import { summarize, correct, seedPost } from "../controllers/ai.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/summarize", authMiddleware as any, summarize as any);
router.post("/correct", authMiddleware as any, correct as any);
router.post("/seed", authMiddleware as any, seedPost as any);

export default router;
