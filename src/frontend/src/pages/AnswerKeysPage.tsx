import { Variant_A_B_C_D_E_None } from "@/backend";
import { EmptyState } from "@/components/EmptyState";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  useAnswerKeys,
  useCreateAnswerKey,
  useDeleteAnswerKey,
  useUpdateAnswerKey,
} from "@/hooks/useBackend";
import type { AnswerChoice, AnswerKey, QuestionKey } from "@/types/omr";
import { BookOpen, Edit2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const CHOICES: AnswerChoice[] = [
  Variant_A_B_C_D_E_None.A,
  Variant_A_B_C_D_E_None.B,
  Variant_A_B_C_D_E_None.C,
  Variant_A_B_C_D_E_None.D,
  Variant_A_B_C_D_E_None.E,
];

const CHOICE_LABELS = ["A", "B", "C", "D", "E"];

interface EditorState {
  name: string;
  questionCount: number;
  penaltyEnabled: boolean;
  penaltyPerWrong: number;
  answers: AnswerChoice[];
  pointValues: number[];
}

function defaultEditorState(count = 20): EditorState {
  return {
    name: "",
    questionCount: count,
    penaltyEnabled: false,
    penaltyPerWrong: 0.25,
    answers: Array.from({ length: count }, () => Variant_A_B_C_D_E_None.A),
    pointValues: Array.from({ length: count }, () => 1),
  };
}

function fromAnswerKey(key: AnswerKey): EditorState {
  const count = Number(key.questionCount);
  const answers: AnswerChoice[] = Array.from({ length: count }, (_, i) => {
    const q = key.questions.find((qk) => Number(qk.questionNumber) === i + 1);
    return q?.correctAnswer ?? Variant_A_B_C_D_E_None.A;
  });
  const pointValues: number[] = Array.from({ length: count }, (_, i) => {
    const q = key.questions.find((qk) => Number(qk.questionNumber) === i + 1);
    return q?.pointValue ?? 1;
  });
  return {
    name: key.name,
    questionCount: count,
    penaltyEnabled: key.penaltyPerWrong > 0,
    penaltyPerWrong: key.penaltyPerWrong > 0 ? key.penaltyPerWrong : 0.25,
    answers,
    pointValues,
  };
}

function buildQuestions(state: EditorState): QuestionKey[] {
  return Array.from({ length: state.questionCount }, (_, i) => ({
    questionNumber: BigInt(i + 1),
    correctAnswer: state.answers[i],
    pointValue: state.pointValues[i],
  }));
}

// Answer grid editor component
function AnswerGridEditor({
  state,
  onChange,
}: {
  state: EditorState;
  onChange: (s: EditorState) => void;
}) {
  function setAnswer(qIdx: number, choice: AnswerChoice) {
    const answers = [...state.answers];
    answers[qIdx] = choice;
    onChange({ ...state, answers });
  }

  function setPointValue(qIdx: number, val: number) {
    const pointValues = [...state.pointValues];
    pointValues[qIdx] = Math.max(0.1, Math.min(10, val));
    onChange({ ...state, pointValues });
  }

  const columns =
    state.questionCount > 40 ? 3 : state.questionCount > 20 ? 2 : 1;

  return (
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {Array.from({ length: state.questionCount }, (_, i) => (
        <div
          key={`q-${i + 1}`}
          className="flex items-center gap-1 py-0.5"
          data-ocid={`answer_keys.question_row.${i + 1}`}
        >
          <span className="w-7 text-right text-xs text-muted-foreground font-mono shrink-0">
            {i + 1}.
          </span>
          <div className="flex gap-0.5">
            {CHOICES.map((ch, ci) => (
              <button
                key={CHOICE_LABELS[ci]}
                type="button"
                onClick={() => setAnswer(i, ch)}
                className={`w-7 h-7 rounded text-xs font-semibold border transition-colors ${
                  state.answers[i] === ch
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground/60 border-border hover:border-primary/50 hover:text-foreground"
                }`}
                aria-pressed={state.answers[i] === ch}
              >
                {CHOICE_LABELS[ci]}
              </button>
            ))}
          </div>
          <Input
            type="number"
            min={0.1}
            max={10}
            step={0.5}
            value={state.pointValues[i]}
            onChange={(e) => setPointValue(i, Number(e.target.value))}
            className="w-14 h-7 text-xs text-right px-1"
            aria-label={`Points for question ${i + 1}`}
          />
        </div>
      ))}
    </div>
  );
}

export default function AnswerKeysPage() {
  const { data: answerKeys = [], isLoading } = useAnswerKeys();
  const createMutation = useCreateAnswerKey();
  const updateMutation = useUpdateAnswerKey();
  const deleteMutation = useDeleteAnswerKey();

  const [showForm, setShowForm] = useState(false);
  const [editingKey, setEditingKey] = useState<AnswerKey | null>(null);
  const [editorState, setEditorState] =
    useState<EditorState>(defaultEditorState);
  const [confirmDeleteId, setConfirmDeleteId] = useState<bigint | null>(null);
  const [errors, setErrors] = useState<{ name?: string; count?: string }>({});

  function openCreate() {
    setEditingKey(null);
    setEditorState(defaultEditorState());
    setErrors({});
    setShowForm(true);
  }

  function openEdit(key: AnswerKey) {
    setEditingKey(key);
    setEditorState(fromAnswerKey(key));
    setErrors({});
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingKey(null);
  }

  function handleCountChange(raw: string) {
    const n = Math.min(200, Math.max(5, Number(raw) || 5));
    const prev = editorState;
    const answers = Array.from(
      { length: n },
      (_, i) => prev.answers[i] ?? Variant_A_B_C_D_E_None.A,
    );
    const pointValues = Array.from(
      { length: n },
      (_, i) => prev.pointValues[i] ?? 1,
    );
    setEditorState({ ...prev, questionCount: n, answers, pointValues });
  }

  function validate() {
    const errs: typeof errors = {};
    if (!editorState.name.trim()) errs.name = "Name is required";
    if (editorState.questionCount < 5 || editorState.questionCount > 200)
      errs.count = "Must be 5–200";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    const input = {
      name: editorState.name.trim(),
      questionCount: BigInt(editorState.questionCount),
      penaltyPerWrong: editorState.penaltyEnabled
        ? editorState.penaltyPerWrong
        : 0,
      questions: buildQuestions(editorState),
    };
    if (editingKey) {
      await updateMutation.mutateAsync({ id: editingKey.id, input });
    } else {
      await createMutation.mutateAsync(input);
    }
    closeForm();
  }

  async function handleDelete(id: bigint) {
    await deleteMutation.mutateAsync(id);
    setConfirmDeleteId(null);
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Layout
      title="Answer Keys"
      actions={
        <Button
          size="sm"
          onClick={openCreate}
          data-ocid="answer_keys.create_button"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          New Key
        </Button>
      }
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {["sk1", "sk2", "sk3"].map((sk) => (
              <Card key={sk} className="bg-card">
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-4 w-60" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : answerKeys.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No answer keys yet"
            description="Create your first answer key to start grading answer sheets."
            actionLabel="Create Answer Key"
            onAction={openCreate}
            data-ocid="answer_keys.empty_state"
          />
        ) : (
          <div className="space-y-3">
            {answerKeys.map((key, idx) => (
              <Card
                key={key.id.toString()}
                className="bg-card border-border shadow-sm"
                data-ocid={`answer_keys.key_card.${idx + 1}`}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {key.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-xs">
                        {String(key.questionCount)} questions
                      </Badge>
                      {key.penaltyPerWrong > 0 && (
                        <Badge variant="outline" className="text-xs">
                          −{key.penaltyPerWrong}pt penalty
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(key)}
                      aria-label="Edit answer key"
                      data-ocid={`answer_keys.edit_button.${idx + 1}`}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setConfirmDeleteId(key.id)}
                      aria-label="Delete answer key"
                      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      data-ocid={`answer_keys.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Answer Key Form Drawer */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-end"
          data-ocid="answer_keys.form_dialog"
        >
          <div
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={closeForm}
            onKeyDown={(e) => e.key === "Escape" && closeForm()}
            role="presentation"
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-2xl h-screen bg-card border-l border-border shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">
                {editingKey ? "Edit Answer Key" : "New Answer Key"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeForm}
                data-ocid="answer_keys.close_button"
              >
                Cancel
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="key-name">Name</Label>
                <Input
                  id="key-name"
                  value={editorState.name}
                  onChange={(e) =>
                    setEditorState({ ...editorState, name: e.target.value })
                  }
                  placeholder="e.g. Midterm History 6B"
                  data-ocid="answer_keys.name_input"
                />
                {errors.name && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="answer_keys.name_field_error"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Question count */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="q-count">Question Count (5–200)</Label>
                  <Input
                    id="q-count"
                    type="number"
                    min={5}
                    max={200}
                    value={editorState.questionCount}
                    onChange={(e) => handleCountChange(e.target.value)}
                    data-ocid="answer_keys.count_input"
                  />
                  {errors.count && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="answer_keys.count_field_error"
                    >
                      {errors.count}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="penalty-toggle"
                    className="flex items-center gap-2"
                  >
                    <Switch
                      id="penalty-toggle"
                      checked={editorState.penaltyEnabled}
                      onCheckedChange={(v) =>
                        setEditorState({ ...editorState, penaltyEnabled: v })
                      }
                      data-ocid="answer_keys.penalty_switch"
                    />
                    Penalty per wrong
                  </Label>
                  {editorState.penaltyEnabled && (
                    <Input
                      type="number"
                      min={0}
                      max={5}
                      step={0.25}
                      value={editorState.penaltyPerWrong}
                      onChange={(e) =>
                        setEditorState({
                          ...editorState,
                          penaltyPerWrong: Number(e.target.value),
                        })
                      }
                      className="mt-1"
                      data-ocid="answer_keys.penalty_input"
                    />
                  )}
                </div>
              </div>

              {/* Answer grid */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Answer Grid</Label>
                  <span className="text-xs text-muted-foreground">
                    Click a letter to set answer. Right column = point value.
                  </span>
                </div>
                <div className="border border-border rounded-lg p-3 bg-background max-h-[420px] overflow-y-auto">
                  <AnswerGridEditor
                    state={editorState}
                    onChange={setEditorState}
                  />
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-border flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={closeForm}
                data-ocid="answer_keys.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isPending}
                data-ocid="answer_keys.save_button"
              >
                {isPending
                  ? "Saving…"
                  : editingKey
                    ? "Update Key"
                    : "Create Key"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDeleteId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm"
          data-ocid="answer_keys.confirm_dialog"
        >
          <div className="bg-card border border-border rounded-xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Delete answer key?
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              This will not delete associated scan results, but they will lose
              their key reference.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDeleteId(null)}
                data-ocid="answer_keys.cancel_button"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deleteMutation.isPending}
                data-ocid="answer_keys.confirm_button"
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
