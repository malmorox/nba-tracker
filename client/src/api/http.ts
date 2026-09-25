const BASE_URL: string = "http://localhost:8000/api";

export class ApiError extends Error {
    readonly status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

interface RequestOptions {
    params?: Record<string, string | number | undefined>;
    signal?: AbortSignal;
}

async function get<T>(path: string, { params, signal }: RequestOptions = {}): Promise<T> {
    const url = new URL(`${BASE_URL}${path}`);
    for (const [key, value] of Object.entries(params ?? {})) {
        if (value !== undefined) url.searchParams.set(key, String(value));
    }

    const res = await fetch(url, { signal, headers: { Accept: "application/json" } });
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new ApiError(res.status, body?.detail ?? res.statusText);
    }
    return (await res.json()) as T;
}

export const http = { get };