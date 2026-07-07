# TEKO — Brand Identity & Design System

> Use this document as the base prompt when creating visual assets, presentations, social media graphics, pitch decks, or any design material for TEKO using Claude Design or any AI design tool.

---

## 1. Brand Overview

**Name:** TEKO
**Industry:** Digital Agency / Software Development
**Tagline:** "Software que transforma negocios"
**Description:** TEKO is a modern digital agency that designs, develops, and deploys custom digital solutions. We build web platforms, mobile apps, backend systems, APIs, and integrations for businesses looking to digitize and scale their operations.

**Brand Personality:**
- **Professional yet approachable** — We're experts, but we communicate clearly
- **Futuristic & innovative** — We live at the edge of technology
- **Premium & polished** — Every pixel matters
- **Trustworthy & reliable** — Clients trust us with their business transformation

**Target Audience:** Business owners, CTOs, startups, and enterprises in Latin America and Spanish-speaking markets looking for digital transformation partners.

**Language:** Spanish (primary), English (secondary)

---

## 2. Logo

**Primary Logo:** The TEKO logo consists of two elements:
1. **Icon:** A spiral/turbine symbol made of curved blades radiating from a center point, using a gradient from cyan (#1ec4ff) to deep blue (#0047ff). It evokes motion, energy, innovation, and transformation.
2. **Wordmark:** "TEKO" in bold uppercase white text. The letter "E" has distinctive horizontal striped bars cut through it, giving it a tech/digital aesthetic. The text has a subtle cyan glow effect.

**Logo Usage Rules:**
- The logo is designed for dark backgrounds (the wordmark is white)
- On light backgrounds, apply `brightness: 0.75` and `contrast: 1.25` to darken it
- Never alter the colors of the logo icon gradient
- Maintain clear space around the logo equal to the height of the "T" character
- Minimum size: 105px width for digital

**Alternate Footer Logo:** In the footer, a simplified version is used: a small grid icon (LayoutGrid) in a white/20 rounded container + "teko." in lowercase bold 2xl text.

---

## 3. Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| **TEKO Blue** | `#0047ff` | Primary brand color, CTAs, active states, accent text |
| **TEKO Cyan** | `#1ec4ff` | Gradient start, highlights, energy accents |
| **TEKO Mid Blue** | `#0b6eff` | Gradient midpoint, link hovers |
| **Footer Blue** | `#1880ff` | Footer background |

### Brand Gradient (Primary)
```
background: linear-gradient(to bottom, #1ec4ff, #0b6eff, #0047ff);
```
This gradient is used for: active navigation items, primary CTA buttons, project progress indicators, and accent elements.

### Hero Gradient
```
background: linear-gradient(177.33deg, #0071ff 10.4%, #ffffff 96.3%);
```
Blue-to-white diagonal gradient used as the hero section background.

### Accent Color (Dark text on blue)
| Name | Hex | Usage |
|------|-----|-------|
| **Soft Blue** | `#7aa3ff` | Accent text in dark mode, subtitle highlights |
| **Accent Italic** | `#2e5fff` | Secondary italic accent in hero text |

### Neutral Colors (Light Mode)

| Name | Hex | Usage |
|------|-----|-------|
| **Heading** | `#101828` | Primary headings, titles |
| **Body** | `#252b37` | Body text, nav links |
| **Secondary** | `#52607a` | Descriptions, secondary text |
| **Muted** | `#7a8595` | Captions, timestamps, subtle labels |
| **Border Light** | `#e6eaf2` | Card borders, dividers |
| **Background Soft** | `#f4f7ff` | Soft blue tint background for tags, pills |
| **Hover BG** | `#eef4ff` | Light hover state backgrounds |

### Dark Mode Colors

| Name | Hex | Usage |
|------|-----|-------|
| **BG Deep** | `#0a0e1a` | Page background |
| **BG Card** | `#0f1525` | Card surfaces, elevated containers |
| **BG Panel** | `#0c1120` | Sidebar, panels |
| **Text Primary** | `white` | Headings |
| **Text Secondary** | `white/85` | Nav links, readable text |
| **Text Muted** | `white/50` | Descriptions, secondary info |
| **Text Subtle** | `white/40` | Timestamps, minimal labels |
| **Border** | `white/10` | Card borders, dividers |
| **Border Accent** | `white/20` | Glass container borders |
| **Border Glow** | `white/30` | Logo container, prominent glass borders |

### Status Colors

| Status | Color | Usage |
|--------|-------|-------|
| **In Progress** | Blue `#0047ff` | Active projects, ongoing tasks |
| **In Review** | Amber/Yellow | Items pending review |
| **Completed** | Green | Finished items, success states |
| **Paused** | Gray | Inactive/paused items |
| **Cancelled** | Red | Cancelled items, errors |
| **Overdue** | Red | Past-due invoices, deadlines |

### Shadow System

| Name | Value | Usage |
|------|-------|-------|
| **Blue Glow** | `0 8px 24px -10px rgba(11,110,255,0.35)` | Logo, glass containers |
| **Blue CTA** | `0 8px 24px -6px rgba(11,110,255,0.6)` | Primary buttons |
| **Blue CTA Hover** | `0 10px 30px -6px rgba(11,110,255,0.8)` | Button hover state |
| **Card Shadow** | `0 8px 32px -12px rgba(16,24,40,0.18)` | Nav pill, cards (light) |
| **Dark Card Shadow** | `0 8px 32px -12px rgba(30,196,255,0.25)` | Nav pill, cards (dark) |
| **Cyan Glow (dark)** | `0 8px 24px -10px rgba(30,196,255,0.35)` | Logo container in dark |
| **Violet Glow** | `rgba(124,58,237,0.5)` | TEKO Manager product card |

---

## 4. Typography

### Font Stack

| Role | Font Family | Weight | Style | Fallback |
|------|-------------|--------|-------|----------|
| **Display / Hero Headings** | Advercase | Bold (700) | Normal | Old Standard TT, Georgia, Times New Roman, serif |
| **Accent / Editorial** | PPEditorialOld | Regular (400) | Italic | Iowan Old Style, Georgia, Times New Roman, serif |
| **Body / UI** | Geist | Variable | Normal | System sans-serif |

### Usage Pattern
- **Hero headlines** use Advercase Bold for strong, impactful display text
- **Highlighted words** within headings (like "transforman", "futuro") use PPEditorialOld Italic in a contrasting blue color — this creates the signature TEKO visual rhythm of bold + italic in headlines
- **All UI text, navigation, body copy, buttons** use Geist (the system font set as `--font-sans`)

### Type Scale (approximate)

| Element | Size | Weight | Letter Spacing |
|---------|------|--------|----------------|
| Hero H1 (mobile) | 34px / 42px line | Bold | -0.012em |
| Hero H1 (tablet) | 52-64px / 60-74px line | Bold | -0.012em |
| Hero H1 (desktop) | 72px / 74px line | Bold | -0.012em |
| Section Title | 3xl-5xl responsive | Bold | tight |
| Section Subtitle | 11px uppercase | Bold | 0.2em |
| Card Title | xl (20px) | Bold | — |
| Nav Link | 13px | Medium (500) | — |
| Button | 13px | Semibold-Black | — |
| Body Text | 13-14px | Regular | — |
| Tag/Pill | 11px | Medium | — |
| Caption | 11-12px | Regular-Semibold | — |

---

## 5. Design Patterns

### Glass-morphism (Core Visual Identity)

Glass-morphism is TEKO's signature UI pattern. It creates depth and elegance with translucent surfaces:

**Light Mode Glass:**
```
background: white/80 (or white/20 for less opacity)
backdrop-filter: blur(20px) saturate(140%)
-webkit-backdrop-filter: blur(20px) saturate(140%)
border: 1px solid #e6eaf2 (or white/30 for glass borders)
```

**Dark Mode Glass:**
```
background: white/5 (or white/10)
backdrop-filter: blur(20px) saturate(140%)
border: 1px solid white/10 (or white/20)
```

**Usage:** Navigation bar, logo container, cards, sidebars, modals, mobile menu overlays.

### Border Radius System

| Element | Radius |
|---------|--------|
| Cards, panels, modals | `rounded-2xl` (1rem) |
| Buttons, pills, nav links, avatars | `rounded-full` |
| Inner elements, inputs | `rounded-xl` (0.75rem) |
| Tags, small chips | `rounded-full` |
| Logo container | `rounded-2xl` |

### Active State (Navigation)
Active nav items get the full brand gradient background with white text and a blue glow shadow:
```
background: linear-gradient(to bottom, #1ec4ff, #0b6eff, #0047ff)
color: white
shadow: 0 4px 18px -4px rgba(11,110,255,0.6)
```

### Grid Patterns
A subtle white grid overlay on the hero section:
```
background-image: linear-gradient(to right, rgba(255,255,255,0.28) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255,255,255,0.28) 1px, transparent 1px);
background-size: 62px 62px;
```

---

## 6. UI Components Style

### Buttons

**Primary CTA:**
- Full brand gradient (`from-[#1ec4ff] via-[#0b6eff] to-[#0047ff]`)
- `rounded-full`, `h-11`, `px-5`
- White text, 13px, font-semibold
- Blue glow shadow, brightens on hover
- Often includes an arrow: `→`

**Secondary / Glass Button:**
- `bg-white/20`, `border border-white/30`
- `backdrop-blur-md`, `rounded-full`
- White text, `h-11`, `px-5`
- Hover: `bg-white/30`

**Ghost Button:**
- `bg-transparent`, inner white border shadow
- `backdrop-blur-[2px]`
- Blue or white text depending on context

### Cards

**Standard Card:**
- `rounded-3xl` border
- Light: `bg-white border-[#e6eaf2]`
- Dark: `bg-[#0f1525] border-white/10`
- Hover: `-translate-y-1` lift + `shadow-2xl`
- Transition: `duration-500`

**Glass Card (overlays, menus):**
- `bg-white/10 dark:bg-white/5`
- `border border-white/20`
- `backdrop-blur-2xl`
- Deep shadow: `0 8px 40px -12px rgba(0,0,0,0.4)`

### Status Badges / Pills
- `rounded-full`, `px-3 py-1.5`
- `text-[11px] font-medium`
- Light: `bg-[#f4f7ff] text-[#52607a]`
- Dark: `bg-white/5 text-white/50`
- Colored variants for project statuses

### Icons
- **Library:** Lucide React (primary), React Icons (social media)
- **Size:** `h-4 w-4` to `h-5 w-5` for UI, `h-16 w-16` for hero/feature icons
- **Style:** Stroke-based, consistent 2px stroke width
- **Color:** Inherits from parent text color

---

## 7. Animation & Motion

**Library:** GSAP (GreenSock Animation Platform)

**Principles:**
- Smooth, professional entrances — never jarring
- Staggered reveals for lists and grids
- Respects `prefers-reduced-motion`
- Always clean up with `gsap.context()` + `ctx.revert()`

**Common Patterns:**
- **Entrance:** `y: 50, opacity: 0 → y: 0, opacity: 1` with `power3.out`, `duration: 0.7`
- **Stagger:** `0.15s` between items
- **Theme toggle icon:** `rotation: -90, scale: 0.6, opacity: 0` → normal with `back.out(1.7)`
- **Hover transforms:** CSS-based, `duration-300` to `duration-500`
- **Page transitions:** Elements slide up and fade in on mount

---

## 8. Page Structures

### Marketing Site Sections
1. **Hero** — Full-screen, blue-to-white gradient, grid overlay, Advercase headline with PPEditorialOld italic accents, two CTA buttons
2. **Transformacion Digital** — Value propositions
3. **Nuestro Proceso de Trabajo** — Process/workflow showcase
4. **Lo Que Hacemos Mejor** — Services/strengths
5. **Ahorra Tiempo** — Efficiency/benefits section
6. **Footer** — Blue (#1880ff) background, 4-column link grid, social icons, copyright

### Portal (Client Dashboard)
- **Login:** Mountain landscape photo background, dark overlay, centered glass login form
- **Dashboard Shell:** Left sidebar (glass, collapsible 240px/68px) + topbar (breadcrumbs, notifications, avatar)
- **Pages:** Dashboard overview, Projects (list + detail), Meetings, Files, Invoicing, Messages, Profile

---

## 9. Products / Platforms

| Product | Description | Visual Identity |
|---------|-------------|-----------------|
| **TEKO Manager** | Social media management platform (scheduling, analytics, multi-account) | Violet-to-indigo gradient (`from-violet-600 to-indigo-600`), shadow `rgba(124,58,237,0.5)` |
| **Portal de Clientes** | Client dashboard for project tracking, deliverables, meetings, invoicing | TEKO Blue gradient (`from-[#0b6eff] to-[#0047ff]`), shadow `rgba(11,110,255,0.5)` |

---

## 10. Design Tokens Quick Reference

```
--teko-blue:          #0047ff
--teko-cyan:          #1ec4ff
--teko-mid-blue:      #0b6eff
--teko-footer-blue:   #1880ff
--teko-soft-blue:     #7aa3ff
--teko-dark-bg:       #0a0e1a
--teko-dark-card:     #0f1525
--teko-dark-panel:    #0c1120
--teko-heading:       #101828
--teko-body:          #252b37
--teko-secondary:     #52607a
--teko-muted:         #7a8595
--teko-border-light:  #e6eaf2
--teko-bg-soft:       #f4f7ff

--font-display:       "Advercase", serif
--font-editorial:     "PPEditorialOld", serif
--font-body:          "Geist", system-ui, sans-serif

--radius-card:        1rem (rounded-2xl)
--radius-button:      9999px (rounded-full)
--radius-input:       0.75rem (rounded-xl)

--gradient-primary:   linear-gradient(to bottom, #1ec4ff, #0b6eff, #0047ff)
--gradient-hero:      linear-gradient(177.33deg, #0071ff 10.4%, #ffffff 96.3%)
--shadow-blue-glow:   0 8px 24px -10px rgba(11,110,255,0.35)
--shadow-blue-cta:    0 8px 24px -6px rgba(11,110,255,0.6)
```

---

## 11. Social Media & External Presence

- **Twitter/X:** Present (icon linked)
- **LinkedIn:** Present (icon linked)
- **GitHub:** Present (icon linked)
- **Website:** teko (icon linked)
- **Copyright:** "2026 TEKO. Todos los derechos reservados."

---

## 12. Do's and Don'ts

### Do's
- Use glass-morphism for elevated surfaces and overlays
- Apply the brand gradient for active/primary states
- Use Advercase Bold for big impactful headlines
- Use PPEditorialOld Italic for accent words within headings
- Maintain generous whitespace and padding
- Use blue glow shadows to add depth and brand recognition
- Support both light and dark modes in all designs
- Use smooth, professional GSAP animations
- Keep buttons rounded-full with the gradient or glass style

### Don'ts
- Never use flat/matte surfaces without any glass or depth effect
- Never change the logo colors or icon gradient
- Never use colors outside the defined palette
- Don't use heavy/blocky shadows — always use soft, colored glows
- Don't mix the brand gradient with other random gradients
- Don't use serif fonts for body text (only Advercase/PPEditorialOld for display)
- Don't skip dark mode support — TEKO defaults to dark
- Don't use harsh borders — prefer subtle white/10 or white/20 transparency borders

---

## 13. Prompt Template for AI Design Tools

When creating assets with Claude Design or similar tools, start with:

> **"Create a [asset type] for TEKO, a premium digital agency. Use the brand colors: primary blue #0047ff, cyan accent #1ec4ff, with the signature gradient from cyan to blue. The design should feature glass-morphism effects (translucent surfaces with blur and subtle white borders), rounded corners (2xl for cards, full for buttons), and blue glow shadows. Typography: use a bold display font for headlines with italic serif accents for highlighted words. The overall feel should be futuristic, premium, polished, and tech-forward. Dark mode preferred with background #0a0e1a. Include subtle grid patterns or geometric elements for texture."**

---

*This document is the single source of truth for TEKO's visual identity. All designs, marketing materials, presentations, and digital assets should adhere to these guidelines.*
