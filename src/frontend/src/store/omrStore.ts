import type { AnswerKeyId, CameraState, ScanStatus } from "@/types/omr";
import { create } from "zustand";

interface OmrStore {
  // Active answer key
  activeAnswerKeyId: AnswerKeyId | null;
  setActiveAnswerKeyId: (id: AnswerKeyId | null) => void;

  // Camera state
  camera: CameraState;
  setCameraActive: (active: boolean) => void;
  setCameraStream: (stream: MediaStream | null) => void;
  setCameraError: (error: string | null) => void;

  // Scan status
  scanStatus: ScanStatus;
  setScanStatus: (status: ScanStatus) => void;

  // Sidebar open state (mobile)
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useOmrStore = create<OmrStore>((set) => ({
  activeAnswerKeyId: null,
  setActiveAnswerKeyId: (id) => set({ activeAnswerKeyId: id }),

  camera: { active: false, stream: null, error: null },
  setCameraActive: (active) =>
    set((state) => ({ camera: { ...state.camera, active } })),
  setCameraStream: (stream) =>
    set((state) => ({ camera: { ...state.camera, stream } })),
  setCameraError: (error) =>
    set((state) => ({ camera: { ...state.camera, error } })),

  scanStatus: "idle",
  setScanStatus: (status) => set({ scanStatus: status }),

  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
