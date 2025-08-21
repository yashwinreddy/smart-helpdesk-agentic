import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },
  traceId: { type: String },
  actor: { type: String, enum: ["system", "agent", "user"], required: true },
  action: {
    type: String,
    enum: [
      "TICKET_CREATED",
      "AGENT_CLASSIFIED",
      "KB_RETRIEVED",
      "DRAFT_GENERATED",
      "AUTO_CLOSED",
      "ASSIGNED_TO_HUMAN",
      "REPLY_SENT",
    ],
    required: true,
  },
  meta: { type: mongoose.Schema.Types.Mixed }, // store any JSON
  timestamp: { type: Date, default: Date.now },
});

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
