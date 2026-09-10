 import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'; // <-- 1. Import your auth routes

const app = express();

// Global Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    name: 'Bookify Backend API',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// API Routes
// ==========================================
app.use('/api/auth', authRoutes); // <-- 2. Mount auth routes here

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found on Bookify API`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

export default app;