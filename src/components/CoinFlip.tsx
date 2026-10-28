import React, { useState } from 'react';
import { CircleDot, ArrowRight, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface CoinFlipProps {
  team1Name: string;
  team2Name: string;
  team1Color: string;
  team2Color: string;
  onConfirmPriority: (priorityTeam: 1 | 2) => void;
}

export const CoinFlip: React.FC<CoinFlipProps> = ({
  team1Name,
  team2Name,
  team1Color,
  team2Color,
  onConfirmPriority,
}) => {
  const [flipping, setFlipping] = useState(false);
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [rotation, setRotation] = useState(0);

  const handleFlip = () => {
    if (flipping) return;
    setFlipping(true);
    setWinner(null);
    sound.playCoinFlip();

    const result: 1 | 2 = Math.random() < 0.5 ? 1 : 2;
    // 5 to 7 full rotations plus final landing side
    const additionalTurns = 5 * 360 + (result === 1 ? 0 : 180);
    setRotation((prev) => prev + additionalTurns);

    setTimeout(() => {
      setWinner(result);
      setFlipping(false);
      sound.playLockIn();
    }, 1100);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8 text-center">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Stage 2 · Priority Coin Toss</span>
        </div>
        <h2 className="text-3xl font-extrabold font-display uppercase tracking-tight text-white">
          Coin Toss For Priority
        </h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          The coin flip determines who drafts the first race track. The other team will automatically receive 1st priority in the subsequent Uma Drafting phase.
        </p>
      </div>

      {/* Visual Coin & Arena */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[320px]">
        {/* Coin representation */}
        <div className="relative w-36 h-36 mb-6 [perspective:1000px]">
          <div
            className="w-full h-full rounded-full relative transition-transform duration-1000 [transform-style:preserve-3d] shadow-2xl shadow-amber-500/10"
            style={{ transform: `rotateY(${rotation}deg)` }}
          >
            {/* Front: Team 1 */}
            <div
              className="absolute inset-0 rounded-full border-4 border-amber-300 flex flex-col items-center justify-center p-3 text-center [backface-visibility:hidden]"
              style={{ backgroundColor: team1Color }}
            >
              <CircleDot className="w-6 h-6 text-amber-300 mb-1" />
              <span className="font-display font-extrabold text-sm uppercase text-white truncate max-w-[100px] leading-tight">
                {team1Name}
              </span>
              <span className="text-[10px] text-amber-200 font-bold uppercase tracking-wider">SIDE 1</span>
            </div>

            {/* Back: Team 2 */}
            <div
              className="absolute inset-0 rounded-full border-4 border-amber-300 flex flex-col items-center justify-center p-3 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]"
              style={{ backgroundColor: team2Color }}
            >
              <CircleDot className="w-6 h-6 text-amber-300 mb-1" />
              <span className="font-display font-extrabold text-sm uppercase text-white truncate max-w-[100px] leading-tight">
                {team2Name}
              </span>
              <span className="text-[10px] text-amber-200 font-bold uppercase tracking-wider">SIDE 2</span>
            </div>
          </div>
        </div>

        {/* Status / Announcement */}
        {winner ? (
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="text-xs uppercase font-semibold tracking-wider text-amber-400">
              Coin Toss Decision
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-black uppercase text-white">
              {winner === 1 ? team1Name : team2Name} Won Priority!
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              <strong className="text-white">{winner === 1 ? team1Name : team2Name}</strong> picks 1st in the Track Draft.
              {' '}
              <strong className="text-slate-300">{winner === 1 ? team2Name : team1Name}</strong> will draft 1st in the Uma Phase.
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-500 font-medium">
            {flipping ? 'Coin in mid-air...' : 'Flip the coin to determine track drafting turn order.'}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          type="button"
          onClick={handleFlip}
          disabled={flipping}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl border border-slate-700 transition-all cursor-pointer shadow-md"
        >
          <CircleDot className={`w-4 h-4 text-amber-400 ${flipping ? 'animate-spin' : ''}`} />
          {flipping ? 'Flipping...' : winner ? 'Re-flip Coin' : 'Flip Coin'}
        </button>

        {winner && !flipping && (
          <button
            type="button"
            onClick={() => onConfirmPriority(winner)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold font-display uppercase tracking-wider text-base rounded-xl transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <span>Proceed to Track Draft</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
};
