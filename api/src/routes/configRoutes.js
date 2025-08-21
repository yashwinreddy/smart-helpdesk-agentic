import express from "express";
import { upsertConfig, getConfig } from "../controllers/configController.js";

const router = express.Router();

router.get("/", getConfig);      // get config
router.post("/", upsertConfig);  // create/update config

export default router;
