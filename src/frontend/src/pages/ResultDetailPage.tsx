import { Layout } from "@/components/Layout";
import { ProgressRing } from "@/components/ProgressRing";
import { QuestionResultBadge } from "@/components/QuestionResultBadge";
import { ScoreCard } from "@/components/ScoreCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnswerKey, useScanResult } from "@/hooks/useBackend";
import { computeBreakdown, exportResultPdf } from "@/utils/exportUtils";
import { useParams, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Printer } from "lucide-react";

// Annotated answer grid showing colored circles per question
function BubbleGrid({
  questionResults,
}: {
  questionResults: ReturnType<typeof Array.prototype.slice>;
}) {
  const CHOICES = ["A", "B", "C", "D", "E"] as const;

  return (
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}
    >
      {questionResults.map(
        (qr: {
          questionNumber: bigint;
          detectedAnswer: string;
          status: string;
        }) => (
          <div
            key={String(qr.questionNumber)}
            className="flex items-center gap-1.5 py-1"
          >
            <span className="w-7 text-right text-xs text-muted-foreground font-mono shrink-0">
              {String(qr.questionNumber)}.
            </span>
            {CHOICES.map((ch) => {
              const isDetected = qr.detectedAnswer === ch;
              const dotColor = isDetected
                ? qr.status === "correct"
                  ? "bg-accent text-accent-foreground"
                  : qr.status === "incorrect"
                    ? "bg-destructive text-destructive-foreground"
                    : "bg-muted-foreground text-background"
                : "bg-muted text-muted-foreground border border-border";
              return (
                <span
                  key={ch}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold transition-colors ${dotColor}`}
                >
                  {ch}
                </span>
              );
            })}
          </div>
        ),
      )}
    </div>
  );
}

export default function ResultDetailPage() {
  const { id } = useParams({ from: "/results/$id" });
  const router = useRouter();

  const numericId = BigInt(id);
  const { data: result, isLoading: loadingResult } = useScanResult(numericId);
  const { data: answerKey, isLoading: loadingKey } = useAnswerKey(
    result?.answerKeyId ?? null,
  );

  const isLoading = loadingResult || loadingKey;

  const breakdown = result
    ? computeBreakdown(result.questionResults, answerKey ?? null)
    : null;

  function formatDate(ts: bigint) {
    return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (isLoading) {
    return (
      <Layout title="Result Detail">
        <div className="space-y-4">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </Layout>
    );
  }

  if (!result || !breakdown) {
    return (
      <Layout title="Result Not Found">
        <div className="text-center py-20">
          <p className="text-muted-foreground">Result not found.</p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => router.navigate({ to: "/results" })}
          >
            Back to Results
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Result Detail"
      actions={
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.navigate({ to: "/results" })}
            data-ocid="result_detail.back_button"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </Button>
          <Button
            size="sm"
            onClick={() =>
              exportResultPdf(result, breakdown, answerKey ?? null)
            }
            data-ocid="result_detail.print_button"
          >
            <Printer className="h-4 w-4 mr-1.5" />
            Export PDF
          </Button>
        </>
      }
    >
      <div className="space-y-5 max-w-4xl">
        {/* Student info header */}
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex-1 min-w-[200px]">
              <h2 className="text-xl font-bold text-foreground">
                {result.studentName}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                ID: {result.studentId} &bull; Class:{" "}
                <strong>{result.studentClass}</strong>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(result.timestamp)}
              </p>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="text-xs">
                {answerKey?.name ?? "Unknown Answer Key"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Score summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ScoreCard breakdown={breakdown} studentName={result.studentName} />

          {/* Progress ring emphasis */}
          <div className="bg-card border border-border rounded-lg p-5 shadow-sm flex flex-col items-center justify-center gap-3">
            <ProgressRing
              value={breakdown.percentage}
              size={100}
              strokeWidth={8}
              showLabel
            />
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                {breakdown.totalScore.toFixed(1)} /{" "}
                {breakdown.maxPossibleScore.toFixed(1)} points
              </p>
              <p className="text-xs text-muted-foreground">
                {Number(breakdown.correctCount)} correct &bull;{" "}
                {Number(breakdown.incorrectCount)} incorrect
              </p>
            </div>
          </div>
        </div>

        {/* Per-question breakdown */}
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-muted/30">
            <h3 className="font-semibold text-foreground text-sm">
              Question Breakdown
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table
              className="w-full text-sm"
              data-ocid="result_detail.questions_table"
            >
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  <th className="text-center px-3 py-2.5 font-medium text-muted-foreground w-12">
                    Q#
                  </th>
                  <th className="text-center px-3 py-2.5 font-medium text-muted-foreground">
                    Detected
                  </th>
                  <th className="text-center px-3 py-2.5 font-medium text-muted-foreground">
                    Correct
                  </th>
                  <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-right px-3 py-2.5 font-medium text-muted-foreground">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {result.questionResults.map((qr, idx) => {
                  const correctAnswer =
                    answerKey?.questions.find(
                      (q) => q.questionNumber === qr.questionNumber,
                    )?.correctAnswer ?? null;
                  return (
                    <tr
                      key={String(qr.questionNumber)}
                      className="border-b border-border last:border-0 hover:bg-muted/20"
                      data-ocid={`result_detail.question_row.${idx + 1}`}
                    >
                      <td className="px-3 py-2 text-center font-mono text-xs text-muted-foreground">
                        {String(qr.questionNumber)}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <QuestionResultBadge result={qr} compact />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-accent/40 bg-accent/10 text-accent text-xs font-semibold">
                          {correctAnswer && correctAnswer !== "None"
                            ? String(correctAnswer)
                            : "—"}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <QuestionResultBadge result={qr} />
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-xs tabular-nums">
                        {qr.pointsAwarded.toFixed(1)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Annotated bubble grid */}
        <div className="bg-card border border-border rounded-lg shadow-sm">
          <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-sm">
              Annotated Answer Grid
            </h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-accent inline-block" />
                Correct
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-destructive inline-block" />
                Incorrect
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-muted-foreground inline-block" />
                Empty/Other
              </span>
            </div>
          </div>
          <div className="p-5">
            <BubbleGrid questionResults={result.questionResults} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
