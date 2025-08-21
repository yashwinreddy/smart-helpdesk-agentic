import express from "express";
import {
  createAgentSuggestion,
  getAgentSuggestions,
  getAgentSuggestionById,
  updateAgentSuggestion,
  deleteAgentSuggestion,
} from "../controllers/agentSuggestionController.js";

const router = express.Router();

router.post("/", createAgentSuggestion);       // Create
router.get("/", getAgentSuggestions);          // Get all
router.get("/:id", getAgentSuggestionById);    // Get by ID
router.put("/:id", updateAgentSuggestion);     // Update
router.delete("/:id", deleteAgentSuggestion);  // Delete

export default router;
