# Resume Content Editor — Left Sidebar Design Specification
> Design system: **Forest & Stone**
> Scope: The left-hand content editing sidebar only (≈ 440px wide column, as shown in the reference screenshot — the panel to the left of the live resume preview).

---

## 1. Visual Identity & Aesthetic Direction

**Theme:** Forest & Stone — Organic Professionalism. Warm parchment surfaces, deep forest-green accents, generous breathing room, and soft earth shadows. Every element feels like it belongs on quality paper, not a sterile SaaS dashboard.

**Philosophy:** The sidebar is a quiet workspace. It recedes behind the user's content. No bright whites, no harsh contrast lines. Depth is created through tonal layering (slightly warmer surfaces on top of cooler ones) rather than heavy borders or shadows.

**Emotional register:** Calm confidence. The editor should feel as unhurried as writing in a quality notebook — but as efficient as a well-designed tool.

---

## 2. Design Token Reference

All tokens below are derived directly from the **Forest & Stone** design system YAML.

### 2.1 Color Tokens

#### Surface & Background
| Token | Hex | Role in sidebar |
|---|---|---|
| `surface` | `#FCF9F2` | Sidebar outer background, same as page background |
| `surface-container-low` | `#F6F3EC` | Default section accordion header background |
| `surface-container` | `#F1EEE7` | Entry card default background |
| `surface-container-high` | `#EBE8E1` | Hover state on entry cards, toolbar backgrounds |
| `surface-container-highest` | `#E5E2DB` | Pressed / active entry card background, dividers |
| `surface-container-lowest` | `#FFFFFF` | Input fields, open edit-form panel background |
| `surface-variant` | `#E5E2DB` | Optional field chip background (same as `surface-container-highest`) |

#### Primary (Forest Green — the accent)
| Token | Hex | Role in sidebar |
|---|---|---|
| `primary` | `#154212` | Accordion header icon tint when active, active entry border top |
| `primary-container` | `#2D5A27` | Primary CTA button (Save Changes), active nav left indicator bar |
| `on-primary-container` | `#9DD090` | Text inside primary-container dark backgrounds |
| `inverse-primary` | `#A1D494` | Focus ring on inputs, progress bar fill, active chevron |
| `surface-tint` | `#3B6934` | Subtle tint applied to active accordion headers (5% opacity overlay) |
| `primary-fixed-dim` | `#A1D494` | Filled skill-level dot, entry count badge fill |

#### Secondary (Soft Sage)
| Token | Hex | Role in sidebar |
|---|---|---|
| `secondary` | `#4D644B` | Entry icon background tint, section divider label text |
| `secondary-container` | `#CFEACA` | Active section accordion header background tint, chip hover fill |
| `on-secondary-container` | `#536A51` | Chip label text on hover, secondary badge text |
| `secondary-fixed-dim` | `#B4CEAF` | Add-entry dashed border |

#### Tertiary (Warm Stone)
| Token | Hex | Role in sidebar |
|---|---|---|
| `tertiary` | `#3B3930` | Rich text toolbar background |
| `tertiary-container` | `#535046` | Toolbar button hover fill |
| `on-tertiary-container` | `#C7C2B6` | Toolbar icon default color |

#### Text
| Token | Hex | Role in sidebar |
|---|---|---|
| `on-surface` | `#1C1C18` | Primary text: entry titles, input values, section headers |
| `on-surface-variant` | `#42493E` | Secondary text: labels, subtitles, entry card subtitles |
| `outline` | `#72796E` | Input borders, card borders, divider lines |
| `outline-variant` | `#C2C9BB` | Ghost dividers between list items, subtle separators |
| `inverse-on-surface` | `#F3F0E9` | Text on dark (tertiary) backgrounds e.g. toolbar icons |

#### Semantic
| Token | Hex | Role in sidebar |
|---|---|---|
| `error` | `#BA1A1A` | Destructive action (trash icon) hover color |
| `error-container` | `#FFDAD6` | Trash button hover background |
| `on-error-container` | `#93000A` | Trash icon color on hover background |
| `on-background` | `#1C1C18` | All primary readable text |

---

### 2.2 Typography Tokens

| Token | Font | Size | Weight | Line Height | Letter Spacing | Usage in sidebar |
|---|---|---|---|---|---|---|
| `headline-md` | Manrope | 24px | 600 | 1.4 | — | Section panel heading when a section is open |
| `body-md` | Work Sans | 16px | 400 | 1.6 | — | Rich text editor body content |
| `body-sm` | Work Sans | 14px | 400 | 1.5 | — | Form input values, entry card titles, description text |
| `label-caps` | Work Sans | 12px | 600 | 1.0 | 0.05em | Form field labels, nav section dividers, badge text |

**Additional derived sizes (consistent with the system):**
- Accordion header label: Work Sans, 13px, weight 600, `on-surface`
- Entry card subtitle: Work Sans, 12px, weight 400, `on-surface-variant`
- Char count / hint: Work Sans, 11px, weight 400, `outline`
- Tip box body: Work Sans, 12px, weight 400, `on-surface-variant`, line-height 1.7
- User name in header: Manrope, 15px, weight 600, `on-surface`
- User email in header: Work Sans, 12px, weight 400, `on-surface-variant`
- Empty state text: Work Sans, 14px, weight 400, `outline`
- Progress label: Work Sans, 12px, weight 400, `on-surface-variant`
- Toast: Work Sans, 13px, weight 500, `#FFFFFF`

**Google Fonts import required:**
```
Manrope: weights 600, 700
Work Sans: weights 400, 600
```

---

### 2.3 Spacing Tokens

| Token | Value | Usage in sidebar |
|---|---|---|
| `xs` | 4px | Icon button internal padding, tight gaps |
| `sm` | 12px | Entry card internal padding horizontal, gap between icon and label |
| `base` | 8px | Gap between action icon buttons, toolbar button gap |
| `md` | 24px | Section content padding horizontal, gap between form groups |
| `gutter` | 24px | Sidebar horizontal padding |

**Derived spacing (consistent with 8px baseline):**
- Entry card padding: `14px 16px`
- Form field label margin-bottom: `7px`
- Form row gap (2-col): `16px`
- Form row gap (3-col): `12px`
- Gap between entry cards: `10px`
- Accordion header padding: `14px 16px`
- Edit form internal padding: `16px 18px`
- Add-entry button vertical margin: `10px 0`

---

### 2.4 Border Radius Tokens

| Token | Value | Usage in sidebar |
|---|---|---|
| `rounded-sm` | `0.25rem` (4px) | Toolbar buttons, badge pills |
| `rounded` (DEFAULT) | `0.5rem` (8px) | Inputs, selects, textareas, add-field chips |
| `rounded-md` | `0.75rem` (12px) | Entry cards, accordion headers, edit form container |
| `rounded-lg` | `1rem` (16px) | Sidebar header card, section group container |
| `rounded-xl` | `1.5rem` (24px) | Primary CTA button (Save Changes) |
| `rounded-full` | `9999px` | Entry count badge pills, skill-level dots, progress bar fill |

---

## 3. Elevation & Depth (Earth Shadows)

Depth is conveyed through **tonal layering** — lighter surfaces sit "higher." Shadows are minimal, earth-toned, and diffused. The shadow color mixes in the forest green primary at low opacity.

**Shadow formula:**
```
Earth Shadow: box-shadow: 0 Npx (N*3)px rgba(45, 90, 39, 0.08)
/* rgba(45, 90, 39) = primary-container (#2D5A27) as RGB */
```

| Level | CSS Value | Usage |
|---|---|---|
| Level 0 | `none` | Default entry cards, inputs |
| Level 1 | `0 1px 3px rgba(45,90,39,0.08)` | Accordion header default |
| Level 2 | `0 2px 8px rgba(45,90,39,0.10)` | Entry card hover, open edit form |
| Level 3 | `0 4px 16px rgba(45,90,39,0.13)` | Dragging entry card, elevated edit panel |

---

## 4. Sidebar Layout

### Outer Container
- **Width:** 440px fixed (matches FlowCV left panel proportion)
- **Height:** `100vh`, `overflow: hidden` on outer, `overflow-y: auto` on scrollable nav zone
- **Background:** `surface` (`#FCF9F2`)
- **Border-right:** `1px solid outline-variant` (`#C2C9BB`)
- **Display:** `flex; flex-direction: column`

### Internal Zones (top to bottom, fixed order)
1. **Top navigation tabs** — Overview / Content / Customize / AI Tools
2. **Sidebar header** — user identity card + progress bar (non-scrolling)
3. **Section accordion list** — scrollable, `flex: 1`
4. **Save / Discard footer** — non-scrolling
5. **Add Section button** — non-scrolling, pinned at very bottom

---

## 5. Component Specifications

### 5.1 Top Tab Bar

Displayed at the very top of the sidebar. "Content" tab is active when this sidebar is shown.

- Tab bar background: `surface-container-low` (`#F6F3EC`)
- `border-bottom: 1px solid outline-variant` (`#C2C9BB`)
- Tab item: Work Sans, 13px, weight 600, `on-surface-variant`
- **Active tab:** `on-surface` (`#1C1C18`), `border-bottom: 2px solid primary-container` (`#2D5A27`), icon tinted `primary-container`
- **Inactive tab hover:** background `surface-container` (`#F1EEE7`)
- Tab padding: `10px 16px`
- `display: flex; flex-direction: row`

---

### 5.2 Sidebar Header (User Identity Card)

Sits directly below the tab bar. Non-scrolling.

**Container:**
- `background: surface-container-low` (`#F6F3EC`)
- `border-bottom: 1px solid outline-variant` (`#C2C9BB`)
- `padding: 16px 20px`

**User card row:**
```
[Avatar 52×52px]  [Name 15px/600  ]
                  [Email 12px/400 ]
```
- Avatar: `border-radius: rounded-full`, `border: 2px solid outline-variant`
  - With photo: `object-fit: cover`
  - Without photo: initials, `background: secondary-container` (`#CFEACA`), initials `color: primary` (`#154212`), Manrope 18px/600
- Name: Manrope, 15px, 600, `on-surface`
- Email: Work Sans, 12px, 400, `on-surface-variant`

**Progress bar:**
- Label row: "Resume strength" left / percentage right — Work Sans 12px/400, `on-surface-variant`, `margin-bottom: 6px`
- Track: `height: 4px`, `background: surface-container-highest` (`#E5E2DB`), `border-radius: rounded-full`
- Fill: `background: inverse-primary` (`#A1D494`), `transition: width 0.5s ease`

---

### 5.3 Section Accordion Items

The primary navigation and content-reveal mechanism. Each section (Work Experience, Skills, etc.) is a collapsible accordion row in the list.

**Closed state — Section Header Row:**
```
[Section Icon 18px]  [Section Label 13px/600]  [Eye icon]  [Entry count badge]  [Chevron ↓]
```

- Container: `border-radius: rounded-md` (12px), `margin: 3px 10px`
- `background: surface-container-low` (`#F6F3EC`)
- `padding: 14px 16px`
- `border: 1px solid outline-variant` (`#C2C9BB`)
- `box-shadow: Level 1`
- `cursor: pointer`

**Hover state:**
- `background: surface-container` (`#F1EEE7`)
- `border-color: outline` (`#72796E`)

**Active / Open state:**
- `background: secondary-container` (`#CFEACA`) at 40% opacity over `surface-container-low`
- `border-color: primary-container` (`#2D5A27`)
- `border-left: 3px solid primary-container` (left accent bar; left corners `border-radius: 0`)
- Section icon: `color: primary` (`#154212`)
- Chevron: rotated 180°, `color: primary`
- `box-shadow: Level 2`

**Section icon:**
- 18px Tabler outline icon, default `on-surface-variant` (`#42493E`), active `primary` (`#154212`)
- Icon mapping:
  - Personal Details → `ti-user`
  - Professional Summary → `ti-align-left`
  - Work Experience → `ti-briefcase`
  - Technical Skills → `ti-tool`
  - Key Projects → `ti-folder`
  - Research Experience → `ti-star`
  - Educational Qualifications → `ti-school`
  - Certifications → `ti-certificate`

**Section label:** Work Sans, 13px, 600, `on-surface`

**Section-level Eye icon** (between label and entry count badge):
- `ti-eye` / `ti-eye-off`, 16px, `outline` (`#72796E`) default
- Toggles visibility of the entire section on the resume output
- Hover: `color: primary-container`
- When section is hidden: `ti-eye-off`, `color: outline-variant`

**Entry count badge:**
- `border-radius: rounded-full`, `padding: 2px 8px`
- Work Sans, 11px, 600
- Default: `background: surface-container-highest` (`#E5E2DB`), `color: on-surface-variant`
- Active section: `background: primary-fixed-dim` (`#A1D494`), `color: primary` (`#154212`)
- Content: count number (e.g. "2"), "✓" if fully complete, "0" if empty

**Chevron:**
- `ti-chevron-down`, 16px, `on-surface-variant` default, `primary` when active
- `transform: rotate(180deg)` when open, `transition: transform 0.3s ease`

**Expanded accordion body:**
- Slides open below header with `max-height` transition, 300ms cubic-bezier(0.4, 0, 0.2, 1)
- `background: surface` (`#FCF9F2`)
- `border: 1px solid outline-variant`
- `border-top: none` (connects flush to header)
- `border-radius: 0 0 rounded-md rounded-md` (bottom corners only, 12px)
- `padding: 10px 10px 12px`

---

### 5.4 Entry Cards (inside open accordion)

Each saved entry (e.g. "Betopia Group" under Work Experience) renders as a card inside the open accordion body.

**Card layout:**
```
[Drag ↕]  [Icon 32px]  [Title 14px/600      ]  [Eye]  [Trash]
                        [Subtitle 12px        ]
```

**Card container:**
- `background: surface-container` (`#F1EEE7`)
- `border: 1px solid outline-variant` (`#C2C9BB`)
- `border-radius: rounded-md` (12px)
- `padding: 12px 14px`
- `display: flex; align-items: flex-start; gap: 10px`
- `margin-bottom: 8px`
- `cursor: pointer`
- `transition: all 0.2s ease`

**Hover:**
- `background: surface-container-high` (`#EBE8E1`)
- `border-color: outline` (`#72796E`)
- `box-shadow: Level 2`

**Selected / edit-open:**
- `background: surface-container-lowest` (`#FFFFFF`)
- `border-color: primary-container` (`#2D5A27`)
- `border-left: 3px solid primary-container`
- `box-shadow: Level 2`

**Hidden (eye toggled off):**
- `opacity: 0.45`
- Title: `text-decoration: line-through`, `color: outline`

**Entry icon (left):**
- 32×32px, `border-radius: rounded` (8px)
- `background: secondary-container` (`#CFEACA`)
- Tabler icon 16px, `color: secondary` (`#4D644B`)
- Icon per section (same mapping as accordion headers)

**Entry text:**
- Title: Work Sans, 14px, 600, `on-surface`; `white-space: nowrap; overflow: hidden; text-overflow: ellipsis`
- Subtitle: Work Sans, 12px, 400, `on-surface-variant`

**Right action icons (far right, vertically centred):**
- All: 28×28px, `border-radius: rounded-sm` (4px), `border: none`, `background: none`
- **Eye `ti-eye` / `ti-eye-off`:**
  - Visible: `color: outline` (`#72796E`)
  - Hidden: icon → `ti-eye-off`, `color: outline-variant` (`#C2C9BB`)
  - Hover: `background: surface-container-high`
- **Trash `ti-trash`:**
  - Default: `color: outline`
  - Hover: `background: error-container` (`#FFDAD6`), `color: on-error-container` (`#93000A`)
- **Drag handle `ti-grip-vertical`:**
  - `color: outline-variant`, `cursor: grab`; grabbing → `cursor: grabbing`

**Ghost dividers between cards:** spacing gap of `8px` is sufficient. If a divider line is needed, use `border-top: 1px solid outline-variant` with a `linear-gradient` mask fading to transparent at both horizontal edges.

---

### 5.5 Eye / Visibility Toggle Behaviour

- **Entry-level:** eye icon on each entry card. Toggles that single entry's visibility on the exported resume. No content is deleted.
  - Visible: `ti-eye`, `color: outline`
  - Hidden: `ti-eye-off`, `color: outline-variant`; card opacity `0.45`; title `line-through`
- **Section-level:** eye icon in the section accordion header (between label and entry count badge). Hides the entire section block from resume output.
  - Same icon states as entry-level
- No confirmation dialog — immediate, fully reversible
- Tooltip on hover: "Hide from resume" / "Show on resume"
  - `background: inverse-surface` (`#31312C`), `color: inverse-on-surface` (`#F3F0E9`)
  - Work Sans, 11px, `border-radius: rounded-sm` (4px), `padding: 4px 8px`

---

### 5.6 Add Entry Button (per section)

Appears at the very bottom of each open accordion body, below all entry cards.

- Full-width within accordion body
- `border: 1.5px dashed secondary-fixed-dim` (`#B4CEAF`)
- `border-radius: rounded-md` (12px)
- `background: none`
- `padding: 10px`
- `display: flex; align-items: center; justify-content: center; gap: 8px`
- Label: Work Sans, 13px, 600, `on-surface-variant`
- Leading `ti-plus` icon, 16px, `on-surface-variant`

**Hover:**
- `border-color: primary-container` (`#2D5A27`)
- `background: secondary-container` (`#CFEACA`)
- Label + icon: `color: primary` (`#154212`)

**Label text per section:**
- Work Experience → "Add work experience"
- Technical Skills → "Add skill category"
- Key Projects → "Add project"
- Research Experience → "Add research entry"
- Educational Qualifications → "Add education"
- Certifications → "Add certification"

---

### 5.7 Inline Edit Form

Slides open directly below the selected entry card inside the accordion body. Not a modal or drawer.

**Container:**
- `background: surface-container-lowest` (`#FFFFFF`)
- `border: 1px solid primary-container` (`#2D5A27`)
- `border-radius: rounded-md` (12px)
- `padding: 16px 18px`
- `margin-top: 4px`
- `box-shadow: Level 2`
- Opens via `max-height` transition, 300ms cubic-bezier(0.4, 0, 0.2, 1)

**Edit form header row:**
- `[ti-edit 14px]  "Editing: [Entry Title]"`
- Work Sans, 12px, 600, `primary-container` (`#2D5A27`)
- `margin-bottom: 14px`
- `padding-bottom: 10px`
- `border-bottom: 1px solid outline-variant` (`#C2C9BB`)

---

### 5.8 Form Fields

#### Text input / Email / Tel
- `width: 100%`
- `padding: 10px 13px`
- `border: 1.5px solid outline` (`#72796E`)
- `border-radius: rounded` (8px)
- `background: surface-container-lowest` (`#FFFFFF`)
- Work Sans, 14px, 400, `color: on-surface`
- Placeholder: `color: outline` (`#72796E`)
- `transition: border-color 0.2s, box-shadow 0.2s`

**Focus:**
- `border-color: primary-container` (`#2D5A27`)
- `box-shadow: 0 0 0 3px rgba(161, 212, 148, 0.25)` — `inverse-primary` at 25% opacity
- `outline: none`

**Hover (unfocused):**
- `border-color: on-surface-variant` (`#42493E`)

#### Form labels
- Work Sans, 12px, 600, `on-surface-variant` (`#42493E`), `letter-spacing: 0.05em`
- `display: block; margin-bottom: 7px`

#### Textarea
- Same as text input, `min-height: 100px` (summary) / `130px` (descriptions), `resize: vertical`, `line-height: 1.6`

#### Select
- Same as text input, `appearance: none`, custom SVG arrow `background-image`, `padding-right: 36px`

#### 2-column form row
- `display: grid; grid-template-columns: 1fr 1fr; gap: 16px`

#### 3-column form row (dates + location)
- `display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px`

#### Field with Link button (Projects, Research, Certifications, LinkedIn, GitHub)
- Input: `padding-right: 74px`
- Link button: `position: absolute; right: 8px; top: 50%; transform: translateY(-50%)`
- **Unlinked:**
  - `padding: 4px 10px`, `border-radius: rounded` (8px)
  - `border: 1px solid primary-container` (`#2D5A27`)
  - `background: secondary-container` (`#CFEACA`)
  - `color: primary` (`#154212`), Work Sans 11px/600
  - Leading `ti-link` icon
  - Label: "Link" (default), "Verify" (certifications)
- **Linked:**
  - `background: primary-container` (`#2D5A27`), `color: on-primary` (`#FFFFFF`)
  - Label: "Linked ✓"
  - Hover: `transform: scale(1.02)` (tactile — per Forest & Stone button spec)

**URL input expander (slides in below on Link button click):**
- `max-height` transition, 200ms
- `background: surface-container-low` (`#F6F3EC`)
- `border: 1px solid outline-variant`, `border-radius: rounded`
- `padding: 8px 12px`, placeholder `https://...`
- Right: `ti-external-link` (open link) + `ti-x` (remove), both `color: outline`, hover `color: primary`

#### Field with clear (×) — date fields
- `ti-x` absolute right 10px, only visible when field has value
- `color: outline`, hover `color: error` (`#BA1A1A`)

#### Field with reorder handle — Personal Details
- `ti-arrows-up-down` absolute right 10px, `color: outline-variant`, `cursor: grab`

---

### 5.9 Rich Text Editor

Used in: Summary, Work Experience, Skills sub-skills, Projects, Research, Education, Certifications.

**Outer container:**
- `border: 1.5px solid outline` (`#72796E`), `border-radius: rounded` (8px), `overflow: hidden`
- Focus-within: `border-color: primary-container`, `box-shadow: 0 0 0 3px rgba(161,212,148,0.25)`

**Toolbar:**
- `background: tertiary` (`#3B3930`) — warm dark stone
- `border-bottom: 1px solid tertiary-container` (`#535046`)
- `padding: 8px 10px`, `display: flex; align-items: center; gap: 2px`

**Toolbar buttons:**
- 28×28px, `border-radius: rounded-sm` (4px), `border: none`
- Default: `background: none`, `color: on-tertiary-container` (`#C7C2B6`)
- Hover: `background: tertiary-container` (`#535046`), `color: inverse-on-surface` (`#F3F0E9`)
- Active: `background: primary-container` (`#2D5A27`), `color: on-primary` (`#FFFFFF`)

**Toolbar separator:** `1px solid tertiary-container`, height 16px, `margin: 0 4px`

**Toolbar button order:**
1. **B** bold
2. **I** italic
3. **U** underline
4. — separator —
5. `ti-list` bullet list
6. `ti-link` hyperlink
7. — separator —
8. `ti-align-left`
9. `ti-align-center`
10. `ti-align-right`
11. `ti-align-justified`

**Editable area:**
- `background: surface-container-lowest` (`#FFFFFF`), `padding: 12px 14px`
- `min-height: 100px` (default) / `130px` (descriptions)
- Work Sans, 14px, 400, `line-height: 1.6`, `color: on-surface`, `outline: none`
- Bullet lists: `padding-left: 18px`, `li { margin-bottom: 4px }`

> ❌ **No AI writing chips** — Improve Writing, Grammar Check, Shorter are removed per feedback

---

### 5.10 Skill Level Selector

**Optional.** Defaults to no selection. Fully deselectable.

- 5 dots in a row, `gap: 8px`
- Each dot: `width: 36px; height: 8px; border-radius: rounded-full`
- Unfilled: `background: surface-container-highest` (`#E5E2DB`)
- Filled: `background: primary-fixed-dim` (`#A1D494`)
- Hover (unfilled dot): `background: outline-variant` (`#C2C9BB`)
- Clicking dot N fills dots 1–N, clears N+1–5
- Clicking the currently-last-filled dot a second time clears all (full deselect)
- Labels below: Work Sans, 11px, 400, `outline` (`#72796E`), `display: flex; justify-content: space-between`
  - Beginner · Novice · Skilled · Advanced · Expert

---

### 5.11 Optional Field Chips (Personal Details — "Add more details")

Pill-shaped buttons for adding extra personal fields.

- `padding: 5px 12px`, `border-radius: rounded-full`
- `border: 1px solid outline-variant` (`#C2C9BB`)
- `background: surface-variant` (`#E5E2DB`)
- Work Sans, 12px, 600, `on-surface-variant`
- Leading `+` in `primary` (`#154212`)

**Hover:**
- `border-color: primary-container` (`#2D5A27`)
- `background: secondary-container` (`#CFEACA`)
- Text + `+`: `color: primary` (`#154212`)

**Options:** Website, Nationality, Date of Birth, Visa, Passport / ID, Availability, Pronouns, Portfolio

---

### 5.12 Section Nav Divider Labels

Group labels between sidebar sections.

- Work Sans, 11px, 600, `outline` (`#72796E`), `letter-spacing: 0.08em`, UPPERCASE
- `padding: 14px 16px 6px`
- No background, no border
- Categories: "Personal", "Content"

---

### 5.13 Save / Discard Footer

Non-scrolling bar pinned above the Add Section button.

- `border-top: 1px solid outline-variant` (`#C2C9BB`)
- `background: surface-container-low` (`#F6F3EC`)
- `padding: 12px 16px`
- `display: flex; gap: 10px; align-items: center`

**Auto-save indicator (left):**
- `ti-device-floppy` + "Auto-saving..."
- Work Sans, 11px, 400, `outline` (`#72796E`)
- `margin-right: auto`

**Discard button:**
- `padding: 9px 16px`, `border-radius: rounded-lg` (16px)
- `border: 1.5px solid outline` (`#72796E`), `background: surface`
- Work Sans, 13px, 600, `on-surface-variant`
- Hover: `border-color: on-surface-variant`, `background: surface-container`

**Save Changes button (primary CTA):**
- `padding: 9px 20px`, `border-radius: rounded-xl` (24px)
- `background: primary-container` (`#2D5A27`), `color: on-primary` (`#FFFFFF`), `border: none`
- Manrope, 13px, 700
- **Hover:** `transform: scale(1.02)`, `box-shadow: 0 4px 14px rgba(45,90,39,0.25)` — tactile lift, no color darkening (per Forest & Stone button spec)
- Active: `transform: scale(1.00)`
- Leading `ti-check` icon

---

### 5.14 Add Section Button (Sidebar Footer)

Pinned at the very bottom of the sidebar.

- `margin: 10px 12px 14px`, `width: calc(100% - 24px)`
- `padding: 11px`
- `border: 1.5px dashed secondary-fixed-dim` (`#B4CEAF`)
- `border-radius: rounded-md` (12px), `background: none`
- `display: flex; align-items: center; justify-content: center; gap: 8px`
- Work Sans, 13px, 600, `on-surface-variant`
- Leading `ti-plus` icon, `on-surface-variant`

**Hover:**
- `border-color: primary-container` (`#2D5A27`)
- `background: secondary-container` (`#CFEACA`)
- Text + icon: `color: primary` (`#154212`)

---

### 5.15 Toast Notification

- `position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%)`
- `background: inverse-surface` (`#31312C`), `color: inverse-on-surface` (`#F3F0E9`)
- `padding: 10px 16px`, `border-radius: rounded-lg` (16px)
- Work Sans, 13px, 500
- `display: flex; align-items: center; gap: 8px`
- Leading `ti-check-circle` icon
- Animate in: `transform: translateY(40px) → 0`, `opacity: 0 → 1`, `transition: 0.25s ease`
- Auto-dismiss: 2500ms

---

## 6. Scrollbar

Applied to the sidebar section accordion list only.

```css
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: #C2C9BB; /* outline-variant */
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: #72796E; /* outline */
}
```

---

## 7. Section-by-Section Field Reference

### 7.1 Personal Details
| Field | Type | Behaviour |
|---|---|---|
| Full name | Text input | Drives sidebar avatar initials live |
| Professional title | Text input | Placeholder: "Target position or current role" |
| Photo | Upload area | 80×80 circle, hover camera overlay in `primary-container` |
| Email | Text input | Reorder handle right |
| Phone | Text input | Reorder handle right |
| Location | Text input | Placeholder: "City, Country" |
| LinkedIn | Text + Link button | |
| GitHub | Text + Link button | |
| Optional extras | Pill chips | Website, Nationality, DOB, Visa, Passport/ID, Availability, Pronouns, Portfolio |

### 7.2 Professional Summary
| Field | Type | Behaviour |
|---|---|---|
| Summary | Rich text editor | Char count below, max 600 |

### 7.3 Work Experience (repeatable entries)
| Field | Type | Behaviour |
|---|---|---|
| Job title | Text input | |
| Company | Text input | |
| Start date | Text + clear × | MM/YYYY |
| End date | Text input | MM/YYYY or "Present" |
| Location | Text input | "City, Country or Remote" |
| Description | Rich text editor | Bullet list default |

### 7.4 Technical Skills (repeatable entries)
| Field | Type | Behaviour |
|---|---|---|
| Skill category | Text input | e.g. "Programming & Backend" |
| Sub-skills | Rich text editor | Comma-separated or bulleted |
| Skill level | 5-dot selector | Optional, fully deselectable |

### 7.5 Key Projects (repeatable entries)
| Field | Type | Behaviour |
|---|---|---|
| Project title | Text + Link button | Inline URL expander below on click |
| Subtitle / Tech stack | Text input | |
| Start date | Text + clear × | MM/YYYY |
| End date | Text input | MM/YYYY or "Present" |
| Description | Rich text editor | Bullet list default |

### 7.6 Research Experience (repeatable entries)
| Field | Type | Behaviour |
|---|---|---|
| Research title | Text + Link button | Links to paper / repo URL |
| Institution | Text input | |
| Start year | Text + clear × | YYYY |
| End year | Text input | YYYY |
| Location | Text input | |
| Description | Rich text editor | Bullet list default |

### 7.7 Educational Qualifications (repeatable entries)
| Field | Type | Behaviour |
|---|---|---|
| Degree | Text input | |
| School / University | Text + Link button | |
| Start year | Text + clear × | YYYY |
| End year | Text input | YYYY |
| Location | Text input | |
| Description | Rich text editor | e.g. CGPA, coursework |

### 7.8 Certifications (repeatable entries)
| Field | Type | Behaviour |
|---|---|---|
| Certification name | Text + Link button | "Verify" label → certificate URL |
| Issuing organisation | Text input | |
| Issue date | Text input | MM/YYYY |
| Expiry date | Text input | MM/YYYY or "No expiry" |
| Credential ID | Text input | Optional |

---

## 8. Interaction Patterns

### Accordion open/close
- Clicking a section header opens the entry list below via `max-height` slide (300ms cubic-bezier ease)
- Only one section open at a time — opening a new one collapses the previous
- Header: left-border turns `primary-container`, icon color → `primary`, chevron rotates 180°

### Entry card click → inline edit form
- Clicking an entry card slides open its edit form directly below it
- Card enters selected state (white bg, green left border)
- Only one edit form open per section at a time; selecting a different card collapses the current
- Edit form header title and entry card title both update live as user types

### Add entry (`+` button)
- Appends a blank entry card at bottom of the section list
- Immediately opens its edit form
- Card shows "New Entry" placeholder until user types in the title field

### Eye / visibility toggle
- Entry-level: `ti-eye` → `ti-eye-off`; card `opacity: 0.45`, title `line-through`
- Section-level: same behaviour, hides the whole section from resume output
- Fully reversible, no confirmation

### Link attachment flow
1. Click "Link" button on a title field
2. URL input slides in below (200ms transition)
3. Input shows `ti-external-link` + `ti-x` on right
4. On valid URL: button → "Linked ✓", `background: primary-container`, white text
5. On `ti-x`: URL cleared, button reverts to unlinked state

### Drag to reorder
- `ti-grip-vertical` handle on every entry card
- Dragging: `box-shadow: Level 3`, `opacity: 0.9`
- Drop zone: `2px dashed secondary-fixed-dim` (`#B4CEAF`) highlight

### Progress bar
- Recalculates on save / entry add — formula: filled sections ÷ total sections × 100
- Animates via `transition: width 0.5s ease`

### Toast
- Triggers: save, discard, entry delete, link set, visibility toggle
- One visible at a time — rapid triggers reset the dismiss timer

---

## 9. Explicitly Removed Features

Per user feedback — **do not implement:**
- ❌ AI writing chips (Improve Writing, Grammar Check, Shorter, Expand, Tailor to Job)
- ❌ Mandatory skill level — selector is optional and fully deselectable
- ❌ Page-navigation pattern — sections open as accordions inside the sidebar, not new pages
- ❌ Separate full-page edit views for any section

---

## 10. Token Quick Reference Card

| Concept | Token name | Hex |
|---|---|---|
| Sidebar background | `surface` | `#FCF9F2` |
| Accordion header | `surface-container-low` | `#F6F3EC` |
| Entry card default | `surface-container` | `#F1EEE7` |
| Entry card hover | `surface-container-high` | `#EBE8E1` |
| Input / edit form bg | `surface-container-lowest` | `#FFFFFF` |
| Primary CTA / active accent | `primary-container` | `#2D5A27` |
| Active icon / text | `primary` | `#154212` |
| Active section tint | `secondary-container` | `#CFEACA` |
| Focus ring color | `inverse-primary` | `#A1D494` |
| Progress bar fill | `inverse-primary` | `#A1D494` |
| Skill dot filled | `primary-fixed-dim` | `#A1D494` |
| Entry icon bg | `secondary-container` | `#CFEACA` |
| Entry icon color | `secondary` | `#4D644B` |
| Toolbar background | `tertiary` | `#3B3930` |
| Toolbar button hover | `tertiary-container` | `#535046` |
| Toolbar icon default | `on-tertiary-container` | `#C7C2B6` |
| Input border default | `outline` | `#72796E` |
| Card / subtle border | `outline-variant` | `#C2C9BB` |
| Primary text | `on-surface` | `#1C1C18` |
| Secondary text / labels | `on-surface-variant` | `#42493E` |
| Muted / hint / placeholder | `outline` | `#72796E` |
| Delete hover background | `error-container` | `#FFDAD6` |
| Delete hover icon | `on-error-container` | `#93000A` |
| Toast background | `inverse-surface` | `#31312C` |
| Toast text | `inverse-on-surface` | `#F3F0E9` |
| Add-entry dashed border | `secondary-fixed-dim` | `#B4CEAF` |
| Display font | Manrope | weights 600, 700 |
| Body / UI font | Work Sans | weights 400, 600 |
