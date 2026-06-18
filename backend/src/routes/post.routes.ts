import { Router } from "express";
import {
  createPost,
  getPosts,
  getMyPosts,
  getPostById,
  updatePost,
  deletePost,
  reportPost,
} from "../controllers/post.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware as any, createPost as any);
router.get("/", getPosts as any);
router.get("/my-posts", authMiddleware as any, getMyPosts as any);
router.get("/:id", getPostById as any);
router.put("/:id", authMiddleware as any, updatePost as any);
router.delete("/:id", authMiddleware as any, deletePost as any);
router.post("/:id/report", reportPost as any);

export default router;
