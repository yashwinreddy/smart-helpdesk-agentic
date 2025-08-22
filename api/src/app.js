const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const ticketRoutes = require("./routes/tickets");
const kbRoutes = require("./routes/kb");
const auditRoutes = require("./routes/audit");
const agentRoutes = require("./routes/agent");
const configRoutes = require("./routes/config");

const app = express();
app.use(bodyParser.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/kb", kbRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/config", configRoutes);

mongoose
  .connect("mongodb://localhost:27017/helpdesk", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => res.send("Helpdesk API running..."));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
