'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, Lock, ChevronDown, Sparkles } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroSectionProps {
  onBookClick: () => void;
  onOpenPortal: () => void;
}

export default function HeroSection({ onBookClick, onOpenPortal }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const promptRef = useRef<HTMLDivElement | null>(null);
  const kickerRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const subheadRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const kpiRef = useRef<HTMLDivElement | null>(null);

  const [isInteractive, setIsInteractive] = useState<boolean>(false);
  const hasRevealedRef = useRef<boolean>(false);

  useEffect(() => {
    // If the visitor enters the page already scrolled, immediately reveal all elements without delay
    if (typeof window !== 'undefined' && window.scrollY > 20) {
      hasRevealedRef.current = true;
      requestAnimationFrame(() => {
        setIsInteractive(true);
      });
      if (promptRef.current) gsap.set(promptRef.current, { opacity: 0, display: 'none' });
      gsap.set(
        [
          kickerRef.current,
          headlineRef.current,
          subheadRef.current,
          ctaRef.current,
          kpiRef.current,
        ],
        { opacity: 1, y: 0 }
      );
      return;
    }

    // Set initial minimalist hidden state: only the tooth is visible on arrival
    gsap.set(
      [
        kickerRef.current,
        headlineRef.current,
        subheadRef.current,
        ctaRef.current,
        kpiRef.current,
      ],
      { opacity: 0, y: 32 }
    );
    if (promptRef.current) {
      gsap.set(promptRef.current, { opacity: 0, y: 10 });
    }

    // Gentle scroll indicator appears after 400ms if visitor is stationary
    const promptTimer = setTimeout(() => {
      if (!hasRevealedRef.current && promptRef.current) {
        gsap.to(promptRef.current, {
          opacity: 0.85,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
    }, 450);

    // Master reveal function: triggers once, smoothly animates forward, and NEVER reverses
    const triggerReveal = () => {
      if (hasRevealedRef.current) return;
      hasRevealedRef.current = true;
      setIsInteractive(true);

      // Fade out the initial scroll indicator
      if (promptRef.current) {
        gsap.to(promptRef.current, {
          opacity: 0,
          y: -15,
          duration: 0.35,
          ease: 'power2.in',
          onComplete: () => {
            if (promptRef.current) promptRef.current.style.display = 'none';
          },
        });
      }

      // Smooth cinematic unfolding sequence with deliberate luxury pacing
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
      });

      tl.to(kickerRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
      })
      .to(
        headlineRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
        },
        '-=0.4'
      )
      .to(
        subheadRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        '-=0.4'
      )
      .to(
        ctaRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
        },
        '-=0.4'
      )
      .to(
        kpiRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
        },
        '-=0.4'
      );
    };

    // Trigger A: First downward scroll movement
    const handleScroll = () => {
      if (window.scrollY > 15) {
        triggerReveal();
      }
    };

    // Trigger B: Mouse wheel down or touch flick
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        triggerReveal();
      }
    };

    const handleTouchMove = () => {
      triggerReveal();
    };

    // Trigger C: Automatic cinematic delay (unfolds smoothly after ~1.1s so visitor is never left stuck)
    const delayTimer = setTimeout(() => {
      triggerReveal();
    }, 1100);

    // Trigger D: GSAP ScrollTrigger listener on section boundary
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      onEnter: triggerReveal,
      onLeave: triggerReveal,
      once: true,
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      clearTimeout(promptTimer);
      clearTimeout(delayTimer);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
      st.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-transparent"
    >
      {/* INITIAL ZERO-SCROLL PROMPT: Visible only momentarily at the very top, fades permanently once unfolded */}
      <div
        ref={promptRef}
        className="fixed inset-x-0 bottom-10 flex flex-col items-center justify-center pointer-events-none z-20 text-center"
      >
        <div className="flex flex-col items-center gap-2.5 text-slate-400 font-mono text-[11px] tracking-[0.3em] uppercase">
          <span>Scroll to explore</span>
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center animate-bounce">
            <ChevronDown className="w-4 h-4 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Main Hero Content: Permanently visible and interactive once revealed */}
      <div
        className={`max-w-5xl mx-auto w-full text-center relative z-20 my-auto ${
          isInteractive ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Unboxed editorial kicker */}
        <div
          ref={kickerRef}
          className="flex items-center justify-center gap-2 text-xs font-mono tracking-[0.25em] text-cyan-400 uppercase mb-6"
        >
          <span>Swiss Medical Precision</span>
          <span aria-hidden="true">·</span>
          <span>Zürich Bahnhofstrasse</span>
          <span aria-hidden="true">·</span>
          <span>Est. 1994</span>
        </div>

        {/* Display Headline */}
        <h1
          ref={headlineRef}
          className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.08]"
        >
          Precision Dental Architecture At The Pinnacle Of Science
        </h1>

        {/* Supporting subheadline */}
        <p
          ref={subheadRef}
          className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light"
        >
          Specialized cosmetic prosthodontics, handcrafted porcelain veneer aesthetics, and full-arch biological implantology engineered with micron-level accuracy.
        </p>

        {/* Primary and Secondary CTA group: Always interactive and visible */}
        <div
          ref={ctaRef}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-30"
        >
          <button
            onClick={onBookClick}
            className="w-full sm:w-auto px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-all duration-200 shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:shadow-[0_0_35px_rgba(56,189,248,0.5)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Calendar className="w-4 h-4 text-cyan-600" />
            <span>Reserve Consultation</span>
          </button>
          <button
            onClick={onOpenPortal}
            className="w-full sm:w-auto px-6 py-3.5 text-xs font-medium uppercase tracking-wider text-slate-300 hover:text-white bg-black/40 hover:bg-white/10 border border-white/20 hover:border-white/40 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95 backdrop-blur-sm shadow-lg"
          >
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Patient Records Vault</span>
          </button>
        </div>
      </div>

      {/* Hero Footing KPI Strip: Always visible once revealed */}
      <div
        ref={kpiRef}
        className={`max-w-7xl mx-auto w-full mt-12 sm:mt-16 relative z-20 ${
          isInteractive ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl">
          <div className="flex flex-col border-r border-white/10 pr-4 last:border-r-0">
            <span className="text-2xl lg:text-3xl font-bold font-serif-luxury text-white tabular-nums tracking-tight">
              99.8%
            </span>
            <span className="text-xs text-slate-400 mt-1">
              Restoration Survival Rate (10-Yr Cohort)
            </span>
          </div>

          <div className="flex flex-col border-r border-white/10 pr-4 last:border-r-0">
            <span className="text-2xl lg:text-3xl font-bold font-serif-luxury text-white tabular-nums tracking-tight">
              14,200+
            </span>
            <span className="text-xs text-slate-400 mt-1">
              Completed Smile Transformations
            </span>
          </div>

          <div className="flex flex-col border-r border-white/10 pr-4 last:border-r-0">
            <span className="text-2xl lg:text-3xl font-bold font-serif-luxury text-white tabular-nums tracking-tight">
              &lt; 0.3mm
            </span>
            <span className="text-xs text-slate-400 mt-1">
              Micro-Invasive Enamel Preservation
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl lg:text-3xl font-bold font-serif-luxury text-cyan-300 tracking-tight">
              SSO · ITI
            </span>
            <span className="text-xs text-slate-400 mt-1">
              Swiss Board & Harvard Certified Faculty
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
