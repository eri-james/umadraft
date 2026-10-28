import React, { useState } from 'react';
import { UserCheck, HelpCircle, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';
import { Umamusume, PlayerSlot, TeamSize } from '../types/draft';
import { getFormatRules } from '../utils/rules';
import { sound } from '../utils/audio';
import { UmaCard } from './UmaCard';

interface RosterAssignmentProps {
  teamSize: TeamSize;
  team1Name: string;
  team2Name: string;
  team1Color: string;
  team2Color: string;
  poolTeam1: Umamusume[];
  poolTeam2: Umamusume[];
  playersTeam1: string[];
  playersTeam2: string[];
  onConfirmAssignments: (
    slots1: PlayerSlot[],
    slots2: PlayerSlot[],
    bluff1: Umamusume,
    bluff2: Umamusume
  ) => void;
}

export const RosterAssignment: React.FC<RosterAssignmentProps> = ({
  teamSize,
  team1Name,
  team2Name,
  team1Color,
  team2Color,
  poolTeam1,
  poolTeam2,
  playersTeam1,
  playersTeam2,
  onConfirmAssignments,
}) => {
  const rules = getFormatRules(teamSize);

  // Player assignments: map player index -> umaId
  const [assignments1, setAssignments1] = useState<Record<number, string>>({});
  const [assignments2, setAssignments2] = useState<Record<number, string>>({});
  const [hideOpponentSecret, setHideOpponentSecret] = useState(true);

  // Assigned IDs
  const assignedIds1 = new Set(Object.values(assignments1).filter(Boolean));
  const assignedIds2 = new Set(Object.values(assignments2).filter(Boolean));

  // Determine bluff (the 1 remaining unused uma in each team's pool)
  const unassigned1 = poolTeam1.filter(u => !assignedIds1.has(u.id));
  const unassigned2 = poolTeam2.filter(u => !assignedIds2.has(u.id));

  const isTeam1Complete = Object.keys(assignments1).length === teamSize && assignedIds1.size === teamSize;
  const isTeam2Complete = Object.keys(assignments2).length === teamSize && assignedIds2.size === teamSize;
  const isAllComplete = isTeam1Complete && isTeam2Complete;

  const handleAssign1 = (playerIdx: number, umaId: string) => {
    sound.playSelect();
    setAssignments1(prev => ({
      ...prev,
      [playerIdx]: umaId,
    }));
  };

  const handleAssign2 = (playerIdx: number, umaId: string) => {
    sound.playSelect();
    setAssignments2(prev => ({
      ...prev,
      [playerIdx]: umaId,
    }));
  };

  const handleAutoAssign = () => {
    sound.playSelect();
    const newAss1: Record<number, string> = {};
    for (let i = 0; i < teamSize; i++) {
      if (poolTeam1[i]) newAss1[i] = poolTeam1[i].id;
    }
    setAssignments1(newAss1);

    const newAss2: Record<number, string> = {};
    for (let i = 0; i < teamSize; i++) {
      if (poolTeam2[i]) newAss2[i] = poolTeam2[i].id;
    }
    setAssignments2(newAss2);
  };

  const handleProceed = () => {
    if (!isAllComplete) return;
    sound.playLockIn();

    const slots1: PlayerSlot[] = playersTeam1.map((name, i) => ({
      id: `t1-p${i}`,
      name,
      team: 1,
      assignedUmaId: assignments1[i],
      trainingStatus: 'training',
    }));

    const slots2: PlayerSlot[] = playersTeam2.map((name, i) => ({
      id: `t2-p${i}`,
      name,
      team: 2,
      assignedUmaId: assignments2[i],
      trainingStatus: 'training',
    }));

    const bluff1 = unassigned1[0] || poolTeam1[poolTeam1.length - 1];
    const bluff2 = unassigned2[0] || poolTeam2[poolTeam2.length - 1];

    onConfirmAssignments(slots1, slots2, bluff1, bluff2);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Stage 9 · Player Assignment &amp; Mindgames Bluff</span>
        </div>
        <h2 className="text-3xl font-extrabold font-display uppercase tracking-tight text-white">
          Assign Umas to Players
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          Each team assigns their {rules.activeRosterSize} players to {rules.activeRosterSize} specific Umamusume. The 1 remaining unassigned Uma acts as a <strong>Secret Bluff Reserve</strong>, forcing the opponent to guess who they will face on track!
        </p>

        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={handleAutoAssign}
            className="text-xs text-amber-400 hover:text-amber-300 underline font-medium"
          >
            Quick Auto-Fill Assignments
          </button>
          <span className="text-slate-600">·</span>
          <button
            type="button"
            onClick={() => setHideOpponentSecret(!hideOpponentSecret)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            {hideOpponentSecret ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{hideOpponentSecret ? 'Reveal Bluff Cards (Director Mode)' : 'Hide Bluff Cards'}</span>
          </button>
        </div>
      </div>

      {/* Two Teams Assignment Deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Team 1 Assignments */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: team1Color }} />
              <h3 className="font-display font-bold text-white uppercase text-lg tracking-wide">
                {team1Name} Lineup
              </h3>
            </div>
            <span className="text-xs font-mono-numbers text-slate-400">
              {assignedIds1.size}/{teamSize} Assigned
            </span>
          </div>

          {/* Player Slots */}
          <div className="space-y-3">
            {playersTeam1.map((playerName, idx) => {
              const currentUmaId = assignments1[idx];
              const selectedUma = poolTeam1.find(u => u.id === currentUmaId);

              return (
                <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-400">
                      P{idx + 1}: <strong className="text-white font-sans">{playerName}</strong>
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Assigned Runner
                    </span>
                  </div>

                  <select
                    value={currentUmaId || ''}
                    onChange={(e) => handleAssign1(idx, e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="">-- Choose Umamusume --</option>
                    {poolTeam1.map(uma => {
                      const alreadyUsed = assignedIds1.has(uma.id) && currentUmaId !== uma.id;
                      return (
                        <option key={uma.id} value={uma.id} disabled={alreadyUsed}>
                          {uma.name} ({uma.surfaceAptitude.turf === 'A' ? 'Turf' : 'Dirt'} · {uma.distanceAptitude.mile === 'A' ? 'Mile' : uma.distanceAptitude.medium === 'A' ? 'Med' : uma.distanceAptitude.sprint === 'A' ? 'Sprint' : 'Long'})
                          {alreadyUsed ? ' [Already Assigned]' : ''}
                        </option>
                      );
                    })}
                  </select>

                  {selectedUma && (
                    <UmaCard uma={selectedUma} compact />
                  )}
                </div>
              );
            })}
          </div>

          {/* Bluff Box */}
          <div className="p-3.5 rounded-xl border border-amber-900/40 bg-amber-950/20 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Unused Bluff Card (Mindgame Reserve)</span>
            </div>
            {unassigned1.length > 0 ? (
              hideOpponentSecret ? (
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-center text-xs text-slate-400">
                  <span className="font-mono text-amber-300">1 Secret Uma Bluff Armed</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Hidden from opponent during training countdown</p>
                </div>
              ) : (
                <UmaCard uma={unassigned1[0]} compact />
              )
            ) : (
              <span className="text-xs text-slate-500 italic block">Assign all players to designate bluff</span>
            )}
          </div>
        </div>

        {/* Team 2 Assignments */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: team2Color }} />
              <h3 className="font-display font-bold text-white uppercase text-lg tracking-wide">
                {team2Name} Lineup
              </h3>
            </div>
            <span className="text-xs font-mono-numbers text-slate-400">
              {assignedIds2.size}/{teamSize} Assigned
            </span>
          </div>

          {/* Player Slots */}
          <div className="space-y-3">
            {playersTeam2.map((playerName, idx) => {
              const currentUmaId = assignments2[idx];
              const selectedUma = poolTeam2.find(u => u.id === currentUmaId);

              return (
                <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-rose-400">
                      P{idx + 1}: <strong className="text-white font-sans">{playerName}</strong>
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Assigned Runner
                    </span>
                  </div>

                  <select
                    value={currentUmaId || ''}
                    onChange={(e) => handleAssign2(idx, e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-rose-500 cursor-pointer"
                  >
                    <option value="">-- Choose Umamusume --</option>
                    {poolTeam2.map(uma => {
                      const alreadyUsed = assignedIds2.has(uma.id) && currentUmaId !== uma.id;
                      return (
                        <option key={uma.id} value={uma.id} disabled={alreadyUsed}>
                          {uma.name} ({uma.surfaceAptitude.turf === 'A' ? 'Turf' : 'Dirt'} · {uma.distanceAptitude.mile === 'A' ? 'Mile' : uma.distanceAptitude.medium === 'A' ? 'Med' : uma.distanceAptitude.sprint === 'A' ? 'Sprint' : 'Long'})
                          {alreadyUsed ? ' [Already Assigned]' : ''}
                        </option>
                      );
                    })}
                  </select>

                  {selectedUma && (
                    <UmaCard uma={selectedUma} compact />
                  )}
                </div>
              );
            })}
          </div>

          {/* Bluff Box */}
          <div className="p-3.5 rounded-xl border border-amber-900/40 bg-amber-950/20 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Unused Bluff Card (Mindgame Reserve)</span>
            </div>
            {unassigned2.length > 0 ? (
              hideOpponentSecret ? (
                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-center text-xs text-slate-400">
                  <span className="font-mono text-amber-300">1 Secret Uma Bluff Armed</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">Hidden from opponent during training countdown</p>
                </div>
              ) : (
                <UmaCard uma={unassigned2[0]} compact />
              )
            ) : (
              <span className="text-xs text-slate-500 italic block">Assign all players to designate bluff</span>
            )}
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={handleProceed}
          disabled={!isAllComplete}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold font-display uppercase tracking-wider text-lg rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
        >
          <span>Lock In Lineups &amp; Start 60-Minute Training Timer</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
