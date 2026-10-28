import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, AlertOctagon, CheckCircle2, ArrowRight, Bell, ShieldCheck } from 'lucide-react';
import { PlayerSlot, Umamusume } from '../types/draft';
import { sound } from '../utils/audio';

interface CareerTrainingTimerProps {
  initialSeconds?: number;
  initialIsRunning?: boolean;
  players1: PlayerSlot[];
  players2: PlayerSlot[];
  team1Name: string;
  team2Name: string;
  team1Color: string;
  team2Color: string;
  allUmasMap: Map<string, Umamusume>;
  onProceedToRaces: (updatedPlayers1: PlayerSlot[], updatedPlayers2: PlayerSlot[]) => void;
}

export const CareerTrainingTimer: React.FC<CareerTrainingTimerProps> = ({
  initialSeconds = 3600, // 60 minutes
  initialIsRunning = true,
  players1,
  players2,
  team1Name,
  team2Name,
  team1Color,
  team2Color,
  allUmasMap,
  onProceedToRaces,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(initialIsRunning);
  const [p1Slots, setP1Slots] = useState<PlayerSlot[]>(players1);
  const [p2Slots, setP2Slots] = useState<PlayerSlot[]>(players2);

  // Timer interval
  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          sound.playBuzzer();
          return 0;
        }
        // Warning beeps at key milestones
        if (prev === 600) sound.playBeep(); // 10 minutes left
        if (prev === 60) sound.playBeep();  // 1 minute left
        if (prev <= 10 && prev > 1) sound.playBeep(); // Last 10s tick
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const formatTime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayerStatus1 = (index: number) => {
    sound.playSelect();
    const updated = [...p1Slots];
    const cur = updated[index].trainingStatus;
    updated[index] = {
      ...updated[index],
      trainingStatus: cur === 'training' ? 'ready' : cur === 'ready' ? 'forfeited' : 'training',
    };
    setP1Slots(updated);
  };

  const togglePlayerStatus2 = (index: number) => {
    sound.playSelect();
    const updated = [...p2Slots];
    const cur = updated[index].trainingStatus;
    updated[index] = {
      ...updated[index],
      trainingStatus: cur === 'training' ? 'ready' : cur === 'ready' ? 'forfeited' : 'training',
    };
    setP2Slots(updated);
  };

  const markAllReady = () => {
    sound.playLockIn();
    setP1Slots(p1Slots.map(p => ({ ...p, trainingStatus: 'ready' })));
    setP2Slots(p2Slots.map(p => ({ ...p, trainingStatus: 'ready' })));
  };

  const handleAdjustTime = (delta: number) => {
    sound.playSelect();
    setSecondsLeft((prev) => Math.max(0, prev + delta));
  };

  const handleStartRaces = () => {
    sound.playLockIn();
    onProceedToRaces(p1Slots, p2Slots);
  };

  const progressPercent = Math.max(0, Math.min(100, ((3600 - secondsLeft) / 3600) * 100));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" />
          <span>Stage 10 · 60-Minute Career Training Window</span>
        </div>
        <h2 className="text-3xl font-extrabold font-display uppercase tracking-tight text-white">
          Career Training In Progress
        </h2>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Trainers have 1 hour to complete their assigned Umamusume career run in-game. Unfinished runs forfeit their match race slot!
        </p>
      </div>

      {/* Main Digital Clock Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6 relative overflow-hidden">
        {/* Progress bar line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="space-y-1">
          <div className="font-mono-numbers text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-white drop-shadow-md">
            {formatTime(secondsLeft)}
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 block">
            {secondsLeft === 0 ? 'TIME EXPIRED · TRAININGS LOCKED' : isRunning ? 'COUNTDOWN RUNNING' : 'TIMER PAUSED'}
          </span>
        </div>

        {/* Timer Control Cluster */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              sound.playSelect();
              setIsRunning(!isRunning);
            }}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold font-display uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isRunning ? 'Pause Timer' : 'Resume Timer'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleAdjustTime(300)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            +5 Min
          </button>

          <button
            type="button"
            onClick={() => handleAdjustTime(-300)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            -5 Min
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playSelect();
              setSecondsLeft(30);
            }}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            title="Fast forward to 30 seconds left for testing"
          >
            Fast Forward (30s)
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playSelect();
              setSecondsLeft(3600);
              setIsRunning(false);
            }}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 border border-slate-700 rounded-lg transition-colors"
            title="Reset to 60 Minutes"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Player Status Checklists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Team 1 Checklist */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: team1Color }} />
              <h3 className="font-display font-bold text-white uppercase text-base tracking-wide">
                {team1Name} Training Progress
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono-numbers">
              {p1Slots.filter(p => p.trainingStatus === 'ready').length}/{p1Slots.length} Ready
            </span>
          </div>

          <div className="space-y-2">
            {p1Slots.map((slot, idx) => {
              const uma = slot.assignedUmaId ? allUmasMap.get(slot.assignedUmaId) : null;
              return (
                <div
                  key={slot.id}
                  onClick={() => togglePlayerStatus1(idx)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    slot.trainingStatus === 'ready'
                      ? 'bg-emerald-950/30 border-emerald-800/80'
                      : slot.trainingStatus === 'forfeited'
                      ? 'bg-rose-950/30 border-rose-800/80 opacity-60'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-blue-400">P{idx + 1}</span>
                      <strong className="text-xs text-white">{slot.name}</strong>
                    </div>
                    {uma && (
                      <span className="text-[11px] text-slate-400 block">
                        Training: <strong className="text-slate-200">{uma.name}</strong>
                      </span>
                    )}
                  </div>

                  <div className="shrink-0">
                    {slot.trainingStatus === 'ready' ? (
                      <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-[10px] uppercase rounded-md flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" /> Ready
                      </span>
                    ) : slot.trainingStatus === 'forfeited' ? (
                      <span className="px-2.5 py-1 bg-rose-600 text-white font-bold text-[10px] uppercase rounded-md flex items-center gap-1">
                        <AlertOctagon className="w-3 h-3" /> Forfeit
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-slate-800 text-amber-300 font-medium text-[10px] uppercase rounded-md border border-slate-700">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team 2 Checklist */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: team2Color }} />
              <h3 className="font-display font-bold text-white uppercase text-base tracking-wide">
                {team2Name} Training Progress
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono-numbers">
              {p2Slots.filter(p => p.trainingStatus === 'ready').length}/{p2Slots.length} Ready
            </span>
          </div>

          <div className="space-y-2">
            {p2Slots.map((slot, idx) => {
              const uma = slot.assignedUmaId ? allUmasMap.get(slot.assignedUmaId) : null;
              return (
                <div
                  key={slot.id}
                  onClick={() => togglePlayerStatus2(idx)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    slot.trainingStatus === 'ready'
                      ? 'bg-emerald-950/30 border-emerald-800/80'
                      : slot.trainingStatus === 'forfeited'
                      ? 'bg-rose-950/30 border-rose-800/80 opacity-60'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-rose-400">P{idx + 1}</span>
                      <strong className="text-xs text-white">{slot.name}</strong>
                    </div>
                    {uma && (
                      <span className="text-[11px] text-slate-400 block">
                        Training: <strong className="text-slate-200">{uma.name}</strong>
                      </span>
                    )}
                  </div>

                  <div className="shrink-0">
                    {slot.trainingStatus === 'ready' ? (
                      <span className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-[10px] uppercase rounded-md flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" /> Ready
                      </span>
                    ) : slot.trainingStatus === 'forfeited' ? (
                      <span className="px-2.5 py-1 bg-rose-600 text-white font-bold text-[10px] uppercase rounded-md flex items-center gap-1">
                        <AlertOctagon className="w-3 h-3" /> Forfeit
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-slate-800 text-amber-300 font-medium text-[10px] uppercase rounded-md border border-slate-700">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          type="button"
          onClick={markAllReady}
          className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
        >
          Mark All Players as Ready
        </button>

        <button
          type="button"
          onClick={handleStartRaces}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold font-display uppercase tracking-wider text-base rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer transition-all"
        >
          <span>Launch Live Race Match Room &amp; Scoreboard</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
