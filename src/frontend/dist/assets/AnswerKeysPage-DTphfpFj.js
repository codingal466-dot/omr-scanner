import { r as reactExports, j as jsxRuntimeExports, c as cn, S as Skeleton } from "./index-COsGoTS5.js";
import { c as createLucideIcon, f as useComposedRefs, a as useAnswerKeys, g as useCreateAnswerKey, h as useUpdateAnswerKey, i as useDeleteAnswerKey, L as Layout, B as BookOpen, d as Badge, b as Button, V as Variant_A_B_C_D_E_None } from "./useBackend-gHfQ_2dy.js";
import { C as Card, a as CardContent, E as EmptyState } from "./card-B6Y2qsj6.js";
import { L as Label, I as Input } from "./label-B5YPktYE.js";
import { u as useControllableState, P as Primitive, c as composeEventHandlers, a as usePrevious, b as useSize, d as createContextScope } from "./index-DiGzqMrz.js";
import { T as Trash2 } from "./trash-2-BQ6p8vss.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ]
];
const Pen = createLucideIcon("pen", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode);
var SWITCH_NAME = "Switch";
var [createSwitchContext] = createContextScope(SWITCH_NAME);
var [SwitchProvider, useSwitchContext] = createSwitchContext(SWITCH_NAME);
var Switch$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSwitch,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = "on",
      onCheckedChange,
      form,
      ...switchProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    const [checked, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked ?? false,
      onChange: onCheckedChange,
      caller: SWITCH_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchProvider, { scope: __scopeSwitch, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "switch",
          "aria-checked": checked,
          "aria-required": required,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...switchProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            setChecked((prevChecked) => !prevChecked);
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Switch$1.displayName = SWITCH_NAME;
var THUMB_NAME = "SwitchThumb";
var SwitchThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSwitch, ...thumbProps } = props;
    const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...thumbProps,
        ref: forwardedRef
      }
    );
  }
);
SwitchThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "SwitchBubbleInput";
var SwitchBubbleInput = reactExports.forwardRef(
  ({
    __scopeSwitch,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var Root = Switch$1;
var Thumb = SwitchThumb;
function Switch({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "switch",
      className: cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Thumb,
        {
          "data-slot": "switch-thumb",
          className: cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
          )
        }
      )
    }
  );
}
const CHOICES = [
  Variant_A_B_C_D_E_None.A,
  Variant_A_B_C_D_E_None.B,
  Variant_A_B_C_D_E_None.C,
  Variant_A_B_C_D_E_None.D,
  Variant_A_B_C_D_E_None.E
];
const CHOICE_LABELS = ["A", "B", "C", "D", "E"];
function defaultEditorState(count = 20) {
  return {
    name: "",
    questionCount: count,
    penaltyEnabled: false,
    penaltyPerWrong: 0.25,
    answers: Array.from({ length: count }, () => Variant_A_B_C_D_E_None.A),
    pointValues: Array.from({ length: count }, () => 1)
  };
}
function fromAnswerKey(key) {
  const count = Number(key.questionCount);
  const answers = Array.from({ length: count }, (_, i) => {
    const q = key.questions.find((qk) => Number(qk.questionNumber) === i + 1);
    return (q == null ? void 0 : q.correctAnswer) ?? Variant_A_B_C_D_E_None.A;
  });
  const pointValues = Array.from({ length: count }, (_, i) => {
    const q = key.questions.find((qk) => Number(qk.questionNumber) === i + 1);
    return (q == null ? void 0 : q.pointValue) ?? 1;
  });
  return {
    name: key.name,
    questionCount: count,
    penaltyEnabled: key.penaltyPerWrong > 0,
    penaltyPerWrong: key.penaltyPerWrong > 0 ? key.penaltyPerWrong : 0.25,
    answers,
    pointValues
  };
}
function buildQuestions(state) {
  return Array.from({ length: state.questionCount }, (_, i) => ({
    questionNumber: BigInt(i + 1),
    correctAnswer: state.answers[i],
    pointValue: state.pointValues[i]
  }));
}
function AnswerGridEditor({
  state,
  onChange
}) {
  function setAnswer(qIdx, choice) {
    const answers = [...state.answers];
    answers[qIdx] = choice;
    onChange({ ...state, answers });
  }
  function setPointValue(qIdx, val) {
    const pointValues = [...state.pointValues];
    pointValues[qIdx] = Math.max(0.1, Math.min(10, val));
    onChange({ ...state, pointValues });
  }
  const columns = state.questionCount > 40 ? 3 : state.questionCount > 20 ? 2 : 1;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "grid gap-1",
      style: { gridTemplateColumns: `repeat(${columns}, 1fr)` },
      children: Array.from({ length: state.questionCount }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-1 py-0.5",
          "data-ocid": `answer_keys.question_row.${i + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "w-7 text-right text-xs text-muted-foreground font-mono shrink-0", children: [
              i + 1,
              "."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0.5", children: CHOICES.map((ch, ci) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setAnswer(i, ch),
                className: `w-7 h-7 rounded text-xs font-semibold border transition-colors ${state.answers[i] === ch ? "bg-primary text-primary-foreground border-primary" : "bg-background text-foreground/60 border-border hover:border-primary/50 hover:text-foreground"}`,
                "aria-pressed": state.answers[i] === ch,
                children: CHOICE_LABELS[ci]
              },
              CHOICE_LABELS[ci]
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: 0.1,
                max: 10,
                step: 0.5,
                value: state.pointValues[i],
                onChange: (e) => setPointValue(i, Number(e.target.value)),
                className: "w-14 h-7 text-xs text-right px-1",
                "aria-label": `Points for question ${i + 1}`
              }
            )
          ]
        },
        `q-${i + 1}`
      ))
    }
  );
}
function AnswerKeysPage() {
  const { data: answerKeys = [], isLoading } = useAnswerKeys();
  const createMutation = useCreateAnswerKey();
  const updateMutation = useUpdateAnswerKey();
  const deleteMutation = useDeleteAnswerKey();
  const [showForm, setShowForm] = reactExports.useState(false);
  const [editingKey, setEditingKey] = reactExports.useState(null);
  const [editorState, setEditorState] = reactExports.useState(defaultEditorState);
  const [confirmDeleteId, setConfirmDeleteId] = reactExports.useState(null);
  const [errors, setErrors] = reactExports.useState({});
  function openCreate() {
    setEditingKey(null);
    setEditorState(defaultEditorState());
    setErrors({});
    setShowForm(true);
  }
  function openEdit(key) {
    setEditingKey(key);
    setEditorState(fromAnswerKey(key));
    setErrors({});
    setShowForm(true);
  }
  function closeForm() {
    setShowForm(false);
    setEditingKey(null);
  }
  function handleCountChange(raw) {
    const n = Math.min(200, Math.max(5, Number(raw) || 5));
    const prev = editorState;
    const answers = Array.from(
      { length: n },
      (_, i) => prev.answers[i] ?? Variant_A_B_C_D_E_None.A
    );
    const pointValues = Array.from(
      { length: n },
      (_, i) => prev.pointValues[i] ?? 1
    );
    setEditorState({ ...prev, questionCount: n, answers, pointValues });
  }
  function validate() {
    const errs = {};
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
      penaltyPerWrong: editorState.penaltyEnabled ? editorState.penaltyPerWrong : 0,
      questions: buildQuestions(editorState)
    };
    if (editingKey) {
      await updateMutation.mutateAsync({ id: editingKey.id, input });
    } else {
      await createMutation.mutateAsync(input);
    }
    closeForm();
  }
  async function handleDelete(id) {
    await deleteMutation.mutateAsync(id);
    setConfirmDeleteId(null);
  }
  const isPending = createMutation.isPending || updateMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Layout,
    {
      title: "Answer Keys",
      actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          onClick: openCreate,
          "data-ocid": "answer_keys.create_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1.5" }),
            "New Key"
          ]
        }
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: ["sk1", "sk2", "sk3"].map((sk) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-40 mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-60" })
        ] }) }, sk)) }) : answerKeys.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          EmptyState,
          {
            icon: BookOpen,
            title: "No answer keys yet",
            description: "Create your first answer key to start grading answer sheets.",
            actionLabel: "Create Answer Key",
            onAction: openCreate,
            "data-ocid": "answer_keys.empty_state"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: answerKeys.map((key, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            className: "bg-card border-border shadow-sm",
            "data-ocid": `answer_keys.key_card.${idx + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "h-4 w-4 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground truncate", children: key.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
                    String(key.questionCount),
                    " questions"
                  ] }),
                  key.penaltyPerWrong > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs", children: [
                    "−",
                    key.penaltyPerWrong,
                    "pt penalty"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    onClick: () => openEdit(key),
                    "aria-label": "Edit answer key",
                    "data-ocid": `answer_keys.edit_button.${idx + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-4 w-4" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    onClick: () => setConfirmDeleteId(key.id),
                    "aria-label": "Delete answer key",
                    className: "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                    "data-ocid": `answer_keys.delete_button.${idx + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
                  }
                )
              ] })
            ] })
          },
          key.id.toString()
        )) }) }),
        showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "fixed inset-0 z-50 flex items-start justify-end",
            "data-ocid": "answer_keys.form_dialog",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "fixed inset-0 bg-foreground/20 backdrop-blur-sm",
                  onClick: closeForm,
                  onKeyDown: (e) => e.key === "Escape" && closeForm(),
                  role: "presentation",
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full max-w-2xl h-screen bg-card border-l border-border shadow-xl flex flex-col", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-foreground", children: editingKey ? "Edit Answer Key" : "New Answer Key" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      onClick: closeForm,
                      "data-ocid": "answer_keys.close_button",
                      children: "Cancel"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-5 space-y-5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "key-name", children: "Name" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "key-name",
                        value: editorState.name,
                        onChange: (e) => setEditorState({ ...editorState, name: e.target.value }),
                        placeholder: "e.g. Midterm History 6B",
                        "data-ocid": "answer_keys.name_input"
                      }
                    ),
                    errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs text-destructive",
                        "data-ocid": "answer_keys.name_field_error",
                        children: errors.name
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "q-count", children: "Question Count (5–200)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          id: "q-count",
                          type: "number",
                          min: 5,
                          max: 200,
                          value: editorState.questionCount,
                          onChange: (e) => handleCountChange(e.target.value),
                          "data-ocid": "answer_keys.count_input"
                        }
                      ),
                      errors.count && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "p",
                        {
                          className: "text-xs text-destructive",
                          "data-ocid": "answer_keys.count_field_error",
                          children: errors.count
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Label,
                        {
                          htmlFor: "penalty-toggle",
                          className: "flex items-center gap-2",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              Switch,
                              {
                                id: "penalty-toggle",
                                checked: editorState.penaltyEnabled,
                                onCheckedChange: (v) => setEditorState({ ...editorState, penaltyEnabled: v }),
                                "data-ocid": "answer_keys.penalty_switch"
                              }
                            ),
                            "Penalty per wrong"
                          ]
                        }
                      ),
                      editorState.penaltyEnabled && /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Input,
                        {
                          type: "number",
                          min: 0,
                          max: 5,
                          step: 0.25,
                          value: editorState.penaltyPerWrong,
                          onChange: (e) => setEditorState({
                            ...editorState,
                            penaltyPerWrong: Number(e.target.value)
                          }),
                          className: "mt-1",
                          "data-ocid": "answer_keys.penalty_input"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-medium", children: "Answer Grid" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Click a letter to set answer. Right column = point value." })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border border-border rounded-lg p-3 bg-background max-h-[420px] overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      AnswerGridEditor,
                      {
                        state: editorState,
                        onChange: setEditorState
                      }
                    ) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-t border-border flex gap-3 justify-end", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "outline",
                      onClick: closeForm,
                      "data-ocid": "answer_keys.cancel_button",
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      onClick: handleSave,
                      disabled: isPending,
                      "data-ocid": "answer_keys.save_button",
                      children: isPending ? "Saving…" : editingKey ? "Update Key" : "Create Key"
                    }
                  )
                ] })
              ] })
            ]
          }
        ),
        confirmDeleteId !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm",
            "data-ocid": "answer_keys.confirm_dialog",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl shadow-xl p-6 max-w-sm w-full mx-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-foreground mb-1", children: "Delete answer key?" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-5", children: "This will not delete associated scan results, but they will lose their key reference." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    onClick: () => setConfirmDeleteId(null),
                    "data-ocid": "answer_keys.cancel_button",
                    children: "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "destructive",
                    size: "sm",
                    onClick: () => handleDelete(confirmDeleteId),
                    disabled: deleteMutation.isPending,
                    "data-ocid": "answer_keys.confirm_button",
                    children: deleteMutation.isPending ? "Deleting…" : "Delete"
                  }
                )
              ] })
            ] })
          }
        )
      ]
    }
  );
}
export {
  AnswerKeysPage as default
};
