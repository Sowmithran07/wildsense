export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const ANIMALS = [
  'Elephant',
  'Tiger',
  'Leopard',
  'Wild Boar',
  'Sloth Bear',
  'Spotted Deer',
  'Monkey',
  'Gaur',
  'Hyena',
];

export const THREAT_COLORS = {
  CRITICAL: {
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    border: 'border-red-500/30',
    dot: 'bg-red-500',
    hex: '#ef4444',
    badge: 'badge-critical',
  },
  HIGH: {
    bg: 'bg-orange-500/15',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
    dot: 'bg-orange-500',
    hex: '#f97316',
    badge: 'badge-high',
  },
  MEDIUM: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    dot: 'bg-amber-500',
    hex: '#f59e0b',
    badge: 'badge-medium',
  },
  LOW: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-500',
    hex: '#10b981',
    badge: 'badge-low',
  },
};

export const SENSOR_TYPES = [
  'PIR Motion Sensor',
  'Acoustic Sensor',
  'Thermal Camera',
  'Optical Camera',
  'Seismic Sensor',
  'GPS Module',
];

export const DEFAULT_MAP_CENTER = [11.6664, 76.6295]; // Bandipur / Mudumalai wildlife sanctuary region
export const DEFAULT_ZOOM = 13;

export const FOREST_BOUNDARY_COORDS = [
  [11.7100, 76.5900],
  [11.7150, 76.6600],
  [11.7000, 76.7100],
  [11.6400, 76.7150],
  [11.6150, 76.6700],
  [11.6100, 76.6100],
  [11.6450, 76.5800],
  [11.7100, 76.5900],
];

export const VILLAGE_ZONES = [
  { name: 'Mangala Village', coords: [11.6548, 76.6178], radiusMeters: 1400, population: '2,800' },
  { name: 'Gundlupet Fringe', coords: [11.6885, 76.6792], radiusMeters: 1600, population: '4,500' },
  { name: 'Hangala Settlement', coords: [11.6812, 76.6385], radiusMeters: 1200, population: '1,900' },
  { name: 'Bandipur Gate Hamlet', coords: [11.6625, 76.6315], radiusMeters: 800, population: '650' },
];
