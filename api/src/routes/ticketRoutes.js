import express from "express";
import { Ticket } from "../models/tickets.js";


const router = express.Router();

// Create a new ticket
router.post("/", async (req, res) => {
    try {
        const ticket = new Ticket(req.body);
        await ticket.save();
        res.status(201).json(ticket);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all tickets
router.get("/", async (req, res) => {
    try {
        const tickets = await Ticket.find();
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// routes/tickets.js
router.put("/:id", async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!ticket) {
            return res.status(404).json({ error: "Ticket not found" });
        }
        res.json(ticket);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Delete a ticket by ID
router.delete("/:id", async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndDelete(req.params.id);
        if (!ticket) return res.status(404).json({ error: "Ticket not found" });
        res.json({ message: "Ticket deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Get a single ticket by ID
router.get("/:id", async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ error: "Ticket not found" });
        res.json(ticket);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
