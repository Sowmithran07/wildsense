// Client-Side Zero-Dependency Mock Data Engine for Static GitHub Pages
import { ANIMALS } from '../utils/constants';

const INITIAL_USERS = [
  {
    _id: 'usr_admin_101',
    name: 'Dr. Ramesh Kulkarni',
    email: 'admin@wildsense.org',
    role: 'admin',
    phone: '+91 94481 22334',
    location: { name: 'Bandipur Reserve Headquarters', latitude: 11.6664, longitude: 76.6295, radiusKm: 15 },
    assignedZone: 'Central Command & Core Reserve',
    badgeNumber: 'KA-FD-DIR-01',
  },
  {
    _id: 'usr_officer_101',
    name: 'Ranger Vikram Gowda',
    email: 'officer@wildsense.org',
    role: 'officer',
    phone: '+91 98450 77889',
    location: { name: 'Gundlupet Range Station', latitude: 11.6912, longitude: 76.6854, radiusKm: 8 },
    assignedZone: 'Sector North - Buffer Zone 1',
    badgeNumber: 'RFR-4082',
  },
  {
    _id: 'usr_resident_101',
    name: 'Basavaraju M.',
    email: 'resident@wildsense.org',
    role: 'resident',
    phone: '+91 99012 33445',
    location: { name: 'Mangala Village', latitude: 11.6782, longitude: 76.6214, radiusKm: 3 },
    assignedZone: 'Mangala Farming Cluster',
    badgeNumber: '',
  },
];

const INITIAL_SENSORS = [
  { _id: 's1', sensorId: 'SEN-CAM-101', name: 'Mangala Perimeter Optical Cam', type: 'Optical Camera', locationName: 'Mangala North Agricultural Ridge', latitude: 11.6782, longitude: 76.6214, batteryLevel: 94, signalStrength: 88, connectivity: 'online', status: 'active', solarCharging: true, temperature: 26.2 },
  { _id: 's2', sensorId: 'SEN-PIR-102', name: 'Gundlupet Buffer PIR Node', type: 'PIR Motion Sensor', locationName: 'Gundlupet Elephant Migration Trail', latitude: 11.6591, longitude: 76.6152, batteryLevel: 89, signalStrength: 92, connectivity: 'online', status: 'active', solarCharging: true, temperature: 27.5 },
  { _id: 's3', sensorId: 'SEN-THERM-103', name: 'Kalkere Sector Thermal Array', type: 'Thermal Camera', locationName: 'Kalkere Forest Core Gateway', latitude: 11.6421, longitude: 76.6034, batteryLevel: 78, signalStrength: 65, connectivity: 'weak', status: 'warning', solarCharging: true, temperature: 28.1 },
  { _id: 's4', sensorId: 'SEN-ACU-104', name: 'Maddur Stream Acoustic Node', type: 'Acoustic Sensor', locationName: 'Maddur River Corridor Crossing', latitude: 11.6853, longitude: 76.6389, batteryLevel: 96, signalStrength: 95, connectivity: 'online', status: 'active', solarCharging: true, temperature: 25.4 },
  { _id: 's5', sensorId: 'SEN-PIR-105', name: 'Berambadi Farmland PIR', type: 'PIR Motion Sensor', locationName: 'Berambadi Village Fence Line', latitude: 11.7012, longitude: 76.6521, batteryLevel: 91, signalStrength: 84, connectivity: 'online', status: 'active', solarCharging: true, temperature: 26.8 },
  { _id: 's6', sensorId: 'SEN-SEIS-106', name: 'Moolehole Footstep Seismic', type: 'Seismic Sensor', locationName: 'Moolehole Heavy Fauna Corridor', latitude: 11.6289, longitude: 76.5891, batteryLevel: 45, signalStrength: 50, connectivity: 'weak', status: 'warning', solarCharging: false, temperature: 29.0 },
  { _id: 's7', sensorId: 'SEN-CAM-107', name: 'Nugu River Cam Trap', type: 'Optical Camera', locationName: 'Nugu Reservoir Backwaters', latitude: 11.7145, longitude: 76.6712, batteryLevel: 98, signalStrength: 91, connectivity: 'online', status: 'active', solarCharging: true, temperature: 25.8 },
  { _id: 's8', sensorId: 'SEN-PIR-108', name: 'Hangala Sector PIR Array', type: 'PIR Motion Sensor', locationName: 'Hangala Highway Buffer Corridor', latitude: 11.6498, longitude: 76.6412, batteryLevel: 82, signalStrength: 79, connectivity: 'online', status: 'active', solarCharging: true, temperature: 27.1 },
];

const INITIAL_DETECTIONS = [
  { _id: 'd1', detectionId: 'DET-2026-001', animal: 'Elephant', confidence: 96.4, threatLevel: 'CRITICAL', locationName: 'Mangala North Agricultural Ridge', latitude: 11.6782, longitude: 76.6214, distanceToVillageKm: 0.8, detectedAt: new Date(Date.now() - 15 * 60000).toISOString(), image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&auto=format&fit=crop&q=80' },
  { _id: 'd2', detectionId: 'DET-2026-002', animal: 'Tiger', confidence: 94.2, threatLevel: 'CRITICAL', locationName: 'Gundlupet Elephant Migration Trail', latitude: 11.6591, longitude: 76.6152, distanceToVillageKm: 1.4, detectedAt: new Date(Date.now() - 45 * 60000).toISOString(), image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=600&auto=format&fit=crop&q=80' },
  { _id: 'd3', detectionId: 'DET-2026-003', animal: 'Leopard', confidence: 91.8, threatLevel: 'HIGH', locationName: 'Kalkere Forest Core Gateway', latitude: 11.6421, longitude: 76.6034, distanceToVillageKm: 2.1, detectedAt: new Date(Date.now() - 110 * 60000).toISOString(), image: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=600&auto=format&fit=crop&q=80' },
  { _id: 'd4', detectionId: 'DET-2026-004', animal: 'Wild Boar', confidence: 88.5, threatLevel: 'MEDIUM', locationName: 'Berambadi Village Fence Line', latitude: 11.7012, longitude: 76.6521, distanceToVillageKm: 0.4, detectedAt: new Date(Date.now() - 180 * 60000).toISOString(), image: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=600&auto=format&fit=crop&q=80' },
  { _id: 'd5', detectionId: 'DET-2026-005', animal: 'Sloth Bear', confidence: 89.1, threatLevel: 'HIGH', locationName: 'Maddur River Corridor Crossing', latitude: 11.6853, longitude: 76.6389, distanceToVillageKm: 1.8, detectedAt: new Date(Date.now() - 240 * 60000).toISOString(), image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=600&auto=format&fit=crop&q=80' },
];

const INITIAL_ALERTS = [
  { _id: 'a1', alertId: 'ALT-101', animal: 'Elephant', threatLevel: 'CRITICAL', location: 'Mangala North Ridge', latitude: 11.6782, longitude: 76.6214, distanceToVillageKm: 0.8, status: 'new', createdAt: new Date(Date.now() - 15 * 60000).toISOString(), detection: INITIAL_DETECTIONS[0] },
  { _id: 'a2', alertId: 'ALT-102', animal: 'Tiger', threatLevel: 'CRITICAL', location: 'Gundlupet Corridor', latitude: 11.6591, longitude: 76.6152, distanceToVillageKm: 1.4, status: 'acknowledged', createdAt: new Date(Date.now() - 45 * 60000).toISOString(), detection: INITIAL_DETECTIONS[1] },
  { _id: 'a3', alertId: 'ALT-103', animal: 'Leopard', threatLevel: 'HIGH', location: 'Kalkere Gateway', latitude: 11.6421, longitude: 76.6034, distanceToVillageKm: 2.1, status: 'in_progress', createdAt: new Date(Date.now() - 110 * 60000).toISOString(), detection: INITIAL_DETECTIONS[2] },
  { _id: 'a4', alertId: 'ALT-104', animal: 'Wild Boar', threatLevel: 'MEDIUM', location: 'Berambadi Buffer', latitude: 11.7012, longitude: 76.6521, distanceToVillageKm: 0.4, status: 'resolved', createdAt: new Date(Date.now() - 180 * 60000).toISOString(), detection: INITIAL_DETECTIONS[3] },
];

const INITIAL_INCIDENTS = [
  {
    _id: 'inc1',
    incidentId: 'INC-2026-001',
    animal: 'Elephant',
    threatLevel: 'CRITICAL',
    location: 'Mangala North Agricultural Ridge',
    latitude: 11.6782,
    longitude: 76.6214,
    status: 'investigating',
    detection: INITIAL_DETECTIONS[0],
    assignedOfficer: INITIAL_USERS[1],
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
    responseNotes: [
      { _id: 'n1', note: 'Range Squad Alpha dispatched with non-invasive acoustic dispersers.', officerName: 'Ranger Vikram Gowda', timestamp: new Date(Date.now() - 20 * 60000).toISOString() }
    ],
    actionTimeline: [
      { _id: 't1', title: 'Critical Elephant Intrusion Ingested', description: 'Detected 0.8 km from Mangala Village', user: 'AI Vision Engine', timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
      { _id: 't2', title: 'Forest Squad Dispatched', description: 'Assigned to Ranger Vikram Gowda', user: 'Central Dispatch', timestamp: new Date(Date.now() - 25 * 60000).toISOString() }
    ]
  },
  {
    _id: 'inc2',
    incidentId: 'INC-2026-002',
    animal: 'Tiger',
    threatLevel: 'CRITICAL',
    location: 'Gundlupet Migration Trail',
    latitude: 11.6591,
    longitude: 76.6152,
    status: 'contained',
    detection: INITIAL_DETECTIONS[1],
    assignedOfficer: INITIAL_USERS[1],
    createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
    responseNotes: [
      { _id: 'n2', note: 'Tiger safely escorted away from village irrigation canal back toward core.', officerName: 'Ranger Vikram Gowda', timestamp: new Date(Date.now() - 40 * 60000).toISOString() }
    ],
    actionTimeline: [
      { _id: 't3', title: 'Tiger Sighting Confirmed', description: 'Thermal camera spike detected', user: 'System', timestamp: new Date(Date.now() - 90 * 60000).toISOString() }
    ]
  }
];

const INITIAL_SIGHTINGS = [
  {
    _id: 'sg1',
    sightingId: 'SGT-001',
    animal: 'Elephant',
    locationName: 'Mangala Village - Farm Sector 3',
    description: 'Saw matriarch herd of 3 elephants near solar water trough.',
    threatEstimate: 'HIGH',
    status: 'verified',
    reporterName: 'Basavaraju M.',
    image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 120 * 60000).toISOString()
  },
  {
    _id: 'sg2',
    sightingId: 'SGT-002',
    animal: 'Leopard',
    locationName: 'Kalkere Outer Trail',
    description: 'Pugmarks spotted on boulder path heading towards hill.',
    threatEstimate: 'HIGH',
    status: 'pending',
    reporterName: 'Suresh Gowda',
    image: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=600&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 240 * 60000).toISOString()
  }
];

// In-Memory state
class MockStore {
  constructor() {
    this.users = [...INITIAL_USERS];
    this.sensors = [...INITIAL_SENSORS];
    this.detections = [...INITIAL_DETECTIONS];
    this.alerts = [...INITIAL_ALERTS];
    this.incidents = [...INITIAL_INCIDENTS];
    this.sightings = [...INITIAL_SIGHTINGS];
  }

  handle(endpoint, options = {}) {
    const method = options.method || 'GET';
    const body = options.body ? JSON.parse(options.body) : {};

    // Auth
    if (endpoint === '/auth/login' || endpoint.startsWith('/auth/login')) {
      const { email } = body;
      let user = this.users.find((u) => u.email === email);
      if (!user) {
        // Default based on role in email or default admin
        user = email.includes('officer') ? this.users[1] : email.includes('resident') ? this.users[2] : this.users[0];
      }
      return { success: true, token: 'mock_jwt_token_' + user.role, user };
    }

    if (endpoint === '/auth/register') {
      const newUser = {
        _id: 'usr_' + Date.now(),
        name: body.name || 'Community Member',
        email: body.email,
        role: body.role || 'resident',
        phone: body.phone || '+91 94480 00000',
        location: { name: body.locationName || 'Bandipur Fringe', latitude: 11.6664, longitude: 76.6295, radiusKm: 5 },
        assignedZone: body.assignedZone || 'Buffer Zone 1',
      };
      this.users.push(newUser);
      return { success: true, token: 'mock_jwt_token_' + newUser.role, user: newUser };
    }

    if (endpoint === '/auth/me') {
      const user = this.users[0];
      return { success: true, user };
    }

    if (endpoint === '/auth/officers') {
      return { success: true, officers: this.users.filter((u) => u.role === 'officer' || u.role === 'admin') };
    }

    if (endpoint === '/auth/users') {
      return { success: true, count: this.users.length, users: this.users };
    }

    // Sensors
    if (endpoint.startsWith('/sensors')) {
      if (method === 'GET') {
        const idMatch = endpoint.match(/\/sensors\/(.+)/);
        if (idMatch) {
          const s = this.sensors.find((x) => x._id === idMatch[1] || x.sensorId === idMatch[1]);
          return { success: true, sensor: s || this.sensors[0] };
        }
        return { success: true, count: this.sensors.length, sensors: this.sensors };
      }
      if (method === 'POST') {
        const newSensor = {
          _id: 's_' + Date.now(),
          sensorId: body.sensorId || `SEN-NODE-${this.sensors.length + 101}`,
          ...body,
          batteryLevel: body.batteryLevel || 95,
          signalStrength: body.signalStrength || 90,
          connectivity: 'online',
          status: 'active',
          solarCharging: true,
          temperature: 26.0,
        };
        this.sensors.unshift(newSensor);
        return { success: true, sensor: newSensor };
      }
      if (method === 'PUT') {
        const id = endpoint.split('/')[2];
        const idx = this.sensors.findIndex((x) => x._id === id || x.sensorId === id);
        if (idx !== -1) {
          this.sensors[idx] = { ...this.sensors[idx], ...body };
          return { success: true, sensor: this.sensors[idx] };
        }
      }
      if (method === 'DELETE') {
        const id = endpoint.split('/')[2];
        this.sensors = this.sensors.filter((x) => x._id !== id && x.sensorId !== id);
        return { success: true, message: 'Sensor decommissioned' };
      }
    }

    // Detections
    if (endpoint.startsWith('/detections')) {
      if (method === 'GET') {
        return { success: true, count: this.detections.length, detections: this.detections };
      }
      if (method === 'POST') {
        const newDet = {
          _id: 'd_' + Date.now(),
          detectionId: 'DET-2026-' + (this.detections.length + 1).toString().padStart(3, '0'),
          animal: body.animal || 'Elephant',
          confidence: 95.5,
          threatLevel: body.threatLevel || 'CRITICAL',
          locationName: body.locationName || 'Mangala North Ridge',
          latitude: 11.6782,
          longitude: 76.6214,
          distanceToVillageKm: 0.8,
          detectedAt: new Date().toISOString(),
          image: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&auto=format&fit=crop&q=80',
        };
        this.detections.unshift(newDet);
        return { success: true, detection: newDet };
      }
    }

    // Alerts
    if (endpoint.startsWith('/alerts')) {
      if (method === 'GET') {
        return { success: true, count: this.alerts.length, alerts: this.alerts };
      }
      if (method === 'PUT' && endpoint.includes('/status')) {
        const id = endpoint.split('/')[2];
        const alert = this.alerts.find((a) => a._id === id || a.alertId === id);
        if (alert) {
          alert.status = body.status || 'acknowledged';
          return { success: true, alert };
        }
      }
    }

    // Incidents
    if (endpoint.startsWith('/incidents')) {
      if (method === 'GET') {
        const idMatch = endpoint.match(/\/incidents\/([a-zA-Z0-9_-]+)/);
        if (idMatch && !endpoint.includes('?')) {
          const inc = this.incidents.find((x) => x._id === idMatch[1] || x.incidentId === idMatch[1]);
          return { success: true, incident: inc || this.incidents[0] };
        }
        return { success: true, count: this.incidents.length, incidents: this.incidents, totalPages: 1, currentPage: 1 };
      }
      if (method === 'POST' && endpoint.includes('/notes')) {
        const id = endpoint.split('/')[2];
        const inc = this.incidents.find((x) => x._id === id || x.incidentId === id);
        if (inc) {
          inc.responseNotes = inc.responseNotes || [];
          inc.responseNotes.push({
            _id: 'n_' + Date.now(),
            note: body.note,
            officerName: 'Patrol Ranger',
            timestamp: new Date().toISOString(),
          });
          return { success: true, incident: inc };
        }
      }
    }

    // Sightings
    if (endpoint.startsWith('/sightings')) {
      if (method === 'GET') {
        return { success: true, count: this.sightings.length, sightings: this.sightings };
      }
      if (method === 'POST') {
        const newSgt = {
          _id: 'sg_' + Date.now(),
          sightingId: 'SGT-' + (this.sightings.length + 1).toString().padStart(3, '0'),
          animal: body.animal || 'Elephant',
          locationName: body.locationName || 'Village Border',
          description: body.description || 'Spotted near farm boundary',
          threatEstimate: body.threatEstimate || 'HIGH',
          reporterName: body.reporterName || 'Resident Farmer',
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        this.sightings.unshift(newSgt);
        return { success: true, sighting: newSgt };
      }
      if (method === 'PUT') {
        const id = endpoint.split('/')[2];
        const s = this.sightings.find((x) => x._id === id || x.sightingId === id);
        if (s) {
          s.status = body.status || 'verified';
          return { success: true, sighting: s };
        }
      }
    }

    // Analytics Dashboard
    if (endpoint.startsWith('/analytics/dashboard')) {
      return {
        success: true,
        stats: {
          activeAlerts: this.alerts.filter((a) => a.status !== 'resolved').length,
          criticalAlerts: this.alerts.filter((a) => a.threatLevel === 'CRITICAL' && a.status !== 'resolved').length,
          detectedToday: 6,
          activeSensors: this.sensors.filter((s) => s.status === 'active').length,
          warningSensors: 2,
          offlineSensors: 0,
          totalSensors: this.sensors.length,
          resolvedIncidents: 4,
          openIncidents: 2,
          pendingSightings: this.sightings.filter((s) => s.status === 'pending').length,
          sensorHealthPercentage: 88,
        },
        highRiskSectors: [
          { name: 'Mangala Farming Cluster', threatLevel: 'CRITICAL', intrusions: 14, activeSirens: 2 },
          { name: 'Gundlupet Migration Ridge', threatLevel: 'HIGH', intrusions: 9, activeSirens: 1 },
          { name: 'Berambadi Farmland Border', threatLevel: 'MEDIUM', intrusions: 6, activeSirens: 0 },
        ],
        speciesStats: [
          { animal: 'Elephant', count: 12 },
          { animal: 'Tiger', count: 7 },
          { animal: 'Leopard', count: 5 },
          { animal: 'Wild Boar', count: 9 },
          { animal: 'Sloth Bear', count: 4 },
        ],
      };
    }

    // Analytics Trends
    if (endpoint.startsWith('/analytics/trends')) {
      return {
        success: true,
        dailyIntrusions: [
          { _id: '2026-08-13', total: 4, critical: 1, high: 2, medium: 1 },
          { _id: '2026-08-14', total: 6, critical: 2, high: 3, medium: 1 },
          { _id: '2026-08-15', total: 3, critical: 0, high: 2, medium: 1 },
          { _id: '2026-08-16', total: 8, critical: 3, high: 4, medium: 1 },
          { _id: '2026-08-17', total: 5, critical: 1, high: 3, medium: 1 },
          { _id: '2026-08-18', total: 7, critical: 2, high: 4, medium: 1 },
          { _id: '2026-08-19', total: 9, critical: 3, high: 5, medium: 1 },
        ],
        hourlyActivity: [
          { hour: '00:00', count: 8 },
          { hour: '02:00', count: 11 },
          { hour: '04:00', count: 7 },
          { hour: '06:00', count: 2 },
          { hour: '08:00', count: 1 },
          { hour: '10:00', count: 0 },
          { hour: '12:00', count: 0 },
          { hour: '14:00', count: 1 },
          { hour: '16:00', count: 2 },
          { hour: '18:00', count: 6 },
          { hour: '20:00', count: 12 },
          { hour: '22:00', count: 14 },
        ],
        animalDistribution: [
          { animal: 'Elephant', count: 18 },
          { animal: 'Tiger', count: 9 },
          { animal: 'Leopard', count: 7 },
          { animal: 'Wild Boar', count: 14 },
          { animal: 'Sloth Bear', count: 5 },
        ],
        locationDistribution: [
          { location: 'Mangala North Ridge', count: 16 },
          { location: 'Gundlupet Buffer', count: 11 },
          { location: 'Berambadi Village', count: 8 },
          { location: 'Maddur Stream', count: 6 },
        ],
      };
    }

    // Reports
    if (endpoint.startsWith('/reports/summary')) {
      return {
        success: true,
        reportMetadata: { reportType: 'Weekly Intrusion & Containment Report', preparedBy: 'WILD SENSE Automated System' },
        summary: { totalIntrusions: 28, criticalThreats: 8, resolutionRate: '96.4%', activeSensors: 8, monitoredSensors: 8 },
        incidents: this.incidents,
      };
    }

    // Simulation
    if (endpoint.startsWith('/simulation/trigger-manual')) {
      const animal = body.animal || 'Elephant';
      const newDet = {
        _id: 'd_sim_' + Date.now(),
        detectionId: 'DET-SIM-' + Date.now().toString().slice(-4),
        animal,
        confidence: 96.8,
        threatLevel: animal === 'Elephant' || animal === 'Tiger' ? 'CRITICAL' : 'HIGH',
        locationName: 'Mangala North Agricultural Ridge',
        latitude: 11.6782,
        longitude: 76.6214,
        distanceToVillageKm: 0.7,
        detectedAt: new Date().toISOString(),
        image: animal === 'Elephant' 
          ? 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=600&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=600&auto=format&fit=crop&q=80',
      };
      this.detections.unshift(newDet);
      const newAlert = {
        _id: 'a_sim_' + Date.now(),
        alertId: 'ALT-SIM-' + Date.now().toString().slice(-3),
        animal,
        threatLevel: newDet.threatLevel,
        location: 'Mangala North Ridge (~0.7 km to village)',
        latitude: 11.6782,
        longitude: 76.6214,
        distanceToVillageKm: 0.7,
        status: 'new',
        createdAt: new Date().toISOString(),
        detection: newDet,
      };
      this.alerts.unshift(newAlert);
      return { success: true, detection: newDet, alert: newAlert };
    }

    if (endpoint.startsWith('/simulation')) {
      return { success: true, simulation: { isRunning: true, intervalSeconds: 30 } };
    }

    return { success: true };
  }
}

export const mockBackend = new MockStore();
