import { Response, NextFunction } from "express";
import { z } from "zod";
import { AuthRequest } from "../middleware/auth.middleware";
import { AppError } from "../middleware/error.middleware";
import { generateSummary, correctGrammar } from "../services/ai.service";

const aiSchema = z.object({
  content: z.string().min(1, "Content must not be empty"),
});

export async function summarize(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const validated = aiSchema.parse(req.body);
    const summary = await generateSummary(validated.content);
    return res.json({ summary });
  } catch (error) {
    next(error);
  }
}

export async function correct(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const validated = aiSchema.parse(req.body);
    const correctedText = await correctGrammar(validated.content);
    return res.json({ correctedText });
  } catch (error) {
    next(error);
  }
}
