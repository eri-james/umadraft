import React from 'react';
import { X, Trophy, MapPin, Users, Sparkles, ExternalLink } from 'lucide-react';
import { FullMatchState, Umamusume } from '../types/draft';

interface CasterOverlayModalProps {
  state: FullMatchState;
  allUmasMap: Map<string, Umamusume>;
  onClose: () => void;
}

export const CasterOverlayModal: React.FC<CasterOverlayModalProps> = ({
  state,
  allUmasMap,
  onClose,
}) => {
  const { config, phase, finalTracks, tiebreakerTrack, playersTeam1, playersTeam2, raceResults } = state;

  const currentRound = raceResults.length + 1;
  const currentTrack = finalTracks[raceResults.length] || tiebreakerTrack;
  const currentScore1 = raceResults.length > 0 ? raceResults[raceResults.length - 1].runningTotalTeam1 : 0;
  const currentScore2 = raceResults.length > 0 ? raceResults[raceResults.length - 1].runningTotalTeam2 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-xl transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Caster Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Broadcast Stream Overlay (Caster View)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white">
            {config.team1Name} vs {config.team2Name}
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Format: {config.teamSize}v{config.teamSize} · Target: {config.targetPoints} Points · Phase: {phase}
          </p>
        </div>

        {/* Live Score Strip */}
        <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center font-mono-numbers">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block font-sans">
              {config.team1Name}
            </span>
            <span className="text-4xl sm:text-5xl font-black text-white">{currentScore1}</span>
            <span className="text-[10px] text-slate-500 block">points</span>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block font-sans">
              {config.team2Name}
            </span>
            <span className="text-4xl sm:text-5xl font-black text-white">{currentScore2}</span>
            <span className="text-[10px] text-slate-500 block">points</span>
          </div>
        </div>

        {/* Active Race Track Card if in Match */}
        {currentTrack && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                Race Stage {currentRound} of {finalTracks.length}
              </span>
              <h3 className="text-lg font-bold text-white uppercase font-display">
                {currentTrack.name}
              </h3>
              <p className="text-xs text-slate-400">
                {currentTrack.course} · {currentTrack.surface} · {currentTrack.distance} · {currentTrack.lengthMeters}m
              </p>
            </div>

            <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
              Direction: <strong className="text-white">{currentTrack.direction}</strong>
            </div>
          </div>
        )}

        {/* Rosters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Team 1 */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-blue-400 uppercase tracking-wider border-b border-slate-800 pb-1">
              {config.team1Name} Lineup
            </h4>
            <div className="space-y-2">
              {playersTeam1.map((p, i) => {
                const uma = p.assignedUmaId ? allUmasMap.get(p.assignedUmaId) : null;
                return (
                  <div key={p.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono text-slate-500 mr-2">P{i + 1}</span>
                      <strong className="text-white">{p.name}</strong>
                    </div>
                    <span className="text-slate-300 font-medium">
                      {uma ? uma.name : 'Unassigned'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team 2 */}
          <div className="space-y-3">
            <h4 className="font-display font-bold text-sm text-rose-400 uppercase tracking-wider border-b border-slate-800 pb-1">
              {config.team2Name} Lineup
            </h4>
            <div className="space-y-2">
              {playersTeam2.map((p, i) => {
                const uma = p.assignedUmaId ? allUmasMap.get(p.assignedUmaId) : null;
                return (
                  <div key={p.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono text-slate-500 mr-2">P{i + 1}</span>
                      <strong className="text-white">{p.name}</strong>
                    </div>
                    <span className="text-slate-300 font-medium">
                      {uma ? uma.name : 'Unassigned'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-500">
            Press ESC or click close to return to the Match Director console.
          </p>
        </div>
      </div>
    </div>
  );
};
