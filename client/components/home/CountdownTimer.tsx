import { useEffect, useMemo, useState } from "react";

type Props = { targetDate: string };

export default function CountdownTimer({ targetDate }: Props) {
  const calc = useMemo(
    () => () => {
      const diff = +new Date(targetDate) - +new Date();
      if (diff <= 0) return null;
      return {
        Days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        Hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        Mins: Math.floor((diff / 1000 / 60) % 60),
        Secs: Math.floor((diff / 1000) % 60),
      };
    },
    [targetDate],
  );

  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof calc> | null>(
    calc(),
  );

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(t);
  }, [calc]);

  if (!timeLeft)
    return <span className="text-sm text-muted-foreground">Deal ended</span>;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex flex-wrap gap-3">
      {Object.entries(timeLeft).map(([k, v]) => (
        <span
          key={k}
          className="inline-flex items-baseline rounded-lg border px-3 py-2"
        >
          <span className="text-2xl font-semibold tabular-nums">
            {pad(v as number)}
          </span>
          <span className="ml-2 text-xs uppercase text-muted-foreground">
            {k}
          </span>
        </span>
      ))}
    </div>
  );
}
