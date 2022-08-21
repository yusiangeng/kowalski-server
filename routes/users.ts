import { getMe, login, register } from "../controllers/users";
import express from "express";
import { protect } from "../middleware/auth";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", protect, getMe);

export default router;
