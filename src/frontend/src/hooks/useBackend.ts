import { createActor } from "@/backend";
import type { Variant_A_B_C_D_E_None } from "@/backend";
import type {
  AnswerKey,
  AnswerKeyId,
  AnswerKeyInput,
  ScanInput,
  ScanResult,
  ScanResultId,
  ScoreBreakdown,
} from "@/types/omr";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// --- Answer Keys ---

export function useAnswerKeys() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<AnswerKey[]>({
    queryKey: ["answerKeys"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAnswerKeys();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAnswerKey(id: AnswerKeyId | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<AnswerKey | null>({
    queryKey: ["answerKey", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getAnswerKey(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateAnswerKey() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<AnswerKey, Error, AnswerKeyInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createAnswerKey(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["answerKeys"] });
    },
  });
}

export function useUpdateAnswerKey() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<
    boolean,
    Error,
    { id: AnswerKeyId; input: AnswerKeyInput }
  >({
    mutationFn: async ({ id, input }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateAnswerKey(id, input);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["answerKeys"] });
      queryClient.invalidateQueries({
        queryKey: ["answerKey", vars.id.toString()],
      });
    },
  });
}

export function useDeleteAnswerKey() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, AnswerKeyId>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteAnswerKey(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["answerKeys"] });
    },
  });
}

// --- Scan Results ---

export function useScanResults() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ScanResult[]>({
    queryKey: ["scanResults"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listScanResults();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useScanResult(id: ScanResultId | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ScanResult | null>({
    queryKey: ["scanResult", id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      return actor.getScanResult(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useSubmitScan() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<ScanResult, Error, ScanInput>({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitScan(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scanResults"] });
    },
  });
}

export function useDeleteScanResult() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, ScanResultId>({
    mutationFn: async (id) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteScanResult(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scanResults"] });
    },
  });
}

export function useGradeAnswers() {
  const { actor } = useActor(createActor);
  return useMutation<
    ScoreBreakdown | null,
    Error,
    { answerKeyId: AnswerKeyId; detectedAnswers: Variant_A_B_C_D_E_None[] }
  >({
    mutationFn: async ({ answerKeyId, detectedAnswers }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.gradeAnswers(answerKeyId, detectedAnswers);
    },
  });
}
