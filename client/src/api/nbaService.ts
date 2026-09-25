import type { Player } from "@/types/Player";
import type { Team } from "@/types/Team";
import { http } from "./http";

export const nbaService = {
    getTeams: (signal?: AbortSignal) => http.get<Team[]>("/teams", { signal }),

    getTeam: (teamId: number, signal?: AbortSignal) =>
        http.get<Team>(`/teams/${teamId}`, { signal }),

    getRoster: (teamId: number, signal?: AbortSignal) =>
        http.get<Player[]>(`/teams/${teamId}/roster`, { signal }),
};
