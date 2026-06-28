const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const issueRoutes = require('./routes/issueRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const seedAdmin = require('./config/seed');

const app = express();

let isSeeded = false;

// Ensure DB connection for serverless
app.use(async (req, res, next) => {
  try {
    await connectDB();
    if (!isSeeded) {
      await seedAdmin();
      isSeeded = true;
    }
    next();
  } catch (err) {
    next(err);
  }
});

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || true,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Issue Tracker API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
