import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/database";
import init from "./init";
import seed from "./seed";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5501;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);

async function start() {
  try {
    await pool.query("SELECT 1");
    console.log("Database connected.");

    await init();
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
