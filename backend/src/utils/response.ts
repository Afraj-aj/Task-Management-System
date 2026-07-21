import { Response } from "express";

export function sendSuccess(res: Response, data: unknown, message = "Success", statusCode = 200) {
  res.status(statusCode).json({ success: true, message, data });
}

export function sendError(res: Response, message = "Error", statusCode = 500) {
  res.status(statusCode).json({ success: false, message });
}
