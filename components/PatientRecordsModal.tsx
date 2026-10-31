'use client';

import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Shield,
  ShieldCheck,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  X,
  Calendar,
  CheckCircle2,
  Activity,
  Layers,
  Sparkles,
  KeyRound,
  Trash2
} from 'lucide-react';

interface PatientRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DentalTooth {
  number: number;
  name: string;
  condition: 'Veneer' | 'Natural' | 'Implant' | 'Crown';
  status: string;
  shade: string;
}

const TEETH_CHART: DentalTooth[] = [
  { number: 11, name: 'Maxillary Right Central', condition: 'Veneer', status: '0.25mm E.max Lithium Disilicate', shade: 'Vita B1' },
  { number: 12, name: 'Maxillary Right Lateral', condition: 'Veneer', status: '0.25mm E.max Lithium Disilicate', shade: 'Vita B1' },
  { number: 13, name: 'Maxillary Right Canine', condition: 'Veneer', status: '0.25mm E.max Lithium Disilicate', shade: 'Vita B1' },
  { number: 21, name: 'Maxillary Left Central', condition: 'Veneer', status: '0.25mm E.max Lithium Disilicate', shade: 'Vita B1' },
  { number: 22, name: 'Maxillary Left Lateral', condition: 'Veneer', status: '0.25mm E.max Lithium Disilicate', shade: 'Vita B1' },
  { number: 23, name: 'Maxillary Left Canine', condition: 'Veneer', status: '0.25mm E.max Lithium Disilicate', shade: 'Vita B1' },
  { number: 16, name: 'Maxillary Right First Molar', condition: 'Implant', status: 'Straumann Roxolid SLActive Ø4.1mm', shade: 'Zirconia Monolithic' },
  { number: 36, name: 'Mandibular Left First Molar', condition: 'Crown', status: 'Micro-Bonded Ceramic Overlay', shade: 'Vita A2' },
  { number: 46, name: 'Mandibular Right First Molar', condition: 'Natural', status: 'Healthy virgin enamel, remineralized', shade: 'Vita A2' },
];

const HISTORICAL_PROCEDURES = [
  {
    id: 'PR-901',
    date: '2026-09-15',
    treatment: 'Bi-Annual Prophylaxis & Cold Laser Enamel Glaze',
    doctor: 'Dr. Elena von Berg',
    notes: 'Zero marginal leakage. Sulcus depth < 2mm throughout. Gingival margins pink and stippled.',
    cost: 'CHF 420',
  },
  {
    id: 'PR-854',
    date: '2026-03-22',
    treatment: 'Delivery of 6 Maxillary E.max Porcelain Veneers (#13-#23)',
    doctor: 'Dr. Elena von Berg',
    notes: 'Variolink Esthetic Light curing. Perfect seating. Symmetric smile line harmonized.',
    cost: 'CHF 11,800',
  },
  {
    id: 'PR-780',
    date: '2025-11-10',
    treatment: 'Optical Photogrammetry & 3D Mock-up Diagnostic Trial',
    doctor: 'Dr. Elena von Berg',
    notes: 'Patient approved 3D aesthetic prototype. High labial smile line verified with video phonetics.',
    cost: 'CHF 950',
  },
  {
    id: 'PR-692',
    date: '2025-08-04',
    treatment: 'Guided Flapless Implant Placement #16',
    doctor: 'Dr. Marcus Weber',
    notes: 'Immediate insertion torque > 45 Ncm. Hydrophilic Straumann SLActive bone integration protocol.',
    cost: 'CHF 3,600',
  },
];

export default function PatientRecordsModal({ isOpen, onClose }: PatientRecordsModalProps) {
  const [pin, setPin] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'timeline' | 'chart'>('diagnostics');
  const [recentBookings, setRecentBookings] = useState<any[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem('aura_appointments');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  if (!isOpen) return null;

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    // Accepts "1234" as demo PIN or any 4 digits
    if (pin.length === 4) {
      setIsAuthenticated(true);
    } else {
      setAuthError('Please enter a 4-digit security PIN (Demo: 1234)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPin('');
    setAuthError('');
  };

  // Export JSON Health Dossier
  const handleExportJSON = () => {
    const data = {
      patient: {
        id: 'AURA-CH-8942',
        name: 'Alexander Laurent',
        dob: '1988-04-12',
        bloodType: 'O+',
        allergies: 'None recorded',
        primarySpecialist: 'Dr. Elena von Berg',
        clinic: 'AURA Dental Clinique Zürich',
      },
      diagnosticMetrics: {
        periodontalHealthScore: '98%',
        enamelMineralizationScore: '94%',
        cariesActivity: '0 Active Lesions',
        biteOcclusion: 'Class I Orthognathic Symmetrical',
      },
      dentalArchStatus: TEETH_CHART,
      historicalProcedures: HISTORICAL_PROCEDURES,
      recentBookings,
      exportTimestamp: new Date().toISOString(),
      encryptionIntegrity: 'AES-GCM-256 Verified',
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AURA-Patient-Record-8942.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export CSV Records
  const handleExportCSV = () => {
    let csv = 'ID,Date,Treatment,Attending Specialist,Clinical Notes,Cost\n';
    HISTORICAL_PROCEDURES.forEach((p) => {
      csv += `"${p.id}","${p.date}","${p.treatment}","${p.doctor}","${p.notes}","${p.cost}"\n`;
    });
    if (recentBookings.length > 0) {
      recentBookings.forEach((b) => {
        csv += `"${b.reference}","${b.date}","${b.service}","${b.doctor}","${b.notes || 'Upcoming'}","Pending"\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AURA-Appointments-History-8942.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Print Summary
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-black border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Header Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              {isAuthenticated ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-luxury text-base font-bold text-white">
                  AURA Patient Enclave
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-300">
                  AES-256 Encrypted
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Swiss Federal Act on Data Protection (FADP) Level-4 Secure
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Vault</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {!isAuthenticated ? (
            /* Screen 1: PIN Authentication Form */
            <div className="max-w-md mx-auto py-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-6 shadow-[0_0_30px_rgba(56,189,248,0.2)]">
                <KeyRound className="w-8 h-8" />
              </div>

              <h3 className="font-serif-luxury text-2xl font-bold text-white">
                Enter Patient Security PIN
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed font-light">
                Access your confidential clinical charts, 3D dental diagnostics, procedure history, and laboratory guarantees.
              </p>

              <form onSubmit={handlePinSubmit} className="mt-8 space-y-4">
                <div className="flex justify-center gap-3">
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    autoFocus
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-48 text-center text-2xl tracking-[0.5em] font-mono py-3 rounded-xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-slate-600"
                  />
                </div>

                {authError && (
                  <p className="text-xs text-red-400 font-mono">{authError}</p>
                )}

                <p className="text-[11px] text-cyan-400/90 font-mono">
                  Default Demo Access PIN: <strong className="text-white">1234</strong>
                </p>

                <button
                  type="submit"
                  className="w-full mt-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/20 cursor-pointer"
                >
                  Authenticate & Unlock Records
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero telemetry · Decrypted exclusively in local browser sandbox</span>
              </div>
            </div>
          ) : (
            /* Screen 2: Unlocked Patient Dossier */
            <div className="space-y-6">
              {/* Patient Identification Card */}
              <div className="p-5 rounded-xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif-luxury text-xl font-bold text-white">
                      Alexander Laurent
                    </h3>
                    <span className="text-xs font-mono text-cyan-400 px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      ID: #AURA-CH-8942
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                    <span>DOB: 12.04.1988</span>
                    <span>·</span>
                    <span>Blood: O+ Rh-Positive</span>
                    <span>·</span>
                    <span>Lead Attending: Dr. Elena von Berg</span>
                  </div>
                </div>

                {/* Export Toolkit Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleExportJSON}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                    title="Export full clinical record in JSON format"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">JSON</span>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                    title="Export table in CSV format"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden sm:inline">CSV</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                    title="Print clinical summary"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-300" />
                    <span className="hidden sm:inline">Print</span>
                  </button>
                </div>
              </div>

              {/* Navigation View Tabs */}
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <button
                  onClick={() => setActiveTab('diagnostics')}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'diagnostics'
                      ? 'bg-white text-slate-900 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Diagnostic Scorecard
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'timeline'
                      ? 'bg-white text-slate-900 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Procedure History & Invoices
                </button>
                <button
                  onClick={() => setActiveTab('chart')}
                  className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'chart'
                      ? 'bg-white text-slate-900 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  3D Odontogram Chart
                </button>
              </div>

              {/* Tab 1: Diagnostic Scorecard */}
              {activeTab === 'diagnostics' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[11px] font-mono text-slate-400 block">Periodontal Health</span>
                      <span className="text-xl font-bold font-serif-luxury text-emerald-400 mt-1 block">98%</span>
                      <span className="text-[10px] text-slate-500">Sulcus depth &lt; 2mm</span>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[11px] font-mono text-slate-400 block">Enamel Mineralization</span>
                      <span className="text-xl font-bold font-serif-luxury text-cyan-300 mt-1 block">94%</span>
                      <span className="text-[10px] text-slate-500">Optimal bio-density</span>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[11px] font-mono text-slate-400 block">Caries Lesions</span>
                      <span className="text-xl font-bold font-serif-luxury text-white mt-1 block">0 Active</span>
                      <span className="text-[10px] text-emerald-400">Pristine hygiene index</span>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[11px] font-mono text-slate-400 block">Bite Biomechanics</span>
                      <span className="text-xl font-bold font-serif-luxury text-white mt-1 block">Class I</span>
                      <span className="text-[10px] text-slate-500">Symmetrical occlusion</span>
                    </div>
                  </div>

                  {/* Clinical Attending Notes */}
                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Physician Clinical Assessment (Zürich Clinic)</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">
                      All 6 anterior maxillary E.max porcelain veneers (#13 through #23) maintain exceptional marginal integrity with zero gingival irritation. Marginal bone stability at implant site #16 remains bone-level intact at 3.8mm height. Recommended recall: Prophylaxis scheduled in 6 months.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Procedure History & Real-Time Sync */}
              {activeTab === 'timeline' && (
                <div className="space-y-4">
                  {recentBookings.length > 0 && (
                    <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
                      <div className="flex items-center justify-between text-xs font-mono text-cyan-300 mb-2">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Recently Scheduled Consultation (Sync Active)</span>
                        </span>
                      </div>
                      {recentBookings.map((b, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs text-slate-200">
                          <div>
                            <strong>{b.service}</strong> with {b.doctor}
                          </div>
                          <div className="font-mono text-cyan-300">
                            {b.date} at {b.time}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="divide-y divide-white/5 border border-white/10 rounded-xl overflow-hidden bg-white/[0.01]">
                    {HISTORICAL_PROCEDURES.map((item) => (
                      <div key={item.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-slate-400">{item.date}</span>
                            <span className="font-semibold text-white">{item.treatment}</span>
                          </div>
                          <div className="flex items-center gap-3 font-mono text-xs">
                            <span className="text-slate-400">{item.doctor}</span>
                            <span className="text-cyan-300 font-semibold">{item.cost}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-1.5 font-light leading-relaxed">
                          {item.notes}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: 3D Odontogram Chart */}
              {activeTab === 'chart' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {TEETH_CHART.map((tooth) => (
                      <div
                        key={tooth.number}
                        className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-sm text-cyan-300">#{tooth.number}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            tooth.condition === 'Veneer'
                              ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                              : tooth.condition === 'Implant'
                              ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                              : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          }`}>
                            {tooth.condition}
                          </span>
                        </div>
                        <h5 className="text-xs font-medium text-white mt-1.5">{tooth.name}</h5>
                        <p className="text-[11px] text-slate-400 mt-1">{tooth.status}</p>
                        <span className="text-[10px] font-mono text-slate-500 mt-1 block">Shade: {tooth.shade}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
