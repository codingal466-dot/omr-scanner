# OMR Scanner — Design Brief

## Purpose & Tone
Educator tool for scanning answer sheets. Professional, trustworthy, clear. Utilitarian clarity over decoration.

## Palette
| Role | OKLCH | Hex | Use |
|------|-------|-----|-----|
| Primary | `0.50 0.15 260` | #2A5FD0 | UI controls, links, headers |
| Success | `0.72 0.22 142` | #5FCB80 | Correct answers, validation states |
| Destructive | `0.63 0.2 25` | #E63946 | Incorrect answers, errors |
| Background | `0.98 0.01 260` | #FEFBFF | Light mode base |
| Card | `1.0 0.01 260` | #FFFFFF | Content surfaces |
| Foreground | `0.15 0.03 260` | #1F1F3D | Text on light backgrounds |
| Muted | `0.93 0.01 0` | #E8E8E8 | Disabled states, borders |

## Typography
- **Family**: General Sans (body + display)
- **Mono**: Geist Mono (data tables, scan results)
- **Scale**: 12px (xs), 14px (sm), 16px (base), 18px (lg), 20px (xl), 24px (2xl), 32px (3xl)
- **Hierarchy**: Weight variation (400 regular, 500 medium, 600 semibold) + size

## Structural Zones
| Zone | Background | Border | Intent |
|------|------------|--------|--------|
| Header | `bg-primary text-primary-foreground` | None | App identity, navigation |
| Scanner section | `bg-background` | `border-b border-border` | Camera preview, focal point |
| Results section | `bg-card border border-border` | Yes | Annotated sheet, score summary |
| Data section | `bg-muted/20` | `border-t border-border` | Answer keys, export options |
| Footer | `bg-background` | `border-t border-border` | Legal, support links |

## Component Patterns
- **Buttons**: Primary (solid blue), secondary (muted), destructive (red). Corner radius 8px.
- **Cards**: Subtle shadow (0 2px 8px), rounded 8px, border 1px muted
- **Forms**: Input fields with 1px border, focus ring blue
- **Status indicators**: Green dot for correct, red for incorrect, gray for empty/unscanned
- **Tables**: Striped rows (muted/30 every other), fixed-width mono font for data

## Motion & Interaction
- **Transition**: Default smooth (`all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`)
- **Camera**: Corner guides pulse gently during alignment
- **Results**: Fade-in on load, no bounce
- **Hover**: Slight bg color shift for interactive elements

## Constraints
- No decorative gradients or ambient blur
- No skewed text or rotated elements (except sheet rotation in preview)
- No emoji or playful iconography
- Minimal shadows; utility only
- All form inputs must have clear labels and error states
- Data tables must be readable at mobile width

## Signature Detail
Corner marker guides during camera preview. When aligned, markers glow green and snap guides animate into place. Visual confirmation that sheet is ready to scan.

## Accessibility
- Color contrast WCAG AA+ in both light/dark
- Touch targets ≥44px
- Keyboard navigation for all controls
- Screen reader labels for all images and buttons
- Focus ring always visible on interactive elements
