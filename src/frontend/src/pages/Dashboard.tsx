import { EmptyState } from "@/components/EmptyState";
import { Layout } from "@/components/Layout";
import { ProgressRing } from "@/components/ProgressRing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnswerKeys, useScanResults } from "@/hooks/useBackend";
import { useRouter } from "@tanstack/react-router";
import {
  BookOpen,
  ClipboardList,
  FileText,
  ScanLine,
  TrendingUp,
} from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  sub?: string;
}) {
  return (
    <Card className="bg-card border-border shadow-sm">
      <CardContent className="p-5 flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {value}
          </p>
          <p className="text-sm font-medium text-foreground/80">{label}</p>
          {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const { data: scanResults = [], isLoading: loadingScans } = useScanResults();
  const { data: answerKeys = [], isLoading: loadingKeys } = useAnswerKeys();

  const totalScans = scanResults.length;
  const avgScore =
    totalScans > 0
      ? scanResults.reduce((sum, r) => sum + r.percentage, 0) / totalScans
      : 0;
  const keyCount = answerKeys.length;

  const recent = [...scanResults]
    .sort((a, b) => Number(b.timestamp - a.timestamp))
    .slice(0, 8);

  const keyMap = new Map(answerKeys.map((k) => [k.id.toString(), k.name]));

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

  return (
    <Layout
      title="Dashboard"
      actions={
        <>
          <Button
            size="sm"
            onClick={() => router.navigate({ to: "/scan" })}
            data-ocid="dashboard.scan_button"
          >
            <ScanLine className="h-4 w-4 mr-1.5" />
            Scan Sheet
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.navigate({ to: "/answer-keys" })}
            data-ocid="dashboard.manage_keys_button"
          >
            <BookOpen className="h-4 w-4 mr-1.5" />
            Answer Keys
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {loadingScans || loadingKeys ? (
            ["s1", "s2", "s3", "s4"].map((sk) => (
              <Card key={sk} className="bg-card">
                <CardContent className="p-5">
                  <Skeleton className="h-7 w-20 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <StatCard
                label="Total Scans"
                value={totalScans}
                icon={FileText}
                sub="All time"
              />
              <StatCard
                label="Average Score"
                value={`${avgScore.toFixed(1)}%`}
                icon={TrendingUp}
                sub={totalScans > 0 ? "Across all students" : "No data yet"}
              />
              <StatCard
                label="Answer Keys"
                value={keyCount}
                icon={BookOpen}
                sub="Active keys"
              />
              <StatCard
                label="Recent Scans"
                value={Math.min(totalScans, 7)}
                icon={ClipboardList}
                sub="Last 7 days"
              />
            </>
          )}
        </div>

        {/* Recent scans table */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Recent Scans
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => router.navigate({ to: "/results" })}
              data-ocid="dashboard.view_all_button"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {loadingScans ? (
              <div className="px-4 pb-4 space-y-2">
                {["r1", "r2", "r3", "r4", "r5"].map((sk) => (
                  <Skeleton key={sk} className="h-10 w-full" />
                ))}
              </div>
            ) : recent.length === 0 ? (
              <EmptyState
                icon={ScanLine}
                title="No scans yet"
                description="Scan your first answer sheet to see results here."
                actionLabel="Scan Sheet"
                onAction={() => router.navigate({ to: "/scan" })}
                data-ocid="dashboard.empty_state"
              />
            ) : (
              <div className="overflow-x-auto">
                <table
                  className="w-full text-sm"
                  data-ocid="dashboard.results_table"
                >
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">
                        Student
                      </th>
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">
                        Class
                      </th>
                      <th className="text-right px-4 py-2.5 font-medium text-muted-foreground">
                        Score
                      </th>
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground hidden sm:table-cell">
                        Answer Key
                      </th>
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground hidden md:table-cell">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((r, idx) => (
                      <tr
                        key={r.id.toString()}
                        className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer transition-colors duration-150"
                        onClick={() =>
                          router.navigate({ to: `/results/${r.id}` })
                        }
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          router.navigate({ to: `/results/${r.id}` })
                        }
                        tabIndex={0}
                        data-ocid={`dashboard.result_row.${idx + 1}`}
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground truncate max-w-[140px]">
                            {r.studentName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {r.studentId}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {r.studentClass}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <ProgressRing
                              value={r.percentage}
                              size={28}
                              strokeWidth={3}
                              showLabel={false}
                            />
                            <Badge
                              variant={getPctBadgeVariant(r.percentage)}
                              className="tabular-nums text-xs"
                            >
                              {r.percentage.toFixed(1)}%
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell truncate max-w-[120px]">
                          {keyMap.get(r.answerKeyId.toString()) ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell whitespace-nowrap">
                          {formatDate(r.timestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => router.navigate({ to: "/scan" })}
            className="group flex items-start gap-4 p-5 rounded-lg border border-dashed border-border hover:border-primary/60 hover:bg-primary/5 transition-smooth text-left"
            data-ocid="dashboard.quick_scan_button"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center shrink-0 transition-smooth">
              <ScanLine className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Scan New Sheet</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Use your camera or upload an image to grade a student's answer
                sheet.
              </p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => router.navigate({ to: "/answer-keys" })}
            className="group flex items-start gap-4 p-5 rounded-lg border border-dashed border-border hover:border-primary/60 hover:bg-primary/5 transition-smooth text-left"
            data-ocid="dashboard.quick_keys_button"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center shrink-0 transition-smooth">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">
                Manage Answer Keys
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Create or edit answer keys used to automatically grade scanned
                sheets.
              </p>
            </div>
          </button>
        </div>
      </div>
    </Layout>
  );
}
