'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowLeftRight, CheckCircle2, ChevronRight, Sliders, Shield, ZoomIn } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface CaseStudy {
  id: string;
  title: string;
  category: string;
  patientAge: string;
  technique: string;
  duration: string;
  shadeShift: string;
  details: string;
  beforeNotes: string[];
  afterNotes: string[];
  // SVG/visual rendering parameters for macro tooth smile simulation
  beforeColor: string;
  afterColor: string;
  teethShape: 'aligned' | 'diastema' | 'implant';
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-01',
    title: 'Full Arch Porcelain Veneer Reconstruction',
    category: 'Cosmetic Prosthodontics',
    patientAge: '38-year-old Corporate Executive',
    technique: '10 Upper E.max Lithium Disilicate Hand-Layered Veneers (0.25mm)',
    duration: '14 Days (2 Clinical Sessions)',
    shadeShift: 'Vita A3.5 → Natural Vita B1 Translucent',
    details: 'Patient presented with severe incisal attrition, tetracycline discoloration, and asymmetrical smile arc. Micro-layered veneers restored ideal golden proportion with subtle organic characterization.',
    beforeNotes: [
      'Irregular incisal margins and severe enamel wear',
      'Intrinsically discolored tetracycline staining (Grade 3)',
      'Asymmetrical negative space at buccal corridors',
    ],
    afterNotes: [
      'Harmonious facial-driven smile curve aligned to lower lip',
      'Biomimetic incisal halo and optical translucency',
      'Zero prep on 6 teeth; 0.25mm micro-reduction on 4 teeth',
    ],
    beforeColor: '#C8B28B',
    afterColor: '#F5F7FA',
    teethShape: 'aligned',
  },
  {
    id: 'case-02',
    title: 'Full-Arch Immediate Guided Implant Rehabilitation',
    category: 'Surgical Implantology',
    patientAge: '56-year-old Architect',
    technique: 'All-on-6 Dynamic Navigated Surgery with Pre-Milled Zirconia Bridge',
    duration: '1 Day Immediate Provisionalization · 3 Months Final Ceramic',
    shadeShift: 'Terminal Dentition → Vita BL2 Monolithic Zirconia',
    details: 'Advanced periodontal bone resorption managed through computer-guided flapless implant placement and immediate screw-retained provisional bridge, eliminating removable dentures.',
    beforeNotes: [
      'Severe generalized Stage IV Periodontitis',
      'Loss of vertical dimension of occlusion (VDO)',
      'Unstable bilateral masticatory function',
    ],
    afterNotes: [
      'Rigid osseointegrated bicortical implant anchorage',
      'Complete restoration of chewing biomechanics (100% bite force)',
      'Pristine pink ceramic gingival contouring',
    ],
    beforeColor: '#BCA882',
    afterColor: '#FFFFFF',
    teethShape: 'implant',
  },
  {
    id: 'case-03',
    title: 'Diastema Closure & Incisal Edge Symmetry',
    category: 'Biomimetic Aesthetics',
    patientAge: '29-year-old Classical Pianist',
    technique: 'Minimally Invasive Non-Prep Feldspathic Ceramics',
    duration: '5 Days (Single Delivery Session)',
    shadeShift: 'Natural Enamel Refinement',
    details: 'Correction of a prominent 3.5mm midline diastema and lateral incisor microdontia without any tooth structure removal.',
    beforeNotes: [
      '3.5mm midline diastema with high labial frenum attachment',
      'Peg-shaped maxillary lateral incisors (#12, #22)',
      'Slight midline canting',
    ],
    afterNotes: [
      'Zero enamel removal (100% additive bonding technique)',
      'Physiological papilla fill with natural contact points',
      'Seamless optical integration under all lighting angles',
    ],
    beforeColor: '#D8C6A5',
    afterColor: '#FAFBFD',
    teethShape: 'diastema',
  },
];

export default function BeforeAfterSection() {
  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(0);
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0-100
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return;
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
          },
        }
      );
      gsap.fromTo(
        stageRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: stageRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const activeCase = CASE_STUDIES[activeCaseIndex];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    handleMove(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 0) return;
    isDraggingRef.current = true;
    handleMove(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length === 0) return;
    handleMove(e.touches[0].clientX);
  };

  return (
    <section
      ref={sectionRef}
      id="transformations"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-transparent z-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-cyan-400 uppercase mb-3">
              <span>Clinical Transformations</span>
              <span aria-hidden="true">·</span>
              <span>100% Verified Outcomes</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Before & After Clinical Transformations
            </h2>
            <p className="mt-4 text-base text-slate-300 leading-relaxed font-light">
              Drag the precision slider left and right to compare pre-operative clinical conditions with final handcrafted restorations under calibrated medical studio lighting.
            </p>
          </div>

          {/* Case Study Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none shrink-0">
            {CASE_STUDIES.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveCaseIndex(idx);
                  setSliderPos(50);
                }}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  activeCaseIndex === idx
                    ? 'bg-white text-slate-900 font-bold shadow-lg shadow-white/10'
                    : 'bg-transparent text-slate-300 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                Case 0{idx + 1}: {c.category}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Comparison Stage */}
        <div ref={stageRef} className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Draggable Comparison Slider (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              className="relative w-full h-[380px] sm:h-[460px] md:h-[520px] rounded-2xl overflow-hidden select-none cursor-ew-resize border border-white/10 bg-black shadow-2xl group"
            >
              {/* After Layer (Full width underneath) */}
              <div className="absolute inset-0 w-full h-full flex items-center justify-center p-6 bg-black">
                {/* Visual Representation of Transformed Pearlescent Smile */}
                <div className="relative w-full max-w-lg aspect-[16/10] rounded-xl flex items-center justify-center overflow-hidden bg-black border border-white/5">
                  {/* High quality clinical teeth visual vector representation */}
                  <svg className="w-full h-full p-4" viewBox="0 0 600 380" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <radialGradient id="afterGlow" cx="50%" cy="50%" r="60%">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                      </radialGradient>
                      <linearGradient id="afterEnamel" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="65%" stopColor="#F1F5F9" />
                        <stop offset="90%" stopColor="#E2E8F0" />
                        <stop offset="100%" stopColor="#CBD5E1" />
                      </linearGradient>
                      <linearGradient id="healthyGums" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#D9777F" />
                        <stop offset="100%" stopColor="#C45A63" />
                      </linearGradient>
                    </defs>

                    <rect width="600" height="380" fill="url(#afterGlow)" />

                    {/* Upper Lip Contour & Gingiva */}
                    <path d="M 60 120 Q 300 95 540 120 Q 300 135 60 120 Z" fill="#993845" opacity="0.85" />
                    <path d="M 120 125 C 160 100, 200 130, 240 122 C 280 115, 320 115, 360 122 C 400 130, 440 100, 480 125 L 480 145 C 400 135, 200 135, 120 145 Z" fill="url(#healthyGums)" />

                    {/* Perfectly proportioned porcelain veneers #13, #12, #11, #21, #22, #23 */}
                    {/* Tooth 13 Canine */}
                    <path d="M 140 135 C 145 130, 175 130, 180 135 L 175 220 C 160 235, 150 235, 145 220 Z" fill="url(#afterEnamel)" stroke="#94A3B8" strokeWidth="1" />
                    {/* Tooth 12 Lateral */}
                    <path d="M 188 132 C 195 125, 235 125, 242 132 L 238 226 C 220 238, 205 238, 192 226 Z" fill="url(#afterEnamel)" stroke="#94A3B8" strokeWidth="1" />
                    {/* Tooth 11 Central Incisor */}
                    <path d="M 250 130 C 258 120, 298 120, 300 130 L 298 238 C 280 248, 268 248, 252 238 Z" fill="url(#afterEnamel)" stroke="#94A3B8" strokeWidth="1.2" />
                    {/* Tooth 21 Central Incisor */}
                    <path d="M 302 130 C 304 120, 344 120, 352 130 L 350 238 C 334 248, 322 248, 304 238 Z" fill="url(#afterEnamel)" stroke="#94A3B8" strokeWidth="1.2" />
                    {/* Tooth 22 Lateral */}
                    <path d="M 360 132 C 367 125, 407 125, 414 132 L 410 226 C 397 238, 382 238, 364 226 Z" fill="url(#afterEnamel)" stroke="#94A3B8" strokeWidth="1" />
                    {/* Tooth 23 Canine */}
                    <path d="M 422 135 C 427 130, 457 130, 462 135 L 457 220 C 452 235, 442 235, 427 220 Z" fill="url(#afterEnamel)" stroke="#94A3B8" strokeWidth="1" />

                    {/* Subtle Enamel Light Sheen Reflection */}
                    <path d="M 260 145 C 265 170, 265 210, 262 225 C 258 210, 258 170, 260 145" fill="#FFFFFF" opacity="0.6" />
                    <path d="M 310 145 C 315 170, 315 210, 312 225 C 308 210, 308 170, 310 145" fill="#FFFFFF" opacity="0.6" />

                    {/* Lower Lip Contour */}
                    <path d="M 100 245 Q 300 280 500 245 Q 300 295 100 245 Z" fill="#993845" opacity="0.9" />
                  </svg>
                </div>

                {/* Floating "AFTER" Badge */}
                <div className="absolute top-6 right-6 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-cyan-500/40 text-cyan-300 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>After Restoration</span>
                </div>
              </div>

              {/* Before Layer (Clipped to slider position) */}
              <div
                className="absolute inset-0 w-full h-full flex items-center justify-center p-6 bg-black overflow-hidden"
                style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
              >
                <div className="relative w-full max-w-lg aspect-[16/10] rounded-xl flex items-center justify-center overflow-hidden bg-black border border-white/5">
                  {/* Before state simulation with wear, discoloration, and diastema */}
                  <svg className="w-full h-full p-4" viewBox="0 0 600 380" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="beforeEnamel" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#DFCDAB" />
                        <stop offset="50%" stopColor="#C9B387" />
                        <stop offset="100%" stopColor="#A89267" />
                      </linearGradient>
                      <linearGradient id="inflamedGums" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#A8434F" />
                        <stop offset="100%" stopColor="#872E39" />
                      </linearGradient>
                    </defs>

                    {/* Upper Lip Contour & Irregular Gingiva */}
                    <path d="M 60 120 Q 300 95 540 120 Q 300 135 60 120 Z" fill="#7A2D37" opacity="0.8" />
                    <path d="M 120 130 C 160 110, 200 140, 240 128 C 280 125, 320 125, 360 128 C 400 140, 440 110, 480 130 L 480 148 C 400 140, 200 140, 120 148 Z" fill="url(#inflamedGums)" />

                    {/* Pre-op teeth with chipped incisal edge and discoloration */}
                    <path d="M 142 138 C 145 135, 172 135, 176 138 L 171 205 C 160 215, 150 215, 146 205 Z" fill="url(#beforeEnamel)" stroke="#786749" strokeWidth="1" />
                    <path d="M 185 135 C 192 130, 228 130, 235 135 L 230 212 C 215 220, 203 220, 189 212 Z" fill="url(#beforeEnamel)" stroke="#786749" strokeWidth="1" />
                    
                    {/* Worn Central Incisor #11 */}
                    <path d="M 245 132 C 252 125, 288 125, 292 132 L 288 218 C 275 224, 260 216, 246 220 Z" fill="url(#beforeEnamel)" stroke="#786749" strokeWidth="1.2" />
                    
                    {/* Diastema / Gap between 11 and 21 */}
                    {/* Central Incisor #21 with chipped corner */}
                    <path d="M 308 132 C 312 125, 348 125, 355 132 L 351 224 C 338 226, 324 218, 310 215 Z" fill="url(#beforeEnamel)" stroke="#786749" strokeWidth="1.2" />
                    
                    <path d="M 364 135 C 371 130, 407 130, 414 135 L 409 212 C 395 220, 383 220, 369 212 Z" fill="url(#beforeEnamel)" stroke="#786749" strokeWidth="1" />
                    <path d="M 423 138 C 428 135, 455 135, 459 138 L 454 205 C 449 215, 439 215, 424 205 Z" fill="url(#beforeEnamel)" stroke="#786749" strokeWidth="1" />

                    {/* Lower Lip Contour */}
                    <path d="M 100 245 Q 300 280 500 245 Q 300 295 100 245 Z" fill="#7A2D37" opacity="0.8" />
                  </svg>
                </div>

                {/* Floating "BEFORE" Badge */}
                <div className="absolute top-6 left-6 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-300 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pre-Operative State</span>
                </div>
              </div>

              {/* Central Divider Drag Line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] z-30 pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                {/* Center Handle Button */}
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-slate-900 border-2 border-white shadow-2xl flex items-center justify-center text-white">
                  <ArrowLeftRight className="w-4 h-4 text-cyan-300" />
                </div>
              </div>
            </div>

            {/* Slider Drag Hint & Keyboard accessibility */}
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
              <span>← Drag left for Before</span>
              <span className="text-cyan-400">{Math.round(sliderPos)}% Split Position</span>
              <span>Drag right for After →</span>
            </div>
          </div>

          {/* Right Column: Clinical Case Dossier (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-transparent border border-white/10 shadow-xl h-full">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 uppercase tracking-wider">
                <span>{activeCase.category}</span>
                <span className="text-slate-400">{activeCase.patientAge}</span>
              </div>

              <h3 className="font-serif-luxury text-2xl font-bold text-white mt-2 leading-snug">
                {activeCase.title}
              </h3>

              <p className="mt-4 text-sm text-slate-300 leading-relaxed font-light">
                {activeCase.details}
              </p>

              {/* Key Medical Transformation Metrics */}
              <div className="mt-6 space-y-3 p-4 rounded-xl bg-transparent border border-white/5 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Clinical Protocol:</span>
                  <span className="text-slate-200 font-medium text-right max-w-[220px]">{activeCase.technique}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Total Treatment Time:</span>
                  <span className="text-cyan-300 font-medium">{activeCase.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Color Shade Differential:</span>
                  <span className="text-emerald-400 font-medium">{activeCase.shadeShift}</span>
                </div>
              </div>

              {/* Before vs After Findings Checklist */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 block mb-2">
                    Pre-Op Deficiencies:
                  </span>
                  <ul className="space-y-1.5">
                    {activeCase.beforeNotes.map((note, idx) => (
                      <li key={idx} className="text-xs text-slate-400 flex items-start gap-1.5 leading-snug">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80 shrink-0 mt-1" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 block mb-2">
                    Engineered Outcome:
                  </span>
                  <ul className="space-y-1.5">
                    {activeCase.afterNotes.map((note, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5 leading-snug">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Swiss Warranty Stamp */}
            <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>15-Year Swiss Ceramic Warranty</span>
              </div>
              <span className="font-mono text-cyan-300">Case ID: #{activeCase.id.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
