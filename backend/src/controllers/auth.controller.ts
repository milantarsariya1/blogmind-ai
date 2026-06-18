import { Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AppError } from "../middleware/error.middleware";
import { AuthRequest } from "../middleware/auth.middleware";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export async function signup(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const validated = signupSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (existingUser) {
      throw new AppError(409, "A user with this email address already exists.");
    }

    const passwordHash = await bcrypt.hash(validated.password, 10);

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email.toLowerCase(),
        passwordHash,
      },
    });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const validated = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (!user) {
      throw new AppError(401, "Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(validated.password, user.passwordHash);
    if (!isMatch) {
      throw new AppError(401, "Invalid email or password.");
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError(401, "Not authenticated.");
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      throw new AppError(404, "User not found.");
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError(401, "Not authenticated.");
    }

    const updateSchema = z.object({
      name: z.string().min(2, "Name must be at least 2 characters").optional(),
      email: z.string().email("Invalid email address").optional(),
      password: z.string().min(6, "Password must be at least 6 characters").optional(),
    });

    const validated = updateSchema.parse(req.body);

    const dataToUpdate: any = {};
    if (validated.name) dataToUpdate.name = validated.name;
    
    if (validated.email) {
      const emailLower = validated.email.toLowerCase();
      if (emailLower !== req.user.email.toLowerCase()) {
        const duplicate = await prisma.user.findUnique({
          where: { email: emailLower },
        });
        if (duplicate) {
          throw new AppError(409, "A user with this email address already exists.");
        }
        dataToUpdate.email = emailLower;
      }
    }

    if (validated.password) {
      dataToUpdate.passwordHash = await bcrypt.hash(validated.password, 10);
    }

    if (Object.keys(dataToUpdate).length === 0) {
      throw new AppError(400, "No valid fields provided for update.");
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: dataToUpdate,
    });

    const token = jwt.sign(
      { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
}
