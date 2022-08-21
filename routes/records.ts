import { Router } from "express";
import {
  addRecord,
  deleteRecord,
  getRecords,
  updateRecord,
} from "../controllers/records";

const router = Router();

router.route("/").get(getRecords).post(addRecord);
router.route("/:id").put(updateRecord).delete(deleteRecord);

export default router;
