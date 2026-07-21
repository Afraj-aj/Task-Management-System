import { Response } from "express";
import { z } from "zod";
import pool from "../config/database";
import { AuthRequest } from "../middleware/auth";
import { sendSuccess, sendError } from "../utils/response";

const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"], { message: "Priority must be Low, Medium, or High" }),
  status: z.enum(["Pending", "In Progress", "Completed"]).optional().default("Pending"),
  due_date: z.string().min(1, "Due date is required"),
});

const updateTaskSchema = z.object({
  title: z.string().trim().min(1, "Title cannot be empty").optional(),
  description: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  status: z.enum(["Pending", "In Progress", "Completed"]).optional(),
  due_date: z.string().optional(),
});

export async function getTasks(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.userId;
    const result = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    sendSuccess(res, result.rows, "Tasks retrieved");
  } catch (error) {
    console.error("Get tasks error:", error);
    sendError(res, "Server error");
  }
}

export async function getTaskById(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.userId;
    const taskId = req.params.id;

    const result = await pool.query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      sendError(res, "Task not found", 404);
      return;
    }

    sendSuccess(res, result.rows[0], "Task retrieved");
  } catch (error) {
    console.error("Get task error:", error);
    sendError(res, "Server error");
  }
}

export async function createTask(req: AuthRequest, res: Response) {
  try {
    const parsed = createTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.issues[0].message, 400);
      return;
    }

    const userId = req.user!.userId;
    const { title, description, priority, status, due_date } = parsed.data;

    const result = await pool.query(
      `INSERT INTO tasks (user_id, title, description, priority, status, due_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, title, description || null, priority, status, due_date]
    );

    sendSuccess(res, result.rows[0], "Task created", 201);
  } catch (error) {
    console.error("Create task error:", error);
    sendError(res, "Server error");
  }
}

export async function updateTask(req: AuthRequest, res: Response) {
  try {
    const parsed = updateTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.issues[0].message, 400);
      return;
    }

    const userId = req.user!.userId;
    const taskId = req.params.id;

    const existing = await pool.query(
      "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
      [taskId, userId]
    );

    if (existing.rows.length === 0) {
      sendError(res, "Task not found", 404);
      return;
    }

    const current = existing.rows[0];
    const isCompleted = current.status === "Completed";
    const { title, description, priority, status, due_date } = parsed.data;

    const result = await pool.query(
      `UPDATE tasks
       SET title = $1, description = $2, priority = $3, status = $4, due_date = $5, updated_at = NOW()
       WHERE id = $6 AND user_id = $7 RETURNING *`,
      [
        title ?? current.title,
        description !== undefined ? description : current.description,
        priority ?? current.priority,
        status ?? current.status,
        isCompleted ? current.due_date : (due_date ?? current.due_date),
        taskId,
        userId,
      ]
    );

    sendSuccess(res, result.rows[0], "Task updated");
  } catch (error) {
    console.error("Update task error:", error);
    sendError(res, "Server error");
  }
}

export async function deleteTask(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.userId;
    const taskId = req.params.id;

    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id",
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      sendError(res, "Task not found", 404);
      return;
    }

    sendSuccess(res, null, "Task deleted");
  } catch (error) {
    console.error("Delete task error:", error);
    sendError(res, "Server error");
  }
}
