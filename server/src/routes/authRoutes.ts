import express from "express"
import { login, register } from "../controllers/auth";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../validations/auth.validation";

const router = express.Router();

router.post("/login", validate(loginSchema), login)

router.post("/register", validate(registerSchema), register)

export default router;
