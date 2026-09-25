import { useState } from "react";

interface Props {
    tricode: string;
    size?: number;
}

const teamLogosPath = "/logos/teams/";

export function TeamLogo({ tricode, size = 28 }: Props) {
    const [failedFor, setFailedFor] = useState<string | null>(null);

    if (failedFor === tricode) {
        return (
        <span
            style={{ width: size, height: size }}
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-slate-800 text-[10px] font-semibold text-slate-400"
        >
            {tricode}
        </span>
        );
    }

    return (
        <img
            src={`${teamLogosPath}${tricode.toLowerCase()}.png`}
            alt=""
            width={size}
            height={size}
            loading="lazy"
            onError={() => setFailedFor(tricode)}
            className="shrink-0 object-contain"
        />
    );
}