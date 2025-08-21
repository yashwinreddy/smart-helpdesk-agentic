import AuditLog from "../models/AuditLog.js";

// Create log
export const createLog = async (req, res) => {
  try {
    const log = new AuditLog(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all logs
export const getLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find();
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single log by ID
export const getLogById = async (req, res) => {
  try {
    const log = await AuditLog.findById(req.params.id);
    if (!log) return res.status(404).json({ error: "AuditLog not found" });
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
