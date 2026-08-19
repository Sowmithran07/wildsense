import AnimalDetection from '../models/AnimalDetection.js';
import Alert from '../models/Alert.js';
import Incident from '../models/Incident.js';
import Sensor from '../models/Sensor.js';
import AnimalSighting from '../models/AnimalSighting.js';

// @desc    Get top level dashboard metrics
// @route   GET /api/analytics/dashboard
// @access  Public / Private
export const getDashboardMetrics = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      activeAlertsCount,
      criticalAlertsCount,
      detectedTodayCount,
      totalSensorsCount,
      activeSensorsCount,
      warningSensorsCount,
      offlineSensorsCount,
      resolvedIncidentsCount,
      openIncidentsCount,
      pendingSightingsCount,
      recentAlerts,
      recentDetections,
    ] = await Promise.all([
      Alert.countDocuments({ status: { $in: ['new', 'in_progress'] } }),
      Alert.countDocuments({ threatLevel: 'CRITICAL', status: { $in: ['new', 'in_progress'] } }),
      AnimalDetection.countDocuments({ detectedAt: { $gte: today } }),
      Sensor.countDocuments(),
      Sensor.countDocuments({ status: 'active' }),
      Sensor.countDocuments({ status: 'warning' }),
      Sensor.countDocuments({ status: { $in: ['maintenance', 'inactive'] } }),
      Incident.countDocuments({ status: 'resolved' }),
      Incident.countDocuments({ status: { $in: ['open', 'investigating', 'contained'] } }),
      AnimalSighting.countDocuments({ status: 'pending' }),
      Alert.find().sort({ createdAt: -1 }).limit(6).populate('detection'),
      AnimalDetection.find().sort({ detectedAt: -1 }).limit(6),
    ]);

    // High risk locations calculation
    const topDangerZones = await AnimalDetection.aggregate([
      { $match: { threatLevel: { $in: ['HIGH', 'CRITICAL'] } } },
      { $group: { _id: '$locationName', count: { $sum: 1 }, lastAnimal: { $last: '$animal' } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      success: true,
      stats: {
        activeAlerts: activeAlertsCount,
        criticalAlerts: criticalAlertsCount,
        detectedToday: detectedTodayCount,
        activeSensors: activeSensorsCount,
        warningSensors: warningSensorsCount,
        offlineSensors: offlineSensorsCount,
        totalSensors: totalSensorsCount,
        resolvedIncidents: resolvedIncidentsCount,
        openIncidents: openIncidentsCount,
        pendingSightings: pendingSightingsCount,
        sensorHealthPercentage: totalSensorsCount > 0 ? +((activeSensorsCount / totalSensorsCount) * 100).toFixed(1) : 100,
      },
      topDangerZones,
      recentAlerts,
      recentDetections,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get deep trend analytics for charts
// @route   GET /api/analytics/trends
// @access  Public / Private
export const getTrendAnalytics = async (req, res, next) => {
  try {
    const { timeframe = '7days' } = req.query;

    const daysCount = timeframe === '30days' ? 30 : timeframe === 'today' ? 1 : 7;
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - daysCount);
    sinceDate.setHours(0, 0, 0, 0);

    // 1. Intrusions per day
    const dailyIntrusions = await AnimalDetection.aggregate([
      { $match: { detectedAt: { $gte: sinceDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$detectedAt' } },
          total: { $sum: 1 },
          critical: {
            $sum: { $cond: [{ $eq: ['$threatLevel', 'CRITICAL'] }, 1, 0] },
          },
          high: {
            $sum: { $cond: [{ $eq: ['$threatLevel', 'HIGH'] }, 1, 0] },
          },
          medium: {
            $sum: { $cond: [{ $eq: ['$threatLevel', 'MEDIUM'] }, 1, 0] },
          },
          low: {
            $sum: { $cond: [{ $eq: ['$threatLevel', 'LOW'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 2. Most detected animals
    const animalDistribution = await AnimalDetection.aggregate([
      { $group: { _id: '$animal', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // 3. Threat level breakdown
    const threatDistribution = await AnimalDetection.aggregate([
      { $group: { _id: '$threatLevel', count: { $sum: 1 } } },
    ]);

    // 4. Intrusions by location
    const locationDistribution = await AnimalDetection.aggregate([
      { $group: { _id: '$locationName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    // 5. Hourly activity heatmap
    const hourlyActivity = await AnimalDetection.aggregate([
      {
        $project: {
          hour: { $hour: '$detectedAt' },
          threatLevel: 1,
        },
      },
      {
        $group: {
          _id: '$hour',
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      dailyIntrusions,
      animalDistribution: animalDistribution.map((item) => ({ animal: item._id, count: item.count })),
      threatDistribution: threatDistribution.map((item) => ({ threat: item._id, count: item.count })),
      locationDistribution: locationDistribution.map((item) => ({ location: item._id, count: item.count })),
      hourlyActivity: hourlyActivity.map((item) => ({ hour: `${item._id}:00`, count: item.count })),
    });
  } catch (error) {
    next(error);
  }
};
