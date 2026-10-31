'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ToothCanvasScroll from '@/components/ToothCanvasScroll';
import HeroSection from '@/components/HeroSection';
import DoctorSection from '@/components/DoctorSection';
import BeforeAfterSection from '@/components/BeforeAfterSection';
import ClinicalArchitectureSection from '@/components/ClinicalArchitectureSection';
import AppointmentBookingSection from '@/components/AppointmentBookingSection';
import PatientRecordsModal from '@/components/PatientRecordsModal';
import Footer from '@/components/Footer';

export default function Home() {
  const [isPortalOpen, setIsPortalOpen] = useState<boolean>(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<string>('');

  const scrollToBooking = (doctorName?: string) => {
    if (doctorName) {
      setSelectedDoctorForBooking(doctorName);
    }
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="relative min-h-screen bg-black text-slate-100 overflow-x-hidden selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Background Floating Canvas Tooth (GSAP ScrollTrigger Frame Scrubbing) */}
      <ToothCanvasScroll />

      {/* Top Navigation Bar */}
      <Navbar
        onOpenPortal={() => setIsPortalOpen(true)}
        onBookClick={() => scrollToBooking()}
      />

      {/* Hero Section */}
      <HeroSection
        onBookClick={() => scrollToBooking()}
        onOpenPortal={() => setIsPortalOpen(true)}
      />

      {/* Specialist & Doctor Showcase Section */}
      <DoctorSection
        onSelectDoctor={(docName) => scrollToBooking(docName)}
      />

      {/* Before & After Interactive Smile Transformation Slider */}
      <BeforeAfterSection />

      {/* Swiss Precision Clinical Architecture & 4 Pillars */}
      <ClinicalArchitectureSection />

      {/* Real-Time Appointment Booking Engine */}
      <AppointmentBookingSection
        preselectedDoctor={selectedDoctorForBooking}
        onBookingSuccess={() => {
          // Handled inside component with live confirmation modal
        }}
      />

      {/* Quiet Swiss Luxury Footer */}
      <Footer
        onOpenPortal={() => setIsPortalOpen(true)}
        onBookClick={() => scrollToBooking()}
      />

      {/* PIN-Protected Patient Records Vault Modal */}
      <PatientRecordsModal
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
      />
    </main>
  );
}
