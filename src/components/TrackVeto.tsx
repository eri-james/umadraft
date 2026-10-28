import React, { useState } from 'react';
import { Ban, ArrowRight, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import { Track } from '../types/draft';
import { sound } from '../utils/audio';

interface TrackVetoProps {
  team1Name: string;
  team2Name: string;
  team1Color: string;
  team2Color: string;
  picksTeam1: Track[];
  picksTeam2: Track[];
  tiebreakerTrack: Track | null;
  onConfirmVetoes: (
    veto1: Track,
    veto2: Track,
    finalOrderedTracks: Track[]
  ) => void;
}

export const TrackVeto: React.FC<TrackVetoProps> = ({
  team1Name,
  team2Name,
  team1Color,
  team2Color,
  picksTeam1,
  picksTeam2,
  tiebreakerTrack,
  onConfirmVetoes,
}) => {
  // Team 1 vetoes 1 of Team 2's tracks
  const [veto1, setVeto1] = useState<Track | null>(null);
  // Team 2 vetoes 1 of Team 1's tracks
  const [veto2, setVeto2] = useState<Track | null>(null);

  const handleSelectVeto1 = (track: Track) => {
    sound.playVeto();
    setVeto1(track);
  };

  const handleSelectVeto2 = (track: Track) => {
    sound.playVeto();
    setVeto2(track);
  };

  // Compile final ordered race tracks:
  // Interleaving the remaining picks in their drafted order
  const getFinalTracks = (): Track[] => {
    if (!veto1 || !veto2) return [];
    const remaining1 = picksTeam1.filter(t => t.id !== veto2.id);
    const remaining2 = picksTeam2.filter(t => t.id !== veto1.id);

    const ordered: Track[] = [];
    const maxLen = Math.max(remaining1.length, remaining2.length);
    for (let i = 0; i < maxLen; i++) {
      if (remaining1[i]) ordered.push(remaining1[i]);
      if (remaining2[i]) ordered.push(remaining2[i]);
    }
    return ordered;
  };

  const finalTracks = getFinalTracks();
  const readyToProceed = veto1 !== null && veto2 !== null;

  const handleProceed = () => {
    if (!veto1 || !veto2) return;
    sound.playLockIn();
    onConfirmVetoes(veto1, veto2, finalTracks);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider">
          <Ban className="w-3.5 h-3.5" />
          <span>Stage 4 · Track Veto Phase</span>
        </div>
        <h2 className="text-3xl font-extrabold font-display uppercase tracking-tight text-white">
          Eliminate Opponent Tracks
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Each team chooses exactly 1 track from the opposing team's selections to veto. The remaining tracks will form the final match racing schedule in order of picks.
        </p>
      </div>

      {/* Veto Selection Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Team 1 strikes a track from Team 2's choices */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: team1Color }} />
              <div>
                <h3 className="font-display font-bold text-white uppercase text-base tracking-wide">
                  {team1Name}'s Veto
                </h3>
                <span className="text-[11px] text-slate-400">
                  Select 1 track to ban from {team2Name}'s picks:
                </span>
              </div>
            </div>
            {veto1 && (
              <span className="text-xs text-rose-400 font-semibold uppercase flex items-center gap-1">
                <Ban className="w-3.5 h-3.5" /> Veto Selected
              </span>
            )}
          </div>

          <div className="space-y-2">
            {picksTeam2.map((track) => {
              const isVetoed = veto1?.id === track.id;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleSelectVeto1(track)}
                  className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isVetoed
                      ? 'bg-rose-950/40 border-rose-600 ring-1 ring-rose-600'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className={`font-semibold text-xs block ${isVetoed ? 'line-through text-rose-300' : 'text-slate-200'}`}>
                      {track.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {track.surface} · {track.distance} · {track.lengthMeters}m · {track.prefecture}
                    </span>
                  </div>

                  <div className="shrink-0 ml-2">
                    {isVetoed ? (
                      <span className="px-2 py-0.5 bg-rose-600 text-white font-bold text-[10px] uppercase rounded">
                        VETOED
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 hover:text-rose-400 uppercase font-mono">
                        Click to Veto
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Team 2 strikes a track from Team 1's choices */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: team2Color }} />
              <div>
                <h3 className="font-display font-bold text-white uppercase text-base tracking-wide">
                  {team2Name}'s Veto
                </h3>
                <span className="text-[11px] text-slate-400">
                  Select 1 track to ban from {team1Name}'s picks:
                </span>
              </div>
            </div>
            {veto2 && (
              <span className="text-xs text-rose-400 font-semibold uppercase flex items-center gap-1">
                <Ban className="w-3.5 h-3.5" /> Veto Selected
              </span>
            )}
          </div>

          <div className="space-y-2">
            {picksTeam1.map((track) => {
              const isVetoed = veto2?.id === track.id;
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => handleSelectVeto2(track)}
                  className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                    isVetoed
                      ? 'bg-rose-950/40 border-rose-600 ring-1 ring-rose-600'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className={`font-semibold text-xs block ${isVetoed ? 'line-through text-rose-300' : 'text-slate-200'}`}>
                      {track.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {track.surface} · {track.distance} · {track.lengthMeters}m · {track.prefecture}
                    </span>
                  </div>

                  <div className="shrink-0 ml-2">
                    {isVetoed ? (
                      <span className="px-2 py-0.5 bg-rose-600 text-white font-bold text-[10px] uppercase rounded">
                        VETOED
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 hover:text-rose-400 uppercase font-mono">
                        Click to Veto
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Final Race Schedule Preview */}
      {readyToProceed && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-display font-bold text-white uppercase text-base tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Final Match Racing Schedule ({finalTracks.length} Rounds)
            </h3>
            <span className="text-xs text-slate-400 font-mono">Ordered By Picks</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {finalTracks.map((track, idx) => (
              <div key={track.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                <span className="text-[10px] text-amber-400 font-mono font-bold uppercase block">
                  Round {idx + 1}
                </span>
                <h4 className="font-semibold text-slate-200 truncate">{track.name}</h4>
                <div className="text-[10px] text-slate-400">
                  {track.surface} · {track.distance}
                </div>
              </div>
            ))}
          </div>

          {tiebreakerTrack && (
            <div className="bg-amber-950/20 border border-amber-800/40 rounded-lg p-3 text-xs flex items-center justify-between">
              <span className="text-amber-400 font-semibold">
                Round {finalTracks.length + 1} Standby Tiebreaker Track: {tiebreakerTrack.name} ({tiebreakerTrack.surface} · {tiebreakerTrack.distance})
              </span>
              <span className="text-[11px] text-slate-400">Only raced if score is tied after Round {finalTracks.length}</span>
            </div>
          )}
        </div>
      )}

      {/* Confirm Button */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={handleProceed}
          disabled={!readyToProceed}
          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold font-display uppercase tracking-wider text-base rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
        >
          <span>Lock In Race Schedule &amp; Begin Uma Drafting</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
