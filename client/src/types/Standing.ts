import type { Team } from "./Team";
import type { Conference } from "./Conference";

export interface Standing {
    team: Team;
    conference: Conference;
    division: string;
    conference_rank: number;
    wins: number;
    losses: number;
    win_pct: number;
    streak: string;
    last_ten: string;
}