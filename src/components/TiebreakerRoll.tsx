import React, { useState } from 'react';
import { Dices, MapPin, Compass, ArrowRight, Sparkles } from 'lucide-react';
import { Track } from '../types/draft';
import { ALL_TRACKS } from '../data/tracks';
import { sound } from '../utils/audio';

interface TiebreakerRollProps {
  onConfirmTiebreaker: (track: Track) => void;
}

export const TiebreakerRoll: React.FC<TiebreakerRollProps> = ({ onConfirmTiebreaker }) => {
  const [rolling, setRolling] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [highlightTrack, setHighlightTrack] = useState<Track>(ALL_TRACKS[0]);

  const handleRoll = () => {
    if (rolling) return;
    setRolling(true);
    setSelectedTrack(null);

    let counter = 0;
    const totalTicks = 24;
    const intervalTime = 65;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * ALL_TRACKS.length);
      setHighlightTrack(ALL_TRACKS[randomIndex]);
      sound.playRollClick();
      counter++;

      if (counter >= totalTicks) {
        clearInterval(interval);
        const finalTrack = ALL_TRACKS[Math.floor(Math.random() * ALL_TRACKS.length)];
        setHighlightTrack(finalTrack);
        setSelectedTrack(finalTrack);
        setRolling(false);
        sound.playLockIn();
      }
    }, intervalTime);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 text-center">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Stage 1 · Track Randomizer</span>
        </div>
        <h2 className="text-3xl font-extrabold font-display uppercase tracking-tight text-white">
          Roll The Tiebreaker Course
        </h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Every tournament match begins by rolling an official Japanese course. This track stands as the decider if teams remain tied after all main race stages.
        </p>
      </div>

      {/* Course Showcase Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl transition-all">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="px-2.5 py-1 bg-slate-950 text-slate-300 border border-slate-800 rounded-md flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {highlightTrack.prefecture} Prefecture · {highlightTrack.course}
            </span>
            <span className={`px-2.5 py-1 rounded-md font-semibold ${
              highlightTrack.surface === 'Turf' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80' : 'bg-amber-950/80 text-amber-400 border border-amber-800/80'
            }`}>
              {highlightTrack.surface}
            </span>
            <span className="px-2.5 py-1 bg-slate-950 text-blue-400 border border-slate-800 rounded-md font-semibold">
              {highlightTrack.distance}
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-wide uppercase">
              {highlightTrack.name}
            </h3>
            <p className="text-sm font-medium text-slate-400">
              {highlightTrack.nameJp} · {highlightTrack.lengthMeters}m
            </p>
          </div>

          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed italic bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
            "{highlightTrack.description}"
          </p>

          <div className="flex items-center justify-center gap-4 text-xs text-slate-400 font-mono-numbers">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-slate-500" />
              Direction: <strong className="text-slate-300 font-sans">{highlightTrack.direction}</strong>
            </span>
            <span>·</span>
            <span>Course Length: <strong className="text-slate-300">{highlightTrack.lengthMeters}m</strong></span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          type="button"
          onClick={handleRoll}
          disabled={rolling}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl border border-slate-700 transition-all cursor-pointer shadow-md"
        >
          <Dices className={`w-4 h-4 text-amber-400 ${rolling ? 'animate-spin' : ''}`} />
          {rolling ? 'Rolling Racecourses...' : selectedTrack ? 'Re-roll Course' : 'Roll Tiebreaker Course'}
        </button>

        {selectedTrack && !rolling && (
          <button
            type="button"
            onClick={() => {
              sound.playLockIn();
              onConfirmTiebreaker(selectedTrack);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold font-display uppercase tracking-wider text-base rounded-xl transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <span>Confirm &amp; Proceed to Coin Flip</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
};
