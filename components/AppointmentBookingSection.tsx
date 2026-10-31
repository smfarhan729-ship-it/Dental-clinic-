'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  FileText,
  Download,
  X,
  Send,
  AlertCircle
} from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface AppointmentBookingSectionProps {
  preselectedDoctor?: string;
  onBookingSuccess?: (bookingData: any) => void;
}

interface ServiceOption {
  id: string;
  name: string;
  duration: string;
  category: string;
  feeEstimate: string;
}

const SERVICES: ServiceOption[] = [
  {
    id: 'veneers',
    name: 'Porcelain Veneer Smile Architecture',
    duration: '60 min',
    category: 'Cosmetic Prosthodontics',
    feeEstimate: 'Comprehensive 3D Smile Design included',
  },
  {
    id: 'implants',
    name: 'Guided Ceramic / Titanium Implantology',
    duration: '75 min',
    category: 'Surgical Implantology',
    feeEstimate: '3D CBCT Volumetric Scan included',
  },
  {
    id: 'consultation',
    name: 'Comprehensive Oral Health & Master Plan',
    duration: '90 min',
    category: 'Diagnostic Assessment',
    feeEstimate: 'Full Photographic & Periodontal Charting',
  },
  {
    id: 'whitening',
    name: 'In-Office Bio-Laser Teeth Whitening',
    duration: '45 min',
    category: 'Preventative Care',
    feeEstimate: 'Enamel-safe cold laser protocol',
  },
];

const SPECIALISTS = [
  'Dr. Elena von Berg (Chief of Aesthetic Prosthodontics)',
  'Dr. Marcus Weber (Director of Surgical Implantology)',
  'First Available Senior Partner (Immediate Priority)',
];

const TIME_SLOTS = [
  { time: '09:00 AM', period: 'Morning', available: true },
  { time: '10:30 AM', period: 'Morning', available: true },
  { time: '11:45 AM', period: 'Morning', available: false },
  { time: '02:00 PM', period: 'Afternoon', available: true },
  { time: '03:30 PM', period: 'Afternoon', available: true },
  { time: '05:00 PM', period: 'Evening', available: true },
];

export default function AppointmentBookingSection({
  preselectedDoctor,
  onBookingSuccess,
}: AppointmentBookingSectionProps) {
  const [selectedService, setSelectedService] = useState<string>('veneers');
  const [selectedDoctorOverride, setSelectedDoctorOverride] = useState<string>('');

  const selectedDoctor =
    selectedDoctorOverride ||
    (preselectedDoctor
      ? SPECIALISTS.find((s) => s.includes(preselectedDoctor.split(' ')[1])) || SPECIALISTS[0]
      : SPECIALISTS[0]);

  const [selectedDate, setSelectedDate] = useState<string>('2026-11-04');
  const [selectedTime, setSelectedTime] = useState<string>('10:30 AM');
  
  // Patient form state
  const [patientName, setPatientName] = useState<string>('');
  const [patientEmail, setPatientEmail] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  // Form submission & confirmation modal state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const formCardRef = useRef<HTMLDivElement | null>(null);

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
        formCardRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: formCardRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!patientName.trim()) {
      setErrorMsg('Please enter your full legal name.');
      return;
    }
    if (!patientEmail.trim() || !patientEmail.includes('@')) {
      setErrorMsg('Please provide a valid email address for confirmation.');
      return;
    }
    if (!patientPhone.trim()) {
      setErrorMsg('Please provide your direct contact number.');
      return;
    }

    setIsSubmitting(true);

    const bookingRef = `AURA-ZUR-${Math.floor(1000 + Math.random() * 9000)}`;
    const serviceObj = SERVICES.find((s) => s.id === selectedService);

    const bookingPayload = {
      reference: bookingRef,
      service: serviceObj?.name || 'Comprehensive Consultation',
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      patientName,
      patientEmail,
      patientPhone,
      notes,
      createdAt: new Date().toISOString(),
      status: 'Confirmed & Synchronized',
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setConfirmedBooking(bookingPayload);
      setShowEmailModal(true);

      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#ffffff', '#e2e8f0', '#0284c7'],
        });
      } catch (err) {
        // Safe fallback
      }

      // Save to localStorage for instant patient vault synchronization
      try {
        const stored = localStorage.getItem('aura_appointments');
        const appointments = stored ? JSON.parse(stored) : [];
        appointments.unshift(bookingPayload);
        localStorage.setItem('aura_appointments', JSON.stringify(appointments));
      } catch (e) {
        // Storage fallback
      }

      if (onBookingSuccess) {
        onBookingSuccess(bookingPayload);
      }
    }, 600);
  };

  const handleDownloadCalendar = () => {
    if (!confirmedBooking) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AURA Dental Clinique//Consultation//EN
BEGIN:VEVENT
UID:${confirmedBooking.reference}@auraclinique.ch
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${confirmedBooking.date.replace(/-/g, '')}T103000Z
SUMMARY:AURA Clinique: ${confirmedBooking.service}
DESCRIPTION:Specialist: ${confirmedBooking.doctor}\\nReference: ${confirmedBooking.reference}
LOCATION:Bahnhofstrasse 45, 8001 Zürich, Switzerland
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${confirmedBooking.reference}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section
      ref={sectionRef}
      id="booking"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-transparent z-20"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs font-mono tracking-[0.25em] text-cyan-400 uppercase mb-3">
            <span>Direct Scheduling</span>
            <span aria-hidden="true">·</span>
            <span>Real-Time Calendar Sync</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Reserve Your Private Consultation
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed font-light">
            Select your clinical procedure, preferred doctor, and exact calendar slot. You will receive an immediate encrypted calendar invitation and email summary.
          </p>
        </div>

        {/* Booking Form Card (Transparent to let floating tooth show through) */}
        <div ref={formCardRef} className="mt-12 bg-transparent border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Step 1: Select Service */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
                1. Select Specialized Treatment
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICES.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setSelectedService(s.id)}
                    className={`p-4 rounded-xl text-left transition-all border cursor-pointer ${
                      selectedService === s.id
                        ? 'bg-cyan-950/30 border-cyan-400/60 shadow-[0_0_20px_rgba(56,189,248,0.15)]'
                        : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-cyan-400">{s.category}</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {s.duration}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm text-white mt-1.5">{s.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-1">{s.feeEstimate}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Preferred Specialist */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                2. Preferred Specialist
              </label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctorOverride(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors"
              >
                {SPECIALISTS.map((doc, idx) => (
                  <option key={idx} value={doc} className="bg-slate-900 text-white">
                    {doc}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Date & Time Selection with Live Availability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  3. Select Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    min="2026-10-31"
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                  />
                  <CalendarIcon className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  4. Available Time Slots
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot, i) => (
                    <button
                      type="button"
                      key={i}
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`py-2.5 px-2 rounded-lg text-xs font-mono transition-all text-center border ${
                        !slot.available
                          ? 'opacity-30 cursor-not-allowed bg-black/40 border-white/5 text-slate-500 line-through'
                          : selectedTime === slot.time
                          ? 'bg-white text-slate-900 font-bold border-white shadow-md'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Patient Details */}
            <div className="pt-4 border-t border-white/5">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-4">
                5. Patient Confidential Information
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Full Legal Name"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                    <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="Phone (+41 / Int'l)"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors font-mono"
                    />
                    <Phone className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <textarea
                  rows={2}
                  placeholder="Primary aesthetic or restorative goals (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>GDPR & Swiss Federal Data Protection Act (DSG) Compliant</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-900 bg-white hover:bg-slate-100 disabled:opacity-50 rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Synchronizing Schedule...</span>
                ) : (
                  <>
                    <span>Confirm Consultation</span>
                    <ArrowRight className="w-4 h-4 text-cyan-600" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation & Email Notification Preview Modal */}
      {showEmailModal && confirmedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#080B10] border border-cyan-500/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(56,189,248,0.2)] overflow-hidden">
            {/* Top Close */}
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Success Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block">
                  Reservation Confirmed · Live Synchronized
                </span>
                <h3 className="font-serif-luxury text-xl font-bold text-white">
                  Consultation Notice Dispatched
                </h3>
              </div>
            </div>

            {/* Email Preview Card */}
            <div className="mt-6 p-5 rounded-xl bg-[#0e131d] border border-white/10 text-xs space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3 font-mono text-slate-400 text-[11px]">
                <div className="flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Email dispatched to: <strong className="text-white">{confirmedBooking.patientEmail}</strong></span>
                </div>
                <span className="text-cyan-300">Ref: {confirmedBooking.reference}</span>
              </div>

              <div className="space-y-2 text-slate-300">
                <p>Dear <strong className="text-white">{confirmedBooking.patientName}</strong>,</p>
                <p>
                  Your consultation at <strong>AURA Dental Clinique Zürich</strong> has been confirmed on our master surgical schedule.
                </p>
              </div>

              {/* Booking Specifications Box */}
              <div className="p-3.5 rounded-lg bg-black/40 border border-white/5 space-y-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Procedure:</span>
                  <span className="text-white font-semibold">{confirmedBooking.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Attending Specialist:</span>
                  <span className="text-cyan-300">{confirmedBooking.doctor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date & Time:</span>
                  <span className="text-white">{confirmedBooking.date} at {confirmedBooking.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Clinic Suite:</span>
                  <span className="text-slate-300">Bahnhofstrasse 45, 8001 Zürich</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 italic">
                * Please arrive 10 minutes prior for digital facial alignment scan. Complimentary valet parking is available at our private courtyard.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleDownloadCalendar}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Add to Calendar (.ics)</span>
              </button>
              <button
                onClick={() => setShowEmailModal(false)}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-lg bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
