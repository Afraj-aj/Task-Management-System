import { Response } from "express";
import { z } from "zod";
import pool from "../config/database";
import { AuthRequest } from "../middleware/auth";
import { sendSuccess, sendSuccessWithPagination, sendError } from "../utils/response";

const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"], { message: "Priority must be Low, Medium, or High" }),
  status: z.enum(["Pending", "In Progress", "Completed"]).optional().default("Pending"),
  due_date: z.string().min(1, "Due date is required").refine((val) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(val) >= today;
  }, "Due date cannot be earlier than today"),
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
    const { search, status, priority, sort, page = "1", limit = "10", overdue } = req.query as Record<string, string>;

    // Build WHERE clause
    let whereClause = "WHERE user_id = $1";
    const params: unknown[] = [userId];
    let paramIndex = 2;

    // Search by title
    if (search) {
      whereClause += ` AND title ILIKE $${paramIndex}`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Filter by status
    if (status) {
      whereClause += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    // Filter by priority
    if (priority) {
      whereClause += ` AND priority = $${paramIndex}`;
      params.push(priority);
      paramIndex++;
    }

    // Filter overdue: due_date before today AND not completed
    if (overdue === "true") {
      whereClause += ` AND due_date < CURRENT_DATE AND status != 'Completed'`;
    }

    // Sort
    let orderClause = "ORDER BY created_at DESC";
    if (sort === "oldest") orderClause = "ORDER BY created_at ASC";
    if (sort === "due_date") orderClause = "ORDER BY due_date ASC";

    // Pagination
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 10));
    const offset = (pageNum - 1) * limitNum;

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM tasks ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get tasks with pagination
    const result = await pool.query(
      `SELECT * FROM tasks ${whereClause} ${orderClause} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limitNum, offset]
    );

    sendSuccessWithPagination(
      res,
      result.rows,
      { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
      "Tasks retrieved"
    );
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

    // Validate due_date only if task is not completed and due_date is provided
    if (!isCompleted && due_date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(due_date) < today) {
        sendError(res, "Due date cannot be earlier than today", 400);
        return;
      }
    }

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

export async function getTaskStats(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.userId;

    const result = await pool.query(
      `SELECT
         COUNT(*)::int AS total,
         COUNT(*) FILTER (WHERE status = 'Pending')::int AS pending,
         COUNT(*) FILTER (WHERE status = 'In Progress')::int AS in_progress,
         COUNT(*) FILTER (WHERE status = 'Completed')::int AS completed,
         COUNT(*) FILTER (WHERE status != 'Completed' AND due_date < CURRENT_DATE)::int AS overdue
       FROM tasks WHERE user_id = $1`,
      [userId]
    );

    sendSuccess(res, result.rows[0], "Stats retrieved");
  } catch (error) {
    console.error("Get stats error:", error);
    sendError(res, "Server error");
  }
}

export async function getDueSoon(req: AuthRequest, res: Response) {
  try {
    const userId = req.user!.userId;

    const result = await pool.query(
      `SELECT * FROM tasks
       WHERE user_id = $1
         AND status != 'Completed'
         AND due_date + INTERVAL '1 day' > NOW()
         AND due_date + INTERVAL '1 day' <= NOW() + INTERVAL '1 day'
       ORDER BY due_date ASC`,
      [userId]
    );

    sendSuccess(res, result.rows, "Due soon tasks retrieved");
  } catch (error) {
    console.error("Get due soon error:", error);
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
