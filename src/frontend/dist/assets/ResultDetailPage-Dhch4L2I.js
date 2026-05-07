import { j as jsxRuntimeExports, c as cn, e as useParams, u as useRouter, S as Skeleton } from "./index-COsGoTS5.js";
import { c as createLucideIcon, A as AnswerStatus, m as useScanResult, n as useAnswerKey, L as Layout, b as Button, d as Badge } from "./useBackend-gHfQ_2dy.js";
import { P as ProgressRing } from "./ProgressRing-CW0rNeEP.js";
import { c as computeBreakdown, a as exportResultPdf } from "./exportUtils-DnTP72Ay.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",
      key: "143wyd"
    }
  ],
  ["path", { d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6", key: "1itne7" }],
  ["rect", { x: "6", y: "14", width: "12", height: "8", rx: "1", key: "1ue0tg" }]
];
const Printer = createLucideIcon("printer", __iconNode);
function QuestionResultBadge({
  result,
  compact = false,
  className
}) {
  const answer = result.detectedAnswer.toString();
  const status = result.status;
  const statusStyles = {
    [AnswerStatus.correct]: "border-accent/50 bg-accent/10 text-accent",
    [AnswerStatus.incorrect]: "border-destructive/50 bg-destructive/10 text-destructive",
    [AnswerStatus.empty]: "border-border bg-muted/60 text-muted-foreground",
    [AnswerStatus.anomaly]: "border-yellow-400/50 bg-yellow-50 text-yellow-700"
  };
  if (compact) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: cn(
          "inline-flex items-center justify-center w-7 h-7 rounded-full border text-xs font-semibold",
          statusStyles[status],
          className
        ),
        title: `Q${result.questionNumber}: ${answer} (${status})`,
        children: answer === "None" ? "–" : answer
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex items-center gap-2 px-2 py-1 rounded-md border text-xs",
        statusStyles[status],
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold w-5 text-center", children: answer === "None" ? "–" : answer }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatusDot, { status })
      ]
    }
  );
}
function StatusDot({ status }) {
  const dotStyles = {
    [AnswerStatus.correct]: "bg-accent",
    [AnswerStatus.incorrect]: "bg-destructive",
    [AnswerStatus.empty]: "bg-muted-foreground/40",
    [AnswerStatus.anomaly]: "bg-yellow-500"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("w-1.5 h-1.5 rounded-full", dotStyles[status]) });
}
function ScoreCard({
  breakdown,
  studentName,
  className
}) {
  const percentage = Math.round(breakdown.percentage * 10) / 10;
  const correct = Number(breakdown.correctCount);
  const incorrect = Number(breakdown.incorrectCount);
  const empty = Number(breakdown.emptyCount);
  const anomaly = Number(breakdown.anomalyCount);
  const total = correct + incorrect + empty + anomaly;
  const grade = percentage >= 90 ? "A" : percentage >= 80 ? "B" : percentage >= 70 ? "C" : percentage >= 60 ? "D" : "F";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "bg-card border border-border rounded-lg p-5 shadow-card",
        className
      ),
      children: [
        studentName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground mb-4", children: studentName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ProgressRing,
            {
              value: percentage,
              size: 72,
              strokeWidth: 6,
              className: "shrink-0"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-3xl font-bold text-foreground font-mono tabular-nums", children: [
                percentage.toFixed(1),
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-semibold text-muted-foreground", children: grade })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              breakdown.totalScore.toFixed(1),
              " /",
              " ",
              breakdown.maxPossibleScore.toFixed(1),
              " pts"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2 mt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatPill,
            {
              label: "Correct",
              value: correct,
              total,
              color: "correct"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatPill,
            {
              label: "Incorrect",
              value: incorrect,
              total,
              color: "incorrect"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatPill, { label: "Empty", value: empty, total, color: "empty" })
        ] })
      ]
    }
  );
}
function StatPill({
  label,
  value,
  total,
  color
}) {
  const pct = total > 0 ? Math.round(value / total * 100) : 0;
  const colors = {
    correct: "bg-accent/10 text-accent border-accent/20",
    incorrect: "bg-destructive/10 text-destructive border-destructive/20",
    empty: "bg-muted text-muted-foreground border-border"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn("rounded-md border px-2 py-1.5 text-center", colors[color]),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold tabular-nums", children: value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-medium leading-tight", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] opacity-70", children: [
          pct,
          "%"
        ] })
      ]
    }
  );
}
function BubbleGrid({
  questionResults
}) {
  const CHOICES = ["A", "B", "C", "D", "E"];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "grid gap-1",
      style: { gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" },
      children: questionResults.map(
        (qr) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-1.5 py-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "w-7 text-right text-xs text-muted-foreground font-mono shrink-0", children: [
                String(qr.questionNumber),
                "."
              ] }),
              CHOICES.map((ch) => {
                const isDetected = qr.detectedAnswer === ch;
                const dotColor = isDetected ? qr.status === "correct" ? "bg-accent text-accent-foreground" : qr.status === "incorrect" ? "bg-destructive text-destructive-foreground" : "bg-muted-foreground text-background" : "bg-muted text-muted-foreground border border-border";
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold transition-colors ${dotColor}`,
                    children: ch
                  },
                  ch
                );
              })
            ]
          },
          String(qr.questionNumber)
        )
      )
    }
  );
}
function ResultDetailPage() {
  const { id } = useParams({ from: "/results/$id" });
  const router = useRouter();
  const numericId = BigInt(id);
  const { data: result, isLoading: loadingResult } = useScanResult(numericId);
  const { data: answerKey, isLoading: loadingKey } = useAnswerKey(
    (result == null ? void 0 : result.answerKeyId) ?? null
  );
  const isLoading = loadingResult || loadingKey;
  const breakdown = result ? computeBreakdown(result.questionResults, answerKey ?? null) : null;
  function formatDate(ts) {
    return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { title: "Result Detail", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-56" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-full" })
    ] }) });
  }
  if (!result || !breakdown) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { title: "Result Not Found", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Result not found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "mt-4",
          variant: "outline",
          onClick: () => router.navigate({ to: "/results" }),
          children: "Back to Results"
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Layout,
    {
      title: "Result Detail",
      actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => router.navigate({ to: "/results" }),
            "data-ocid": "result_detail.back_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 mr-1.5" }),
              "Back"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: () => exportResultPdf(result, breakdown, answerKey ?? null),
            "data-ocid": "result_detail.print_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "h-4 w-4 mr-1.5" }),
              "Export PDF"
            ]
          }
        )
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 max-w-4xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-lg p-5 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[200px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-foreground", children: result.studentName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
              "ID: ",
              result.studentId,
              " • Class:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: result.studentClass })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: formatDate(result.timestamp) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs", children: (answerKey == null ? void 0 : answerKey.name) ?? "Unknown Answer Key" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreCard, { breakdown, studentName: result.studentName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg p-5 shadow-sm flex flex-col items-center justify-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ProgressRing,
              {
                value: breakdown.percentage,
                size: 100,
                strokeWidth: 8,
                showLabel: true
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
                breakdown.totalScore.toFixed(1),
                " /",
                " ",
                breakdown.maxPossibleScore.toFixed(1),
                " points"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                Number(breakdown.correctCount),
                " correct •",
                " ",
                Number(breakdown.incorrectCount),
                " incorrect"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg shadow-sm overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 border-b border-border bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground text-sm", children: "Question Breakdown" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "table",
            {
              className: "w-full text-sm",
              "data-ocid": "result_detail.questions_table",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-2.5 font-medium text-muted-foreground w-12", children: "Q#" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-2.5 font-medium text-muted-foreground", children: "Detected" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-center px-3 py-2.5 font-medium text-muted-foreground", children: "Correct" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-3 py-2.5 font-medium text-muted-foreground", children: "Status" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-3 py-2.5 font-medium text-muted-foreground", children: "Points" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: result.questionResults.map((qr, idx) => {
                  var _a;
                  const correctAnswer = ((_a = answerKey == null ? void 0 : answerKey.questions.find(
                    (q) => q.questionNumber === qr.questionNumber
                  )) == null ? void 0 : _a.correctAnswer) ?? null;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      className: "border-b border-border last:border-0 hover:bg-muted/20",
                      "data-ocid": `result_detail.question_row.${idx + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center font-mono text-xs text-muted-foreground", children: String(qr.questionNumber) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QuestionResultBadge, { result: qr, compact: true }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center justify-center w-7 h-7 rounded-full border border-accent/40 bg-accent/10 text-accent text-xs font-semibold", children: correctAnswer && correctAnswer !== "None" ? String(correctAnswer) : "—" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(QuestionResultBadge, { result: qr }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right font-mono text-xs tabular-nums", children: qr.pointsAwarded.toFixed(1) })
                      ]
                    },
                    String(qr.questionNumber)
                  );
                }) })
              ]
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground text-sm", children: "Annotated Answer Grid" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded-full bg-accent inline-block" }),
                "Correct"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded-full bg-destructive inline-block" }),
                "Incorrect"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded-full bg-muted-foreground inline-block" }),
                "Empty/Other"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BubbleGrid, { questionResults: result.questionResults }) })
        ] })
      ] })
    }
  );
}
export {
  ResultDetailPage as default
};
