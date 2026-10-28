export type TeamSize = 2 | 3 | 4 | 5;

export type TrackDistance = 'Sprint' | 'Mile' | 'Medium' | 'Long';
export type TrackSurface = 'Turf' | 'Dirt';
export type RunningStyle = 'Runner' | 'Leader' | 'Betweener' | 'Chaser';
export type AptitudeGrade = 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface Track {
  id: string;
  name: string;
  nameJp: string;
  course: string;
  prefecture: string;
  surface: TrackSurface;
  distance: TrackDistance;
  lengthMeters: number;
  direction: 'Clockwise' | 'Counter-clockwise' | 'Straight';
  conditionDefault?: string;
  description?: string;
}

export interface Umamusume {
  id: string;
  name: string;
  nameJp: string;
  epithet?: string;
  surfaceAptitude: {
    turf: AptitudeGrade;
    dirt: AptitudeGrade;
  };
  distanceAptitude: {
    sprint: AptitudeGrade;
    mile: AptitudeGrade;
    medium: AptitudeGrade;
    long: AptitudeGrade;
  };
  strategyAptitude: {
    runner: AptitudeGrade;
    leader: AptitudeGrade;
    betweener: AptitudeGrade;
    chaser: AptitudeGrade;
  };
  primaryColor: string;
  rarity: 1 | 2 | 3;
  imageUrl?: string;
  charId?: number;
}

export type MatchPhase =
  | 'LOBBY'
  | 'TIEBREAKER_ROLL'
  | 'TRACK_COIN_FLIP'
  | 'TRACK_DRAFT'
  | 'TRACK_VETO'
  | 'UMA_PRE_BAN'
  | 'UMA_DRAFT'
  | 'UMA_VETO'
  | 'UMA_RESERVE'
  | 'ASSIGN_ROSTER'
  | 'TRAINING_TIMER'
  | 'RACE_MATCH'
  | 'MATCH_VICTORY';

export interface PlayerSlot {
  id: string;
  name: string;
  team: 1 | 2;
  assignedUmaId?: string;
  trainingStatus: 'training' | 'ready' | 'forfeited';
}

export interface MatchConfig {
  team1Name: string;
  team2Name: string;
  team1Color: string;
  team2Color: string;
  teamSize: TeamSize;
  targetPoints: number;
  playersTeam1: string[];
  playersTeam2: string[];
}

export interface RacePodium {
  first: { team: 1 | 2; player: string; umaId: string };
  second: { team: 1 | 2; player: string; umaId: string };
  third: { team: 1 | 2; player: string; umaId: string };
}

export interface RaceRoundResult {
  roundNumber: number;
  track: Track;
  isTiebreaker: boolean;
  roomCode: string;
  podium?: RacePodium;
  team1PointsEarned: number;
  team2PointsEarned: number;
  runningTotalTeam1: number;
  runningTotalTeam2: number;
  completed: boolean;
}

export interface FullMatchState {
  config: MatchConfig;
  phase: MatchPhase;
  tiebreakerTrack: Track | null;
  trackPriorityTeam: 1 | 2;
  trackPicksTeam1: Track[];
  trackPicksTeam2: Track[];
  trackVetoTeam1: Track | null;
  trackVetoTeam2: Track | null;
  finalTracks: Track[]; // Track order to be raced
  umaPreBansTeam1: Umamusume[];
  umaPreBansTeam2: Umamusume[];
  umaPicksTeam1: Umamusume[];
  umaPicksTeam2: Umamusume[];
  umaVetoTeam1: Umamusume | null;
  umaVetoTeam2: Umamusume | null;
  umaReservesTeam1: Umamusume[];
  umaReservesTeam2: Umamusume[];
  playersTeam1: PlayerSlot[];
  playersTeam2: PlayerSlot[];
  bluffUmaTeam1: Umamusume | null;
  bluffUmaTeam2: Umamusume | null;
  trainingSecondsLeft: number;
  trainingIsRunning: boolean;
  currentRaceIndex: number;
  raceResults: RaceRoundResult[];
  winnerTeam: 1 | 2 | null;
}
