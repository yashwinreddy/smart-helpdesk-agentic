const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectMongo } = require('./db');

const health = require('./routes/health');
const auth = require('./routes/auth');
const kb = require('./routes/kb');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

connectMongo();

app.use('/api/healthz', health);
app.use('/api/auth', auth);
app.use('/api/kb', kb);

// Global error handler (no stack traces to clients)
app.use((err, req, res, next) => {
  console.error('ERR:', err.message);
  res.status(err.status || 500).json({ error: 'Something went wrong' });
});

module.exports = app;
