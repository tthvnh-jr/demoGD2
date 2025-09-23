import CountdownTimer from "./CountdownTimer";
import { Button } from "@/components/ui/button";

export default function CountdownBanner() {
  const targetDate = "2025-12-31T00:00:00";

  return (
    <div className="relative overflow-hidden rounded-2xl border p-6 sm:p-8">
      {/* Countdown timer */}
      <div className="mb-4 sm:mb-6">
        <CountdownTimer targetDate={targetDate} />
      </div>

      {/* Text */}
      <p className="text-xl font-semibold">Good Deal Will Comeback</p>

      {/* CTA button */}
      <div className="mt-4">
        <Button>Order now</Button>
      </div>

      {/* background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-tr from-muted/30 to-transparent" />
    </div>
  );
}
