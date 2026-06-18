import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "AppError";
  }
}

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error handler caught error:", err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof ZodError) {
    const errorDetails = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return res.status(400).json({
      error: "Validation error",
      details: errorDetails,
    });
  }

  // Handle Prisma error code check (like P2002 duplicate keys, P2025 not found, etc.)
  if (err.code) {
    if (err.code === "P2002") {
      const target = err.meta?.target || "field";
      return res.status(409).json({
        error: `Unique constraint failed: A record with this ${target} already exists.`,
      });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Record not found in the database." });
    }
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token. Please authenticate." });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token has expired. Please log in again." });
  }

  // Fallback internal error
  const message = err.message || "Internal server error";
  return res.status(500).json({ error: message });
}
