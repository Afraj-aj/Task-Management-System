import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../utils/response";

export interface AuthRequest extends Request {
  user?: { userId: number; email: string };
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    sendError(res, "Access token required", 401);
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { userId: number; email: string };
    req.user = decoded;
    next();
  } catch {
    sendError(res, "Invalid token", 401);
  }
}
