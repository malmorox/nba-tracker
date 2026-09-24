import type { Team } from "./Team";

export interface Game {
    id: string;
    status: GameStatus;
    status_text: string;
    start_time_utc: string;
    home: GameTeam;
    away: GameTeam;
}

export interface GameTeam {
    team: Team;
    wins: number;
    losses: number;
    score: number;
}

export type GameStatus = 1 | 2 | 3;