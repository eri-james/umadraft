import React, { useState } from 'react';
import { Search, ArrowRight, PlusCircle, Sparkles } from 'lucide-react';
import { Umamusume, TeamSize, TrackDistance, RunningStyle } from '../types/draft';
import { ALL_UMAS } from '../data/umas';
import { getFormatRules, getSnakePickSequence } from '../utils/rules';
import { sound } from '../utils/audio';
import { UmaCard } from './UmaCard';

interface UmaReserveProps {
  teamSize: TeamSize;
  team1Name: string;
  team2Name: string;
  team1Color: string;
  team2Color: string;
  umaPriorityTeam: 1 | 2;
  existingPoolTeam1: Umamusume[]; // The remaining umas after veto
  existingPoolTeam2: Umamusume[];
  allUsedUmaIds: Set<string>;
  onCompleteReserves: (
    reserves1: Umamusume[],
    reserves2: Umamusume[]
  ) => void;
}

export const UmaReserve: React.FC<UmaReserveProps> = ({
  teamSize,
  team1Name,
  team2Name,
  team1Color,
  team2Color,
  umaPriorityTeam,
  existingPoolTeam1,
  existingPoolTeam2,
  allUsedUmaIds,
  onCompleteReserves,
}) => {
  const rules = getFormatRules(teamSize);
  const reservePicksCount = rules.umaReservePicksPerTeam; // 2 each
  const reserveSequence = getSnakePickSequence(umaPriorityTeam, reservePicksCount);

  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [reserves1, setReserves1] = useState<Umamusume[]>([]);
  const [reserves2, setReserves2] = useState<Umamusume[]>([]);
  const [selectedUma, setSelectedUma] = useState<Umamusume | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [distanceFilter, setDistanceFilter] = useState<'ALL' | TrackDistance>('ALL');
  const [strategyFilter, setStrategyFilter] = useState<'ALL' | RunningStyle>('ALL');

  const isCompleted = currentPickIndex >= reserveSequence.length;
  const activeTeam: 1 | 2 = !isCompleted ? reserveSequence[currentPickIndex] : 1;
  const activeTeamName = activeTeam === 1 ? team1Name : team2Name;
  const activeTeamColor = activeTeam === 1 ? team1Color : team2Color;

  const unavailableIds = new Set([
    ...allUsedUmaIds,
    ...reserves1.map(u => u.id),
    ...reserves2.map(u => u.id),
  ]);

  const filteredUmas = ALL_UMAS.filter((uma) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        uma.name.toLowerCase().includes(q) ||
        uma.nameJp.toLowerCase().includes(q) ||
        (uma.epithet && uma.epithet.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (distanceFilter !== 'ALL') {
      const key = distanceFilter.toLowerCase() as keyof typeof uma.distanceAptitude;
      if (uma.distanceAptitude[key] !== 'A' && uma.distanceAptitude[key] !== 'S') return false;
    }
    if (strategyFilter !== 'ALL') {
      const key = strategyFilter.toLowerCase() as keyof typeof uma.strategyAptitude;
      if (uma.strategyAptitude[key] !== 'A' && uma.strategyAptitude[key] !== 'S') return false;
    }
    return true;
  });

  const handleSelectUma = (uma: Umamusume) => {
    if (unavailableIds.has(uma.id) || isCompleted) return;
    sound.playSelect();
    setSelectedUma(uma);
  };

  const handleLockInPick = () => {
    if (!selectedUma || isCompleted) return;
    sound.playLockIn();

    if (activeTeam === 1) {
      setReserves1([...reserves1, selectedUma]);
    } else {
      setReserves2([...reserves2, selectedUma]);
    }

    setCurrentPickIndex(currentPickIndex + 1);
    setSelectedUma(null);
  };

  const handleFinish = () => {
    sound.playLockIn();
    onCompleteReserves(reserves1, reserves2);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-3.5 h-10 rounded-full shrink-0"
              style={{ backgroundColor: isCompleted ? '#10b981' : activeTeamColor }}
            />
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                {isCompleted
                  ? 'Reserve Drafting Complete'
                  : `Reserve Pick ${currentPickIndex + 1} of ${reserveSequence.length}`}
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-wide">
                {isCompleted
                  ? 'All Reserve Umas Drafted!'
                  : `${activeTeamName}'s Turn for Reserve Pick`}
              </h2>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Target: Reach <strong className="text-white">{rules.totalTeamUmaRoster} Umas total</strong> ({rules.activeRosterSize} active + {rules.bluffRosterSize} bluff reserve)
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Team 1 Pool */}
        <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team1Color }} />
              <h3 className="font-display font-bold text-white uppercase tracking-wide truncate max-w-[140px]">
                {team1Name} Pool
              </h3>
            </div>
            <span className="text-xs font-mono-numbers text-slate-400">
              {existingPoolTeam1.length + reserves1.length}/{rules.totalTeamUmaRoster}
            </span>
          </div>

          <div className="space-y-2">
            {/* Existing un-vetoed */}
            {existingPoolTeam1.map(uma => (
              <UmaCard key={uma.id} uma={uma} compact />
            ))}
            {/* Newly drafted reserves */}
            {Array.from({ length: reservePicksCount }).map((_, i) => {
              const res = reserves1[i];
              return res ? (
                <div key={res.id} className="relative">
                  <div className="absolute -top-1.5 -right-1 px-1 bg-amber-500 text-slate-950 font-bold text-[8px] uppercase rounded z-10">
                    Reserve
                  </div>
                  <UmaCard uma={res} compact />
                </div>
              ) : (
                <div
                  key={i}
                  className="p-3 rounded-lg border border-dashed border-slate-800 bg-slate-950/40 text-center text-xs text-slate-600 italic"
                >
                  Reserve #{i + 1} Pending
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Browser */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Umamusume for reserve pick..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded-md">
                {(['ALL', 'Sprint', 'Mile', 'Medium', 'Long'] as const).map((dist) => (
                  <button
                    key={dist}
                    type="button"
                    onClick={() => {
                      setDistanceFilter(dist);
                      sound.playSelect();
                    }}
                    className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                      distanceFilter === dist
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {dist}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded-md">
                {(['ALL', 'Runner', 'Leader', 'Betweener', 'Chaser'] as const).map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => {
                      setStrategyFilter(style);
                      sound.playSelect();
                    }}
                    className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                      strategyFilter === style
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[460px] overflow-y-auto pr-1">
            {filteredUmas.map((uma) => {
              const isUnavailable = unavailableIds.has(uma.id);
              const isSelected = selectedUma?.id === uma.id;
              return (
                <UmaCard
                  key={uma.id}
                  uma={uma}
                  isSelected={isSelected}
                  isBanned={isUnavailable}
                  onClick={() => handleSelectUma(uma)}
                />
              );
            })}
          </div>

          {/* Action Bar */}
          {selectedUma && !isCompleted && (
            <div className="bg-slate-950 border border-amber-500/60 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
              <div className="text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block">
                  Confirm Reserve Pick for {activeTeamName}
                </span>
                <span className="text-base font-display font-bold text-white uppercase">
                  Add {selectedUma.name}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLockInPick}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-display uppercase tracking-wider text-sm rounded-lg shadow-md transition-all cursor-pointer"
              >
                Lock In Reserve Pick
              </button>
            </div>
          )}

          {isCompleted && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleFinish}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold font-display uppercase tracking-wider text-base rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <span>Proceed to Player Assignment &amp; Bluff</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Team 2 Pool */}
        <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team2Color }} />
              <h3 className="font-display font-bold text-white uppercase tracking-wide truncate max-w-[140px]">
                {team2Name} Pool
              </h3>
            </div>
            <span className="text-xs font-mono-numbers text-slate-400">
              {existingPoolTeam2.length + reserves2.length}/{rules.totalTeamUmaRoster}
            </span>
          </div>

          <div className="space-y-2">
            {/* Existing un-vetoed */}
            {existingPoolTeam2.map(uma => (
              <UmaCard key={uma.id} uma={uma} compact />
            ))}
            {/* Newly drafted reserves */}
            {Array.from({ length: reservePicksCount }).map((_, i) => {
              const res = reserves2[i];
              return res ? (
                <div key={res.id} className="relative">
                  <div className="absolute -top-1.5 -right-1 px-1 bg-amber-500 text-slate-950 font-bold text-[8px] uppercase rounded z-10">
                    Reserve
                  </div>
                  <UmaCard uma={res} compact />
                </div>
              ) : (
                <div
                  key={i}
                  className="p-3 rounded-lg border border-dashed border-slate-800 bg-slate-950/40 text-center text-xs text-slate-600 italic"
                >
                  Reserve #{i + 1} Pending
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
