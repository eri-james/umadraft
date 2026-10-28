import { TeamSize, Track, TrackDistance } from '../types/draft';

export interface DraftFormatRules {
  tracksPerTeam: number;
  maxTracksPerDistance: number;
  trackVetoCount: number;
  totalRaceTracks: number;
  umaPreBansPerTeam: number;
  umaDraftPicksPerTeam: number;
  umaVetoCount: number;
  umaReservePicksPerTeam: number;
  totalTeamUmaRoster: number; // e.g. 6 for 5v5
  activeRosterSize: number; // n (assigned to players)
  bluffRosterSize: number; // 1
  defaultTargetPoints: number;
}

export function getFormatRules(teamSize: TeamSize): DraftFormatRules {
  switch (teamSize) {
    case 5:
      return {
        tracksPerTeam: 4,
        maxTracksPerDistance: 2,
        trackVetoCount: 1,
        totalRaceTracks: 6,
        umaPreBansPerTeam: 2,
        umaDraftPicksPerTeam: 5,
        umaVetoCount: 1,
        umaReservePicksPerTeam: 2,
        totalTeamUmaRoster: 6,
        activeRosterSize: 5,
        bluffRosterSize: 1,
        defaultTargetPoints: 25,
      };
    case 4:
      return {
        tracksPerTeam: 3,
        maxTracksPerDistance: 2,
        trackVetoCount: 1,
        totalRaceTracks: 4,
        umaPreBansPerTeam: 2,
        umaDraftPicksPerTeam: 4,
        umaVetoCount: 1,
        umaReservePicksPerTeam: 2,
        totalTeamUmaRoster: 5,
        activeRosterSize: 4,
        bluffRosterSize: 1,
        defaultTargetPoints: 20,
      };
    case 3:
      return {
        tracksPerTeam: 2,
        maxTracksPerDistance: 1,
        trackVetoCount: 1,
        totalRaceTracks: 2, // plus tiebreaker if tied
        umaPreBansPerTeam: 1,
        umaDraftPicksPerTeam: 3,
        umaVetoCount: 1,
        umaReservePicksPerTeam: 2,
        totalTeamUmaRoster: 4,
        activeRosterSize: 3,
        bluffRosterSize: 1,
        defaultTargetPoints: 15,
      };
    case 2:
      return {
        tracksPerTeam: 2,
        maxTracksPerDistance: 1,
        trackVetoCount: 1,
        totalRaceTracks: 2,
        umaPreBansPerTeam: 1,
        umaDraftPicksPerTeam: 2,
        umaVetoCount: 1,
        umaReservePicksPerTeam: 2,
        totalTeamUmaRoster: 3,
        activeRosterSize: 2,
        bluffRosterSize: 1,
        defaultTargetPoints: 10,
      };
  }
}

/**
 * Checks if a team can pick a track without violating distance limits.
 */
export function canPickTrackDistance(
  existingPicks: Track[],
  candidateDistance: TrackDistance,
  maxAllowed: number
): boolean {
  const currentCount = existingPicks.filter(t => t.distance === candidateDistance).length;
  return currentCount < maxAllowed;
}

/**
 * Generates alternating track pick turn order.
 * e.g. for 5v5 (4 tracks each = 8 picks total):
 * Priority team (e.g. 1) picks first: [1, 2, 1, 2, 1, 2, 1, 2]
 */
export function getTrackPickSequence(priorityTeam: 1 | 2, tracksPerTeam: number): Array<1 | 2> {
  const otherTeam: 1 | 2 = priorityTeam === 1 ? 2 : 1;
  const sequence: Array<1 | 2> = [];
  for (let i = 0; i < tracksPerTeam; i++) {
    sequence.push(priorityTeam);
    sequence.push(otherTeam);
  }
  return sequence;
}

/**
 * Generates snake draft sequence for Uma selection.
 * Priority team (who picked tracks second):
 * e.g. For 5 picks each (10 picks):
 * Round 1: T1, T2
 * Round 2: T2, T1
 * Round 3: T1, T2
 * Round 4: T2, T1
 * Round 5: T1, T2
 */
export function getSnakePickSequence(firstTeam: 1 | 2, countPerTeam: number): Array<1 | 2> {
  const secondTeam: 1 | 2 = firstTeam === 1 ? 2 : 1;
  const sequence: Array<1 | 2> = [];
  let currentPairFirst = firstTeam;
  let currentPairSecond = secondTeam;

  for (let i = 0; i < countPerTeam; i++) {
    sequence.push(currentPairFirst);
    sequence.push(currentPairSecond);
    // Invert for snake order on subsequent round
    const temp = currentPairFirst;
    currentPairFirst = currentPairSecond;
    currentPairSecond = temp;
  }
  return sequence;
}
