import type {
  AnswerKey,
  AnswerKeyId,
  AnswerKeyInput,
  AnswerStatus,
  QuestionKey,
  QuestionResult,
  ScanInput,
  ScanResult,
  ScanResultId,
  ScoreBreakdown,
  Variant_A_B_C_D_E_None,
} from "@/backend";

// Re-export backend types with cleaner aliases
export type {
  AnswerKey,
  AnswerKeyId,
  AnswerKeyInput,
  AnswerStatus,
  QuestionKey,
  QuestionResult,
  ScanInput,
  ScanResult,
  ScanResultId,
  ScoreBreakdown,
};

export type { Variant_A_B_C_D_E_None as AnswerChoice };

// UI-specific types
export type NavItem = {
  label: string;
  href: string;
  icon: string;
};

export type ScanStatus =
  | "idle"
  | "scanning"
  | "processing"
  | "complete"
  | "error";

export type CameraState = {
  active: boolean;
  stream: MediaStream | null;
  error: string | null;
};
