import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/database";
import { sendSuccess, sendError } from "../utils/response";

// Zod schema for login validation
const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export async function login(req: Request, res: Response) {
  try {
    // Validate input with Zod
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, parsed.error.issues[0].message, 400);
      return;
    }

    const { email, password } = parsed.data;

    // Find user by email
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      sendError(res, "Invalid email or password", 401);
      return;
    }

    const user = result.rows[0];

    // Compare plain text password with hashed password in DB
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      sendError(res, "Invalid email or password", 401);
      return;
    }

    // Create JWT token with user info
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" } as jwt.SignOptions
    );

    sendSuccess(res, {
      token,
      user: { id: user.id, name: user.name, email: user.email },
    }, "Login successful");
  } catch (error) {
    console.error("Login error:", error);
    sendError(res, "Server error");
  }
}
