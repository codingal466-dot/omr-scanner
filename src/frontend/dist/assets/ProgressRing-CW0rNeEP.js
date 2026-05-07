import { j as jsxRuntimeExports, c as cn } from "./index-COsGoTS5.js";
function ProgressRing({
  value,
  size = 64,
  strokeWidth = 5,
  className,
  showLabel = false
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedValue = Math.min(100, Math.max(0, value));
  const offset = circumference - clampedValue / 100 * circumference;
  const color = clampedValue >= 80 ? "stroke-accent" : clampedValue >= 60 ? "stroke-primary" : clampedValue >= 40 ? "stroke-[color:var(--chart-4)]" : "stroke-destructive";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "relative inline-flex items-center justify-center",
        className
      ),
      style: { width: size, height: size },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "svg",
          {
            width: size,
            height: size,
            viewBox: `0 0 ${size} ${size}`,
            className: "-rotate-90",
            "aria-hidden": "true",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  cx: size / 2,
                  cy: size / 2,
                  r: radius,
                  fill: "none",
                  className: "stroke-border",
                  strokeWidth
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  cx: size / 2,
                  cy: size / 2,
                  r: radius,
                  fill: "none",
                  className: cn(color, "transition-all duration-500 ease-out"),
                  strokeWidth,
                  strokeLinecap: "round",
                  strokeDasharray: circumference,
                  strokeDashoffset: offset
                }
              )
            ]
          }
        ),
        showLabel && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute text-xs font-bold tabular-nums text-foreground", children: [
          Math.round(clampedValue),
          "%"
        ] })
      ]
    }
  );
}
export {
  ProgressRing as P
};
