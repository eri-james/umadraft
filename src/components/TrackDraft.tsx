import React, { useState } from 'react';
import { Search, MapPin, Compass, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Track, TrackDistance, TrackSurface, TeamSize } from '../types/draft';
import { ALL_TRACKS } from '../data/tracks';
import { getFormatRules, canPickTrackDistance, getTrackPickSequence } from '../utils/rules';
import { sound } from '../utils/audio';

interface TrackDraftProps {
  teamSize: TeamSize;
  team1Name: string;
  team2Name: string;
  team1Color: string;
  team2Color: string;
  priorityTeam: 1 | 2;
  tiebreakerTrack: Track | null;
  onCompleteTrackDraft: (picks1: Track[], picks2: Track[]) => void;
}

export const TrackDraft: React.FC<TrackDraftProps> = ({
  teamSize,
  team1Name,
  team2Name,
  team1Color,
  team2Color,
  priorityTeam,
  tiebreakerTrack,
  onCompleteTrackDraft,
}) => {
  const rules = getFormatRules(teamSize);
  const pickSequence = getTrackPickSequence(priorityTeam, rules.tracksPerTeam);

  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [picksTeam1, setPicksTeam1] = useState<Track[]>([]);
  const [picksTeam2, setPicksTeam2] = useState<Track[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [distanceFilter, setDistanceFilter] = useState<'ALL' | TrackDistance>('ALL');
  const [surfaceFilter, setSurfaceFilter] = useState<'ALL' | TrackSurface>('ALL');

  const isCompleted = currentPickIndex >= pickSequence.length;
  const activeTeam: 1 | 2 = !isCompleted ? pickSequence[currentPickIndex] : 1;
  const activeTeamName = activeTeam === 1 ? team1Name : team2Name;
  const activeTeamColor = activeTeam === 1 ? team1Color : team2Color;
  const activeTeamPicks = activeTeam === 1 ? picksTeam1 : picksTeam2;

  // Track availability
  const pickedTrackIds = new Set([
    ...(tiebreakerTrack ? [tiebreakerTrack.id] : []),
    ...picksTeam1.map(t => t.id),
    ...picksTeam2.map(t => t.id),
  ]);

  const filteredTracks = ALL_TRACKS.filter((track) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        track.name.toLowerCase().includes(q) ||
        track.nameJp.toLowerCase().includes(q) ||
        track.course.toLowerCase().includes(q) ||
        track.prefecture.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (distanceFilter !== 'ALL' && track.distance !== distanceFilter) return false;
    if (surfaceFilter !== 'ALL' && track.surface !== surfaceFilter) return false;
    return true;
  });

  const getDistanceCount = (picks: Track[], dist: TrackDistance) => {
    return picks.filter(t => t.distance === dist).length;
  };

  const handleSelectTrack = (track: Track) => {
    if (pickedTrackIds.has(track.id)) return;
    const canPick = canPickTrackDistance(activeTeamPicks, track.distance, rules.maxTracksPerDistance);
    if (!canPick) {
      sound.playBeep();
      return;
    }
    sound.playSelect();
    setSelectedTrack(track);
  };

  const handleLockIn = () => {
    if (!selectedTrack || isCompleted) return;
    sound.playLockIn();

    if (activeTeam === 1) {
      const nextPicks = [...picksTeam1, selectedTrack];
      setPicksTeam1(nextPicks);
    } else {
      const nextPicks = [...picksTeam2, selectedTrack];
      setPicksTeam2(nextPicks);
    }

    const nextIndex = currentPickIndex + 1;
    setCurrentPickIndex(nextIndex);
    setSelectedTrack(null);
  };

  const handleFinish = () => {
    sound.playLockIn();
    onCompleteTrackDraft(picksTeam1, picksTeam2);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Turn & Distance Limit Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-3.5 h-10 rounded-full shrink-0"
              style={{ backgroundColor: isCompleted ? '#10b981' : activeTeamColor }}
            />
            <div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                {isCompleted
                  ? 'Track Selection Complete'
                  : `Track Pick ${currentPickIndex + 1} of ${pickSequence.length}`}
              </span>
              <h2 className="text-xl sm:text-2xl font-display font-black text-white uppercase tracking-wide">
                {isCompleted ? 'All Tracks Selected!' : `${activeTeamName}'s Turn to Pick Track`}
              </h2>
            </div>
          </div>

          {/* Distance quota matrix for active team */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              {activeTeamName} Limits:
            </span>
            {(['Sprint', 'Mile', 'Medium', 'Long'] as TrackDistance[]).map((dist) => {
              const count = getDistanceCount(activeTeamPicks, dist);
              const maxed = count >= rules.maxTracksPerDistance;
              return (
                <div
                  key={dist}
                  className={`px-2.5 py-1 rounded-md border font-mono-numbers text-[11px] ${
                    maxed
                      ? 'bg-rose-950/60 border-rose-800/70 text-rose-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <span>{dist}: </span>
                  <strong>{count}/{rules.maxTracksPerDistance}</strong>
                  {maxed && <span className="ml-1 text-[9px] uppercase tracking-wider">FULL</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Drafting Grid: Left Team 1 | Center Browser | Right Team 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Team 1 Picks Column */}
        <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team1Color }} />
              <h3 className="font-display font-bold text-white uppercase tracking-wide truncate max-w-[140px]">
                {team1Name}
              </h3>
            </div>
            <span className="text-xs font-mono-numbers text-slate-400">
              {picksTeam1.length}/{rules.tracksPerTeam}
            </span>
          </div>

          <div className="space-y-2">
            {Array.from({ length: rules.tracksPerTeam }).map((_, i) => {
              const track = picksTeam1[i];
              return (
                <div
                  key={i}
                  className={`p-2.5 rounded-lg border text-xs transition-all ${
                    track
                      ? 'bg-slate-950 border-blue-900/50 text-white'
                      : 'bg-slate-950/40 border-dashed border-slate-800 text-slate-600'
                  }`}
                >
                  {track ? (
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-slate-200 truncate">{track.name}</span>
                        <span className="text-[10px] text-blue-400 font-mono shrink-0">{track.distance}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
                        <span>{track.surface} · {track.lengthMeters}m</span>
                        <span>{track.prefecture}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="italic">Track Pick #{i + 1} Empty</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Track Browser & Selection */}
        <div className="lg:col-span-6 space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by track name, prefecture, or course (e.g., Tokyo, Nakayama, Dirt)..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              {/* Distance filter tabs */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded-md">
                {(['ALL', 'Sprint', 'Mile', 'Medium', 'Long'] as const).map((dist) => (
                  <button
                    key={dist}
                    type="button"
                    onClick={() => {
                      setDistanceFilter(dist);
                      sound.playSelect();
                    }}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                      distanceFilter === dist
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {dist}
                  </button>
                ))}
              </div>

              {/* Surface filter tabs */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded-md">
                {(['ALL', 'Turf', 'Dirt'] as const).map((surf) => (
                  <button
                    key={surf}
                    type="button"
                    onClick={() => {
                      setSurfaceFilter(surf);
                      sound.playSelect();
                    }}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                      surfaceFilter === surf
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {surf}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Track Selection Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
            {filteredTracks.map((track) => {
              const isPicked = pickedTrackIds.has(track.id);
              const isTiebreaker = tiebreakerTrack?.id === track.id;
              const isSelected = selectedTrack?.id === track.id;
              const canPickDistance = canPickTrackDistance(
                activeTeamPicks,
                track.distance,
                rules.maxTracksPerDistance
              );
              const disabled = isPicked || (!isCompleted && !canPickDistance);

              return (
                <button
                  key={track.id}
                  type="button"
                  disabled={disabled || isCompleted}
                  onClick={() => handleSelectTrack(track)}
                  className={`text-left p-3.5 rounded-xl border transition-all relative cursor-pointer ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500'
                      : isPicked
                      ? 'bg-slate-950/60 border-slate-800 opacity-40 cursor-not-allowed'
                      : !canPickDistance && !isCompleted
                      ? 'bg-slate-950/40 border-slate-800 opacity-60 cursor-not-allowed'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-display font-bold text-sm text-white uppercase tracking-wide">
                        {track.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">{track.nameJp}</p>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase shrink-0 ${
                        track.surface === 'Turf'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                          : 'bg-amber-950 text-amber-400 border border-amber-800/80'
                      }`}
                    >
                      {track.surface}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/60 font-mono-numbers">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {track.prefecture}
                    </span>
                    <span className="text-blue-400 font-semibold">{track.distance}</span>
                    <span>{track.lengthMeters}m</span>
                  </div>

                  {isTiebreaker && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-amber-500 text-slate-950 text-[9px] font-extrabold uppercase rounded shadow">
                      Tiebreaker
                    </div>
                  )}

                  {!canPickDistance && !isPicked && !isCompleted && (
                    <div className="mt-2 text-[10px] text-rose-400 font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>{track.distance} distance maxed ({rules.maxTracksPerDistance}/{rules.maxTracksPerDistance})</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Action bar for active selection */}
          {selectedTrack && !isCompleted && (
            <div className="bg-slate-950 border border-amber-500/60 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in duration-200 shadow-xl">
              <div className="text-left">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block">
                  Confirm Selected Track for {activeTeamName}
                </span>
                <span className="text-base font-display font-bold text-white uppercase">
                  {selectedTrack.name} ({selectedTrack.surface} · {selectedTrack.distance})
                </span>
              </div>

              <button
                type="button"
                onClick={handleLockIn}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-display uppercase tracking-wider text-sm rounded-lg shadow-md transition-all cursor-pointer"
              >
                Lock In Track Pick
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
                <span>Proceed to Track Veto Phase</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Team 2 Picks Column */}
        <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: team2Color }} />
              <h3 className="font-display font-bold text-white uppercase tracking-wide truncate max-w-[140px]">
                {team2Name}
              </h3>
            </div>
            <span className="text-xs font-mono-numbers text-slate-400">
              {picksTeam2.length}/{rules.tracksPerTeam}
            </span>
          </div>

          <div className="space-y-2">
            {Array.from({ length: rules.tracksPerTeam }).map((_, i) => {
              const track = picksTeam2[i];
              return (
                <div
                  key={i}
                  className={`p-2.5 rounded-lg border text-xs transition-all ${
                    track
                      ? 'bg-slate-950 border-rose-900/50 text-white'
                      : 'bg-slate-950/40 border-dashed border-slate-800 text-slate-600'
                  }`}
                >
                  {track ? (
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-slate-200 truncate">{track.name}</span>
                        <span className="text-[10px] text-rose-400 font-mono shrink-0">{track.distance}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
                        <span>{track.surface} · {track.lengthMeters}m</span>
                        <span>{track.prefecture}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="italic">Track Pick #{i + 1} Empty</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
