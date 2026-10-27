export interface PlanetData {
  id: string;
  name: string;
  type: 'Star' | 'Terrestrial' | 'Gas Giant' | 'Ice Giant' | 'Dwarf Planet' | 'Satellite';
  color: string;
  radiusKm: number;
  radiusRender: number;
  orbitalRadiusAU: number;
  orbitalDistanceRender: number;
  orbitalPeriodDays: number;
  rotationPeriodHours: number;
  surfaceGravityMs2: number;
  massKg: string;
  meanTempC: number;
  moonsCount: number;
  notableMoons: string[];
  atmosphericGases: { gas: string; percentage: number }[];
  description: string;
  funFacts: string[];
  keyMissions: string[];
  hasRings?: boolean;
}

export interface ISSTelemetry {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  visibility: string;
  timestamp: number;
  status: string;
}

export interface SpaceMission {
  id: string;
  name: string;
  agency: string;
  launchYear: number;
  target: string;
  status: 'Active' | 'Completed' | 'En Route' | 'Planned';
  description: string;
  achievements: string[];
  vehicle: string;
  badgeColor: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: 'Solar System' | 'Orbital Mechanics' | 'Space Missions' | 'Astrophysics';
  difficulty: 'Cadet' | 'Specialist' | 'Commander';
}

export interface CadetProfile {
  name: string;
  xp: number;
  rank: string;
  quizzesCompleted: number;
  nebulaHighScore: number;
  gravitonHighScore: number;
  badges: string[];
}
