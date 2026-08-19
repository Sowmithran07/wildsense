import User from '../models/User.js';
import Sensor from '../models/Sensor.js';
import AnimalDetection from '../models/AnimalDetection.js';
import Alert from '../models/Alert.js';
import Incident from '../models/Incident.js';
import AnimalSighting from '../models/AnimalSighting.js';
import Notification from '../models/Notification.js';
import { SEED_USERS, SEED_SENSORS } from './seedData.js';
import { getAnimalImage } from '../services/animalRecognitionService.js';
import { calculateThreatLevel } from '../services/threatCalculator.js';

const ANIMALS_POOL = [
  { name: 'Elephant', count: 5 },
  { name: 'Tiger', count: 3 },
  { name: 'Leopard', count: 3 },
  { name: 'Wild Boar', count: 4 },
  { name: 'Sloth Bear', count: 2 },
  { name: 'Spotted Deer', count: 2 },
  { name: 'Gaur', count: 1 },
];

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already contains records. Skipping seed.');
      return;
    }

    console.log('Seeding initial WILD SENSE database...');

    // 1. Seed Users
    const users = [];
    for (const u of SEED_USERS) {
      const createdUser = await User.create(u);
      users.push(createdUser);
    }

    // Additional residents to make 20 residents total
    const extraResidents = [
      { name: 'Anitha Swamy', village: 'Hangala West' },
      { name: 'Basavaraj Patil', village: 'Mangala Farm Sector' },
      { name: 'Chandrashekar M', village: 'Gundlupet Buffer' },
      { name: 'Devendra Gowda', village: 'Bandipur Gate' },
      { name: 'Eshwarappa K', village: 'Hangala West' },
      { name: 'Farooq Ahmed', village: 'Mangala Outskirts' },
      { name: 'Gopalakrishna V', village: 'Gundlupet Fringe' },
      { name: 'Hemavathi S', village: 'Bandipur Gate' },
      { name: 'Indira Prasad', village: 'Hangala West' },
      { name: 'Jagadish Murthy', village: 'Mangala Farm Sector' },
      { name: 'Kumaraswamy B', village: 'Gundlupet Buffer' },
      { name: 'Lakshmamma N', village: 'Bandipur Gate' },
      { name: 'Malleshappa C', village: 'Hangala West' },
      { name: 'Naveen Kumar', village: 'Mangala Outskirts' },
      { name: 'Omkarappa R', village: 'Gundlupet Fringe' },
      { name: 'Parvathamma G', village: 'Bandipur Gate' },
    ];

    for (let i = 0; i < extraResidents.length; i++) {
      const res = extraResidents[i];
      const createdRes = await User.create({
        name: res.name,
        email: `resident${i + 5}@wildsense.org`,
        phone: `+91 94482 ${10000 + i * 37}`,
        password: 'password123',
        role: 'resident',
        location: {
          name: res.village,
          latitude: 11.65 + Math.random() * 0.04,
          longitude: 76.61 + Math.random() * 0.07,
        },
        assignedZone: res.village,
      });
      users.push(createdRes);
    }
    console.log(`Created ${users.length} Users (Admin, Officers, Residents)`);

    // 2. Seed Sensors
    const sensors = [];
    for (const s of SEED_SENSORS) {
      const createdSensor = await Sensor.create(s);
      sensors.push(createdSensor);
    }
    console.log(`Created ${sensors.length} Sensors`);

    // 3. Seed 20 Animal Detections
    const detections = [];
    let detCounter = 1;
    const officers = users.filter((u) => u.role === 'officer' || u.role === 'admin');

    const detectionTemplates = [
      { animal: 'Elephant', hoursAgo: 2, distance: 0.7, sound: 82, note: 'Herd of 3 adults moving toward sugarcane fields' },
      { animal: 'Tiger', hoursAgo: 5, distance: 1.2, sound: 75, note: 'Adult male tiger scent marking boundary stone' },
      { animal: 'Leopard', hoursAgo: 9, distance: 0.5, sound: 68, note: 'Spotted on rocky outcrop near Mangala village' },
      { animal: 'Wild Boar', hoursAgo: 14, distance: 0.4, sound: 70, note: 'Sounder of 8 foraging near field fence' },
      { animal: 'Elephant', hoursAgo: 19, distance: 1.8, sound: 88, note: 'Lone tusker breaking dry bamboo' },
      { animal: 'Sloth Bear', hoursAgo: 24, distance: 1.1, sound: 64, note: 'Termite mound foraging detected' },
      { animal: 'Spotted Deer', hoursAgo: 28, distance: 2.5, sound: 50, note: 'Herd of 12 grazing in safe buffer grassland' },
      { animal: 'Gaur', hoursAgo: 33, distance: 1.6, sound: 72, note: 'Large bull gaur grazing near stream' },
      { animal: 'Tiger', hoursAgo: 39, distance: 2.1, sound: 78, note: 'Stalking chital deer inside core reserve' },
      { animal: 'Elephant', hoursAgo: 45, distance: 0.9, sound: 85, note: 'Crossing highway boundary culvert' },
      { animal: 'Leopard', hoursAgo: 52, distance: 0.6, sound: 65, note: 'Climbing perimeter tree branch' },
      { animal: 'Wild Boar', hoursAgo: 60, distance: 0.3, sound: 73, note: 'Crop raiding attempt near Hangala' },
      { animal: 'Monkey', hoursAgo: 68, distance: 1.9, sound: 60, note: 'Troop movement on canopy line' },
      { animal: 'Elephant', hoursAgo: 74, distance: 1.3, sound: 81, note: 'Family herd drinking at Moyar waterhole' },
      { animal: 'Sloth Bear', hoursAgo: 82, distance: 1.5, sound: 62, note: 'Moving along rocky ridge' },
      { animal: 'Tiger', hoursAgo: 91, distance: 0.8, sound: 84, note: 'Prowling near cattle grazing zone' },
      { animal: 'Leopard', hoursAgo: 104, distance: 1.4, sound: 66, note: 'Resting on hillock' },
      { animal: 'Wild Boar', hoursAgo: 118, distance: 0.5, sound: 71, note: 'Rooting in boundary soil' },
      { animal: 'Spotted Deer', hoursAgo: 130, distance: 2.8, sound: 48, note: 'Drinking at stream bank' },
      { animal: 'Elephant', hoursAgo: 145, distance: 0.6, sound: 89, note: 'Approaching solar fencing boundary' },
    ];

    for (const dt of detectionTemplates) {
      const sensor = sensors[detCounter % sensors.length];
      const detectedDate = new Date(Date.now() - dt.hoursAgo * 60 * 60 * 1000);
      const threatLevel = calculateThreatLevel({
        animal: dt.animal,
        distanceToVillageKm: dt.distance,
        confidence: +(90 + Math.random() * 8.5).toFixed(1),
        hourOfDay: detectedDate.getHours(),
      });

      const detection = await AnimalDetection.create({
        detectionId: `DET-2026-${String(100 + detCounter).padStart(4, '0')}`,
        animal: dt.animal,
        confidence: +(91 + Math.random() * 8).toFixed(1),
        image: getAnimalImage(dt.animal),
        sensor: sensor._id,
        sensorId: sensor.sensorId,
        locationName: sensor.locationName,
        latitude: sensor.latitude + (Math.random() - 0.5) * 0.005,
        longitude: sensor.longitude + (Math.random() - 0.5) * 0.005,
        threatLevel,
        movementSpeedKmH: +(4 + Math.random() * 14).toFixed(1),
        distanceToVillageKm: dt.distance,
        rawSensorData: {
          motionDetected: true,
          soundDecibels: dt.sound,
          thermalDiffCelsius: 8.2,
          vibrationFreqHz: 14.5,
        },
        detectedAt: detectedDate,
      });

      detections.push(detection);
      detCounter++;
    }
    console.log(`Created ${detections.length} Animal Detections`);

    // 4. Seed 15 Alerts
    const alerts = [];
    for (let i = 0; i < 15; i++) {
      const detection = detections[i];
      const assignedOfficer = officers[i % officers.length];
      const statusList = ['new', 'acknowledged', 'in_progress', 'resolved', 'resolved', 'resolved'];
      const status = i < 3 ? 'new' : i < 6 ? 'in_progress' : statusList[i % statusList.length];

      const alert = await Alert.create({
        alertId: `ALT-2026-${String(100 + i + 1).padStart(4, '0')}`,
        detection: detection._id,
        animal: detection.animal,
        threatLevel: detection.threatLevel,
        location: detection.locationName,
        latitude: detection.latitude,
        longitude: detection.longitude,
        distanceToVillageKm: detection.distanceToVillageKm,
        status,
        assignedOfficer: status !== 'new' ? assignedOfficer._id : null,
        acknowledgedBy: status !== 'new' ? assignedOfficer._id : null,
        acknowledgedAt: status !== 'new' ? new Date(detection.detectedAt.getTime() + 5 * 60 * 1000) : null,
        resolvedBy: status === 'resolved' ? assignedOfficer._id : null,
        resolvedAt: status === 'resolved' ? new Date(detection.detectedAt.getTime() + 45 * 60 * 1000) : null,
        broadcastRadiusKm: detection.threatLevel === 'CRITICAL' ? 5.0 : 3.0,
        buzzerTriggered: detection.threatLevel === 'HIGH' || detection.threatLevel === 'CRITICAL',
        notificationsSent: {
          smsCount: detection.threatLevel === 'CRITICAL' ? 24 : 6,
          emailCount: 5,
          pushCount: 25,
          inAppCount: 25,
        },
        actionNotes: status === 'resolved' ? 'Patrol team chased wildlife back toward reserve.' : '',
        createdAt: detection.detectedAt,
      });
      alerts.push(alert);
    }
    console.log(`Created ${alerts.length} Alerts`);

    // 5. Seed 10 Incidents
    const incidents = [];
    for (let i = 0; i < 10; i++) {
      const alert = alerts[i];
      const detection = detections[i];
      const assignedOfficer = officers[i % officers.length];
      const status = alert.status === 'new' ? 'open' : alert.status === 'in_progress' ? 'investigating' : 'resolved';

      const incident = await Incident.create({
        incidentId: `INC-2026-${String(100 + i + 1).padStart(4, '0')}`,
        detection: detection._id,
        alert: alert._id,
        animal: detection.animal,
        threatLevel: detection.threatLevel,
        location: detection.locationName,
        latitude: detection.latitude,
        longitude: detection.longitude,
        status,
        assignedOfficer: assignedOfficer._id,
        responseNotes: [
          {
            note: `Initial alert received from ${detection.sensorId}. Threat level estimated at ${detection.threatLevel}.`,
            officer: assignedOfficer._id,
            officerName: assignedOfficer.name,
            timestamp: new Date(detection.detectedAt.getTime() + 3 * 60 * 1000),
          },
          {
            note: status === 'resolved' ? 'Vehicle siren deployed. Elephant herd safely turned around toward deep jungle.' : 'Ground team en route with floodlights and search gear.',
            officer: assignedOfficer._id,
            officerName: assignedOfficer.name,
            timestamp: new Date(detection.detectedAt.getTime() + 15 * 60 * 1000),
          },
        ],
        actionTimeline: [
          {
            title: 'Automated Intrusion Detection',
            description: `${detection.animal} identified with ${detection.confidence}% confidence.`,
            user: 'WildSense AI Node',
            timestamp: detection.detectedAt,
          },
          {
            title: 'Emergency Alert Broadcasted',
            description: `Sent to ${alert.notificationsSent.smsCount} residents and forest squad.`,
            user: 'Dispatcher Engine',
            timestamp: new Date(detection.detectedAt.getTime() + 1 * 60 * 1000),
          },
          {
            title: 'Response Team Dispatched',
            description: `${assignedOfficer.name} assigned to lead containment.`,
            user: 'Command Center',
            timestamp: new Date(detection.detectedAt.getTime() + 4 * 60 * 1000),
          },
        ],
        resolutionSummary: status === 'resolved' ? 'Intrusion successfully mitigated with non-invasive acoustic repellers. Zero human or wildlife casualties.' : '',
        resolvedAt: status === 'resolved' ? new Date(detection.detectedAt.getTime() + 50 * 60 * 1000) : null,
        createdAt: detection.detectedAt,
      });
      incidents.push(incident);
    }
    console.log(`Created ${incidents.length} Incidents`);

    // 6. Seed Community Sightings
    const residentUsers = users.filter((u) => u.role === 'resident');
    const sightingTemplates = [
      { animal: 'Elephant', location: 'Mangala Primary School Path', desc: 'Elephant mother and calf seen crossing dirt road at dawn.', threat: 'HIGH', status: 'verified' },
      { animal: 'Tiger', location: 'Hangala Stream Crossing', desc: 'Fresh pugmarks and growl heard near pump house.', threat: 'CRITICAL', status: 'verified' },
      { animal: 'Leopard', location: 'West Cattle Shed Enclosure', desc: 'Leopard crouching behind hay stack.', threat: 'HIGH', status: 'pending' },
      { animal: 'Wild Boar', location: 'Gundlupet Maize Field', desc: 'Small sounder eating crops along boundary ditch.', threat: 'MEDIUM', status: 'pending' },
      { animal: 'Sloth Bear', location: 'Rocky Ridge Temple Track', desc: 'Bear seen near beehive in teak tree.', threat: 'HIGH', status: 'verified' },
    ];

    for (let i = 0; i < sightingTemplates.length; i++) {
      const st = sightingTemplates[i];
      const resident = residentUsers[i % residentUsers.length];
      await AnimalSighting.create({
        sightingId: `SGT-2026-${String(100 + i + 1).padStart(4, '0')}`,
        reportedBy: resident._id,
        reporterName: resident.name,
        reporterPhone: resident.phone,
        animal: st.animal,
        description: st.desc,
        image: getAnimalImage(st.animal),
        locationName: st.location,
        latitude: resident.location.latitude + (Math.random() - 0.5) * 0.006,
        longitude: resident.location.longitude + (Math.random() - 0.5) * 0.006,
        threatEstimate: st.threat,
        status: st.status,
        verifiedBy: st.status === 'verified' ? officers[0]._id : null,
        verificationNotes: st.status === 'verified' ? 'Confirmed by Range Officer patrolling team.' : '',
      });
    }
    console.log(`Created 5 Community Sightings`);

    // 7. Seed In-App Notifications
    for (const adminUser of officers) {
      await Notification.create({
        user: adminUser._id,
        title: '🚨 CRITICAL: Tiger Detected Near Buffer Zone 1',
        message: 'Acoustic and thermal triangulation confirmed tiger movement 0.8 km from human settlement.',
        type: 'intrusion_alert',
        threatLevel: 'CRITICAL',
        link: '/alerts',
        isRead: false,
      });
      await Notification.create({
        user: adminUser._id,
        title: '🔋 Sensor Maintenance Alert: SEN-CAM-110',
        message: 'Optical Night Vision Cam 6 reported offline. Scheduled technician check required.',
        type: 'sensor_warning',
        threatLevel: 'MEDIUM',
        link: '/sensors',
        isRead: false,
      });
    }

    console.log('✅ Database Seeding Completed Successfully!');
  } catch (error) {
    console.error('Error during database seed:', error);
  }
};
