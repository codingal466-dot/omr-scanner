import { Variant_A_B_C_D_E_None } from "@/backend";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAnswerKeys, useSubmitScan } from "@/hooks/useBackend";
import type { AnswerChoice } from "@/types/omr";
import {
  captureFrameFromFile,
  captureFrameFromVideo,
  detectBubbles,
} from "@/utils/bubbleDetection";
import { useRouter } from "@tanstack/react-router";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  RefreshCw,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const CHOICES: AnswerChoice[] = [
  Variant_A_B_C_D_E_None.A,
  Variant_A_B_C_D_E_None.B,
  Variant_A_B_C_D_E_None.C,
  Variant_A_B_C_D_E_None.D,
  Variant_A_B_C_D_E_None.E,
];
const CHOICE_LABELS = ["A", "B", "C", "D", "E"];

type ScanPhase = "setup" | "camera" | "captured";

function DetectedAnswersOverlay({
  answers,
  onCorrect,
}: {
  answers: AnswerChoice[];
  onCorrect: (idx: number, choice: AnswerChoice) => void;
}) {
  const cols = answers.length > 40 ? 3 : answers.length > 20 ? 2 : 1;
  return (
    <div
      className="grid gap-0.5"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {answers.map((answer, i) => (
        <div
          key={`q-${i + 1}`}
          className="flex items-center gap-0.5"
          data-ocid={`scan.detected_answer.${i + 1}`}
        >
          <span className="w-6 text-right text-[10px] text-muted-foreground font-mono shrink-0">
            {i + 1}.
          </span>
          {CHOICES.map((ch, ci) => (
            <button
              key={CHOICE_LABELS[ci]}
              type="button"
              onClick={() => onCorrect(i, ch)}
              className={`w-6 h-6 rounded text-[10px] font-semibold border transition-colors ${
                answer === ch
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground/50 border-border hover:border-primary/40"
              }`}
              aria-pressed={answer === ch}
            >
              {CHOICE_LABELS[ci]}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function ScanPage() {
  const router = useRouter();
  const { data: answerKeys = [] } = useAnswerKeys();
  const submitMutation = useSubmitScan();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [phase, setPhase] = useState<ScanPhase>("setup");
  const [selectedKeyId, setSelectedKeyId] = useState<string>("");
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [detectedAnswers, setDetectedAnswers] = useState<AnswerChoice[]>([]);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const selectedKey =
    answerKeys.find((k) => k.id.toString() === selectedKeyId) ?? null;

  // Cleanup camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) track.stop();
      streamRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  async function startCamera() {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setPhase("camera");
    } catch (err) {
      const msg =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Camera permission denied. Please allow camera access or use file upload."
          : "Could not access camera. Please use file upload instead.";
      setCameraError(msg);
    }
  }

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current || !selectedKey) return;
    const imageData = captureFrameFromVideo(
      videoRef.current,
      canvasRef.current,
    );
    if (!imageData) {
      setDetectionError("Failed to capture image from camera.");
      return;
    }
    processImageData(imageData, canvasRef.current);
    stopCamera();
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !canvasRef.current || !selectedKey) return;
    const imageData = await captureFrameFromFile(file, canvasRef.current);
    if (!imageData) {
      setDetectionError("Failed to read the uploaded image.");
      return;
    }
    processImageData(imageData, canvasRef.current);
  }

  function processImageData(imageData: ImageData, canvas: HTMLCanvasElement) {
    setDetectionError(null);
    if (!selectedKey) return;
    const qCount = Number(selectedKey.questionCount);
    try {
      const result = detectBubbles(imageData, qCount);
      if (
        result.confidence < 0.15 &&
        result.detectedAnswers.every((a) => a === Variant_A_B_C_D_E_None.None)
      ) {
        setDetectionError(
          "Bubble detection confidence is very low. Please ensure the answer sheet is clearly visible.",
        );
      }
      setDetectedAnswers(result.detectedAnswers);
    } catch {
      setDetectionError(
        "Bubble detection failed. Please retake the photo or adjust the sheet position.",
      );
      setDetectedAnswers([]);
    }
    setCapturedDataUrl(canvas.toDataURL("image/jpeg", 0.85));
    setPhase("captured");
  }

  function correctAnswer(idx: number, choice: AnswerChoice) {
    setDetectedAnswers((prev) => {
      const next = [...prev];
      next[idx] = choice;
      return next;
    });
  }

  function resetScan() {
    stopCamera();
    setCapturedDataUrl(null);
    setDetectedAnswers([]);
    setDetectionError(null);
    setPhase("setup");
  }

  function validateForm(): boolean {
    const errs: Record<string, string> = {};
    if (!selectedKeyId) errs.key = "Please select an answer key.";
    if (!studentName.trim()) errs.name = "Student name is required.";
    if (!studentId.trim()) errs.id = "Student ID is required.";
    if (!studentClass.trim()) errs.class = "Class is required.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validateForm() || !selectedKey || detectedAnswers.length === 0) return;

    try {
      const result = await submitMutation.mutateAsync({
        answerKeyId: selectedKey.id,
        studentName: studentName.trim(),
        studentId: studentId.trim(),
        studentClass: studentClass.trim(),
        detectedAnswers,
      });
      router.navigate({ to: `/results/${result.id}` });
    } catch {
      setPhase("captured");
    }
  }

  return (
    <Layout title="Scan Answer Sheet">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Student info + key selector */}
        <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground mb-4">
            Student & Answer Key
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="s-name">Student Name</Label>
              <Input
                id="s-name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Emily Chen"
                data-ocid="scan.student_name_input"
              />
              {formErrors.name && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="scan.name_field_error"
                >
                  {formErrors.name}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-id">Student ID</Label>
              <Input
                id="s-id"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="e.g. STU-2024-001"
                data-ocid="scan.student_id_input"
              />
              {formErrors.id && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="scan.id_field_error"
                >
                  {formErrors.id}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-class">Class</Label>
              <Input
                id="s-class"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder="e.g. Grade 6B"
                data-ocid="scan.class_input"
              />
              {formErrors.class && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="scan.class_field_error"
                >
                  {formErrors.class}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="answer-key">Answer Key</Label>
              <Select value={selectedKeyId} onValueChange={setSelectedKeyId}>
                <SelectTrigger
                  id="answer-key"
                  data-ocid="scan.answer_key_select"
                >
                  <SelectValue placeholder="Select a key…" />
                </SelectTrigger>
                <SelectContent>
                  {answerKeys.map((k) => (
                    <SelectItem key={k.id.toString()} value={k.id.toString()}>
                      {k.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.key && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="scan.key_field_error"
                >
                  {formErrors.key}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Camera / preview area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: viewfinder or preview */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {phase === "captured"
                    ? "Captured Preview"
                    : "Camera / Upload"}
                </span>
                {phase === "captured" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetScan}
                    data-ocid="scan.retake_button"
                  >
                    <RefreshCw className="h-4 w-4 mr-1.5" />
                    Retake
                  </Button>
                )}
              </div>

              {phase === "setup" && (
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                  {cameraError && (
                    <div
                      className="flex items-start gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-md px-4 py-3 text-sm max-w-sm"
                      data-ocid="scan.camera_error_state"
                    >
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{cameraError}</span>
                    </div>
                  )}
                  <Button
                    size="lg"
                    onClick={startCamera}
                    disabled={!selectedKeyId}
                    data-ocid="scan.start_camera_button"
                  >
                    <Camera className="h-5 w-5 mr-2" />
                    Open Camera
                  </Button>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="h-px w-12 bg-border" />
                    or
                    <span className="h-px w-12 bg-border" />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!selectedKeyId}
                    data-ocid="scan.upload_button"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  {!selectedKeyId && (
                    <p className="text-xs text-muted-foreground">
                      Select an answer key above first.
                    </p>
                  )}
                </div>
              )}

              {phase === "camera" && (
                <div className="relative bg-foreground">
                  {/* biome-ignore lint/a11y/useMediaCaption: live camera viewfinder */}

                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full max-h-[460px] object-contain"
                  />
                  {/* Scan guide overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-4/5 h-3/4 border-2 border-dashed border-primary/60 rounded-lg" />
                  </div>
                  <div className="absolute bottom-4 inset-x-0 flex justify-center">
                    <Button
                      size="lg"
                      onClick={capturePhoto}
                      className="rounded-full w-16 h-16"
                      aria-label="Capture photo"
                      data-ocid="scan.capture_button"
                    >
                      <Camera className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              )}

              {phase === "captured" && capturedDataUrl && (
                <div>
                  <img
                    src={capturedDataUrl}
                    alt="Captured answer sheet"
                    className="w-full max-h-[460px] object-contain bg-foreground"
                  />
                </div>
              )}

              {/* Hidden canvas for processing */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>

          {/* Right: detected answers + submit */}
          <div className="space-y-4">
            {detectionError && (
              <div
                className="flex items-start gap-2 bg-muted border border-border text-foreground rounded-md px-4 py-3 text-sm"
                data-ocid="scan.detection_error_state"
              >
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{detectionError}</span>
              </div>
            )}

            {phase === "captured" && detectedAnswers.length > 0 ? (
              <div className="bg-card border border-border rounded-lg shadow-sm">
                <div className="px-4 py-3 border-b border-border bg-muted/30">
                  <p className="text-sm font-medium text-foreground">
                    Detected Answers
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Click to correct any misread bubble.
                  </p>
                </div>
                <div className="p-3 max-h-[360px] overflow-y-auto">
                  <DetectedAnswersOverlay
                    answers={detectedAnswers}
                    onCorrect={correctAnswer}
                  />
                </div>
              </div>
            ) : phase !== "setup" && phase !== "camera" ? (
              <div
                className="bg-card border border-border rounded-lg p-6 text-center text-sm text-muted-foreground"
                data-ocid="scan.answers_empty_state"
              >
                No answers detected yet. Capture a sheet above.
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Camera className="h-5 w-5" />
                  <span>
                    Detected answers will appear here after capturing a sheet.
                  </span>
                </div>
              </div>
            )}

            {phase === "captured" && detectedAnswers.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  <span>
                    {
                      detectedAnswers.filter(
                        (a) => a !== Variant_A_B_C_D_E_None.None,
                      ).length
                    }{" "}
                    of {detectedAnswers.length} answers detected
                  </span>
                </div>
                <Button
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={submitMutation.isPending}
                  data-ocid="scan.submit_button"
                >
                  {submitMutation.isPending
                    ? "Grading\u2026"
                    : "Submit & Grade"}
                </Button>
                {submitMutation.isError && (
                  <p
                    className="text-xs text-destructive text-center"
                    data-ocid="scan.submit_error_state"
                  >
                    Failed to submit. Please try again.
                  </p>
                )}
              </div>
            )}

            {/* Answer key info */}
            {selectedKey && (
              <div className="bg-muted/30 border border-border rounded-lg px-4 py-3 text-xs text-muted-foreground space-y-1">
                <p>
                  <strong className="text-foreground">
                    {selectedKey.name}
                  </strong>
                </p>
                <p>{String(selectedKey.questionCount)} questions</p>
                {selectedKey.penaltyPerWrong > 0 && (
                  <Badge variant="outline" className="text-xs">
                    −{selectedKey.penaltyPerWrong}pt penalty/wrong
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
        data-ocid="scan.file_input"
      />
    </Layout>
  );
}
