import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/database";
import { sendSuccess, sendError } from "../utils/response";

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      sendError(res, "Invalid email or password", 401);
      return;
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      sendError(res, "Invalid email or password", 401);
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
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
