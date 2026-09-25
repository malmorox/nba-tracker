import { Link } from "react-router-dom";
import type { Team } from "@/types/Team";
import { TeamLogo } from "@/components/ui/TeamLogo";

export function TeamCard({ team }: { team: Team }) {
    return (
        <Link
            to={`/teams/${team.id}`}
            className="flex items-center gap-4 rounded-lg border border-slate-800 p-3 transition-colors hover:border-slate-600 hover:bg-slate-900"
        >
            <TeamLogo tricode={team.abbreviation} size={48} />
            <span className="font-medium leading-tight">{team.full_name}</span>
        </Link>
    );
}