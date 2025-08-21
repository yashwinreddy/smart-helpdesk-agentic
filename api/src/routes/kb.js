const router = require('express').Router();
const Joi = require('joi');
const Article = require('../models/Article');
const { requireAuth, requireRole } = require('../middleware/auth');

const upsertSchema = Joi.object({
  title: Joi.string().min(2).required(),
  body: Joi.string().min(2).required(),
  tags: Joi.array().items(Joi.string()).default([]),
  status: Joi.string().valid('draft', 'published').required()
});

// Search KB (public for now, can require auth if preferred)
router.get('/', async (req, res) => {
  const q = (req.query.query || '').trim();
  if (!q) {
    const all = await Article.find().sort({ updatedAt: -1 }).limit(50);
    return res.json(all);
  }
  const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const results = await Article.find({
    $or: [{ title: rx }, { body: rx }, { tags: rx }]
  }).limit(50);
  res.json(results);
});

// Create KB (admin)
router.post('/', requireAuth, requireRole(['admin']), async (req, res) => {
  const { value, error } = upsertSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const doc = await Article.create(value);
  res.status(201).json(doc);
});

// Update KB (admin)
router.put('/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  const { value, error } = upsertSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const doc = await Article.findByIdAndUpdate(req.params.id, value, { new: true });
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(doc);
});

// Delete KB (admin)
router.delete('/:id', requireAuth, requireRole(['admin']), async (req, res) => {
  const doc = await Article.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true });
});

module.exports = router;
