'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Microscope, Cpu, Layers, ShieldCheck, Sparkles, Binary } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const PILLARS = [
  {
    number: '01',
    title: '3D Facial Photogrammetry & Dynamic Jaw Tracking',
    icon: Binary,
    tagline: '10-Micron Digital Capture',
    description:
      'We eliminate imprecise analogue impression trays. High-speed optical intraoral cameras combined with facial scanners map your exact phonetic smile arc and chewing biomechanics in real-time 3D.',
  },
  {
    number: '02',
    title: 'Microscope-Guided Biomimetic Preparation',
    icon: Microscope,
    tagline: 'Up to 24× Zeiss Magnification',
    description:
      'Surgery performed under German Zeiss surgical operating microscopes. We preserve up to 92% of virgin enamel structure, utilizing additive micro-preparations below 0.3mm for life-long bond strength.',
  },
  {
    number: '03',
    title: 'In-House Swiss Master Ceramic Atelier',
    icon: Layers,
    tagline: 'Bespoke Hand-Layering in Zürich',
    description:
      'Unlike clinics outsourcing restorations overseas, our master ceramists craft every veneer, crown, and bridge on-site. Custom optical translucencies, mammelons, and incisal halos match your adjacent teeth invisibly.',
  },
  {
    number: '04',
    title: 'Bio-Reactive SLActive® Implant Integration',
    icon: ShieldCheck,
    tagline: 'Rapid 21-Day Osseointegration',
    description:
      'We exclusively utilize Swiss Straumann® pure titanium and non-metal ceramic implants with hydrophilic surfaces that draw blood proteins immediately, achieving lasting bone-level stability.',
  },
];

export default function ClinicalArchitectureSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

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
        gridRef.current?.children || [],
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="architecture"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-transparent z-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-cyan-400 uppercase mb-3">
            <span>The Swiss Protocol</span>
            <span aria-hidden="true">·</span>
            <span>Biological Engineering</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            The Four Pillars of Clinical Precision
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed font-light">
            Every procedure at AURA Clinique conforms to the highest Swiss federal standards of biological safety, mechanical longevity, and optical biomimicry.
          </p>
        </div>

        {/* 4 Pillars Bento Grid */}
        <div ref={gridRef} className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.number}
                className="group p-8 rounded-2xl bg-transparent border border-white/10 hover:border-cyan-400/40 hover:bg-white/[0.01] transition-all duration-300 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-bold text-white/20 group-hover:text-cyan-400/50 transition-colors">
                      {pillar.number}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
                      {pillar.tagline}
                    </span>
                  </div>

                  <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white mt-4 group-hover:text-cyan-200 transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="mt-4 text-sm text-slate-300 leading-relaxed font-light">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-white/5 flex items-center gap-2 text-xs text-slate-400">
                  <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Clinical Standard ISO 13485 Compliant</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
