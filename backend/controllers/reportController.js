import Incident from '../models/Incident.js';
import AnimalDetection from '../models/AnimalDetection.js';
import Sensor from '../models/Sensor.js';
import Alert from '../models/Alert.js';

// @desc    Generate printable / JSON report
// @route   GET /api/reports/summary
// @access  Public / Private
export const getReportSummary = async (req, res, next) => {
  try {
    const { type = 'weekly', startDate, endDate } = req.query;

    let dateFilter = {};
    const now = new Date();
    if (startDate && endDate) {
      dateFilter = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (type === 'daily') {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      dateFilter = { $gte: startOfDay };
    } else if (type === 'weekly') {
      const pastWeek = new Date();
      pastWeek.setDate(now.getDate() - 7);
      dateFilter = { $gte: pastWeek };
    } else if (type === 'monthly') {
      const pastMonth = new Date();
      pastMonth.setDate(now.getDate() - 30);
      dateFilter = { $gte: pastMonth };
    }

    const [detections, alerts, incidents, sensors] = await Promise.all([
      AnimalDetection.find({ detectedAt: dateFilter }).sort({ detectedAt: -1 }),
      Alert.find({ createdAt: dateFilter }).sort({ createdAt: -1 }),
      Incident.find({ createdAt: dateFilter }).sort({ createdAt: -1 }).populate('assignedOfficer', 'name role'),
      Sensor.find(),
    ]);

    const criticalCount = detections.filter((d) => d.threatLevel === 'CRITICAL').length;
    const highCount = detections.filter((d) => d.threatLevel === 'HIGH').length;
    const resolvedIncidents = incidents.filter((i) => i.status === 'resolved').length;

    res.json({
      success: true,
      reportMetadata: {
        reportType: `${type.toUpperCase()} WILDLIFE INTRUSION & SAFETY REPORT`,
        generatedAt: new Date(),
        timeframe: { from: dateFilter.$gte || 'All Time', to: dateFilter.$lte || new Date() },
        preparedBy: req.user ? `${req.user.name} (${req.user.role})` : 'WildSense Forest Analytics System',
      },
      summary: {
        totalIntrusions: detections.length,
        criticalThreats: criticalCount,
        highThreats: highCount,
        totalIncidents: incidents.length,
        resolvedIncidents,
        resolutionRate: incidents.length > 0 ? `${((resolvedIncidents / incidents.length) * 100).toFixed(1)}%` : '100%',
        monitoredSensors: sensors.length,
        activeSensors: sensors.filter((s) => s.status === 'active').length,
      },
      incidents,
      detections: detections.slice(0, 20),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export CSV of incidents or detections or sensors
// @route   GET /api/reports/download-csv
// @access  Public / Private
export const exportCSV = async (req, res, next) => {
  try {
    const { dataset = 'incidents' } = req.query;

    if (dataset === 'sensors') {
      const sensors = await Sensor.find();
      let csv = 'Sensor ID,Name,Type,Location,Latitude,Longitude,Battery (%),Signal (%),Status,Connectivity,Last Active\n';
      sensors.forEach((s) => {
        csv += `"${s.sensorId}","${s.name}","${s.type}","${s.locationName}",${s.latitude},${s.longitude},${s.batteryLevel},${s.signalStrength},"${s.status}","${s.connectivity}","${s.lastActive?.toISOString()}"\n`;
      });

      res.header('Content-Type', 'text/csv');
      res.attachment(`wildsense-sensors-${Date.now()}.csv`);
      return res.send(csv);
    }

    if (dataset === 'detections') {
      const detections = await AnimalDetection.find().sort({ detectedAt: -1 });
      let csv = 'Detection ID,Animal,Confidence (%),Threat Level,Sensor ID,Location,Latitude,Longitude,Distance (km),Detected At\n';
      detections.forEach((d) => {
        csv += `"${d.detectionId}","${d.animal}",${d.confidence},"${d.threatLevel}","${d.sensorId}","${d.locationName}",${d.latitude},${d.longitude},${d.distanceToVillageKm},"${d.detectedAt.toISOString()}"\n`;
      });

      res.header('Content-Type', 'text/csv');
      res.attachment(`wildsense-detections-${Date.now()}.csv`);
      return res.send(csv);
    }

    // Default: incidents
    const incidents = await Incident.find().populate('assignedOfficer', 'name').sort({ createdAt: -1 });
    let csv = 'Incident ID,Animal,Threat Level,Location,Latitude,Longitude,Status,Assigned Officer,Resolution,Created At\n';
    incidents.forEach((i) => {
      const resSummary = (i.resolutionSummary || '').replace(/"/g, '""');
      const officerName = i.assignedOfficer?.name || 'Unassigned';
      const createdDate = i.createdAt ? new Date(i.createdAt).toISOString() : new Date().toISOString();
      csv += `"${i.incidentId}","${i.animal}","${i.threatLevel}","${i.location}",${i.latitude},${i.longitude},"${i.status}","${officerName}","${resSummary}","${createdDate}"\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment(`wildsense-incidents-${Date.now()}.csv`);
    return res.send(csv);
  } catch (error) {
    next(error);
  }
};
