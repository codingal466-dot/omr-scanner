import { AnswerStatus } from "@/backend";
import { cn } from "@/lib/utils";
import type { QuestionResult } from "@/types/omr";

interface QuestionResultBadgeProps {
  result: QuestionResult;
  compact?: boolean;
  className?: string;
}

export function QuestionResultBadge({
  result,
  compact = false,
  className,
}: QuestionResultBadgeProps) {
  const answer = result.detectedAnswer.toString();
  const status = result.status;

  const statusStyles: Record<AnswerStatus, string> = {
    [AnswerStatus.correct]: "border-accent/50 bg-accent/10 text-accent",
    [AnswerStatus.incorrect]:
      "border-destructive/50 bg-destructive/10 text-destructive",
    [AnswerStatus.empty]: "border-border bg-muted/60 text-muted-foreground",
    [AnswerStatus.anomaly]: "border-yellow-400/50 bg-yellow-50 text-yellow-700",
  };

  if (compact) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center w-7 h-7 rounded-full border text-xs font-semibold",
          statusStyles[status],
          className,
        )}
        title={`Q${result.questionNumber}: ${answer} (${status})`}
      >
        {answer === "None" ? "–" : answer}
      </span>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-2 py-1 rounded-md border text-xs",
        statusStyles[status],
        className,
      )}
    >
      <span className="font-mono font-semibold w-5 text-center">
        {answer === "None" ? "–" : answer}
      </span>
      <StatusDot status={status} />
    </div>
  );
}

function StatusDot({ status }: { status: AnswerStatus }) {
  const dotStyles: Record<AnswerStatus, string> = {
    [AnswerStatus.correct]: "bg-accent",
    [AnswerStatus.incorrect]: "bg-destructive",
    [AnswerStatus.empty]: "bg-muted-foreground/40",
    [AnswerStatus.anomaly]: "bg-yellow-500",
  };

  return <span className={cn("w-1.5 h-1.5 rounded-full", dotStyles[status])} />;
}
