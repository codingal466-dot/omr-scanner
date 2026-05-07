import { u as useRouter, r as reactExports, j as jsxRuntimeExports, S as Skeleton } from "./index-COsGoTS5.js";
import { C as Card, a as CardContent, E as EmptyState } from "./card-B6Y2qsj6.js";
import { c as createLucideIcon, u as useScanResults, a as useAnswerKeys, k as useDeleteScanResult, L as Layout, C as ClipboardList, d as Badge, b as Button } from "./useBackend-gHfQ_2dy.js";
import { P as ProgressRing } from "./ProgressRing-CW0rNeEP.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-VTpERKLb.js";
import { e as exportResultsCsv } from "./exportUtils-DnTP72Ay.js";
import { T as Trash2 } from "./trash-2-BQ6p8vss.js";
import "./index-DiGzqMrz.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode);
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
function ResultsPage() {
  const router = useRouter();
  const { data: results = [], isLoading } = useScanResults();
  const { data: answerKeys = [] } = useAnswerKeys();
  const deleteMutation = useDeleteScanResult();
  const [filterKeyId, setFilterKeyId] = reactExports.useState("all");
  const [sortKey, setSortKey] = reactExports.useState("date_desc");
  const [confirmDeleteId, setConfirmDeleteId] = reactExports.useState(null);
  const keyMap = new Map(answerKeys.map((k) => [k.id.toString(), k]));
  const filtered = filterKeyId === "all" ? results : results.filter((r) => r.answerKeyId.toString() === filterKeyId);
  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === "date_desc") return Number(b.timestamp - a.timestamp);
    if (sortKey === "date_asc") return Number(a.timestamp - b.timestamp);
    if (sortKey === "score_desc") return b.percentage - a.percentage;
    return a.percentage - b.percentage;
  });
  function handleExportCsv() {
    exportResultsCsv(
      sorted.map((r) => {
        var _a;
        return {
          result: r,
          answerKeyName: ((_a = keyMap.get(r.answerKeyId.toString())) == null ? void 0 : _a.name) ?? "Unknown",
          answerKey: keyMap.get(r.answerKeyId.toString())
        };
      })
    );
  }
  async function handleDelete(id) {
    await deleteMutation.mutateAsync(id);
    setConfirmDeleteId(null);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Layout,
    {
      title: "Past Results",
      actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          variant: "outline",
          onClick: handleExportCsv,
          disabled: sorted.length === 0,
          "data-ocid": "results.export_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-1.5" }),
            "Export CSV"
          ]
        }
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 bg-card border border-border rounded-lg px-4 py-3 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Filter:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterKeyId, onValueChange: setFilterKeyId, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "w-44 h-8 text-sm",
                  "data-ocid": "results.filter_key_select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Answer Keys" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Answer Keys" }),
                answerKeys.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: k.id.toString(), children: k.name }, k.id.toString()))
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-muted-foreground ml-auto", children: "Sort:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: sortKey,
                onValueChange: (v) => setSortKey(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "w-40 h-8 text-sm",
                      "data-ocid": "results.sort_select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "date_desc", children: "Newest First" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "date_asc", children: "Oldest First" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "score_desc", children: "Highest Score" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "score_asc", children: "Lowest Score" })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
              sorted.length,
              " result",
              sorted.length !== 1 ? "s" : ""
            ] })
          ] }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((sk) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-32" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full" })
          ] }) }, sk)) }) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: ClipboardList,
              title: "No results found",
              description: filterKeyId !== "all" ? "No results match this filter. Try selecting a different answer key." : "Scan your first answer sheet to see results here.",
              actionLabel: filterKeyId !== "all" ? "Clear filter" : "Scan Sheet",
              onAction: filterKeyId !== "all" ? () => setFilterKeyId("all") : () => router.navigate({ to: "/scan" }),
              "data-ocid": "results.empty_state"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: sorted.map((r, idx) => {
            var _a;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              Card,
              {
                className: "bg-card border-border shadow-sm hover:shadow-md transition-smooth group cursor-pointer",
                onClick: () => router.navigate({ to: `/results/${r.id}` }),
                "data-ocid": `results.result_card.${idx + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      ProgressRing,
                      {
                        value: r.percentage,
                        size: 44,
                        strokeWidth: 4,
                        showLabel: true,
                        className: "shrink-0 mt-0.5"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground truncate", children: r.studentName }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                        r.studentClass,
                        " • ",
                        r.studentId
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Badge,
                        {
                          variant: getPctBadgeVariant(r.percentage),
                          className: "mt-1 text-xs tabular-nums",
                          children: [
                            r.percentage.toFixed(1),
                            "% —",
                            " ",
                            r.totalScore.toFixed(1),
                            "pts"
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        className: "opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive",
                        onClick: (e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(r.id);
                        },
                        "aria-label": "Delete result",
                        "data-ocid": `results.delete_button.${idx + 1}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: ((_a = keyMap.get(r.answerKeyId.toString())) == null ? void 0 : _a.name) ?? "Unknown Key" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 ml-2", children: formatDate(r.timestamp) })
                  ] })
                ] })
              },
              r.id.toString()
            );
          }) })
        ] }),
        confirmDeleteId !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm",
            "data-ocid": "results.confirm_dialog",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl shadow-xl p-6 max-w-sm w-full mx-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-foreground mb-1", children: "Delete result?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-5", children: "This action is permanent and cannot be undone." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => setConfirmDeleteId(null),
                    "data-ocid": "results.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "destructive",
                    size: "sm",
                    onClick: () => handleDelete(confirmDeleteId),
                    disabled: deleteMutation.isPending,
                    "data-ocid": "results.confirm_button",
                    children: deleteMutation.isPending ? "Deleting…" : "Delete"
                  }
                )
              ] })
            ] })
          }
        )
      ]
    }
  );
}
export {
  ResultsPage as default
};
