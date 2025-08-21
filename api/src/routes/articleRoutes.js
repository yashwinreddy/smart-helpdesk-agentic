import express from "express";
import {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} from "../controllers/articleController.js";

const router = express.Router();

router.post("/", createArticle);         // Create
router.get("/", getArticles);            // Read all
router.get("/:id", getArticleById);      // Read single
router.put("/:id", updateArticle);       // Update
router.delete("/:id", deleteArticle);    // Delete

export default router;
