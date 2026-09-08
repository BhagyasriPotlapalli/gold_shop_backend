import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import branchRoutes from './routes/branchRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import goldOrderRoutes from './routes/goldOrderRoutes.js';
import auditLogRoutes from './routes/auditLogRoutes.js';
import metalRateRoutes from './routes/metalRateRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded profile images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/branches', branchRoutes);

app.use('/api/profiles', profileRoutes);
app.use('/api/gold-orders', goldOrderRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/metal-rates', metalRateRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Gold Shop POS API' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;
