'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, CheckCircle2, GraduationCap, ArrowRight, Sparkles, BookOpen, Clock, Calendar } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface DoctorSectionProps {
  onSelectDoctor: (doctorName: string) => void;
}

interface Doctor {
  id: string;
  name: string;
  role: string;
  degrees: string;
  experience: string;
  avatarSeed: string;
  badge: string;
  bio: string;
  specialties: string[];
  certifications: string[];
  publications: string;
  caseCount: string;
}

const DOCTORS: Doctor[] = [
  {
    id: 'elena',
    name: 'Dr. Elena von Berg',
    role: 'Chief of Aesthetic Prosthodontics',
    degrees: 'DMD (Uni Zürich), MSc Aesthetic Dentistry (Harvard)',
    experience: '19 Years Clinical Practice',
    avatarSeed: 'elena',
    badge: 'SSO · ICP Fellow',
    bio: 'Pioneered micro-invasive porcelain veneer layering in Switzerland. Specializes in custom optical translucency mimicking natural young enamel with zero artificial opacity.',
    specialties: [
      'Ultra-thin 0.2mm E.max Porcelain Veneers',
      '3D Facial-Driven Digital Smile Architecture',
      'Complex Full-Mouth Aesthetic Rehabilitations',
      'Minimally Invasive Enamel Micro-Bonding',
    ],
    certifications: [
      'Swiss Dental Association (SSO) Specialist License #8941',
      'Harvard School of Dental Medicine Fellow',
      'Past President, Swiss Academy of Cosmetic Dentistry',
    ],
    publications: '32 Peer-Reviewed Papers on Biomimetic Enamel Interfaces',
    caseCount: '8,400+ Veneers Placed',
  },
  {
    id: 'marcus',
    name: 'Dr. Marcus Weber',
    role: 'Director of Surgical Implantology',
    degrees: 'MD, DMD (Uni Bern), PhD Maxillofacial Bio-Materials',
    experience: '22 Years Surgical Mastery',
    avatarSeed: 'marcus',
    badge: 'ITI Research Faculty',
    bio: 'Global authority on dynamic computer-navigated dental implants and biological bone augmentation. Leads European clinical trials on nanostructured titanium integration.',
    specialties: [
      'Immediate All-on-4 & All-on-6 Full Arch Solutions',
      'Computer-Guided Flapless Robotic Surgery',
      'Autologous Bone Regeneration & Sinus Architecture',
      'Biocompatible Zirconia Non-Metal Implants',
    ],
    certifications: [
      'Board Certified Oral & Maxillofacial Surgeon',
      'International Team for Implantology (ITI) Scholar',
      'Lead Clinical Examiner, Swiss Dental Board',
    ],
    publications: '48 Clinical Trials Published in Journal of Dental Research',
    caseCount: '6,200+ Implants Placed',
  },
];

export default function DoctorSection({ onSelectDoctor }: DoctorSectionProps) {
  const [activeDoctorId, setActiveDoctorId] = useState<string>('elena');
  const [hoveredDoctorId, setHoveredDoctorId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

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
        cardsRef.current?.children || [],
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
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
      id="doctors"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-transparent z-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-cyan-400 uppercase mb-3">
            <span>Specialists & Faculty</span>
            <span aria-hidden="true">·</span>
            <span>Swiss Board Certified</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            The Clinical Masters Behind Every Smile
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed font-light">
            Our Senior Partners unite Swiss surgical discipline with aesthetic artistry. Hover over each specialist to reveal their surgical credentials, peer honors, and clinical specialties.
          </p>
        </div>

        {/* Doctor Grid with Hover Reveal Cards */}
        <div ref={cardsRef} className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {DOCTORS.map((doc) => {
            const isHovered = hoveredDoctorId === doc.id;
            return (
              <div
                key={doc.id}
                onMouseEnter={() => setHoveredDoctorId(doc.id)}
                onMouseLeave={() => setHoveredDoctorId(null)}
                className={`group relative rounded-2xl p-6 sm:p-8 transition-all duration-300 border flex flex-col justify-between ${
                  isHovered
                    ? 'bg-black/40 border-cyan-500/40 shadow-[0_0_35px_rgba(56,189,248,0.15)] backdrop-blur-sm'
                    : 'bg-transparent border-white/10 hover:border-white/20'
                }`}
              >
                {/* Top header row */}
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Stylized Doctor Monogram/Avatar */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-950 border border-white/20 flex items-center justify-center shrink-0 shadow-lg">
                        <span className="font-serif-luxury text-xl font-bold text-cyan-300">
                          {doc.name.split(' ')[1][0]}
                          {doc.name.split(' ')[2]?.[0] || 'B'}
                        </span>
                        <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 border border-[#080a0f]" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                            {doc.name}
                          </h3>
                        </div>
                        <p className="text-sm text-cyan-400 font-medium mt-0.5">{doc.role}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{doc.degrees}</p>
                      </div>
                    </div>

                    <div className="shrink-0 hidden sm:block">
                      <span className="text-xs font-mono px-2.5 py-1 rounded bg-white/5 border border-white/10 text-slate-300">
                        {doc.badge}
                      </span>
                    </div>
                  </div>

                  {/* Doctor Bio */}
                  <p className="mt-6 text-sm text-slate-300 leading-relaxed font-light">
                    {doc.bio}
                  </p>

                  {/* Experience & Case Metrics */}
                  <div className="mt-5 grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-transparent border border-white/5">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <span className="block text-[11px] text-slate-400">Experience</span>
                        <span className="text-xs font-semibold text-white font-mono">{doc.experience}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <span className="block text-[11px] text-slate-400">Clinical Milestone</span>
                        <span className="text-xs font-semibold text-white font-mono">{doc.caseCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover-reveal section: Specialized Procedures */}
                  <div className="mt-6">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-3">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Specialized Surgical Expertise</span>
                    </span>
                    <ul className="space-y-2">
                      {doc.specialties.map((spec, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Certifications & Research Honors */}
                  <div className="mt-6 pt-5 border-t border-white/5">
                    <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      <span>Accreditations & Research</span>
                    </span>
                    <div className="space-y-1.5">
                      {doc.certifications.map((cert, j) => (
                        <p key={j} className="text-xs text-slate-400 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-cyan-400" />
                          <span>{cert}</span>
                        </p>
                      ))}
                      <p className="text-xs text-slate-400 italic pt-1">
                        {doc.publications}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Action CTA */}
                <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Accepting new prospective cases
                  </span>
                  <button
                    onClick={() => onSelectDoctor(doc.name)}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider uppercase text-slate-900 bg-white hover:bg-cyan-200 rounded-lg transition-colors cursor-pointer shadow-md hover:shadow-cyan-500/20"
                  >
                    <Calendar className="w-3.5 h-3.5 text-cyan-700" />
                    <span>Consult {doc.name.split(' ')[1]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
