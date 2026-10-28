# Umamusume: Pretty Derby Esports Draft & Match Director

An esports-grade web draft manager and tournament director suite tailored for *Umamusume: Pretty Derby* competitive crew battles (2v2, 3v3, 4v4, and 5v5). Built for screen-sharing, live casting, and seamless match orchestration.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and tournament rules were established during Phase 1:
> - **Interaction Architecture**: Local Tournament Director / Caster mode optimized for tournament streams, Discord screen-sharing, and offline or hotseat crew battles.
> - **Roster Scope**: Complete modern Umamusume roster with character avatars, surface/distance aptitudes (Sprint, Mile, Medium, Long, Turf, Dirt), and running strategies (Runner, Leader, Betweener, Chaser). Includes quick search and filtering.
> - **Scalable Team Format**: Proportional auto-scaling supporting 2v2, 3v3, 4v4, and 5v5:
>   - *5v5 (Standard)*: 1 initial tiebreaker track roll, 4 track picks per team ($n-1$) with max 2 per distance, 1 track veto per team (leaving 6 race tracks), 2 uma pre-bans per team, snake draft to 5 umas each, 1 uma veto per team, 2 reserve picks (total 6 per team, 5 assigned to players + 1 bluff reserve). Target: 25 points or Track 6/7 tiebreaker.
>   - *4v4 / 3v3 / 2v2*: Proportional formulas: $n-1$ track picks per team, max $\lceil(n-1)/2\rceil$ per distance, 1 track veto, pre-bans, snake draft to $n$, 1 veto, 2 reserves ($n+1$ total uma pool), scaled point target ($5 \times n$).
> - **Post-Draft Match Suite**: Built-in 60-minute training countdown timer with audio alerts and player status toggles (Training / Ready / Forfeited), room code & password coordinator, and real-time podium scoring (1st: 4pts, 2nd: 2pts, 3rd: 1pt) with round-by-round ledger and victory screen.

---

### 1. Overview & Core Concept

- **What It Does**: Automates the complete tournament lifecycle for competitive Umamusume matches:
  1. **Lobby Setup**: Configure team names (e.g. Team Spica vs Team Rigil), logos/colors, team size (2v2 to 5v5), and caster notes.
  2. **Track Phase**:
     - Automated Tiebreaker Roll from Japanese racecourses (Tokyo, Nakayama, Kyoto, Hanshin, Chukyo, Sapporo, Hakodate, Niigata, Fukushima, Kokura, Oi).
     - Coin flip for draft priority.
     - Turn-based track drafting enforcing the distance limit rule.
     - Veto phase eliminating 1 opponent track per side.
     - Finalized racecourse sequence lock.
  3. **Uma Drafting Phase**:
     - Inverted priority (team that picked tracks second bans first).
     - Pre-ban phase (2 umas each).
     - Snake draft for primary lineup ($n$ umas each).
     - Uma veto phase (each team strikes 1 uma from opponent's selection).
     - Reserve pick phase (2 additional umas each, yielding $n+1$ total).
     - Secret / Blind Player Assignment (assign $n$ umas to players; 1 uma remains unassigned as strategic bluff).
  4. **Career Training Timer**:
     - 60-minute countdown with synchronized alarms, pause/resume, and player status checklist.
     - Forfeit tracking for uncompleted trainings.
  5. **Live Race Room & Podium Scoreboard**:
     - Track-by-track race coordinator with in-game room ID and password display for spectating.
     - Interactive podium finisher entry (1st: 4pts, 2nd: 2pts, 3rd: 1pt).
     - Real-time point leaderboard tracking towards the target threshold (25 pts for 5v5).
     - Tiebreaker round trigger if tied after the main tracks.
     - Match victory celebration screen and exportable match recap (JSON / clipboard summary).

- **Target Audience**: Umamusume tournament organizers, Discord community casters, esports streamers, and competitive crew captains.
- **Key Value**: Replaces cumbersome spreadsheets and buggy legacy tools with a slick, bug-free, broadcaster-ready stage featuring live validation, audio cues, and tournament rules enforcement.

---

### 2. User Experience & Visual Design

- **Visual Identity & Theme**:
  - *Aesthetic*: Premium Japanese esports broadcast HUD meets racecourse paddock. High contrast, clean typographic rhythm, athletic urgency.
  - *Color Palette*:
    - Deep turf & paddock night canvas: `#0b1015` (background), `#131b24` (surface card), `#1a2533` (secondary elevated surface).
    - Team Blue (Team 1): `#2563eb` with crisp cyan accents (`#38bdf8`).
    - Team Red (Team 2): `#dc2626` with fiery amber accents (`#fb923c`).
    - Racing Gold (Podium 1st / Victory): `#f59e0b` and `#d97706`.
    - Turf Green (Field / Ready): `#10b981`.
  - *Typography*:
    - Display / Headers: *Barlow Condensed* / *Plus Jakarta Sans* for high-impact broadcast headers.
    - Data & Timers: *JetBrains Mono* / tabular numerals for match countdown, room codes, and point calculations.
  - *Zero-Slop Discipline*: No pill-shaped badge sandwiches. Clean unboxed typography separated by `·` and `/`. No fake decorative telemetry tickers; all timers and scores reflect actual match state.

- **Key Screen Layouts**:
  - **Broadcast Header**:
    - Left: Match Title & Team Size indicator.
    - Center: Current Phase Stepper (Setup $\rightarrow$ Track Draft $\rightarrow$ Uma Draft $\rightarrow$ Training $\rightarrow$ Race Match).
    - Right: Match Director Quick Tools (Sound Toggle, Reset Lobby, Caster Overlay mode).
  - **Drafting Stage**:
    - Split-screen team rosters flanking the central Drafting Arena.
    - Central Arena: Turn banner with active picking team, timer, live search filter (Distance: Sprint/Mile/Medium/Long; Surface: Turf/Dirt; Strategy: Runner/Leader/Betweener/Chaser), and character selection grid with visual bans and pick indicators.
  - **Match Race Room & Scoreboard**:
    - Left: Current race course card (Course details, weather, turn order, room ID).
    - Center: Podium pickers (1st place, 2nd place, 3rd place with instant point tally).
    - Right: Overall point progression bar (target marker at 25 pts) and round history ledger.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Local State Management with Persistent Recovery**
  - *Approach*: State maintained in React state with instant mirror to `localStorage`.
  - *Why*: Ensures tournament streams are zero-latency, immune to network disconnects, and can be resumed immediately if the browser tab refreshes or crashes during a 60-minute training session.
  - *Alternative Considered*: Server-authoritative WebSockets. Overly fragile for single-caster broadcast setups with connection drops; local director mode is robust and reliable.

- **Decision 2: Comprehensive Static Uma & Track Database**
  - *Approach*: Embedded dataset of Japanese racecourses (Tokyo, Hanshin, Kyoto, Nakayama, Chukyo, Sapporo, Hakodate, Niigata, Fukushima, Kokura, Oi) and complete Umamusume characters with official color signatures, Japanese & English names, distance proficiencies, and icons.
  - *Why*: Zero external API dependencies, instantaneous instant-search filtering, and 100% offline reliability during live events.

- **Decision 3: Synthesized Web Audio Sound Effects**
  - *Approach*: Web Audio API oscillator synthesis for coin flip, turn transition, timer beep, draft lock-in, and victory fanfare.
  - *Why*: No reliance on external audio CDNs that could fail or suffer latency.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                   App State Machine & Match Context                    │
│      (Stage: LOBBY -> TRACK_DRAFT -> UMA_DRAFT -> TRAINING -> RACE)    │
└──────────────┬────────────────────────┬───────────────────────┬────────┘
               │                        │                       │
       ┌───────▼────────┐      ┌────────▼───────┐      ┌────────▼───────┐
       │  Track Draft   │      │   Uma Draft    │      │ Match & Score  │
       │    Engine      │      │     Engine     │      │     Engine     │
       ├────────────────┤      ├────────────────┤      ├────────────────┤
       │• Tiebreaker    │      │• Pre-ban phase │      │• 60m Countdown │
       │• Coin Flip     │      │• Snake draft   │      │• Room ID coord │
       │• Distance limit│      │• Veto phase    │      │• 4-2-1 Points  │
       │• Veto phase    │      │• Reserve picks │      │• 25pt Target   │
       │• Track list    │      │• Secret assign │      │• Tiebreaker run│
       └────────────────┘      └────────────────┘      └────────────────┘
               │                        │                       │
       ┌───────▼────────────────────────▼───────────────────────▼────────┐
       │        Sound Engine (Web Audio Synthesizer) & Persistence       │
       └─────────────────────────────────────────────────────────────────┘
```

#### State Entities:
- `MatchConfig`: `{ team1Name, team2Name, team1Color, team2Color, teamSize: 2 | 3 | 4 | 5, targetPoints: number }`
- `TrackDraftState`: `{ tiebreakerTrack, coinFlipWinner, currentTurnTeam, picksTeam1, picksTeam2, vetoesTeam1, vetoesTeam2, finalTracks: Track[] }`
- `UmaDraftState`: `{ preBansTeam1, preBansTeam2, picksTeam1, picksTeam2, vetoesTeam1, vetoesTeam2, reservePicksTeam1, reservePicksTeam2, assignmentsTeam1, assignmentsTeam2 }`
- `TrainingState`: `{ timeRemainingSeconds: number, isRunning: boolean, playerStatus: Record<string, 'training' | 'ready' | 'forfeit'> }`
- `RaceMatchState`: `{ currentRoundIndex: number, results: RaceResult[], totalPointsTeam1: number, totalPointsTeam2: number, winner: string | null }`

---

### Verification & Testing Plan
- **Track Engine**: Test distance limit constraints (e.g. attempting to draft a 3rd sprint track when limit is 2 must be blocked with visual feedback).
- **Draft Flow**: Test snake draft sequence, pre-bans, veto mechanics, and reserve pick additions.
- **Career Timer**: Test countdown, audio buzzer, and player forfeit state handling.
- **Scoring Engine**: Test podium point assignment (4-2-1), target score trigger (25 pts), round advancement, and tiebreaker activation on 6th track tie.
- **Responsiveness**: Verify 1440px casting presentation layout as well as standard laptop resolutions.
