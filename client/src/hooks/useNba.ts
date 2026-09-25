import { skipToken, useQuery } from "@tanstack/react-query";
import { nbaService } from "../api/nbaService";

export function useTeams() {
    return useQuery({
        queryKey: ["teams"],
        queryFn: ({ signal }) => nbaService.getTeams(signal),
        staleTime: Infinity, // la lista no cambia durante la sesión
    });
}

export function useTeam(teamId: number | undefined) {
    return useQuery({
        queryKey: ["team", teamId],
        queryFn: teamId === undefined ? skipToken : ({ signal }) => nbaService.getTeam(teamId, signal),
        staleTime: Infinity,
    });
}

export function useRoster(teamId: number | undefined) {
    return useQuery({
        queryKey: ["roster", teamId],
        queryFn: teamId === undefined ? skipToken : ({ signal }) => nbaService.getRoster(teamId, signal),
        staleTime: 60 * 60_000,
    });
}
