import React, { useState } from 'react';
import { Search, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { Umamusume, TeamSize, TrackDistance, RunningStyle } from '../types/draft';
import { ALL_UMAS } from '../data/umas';
import { getFormatRules, getSnakePickSequence } from '../utils/rules';
import { sound } from '../utils/audio';
import { UmaCard } from './UmaCard';

interface UmaDraftProps {
  teamSize: TeamSize;
  team1Name: string;
  team2Name: string;
  team1Color: string;
  team2Color: string;
  umaPriorityTeam: 1 | 2;
  preBansTeam1: Umamusume[];
  preBansTeam2: Umamusume[];
  onCompleteUmaDraft: (picks1: Umamusume[], picks2: Umamusume[]) => void;
}

export const UmaDraft: React.FC<UmaDraftProps> = ({
  teamSize,
  team1Name,
  team2Name,
  team1Color,
  team2Color,
  umaPriorityTeam,
  preBansTeam1,
  preBansTeam2,
  onCompleteUmaDraft,
}) => {
  const rules = getFormatRules(teamSize);
  const picksPerTeam = rules.umaDraftPicksPerTeam;
  const snakeSequence = getSnakePickSequence(umaPriorityTeam, picksPerTeam);

  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [picksTeam1, setPicksTeam1] = useState<Umamusume[]>([]);
  const [picksTeam2, setPicksTeam2] = useState<Umamusume[]>([]);
  const [selectedUma, setSelectedUma] = useState<Umamusume | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [distanceFilter, setDistanceFilter] = useState<'ALL' | TrackDistance>('ALL');
  const [strategyFilter, setStrategyFilter] = useState<'ALL' | RunningStyle>('ALL');
  const [surfaceFilter, setSurfaceFilter] = useState<'ALL' | 'Turf' | 'Dirt'>('ALL');

  const isCompleted = currentPickIndex >= snakeSequence.length;
  const activeTeam: 1 | 2 = !isCompleted ? snakeSequence[currentPickIndex] : 1;
  const activeTeamName = activeTeam === 1 ? team1Name : team2Name;
  const activeTeamColor = activeTeam === 1 ? team1Color : team2Color;

  const unavailableIds = new Set([
    ...preBansTeam1.map(u => u.id),
    ...preBansTeam2.map(u => u.id),
    ...picksTeam1.map(u => u.id),
    ...picksTeam2.map(u => u.id),
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
    if (surfaceFilter !== 'ALL') {
      const key = surfaceFilter.toLowerCase() as keyof typeof uma.surfaceAptitude;
      if (uma.surfaceAptitude[key] !== 'A' && uma.surfaceAptitude[key] !== 'S') return false;
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
      setPicksTeam1([...picksTeam1, selectedUma]);
    } else {
      setPicksTeam2([...picksTeam2, selectedUma]);
    }

    setCurrentPickIndex(currentPickIndex + 1);
    setSelectedUma(null);
  };

  const handleFinish = () => {
    sound.playLockIn();
    onCompleteUmaDraft(picksTeam1, picksTeam2);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Snake Turn Banner */}
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
                  ? 'Main Snake Draft Complete'
                  : `Snake Pick ${currentPickIndex + 1} of ${snakeSequence.length} · Round ${Math.floor(currentPickIndex / 2) + 1}`}
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-wide">
                {isCompleted ? 'All Main Umas Drafted!' : `${activeTeamName}'s Turn to Draft Uma`}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono-numbers">
            <span className="text-blue-400 font-semibold">{team1Name}: {picksTeam1.length}/{picksPerTeam}</span>
            <span>·</span>
            <span className="text-rose-400 font-semibold">{team2Name}: {picksTeam2.length}/{picksPerTeam}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Team 1 Roster | Browser | Team 2 Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Team 1 Roster */}
        <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team1Color }} />
              <h3 className="font-display font-bold text-white uppercase tracking-wide truncate max-w-[140px]">
                {team1Name}
              </h3>
            </div>
            <span className="text-xs font-mono-numbers text-slate-400">
              {picksTeam1.length}/{picksPerTeam}
            </span>
          </div>

          <div className="space-y-2">
            {Array.from({ length: picksPerTeam }).map((_, i) => {
              const uma = picksTeam1[i];
              return uma ? (
                <UmaCard key={uma.id} uma={uma} compact />
              ) : (
                <div
                  key={i}
                  className="p-3 rounded-lg border border-dashed border-slate-800 bg-slate-950/40 text-center text-xs text-slate-600 italic"
                >
                  Pick #{i + 1} Pending
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Character Browser */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Umamusume (e.g. Teio, Rudolf, Gold Ship, McQueen)..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Filter buttons */}
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

          {/* Action Bar for Active Pick */}
          {selectedUma && !isCompleted && (
            <div className="bg-slate-950 border border-amber-500/60 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
              <div className="text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block">
                  Confirm Pick for {activeTeamName}
                </span>
                <span className="text-base font-display font-bold text-white uppercase">
                  Draft {selectedUma.name}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLockInPick}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-display uppercase tracking-wider text-sm rounded-lg shadow-md transition-all cursor-pointer"
              >
                Lock In Uma Pick
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
                <span>Proceed to Uma Veto Phase</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Team 2 Roster */}
        <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team2Color }} />
              <h3 className="font-display font-bold text-white uppercase tracking-wide truncate max-w-[140px]">
                {team2Name}
              </h3>
            </div>
            <span className="text-xs font-mono-numbers text-slate-400">
              {picksTeam2.length}/{picksPerTeam}
            </span>
          </div>

          <div className="space-y-2">
            {Array.from({ length: picksPerTeam }).map((_, i) => {
              const uma = picksTeam2[i];
              return uma ? (
                <UmaCard key={uma.id} uma={uma} compact />
              ) : (
                <div
                  key={i}
                  className="p-3 rounded-lg border border-dashed border-slate-800 bg-slate-950/40 text-center text-xs text-slate-600 italic"
                >
                  Pick #{i + 1} Pending
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
