import { EmptyState } from "@/components/EmptyState";
import { Layout } from "@/components/Layout";
import { ProgressRing } from "@/components/ProgressRing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAnswerKeys,
  useDeleteScanResult,
  useScanResults,
} from "@/hooks/useBackend";
import type { ScanResult } from "@/types/omr";
import { exportResultsCsv } from "@/utils/exportUtils";
import { useRouter } from "@tanstack/react-router";
import { ClipboardList, Download, Trash2 } from "lucide-react";
import { useState } from "react";

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getPctBadgeVariant(
  pct: number,
): "default" | "secondary" | "destructive" {
  if (pct >= 80) return "default";
  if (pct >= 60) return "secondary";
  return "destructive";
}

type SortKey = "date_desc" | "date_asc" | "score_desc" | "score_asc";

export default function ResultsPage() {
  const router = useRouter();
  const { data: results = [], isLoading } = useScanResults();
  const { data: answerKeys = [] } = useAnswerKeys();
  const deleteMutation = useDeleteScanResult();

  const [filterKeyId, setFilterKeyId] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("date_desc");
  const [confirmDeleteId, setConfirmDeleteId] = useState<bigint | null>(null);

  const keyMap = new Map(answerKeys.map((k) => [k.id.toString(), k]));

  const filtered: ScanResult[] =
    filterKeyId === "all"
      ? results
      : results.filter((r) => r.answerKeyId.toString() === filterKeyId);

  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === "date_desc") return Number(b.timestamp - a.timestamp);
    if (sortKey === "date_asc") return Number(a.timestamp - b.timestamp);
    if (sortKey === "score_desc") return b.percentage - a.percentage;
    return a.percentage - b.percentage;
  });

  function handleExportCsv() {
    exportResultsCsv(
      sorted.map((r) => ({
        result: r,
        answerKeyName: keyMap.get(r.answerKeyId.toString())?.name ?? "Unknown",
        answerKey: keyMap.get(r.answerKeyId.toString()),
      })),
    );
  }

  async function handleDelete(id: bigint) {
    await deleteMutation.mutateAsync(id);
    setConfirmDeleteId(null);
  }

  return (
    <Layout
      title="Past Results"
      actions={
        <Button
          size="sm"
          variant="outline"
          onClick={handleExportCsv}
          disabled={sorted.length === 0}
          data-ocid="results.export_button"
        >
          <Download className="h-4 w-4 mr-1.5" />
          Export CSV
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 bg-card border border-border rounded-lg px-4 py-3 shadow-sm">
          <span className="text-sm font-medium text-muted-foreground">
            Filter:
          </span>
          <Select value={filterKeyId} onValueChange={setFilterKeyId}>
            <SelectTrigger
              className="w-44 h-8 text-sm"
              data-ocid="results.filter_key_select"
            >
              <SelectValue placeholder="All Answer Keys" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Answer Keys</SelectItem>
              {answerKeys.map((k) => (
                <SelectItem key={k.id.toString()} value={k.id.toString()}>
                  {k.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm font-medium text-muted-foreground ml-auto">
            Sort:
          </span>
          <Select
            value={sortKey}
            onValueChange={(v) => setSortKey(v as SortKey)}
          >
            <SelectTrigger
              className="w-40 h-8 text-sm"
              data-ocid="results.sort_select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date_desc">Newest First</SelectItem>
              <SelectItem value="date_asc">Oldest First</SelectItem>
              <SelectItem value="score_desc">Highest Score</SelectItem>
              <SelectItem value="score_asc">Lowest Score</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-xs text-muted-foreground">
            {sorted.length} result{sorted.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Results grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"].map((sk) => (
              <Card key={sk} className="bg-card">
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No results found"
            description={
              filterKeyId !== "all"
                ? "No results match this filter. Try selecting a different answer key."
                : "Scan your first answer sheet to see results here."
            }
            actionLabel={filterKeyId !== "all" ? "Clear filter" : "Scan Sheet"}
            onAction={
              filterKeyId !== "all"
                ? () => setFilterKeyId("all")
                : () => router.navigate({ to: "/scan" })
            }
            data-ocid="results.empty_state"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((r, idx) => (
              <Card
                key={r.id.toString()}
                className="bg-card border-border shadow-sm hover:shadow-md transition-smooth group cursor-pointer"
                onClick={() => router.navigate({ to: `/results/${r.id}` })}
                data-ocid={`results.result_card.${idx + 1}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <ProgressRing
                      value={r.percentage}
                      size={44}
                      strokeWidth={4}
                      showLabel
                      className="shrink-0 mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground truncate">
                        {r.studentName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {r.studentClass} &bull; {r.studentId}
                      </p>
                      <Badge
                        variant={getPctBadgeVariant(r.percentage)}
                        className="mt-1 text-xs tabular-nums"
                      >
                        {r.percentage.toFixed(1)}% &mdash;{" "}
                        {r.totalScore.toFixed(1)}pts
                      </Badge>
                    </div>
                    <button
                      type="button"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteId(r.id);
                      }}
                      aria-label="Delete result"
                      data-ocid={`results.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                    <span className="truncate">
                      {keyMap.get(r.answerKeyId.toString())?.name ??
                        "Unknown Key"}
                    </span>
                    <span className="shrink-0 ml-2">
                      {formatDate(r.timestamp)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm dialog */}
      {confirmDeleteId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm"
          data-ocid="results.confirm_dialog"
        >
          <div className="bg-card border border-border rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Delete result?
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              This action is permanent and cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDeleteId(null)}
                data-ocid="results.cancel_button"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deleteMutation.isPending}
                data-ocid="results.confirm_button"
              >
                {deleteMutation.isPending ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
