const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({ ok: true, service: 'api', ts: new Date().toISOString() });
});

module.exports = router;
