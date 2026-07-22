import { Router } from "express";
import { getTasks, getTaskStats, getDueSoon, getTaskById, createTask, updateTask, deleteTask } from "../controllers/taskController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.use(authenticateToken);

router.get("/", getTasks);
router.get("/stats", getTaskStats);
router.get("/due-soon", getDueSoon);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
