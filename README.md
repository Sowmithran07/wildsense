# WILD SENSE – Wireless Animal Intrusion Detection and Notification System

**WILD SENSE** is a modern, production-grade IoT & AI-powered wildlife intrusion detection, alert management, and real-time community notification platform designed for forest fringe communities, wildlife sanctuaries, and forest departments.

---

## 🌲 System Architecture Overview

```
                        +---------------------------------------------+
                        |  IoT Sensor Nodes & Camera Traps           |
                        |  (PIR, Thermal, Acoustic, LoRaWAN, ESP32)   |
                        +---------------------------------------------+
                                               |
                                    [POST /api/iot/sensor-data]
                                               v
                        +---------------------------------------------+
                        |  Node.js / Express.js Backend Core Engine   |
                        |  - AI Computer Vision Classification        |
                        |  - Dynamic Threat Assessment Matrix         |
                        |  - WebSocket Dispatch & Notification Hub    |
                        +---------------------------------------------+
                                  /            |             \
                                 /             |              \
                                v              v               v
            +-----------------------+  +-----------------+  +-----------------------+
            | Admin Control Center  |  | Ranger Portal   |  | Resident Community    |
            | (Fleet & Intelligence)|  | (Dossier & SOS) |  | (Safety Hub & Sights) |
            +-----------------------+  +-----------------+  +-----------------------+
```

---

## 🚀 Key Features

* **Real-Time IoT Telemetry & Sensor Matrix**: Distributed monitoring of PIR Motion Sensors, Acoustic Triangulation nodes, Thermal Cameras, Seismic footstep arrays, and GPS LoRa gateways with live battery, temperature, signal strength, and solar charging telemetry.
* **AI Animal Recognition Engine**: Pre-configured for YOLOv8 and deep vision models with confidence scoring across key species: **Elephant, Tiger, Leopard, Wild Boar, Sloth Bear, Spotted Deer, Gaur, Monkey**.
* **Dynamic Threat Level Evaluation**: Calibrated multi-factor risk assessment (CRITICAL, HIGH, MEDIUM, LOW) based on species hazard, distance to village buffer, time of day, and directional velocity.
* **Interactive GIS Threat Map**: Powered by Leaflet with forest reserve boundary polygon, village safe buffers, sensor pins, and threat color-coded markers with interactive popup telemetry.
* **Live Emergency Siren & Radar Modal**: Immediate visual and Web Audio synthesized siren alarm for HIGH and CRITICAL intrusions with one-click acknowledgment and map navigation.
* **Incident Management Dossiers**: Comprehensive incident lifecycle tracking (`open`, `investigating`, `contained`, `resolved`) with chronological action timelines and ranger field response notes.
* **Resident Community Hub**: Dynamic safety status banner (🟢 SAFE vs 🔴 HIGH ALERT), emergency safety instructions, and community sighting reporting with image uploads.
* **Autonomous Real-Time Simulator**: Built-in background simulator pushing live intrusion events every 20–40s via Socket.io with manual test injection for Elephants and Tigers.
* **Analytics & Automated Reports**: Recharts area, bar, and donut charts with 1-click printable reports and CSV data export.

---

## 💻 Tech Stack

### Frontend
* **React 18** + **Vite**
* **Tailwind CSS** (Custom Dark Forest & Glassmorphism Design System)
* **Lucide React** (Vector Icons)
* **Recharts** (Wildlife frequency, threat distribution, and nocturnal activity charts)
* **Leaflet** & **React-Leaflet** (Interactive GIS Mapping)
* **Socket.io Client** (Real-Time WebSocket Ingestion)
* **Web Audio API** (Synthesized Siren Alarms)

### Backend
* **Node.js** & **Express.js**
* **MongoDB** & **Mongoose** (with built-in zero-latency in-memory data engine fallback for instant plug-and-play)
* **Socket.io** (Real-time broadcasting hub)
* **JWT (JSON Web Tokens)** + **bcryptjs** (Secure authentication and role-based authorization)
* **CORS** & **Dotenv**

---

## 👥 User Roles & Demo Credentials

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Admin / Authority** | `admin@wildsense.org` | `password123` | Full control: sensors, alerts, user directory, analytics, reports |
| **Forest Officer / Ranger** | `officer@wildsense.org` | `password123` | Incident dossiers, alert management, field notes, sighting verification |
| **Resident / Farmer** | `resident@wildsense.org` | `password123` | Safety status hub, nearby alerts, safety guide, report sightings |

> ⚡ **Tip**: The login page includes **1-Click Demo Login** buttons for instant testing.

---

## 🛠️ Installation & Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* npm (v9 or higher)

### 1. Clone the Repository
```bash
cd "mithran project"
```

### 2. Backend Setup
```bash
cd backend
npm install
node server.js
```
The backend server will start on `http://localhost:5000` and automatically populate the database with seed data.

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
* `POST /api/auth/register` - Register new resident or forest officer
* `POST /api/auth/login` - Authenticate and receive JWT token
* `POST /api/auth/forgot-password` - Generate password reset token
* `POST /api/auth/reset-password` - Update password with reset token
* `GET /api/auth/me` - Fetch current user profile
* `GET /api/auth/officers` - List forest officers
* `GET /api/auth/users` - Admin user directory

### Sensors (`/api/sensors`)
* `GET /api/sensors` - List all sensors (supports `?status=&type=`)
* `POST /api/sensors` - Deploy new sensor node
* `GET /api/sensors/:id` - Fetch sensor telemetry
* `PUT /api/sensors/:id` - Update sensor configuration
* `DELETE /api/sensors/:id` - Decommission sensor

### Detections & AI (`/api/detections`)
* `GET /api/detections` - List animal detections with species and threat filters
* `POST /api/detections` - Ingest camera trap frame, run AI classification, and calculate threat score
* `GET /api/detections/:id` - Get detection details

### Alerts (`/api/alerts`)
* `GET /api/alerts` - List active and historical alerts
* `PUT /api/alerts/:id/status` - Update alert status (`acknowledged`, `in_progress`, `resolved`)
* `PUT /api/alerts/:id/assign` - Assign ranger to alert

### Incidents (`/api/incidents`)
* `GET /api/incidents` - List incidents with search and pagination
* `GET /api/incidents/:id` - Get full incident dossier
* `PUT /api/incidents/:id` - Update incident resolution status
* `POST /api/incidents/:id/notes` - Append ranger field response note

### Community Sightings (`/api/sightings`)
* `GET /api/sightings` - List community reports
* `POST /api/sightings` - Resident reports wildlife sighting
* `PUT /api/sightings/:id/status` - Officer verifies or dismisses sighting

### Analytics & Reports (`/api/analytics`, `/api/reports`)
* `GET /api/analytics/dashboard` - High-level metrics and risk zones
* `GET /api/analytics/trends` - Daily intrusion frequencies, hourly nocturnal distribution
* `GET /api/reports/summary` - Formatted audit report summary
* `GET /api/reports/download-csv` - Export structured CSV for incidents, detections, or sensors

### Hardware IoT Ingestion (`/api/iot`)
* `POST /api/iot/sensor-data` - Physical edge device telemetry ingestion:
  ```json
  {
    "sensorId": "SEN-PIR-102",
    "motionDetected": true,
    "soundLevel": 85,
    "temperature": 27.5,
    "batteryLevel": 94,
    "signalStrength": 90,
    "latitude": 11.6591,
    "longitude": 76.6152
  }
  ```

### Real-Time Simulation (`/api/simulation`)
* `POST /api/simulation/toggle` - Toggle background simulator on/off
* `POST /api/simulation/trigger-manual` - Inject test animal intrusion (`Elephant`, `Tiger`, etc.)
* `GET /api/simulation/status` - Get simulation state

---

## 📂 Project Structure

```
mithran project/
├── backend/
│   ├── config/
│   │   ├── db.js                 # Database connector with in-memory fallback
│   │   ├── inMemoryStore.js      # Zero-latency in-memory query engine
│   │   └── modelFactory.js       # Transparent model proxy
│   ├── controllers/
│   │   ├── alertController.js
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   ├── detectionController.js
│   │   ├── incidentController.js
│   │   ├── iotController.js
│   │   ├── notificationController.js
│   │   ├── reportController.js
│   │   ├── sensorController.js
│   │   ├── sightingController.js
│   │   └── simulationController.js
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & role authorization
│   │   └── error.js              # Global error handling
│   ├── models/
│   │   ├── Alert.js
│   │   ├── AnimalDetection.js
│   │   ├── AnimalSighting.js
│   │   ├── Incident.js
│   │   ├── Notification.js
│   │   ├── Sensor.js
│   │   └── User.js
│   ├── routes/
│   │   ├── alertRoutes.js
│   │   ├── analyticsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── detectionRoutes.js
│   │   ├── incidentRoutes.js
│   │   ├── iotRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── sensorRoutes.js
│   │   ├── sightingRoutes.js
│   │   └── simulationRoutes.js
│   ├── services/
│   │   ├── animalRecognitionService.js
│   │   ├── iotService.js
│   │   ├── notificationService.js
│   │   ├── simulationService.js
│   │   ├── socketService.js
│   │   └── threatCalculator.js
│   ├── utils/
│   │   ├── seedData.js
│   │   └── seedDatabase.js
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── alerts/
│   │   │   │   └── LiveEmergencyModal.jsx
│   │   │   ├── common/
│   │   │   │   ├── ConfirmDialog.jsx
│   │   │   │   ├── DataTable.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── StatusBadge.jsx
│   │   │   │   └── ThreatBadge.jsx
│   │   │   └── map/
│   │   │       └── WildlifeMap.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── SimulationContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── layouts/
│   │   │   ├── AuthLayout.jsx
│   │   │   └── MainLayout.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboardPage.jsx
│   │   │   ├── AlertsPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── AnimalDetectionPage.jsx
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── IncidentDetailsPage.jsx
│   │   │   ├── IncidentsPage.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LiveMonitoringPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MapPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ReportSightingPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   ├── ResetPasswordPage.jsx
│   │   │   ├── ResidentDashboardPage.jsx
│   │   │   ├── SensorManagementPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   ├── SightingsPage.jsx
│   │   │   └── UserManagementPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   ├── audioAlert.js
│   │   │   └── constants.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

---

## 🛡️ License & Acknowledgements

Created for Wildlife Conservation, Forest Department Rapid Response, and Human-Wildlife Conflict Mitigation.
