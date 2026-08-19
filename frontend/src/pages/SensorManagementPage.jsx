import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Plus,
  Edit2,
  Trash2,
  Battery,
  Wifi,
  Thermometer,
  Sun,
  AlertTriangle,
  Search,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SENSOR_TYPES } from '../utils/constants';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export const SensorManagementPage = () => {
  const [sensors, setSensors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    sensorId: '',
    name: '',
    type: 'PIR Motion Sensor',
    locationName: '',
    latitude: 11.6664,
    longitude: 76.6295,
    batteryLevel: 95,
    signalStrength: 90,
    connectivity: 'online',
    status: 'active',
    solarCharging: true,
    sensitivity: 'High',
    notes: '',
  });

  const { isAdmin, isOfficer } = useAuth();

  const fetchSensors = async () => {
    try {
      const res = await api.get('/sensors');
      if (res.success) {
        setSensors(res.sensors);
      }
    } catch (err) {
      console.error('Failed to load sensors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSensors();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      sensorId: '',
      name: '',
      type: 'PIR Motion Sensor',
      locationName: 'North Perimeter Corridor',
      latitude: +(11.65 + Math.random() * 0.04).toFixed(4),
      longitude: +(76.61 + Math.random() * 0.07).toFixed(4),
      batteryLevel: 100,
      signalStrength: 92,
      connectivity: 'online',
      status: 'active',
      solarCharging: true,
      sensitivity: 'High',
      notes: '',
    });
    setAddModalOpen(true);
  };

  const handleOpenEdit = (sensor) => {
    setSelectedSensor(sensor);
    setFormData({
      sensorId: sensor.sensorId,
      name: sensor.name,
      type: sensor.type,
      locationName: sensor.locationName,
      latitude: sensor.latitude,
      longitude: sensor.longitude,
      batteryLevel: sensor.batteryLevel,
      signalStrength: sensor.signalStrength,
      connectivity: sensor.connectivity,
      status: sensor.status,
      solarCharging: sensor.solarCharging,
      sensitivity: sensor.sensitivity || 'High',
      notes: sensor.notes || '',
    });
    setEditModalOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await api.post('/sensors', formData);
      if (res.success) {
        setAddModalOpen(false);
        fetchSensors();
      }
    } catch (err) {
      alert(err.message || 'Failed to create sensor');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSensor) return;

    setFormLoading(true);
    try {
      const res = await api.put(`/sensors/${selectedSensor._id}`, formData);
      if (res.success) {
        setEditModalOpen(false);
        fetchSensors();
      }
    } catch (err) {
      alert(err.message || 'Failed to update sensor');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSensor) return;

    setFormLoading(true);
    try {
      const res = await api.delete(`/sensors/${selectedSensor._id}`);
      if (res.success) {
        setDeleteConfirmOpen(false);
        fetchSensors();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete sensor');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredSensors = sensors.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.sensorId.toLowerCase().includes(search.toLowerCase()) ||
      s.locationName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-forest-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Sensor Fleet Management
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Cpu className="w-3.5 h-3.5" />
              HARDWARE MATRIX
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Provision, monitor battery health, calibrate sensitivity, and manage edge IoT sensor nodes
          </p>
        </div>

        {isAdmin && (
          <button onClick={handleOpenAdd} className="btn-primary py-2 px-4 text-xs">
            <Plus className="w-4 h-4" />
            <span>Deploy New Sensor Node</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="glass-card rounded-2xl p-4 flex items-center justify-between gap-4 border border-forest-700/60">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sensor nodes by name, ID, location..."
            className="w-full glass-input pl-10 pr-4 py-2 text-xs"
          />
        </div>

        <span className="text-xs font-mono text-slate-400">
          Fleet Count: <span className="text-white font-bold">{filteredSensors.length}</span> nodes
        </span>
      </div>

      {/* SENSORS LIST */}
      {loading ? (
        <Loader message="Synchronizing Hardware Telemetry Fleet..." />
      ) : filteredSensors.length === 0 ? (
        <EmptyState
          icon={Cpu}
          title="No Sensors Found"
          description="No sensors matching your search query were found."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSensors.map((sensor) => (
            <div
              key={sensor._id || sensor.sensorId}
              className="glass-card-hover rounded-2xl p-5 border border-forest-700/60 flex flex-col justify-between space-y-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-forest-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-forest-800 flex items-center justify-center text-emerald-400 font-bold text-xs">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-100">{sensor.name}</h3>
                    <span className="text-[10px] font-mono text-emerald-400">{sensor.sensorId}</span>
                  </div>
                </div>
                <StatusBadge status={sensor.status} size="xs" />
              </div>

              {/* Specs */}
              <div className="space-y-1.5 text-xs text-slate-300">
                <p className="flex justify-between">
                  <span className="text-slate-400">Type:</span>
                  <span className="font-semibold text-white">{sensor.type}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-400">Location:</span>
                  <span className="truncate max-w-[180px]">{sensor.locationName}</span>
                </p>
                <p className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-400">GPS:</span>
                  <span>{sensor.latitude.toFixed(4)}°N, {sensor.longitude.toFixed(4)}°E</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-400">Sensitivity:</span>
                  <span className="font-mono text-emerald-400">{sensor.sensitivity || 'High'}</span>
                </p>
              </div>

              {/* Hardware Bar */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-obsidian-900/80 border border-forest-800 text-center text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">BATTERY</span>
                  <span className="font-bold text-emerald-400">{sensor.batteryLevel}%</span>
                </div>
                <div className="border-x border-forest-800">
                  <span className="text-[10px] text-slate-400 block">SIGNAL</span>
                  <span className="font-bold text-cyan-400">{sensor.signalStrength}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">SOLAR</span>
                  <span className="font-bold text-amber-400">{sensor.solarCharging ? 'ACTIVE' : 'OFF'}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-forest-800">
                <span className="text-[10px] font-mono text-slate-500">
                  Active: {new Date(sensor.lastActive || Date.now()).toLocaleTimeString()}
                </span>

                {(isAdmin || isOfficer) && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(sensor)}
                      className="p-1.5 rounded-lg border border-forest-700 hover:bg-forest-800 text-slate-300 hover:text-white transition-colors"
                      title="Edit Sensor"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => {
                          setSelectedSensor(sensor);
                          setDeleteConfirmOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-red-500/30 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                        title="Delete Sensor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT SENSOR MODAL */}
      {(addModalOpen || editModalOpen) && (
        <Modal
          isOpen={addModalOpen || editModalOpen}
          onClose={() => {
            setAddModalOpen(false);
            setEditModalOpen(false);
          }}
          title={addModalOpen ? 'Deploy New Sensor Node' : `Edit Sensor: ${selectedSensor?.sensorId}`}
        >
          <form onSubmit={addModalOpen ? handleAddSubmit : handleEditSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Sensor ID</label>
                <input
                  type="text"
                  value={formData.sensorId}
                  onChange={(e) => setFormData({ ...formData, sensorId: e.target.value })}
                  placeholder="e.g. SEN-CAM-111 (Auto if blank)"
                  className="w-full glass-input font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Node Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. South Corridor Node"
                  required
                  className="w-full glass-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Sensor Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full glass-input"
                >
                  {SENSOR_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-obsidian-900">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Operational Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full glass-input"
                >
                  <option value="active" className="bg-obsidian-900">Active</option>
                  <option value="warning" className="bg-obsidian-900">Warning</option>
                  <option value="maintenance" className="bg-obsidian-900">Maintenance</option>
                  <option value="inactive" className="bg-obsidian-900">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Location / Sector Description</label>
              <input
                type="text"
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                placeholder="e.g. Mangala Elephant Corridor Crossing"
                required
                className="w-full glass-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                  className="w-full glass-input font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                  className="w-full glass-input font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.solarCharging}
                  onChange={(e) => setFormData({ ...formData, solarCharging: e.target.checked })}
                  className="rounded bg-obsidian-900 border-forest-700 text-emerald-500 focus:ring-0"
                />
                <span>Solar Panel Connected & Charging</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-forest-800">
              <button
                type="button"
                onClick={() => {
                  setAddModalOpen(false);
                  setEditModalOpen(false);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="btn-primary"
              >
                {formLoading ? 'Saving...' : addModalOpen ? 'Deploy Sensor' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* DELETE CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title={`Decommission Sensor: ${selectedSensor?.sensorId}`}
        message={`Are you sure you wish to delete ${selectedSensor?.name}? This will remove it from real-time monitoring.`}
        confirmLabel="Decommission Node"
        isDanger={true}
        loading={formLoading}
      />
    </div>
  );
};

export default SensorManagementPage;
