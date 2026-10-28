import React, { useState } from 'react';
import { Users, Swords, Play, Sparkles } from 'lucide-react';
import { MatchConfig, TeamSize } from '../types/draft';
import { getFormatRules } from '../utils/rules';
import { sound } from '../utils/audio';

interface LobbySetupProps {
  initialConfig: MatchConfig;
  onStartMatch: (config: MatchConfig) => void;
}

export const LobbySetup: React.FC<LobbySetupProps> = ({ initialConfig, onStartMatch }) => {
  const [teamSize, setTeamSize] = useState<TeamSize>(initialConfig.teamSize || 5);
  const [team1Name, setTeam1Name] = useState(initialConfig.team1Name || 'Team Spica');
  const [team2Name, setTeam2Name] = useState(initialConfig.team2Name || 'Team Rigil');
  const [team1Color, setTeam1Color] = useState(initialConfig.team1Color || '#2563eb');
  const [team2Color, setTeam2Color] = useState(initialConfig.team2Color || '#dc2626');
  const [targetPoints, setTargetPoints] = useState<number>(
    initialConfig.targetPoints || getFormatRules(teamSize).defaultTargetPoints
  );

  const [players1, setPlayers1] = useState<string[]>(
    Array.from({ length: 5 }, (_, i) => initialConfig.playersTeam1[i] || `Spica P${i + 1}`)
  );
  const [players2, setPlayers2] = useState<string[]>(
    Array.from({ length: 5 }, (_, i) => initialConfig.playersTeam2[i] || `Rigil P${i + 1}`)
  );

  const handleTeamSizeChange = (newSize: TeamSize) => {
    setTeamSize(newSize);
    const newRules = getFormatRules(newSize);
    setTargetPoints(newRules.defaultTargetPoints);
    sound.playSelect();
  };

  const handlePlayer1Change = (index: number, val: string) => {
    const updated = [...players1];
    updated[index] = val;
    setPlayers1(updated);
  };

  const handlePlayer2Change = (index: number, val: string) => {
    const updated = [...players2];
    updated[index] = val;
    setPlayers2(updated);
  };

  const handleQuickPreset = (preset: 'spica_rigil' | 'canopus_bnw' | 'dirt_kings') => {
    sound.playSelect();
    if (preset === 'spica_rigil') {
      setTeam1Name('Team Spica');
      setTeam2Name('Team Rigil');
      setTeam1Color('#2563eb');
      setTeam2Color('#dc2626');
      setPlayers1(['Trainer T', 'Special P1', 'Suzuka P2', 'Teio P3', 'GoldShip P4']);
      setPlayers2(['Hana Trainer', 'McQueen P1', 'Rudolf P2', 'Brian P3', 'Falcon P4']);
    } else if (preset === 'canopus_bnw') {
      setTeam1Name('Team Canopus');
      setTeam2Name('BNW Trio Alliance');
      setTeam1Color('#059669');
      setTeam2Color('#7c3aed');
      setPlayers1(['Minami P1', 'Turbo P2', 'Nature P3', 'Ikuno P4', 'Palmer P5']);
      setPlayers2(['Biwa P1', 'Ticket P2', 'Taishin P3', 'Hayahide P4', 'Narita P5']);
    } else {
      setTeam1Name('Tokyo Dirt Kings');
      setTeam2Name('Hanshin Turf Lords');
      setTeam1Color('#d97706');
      setTeam2Color('#0284c7');
      setPlayers1(['Rickey P1', 'Tarumae P2', 'Falcon P3', 'Acute P4', 'Digital P5']);
      setPlayers2(['Grass P1', 'El Condor P2', 'Sky P3', 'Opera P4', 'Doto P5']);
    }
  };

  const rules = getFormatRules(teamSize);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playLockIn();
    onStartMatch({
      team1Name: team1Name.trim() || 'Team 1',
      team2Name: team2Name.trim() || 'Team 2',
      team1Color,
      team2Color,
      teamSize,
      targetPoints,
      playersTeam1: players1.slice(0, teamSize),
      playersTeam2: players2.slice(0, teamSize),
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Intro Hero */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Competitive Match Director</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white uppercase">
          Umamusume Tournament Lobby
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          Configure tournament teams, select match format (2v2 through 5v5), and launch the draft sequence with distance enforcement, pre-bans, training timer, and podium race scoring.
        </p>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs text-slate-500 font-medium">Quick Presets:</span>
          <button
            type="button"
            onClick={() => handleQuickPreset('spica_rigil')}
            className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors"
          >
            Spica vs Rigil
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('canopus_bnw')}
            className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors"
          >
            Canopus vs BNW
          </button>
          <button
            type="button"
            onClick={() => handleQuickPreset('dirt_kings')}
            className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md transition-colors"
          >
            Dirt Kings vs Turf Lords
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Format Selector */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                Tournament Match Format
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Scales pick, ban, veto, and podium targets automatically.
              </p>
            </div>

            {/* Team Size Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-lg">
              {([2, 3, 4, 5] as TeamSize[]).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleTeamSizeChange(size)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
                    teamSize === size
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {size}v{size}
                </button>
              ))}
            </div>
          </div>

          {/* Format Rules Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
              <span className="text-slate-500 block text-[11px] uppercase tracking-wider">Track Picks (n-1)</span>
              <span className="text-white font-mono-numbers text-base font-bold">
                {rules.tracksPerTeam} tracks / team
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Max {rules.maxTracksPerDistance} per distance
              </span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
              <span className="text-slate-500 block text-[11px] uppercase tracking-wider">Main Race Tracks</span>
              <span className="text-white font-mono-numbers text-base font-bold">
                {rules.totalRaceTracks} + 1 Tiebreaker
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                1 track veto per team
              </span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
              <span className="text-slate-500 block text-[11px] uppercase tracking-wider">Uma Draft Pool</span>
              <span className="text-white font-mono-numbers text-base font-bold">
                {rules.totalTeamUmaRoster} umas / team
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                {rules.activeRosterSize} active + {rules.bluffRosterSize} bluff reserve
              </span>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
              <span className="text-slate-500 block text-[11px] uppercase tracking-wider">Target Points</span>
              <div className="flex items-center gap-2 mt-0.5">
                <input
                  type="number"
                  min={5}
                  max={50}
                  value={targetPoints}
                  onChange={(e) => setTargetPoints(Math.max(5, parseInt(e.target.value) || 25))}
                  className="w-16 px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-amber-400 font-mono-numbers font-bold text-sm focus:outline-none focus:border-amber-500"
                />
                <span className="text-[11px] text-slate-400">pts to win</span>
              </div>
            </div>
          </div>
        </div>

        {/* Teams Setup Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Team 1 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: team1Color }}
                />
                <h3 className="font-display text-lg font-bold uppercase text-white tracking-wide">
                  Team 1 (Blue Corner)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[11px] text-slate-400">Color:</label>
                <input
                  type="color"
                  value={team1Color}
                  onChange={(e) => setTeam1Color(e.target.value)}
                  className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  placeholder="e.g. Team Spica"
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Player Roster ({teamSize} Players)
                </label>
                <div className="space-y-2">
                  {Array.from({ length: teamSize }).map((_, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-6 text-[11px] text-slate-500 font-mono">P{idx + 1}</span>
                      <input
                        type="text"
                        value={players1[idx] || ''}
                        onChange={(e) => handlePlayer1Change(idx, e.target.value)}
                        placeholder={`Player ${idx + 1} Name`}
                        className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Team 2 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: team2Color }}
                />
                <h3 className="font-display text-lg font-bold uppercase text-white tracking-wide">
                  Team 2 (Red Corner)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[11px] text-slate-400">Color:</label>
                <input
                  type="color"
                  value={team2Color}
                  onChange={(e) => setTeam2Color(e.target.value)}
                  className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  placeholder="e.g. Team Rigil"
                  required
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Player Roster ({teamSize} Players)
                </label>
                <div className="space-y-2">
                  {Array.from({ length: teamSize }).map((_, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-6 text-[11px] text-slate-500 font-mono">P{idx + 1}</span>
                      <input
                        type="text"
                        value={players2[idx] || ''}
                        onChange={(e) => handlePlayer2Change(idx, e.target.value)}
                        placeholder={`Player ${idx + 1} Name`}
                        className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-md text-xs text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center pt-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold font-display text-lg uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            Launch Tournament Draft
          </button>
        </div>
      </form>
    </div>
  );
};
