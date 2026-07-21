import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/database";
import seed from "./seed";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5501;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

async function start() {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected.");

    await seed();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();

export default app;
