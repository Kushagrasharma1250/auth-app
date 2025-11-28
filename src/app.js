const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');  // ✅ imports router

const app = express();

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

// ✅ Use router here
app.use('/api/auth', authRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

module.exports = app;