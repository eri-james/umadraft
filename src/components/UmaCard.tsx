import React from 'react';
import { Umamusume, AptitudeGrade } from '../types/draft';

interface UmaCardProps {
  uma: Umamusume;
  isSelected?: boolean;
  isBanned?: boolean;
  isVetoed?: boolean;
  isAssigned?: boolean;
  assignedToPlayer?: string;
  onClick?: () => void;
  compact?: boolean;
}

const GRADE_COLORS: Record<AptitudeGrade, string> = {
  S: 'text-amber-300 font-extrabold',
  A: 'text-emerald-400 font-bold',
  B: 'text-blue-400 font-semibold',
  C: 'text-teal-400 font-medium',
  D: 'text-slate-400 font-normal',
  E: 'text-slate-500 font-normal',
  F: 'text-slate-600 font-normal',
  G: 'text-slate-700 font-light',
};

export const UmaCard: React.FC<UmaCardProps> = ({
  uma,
  isSelected,
  isBanned,
  isVetoed,
  isAssigned,
  assignedToPlayer,
  onClick,
  compact = false,
}) => {
  if (compact) {
    return (
      <div
        onClick={onClick}
        className={`p-2 rounded-lg border text-xs transition-all relative ${
          isSelected
            ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500'
            : isVetoed
            ? 'bg-rose-950/40 border-rose-800 opacity-60'
            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
        } ${onClick ? 'cursor-pointer' : ''}`}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-7 rounded-full shrink-0"
            style={{ backgroundColor: uma.primaryColor }}
          />
          <div className="min-w-0 flex-1">
            <h5 className={`font-semibold truncate text-[11px] ${isVetoed ? 'line-through text-rose-300' : 'text-slate-200'}`}>
              {uma.name}
            </h5>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span>{uma.surfaceAptitude.turf === 'A' ? 'Turf A' : 'Dirt A'}</span>
              <span>·</span>
              <span className="font-mono">
                S:{uma.distanceAptitude.sprint} M:{uma.distanceAptitude.mile} Md:{uma.distanceAptitude.medium} L:{uma.distanceAptitude.long}
              </span>
            </div>
          </div>
          {assignedToPlayer && (
            <span className="px-1.5 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 text-[9px] font-bold rounded">
              {assignedToPlayer}
            </span>
          )}
          {isVetoed && (
            <span className="px-1 py-0.5 bg-rose-600 text-white font-bold text-[8px] uppercase rounded">
              VETO
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
        isBanned
          ? 'bg-slate-950/70 border-rose-950 opacity-40 cursor-not-allowed'
          : isSelected
          ? 'bg-amber-950/40 border-amber-500 shadow-md ring-1 ring-amber-500'
          : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
      } ${onClick && !isBanned ? 'cursor-pointer' : ''}`}
    >
      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: uma.primaryColor }} />

      <div className="space-y-1 mt-1">
        <div className="flex items-start justify-between gap-1">
          <h4 className="font-display font-bold text-sm text-white uppercase tracking-wide truncate">
            {uma.name}
          </h4>
          <span className="text-[10px] font-mono text-slate-400 shrink-0">
            ★{uma.rarity}
          </span>
        </div>

        <p className="text-[10px] text-slate-400 truncate">{uma.nameJp}</p>
        {uma.epithet && (
          <p className="text-[9px] text-amber-400/80 italic truncate">"{uma.epithet}"</p>
        )}
      </div>

      {/* Aptitude Matrix */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1 text-[10px]">
        {/* Distances */}
        <div className="flex items-center justify-between text-slate-400 font-mono-numbers">
          <span className="text-[9px] uppercase tracking-wider text-slate-500">Dist:</span>
          <span title="Sprint">Sp:<strong className={GRADE_COLORS[uma.distanceAptitude.sprint]}>{uma.distanceAptitude.sprint}</strong></span>
          <span title="Mile">Mi:<strong className={GRADE_COLORS[uma.distanceAptitude.mile]}>{uma.distanceAptitude.mile}</strong></span>
          <span title="Medium">Md:<strong className={GRADE_COLORS[uma.distanceAptitude.medium]}>{uma.distanceAptitude.medium}</strong></span>
          <span title="Long">Lo:<strong className={GRADE_COLORS[uma.distanceAptitude.long]}>{uma.distanceAptitude.long}</strong></span>
        </div>

        {/* Surfaces & Best Strategy */}
        <div className="flex items-center justify-between text-slate-400 font-mono-numbers pt-0.5">
          <span className="text-[9px] uppercase tracking-wider text-slate-500">Surf:</span>
          <span>T:<strong className={GRADE_COLORS[uma.surfaceAptitude.turf]}>{uma.surfaceAptitude.turf}</strong></span>
          <span>D:<strong className={GRADE_COLORS[uma.surfaceAptitude.dirt]}>{uma.surfaceAptitude.dirt}</strong></span>
          <span className="text-slate-500">|</span>
          <span className="text-[9px] text-slate-300 font-sans">
            {uma.strategyAptitude.runner === 'A'
              ? 'Runner'
              : uma.strategyAptitude.leader === 'A'
              ? 'Leader'
              : uma.strategyAptitude.chaser === 'A'
              ? 'Chaser'
              : 'Betweener'}
          </span>
        </div>
      </div>

      {isBanned && (
        <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center text-rose-500 font-bold font-display uppercase tracking-widest text-xs">
          BANNED
        </div>
      )}
    </div>
  );
};
