import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useSocket } from './SocketContext';

const SimulationContext = createContext(null);

export const SimulationProvider = ({ children }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [intervalSeconds, setIntervalSeconds] = useState(30);
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();

  useEffect(() => {
    // Check initial simulation status from backend
    const checkStatus = async () => {
      try {
        const res = await api.get('/simulation/status');
        if (res.success) {
          setIsSimulating(res.isRunning);
          setIntervalSeconds(res.intervalSeconds || 30);
        }
      } catch (err) {
        console.warn('Simulation status check failed:', err.message);
      }
    };

    checkStatus();

    if (socket) {
      socket.on('SIMULATION_STATE', (state) => {
        setIsSimulating(state.isRunning);
        if (state.intervalSeconds) setIntervalSeconds(state.intervalSeconds);
      });
    }
  }, [socket]);

  const toggleSimulation = async (enable) => {
    setLoading(true);
    try {
      const res = await api.post('/simulation/toggle', {
        enable: enable !== undefined ? enable : !isSimulating,
        interval: intervalSeconds,
      });
      if (res.success && res.simulation) {
        setIsSimulating(res.simulation.isRunning);
      }
      return res;
    } catch (err) {
      console.error('Failed to toggle simulation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const triggerManualIntrusion = async (animal) => {
    setLoading(true);
    try {
      const res = await api.post('/simulation/trigger-manual', { animal });
      return res;
    } catch (err) {
      console.error('Failed to trigger manual intrusion:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SimulationContext.Provider
      value={{
        isSimulating,
        intervalSeconds,
        setIntervalSeconds,
        loading,
        toggleSimulation,
        triggerManualIntrusion,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
