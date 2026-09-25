import { TeamCard } from "@components/TeamCard";
import { QueryFeedback } from "@components/ui/QueryFeedback";
import { useTeams } from "@hooks/useNba";

export function Teams() {
  const { data: teams, isPending, error } = useTeams();
  if (!teams) return <QueryFeedback isPending={isPending} error={error} />;

  return (
    <section>
      <h1 className="mb-6 text-2xl font-semibold">Equipos</h1>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((t) => (
          <li key={t.id}>
            <TeamCard team={t} />
          </li>
        ))}
      </ul>
    </section>
  );
}