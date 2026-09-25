interface Props {
    isPending: boolean;
    error: Error | null;
}

export function QueryFeedback({ isPending, error }: Props) {
    if (isPending) return <p className="text-slate-400">Cargando…</p>;
    if (error) return <p className="text-red-400">Error: {error.message}</p>;
    return null;
}