import AgentSuggestion from "../models/AgentSuggestion.js";

// Create
export const createAgentSuggestion = async (req, res) => {
  try {
    const suggestion = new AgentSuggestion(req.body);
    await suggestion.save();
    res.status(201).json(suggestion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all
export const getAgentSuggestions = async (req, res) => {
  try {
    const suggestions = await AgentSuggestion.find();
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by ID
export const getAgentSuggestionById = async (req, res) => {
  try {
    const suggestion = await AgentSuggestion.findById(req.params.id);
    if (!suggestion) return res.status(404).json({ error: "AgentSuggestion not found" });
    res.json(suggestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
export const updateAgentSuggestion = async (req, res) => {
  try {
    const suggestion = await AgentSuggestion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!suggestion) return res.status(404).json({ error: "AgentSuggestion not found" });
    res.json(suggestion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
export const deleteAgentSuggestion = async (req, res) => {
  try {
    const suggestion = await AgentSuggestion.findByIdAndDelete(req.params.id);
    if (!suggestion) return res.status(404).json({ error: "AgentSuggestion not found" });
    res.json({ message: "AgentSuggestion deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
