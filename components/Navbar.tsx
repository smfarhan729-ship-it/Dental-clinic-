'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Calendar, Lock, Menu, X, ArrowRight, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenPortal: () => void;
  onBookClick: () => void;
}

export default function Navbar({ onOpenPortal, onBookClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.scrollY > 20) {
      requestAnimationFrame(() => {
        setHasRevealed(true);
        setScrolled(window.scrollY > 80);
      });
    }

    const handleScroll = () => {
      if (window.scrollY > 15) {
        setHasRevealed(true);
      }
      setScrolled(window.scrollY > 80);
    };

    const delayTimer = setTimeout(() => {
      setHasRevealed(true);
    }, 1100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(delayTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
        !hasRevealed
          ? 'opacity-0 -translate-y-6 pointer-events-none py-5 border-b border-transparent'
          : scrolled
          ? 'opacity-100 translate-y-0 bg-black/85 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl shadow-black/80 pointer-events-auto'
          : 'opacity-100 translate-y-0 bg-transparent border-b border-transparent py-4 sm:py-5 pointer-events-auto'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Single element brand wordmark */}
          <a
            href="#"
            className="flex items-center gap-3 group text-white whitespace-nowrap shrink-0 transition-opacity hover:opacity-90"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
              <Sparkles className="w-4 h-4 text-cyan-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-luxury text-lg tracking-widest uppercase font-bold text-white">
                AURA
              </span>
              <span className="text-[10px] tracking-[0.25em] text-slate-400 uppercase -mt-1 font-mono">
                Clinique · Zürich
              </span>
            </div>
          </a>

          {/* Zone 2: 4-5 single-line clean nav links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a
              href="#about"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-cyan-400 hover:after:w-full after:transition-all"
            >
              Philosophy
            </a>
            <a
              href="#doctors"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-cyan-400 hover:after:w-full after:transition-all"
            >
              Specialists
            </a>
            <a
              href="#transformations"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-cyan-400 hover:after:w-full after:transition-all"
            >
              Transformations
            </a>
            <a
              href="#architecture"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-cyan-400 hover:after:w-full after:transition-all"
            >
              Clinical Protocol
            </a>
            <button
              onClick={onOpenPortal}
              className="flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Patient Vault</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            <button
              onClick={onBookClick}
              className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold tracking-wider uppercase text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-600" />
              <span>Book Consultation</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={onOpenPortal}
              className="p-2 text-cyan-300 hover:text-white transition-colors rounded-lg bg-white/5 border border-white/10"
              title="Open Patient Vault"
              aria-label="Open Patient Vault"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white transition-colors rounded-lg bg-white/5 border border-white/10"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 pb-6 border-t border-white/10 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200 bg-black/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white text-base py-1"
            >
              Philosophy
            </a>
            <a
              href="#doctors"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white text-base py-1"
            >
              Specialists & Credentials
            </a>
            <a
              href="#transformations"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white text-base py-1"
            >
              Smile Transformations
            </a>
            <a
              href="#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-white text-base py-1"
            >
              Clinical Protocol
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPortal();
              }}
              className="flex items-center gap-2 text-cyan-300 py-1 text-left"
            >
              <Lock className="w-4 h-4" />
              <span>Encrypted Patient Records Vault</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onBookClick();
              }}
              className="w-full mt-2 py-3 text-xs font-semibold uppercase tracking-wider text-slate-900 bg-white hover:bg-slate-100 rounded-lg flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-cyan-600" />
              <span>Reserve Consultation</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
