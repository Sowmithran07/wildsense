/**
 * Dynamic Threat Level Calculation Engine
 * Evaluates risk based on Animal Species, Distance to Human Settlement, Time of Day, and Movement Speed
 */

const SPECIES_BASE_THREAT = {
  Tiger: 'CRITICAL',
  Leopard: 'CRITICAL',
  Elephant: 'HIGH',
  'Sloth Bear': 'HIGH',
  Gaur: 'HIGH',
  'Wild Boar': 'MEDIUM',
  Hyena: 'MEDIUM',
  'Spotted Deer': 'LOW',
  Monkey: 'LOW',
  Unknown: 'MEDIUM',
};

export const calculateThreatLevel = ({
  animal,
  distanceToVillageKm = 2.0,
  confidence = 90,
  movementSpeedKmH = 5,
  hourOfDay = new Date().getHours(),
}) => {
  let baseThreat = SPECIES_BASE_THREAT[animal] || 'MEDIUM';

  // Distance modifiers
  if (distanceToVillageKm < 0.8) {
    if (baseThreat === 'HIGH') baseThreat = 'CRITICAL';
    if (baseThreat === 'MEDIUM') baseThreat = 'HIGH';
  } else if (distanceToVillageKm > 3.5) {
    if (baseThreat === 'CRITICAL') baseThreat = 'HIGH';
    if (baseThreat === 'HIGH') baseThreat = 'MEDIUM';
    if (baseThreat === 'MEDIUM') baseThreat = 'LOW';
  }

  // Nighttime risk escalation (between 7 PM and 6 AM)
  const isNight = hourOfDay >= 19 || hourOfDay <= 6;
  if (isNight && animal === 'Elephant' && distanceToVillageKm <= 1.5) {
    baseThreat = 'CRITICAL';
  }
  if (isNight && animal === 'Wild Boar' && distanceToVillageKm <= 0.8) {
    baseThreat = 'HIGH';
  }

  // Fast moving predator
  if (movementSpeedKmH > 20 && (animal === 'Tiger' || animal === 'Leopard')) {
    baseThreat = 'CRITICAL';
  }

  return baseThreat;
};

export const getRecommendedActions = (threatLevel, animal) => {
  switch (threatLevel) {
    case 'CRITICAL':
      return [
        `URGENT: ${animal} detected inside or near critical buffer zone!`,
        'Trigger solar perimeter strobe light and ultrasonic deterrence buzzer.',
        'Immediate evacuation of boundary agricultural fields and walking trails.',
        'Dispatch Rapid Action Forest Patrol Vehicle equipped with tranquilizer kit.',
        'Broadcast emergency sirens and push SMS to all village residents.',
      ];
    case 'HIGH':
      return [
        `High alert: ${animal} movement recorded heading towards human settlement.`,
        'Notify local forest guard squad and range officers.',
        'Keep residents indoors and shelter livestock in secure enclosures.',
        'Monitor live thermal stream for directional vector change.',
      ];
    case 'MEDIUM':
      return [
        `Moderate wildlife activity detected (${animal}).`,
        'Send standard advisory notifications to nearby farming community.',
        'Continue automated camera trap logging.',
      ];
    case 'LOW':
    default:
      return [
        `Harmless wildlife movement (${animal}) logged in natural habitat.`,
        'No emergency intervention required. Logged for ecological biodiversity metrics.',
      ];
  }
};
