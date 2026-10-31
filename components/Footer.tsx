'use client';

import React from 'react';
import { Sparkles, Shield, ArrowUp, Phone, MapPin, Mail } from 'lucide-react';

interface FooterProps {
  onOpenPortal: () => void;
  onBookClick: () => void;
}

export default function Footer({ onOpenPortal, onBookClick }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-black border-t border-white/10 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-slate-400 text-xs z-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              </div>
              <span className="font-serif-luxury text-base tracking-widest uppercase font-bold text-white">
                AURA DENTAL CLINIQUE
              </span>
            </div>
            <p className="text-slate-400 font-light leading-relaxed">
              Switzerland’s preeminent private practice for precision restorative prosthodontics, biological dental implantology, and bespoke porcelain smile design.
            </p>
            <div className="pt-2 flex items-center gap-2 text-cyan-400 font-mono text-[11px]">
              <Shield className="w-3.5 h-3.5" />
              <span>Swiss SSO & ITI Certified Practice</span>
            </div>
          </div>

          {/* Col 2: Locations & Concierge */}
          <div className="space-y-3">
            <span className="font-mono text-white text-xs uppercase tracking-wider block">
              Clinic Locations
            </span>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Zürich Atelier</strong>
                  <span className="text-slate-400">Bahnhofstrasse 45, 8001 Zürich</span>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-medium">Genève Suite</strong>
                  <span className="text-slate-400">Rue du Rhône 12, 1204 Genève</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Direct Inquiries */}
          <div className="space-y-3">
            <span className="font-mono text-white text-xs uppercase tracking-wider block">
              Patient Concierge
            </span>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center gap-2 font-mono">
                <Phone className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>+41 44 211 88 00 (Zürich)</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>concierge@auraclinique.ch</span>
              </div>
              <p className="text-slate-400 text-[11px] pt-1">
                Mon – Fri: 08:00 – 18:30 CET<br />
                24/7 Dental Emergency Concierge
              </p>
            </div>
          </div>

          {/* Col 4: Quick Nav & Vault Access */}
          <div className="space-y-3">
            <span className="font-mono text-white text-xs uppercase tracking-wider block">
              Patient Services
            </span>
            <ul className="space-y-2">
              <li>
                <a href="#doctors" className="hover:text-white transition-colors">Specialist Faculty</a>
              </li>
              <li>
                <a href="#transformations" className="hover:text-white transition-colors">Verified Smile Cases</a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-white transition-colors">Microscope Protocol</a>
              </li>
              <li>
                <button
                  onClick={onOpenPortal}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors text-left cursor-pointer"
                >
                  Encrypted Patient Vault
                </button>
              </li>
              <li>
                <button
                  onClick={onBookClick}
                  className="text-white hover:text-cyan-200 transition-colors text-left cursor-pointer font-semibold"
                >
                  Schedule Appointment →
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} AURA Dental Clinique AG. All rights reserved. Registered Swiss Practice CHE-381.942.100.
          </div>

          <div className="flex items-center gap-4">
            <span>Confidentiality Guaranteed</span>
            <span>·</span>
            <span>Swiss Medical Quality Standards</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors ml-2"
              title="Return to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
