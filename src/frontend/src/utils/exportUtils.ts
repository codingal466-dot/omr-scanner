import type {
  AnswerKey,
  QuestionResult,
  ScanResult,
  ScoreBreakdown,
} from "@/types/omr";

// ---------------------------------------------------------------------------
// CSV Export
// ---------------------------------------------------------------------------

function escapeCsvCell(val: string | number): string {
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function rowToCsv(cells: (string | number)[]): string {
  return cells.map(escapeCsvCell).join(",");
}

function downloadCsv(filename: string, rows: string[]): void {
  const content = rows.join("\n");
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export interface CsvScanRow {
  result: ScanResult;
  answerKeyName: string;
  answerKey?: AnswerKey;
}

export function exportResultsCsv(rows: CsvScanRow[]): void {
  const header = rowToCsv([
    "Student Name",
    "Student ID",
    "Class",
    "Score",
    "Max Score",
    "Percentage",
    "Answer Key",
    "Date",
  ]);

  const dataRows = rows.map(({ result, answerKeyName, answerKey }) => {
    const maxScore = answerKey
      ? answerKey.questions.reduce((sum, q) => sum + q.pointValue, 0)
      : result.questionResults.reduce(
          (sum, qr) => sum + Math.max(0, qr.pointsAwarded),
          0,
        );
    return rowToCsv([
      result.studentName,
      result.studentId,
      result.studentClass,
      result.totalScore.toFixed(2),
      maxScore.toFixed(2),
      `${result.percentage.toFixed(1)}%`,
      answerKeyName,
      new Date(Number(result.timestamp) / 1_000_000).toLocaleDateString(),
    ]);
  });

  downloadCsv(`omr-results-${new Date().toISOString().slice(0, 10)}.csv`, [
    header,
    ...dataRows,
  ]);
}

// ---------------------------------------------------------------------------
// PDF Export (via window.print)
// ---------------------------------------------------------------------------

export function exportResultPdf(
  result: ScanResult,
  breakdown: ScoreBreakdown,
  answerKey: AnswerKey | null,
): void {
  const date = new Date(
    Number(result.timestamp) / 1_000_000,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const grade =
    breakdown.percentage >= 90
      ? "A"
      : breakdown.percentage >= 80
        ? "B"
        : breakdown.percentage >= 70
          ? "C"
          : breakdown.percentage >= 60
            ? "D"
            : "F";

  const questionRows = result.questionResults
    .map((qr) => {
      const correct =
        answerKey?.questions.find((q) => q.questionNumber === qr.questionNumber)
          ?.correctAnswer ?? "?";
      const statusLabel =
        qr.status === "correct"
          ? "✓ Correct"
          : qr.status === "incorrect"
            ? "✗ Incorrect"
            : qr.status === "empty"
              ? "— Empty"
              : "⚠ Anomaly";
      const statusColor =
        qr.status === "correct"
          ? "#16a34a"
          : qr.status === "incorrect"
            ? "#dc2626"
            : qr.status === "empty"
              ? "#6b7280"
              : "#d97706";
      return `<tr>
        <td style="text-align:center;">${qr.questionNumber}</td>
        <td style="text-align:center;font-weight:600;">${qr.detectedAnswer === "None" ? "—" : qr.detectedAnswer}</td>
        <td style="text-align:center;">${correct === "None" ? "—" : correct}</td>
        <td style="text-align:center;color:${statusColor};font-weight:500;">${statusLabel}</td>
        <td style="text-align:center;">${qr.pointsAwarded.toFixed(1)}</td>
      </tr>`;
    })
    .join("");

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>OMR Result — ${result.studentName}</title>
<style>
  @media print { @page { margin: 1.5cm; } }
  body { font-family: Arial, sans-serif; font-size: 12px; color: #111; }
  h1 { font-size: 18px; margin: 0 0 4px; }
  h2 { font-size: 14px; color: #444; margin: 0 0 16px; font-weight: normal; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; margin-bottom: 20px; }
  .info-grid .label { color: #666; }
  .score-box { display: flex; gap: 32px; align-items: flex-start; border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 24px; }
  .big-score { font-size: 40px; font-weight: 700; }
  .grade { font-size: 20px; color: #666; margin-left: 4px; }
  .stat { text-align: center; }
  .stat .val { font-size: 22px; font-weight: 700; }
  .stat .lbl { font-size: 11px; color: #888; }
  table { width: 100%; border-collapse: collapse; }
  th { background: #f3f4f6; font-weight: 600; padding: 7px 10px; border: 1px solid #e5e7eb; text-align: center; }
  td { padding: 6px 10px; border: 1px solid #e5e7eb; }
  tr:nth-child(even) { background: #fafafa; }
  .footer { margin-top: 24px; font-size: 10px; color: #999; text-align: center; }
</style>
</head>
<body>
<h1>EduScan OMR — Result Report</h1>
<h2>${answerKey?.name ?? "Unknown Answer Key"}</h2>
<div class="info-grid">
  <span class="label">Student Name:</span><span><strong>${result.studentName}</strong></span>
  <span class="label">Student ID:</span><span>${result.studentId}</span>
  <span class="label">Class:</span><span>${result.studentClass}</span>
  <span class="label">Date:</span><span>${date}</span>
</div>
<div class="score-box">
  <div>
    <div class="big-score">${breakdown.percentage.toFixed(1)}%<span class="grade">${grade}</span></div>
    <div style="font-size:13px;color:#555;">${breakdown.totalScore.toFixed(1)} / ${breakdown.maxPossibleScore.toFixed(1)} points</div>
  </div>
  <div class="stat"><div class="val" style="color:#16a34a;">${breakdown.correctCount}</div><div class="lbl">Correct</div></div>
  <div class="stat"><div class="val" style="color:#dc2626;">${breakdown.incorrectCount}</div><div class="lbl">Incorrect</div></div>
  <div class="stat"><div class="val" style="color:#6b7280;">${breakdown.emptyCount}</div><div class="lbl">Empty</div></div>
  <div class="stat"><div class="val" style="color:#d97706;">${breakdown.anomalyCount}</div><div class="lbl">Anomaly</div></div>
</div>
<table>
  <thead><tr><th>Q#</th><th>Detected</th><th>Correct</th><th>Status</th><th>Points</th></tr></thead>
  <tbody>${questionRows}</tbody>
</table>
<div class="footer">Generated by EduScan OMR &bull; ${new Date().toLocaleString()}</div>
</body>
</html>`;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 400);
}

// Helper to compute a per-result ScoreBreakdown client-side from QuestionResults
export function computeBreakdown(
  questionResults: QuestionResult[],
  answerKey: AnswerKey | null,
): ScoreBreakdown {
  let correct = 0n;
  let incorrect = 0n;
  let empty = 0n;
  let anomaly = 0n;
  let totalScore = 0;
  let maxPossibleScore = 0;

  for (const qr of questionResults) {
    const key = answerKey?.questions.find(
      (q) => q.questionNumber === qr.questionNumber,
    );
    const pointValue = key?.pointValue ?? 1;
    maxPossibleScore += pointValue;

    if (qr.status === "correct") {
      correct++;
      totalScore += qr.pointsAwarded;
    } else if (qr.status === "incorrect") {
      incorrect++;
      totalScore += qr.pointsAwarded; // may be negative if penalty
    } else if (qr.status === "empty") {
      empty++;
    } else {
      anomaly++;
    }
  }

  const percentage =
    maxPossibleScore > 0
      ? Math.min(100, Math.max(0, (totalScore / maxPossibleScore) * 100))
      : 0;

  return {
    questionResults,
    correctCount: correct,
    incorrectCount: incorrect,
    emptyCount: empty,
    anomalyCount: anomaly,
    totalScore,
    maxPossibleScore,
    percentage,
  };
}
