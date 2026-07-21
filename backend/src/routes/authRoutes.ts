import { Router } from "express";
import { login } from "../controllers/authController";
import { loginValidation } from "../validators/authValidator";
import { validate } from "../middleware/validate";

const router = Router();

router.post("/login", loginValidation, validate, login);

export default router;
