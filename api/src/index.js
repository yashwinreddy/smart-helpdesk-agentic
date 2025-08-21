import express from "express";
import mongoose from "mongoose";
import ticketRoutes from "./routes/ticketRoutes.js";
import userRoutes from "./routes/userRoutes.js";   // ✅ NEW
import articleRoutes from "./routes/articleRoutes.js";
import agentSuggestionRoutes from "./routes/agentSuggestionRoutes.js";
import auditLogRoutes from "./routes/auditLogRoutes.js";
import configRoutes from "./routes/configRoutes.js";


const app = express();
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://mongo:27017/helpdesk", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected ✅"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Ticket routes
app.use("/tickets", ticketRoutes);

app.use("/articles", articleRoutes);

app.use("/config", configRoutes);

app.use("/agent-suggestions", agentSuggestionRoutes);

app.use("/audit-logs", auditLogRoutes);

// User routes ✅
app.use("/users", userRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
