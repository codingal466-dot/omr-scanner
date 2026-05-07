import { Variant_A_B_C_D_E_None } from "@/backend";
import type { AnswerChoice } from "@/types/omr";

const CHOICES: AnswerChoice[] = [
  Variant_A_B_C_D_E_None.A,
  Variant_A_B_C_D_E_None.B,
  Variant_A_B_C_D_E_None.C,
  Variant_A_B_C_D_E_None.D,
  Variant_A_B_C_D_E_None.E,
];

export interface BubbleDetectionResult {
  detectedAnswers: AnswerChoice[];
  confidence: number;
  rawData: Uint8ClampedArray;
}

/**
 * Converts an ImageData to grayscale using luminance formula.
 */
function toGrayscale(imageData: ImageData): Uint8Array {
  const gray = new Uint8Array(imageData.width * imageData.height);
  for (let i = 0; i < gray.length; i++) {
    const r = imageData.data[i * 4];
    const g = imageData.data[i * 4 + 1];
    const b = imageData.data[i * 4 + 2];
    gray[i] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  }
  return gray;
}

/**
 * Applies a binary threshold. Pixels darker than threshold are considered "filled" (0).
 */
function threshold(gray: Uint8Array, thresh = 128): Uint8Array {
  const binary = new Uint8Array(gray.length);
  for (let i = 0; i < gray.length; i++) {
    binary[i] = gray[i] < thresh ? 0 : 255;
  }
  return binary;
}

/**
 * Counts dark pixels in a rectangular cell region.
 */
function countDarkPixels(
  binary: Uint8Array,
  width: number,
  cellX: number,
  cellY: number,
  cellW: number,
  cellH: number,
): number {
  let count = 0;
  for (let row = cellY; row < cellY + cellH; row++) {
    for (let col = cellX; col < cellX + cellW; col++) {
      if (binary[row * width + col] === 0) count++;
    }
  }
  return count;
}

/**
 * Detects filled bubbles from a canvas ImageData.
 * Assumes the OMR grid spans the full image area.
 * Each row = one question, columns = A B C D E.
 *
 * @param imageData   ImageData from canvas
 * @param questionCount  Number of questions expected
 * @param numChoices  Options per question (default 5 = A-E)
 * @param thresholdPct  Minimum fill ratio to consider a bubble filled (0–1)
 */
export function detectBubbles(
  imageData: ImageData,
  questionCount: number,
  numChoices = 5,
  thresholdPct = 0.25,
): BubbleDetectionResult {
  const { width, height } = imageData;
  const gray = toGrayscale(imageData);
  const binary = threshold(gray, 128);

  // Margins to avoid borders (10% on each side)
  const marginX = Math.floor(width * 0.05);
  const marginY = Math.floor(height * 0.05);
  const gridW = width - 2 * marginX;
  const gridH = height - 2 * marginY;

  const cellW = Math.floor(gridW / numChoices);
  const cellH = Math.floor(gridH / questionCount);
  const cellArea = cellW * cellH;

  const detectedAnswers: AnswerChoice[] = [];
  let confidenceSum = 0;

  for (let q = 0; q < questionCount; q++) {
    const cellY = marginY + q * cellH;
    const fillCounts: number[] = [];

    for (let c = 0; c < numChoices; c++) {
      const cellX = marginX + c * cellW;
      const dark = countDarkPixels(binary, width, cellX, cellY, cellW, cellH);
      fillCounts.push(dark);
    }

    const maxFill = Math.max(...fillCounts);
    const maxIdx = fillCounts.indexOf(maxFill);
    const fillRatio = cellArea > 0 ? maxFill / cellArea : 0;

    // Confidence: how much more filled is the best bubble vs average of others
    const others = fillCounts.filter((_, i) => i !== maxIdx);
    const avgOthers =
      others.length > 0 ? others.reduce((a, b) => a + b, 0) / others.length : 0;
    const conf = maxFill > 0 ? Math.min(1, (maxFill - avgOthers) / maxFill) : 0;
    confidenceSum += conf;

    if (fillRatio >= thresholdPct) {
      detectedAnswers.push(CHOICES[maxIdx]);
    } else {
      detectedAnswers.push(Variant_A_B_C_D_E_None.None);
    }
  }

  return {
    detectedAnswers,
    confidence: questionCount > 0 ? confidenceSum / questionCount : 0,
    rawData: imageData.data,
  };
}

/**
 * Captures an image from a video element to a canvas and returns ImageData.
 */
export function captureFrameFromVideo(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
): ImageData | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * Captures an image from a File/Blob.
 */
export function captureFrameFromFile(
  file: File,
  canvas: HTMLCanvasElement,
): Promise<ImageData | null> {
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
