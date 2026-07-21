import { Response } from "express";

export function sendSuccess(res: Response, data: unknown, message = "Success", statusCode = 200) {
  res.status(statusCode).json({ success: true, message, data });
}

export function sendSuccessWithPagination(res: Response, data: unknown, pagination: { total: number; page: number; limit: number; totalPages: number }, message = "Success", statusCode = 200) {
  res.status(statusCode).json({ success: true, message, data, pagination });
}

export function sendError(res: Response, message = "Error", statusCode = 500) {
  res.status(statusCode).json({ success: false, message });
}
