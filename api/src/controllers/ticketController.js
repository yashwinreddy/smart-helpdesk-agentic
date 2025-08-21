import { runAgentWorkflow } from "../agentStub.js";
import Article from "../models/article.js";
import Config from "../models/Config.js";
import Ticket from "../models/tickets.js";
import AgentSuggestion from "../models/AgentSuggestion.js";
import AuditLog from "../models/AuditLog.js";
import { v4 as uuidv4 } from "uuid";

// Create new ticket
export const createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body);
    const kbArticles = await Article.find().limit(3);
    const config = await Config.findOne() || { autoCloseEnabled: true, confidenceThreshold: 0.8 };
    const result = await runAgentWorkflow(ticket._id, kbArticles, config);

    res.status(201).json({ ticket: result.ticket, agentSuggestion: result.suggestion, traceId: result.traceId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all tickets
export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get ticket by ID
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update ticket
export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete ticket
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });
    res.json({ message: "Ticket deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get audit logs for a ticket
export const getTicketAuditLogs = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const auditLogs = await AuditLog.find({ ticketId }).sort({ timestamp: 1 }); // chronological
    res.json(auditLogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Agent reply
export const replyToTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    const { reply, resolved = true } = req.body;
    const traceId = uuidv4();

    ticket.status = resolved ? "resolved" : "waiting_human";
    await ticket.save();

    const suggestion = await AgentSuggestion.create({
      ticketId: ticket._id,
      predictedCategory: ticket.category || "other",
      articleIds: [],
      draftReply: reply,
      confidence: 1.0,
      autoClosed: resolved,
      modelInfo: { provider: "agent", model: "manual", promptVersion: "v1", latencyMs: 0 },
      createdAt: new Date(),
    });

    await AuditLog.create({
      ticketId: ticket._id,
      traceId,
      actor: "agent",
      action: "REPLY_SENT",
      meta: { reply },
      timestamp: new Date(),
    });

    res.json({ ticket, suggestion, traceId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Assign ticket to human
export const assignTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: "Ticket not found" });

    const { assigneeId } = req.body;
    const traceId = uuidv4();

    ticket.assignee = assigneeId;
    ticket.status = "waiting_human";
    await ticket.save();

    await AuditLog.create({
      ticketId: ticket._id,
      traceId,
      actor: "system",
      action: "ASSIGNED_TO_HUMAN",
      meta: { assigneeId },
      timestamp: new Date(),
    });

    res.json({ ticket, traceId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
