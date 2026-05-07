import { u as useRouter, r as reactExports, j as jsxRuntimeExports } from "./index-COsGoTS5.js";
import { c as createLucideIcon, V as Variant_A_B_C_D_E_None, a as useAnswerKeys, e as useSubmitScan, L as Layout, b as Button, d as Badge } from "./useBackend-gHfQ_2dy.js";
import { L as Label, I as Input } from "./label-B5YPktYE.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-VTpERKLb.js";
import "./index-DiGzqMrz.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  [
    "path",
    {
      d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
      key: "1tc9qg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
];
const Camera = createLucideIcon("camera", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const CircleCheck = createLucideIcon("circle-check", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
const CHOICES$1 = [
  Variant_A_B_C_D_E_None.A,
  Variant_A_B_C_D_E_None.B,
  Variant_A_B_C_D_E_None.C,
  Variant_A_B_C_D_E_None.D,
  Variant_A_B_C_D_E_None.E
];
function toGrayscale(imageData) {
  const gray = new Uint8Array(imageData.width * imageData.height);
  for (let i = 0; i < gray.length; i++) {
    const r = imageData.data[i * 4];
    const g = imageData.data[i * 4 + 1];
    const b = imageData.data[i * 4 + 2];
    gray[i] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  }
  return gray;
}
function threshold(gray, thresh = 128) {
  const binary = new Uint8Array(gray.length);
  for (let i = 0; i < gray.length; i++) {
    binary[i] = gray[i] < thresh ? 0 : 255;
  }
  return binary;
}
function countDarkPixels(binary, width, cellX, cellY, cellW, cellH) {
  let count = 0;
  for (let row = cellY; row < cellY + cellH; row++) {
    for (let col = cellX; col < cellX + cellW; col++) {
      if (binary[row * width + col] === 0) count++;
    }
  }
  return count;
}
function detectBubbles(imageData, questionCount, numChoices = 5, thresholdPct = 0.25) {
  const { width, height } = imageData;
  const gray = toGrayscale(imageData);
  const binary = threshold(gray, 128);
  const marginX = Math.floor(width * 0.05);
  const marginY = Math.floor(height * 0.05);
  const gridW = width - 2 * marginX;
  const gridH = height - 2 * marginY;
  const cellW = Math.floor(gridW / numChoices);
  const cellH = Math.floor(gridH / questionCount);
  const cellArea = cellW * cellH;
  const detectedAnswers = [];
  let confidenceSum = 0;
  for (let q = 0; q < questionCount; q++) {
    const cellY = marginY + q * cellH;
    const fillCounts = [];
    for (let c = 0; c < numChoices; c++) {
      const cellX = marginX + c * cellW;
      const dark = countDarkPixels(binary, width, cellX, cellY, cellW, cellH);
      fillCounts.push(dark);
    }
    const maxFill = Math.max(...fillCounts);
    const maxIdx = fillCounts.indexOf(maxFill);
    const fillRatio = cellArea > 0 ? maxFill / cellArea : 0;
    const others = fillCounts.filter((_, i) => i !== maxIdx);
    const avgOthers = others.length > 0 ? others.reduce((a, b) => a + b, 0) / others.length : 0;
    const conf = maxFill > 0 ? Math.min(1, (maxFill - avgOthers) / maxFill) : 0;
    confidenceSum += conf;
    if (fillRatio >= thresholdPct) {
      detectedAnswers.push(CHOICES$1[maxIdx]);
    } else {
      detectedAnswers.push(Variant_A_B_C_D_E_None.None);
    }
  }
  return {
    detectedAnswers,
    confidence: questionCount > 0 ? confidenceSum / questionCount : 0,
    rawData: imageData.data
  };
}
function captureFrameFromVideo(video, canvas) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}
function captureFrameFromFile(file, canvas) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        resolve(null);
        return;
      }
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(data);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}
const CHOICES = [
  Variant_A_B_C_D_E_None.A,
  Variant_A_B_C_D_E_None.B,
  Variant_A_B_C_D_E_None.C,
  Variant_A_B_C_D_E_None.D,
  Variant_A_B_C_D_E_None.E
];
const CHOICE_LABELS = ["A", "B", "C", "D", "E"];
function DetectedAnswersOverlay({
  answers,
  onCorrect
}) {
  const cols = answers.length > 40 ? 3 : answers.length > 20 ? 2 : 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "grid gap-0.5",
      style: { gridTemplateColumns: `repeat(${cols}, 1fr)` },
      children: answers.map((answer, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-0.5",
          "data-ocid": `scan.detected_answer.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "w-6 text-right text-[10px] text-muted-foreground font-mono shrink-0", children: [
              i + 1,
              "."
            ] }),
            CHOICES.map((ch, ci) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => onCorrect(i, ch),
                className: `w-6 h-6 rounded text-[10px] font-semibold border transition-colors ${answer === ch ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground/50 border-border hover:border-primary/40"}`,
                "aria-pressed": answer === ch,
                children: CHOICE_LABELS[ci]
              },
              CHOICE_LABELS[ci]
            ))
          ]
        },
        `q-${i + 1}`
      ))
    }
  );
}
function ScanPage() {
  const router = useRouter();
  const { data: answerKeys = [] } = useAnswerKeys();
  const submitMutation = useSubmitScan();
  const videoRef = reactExports.useRef(null);
  const canvasRef = reactExports.useRef(null);
  const streamRef = reactExports.useRef(null);
  const fileInputRef = reactExports.useRef(null);
  const [phase, setPhase] = reactExports.useState("setup");
  const [selectedKeyId, setSelectedKeyId] = reactExports.useState("");
  const [studentName, setStudentName] = reactExports.useState("");
  const [studentId, setStudentId] = reactExports.useState("");
  const [studentClass, setStudentClass] = reactExports.useState("");
  const [cameraError, setCameraError] = reactExports.useState(null);
  const [capturedDataUrl, setCapturedDataUrl] = reactExports.useState(null);
  const [detectedAnswers, setDetectedAnswers] = reactExports.useState([]);
  const [detectionError, setDetectionError] = reactExports.useState(null);
  const [formErrors, setFormErrors] = reactExports.useState({});
  const selectedKey = answerKeys.find((k) => k.id.toString() === selectedKeyId) ?? null;
  const stopCamera = reactExports.useCallback(() => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) track.stop();
      streamRef.current = null;
    }
  }, []);
  reactExports.useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);
  async function startCamera() {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setPhase("camera");
    } catch (err) {
      const msg = err instanceof DOMException && err.name === "NotAllowedError" ? "Camera permission denied. Please allow camera access or use file upload." : "Could not access camera. Please use file upload instead.";
      setCameraError(msg);
    }
  }
  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current || !selectedKey) return;
    const imageData = captureFrameFromVideo(
      videoRef.current,
      canvasRef.current
    );
    if (!imageData) {
      setDetectionError("Failed to capture image from camera.");
      return;
    }
    processImageData(imageData, canvasRef.current);
    stopCamera();
  }
  async function handleFileUpload(e) {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file || !canvasRef.current || !selectedKey) return;
    const imageData = await captureFrameFromFile(file, canvasRef.current);
    if (!imageData) {
      setDetectionError("Failed to read the uploaded image.");
      return;
    }
    processImageData(imageData, canvasRef.current);
  }
  function processImageData(imageData, canvas) {
    setDetectionError(null);
    if (!selectedKey) return;
    const qCount = Number(selectedKey.questionCount);
    try {
      const result = detectBubbles(imageData, qCount);
      if (result.confidence < 0.15 && result.detectedAnswers.every((a) => a === Variant_A_B_C_D_E_None.None)) {
        setDetectionError(
          "Bubble detection confidence is very low. Please ensure the answer sheet is clearly visible."
        );
      }
      setDetectedAnswers(result.detectedAnswers);
    } catch {
      setDetectionError(
        "Bubble detection failed. Please retake the photo or adjust the sheet position."
      );
      setDetectedAnswers([]);
    }
    setCapturedDataUrl(canvas.toDataURL("image/jpeg", 0.85));
    setPhase("captured");
  }
  function correctAnswer(idx, choice) {
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
  function validateForm() {
    const errs = {};
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
        detectedAnswers
      });
      router.navigate({ to: `/results/${result.id}` });
    } catch {
      setPhase("captured");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { title: "Scan Answer Sheet", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg p-5 shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground mb-4", children: "Student & Answer Key" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "s-name", children: "Student Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "s-name",
                value: studentName,
                onChange: (e) => setStudentName(e.target.value),
                placeholder: "e.g. Emily Chen",
                "data-ocid": "scan.student_name_input"
              }
            ),
            formErrors.name && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "scan.name_field_error",
                children: formErrors.name
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "s-id", children: "Student ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "s-id",
                value: studentId,
                onChange: (e) => setStudentId(e.target.value),
                placeholder: "e.g. STU-2024-001",
                "data-ocid": "scan.student_id_input"
              }
            ),
            formErrors.id && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "scan.id_field_error",
                children: formErrors.id
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "s-class", children: "Class" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "s-class",
                value: studentClass,
                onChange: (e) => setStudentClass(e.target.value),
                placeholder: "e.g. Grade 6B",
                "data-ocid": "scan.class_input"
              }
            ),
            formErrors.class && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "scan.class_field_error",
                children: formErrors.class
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "answer-key", children: "Answer Key" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedKeyId, onValueChange: setSelectedKeyId, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  id: "answer-key",
                  "data-ocid": "scan.answer_key_select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a key…" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: answerKeys.map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: k.id.toString(), children: k.name }, k.id.toString())) })
            ] }),
            formErrors.key && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive",
                "data-ocid": "scan.key_field_error",
                children: formErrors.key
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg overflow-hidden shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: phase === "captured" ? "Captured Preview" : "Camera / Upload" }),
            phase === "captured" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                onClick: resetScan,
                "data-ocid": "scan.retake_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 mr-1.5" }),
                  "Retake"
                ]
              }
            )
          ] }),
          phase === "setup" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 gap-4", children: [
            cameraError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-start gap-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-md px-4 py-3 text-sm max-w-sm",
                "data-ocid": "scan.camera_error_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 mt-0.5 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: cameraError })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "lg",
                onClick: startCamera,
                disabled: !selectedKeyId,
                "data-ocid": "scan.start_camera_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-5 w-5 mr-2" }),
                  "Open Camera"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px w-12 bg-border" }),
              "or",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px w-12 bg-border" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                onClick: () => {
                  var _a;
                  return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                },
                disabled: !selectedKeyId,
                "data-ocid": "scan.upload_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4 mr-2" }),
                  "Upload Image"
                ]
              }
            ),
            !selectedKeyId && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Select an answer key above first." })
          ] }),
          phase === "camera" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative bg-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "video",
              {
                ref: videoRef,
                autoPlay: true,
                playsInline: true,
                muted: true,
                className: "w-full max-h-[460px] object-contain"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-4/5 h-3/4 border-2 border-dashed border-primary/60 rounded-lg" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-4 inset-x-0 flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "lg",
                onClick: capturePhoto,
                className: "rounded-full w-16 h-16",
                "aria-label": "Capture photo",
                "data-ocid": "scan.capture_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-6 w-6" })
              }
            ) })
          ] }),
          phase === "captured" && capturedDataUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: capturedDataUrl,
              alt: "Captured answer sheet",
              className: "w-full max-h-[460px] object-contain bg-foreground"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, className: "hidden" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          detectionError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-start gap-2 bg-muted border border-border text-foreground rounded-md px-4 py-3 text-sm",
              "data-ocid": "scan.detection_error_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 mt-0.5 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: detectionError })
              ]
            }
          ),
          phase === "captured" && detectedAnswers.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-lg shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-b border-border bg-muted/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Detected Answers" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Click to correct any misread bubble." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 max-h-[360px] overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              DetectedAnswersOverlay,
              {
                answers: detectedAnswers,
                onCorrect: correctAnswer
              }
            ) })
          ] }) : phase !== "setup" && phase !== "camera" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "bg-card border border-border rounded-lg p-6 text-center text-sm text-muted-foreground",
              "data-ocid": "scan.answers_empty_state",
              children: "No answers detected yet. Capture a sheet above."
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-lg p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-5 w-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Detected answers will appear here after capturing a sheet." })
          ] }) }),
          phase === "captured" && detectedAnswers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-accent" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                detectedAnswers.filter(
                  (a) => a !== Variant_A_B_C_D_E_None.None
                ).length,
                " ",
                "of ",
                detectedAnswers.length,
                " answers detected"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "w-full",
                onClick: handleSubmit,
                disabled: submitMutation.isPending,
                "data-ocid": "scan.submit_button",
                children: submitMutation.isPending ? "Grading…" : "Submit & Grade"
              }
            ),
            submitMutation.isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-xs text-destructive text-center",
                "data-ocid": "scan.submit_error_state",
                children: "Failed to submit. Please try again."
              }
            )
          ] }),
          selectedKey && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 border border-border rounded-lg px-4 py-3 text-xs text-muted-foreground space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: selectedKey.name }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              String(selectedKey.questionCount),
              " questions"
            ] }),
            selectedKey.penaltyPerWrong > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
              "−",
              selectedKey.penaltyPerWrong,
              "pt penalty/wrong"
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref: fileInputRef,
        type: "file",
        accept: "image/*",
        className: "hidden",
        onChange: handleFileUpload,
        "data-ocid": "scan.file_input"
      }
    )
  ] });
}
export {
  ScanPage as default
};
