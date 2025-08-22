import AgentSuggestion from "./models/AgentSuggestion.js";
import Ticket from "./models/tickets.js";
import AuditLogPkg from "./models/AuditLog.js";
import { v4 as uuidv4 } from "uuid";

const AuditLog = AuditLogPkg;

// Simple deterministic classification
export const classifyTicket = (text) => {
  let category = "other";
  let confidence = 0.5;
  text = text.toLowerCase();

  if (/refund|invoice/.test(text)) {
    category = "billing"; confidence = 0.9;
  } else if (/error|bug|stack/.test(text)) {
    category = "tech"; confidence = 0.95;
  } else if (/delivery|shipment/.test(text)) {
    category = "shipping"; confidence = 0.85;
  }

  return { predictedCategory: category, confidence };
};

// Draft reply using KB titles
export const draftReply = (ticketText, kbArticles) => {
  const citations = kbArticles.map(a => a._id);
  const draftReply = `Hi, please see the following references:\n` +
    kbArticles.map((a, i) => `${i + 1}. ${a.title}`).join("\n");

  return { draftReply, citations };
};

// Main workflow triggered after ticket creation
export const runAgentWorkflow = async (ticketId, kbArticles = [], config = {}) => {
  const traceId = uuidv4();
  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw new Error("Ticket not found");

  // 1️⃣ Classification
  const { predictedCategory, confidence } = classifyTicket(ticket.description);
  await AuditLog.create({
    ticketId,
    traceId,
    actor: "system",
    action: "AGENT_CLASSIFIED", // ✅ changed
    meta: { predictedCategory, confidence },
    timestamp: new Date()
  });

  // 2️⃣ Draft reply
  const { draftReply: draft, citations } = draftReply(ticket.description, kbArticles);
  await AuditLog.create({ ticketId, traceId, actor: "system", action: "DRAFT_GENERATED", meta: { draft, citations }, timestamp: new Date() });

  // 3️⃣ Decision
  let status = ticket.status;
  let autoClosed = false;
  if (config.autoCloseEnabled && confidence >= (config.confidenceThreshold || 0.8)) {
    status = "resolved"; autoClosed = true;
    await AuditLog.create({ ticketId, traceId, actor: "system", action: "AUTO_CLOSED", meta: { draft }, timestamp: new Date() });
  } else {
    status = "waiting_human";
  }

  // 4️⃣ Save AgentSuggestion
  const suggestion = await AgentSuggestion.create({
    ticketId, predictedCategory, articleIds: citations, draftReply: draft, confidence, autoClosed,
    modelInfo: { provider: "stub", model: "deterministic", promptVersion: "v1", latencyMs: 5 },
    createdAt: new Date()
  });

  // 5️⃣ Update ticket status
  ticket.status = status;
  ticket.assignee = autoClosed ? null : ticket.assignee;
  await ticket.save();

  return { suggestion, ticket, traceId };
};
