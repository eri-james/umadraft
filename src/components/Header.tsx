import React from 'react';
import { Volume2, VolumeX, RotateCcw, Monitor, Trophy } from 'lucide-react';
import { MatchPhase, TeamSize } from '../types/draft';
import { sound } from '../utils/audio';

interface HeaderProps {
  phase: MatchPhase;
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  targetScore: number;
  teamSize: TeamSize;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetMatch: () => void;
  onToggleCasterOverlay: () => void;
}

const PHASE_LABELS: Record<MatchPhase, string> = {
  LOBBY: 'Lobby Setup',
  TIEBREAKER_ROLL: 'Tiebreaker Track',
  TRACK_COIN_FLIP: 'Coin Flip',
  TRACK_DRAFT: 'Track Draft',
  TRACK_VETO: 'Track Veto',
  UMA_PRE_BAN: 'Uma Pre-Ban',
  UMA_DRAFT: 'Uma Snake Draft',
  UMA_VETO: 'Uma Veto',
  UMA_RESERVE: 'Reserve Picks',
  ASSIGN_ROSTER: 'Player Assignment',
  TRAINING_TIMER: 'Career Training (1h)',
  RACE_MATCH: 'Live Races & Scoring',
  MATCH_VICTORY: 'Match Victory',
};

export const Header: React.FC<HeaderProps> = ({
  phase,
  team1Name,
  team2Name,
  team1Score,
  team2Score,
  targetScore,
  teamSize,
  soundEnabled,
  onToggleSound,
  onResetMatch,
  onToggleCasterOverlay,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95 sticky top-0 z-40 backdrop-blur-md px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single line brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-lg shadow-sm">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display text-xl font-bold tracking-tight text-white uppercase whitespace-nowrap block leading-none">
              Uma Draft Director
            </span>
            <span className="text-[11px] text-slate-400 font-mono tracking-wider uppercase block mt-0.5">
              Esports Match Hub · {teamSize}v{teamSize} Format
            </span>
          </div>
        </div>

        {/* Zone 2: Clean phase indicator & live score when in match */}
        <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-300">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-md">
            <span className="text-amber-400 font-semibold uppercase tracking-wider text-[10px]">Active Phase:</span>
            <span className="text-white font-medium">{PHASE_LABELS[phase]}</span>
          </div>

          {(phase === 'RACE_MATCH' || phase === 'MATCH_VICTORY') && (
            <div className="flex items-center gap-3 px-3 py-1 bg-slate-900/90 border border-slate-800 rounded-md font-mono-numbers">
              <span className="text-blue-400 font-semibold truncate max-w-[100px]">{team1Name}: {team1Score}</span>
              <span className="text-slate-600">/</span>
              <span className="text-rose-400 font-semibold truncate max-w-[100px]">{team2Name}: {team2Score}</span>
              <span className="text-slate-500 text-[11px]">({targetScore} pts to win)</span>
            </div>
          )}
        </div>

        {/* Zone 3: Functional tool actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleCasterOverlay}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors"
            title="Open Caster Overlay HUD"
          >
            <Monitor className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Caster HUD</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.enabled = !soundEnabled;
              onToggleSound();
            }}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors"
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            aria-label="Toggle sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          <button
            type="button"
            onClick={onResetMatch}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-rose-400 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors"
            title="Reset Match to Lobby"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
