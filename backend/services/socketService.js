import { Server } from 'socket.io';

let io = null;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`[WebSocket] Client connected: ${socket.id}`);

    // Join role-specific room or user room
    socket.on('JOIN_ROOM', (roomName) => {
      socket.join(roomName);
      console.log(`[WebSocket] Socket ${socket.id} joined room: ${roomName}`);
    });

    socket.on('LEAVE_ROOM', (roomName) => {
      socket.leave(roomName);
    });

    socket.on('disconnect', () => {
      console.log(`[WebSocket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  return io;
};

export const emitIntrusionAlert = (alertData) => {
  if (io) {
    console.log(`[WebSocket Broadcast] INTRUSION_ALERT -> Animal: ${alertData.animal} (${alertData.threatLevel})`);
    io.emit('INTRUSION_ALERT', alertData);
  }
};

export const emitSensorUpdate = (sensorData) => {
  if (io) {
    io.emit('SENSOR_UPDATE', sensorData);
  }
};

export const emitIncidentUpdate = (incidentData) => {
  if (io) {
    io.emit('INCIDENT_UPDATE', incidentData);
  }
};

export const emitSimulationState = (simulationData) => {
  if (io) {
    io.emit('SIMULATION_STATE', simulationData);
  }
};
