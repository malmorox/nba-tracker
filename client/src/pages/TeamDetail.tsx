import { Link, useParams } from "react-router-dom";
import { QueryFeedback } from "@components/ui/QueryFeedback";
import { TeamLogo } from "@components/ui/TeamLogo";
import { useRoster, useTeam, useTeams } from "@hooks/useNba";
import type { Player } from "@/types/Player";

function jersey(p: Player): number {
    const n = p.number === null ? NaN : Number.parseInt(p.number, 10);
    return Number.isNaN(n) ? Infinity : n;
}

function BackLink() {
    return (
        <Link to="/teams" className="text-sm text-slate-400 hover:text-slate-200">
            ← Equipos
        </Link>
    );
}

export function TeamDetail() {
    const teamId = Number(useParams().teamId);
    const teams = useTeams();
    const teamSummary = teams.data?.find((t) => t.id === teamId);
    const team = useTeam(teamSummary?.id);
    const roster = useRoster(teamSummary?.id);

    if (!teams.data) return <QueryFeedback isPending={teams.isPending} error={teams.error} />;
    if (!teamSummary) {
        return (
            <section className="space-y-4">
                <BackLink />
                <p className="text-slate-400">Equipo no encontrado.</p>
            </section>
        );
    }

    const players = roster.data && [...roster.data].sort((a, b) => jersey(a) - jersey(b));
    const t = team.data ?? teamSummary;

    return (
        <section>
        <BackLink />

        <header className="mb-6 mt-3 rounded-lg border border-slate-800 p-4">
            <div className="flex items-center gap-4">
            <TeamLogo tricode={t.abbreviation} size={72} />
            <div>
                <h1 className="text-2xl font-semibold">{t.full_name}</h1>
                <p className="text-sm text-slate-400">
                {t.city}, {t.state} · Fundado en {t.year_founded}
                </p>
            </div>
            </div>

            {(t.arena || t.head_coach || t.general_manager) && (
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-800 pt-4 text-sm sm:grid-cols-3">
                {t.arena && (
                <div>
                    <dt className="text-slate-500">Estadio</dt>
                    <dd>{t.arena}</dd>
                </div>
                )}
                {t.head_coach && (
                <div>
                    <dt className="text-slate-500">Entrenador</dt>
                    <dd>{t.head_coach}</dd>
                </div>
                )}
                {t.general_manager && (
                <div>
                    <dt className="text-slate-500">Director general</dt>
                    <dd>{t.general_manager}</dd>
                </div>
                )}
            </dl>
            )}
        </header>

        <h2 className="mb-2 text-lg font-semibold">Plantilla</h2>
        {!players ? (
            <QueryFeedback isPending={roster.isPending} error={roster.error} />
        ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="text-slate-400">
                <tr>
                    <th className="py-1">#</th>
                    <th>Jugador</th>
                    <th>Pos</th>
                    <th>Altura</th>
                    <th>Peso</th>
                    <th>Edad</th>
                    <th>Exp</th>
                    <th>Universidad</th>
                </tr>
                </thead>
                <tbody>
                {players.map((p) => (
                    <tr key={p.id} className="border-t border-slate-800">
                    <td className="py-1.5">{p.number ?? "–"}</td>
                    <td className="whitespace-nowrap font-medium">{p.name}</td>
                    <td>{p.position ?? "–"}</td>
                    <td>{p.height ?? "–"}</td>
                    <td>{p.weight ?? "–"}</td>
                    <td>{p.age ?? "–"}</td>
                    <td>{p.experience === "R" ? "Rookie" : (p.experience ?? "–")}</td>
                    <td>{p.school ?? "–"}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
        </section>
    );
}
