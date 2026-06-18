import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/error.middleware";
import { AuthRequest } from "../middleware/auth.middleware";

const postCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  summary: z.string().min(5, "Summary must be at least 5 characters"),
  featureImage: z.string().url("Must be a valid image URL"),
  tags: z.array(z.string()),
  status: z.enum(["draft", "published"]).default("draft"),
});

const postUpdateSchema = postCreateSchema.partial();

function calculateReadingTime(content: string): number {
  const textOnly = content.replace(/<[^>]*>/g, "");
  const wordCount = textOnly.trim().split(/\s+/).filter(Boolean).length;
  return Math.ceil(wordCount / 200) || 1;
}

export async function createPost(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError(401, "Not authenticated.");
    }

    const validated = postCreateSchema.parse(req.body);

    const post = await prisma.post.create({
      data: {
        userId: req.user.id,
        title: validated.title,
        content: validated.content,
        summary: validated.summary,
        featureImage: validated.featureImage,
        tags: validated.tags,
        status: validated.status,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const readingTime = calculateReadingTime(post.content);

    return res.status(201).json({
      ...post,
      author: post.user.name,
      readingTime,
    });
  } catch (error) {
    next(error);
  }
}

export async function getPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const tag = (req.query.tag as string) || "";

    const skip = (page - 1) * limit;

    const whereClause: any = {
      status: "published",
    };

    if (tag) {
      whereClause.tags = {
        has: tag,
      };
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { summary: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const [posts, total] = await prisma.$transaction([
      prisma.post.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.post.count({
        where: whereClause,
      }),
    ]);

    const formattedPosts = posts.map((post) => ({
      ...post,
      author: post.user.name,
      readingTime: calculateReadingTime(post.content),
    }));

    return res.json({
      posts: formattedPosts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyPosts(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError(401, "Not authenticated.");
    }

    const posts = await prisma.post.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedPosts = posts.map((post) => ({
      ...post,
      author: post.user.name,
      readingTime: calculateReadingTime(post.content),
    }));

    return res.json(formattedPosts);
  } catch (error) {
    next(error);
  }
}

export async function getPostById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;

    // Increment views and fetch post in one update operation
    const post = await prisma.post.update({
      where: { id: id },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!post) {
      throw new AppError(404, "Post not found.");
    }

    return res.json({
      ...post,
      author: post.user.name,
      readingTime: calculateReadingTime(post.content),
    });
  } catch (error) {
    next(new AppError(404, "Post not found."));
  }
}

export async function updatePost(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError(401, "Not authenticated.");
    }

    const id = req.params.id as string;
    const validated = postUpdateSchema.parse(req.body);

    const post = await prisma.post.findUnique({
      where: { id: id },
    });

    if (!post) {
      throw new AppError(404, "Post not found.");
    }

    if (post.userId !== req.user.id) {
      throw new AppError(403, "You do not have permission to edit this post.");
    }

    const updatedPost = await prisma.post.update({
      where: { id: id },
      data: {
        title: validated.title,
        content: validated.content,
        summary: validated.summary,
        featureImage: validated.featureImage,
        tags: validated.tags,
        status: validated.status,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return res.json({
      ...updatedPost,
      author: updatedPost.user.name,
      readingTime: calculateReadingTime(updatedPost.content),
    });
  } catch (error) {
    next(error);
  }
}

export async function deletePost(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError(401, "Not authenticated.");
    }

    const id = req.params.id as string;

    const post = await prisma.post.findUnique({
      where: { id: id },
    });

    if (!post) {
      throw new AppError(404, "Post not found.");
    }

    if (post.userId !== req.user.id) {
      throw new AppError(403, "You do not have permission to delete this post.");
    }

    await prisma.post.delete({
      where: { id: id },
    });

    return res.json({ message: "Post successfully deleted." });
  } catch (error) {
    next(error);
  }
}

export async function reportPost(req: Request, res: Response, next: NextFunction) {
  try {
    const id = req.params.id as string;
    const { reason } = req.body;

    if (!reason || typeof reason !== "string") {
      throw new AppError(400, "Reason is required and must be a string.");
    }

    const post = await prisma.post.findUnique({
      where: { id: id },
    });

    if (!post) {
      throw new AppError(404, "Post not found.");
    }

    const newReportCount = post.reportCount + 1;
    const newReasons = [...post.reportReasons, reason];

    if (newReportCount > 7) {
      // Automatic removal
      await prisma.post.delete({
        where: { id: id },
      });
      return res.json({
        reported: true,
        deleted: true,
        message: "Post has been removed due to excessive community reports.",
      });
    } else {
      await prisma.post.update({
        where: { id: id },
        data: {
          reportCount: newReportCount,
          reportReasons: newReasons,
        },
      });
      return res.json({
        reported: true,
        deleted: false,
        message: "Post has been reported successfully.",
      });
    }
  } catch (error) {
    next(error);
  }
}
