import { Router } from "express";
import { signup, login, me, updateProfile } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/signup", signup as any);
router.post("/login", login as any);
router.get("/me", authMiddleware as any, me as any);
router.put("/update", authMiddleware as any, updateProfile as any);

export default router;
