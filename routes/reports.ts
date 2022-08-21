import { Router } from "express";
import { getReport } from "../controllers/reports";

const router = Router();

router.route("/").get(getReport);

export default router;
