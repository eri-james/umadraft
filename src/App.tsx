/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  MatchPhase,
  MatchConfig,
  Track,
  Umamusume,
  PlayerSlot,
  FullMatchState,
} from './types/draft';
import { ALL_UMAS } from './data/umas';
import { getFormatRules } from './utils/rules';
import { sound } from './utils/audio';

import { Header } from './components/Header';
import { LobbySetup } from './components/LobbySetup';
import { TiebreakerRoll } from './components/TiebreakerRoll';
import { CoinFlip } from './components/CoinFlip';
import { TrackDraft } from './components/TrackDraft';
import { TrackVeto } from './components/TrackVeto';
import { UmaPreBan } from './components/UmaPreBan';
import { UmaDraft } from './components/UmaDraft';
import { UmaVeto } from './components/UmaVeto';
import { UmaReserve } from './components/UmaReserve';
import { RosterAssignment } from './components/RosterAssignment';
import { CareerTrainingTimer } from './components/CareerTrainingTimer';
import { RaceScoreboard } from './components/RaceScoreboard';
import { CasterOverlayModal } from './components/CasterOverlayModal';

const STORAGE_KEY = 'umamusume_draft_match_state_v1';

const DEFAULT_CONFIG: MatchConfig = {
  team1Name: 'Team Spica',
  team2Name: 'Team Rigil',
  team1Color: '#2563eb',
  team2Color: '#dc2626',
  teamSize: 5,
  targetPoints: 25,
  playersTeam1: ['Trainer T', 'Special P1', 'Suzuka P2', 'Teio P3', 'GoldShip P4'],
  playersTeam2: ['Hana Trainer', 'McQueen P1', 'Rudolf P2', 'Brian P3', 'Falcon P4'],
};

const INITIAL_STATE: FullMatchState = {
  config: DEFAULT_CONFIG,
  phase: 'LOBBY',
  tiebreakerTrack: null,
  trackPriorityTeam: 1,
  trackPicksTeam1: [],
  trackPicksTeam2: [],
  trackVetoTeam1: null,
  trackVetoTeam2: null,
  finalTracks: [],
  umaPreBansTeam1: [],
  umaPreBansTeam2: [],
  umaPicksTeam1: [],
  umaPicksTeam2: [],
  umaVetoTeam1: null,
  umaVetoTeam2: null,
  umaReservesTeam1: [],
  umaReservesTeam2: [],
  playersTeam1: [],
  playersTeam2: [],
  bluffUmaTeam1: null,
  bluffUmaTeam2: null,
  trainingSecondsLeft: 3600,
  trainingIsRunning: false,
  currentRaceIndex: 0,
  raceResults: [],
  winnerTeam: null,
};

export default function App() {
  const [matchState, setMatchState] = useState<FullMatchState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_STATE;
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showCasterOverlay, setShowCasterOverlay] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(matchState));
    } catch {
      // Ignore quota errors
    }
  }, [matchState]);

  // Index all umas by id for fast lookup
  const allUmasMap = useMemo(() => {
    const map = new Map<string, Umamusume>();
    ALL_UMAS.forEach(u => map.set(u.id, u));
    return map;
  }, []);

  // Priority for Uma draft is opposite of track draft priority
  const umaPriorityTeam: 1 | 2 = matchState.trackPriorityTeam === 1 ? 2 : 1;

  // Un-vetoed pool from main draft picks
  const remainingMainPicksTeam1 = useMemo(() => {
    if (!matchState.umaVetoTeam2) return matchState.umaPicksTeam1;
    return matchState.umaPicksTeam1.filter(u => u.id !== matchState.umaVetoTeam2?.id);
  }, [matchState.umaPicksTeam1, matchState.umaVetoTeam2]);

  const remainingMainPicksTeam2 = useMemo(() => {
    if (!matchState.umaVetoTeam1) return matchState.umaPicksTeam2;
    return matchState.umaPicksTeam2.filter(u => u.id !== matchState.umaVetoTeam1?.id);
  }, [matchState.umaPicksTeam2, matchState.umaVetoTeam1]);

  // Full pool for assignment: remaining + reserves
  const poolTeam1 = useMemo(() => {
    return [...remainingMainPicksTeam1, ...matchState.umaReservesTeam1];
  }, [remainingMainPicksTeam1, matchState.umaReservesTeam1]);

  const poolTeam2 = useMemo(() => {
    return [...remainingMainPicksTeam2, ...matchState.umaReservesTeam2];
  }, [remainingMainPicksTeam2, matchState.umaReservesTeam2]);

  // All used uma IDs for reserving
  const allUsedUmaIds = useMemo(() => {
    return new Set([
      ...matchState.umaPreBansTeam1.map(u => u.id),
      ...matchState.umaPreBansTeam2.map(u => u.id),
      ...matchState.umaPicksTeam1.map(u => u.id),
      ...matchState.umaPicksTeam2.map(u => u.id),
    ]);
  }, [
    matchState.umaPreBansTeam1,
    matchState.umaPreBansTeam2,
    matchState.umaPicksTeam1,
    matchState.umaPicksTeam2,
  ]);

  // Current Scores
  const team1Score = matchState.raceResults.length > 0
    ? matchState.raceResults[matchState.raceResults.length - 1].runningTotalTeam1
    : 0;
  const team2Score = matchState.raceResults.length > 0
    ? matchState.raceResults[matchState.raceResults.length - 1].runningTotalTeam2
    : 0;

  // Handler: Start Match from Lobby
  const handleStartMatch = (config: MatchConfig) => {
    const rules = getFormatRules(config.teamSize);
    const initialP1: PlayerSlot[] = config.playersTeam1.map((name, i) => ({
      id: `t1-p${i}`,
      name,
      team: 1,
      trainingStatus: 'training',
    }));
    const initialP2: PlayerSlot[] = config.playersTeam2.map((name, i) => ({
      id: `t2-p${i}`,
      name,
      team: 2,
      trainingStatus: 'training',
    }));

    setMatchState({
      ...INITIAL_STATE,
      config,
      phase: 'TIEBREAKER_ROLL',
      playersTeam1: initialP1,
      playersTeam2: initialP2,
    });
  };

  // Handler: Confirm Tiebreaker Course
  const handleConfirmTiebreaker = (track: Track) => {
    setMatchState(prev => ({
      ...prev,
      tiebreakerTrack: track,
      phase: 'TRACK_COIN_FLIP',
    }));
  };

  // Handler: Confirm Priority Coin Flip
  const handleConfirmPriority = (priorityTeam: 1 | 2) => {
    setMatchState(prev => ({
      ...prev,
      trackPriorityTeam: priorityTeam,
      phase: 'TRACK_DRAFT',
    }));
  };

  // Handler: Complete Track Drafting
  const handleCompleteTrackDraft = (picks1: Track[], picks2: Track[]) => {
    setMatchState(prev => ({
      ...prev,
      trackPicksTeam1: picks1,
      trackPicksTeam2: picks2,
      phase: 'TRACK_VETO',
    }));
  };

  // Handler: Confirm Track Vetoes & Schedule
  const handleConfirmTrackVetoes = (veto1: Track, veto2: Track, finalTracks: Track[]) => {
    setMatchState(prev => ({
      ...prev,
      trackVetoTeam1: veto1,
      trackVetoTeam2: veto2,
      finalTracks,
      phase: 'UMA_PRE_BAN',
    }));
  };

  // Handler: Complete Uma Pre-Bans
  const handleCompletePreBans = (bans1: Umamusume[], bans2: Umamusume[]) => {
    setMatchState(prev => ({
      ...prev,
      umaPreBansTeam1: bans1,
      umaPreBansTeam2: bans2,
      phase: 'UMA_DRAFT',
    }));
  };

  // Handler: Complete Uma Snake Draft
  const handleCompleteUmaDraft = (picks1: Umamusume[], picks2: Umamusume[]) => {
    setMatchState(prev => ({
      ...prev,
      umaPicksTeam1: picks1,
      umaPicksTeam2: picks2,
      phase: 'UMA_VETO',
    }));
  };

  // Handler: Confirm Mid-Draft Uma Vetoes
  const handleConfirmUmaVetoes = (veto1: Umamusume, veto2: Umamusume) => {
    setMatchState(prev => ({
      ...prev,
      umaVetoTeam1: veto1,
      umaVetoTeam2: veto2,
      phase: 'UMA_RESERVE',
    }));
  };

  // Handler: Complete Reserve Picks (+2 Umas each)
  const handleCompleteReserves = (reserves1: Umamusume[], reserves2: Umamusume[]) => {
    setMatchState(prev => ({
      ...prev,
      umaReservesTeam1: reserves1,
      umaReservesTeam2: reserves2,
      phase: 'ASSIGN_ROSTER',
    }));
  };

  // Handler: Confirm Roster Assignments & Secret Bluff
  const handleConfirmAssignments = (
    slots1: PlayerSlot[],
    slots2: PlayerSlot[],
    bluff1: Umamusume,
    bluff2: Umamusume
  ) => {
    setMatchState(prev => ({
      ...prev,
      playersTeam1: slots1,
      playersTeam2: slots2,
      bluffUmaTeam1: bluff1,
      bluffUmaTeam2: bluff2,
      phase: 'TRAINING_TIMER',
      trainingSecondsLeft: 3600,
      trainingIsRunning: true,
    }));
  };

  // Handler: Proceed from Training to Races
  const handleProceedToRaces = (updated1: PlayerSlot[], updated2: PlayerSlot[]) => {
    setMatchState(prev => ({
      ...prev,
      playersTeam1: updated1,
      playersTeam2: updated2,
      phase: 'RACE_MATCH',
      trainingIsRunning: false,
    }));
  };

  // Handler: Reset to Lobby
  const handleResetMatch = () => {
    if (window.confirm('Reset tournament match and return to Lobby Setup?')) {
      sound.playSelect();
      setMatchState(INITIAL_STATE);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="min-h-screen bg-[#080d14] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Bar Header */}
      <Header
        phase={matchState.phase}
        team1Name={matchState.config.team1Name}
        team2Name={matchState.config.team2Name}
        team1Score={team1Score}
        team2Score={team2Score}
        targetScore={matchState.config.targetPoints}
        teamSize={matchState.config.teamSize}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onResetMatch={handleResetMatch}
        onToggleCasterOverlay={() => setShowCasterOverlay(!showCasterOverlay)}
      />

      {/* Main Active Stage Content */}
      <main className="flex-1 pb-16">
        {matchState.phase === 'LOBBY' && (
          <LobbySetup
            initialConfig={matchState.config}
            onStartMatch={handleStartMatch}
          />
        )}

        {matchState.phase === 'TIEBREAKER_ROLL' && (
          <TiebreakerRoll onConfirmTiebreaker={handleConfirmTiebreaker} />
        )}

        {matchState.phase === 'TRACK_COIN_FLIP' && (
          <CoinFlip
            team1Name={matchState.config.team1Name}
            team2Name={matchState.config.team2Name}
            team1Color={matchState.config.team1Color}
            team2Color={matchState.config.team2Color}
            onConfirmPriority={handleConfirmPriority}
          />
        )}

        {matchState.phase === 'TRACK_DRAFT' && (
          <TrackDraft
            teamSize={matchState.config.teamSize}
            team1Name={matchState.config.team1Name}
            team2Name={matchState.config.team2Name}
            team1Color={matchState.config.team1Color}
            team2Color={matchState.config.team2Color}
            priorityTeam={matchState.trackPriorityTeam}
            tiebreakerTrack={matchState.tiebreakerTrack}
            onCompleteTrackDraft={handleCompleteTrackDraft}
          />
        )}

        {matchState.phase === 'TRACK_VETO' && (
          <TrackVeto
            team1Name={matchState.config.team1Name}
            team2Name={matchState.config.team2Name}
            team1Color={matchState.config.team1Color}
            team2Color={matchState.config.team2Color}
            picksTeam1={matchState.trackPicksTeam1}
            picksTeam2={matchState.trackPicksTeam2}
            tiebreakerTrack={matchState.tiebreakerTrack}
            onConfirmVetoes={handleConfirmTrackVetoes}
          />
        )}

        {matchState.phase === 'UMA_PRE_BAN' && (
          <UmaPreBan
            teamSize={matchState.config.teamSize}
            team1Name={matchState.config.team1Name}
            team2Name={matchState.config.team2Name}
            team1Color={matchState.config.team1Color}
            team2Color={matchState.config.team2Color}
            umaPriorityTeam={umaPriorityTeam}
            onCompletePreBans={handleCompletePreBans}
          />
        )}

        {matchState.phase === 'UMA_DRAFT' && (
          <UmaDraft
            teamSize={matchState.config.teamSize}
            team1Name={matchState.config.team1Name}
            team2Name={matchState.config.team2Name}
            team1Color={matchState.config.team1Color}
            team2Color={matchState.config.team2Color}
            umaPriorityTeam={umaPriorityTeam}
            preBansTeam1={matchState.umaPreBansTeam1}
            preBansTeam2={matchState.umaPreBansTeam2}
            onCompleteUmaDraft={handleCompleteUmaDraft}
          />
        )}

        {matchState.phase === 'UMA_VETO' && (
          <UmaVeto
            team1Name={matchState.config.team1Name}
            team2Name={matchState.config.team2Name}
            team1Color={matchState.config.team1Color}
            team2Color={matchState.config.team2Color}
            picksTeam1={matchState.umaPicksTeam1}
            picksTeam2={matchState.umaPicksTeam2}
            onConfirmUmaVetoes={handleConfirmUmaVetoes}
          />
        )}

        {matchState.phase === 'UMA_RESERVE' && (
          <UmaReserve
            teamSize={matchState.config.teamSize}
            team1Name={matchState.config.team1Name}
            team2Name={matchState.config.team2Name}
            team1Color={matchState.config.team1Color}
            team2Color={matchState.config.team2Color}
            umaPriorityTeam={umaPriorityTeam}
            existingPoolTeam1={remainingMainPicksTeam1}
            existingPoolTeam2={remainingMainPicksTeam2}
            allUsedUmaIds={allUsedUmaIds}
            onCompleteReserves={handleCompleteReserves}
          />
        )}

        {matchState.phase === 'ASSIGN_ROSTER' && (
          <RosterAssignment
            teamSize={matchState.config.teamSize}
            team1Name={matchState.config.team1Name}
            team2Name={matchState.config.team2Name}
            team1Color={matchState.config.team1Color}
            team2Color={matchState.config.team2Color}
            poolTeam1={poolTeam1}
            poolTeam2={poolTeam2}
            playersTeam1={matchState.config.playersTeam1}
            playersTeam2={matchState.config.playersTeam2}
            onConfirmAssignments={handleConfirmAssignments}
          />
        )}

        {matchState.phase === 'TRAINING_TIMER' && (
          <CareerTrainingTimer
            initialSeconds={matchState.trainingSecondsLeft}
            initialIsRunning={matchState.trainingIsRunning}
            players1={matchState.playersTeam1}
            players2={matchState.playersTeam2}
            team1Name={matchState.config.team1Name}
            team2Name={matchState.config.team2Name}
            team1Color={matchState.config.team1Color}
            team2Color={matchState.config.team2Color}
            allUmasMap={allUmasMap}
            onProceedToRaces={handleProceedToRaces}
          />
        )}

        {(matchState.phase === 'RACE_MATCH' || matchState.phase === 'MATCH_VICTORY') && (
          <RaceScoreboard
            finalTracks={matchState.finalTracks}
            tiebreakerTrack={matchState.tiebreakerTrack}
            targetScore={matchState.config.targetPoints}
            players1={matchState.playersTeam1}
            players2={matchState.playersTeam2}
            team1Name={matchState.config.team1Name}
            team2Name={matchState.config.team2Name}
            team1Color={matchState.config.team1Color}
            team2Color={matchState.config.team2Color}
            allUmasMap={allUmasMap}
            onResetMatch={handleResetMatch}
          />
        )}
      </main>

      {/* Caster Overlay Modal */}
      {showCasterOverlay && (
        <CasterOverlayModal
          state={matchState}
          allUmasMap={allUmasMap}
          onClose={() => setShowCasterOverlay(false)}
        />
      )}
    </div>
  );
}
