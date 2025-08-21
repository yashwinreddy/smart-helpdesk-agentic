import mongoose from "mongoose";

const agentSuggestionSchema = new mongoose.Schema(
  {
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket", required: true },
    predictedCategory: { type: String, required: true },
    articleIds: [{ type: String }],
    draftReply: { type: String },
    confidence: { type: Number, required: true },
    autoClosed: { type: Boolean, default: false },
    modelInfo: {
      provider: { type: String, required: true },
      model: { type: String, required: true },
      promptVersion: { type: String },
      latencyMs: { type: Number },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } } // PDF only mentions createdAt
);

const AgentSuggestion = mongoose.model("AgentSuggestion", agentSuggestionSchema);
export default AgentSuggestion;
