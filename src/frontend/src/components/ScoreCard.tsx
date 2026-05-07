import { ProgressRing } from "@/components/ProgressRing";
import { cn } from "@/lib/utils";
import type { ScoreBreakdown } from "@/types/omr";

interface ScoreCardProps {
  breakdown: ScoreBreakdown;
  studentName?: string;
  className?: string;
}

export function ScoreCard({
  breakdown,
  studentName,
  className,
}: ScoreCardProps) {
  const percentage = Math.round(breakdown.percentage * 10) / 10;
  const correct = Number(breakdown.correctCount);
  const incorrect = Number(breakdown.incorrectCount);
  const empty = Number(breakdown.emptyCount);
  const anomaly = Number(breakdown.anomalyCount);
  const total = correct + incorrect + empty + anomaly;

  const grade =
    percentage >= 90
      ? "A"
      : percentage >= 80
        ? "B"
        : percentage >= 70
          ? "C"
          : percentage >= 60
            ? "D"
            : "F";

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-lg p-5 shadow-card",
        className,
      )}
    >
      {studentName && (
        <p className="text-sm font-medium text-muted-foreground mb-4">
          {studentName}
        </p>
      )}
      <div className="flex items-center gap-5">
        <ProgressRing
          value={percentage}
          size={72}
          strokeWidth={6}
          className="shrink-0"
        />
        <div className="min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-foreground font-mono tabular-nums">
              {percentage.toFixed(1)}%
            </span>
            <span className="text-base font-semibold text-muted-foreground">
              {grade}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {breakdown.totalScore.toFixed(1)} /{" "}
            {breakdown.maxPossibleScore.toFixed(1)} pts
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <StatPill
          label="Correct"
          value={correct}
          total={total}
          color="correct"
        />
        <StatPill
          label="Incorrect"
          value={incorrect}
          total={total}
          color="incorrect"
        />
        <StatPill label="Empty" value={empty} total={total} color="empty" />
      </div>
    </div>
  );
}

function StatPill({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: "correct" | "incorrect" | "empty";
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;

  const colors = {
    correct: "bg-accent/10 text-accent border-accent/20",
    incorrect: "bg-destructive/10 text-destructive border-destructive/20",
    empty: "bg-muted text-muted-foreground border-border",
  };

  return (
    <div
      className={cn("rounded-md border px-2 py-1.5 text-center", colors[color])}
    >
      <p className="text-base font-bold tabular-nums">{value}</p>
      <p className="text-[10px] font-medium leading-tight">{label}</p>
      <p className="text-[10px] opacity-70">{pct}%</p>
    </div>
  );
}
