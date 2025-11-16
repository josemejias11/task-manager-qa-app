import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';
import './config/database'; // Initialize SQLite database
import taskRoutes from './routes/task.routes';
import { errorHandler } from './middleware/error.middleware';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security middleware - Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable for development; configure properly for production
  })
);

// Compression middleware
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (for production build)
if (NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../dist/client')));
}

// API Routes
app.use('/api/tasks', taskRoutes);

// SPA fallback (for production)
if (NODE_ENV === 'production') {
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../dist/client/index.html'));
  });
}

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server function
const startServer = (port: number): void => {
  const server = app.listen(port, () => {
    console.log(`✓ Server running on http://localhost:${port}`);
    console.log(`✓ Environment: ${NODE_ENV}`);
    console.log(`✓ CORS Origin: ${corsOptions.origin}`);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is already in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
};

// Start the server
startServer(Number(PORT));

export default app;
