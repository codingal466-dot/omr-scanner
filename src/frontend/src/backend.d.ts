import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ScoreBreakdown {
    questionResults: Array<QuestionResult>;
    maxPossibleScore: number;
    totalScore: number;
    incorrectCount: bigint;
    correctCount: bigint;
    emptyCount: bigint;
    percentage: number;
    anomalyCount: bigint;
}
export type Timestamp = bigint;
export interface AnswerKeyInput {
    name: string;
    penaltyPerWrong: number;
    questions: Array<QuestionKey>;
    questionCount: bigint;
}
export interface ScanResult {
    id: ScanResultId;
    studentId: string;
    studentName: string;
    answerKeyId: AnswerKeyId;
    questionResults: Array<QuestionResult>;
    totalScore: number;
    timestamp: Timestamp;
    studentClass: string;
    percentage: number;
}
export interface ScanInput {
    studentId: string;
    detectedAnswers: Array<Variant_A_B_C_D_E_None>;
    studentName: string;
    answerKeyId: AnswerKeyId;
    studentClass: string;
}
export interface AnswerKey {
    id: AnswerKeyId;
    name: string;
    penaltyPerWrong: number;
    questions: Array<QuestionKey>;
    questionCount: bigint;
}
export interface QuestionKey {
    pointValue: number;
    correctAnswer: AnswerChoice;
    questionNumber: bigint;
}
export type ScanResultId = bigint;
export type AnswerKeyId = bigint;
export interface QuestionResult {
    status: AnswerStatus;
    pointsAwarded: number;
    detectedAnswer: Variant_A_B_C_D_E_None;
    questionNumber: bigint;
}
export enum AnswerStatus {
    correct = "correct",
    empty = "empty",
    incorrect = "incorrect",
    anomaly = "anomaly"
}
export enum Variant_A_B_C_D_E_None {
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    E = "E",
    None = "None"
}
export interface backendInterface {
    createAnswerKey(input: AnswerKeyInput): Promise<AnswerKey>;
    deleteAnswerKey(id: AnswerKeyId): Promise<boolean>;
    deleteScanResult(id: ScanResultId): Promise<boolean>;
    getAnswerKey(id: AnswerKeyId): Promise<AnswerKey | null>;
    getScanResult(id: ScanResultId): Promise<ScanResult | null>;
    gradeAnswers(answerKeyId: AnswerKeyId, detectedAnswers: Array<Variant_A_B_C_D_E_None>): Promise<ScoreBreakdown | null>;
    listAnswerKeys(): Promise<Array<AnswerKey>>;
    listScanResults(): Promise<Array<ScanResult>>;
    submitScan(input: ScanInput): Promise<ScanResult>;
    updateAnswerKey(id: AnswerKeyId, input: AnswerKeyInput): Promise<boolean>;
}
