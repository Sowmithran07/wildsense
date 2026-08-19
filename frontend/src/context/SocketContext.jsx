import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';
import { audioAlert } from '../utils/audioAlert';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeEmergencyAlert, setActiveEmergencyAlert] = useState(null);
  const [liveTelemetry, setLiveTelemetry] = useState(null);
  const [liveIncidents, setLiveIncidents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      console.log('⚡ [WebSocket Connected] Socket ID:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ [WebSocket Disconnected]');
      setIsConnected(false);
    });

    // Real-time intrusion alert listener
    newSocket.on('INTRUSION_ALERT', (alertData) => {
      console.log('🚨 [Live Intrusion Event Received]:', alertData);

      // Play audio cue
      if (alertData.threatLevel === 'CRITICAL' || alertData.threatLevel === 'HIGH') {
        audioAlert.playEmergencySiren();
        setActiveEmergencyAlert(alertData);
      } else {
        audioAlert.playRadarPing();
      }

      // Add to notifications
      setNotifications((prev) => [
        {
          _id: `live-${Date.now()}`,
          title: `🚨 [${alertData.threatLevel}] ${alertData.animal} Detected`,
          message: `Location: ${alertData.location} (~${alertData.distanceToVillageKm} km away)`,
          type: 'intrusion_alert',
          threatLevel: alertData.threatLevel,
          link: '/alerts',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setUnreadNotificationsCount((c) => c + 1);
    });

    // Real-time sensor telemetry update
    newSocket.on('SENSOR_UPDATE', (sensorData) => {
      setLiveTelemetry(sensorData);
    });

    // Real-time incident updates
    newSocket.on('INCIDENT_UPDATE', (incidentData) => {
      setLiveIncidents((prev) => [incidentData, ...prev.filter((i) => i._id !== incidentData._id)]);
    });

    // Real-time notifications
    newSocket.on('NEW_NOTIFICATION', (notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadNotificationsCount((c) => c + 1);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const toggleMute = () => {
    const nextState = !isAudioMuted;
    setIsAudioMuted(nextState);
    audioAlert.setMuted(nextState);
  };

  const dismissEmergencyAlert = () => {
    setActiveEmergencyAlert(null);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        activeEmergencyAlert,
        setActiveEmergencyAlert,
        dismissEmergencyAlert,
        liveTelemetry,
        liveIncidents,
        notifications,
        setNotifications,
        unreadNotificationsCount,
        setUnreadNotificationsCount,
        isAudioMuted,
        toggleMute,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
