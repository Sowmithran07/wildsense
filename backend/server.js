import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { initSocket } from './services/socketService.js';
import { seedDatabase } from './utils/seedDatabase.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import sensorRoutes from './routes/sensorRoutes.js';
import detectionRoutes from './routes/detectionRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import incidentRoutes from './routes/incidentRoutes.js';
import sightingRoutes from './routes/sightingRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import iotRoutes from './routes/iotRoutes.js';
import simulationRoutes from './routes/simulationRoutes.js';

// Middleware imports
import { notFound, errorHandler } from './middleware/error.js';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);

// Initialize Socket.io
initSocket(httpServer);

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'WILD SENSE Backend Service',
    version: '1.0.0',
    timestamp: new Date(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sensors', sensorRoutes);
app.use('/api/detections', detectionRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/sightings', sightingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/simulation', simulationRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to Database, seed if empty, and start HTTP + WebSocket server
const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase();

    httpServer.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🌲 WILD SENSE Backend Server running on port ${PORT}`);
      console.log(`📡 WebSocket Gateway ready`);
      console.log(`🧪 API Health Check: http://localhost:${PORT}/api/health`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();

export { app, httpServer };
