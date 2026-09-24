import React, { useState } from 'react';
import { Screen } from '../types';
import { useBatch } from '../context/BatchContext';
import { useAuth } from '../context/AuthContext';

interface VerificationScreenProps {
  onNavigate: (screen: Screen) => void;
}

export const VerificationScreen: React.FC<VerificationScreenProps> = ({ onNavigate }) => {
  const { currentBatch, labReport } = useBatch();
  const { currentUser } = useAuth();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const copyText = (val: string, label: string) => {
    navigator.clipboard?.writeText(val);
    setToastMessage(`${label} copied to clipboard!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const isVerified = currentBatch.verificationStatus === 'verified';

  return (
    <div className="w-full max-w-screen-md bg-[#FAF8F5] relative flex flex-col min-h-screen pb-24 shadow-sm border-x border-[#E6DFD5]/40 mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-primary text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg border border-secondary flex items-center gap-1.5 animate-bounce">
          <span className="material-symbols-outlined text-sm text-secondary-container">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 h-16 max-w-screen-md mx-auto border-b border-[#E6DFD5] bg-[#FAF8F5]/95 backdrop-blur-md">
        <button
          aria-label="Go back"
          onClick={() => onNavigate('qr-scanner')}
          className="p-2 -ml-2 rounded-full hover:bg-[#e7eeff] hover:text-primary transition-colors duration-150 active:scale-95 text-primary flex items-center justify-center cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="font-headline-sm text-headline-sm tracking-widest uppercase text-primary font-medium">
            HONEYCHAIN
          </span>
          <div className="flex items-center gap-1 mt-0.5 bg-primary-fixed/60 px-1.5 py-0.5 rounded-full border border-[#E6DFD5]/50">
            <span className="material-symbols-outlined text-[10px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
            <span className="font-label-caps text-[9px] tracking-wider text-primary font-bold">
              VERIFIED 256-BIT PROOF
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {currentUser ? (
            <button
              onClick={() => onNavigate('dashboard')}
              className="p-2 rounded-full hover:bg-[#e7eeff] hover:text-primary transition-colors duration-150 active:scale-95 text-primary flex items-center justify-center cursor-pointer"
              type="button"
              title="Dashboard"
            >
              <span className="material-symbols-outlined">dashboard</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              className="p-2 rounded-full hover:bg-[#e7eeff] hover:text-primary transition-colors duration-150 active:scale-95 text-primary flex items-center justify-center cursor-pointer"
              type="button"
              title="Supply Chain Login"
            >
              <span className="material-symbols-outlined">login</span>
            </button>
          )}

          <button
            aria-label="Security Certificate verified"
            onClick={() => onNavigate('lab-evidence')}
            className="p-2 -mr-2 rounded-full hover:bg-[#e7eeff] hover:text-primary transition-colors duration-150 active:scale-95 text-primary flex items-center justify-center cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined">verified_user</span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 px-4 pt-20 pb-8 flex flex-col gap-6">
        {/* Hero Verification Result Area */}
        <section className="flex flex-col items-center text-center mt-2 px-2">
          {/* Botanical Luminous Badge */}
          <div className="relative flex items-center justify-center my-3">
            <div className="absolute w-24 h-24 rounded-full bg-primary-container/15 animate-badge-glow"></div>
            <div className="w-20 h-20 rounded-full bg-primary-container text-white flex items-center justify-center shadow-lg relative border-2 border-primary-fixed/40">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isVerified ? 'check_circle' : 'pending'}
              </span>
            </div>
            <span className="absolute -bottom-2 bg-surface-container-lowest text-primary text-[10px] font-label-caps font-bold px-2.5 py-0.5 rounded-full border border-[#E6DFD5] shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container inline-block animate-ping"></span>
              {isVerified ? '✓ Product identity found' : '⏳ Verification In Progress'}
            </span>
          </div>

          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-medium mt-4 tracking-tight">
            Cryptographic Attestation Confirmed
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xs mt-1.5">
            This bottle has been matched against the immutable biological ledger.
          </p>
        </section>

        {/* Verification Micro-Pills Status */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-primary-container/10 border border-primary-container/25 text-primary px-3 py-1 rounded-full font-label-caps text-label-caps">
            <span className="w-2 h-2 rounded-full bg-primary-container inline-block"></span>
            Authenticity record verified
          </span>
          <span className="inline-flex items-center gap-1.5 bg-secondary-container/15 border border-secondary-container/40 text-secondary px-3 py-1 rounded-full font-label-caps text-label-caps font-bold">
            <span className="material-symbols-outlined text-xs">science</span>
            Zero C4 Adulteration ({currentBatch.metrics.c4Sugar})
          </span>
        </div>

        {/* Linear Telemetry Metadata Card */}
        <div className="bg-surface-container-lowest rounded-xl border border-[#E6DFD5] shadow-sm p-4 divide-y divide-[#E6DFD5]/40">
          {/* Batch Identifier */}
          <div className="py-2.5 flex items-center justify-between gap-3 first:pt-1">
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider uppercase">
                Harvest Batch
              </span>
              <span className="font-code-telemetry text-code-telemetry font-bold text-on-surface mt-0.5 tracking-tight">
                {currentBatch.batchId}
              </span>
            </div>
            <button
              className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-[#e7eeff] rounded-lg transition-colors flex items-center gap-1 text-xs active:scale-95 cursor-pointer"
              onClick={() => copyText(currentBatch.batchId, 'Batch ID')}
              title="Copy Batch ID"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">content_copy</span>
            </button>
          </div>

          {/* Product Unique ID */}
          <div className="py-2.5 flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider uppercase">
                Unique Product ID
              </span>
              <span className="font-code-telemetry text-code-telemetry font-bold text-on-surface mt-0.5 tracking-tight">
                {currentBatch.uniqueId}
              </span>
            </div>
            <button
              className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-[#e7eeff] rounded-lg transition-colors flex items-center gap-1 text-xs active:scale-95 cursor-pointer"
              onClick={() => copyText(currentBatch.uniqueId, 'Product ID')}
              title="Copy Product ID"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">content_copy</span>
            </button>
          </div>

          {/* NFC Bottle Seal Status */}
          <div className="py-2.5 flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider uppercase">
                Bottle Seal Integrity
              </span>
              <span className="font-body-sm text-body-sm font-semibold text-primary mt-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                  lock
                </span>
                Physical NFC Tamper-Evident Seal: Intact &amp; Sealed
              </span>
            </div>
            <span className="inline-block px-2 py-0.5 bg-primary-fixed text-on-primary-fixed rounded font-label-caps text-[10px] font-bold">
              100% OK
            </span>
          </div>

          {/* Block Timestamp & Consensus */}
          <div className="py-2.5 flex items-center justify-between gap-3 last:pb-1">
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider uppercase">
                Ledger Block Timestamp
              </span>
              <span className="font-code-telemetry text-code-telemetry text-on-surface mt-0.5">
                {currentBatch.blockTimestamp} • Block {currentBatch.blockNumber}
              </span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-base">token</span>
          </div>
        </div>

        {/* Security & Laboratory Evidence Preview Cards */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-title-md text-title-md text-primary tracking-tight">
              Scientific &amp; Environmental Proofs
            </h2>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              3 OF 3 VERIFIED
            </span>
          </div>

          {/* Evidence Item 1: DNA Barcoding */}
          <div
            onClick={() => onNavigate('lab-evidence')}
            className="bg-surface-container-lowest rounded-xl p-3.5 border border-[#E6DFD5] flex items-start gap-3 transition-transform active:scale-[0.99] cursor-pointer hover:border-primary/50"
          >
            <div className="w-10 h-10 rounded-lg bg-[#e7eeff] flex items-center justify-center flex-shrink-0 text-primary">
              <span className="material-symbols-outlined text-xl">biotech</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-wider">
                  DNA Barcoding
                </span>
                <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
              <p className="font-title-md text-title-md text-on-surface mt-0.5">
                {currentBatch.metrics.floralDna} Botanical DNA
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Melissopalynology verified • Apis floral profile matched
              </p>
            </div>
          </div>

          {/* Evidence Item 2: Spectrometry */}
          <div
            onClick={() => onNavigate('lab-evidence')}
            className="bg-surface-container-lowest rounded-xl p-3.5 border border-[#E6DFD5] flex items-start gap-3 transition-transform active:scale-[0.99] cursor-pointer hover:border-primary/50"
          >
            <div className="w-10 h-10 rounded-lg bg-[#e7eeff] flex items-center justify-center flex-shrink-0 text-primary">
              <span className="material-symbols-outlined text-xl">analytics</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-wider">
                  Mass Spectrometry
                </span>
                <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
              <p className="font-title-md text-title-md text-on-surface mt-0.5">
                {currentBatch.testingLab.split(',')[0]} (Ref #{currentBatch.labCertificateId})
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Pristine HMF {currentBatch.metrics.hmf} • Diastase {currentBatch.metrics.diastase}
              </p>
            </div>
          </div>

          {/* Evidence Item 3: Geographic Lock */}
          <div
            onClick={() => onNavigate('product-passport')}
            className="bg-surface-container-lowest rounded-xl p-3.5 border border-[#E6DFD5] flex items-start gap-3 transition-transform active:scale-[0.99] cursor-pointer hover:border-primary/50"
          >
            <div className="w-10 h-10 rounded-lg bg-[#e7eeff] flex items-center justify-center flex-shrink-0 text-primary">
              <span className="material-symbols-outlined text-xl">pin_drop</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps uppercase text-secondary font-bold tracking-wider">
                  Geo-Fence Attestation
                </span>
                <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
              </div>
              <p className="font-title-md text-title-md text-on-surface mt-0.5">{currentBatch.location}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                GPS Locked at {currentBatch.coordinates} (±2.1m precision)
              </p>
            </div>
          </div>
        </div>

        {/* Action Cluster */}
        <section className="mt-2 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => onNavigate('product-passport')}
            className="w-full bg-primary-container text-white font-title-md text-title-md py-3.5 px-6 rounded-lg shadow-sm flex items-center justify-center gap-2 hover:bg-[#163b2a] active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <span>Explore Product Passport</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('lab-evidence')}
            className="w-full bg-surface-container-lowest border border-[#E6DFD5] text-primary font-title-md text-title-md py-3 px-6 rounded-lg hover:bg-[#f0f3ff] active:scale-95 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
            <span>Download Cryptographic Certificate (PDF)</span>
          </button>
        </section>

        {/* Trust Seal Footer Anchor */}
        <div className="text-center pt-2">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Cryptographically signed by HoneyChain Node #04 • Verified in real-time
          </p>
        </div>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E6DFD5] max-w-screen-md mx-auto">
        {/* Scan Bottle (Inactive) */}
        <button
          type="button"
          onClick={() => onNavigate('qr-scanner')}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 transition-all duration-200 hover:text-primary active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
          <span className="font-label-caps text-label-caps mt-1">Scan Bottle</span>
        </button>

        {/* Attestation (ACTIVE) */}
        <button
          type="button"
          onClick={() => onNavigate('verification')}
          className="flex flex-col items-center justify-center bg-primary-container text-inverse-primary rounded-xl px-4 py-1.5 transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified
          </span>
          <span className="font-label-caps text-label-caps mt-1 font-bold">Attestation</span>
        </button>

        {/* Passport (Inactive) */}
        <button
          type="button"
          onClick={() => onNavigate('product-passport')}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 transition-all duration-200 hover:text-primary active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">menu_book</span>
          <span className="font-label-caps text-label-caps mt-1">Passport</span>
        </button>
      </nav>
    </div>
  );
};
