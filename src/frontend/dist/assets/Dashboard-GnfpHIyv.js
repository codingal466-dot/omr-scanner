import { u as useRouter, j as jsxRuntimeExports, S as Skeleton } from "./index-COsGoTS5.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle, E as EmptyState } from "./card-B6Y2qsj6.js";
import { c as createLucideIcon, u as useScanResults, a as useAnswerKeys, L as Layout, B as BookOpen, C as ClipboardList, b as Button, S as ScanLine, d as Badge } from "./useBackend-gHfQ_2dy.js";
import { P as ProgressRing } from "./ProgressRing-CW0rNeEP.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 7h6v6", key: "box55l" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17", key: "1t1m79" }]
];
const TrendingUp = createLucideIcon("trending-up", __iconNode);
function StatCard({
  label,
  value,
  icon: Icon,
  sub
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card border-border shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 flex items-start gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-5 w-5 text-primary" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground tabular-nums", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground/80", children: label }),
      sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: sub })
    ] })
  ] }) });
}
function Dashboard() {
  const router = useRouter();
  const { data: scanResults = [], isLoading: loadingScans } = useScanResults();
  const { data: answerKeys = [], isLoading: loadingKeys } = useAnswerKeys();
  const totalScans = scanResults.length;
  const avgScore = totalScans > 0 ? scanResults.reduce((sum, r) => sum + r.percentage, 0) / totalScans : 0;
  const keyCount = answerKeys.length;
  const recent = [...scanResults].sort((a, b) => Number(b.timestamp - a.timestamp)).slice(0, 8);
  const keyMap = new Map(answerKeys.map((k) => [k.id.toString(), k.name]));
  function formatDate(ts) {
    return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }
  function getPctBadgeVariant(pct) {
    if (pct >= 80) return "default";
    if (pct >= 60) return "secondary";
    return "destructive";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Layout,
    {
      title: "Dashboard",
      actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: () => router.navigate({ to: "/scan" }),
            "data-ocid": "dashboard.scan_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-4 w-4 mr-1.5" }),
              "Scan Sheet"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => router.navigate({ to: "/answer-keys" }),
            "data-ocid": "dashboard.manage_keys_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4 mr-1.5" }),
              "Answer Keys"
            ]
          }
        )
      ] }),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: loadingScans || loadingKeys ? ["s1", "s2", "s3", "s4"].map((sk) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-20 mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-32" })
        ] }) }, sk)) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "Total Scans",
              value: totalScans,
              icon: FileText,
              sub: "All time"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "Average Score",
              value: `${avgScore.toFixed(1)}%`,
              icon: TrendingUp,
              sub: totalScans > 0 ? "Across all students" : "No data yet"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "Answer Keys",
              value: keyCount,
              icon: BookOpen,
              sub: "Active keys"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              label: "Recent Scans",
              value: Math.min(totalScans, 7),
              icon: ClipboardList,
              sub: "Last 7 days"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card border-border shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3 flex flex-row items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold", children: "Recent Scans" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "text-xs",
                onClick: () => router.navigate({ to: "/results" }),
                "data-ocid": "dashboard.view_all_button",
                children: "View All"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: loadingScans ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-4 space-y-2", children: ["r1", "r2", "r3", "r4", "r5"].map((sk) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }, sk)) }) : recent.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: ScanLine,
              title: "No scans yet",
              description: "Scan your first answer sheet to see results here.",
              actionLabel: "Scan Sheet",
              onAction: () => router.navigate({ to: "/scan" }),
              "data-ocid": "dashboard.empty_state"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "table",
            {
              className: "w-full text-sm",
              "data-ocid": "dashboard.results_table",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/40", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 font-medium text-muted-foreground", children: "Student" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 font-medium text-muted-foreground", children: "Class" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-2.5 font-medium text-muted-foreground", children: "Score" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 font-medium text-muted-foreground hidden sm:table-cell", children: "Answer Key" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-2.5 font-medium text-muted-foreground hidden md:table-cell", children: "Date" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: recent.map((r, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer transition-colors duration-150",
                    onClick: () => router.navigate({ to: `/results/${r.id}` }),
                    onKeyDown: (e) => e.key === "Enter" && router.navigate({ to: `/results/${r.id}` }),
                    tabIndex: 0,
                    "data-ocid": `dashboard.result_row.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-foreground truncate max-w-[140px]", children: r.studentName }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: r.studentId })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: r.studentClass }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          ProgressRing,
                          {
                            value: r.percentage,
                            size: 28,
                            strokeWidth: 3,
                            showLabel: false
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Badge,
                          {
                            variant: getPctBadgeVariant(r.percentage),
                            className: "tabular-nums text-xs",
                            children: [
                              r.percentage.toFixed(1),
                              "%"
                            ]
                          }
                        )
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden sm:table-cell truncate max-w-[120px]", children: keyMap.get(r.answerKeyId.toString()) ?? "—" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden md:table-cell whitespace-nowrap", children: formatDate(r.timestamp) })
                    ]
                  },
                  r.id.toString()
                )) })
              ]
            }
          ) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => router.navigate({ to: "/scan" }),
              className: "group flex items-start gap-4 p-5 rounded-lg border border-dashed border-border hover:border-primary/60 hover:bg-primary/5 transition-smooth text-left",
              "data-ocid": "dashboard.quick_scan_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center shrink-0 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScanLine, { className: "h-5 w-5 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Scan New Sheet" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Use your camera or upload an image to grade a student's answer sheet." })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => router.navigate({ to: "/answer-keys" }),
              className: "group flex items-start gap-4 p-5 rounded-lg border border-dashed border-border hover:border-primary/60 hover:bg-primary/5 transition-smooth text-left",
              "data-ocid": "dashboard.quick_keys_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center shrink-0 transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-5 w-5 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Manage Answer Keys" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Create or edit answer keys used to automatically grade scanned sheets." })
                ] })
              ]
            }
          )
        ] })
      ] })
    }
  );
}
export {
  Dashboard as default
};
