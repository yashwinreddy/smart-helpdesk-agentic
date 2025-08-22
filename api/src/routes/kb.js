const router = require("express").Router();
const Joi = require("joi");
const Article = require("../models/Article");
const AuditLog = require("../models/AuditLog");
const { requireAuth, requireRole } = require("../middleware/auth");

const upsertSchema = Joi.object({
  title: Joi.string().min(2).required(),
  body: Joi.string().min(2).required(),
  tags: Joi.array().items(Joi.string()).default([]),
  status: Joi.string().valid("draft", "published").required(),
});

// =============================
// Search KB (auth required)
// =============================
router.get("/search", requireAuth, async (req, res) => {
  try {
    const q = (req.query.query || "").trim();
    let query = {};

    if (q) {
      const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [{ title: rx }, { body: rx }, { tags: rx }];
    }

    if (req.user.role !== "admin") {
      query.status = "published";
    }

    const results = await Article.find(query).sort({ updatedAt: -1 }).limit(50);

    // ✅ Audit log (KB_RETRIEVED)
    await AuditLog.create({
      actor: req.user.role === "admin" ? "agent" : "user",
      action: "KB_RETRIEVED",
      meta: { query: q, count: results.length },
    });

    res.json(results);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// =============================
// Create KB (admin)
// =============================
router.post("/", requireAuth, requireRole(["admin"]), async (req, res) => {
  const { value, error } = upsertSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  const doc = await Article.create(value);

  // ✅ Audit log (system marks creation as a draft generated)
  await AuditLog.create({
    actor: "agent",
    action: "DRAFT_GENERATED",
    meta: { articleId: doc._id, title: doc.title },
  });

  res.status(201).json(doc);
});

// =============================
// Update KB (admin)
// =============================
router.put("/:id", requireAuth, requireRole(["admin"]), async (req, res) => {
  const { value, error } = upsertSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  const doc = await Article.findByIdAndUpdate(req.params.id, value, {
    new: true,
  });
  if (!doc) return res.status(404).json({ error: "Not found" });

  // ✅ Audit log (agent updating draft/published content)
  await AuditLog.create({
    actor: "agent",
    action: "DRAFT_GENERATED", // reuse action since no UPDATE_KB in enum
    meta: { articleId: doc._id, title: doc.title, updated: true },
  });

  res.json(doc);
});

// =============================
// Delete KB (admin)
// =============================
router.delete("/:id", requireAuth, requireRole(["admin"]), async (req, res) => {
  const doc = await Article.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });

  // ✅ Audit log (auto-close equivalent for deletion)
  await AuditLog.create({
    actor: "agent",
    action: "AUTO_CLOSED",
    meta: { articleId: doc._id, title: doc.title, deleted: true },
  });

  res.json({ ok: true });
});

module.exports = router;
