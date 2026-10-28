import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Copy, Check, Sparkles, AlertTriangle, ArrowRight, RotateCcw, Share2, MapPin } from 'lucide-react';
import { fireVictoryConfetti } from '../utils/confetti';
import { Track, PlayerSlot, Umamusume, RaceRoundResult, RacePodium } from '../types/draft';
import { sound } from '../utils/audio';

interface RaceScoreboardProps {
  finalTracks: Track[];
  tiebreakerTrack: Track | null;
  targetScore: number;
  players1: PlayerSlot[];
  players2: PlayerSlot[];
  team1Name: string;
  team2Name: string;
  team1Color: string;
  team2Color: string;
  allUmasMap: Map<string, Umamusume>;
  onResetMatch: () => void;
}

export const RaceScoreboard: React.FC<RaceScoreboardProps> = ({
  finalTracks,
  tiebreakerTrack,
  targetScore,
  players1,
  players2,
  team1Name,
  team2Name,
  team1Color,
  team2Color,
  allUmasMap,
  onResetMatch,
}) => {
  // Qualified players (excluding forfeited)
  const qualified1 = players1.filter(p => p.trainingStatus !== 'forfeited');
  const qualified2 = players2.filter(p => p.trainingStatus !== 'forfeited');

  const allRunners = [
    ...qualified1.map(p => ({
      slot: p,
      team: 1 as const,
      teamName: team1Name,
      color: team1Color,
      uma: p.assignedUmaId ? allUmasMap.get(p.assignedUmaId) : null,
    })),
    ...qualified2.map(p => ({
      slot: p,
      team: 2 as const,
      teamName: team2Name,
      color: team2Color,
      uma: p.assignedUmaId ? allUmasMap.get(p.assignedUmaId) : null,
    })),
  ];

  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [isTiebreakerActive, setIsTiebreakerActive] = useState(false);
  const [roomCode, setRoomCode] = useState(() => `${Math.floor(10000000 + Math.random() * 90000000)}`);
  const [copiedRoom, setCopiedRoom] = useState(false);

  // Round Results Log
  const [completedRounds, setCompletedRounds] = useState<RaceRoundResult[]>([]);
  const [totalTeam1, setTotalTeam1] = useState(0);
  const [totalTeam2, setTotalTeam2] = useState(0);
  const [winnerTeam, setWinnerTeam] = useState<1 | 2 | null>(null);

  // Active Podium selections for current round
  const [firstRunnerId, setFirstRunnerId] = useState<string>('');
  const [secondRunnerId, setSecondRunnerId] = useState<string>('');
  const [thirdRunnerId, setThirdRunnerId] = useState<string>('');

  const currentTrack: Track = isTiebreakerActive
    ? tiebreakerTrack || finalTracks[0]
    : finalTracks[currentRoundIndex] || finalTracks[0];

  const isLastRegularRound = currentRoundIndex === finalTracks.length - 1;

  // Trigger confetti and fanfare on match win
  useEffect(() => {
    if (winnerTeam) {
      sound.playFanfare();
      fireVictoryConfetti();
    }
  }, [winnerTeam]);

  const copyRoomCode = () => {
    sound.playSelect();
    navigator.clipboard.writeText(roomCode);
    setCopiedRoom(true);
    setTimeout(() => setCopiedRoom(false), 2000);
  };

  const getRunnerById = (slotId: string) => {
    return allRunners.find(r => r.slot.id === slotId);
  };

  const handleConfirmRound = () => {
    if (!firstRunnerId || !secondRunnerId || !thirdRunnerId) return;

    sound.playLockIn();
    const r1 = getRunnerById(firstRunnerId);
    const r2 = getRunnerById(secondRunnerId);
    const r3 = getRunnerById(thirdRunnerId);

    if (!r1 || !r2 || !r3) return;

    let pts1 = 0;
    let pts2 = 0;

    // 1st: 4pts
    if (r1.team === 1) pts1 += 4; else pts2 += 4;
    // 2nd: 2pts
    if (r2.team === 1) pts1 += 2; else pts2 += 2;
    // 3rd: 1pt
    if (r3.team === 1) pts1 += 1; else pts2 += 1;

    const newTotal1 = totalTeam1 + pts1;
    const newTotal2 = totalTeam2 + pts2;

    const podium: RacePodium = {
      first: { team: r1.team, player: r1.slot.name, umaId: r1.uma?.name || 'Uma' },
      second: { team: r2.team, player: r2.slot.name, umaId: r2.uma?.name || 'Uma' },
      third: { team: r3.team, player: r3.slot.name, umaId: r3.uma?.name || 'Uma' },
    };

    const roundRecord: RaceRoundResult = {
      roundNumber: isTiebreakerActive ? finalTracks.length + 1 : currentRoundIndex + 1,
      track: currentTrack,
      isTiebreaker: isTiebreakerActive,
      roomCode,
      podium,
      team1PointsEarned: pts1,
      team2PointsEarned: pts2,
      runningTotalTeam1: newTotal1,
      runningTotalTeam2: newTotal2,
      completed: true,
    };

    setCompletedRounds([...completedRounds, roundRecord]);
    setTotalTeam1(newTotal1);
    setTotalTeam2(newTotal2);

    // Reset podium dropdowns & generate next room code
    setFirstRunnerId('');
    setSecondRunnerId('');
    setThirdRunnerId('');
    setRoomCode(`${Math.floor(10000000 + Math.random() * 90000000)}`);

    // Check Win Conditions:
    // 1. If any team hits targetScore (e.g. 25 points)
    if (newTotal1 >= targetScore || newTotal2 >= targetScore) {
      if (newTotal1 > newTotal2) {
        setWinnerTeam(1);
      } else if (newTotal2 > newTotal1) {
        setWinnerTeam(2);
      } else {
        // If tied exactly at or above target score, tiebreaker
        setIsTiebreakerActive(true);
      }
      return;
    }

    // 2. If finished all regular tracks
    if (!isTiebreakerActive && isLastRegularRound) {
      if (newTotal1 === newTotal2) {
        // Tied! Activate 7th track tiebreaker!
        setIsTiebreakerActive(true);
        sound.playBuzzer();
      } else {
        // Normal conclusion
        setWinnerTeam(newTotal1 > newTotal2 ? 1 : 2);
      }
      return;
    }

    // 3. If tiebreaker finished
    if (isTiebreakerActive) {
      setWinnerTeam(newTotal1 >= newTotal2 ? 1 : 2);
      return;
    }

    // Advance to next track
    setCurrentRoundIndex(currentRoundIndex + 1);
  };

  const copyMatchRecap = () => {
    sound.playSelect();
    const recapText = `=== UMAMUSUME ESPORTS MATCH RECAP ===
Match: ${team1Name} (${totalTeam1} pts) vs ${team2Name} (${totalTeam2} pts)
Winner: ${winnerTeam === 1 ? team1Name : team2Name}
Target Score: ${targetScore} pts

Rounds Summary:
${completedRounds.map(r => `Round ${r.roundNumber} [${r.track.name}]:
  1st: ${r.podium?.first.player} (${r.podium?.first.umaId})
  2nd: ${r.podium?.second.player} (${r.podium?.second.umaId})
  3rd: ${r.podium?.third.player} (${r.podium?.third.umaId})
  Score: ${team1Name} +${r.team1PointsEarned} | ${team2Name} +${r.team2PointsEarned} (Total: ${r.runningTotalTeam1} - ${r.runningTotalTeam2})`).join('\n\n')}
`;
    navigator.clipboard.writeText(recapText);
    alert('Match recap copied to clipboard!');
  };

  const progress1 = Math.min(100, (totalTeam1 / targetScore) * 100);
  const progress2 = Math.min(100, (totalTeam2 / targetScore) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Victory Celebration Modal / Hero if match decided */}
      {winnerTeam && (
        <div className="bg-gradient-to-b from-amber-950/60 via-slate-900 to-slate-950 border-2 border-amber-500 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-500">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500 text-slate-950 font-bold uppercase text-xs tracking-widest shadow-md">
            <Trophy className="w-4 h-4 fill-current" />
            <span>Tournament Champions</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl font-black font-display uppercase tracking-tight text-white">
              {winnerTeam === 1 ? team1Name : team2Name} Wins The Match!
            </h1>
            <p className="text-amber-300 font-mono text-lg font-bold">
              Final Score: {totalTeam1} - {totalTeam2} (Target: {targetScore} Points)
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={copyMatchRecap}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-display uppercase tracking-wider text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Copy Match Recap</span>
            </button>

            <button
              type="button"
              onClick={onResetMatch}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Back to Lobby</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Live Scoreboard Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Team 1 Standings */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: team1Color }} />
                <h3 className="font-display font-extrabold text-xl sm:text-2xl uppercase tracking-wide text-white truncate max-w-[200px]">
                  {team1Name}
                </h3>
              </div>
              <span className="font-mono-numbers text-3xl sm:text-4xl font-black text-blue-400">
                {totalTeam1} <span className="text-xs font-sans text-slate-500 font-normal">pts</span>
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${progress1}%` }}
              />
            </div>
          </div>

          {/* Team 2 Standings */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: team2Color }} />
                <h3 className="font-display font-extrabold text-xl sm:text-2xl uppercase tracking-wide text-white truncate max-w-[200px]">
                  {team2Name}
                </h3>
              </div>
              <span className="font-mono-numbers text-3xl sm:text-4xl font-black text-rose-400">
                {totalTeam2} <span className="text-xs font-sans text-slate-500 font-normal">pts</span>
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-rose-500 transition-all duration-500"
                style={{ width: `${progress2}%` }}
              />
            </div>
          </div>
        </div>

        {/* Target Indicator */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>First to <strong className="text-amber-400">{targetScore} Points</strong> wins the tournament</span>
          <span>Podium: 1st (+4) · 2nd (+2) · 3rd (+1)</span>
        </div>
      </div>

      {!winnerTeam && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Current Race Track Card (Left 5 Cols) */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400">
                {isTiebreakerActive
                  ? 'FINAL TIEBREAKER SUDDEN DEATH'
                  : `Round ${currentRoundIndex + 1} of ${finalTracks.length}`}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                currentTrack.surface === 'Turf' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                {currentTrack.surface} · {currentTrack.distance}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-wide">
                {currentTrack.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {currentTrack.nameJp} · {currentTrack.course}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 font-mono-numbers bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Length</span>
                <strong>{currentTrack.lengthMeters}m</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Prefecture</span>
                <strong>{currentTrack.prefecture}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Turn Direction</span>
                <strong>{currentTrack.direction}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Weather / Ground</span>
                <strong className="text-emerald-400">Good / Fair</strong>
              </div>
            </div>

            {/* In-Game Room Coordinator */}
            <div className="p-3.5 bg-slate-950 border border-amber-500/30 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-amber-400 uppercase font-mono font-bold tracking-wider">
                  In-Game Match Room ID
                </span>
                <span className="text-[10px] text-slate-500">Share with racers</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-mono font-bold tracking-wider"
                  placeholder="Room Code"
                />
                <button
                  type="button"
                  onClick={copyRoomCode}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shrink-0"
                >
                  {copiedRoom ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedRoom ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {isTiebreakerActive && (
              <div className="p-3 bg-amber-950/40 border border-amber-600 rounded-xl text-xs text-amber-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Tiebreaker Activated:</strong> Scores were tied after Round {finalTracks.length}! This course decides the winner!
                </span>
              </div>
            )}
          </div>

          {/* Interactive Podium Finisher Entry (Right 7 Cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-display font-bold text-white uppercase text-lg tracking-wide flex items-center gap-2">
                <Medal className="w-5 h-5 text-amber-400" />
                Record Race Finishers (Podium Entry)
              </h3>
              <span className="text-xs text-slate-400 font-mono">1st=4pt · 2nd=2pt · 3rd=1pt</span>
            </div>

            <div className="space-y-4">
              {/* 1st Place Selector */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-amber-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" /> 1st Place (+4 Points)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Gold Podium</span>
                </div>
                <select
                  value={firstRunnerId}
                  onChange={(e) => {
                    sound.playSelect();
                    setFirstRunnerId(e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="">-- Select 1st Place Finisher --</option>
                  {allRunners.map(r => (
                    <option key={r.slot.id} value={r.slot.id}>
                      [{r.teamName}] {r.slot.name} ({r.uma?.name || 'Uma'})
                    </option>
                  ))}
                </select>
              </div>

              {/* 2nd Place Selector */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Medal className="w-3.5 h-3.5 text-slate-400" /> 2nd Place (+2 Points)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Silver Podium</span>
                </div>
                <select
                  value={secondRunnerId}
                  onChange={(e) => {
                    sound.playSelect();
                    setSecondRunnerId(e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-slate-500 cursor-pointer"
                >
                  <option value="">-- Select 2nd Place Finisher --</option>
                  {allRunners
                    .filter(r => r.slot.id !== firstRunnerId)
                    .map(r => (
                      <option key={r.slot.id} value={r.slot.id}>
                        [{r.teamName}] {r.slot.name} ({r.uma?.name || 'Uma'})
                      </option>
                    ))}
                </select>
              </div>

              {/* 3rd Place Selector */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-amber-900/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Medal className="w-3.5 h-3.5 text-amber-600" /> 3rd Place (+1 Point)
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Bronze Podium</span>
                </div>
                <select
                  value={thirdRunnerId}
                  onChange={(e) => {
                    sound.playSelect();
                    setThirdRunnerId(e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-700 cursor-pointer"
                >
                  <option value="">-- Select 3rd Place Finisher --</option>
                  {allRunners
                    .filter(r => r.slot.id !== firstRunnerId && r.slot.id !== secondRunnerId)
                    .map(r => (
                      <option key={r.slot.id} value={r.slot.id}>
                        [{r.teamName}] {r.slot.name} ({r.uma?.name || 'Uma'})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Confirm Podium Button */}
            <div className="pt-2 text-right">
              <button
                type="button"
                disabled={!firstRunnerId || !secondRunnerId || !thirdRunnerId}
                onClick={handleConfirmRound}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold font-display uppercase tracking-wider text-base rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
              >
                <span>Confirm Race Results &amp; Update Standings</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Round-by-Round Match Ledger */}
      {completedRounds.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-display font-bold text-white uppercase text-base tracking-wide">
              Match Rounds Recap ({completedRounds.length} Completed)
            </h3>
            <span className="text-xs text-slate-400 font-mono">Official Score Record</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase font-mono text-[10px]">
                  <th className="py-2.5 px-3">Round</th>
                  <th className="py-2.5 px-3">Course</th>
                  <th className="py-2.5 px-3">1st (+4)</th>
                  <th className="py-2.5 px-3">2nd (+2)</th>
                  <th className="py-2.5 px-3">3rd (+1)</th>
                  <th className="py-2.5 px-3">Round Pts</th>
                  <th className="py-2.5 px-3">Running Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono-numbers">
                {completedRounds.map((res) => (
                  <tr key={res.roundNumber} className="hover:bg-slate-950/40">
                    <td className="py-2.5 px-3 text-slate-400 font-bold">
                      {res.isTiebreaker ? 'TIE' : `#${res.roundNumber}`}
                    </td>
                    <td className="py-2.5 px-3 text-slate-200 font-sans font-medium">
                      {res.track.name} ({res.track.surface})
                    </td>
                    <td className="py-2.5 px-3 text-amber-300 font-sans">
                      {res.podium?.first.player} ({res.podium?.first.umaId})
                    </td>
                    <td className="py-2.5 px-3 text-slate-300 font-sans">
                      {res.podium?.second.player} ({res.podium?.second.umaId})
                    </td>
                    <td className="py-2.5 px-3 text-amber-600 font-sans">
                      {res.podium?.third.player} ({res.podium?.third.umaId})
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-blue-400">+{res.team1PointsEarned}</span>
                      <span className="text-slate-600"> / </span>
                      <span className="text-rose-400">+{res.team2PointsEarned}</span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-white">
                      {res.runningTotalTeam1} - {res.runningTotalTeam2}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
