import express from "express";
import { createLog, getLogs, getLogById } from "../controllers/auditLogController.js";

const router = express.Router();

router.post("/", createLog);      // create log
router.get("/", getLogs);         // get all logs
router.get("/:id", getLogById);   // get single log

export default router;
