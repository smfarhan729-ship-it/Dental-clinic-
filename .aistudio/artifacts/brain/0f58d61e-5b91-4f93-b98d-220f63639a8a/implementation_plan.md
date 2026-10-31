# AURA Dental Clinique — Swiss Luxury Scroll-Driven Experience

A luxury Swiss medical dental website featuring an interactive full-screen floating tooth canvas scrubbed across 299 sequence frames via GSAP ScrollTrigger, an interactive doctor expertise profile, before/after smile transformation slider, real-time appointment booking with email notifications, and a PIN-secured patient records portal with historical data export.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural design and user experience choices confirmed during Phase 1 clarification:

- **Aesthetic Identity**: Swiss luxury medical direction utilizing an obsidian dark canvas (`#08090C`), frosted titanium borders, crystal ice-white headings, and subtle platinum highlights to deliver an elite, clinical feel.
- **Tooth Scroll Interaction**: High-performance HTML5 Canvas frame scrubbing loading the 299 extracted rotation frames from `/public/assets/aistudio/ezgif-26acb736de722fa0-jpg_7ee93ec7.zip`, synchronized to GSAP ScrollTrigger for buttery 60fps rotation and fluid spatial descent as the user navigates the page.
- **Patient Privacy & Records**: PIN-protected client-side encrypted patient vault with diagnostic histories, treatment timelines, and instant multi-format health data export (JSON, CSV, and clinical PDF-style summary).

---

## 1. Overview & Core Concept

- **What It Does**: A cinematic, award-winning medical website for an elite cosmetic & restorative dental clinic. The 3D rotating tooth serves as the visual spine, smoothly descending, rotating, and scaling across each section in sync with user scrolling.
- **Target Audience**: Discerning patients seeking world-class restorative dentistry, dental implants, veneers, and aesthetic smile transformations.
- **Key Value**: Delivers deep clinical trust and visceral luxury through seamless motion design, transparent before/after clinical outcomes, friction-free booking, and private patient data management.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Hero & 3D Interactive Introduction**:
   - The user arrives at an obsidian-toned hero section with refined typography ("PRECISION DENTISTRY AT THE PINNACLE OF SCIENCE").
   - The tooth floats centrally on an HTML5 Canvas, rendered crisply with ambient lighting.
   - Initial mouse hover provides gentle 3D parallax tilt; as the user scrolls, GSAP ScrollTrigger takes authoritative control, rotating the tooth 360° while shifting its scale and position from center to alongside section content.

2. **Specialist & Doctor Profile Showcase**:
   - Following the hero, the tooth drifts into an architectural orbit beside the clinic leadership spotlight.
   - Doctor profile card featuring Dr. Elena von Berg (Chief of Aesthetic Prosthodontics) and Dr. Marcus Weber (Director of Implantology).
   - High-fidelity doctor imagery with interactive hover states: hovering expands clinical credentials, surgical honors, Board certifications, and specialized procedures.

3. **Interactive Before & After Smile Transformation Slider**:
   - High-resolution comparison module with a draggable vertical divider slider.
   - Real clinical cases: Porcelain Veneer Reconstruction, Full-Arch Implant Restoration, and Alignment/Whitening.
   - Interactive zoom toggle, metric badges (treatment duration, shade improvement, structural alignment), and clinical notes.

4. **Real-Time Appointment Booking System**:
   - Interactive consultation scheduler with live calendar date picking, time slot availability synchronization, doctor selection, and treatment categorization.
   - Live validation, instant visual booking summary, and email notification dispatch simulation with an on-screen preview of the patient confirmation email.

5. **PIN-Protected Patient Records Portal & Health Data Export**:
   - Secure login modal requesting a 4-digit security PIN (pre-seeded with a demo profile + custom PIN setup).
   - Once authenticated, unlocks the encrypted patient health dossier: treatment timeline, X-ray diagnostic notes, periodontal charts, and upcoming follow-ups.
   - One-click export options: Download JSON Health Record, Export CSV Appointments Log, and Print/Save Medical Summary.

### Visual Identity & Theme

- **Aesthetic Direction**: Swiss Minimalist Luxury Medical (`#08090C` deep obsidian, `#0F1117` titanium slate, `#FFFFFF` crisp ice-white typography, `#38BDF8` subtle cyan medical glow, `#94A3B8` muted surgical steel).
- **Typography & Hierarchy**:
  - *Display / Headings*: `Plus Jakarta Sans` with tight tracking (`tracking-tight`) and balanced measure (`text-wrap: balance`).
  - *Prose & Body*: `Plus Jakarta Sans` / `DM Sans` (15px–16px, 1.6 line height).
  - *Data & Metrics*: `font-mono tabular-nums` for precise alignment of times, dental tooth numbers, and clinical metrics.
- **Zero-Pill Discipline**: All categories, metadata, and dates are presented as clean unboxed typographic labels with subtle `·` separators.
- **Seamless Spacing**: All sections engineered with zero awkward margins or overflow gaps; container padding follows the spatial math rule ($\text{container padding} \ge \text{inner gap}$).

---

## 3. Key Product Decisions & Trade-Offs

- **Canvas 2D Frame Scrubbing over Raw Video or Heavy 3D WebGL**:
  - *Chosen Approach*: Unpack the 299 image frames into an optimized public directory. An HTML5 Canvas preloads frames progressively into memory with an offscreen buffer and uses `requestAnimationFrame` + GSAP ScrollTrigger to draw the exact frame index corresponding to scroll progress.
  - *Why*: Guarantees 60fps performance on both mobile and desktop without WebGL shader compilation stutters or video playback lag on mobile browsers.
- **GSAP + ScrollTrigger Timeline Coordination**:
  - *Chosen Approach*: A pinned or multi-stage ScrollTrigger timeline that moves the canvas container across viewport anchors (Hero center $\to$ Doctor right $\to$ Technology backdrop) while continuously driving the frame index.
- **PIN-Protected Local Storage Encrypted Vault**:
  - *Chosen Approach*: Client-side cryptographic hash verification for PIN access with encrypted localStorage state for appointments and patient notes.
  - *Why*: Instant, zero-cloud dependency, 100% private, works completely offline, and allows immediate JSON/CSV export without exposing private data to third-party servers.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Next.js App Router (Client)                     │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Navigation Header: Top Bar Contract (Wordmark · Links · CTA)    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Floating Tooth Canvas Layer (Fixed/Sticky GSAP ScrollTrigger)    │  │
│  │  - 299 Cached Frames                                             │  │
│  │  - Smooth Scrubbing & Responsive Canvas Resizing                 │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│  │  Hero Section    │  │  Doctor Section  │  │  Before/After    │      │
│  │  - Value Prop    │  │  - Interactive   │  │  - Comparison    │      │
│  │  - Quick Metrics │  │    Specialist    │  │    Slider Case   │      │
│  │  - Primary CTA   │  │    Credentials   │  │    Studies       │      │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘      │
│                                                                        │
│  ┌──────────────────────────────────────┐  ┌─────────────────────────┐ │
│  │  Real-Time Booking Engine            │  │ PIN Patient Records     │ │
│  │  - Calendar & Slot Availability Sync │  │ - Encrypted Local Vault │ │
│  │  - Email Notification Generator      │  │ - CSV/JSON Data Export  │ │
│  └──────────────────────────────────────┘  └─────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Key Libraries & Setup

1. **`gsap` & `@gsap/shockingly` / `gsap/ScrollTrigger`**: Installed via package manager for buttery smooth scroll coordination.
2. **`unzipper` / Node extraction script**: Unpack the 299 frames from `ezgif-26acb736de722fa0-jpg_7ee93ec7.zip` into `/public/tooth-sequence/` with zero quality loss.
3. **`lucide-react`**: Standardized clean iconography.
4. **`canvas-confetti`** (optional): Elegant booking completion state.

---

## Verification & Quality Assurance Plan

1. **Tooth Canvas Scrubbing**: Verify buttery smooth frame playback across all 299 frames on desktop & mobile with zero flickering.
2. **Doctor Hover Card**: Verify that hover and touch interactions cleanly display specialized credentials, awards, and procedures.
3. **Before & After Slider**: Verify touch and mouse drag precision, comparison boundaries, and high-fidelity rendering.
4. **Booking Flow**: Verify slot selection, form validation, immediate confirmation modal, and email notification preview.
5. **Patient Portal**: Verify 4-digit PIN authentication, record display, and successful CSV/JSON download triggers.
6. **Zero-Gap Layout Audit**: Ensure zero unwanted white gaps, zero horizontal overflow, and pristine 1440px desktop alignment.
