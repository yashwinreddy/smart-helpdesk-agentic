import express from "express";
import {
    createTicket,
    getTickets,
    getTicketById,
    updateTicket,
    deleteTicket,
    replyToTicket,
    getTicketAuditLogs,
    assignTicket,
} from "../controllers/ticketController.js";

const router = express.Router();

// Ticket CRUD
router.post("/", createTicket);           // Create a ticket (user)
router.get("/", getTickets);             // Get all tickets (filter optional)
router.get("/:id", getTicketById);       // Get a single ticket by ID
router.put("/:id", updateTicket);
router.get("/:id/audit", getTicketAuditLogs);     // Update ticket (fields like status, description)
router.delete("/:id", deleteTicket);     // Delete a ticket

// Agent/Assignment actions
router.post("/:id/reply", replyToTicket);    // Agent replies to ticket
router.post("/:id/assign", assignTicket);    // Assign ticket to human

export default router;

