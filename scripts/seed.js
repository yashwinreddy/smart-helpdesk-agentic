import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../api/src/models/User.js";
import { Article } from "../api/src/models/Article.js";
import { Ticket } from "../api/src/models/tickets.js";

dotenv.config();

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB ✅");

    await User.deleteMany();
    await Article.deleteMany();
    await Ticket.deleteMany();

    await User.insertMany([
        { username: "alice", password: "hashedpassword", role: "user" },
        { username: "bob", password: "hashedpassword", role: "agent" }
    ]);

    await Article.insertMany([
        { title: "Reset password", content: "Steps to reset password..." },
        { title: "VPN issues", content: "Steps to troubleshoot VPN..." }
    ]);

    await Ticket.insertMany([
        { user: "alice", subject: "Cannot login", status: "open" }
    ]);

    console.log("Seed complete ✅");
    process.exit(0);
}

seed();
