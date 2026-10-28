import React, { useState } from 'react';
import { Ban, ArrowRight, ShieldCheck } from 'lucide-react';
import { Umamusume } from '../types/draft';
import { sound } from '../utils/audio';
import { UmaCard } from './UmaCard';

interface UmaVetoProps {
  team1Name: string;
  team2Name: string;
  team1Color: string;
  team2Color: string;
  picksTeam1: Umamusume[];
  picksTeam2: Umamusume[];
  onConfirmUmaVetoes: (veto1: Umamusume, veto2: Umamusume) => void;
}

export const UmaVeto: React.FC<UmaVetoProps> = ({
  team1Name,
  team2Name,
  team1Color,
  team2Color,
  picksTeam1,
  picksTeam2,
  onConfirmUmaVetoes,
}) => {
  // Team 1 strikes 1 of Team 2's umas
  const [veto1, setVeto1] = useState<Umamusume | null>(null);
  // Team 2 strikes 1 of Team 1's umas
  const [veto2, setVeto2] = useState<Umamusume | null>(null);

  const handleSelectVeto1 = (uma: Umamusume) => {
    sound.playVeto();
    setVeto1(uma);
  };

  const handleSelectVeto2 = (uma: Umamusume) => {
    sound.playVeto();
    setVeto2(uma);
  };

  const readyToProceed = veto1 !== null && veto2 !== null;

  const handleProceed = () => {
    if (!veto1 || !veto2) return;
    sound.playLockIn();
    onConfirmUmaVetoes(veto1, veto2);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider">
          <Ban className="w-3.5 h-3.5" />
          <span>Stage 7 · Mid-Draft Uma Veto</span>
        </div>
        <h2 className="text-3xl font-extrabold font-display uppercase tracking-tight text-white">
          Veto 1 Opponent Umamusume
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Both teams got their initial core draft. Now strike out 1 crucial ace from the opponent's roster before moving to the secondary reserve pick phase.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Team 1 strikes from Team 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: team1Color }} />
              <div>
                <h3 className="font-display font-bold text-white uppercase text-base tracking-wide">
                  {team1Name}'s Strike
                </h3>
                <span className="text-[11px] text-slate-400">
                  Select 1 Uma to veto from {team2Name}:
                </span>
              </div>
            </div>
            {veto1 && (
              <span className="text-xs text-rose-400 font-semibold uppercase flex items-center gap-1">
                <Ban className="w-3.5 h-3.5" /> Target Locked
              </span>
            )}
          </div>

          <div className="space-y-2">
            {picksTeam2.map((uma) => {
              const isVetoed = veto1?.id === uma.id;
              return (
                <UmaCard
                  key={uma.id}
                  uma={uma}
                  compact
                  isVetoed={isVetoed}
                  isSelected={isVetoed}
                  onClick={() => handleSelectVeto1(uma)}
                />
              );
            })}
          </div>
        </div>

        {/* Right: Team 2 strikes from Team 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: team2Color }} />
              <div>
                <h3 className="font-display font-bold text-white uppercase text-base tracking-wide">
                  {team2Name}'s Strike
                </h3>
                <span className="text-[11px] text-slate-400">
                  Select 1 Uma to veto from {team1Name}:
                </span>
              </div>
            </div>
            {veto2 && (
              <span className="text-xs text-rose-400 font-semibold uppercase flex items-center gap-1">
                <Ban className="w-3.5 h-3.5" /> Target Locked
              </span>
            )}
          </div>

          <div className="space-y-2">
            {picksTeam1.map((uma) => {
              const isVetoed = veto2?.id === uma.id;
              return (
                <UmaCard
                  key={uma.id}
                  uma={uma}
                  compact
                  isVetoed={isVetoed}
                  isSelected={isVetoed}
                  onClick={() => handleSelectVeto2(uma)}
                />
              );
            })}
          </div>
        </div>
      </div>

      {readyToProceed && (
        <div className="bg-slate-950 border border-emerald-900/50 rounded-xl p-4 text-center text-xs text-slate-300 space-y-1 animate-in fade-in duration-200">
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Both Vetoes Confirmed</span>
          </div>
          <p className="text-slate-400">
            Next, each team will draft 2 additional umas in the Reserve Phase to bring their total team pool to 6 umas.
          </p>
        </div>
      )}

      <div className="text-center pt-2">
        <button
          type="button"
          onClick={handleProceed}
          disabled={!readyToProceed}
          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold font-display uppercase tracking-wider text-base rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
        >
          <span>Proceed to Reserve Picks (+2 Umas)</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
