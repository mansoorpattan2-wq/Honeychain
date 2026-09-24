import React, { useState } from 'react';
import { Screen } from '../types';
import { useBatch } from '../context/BatchContext';

interface CompleteHoneyJourneyScreenProps {
  onNavigate: (screen: Screen) => void;
}

export const CompleteHoneyJourneyScreen: React.FC<CompleteHoneyJourneyScreenProps> = ({ onNavigate }) => {
  const { currentBatch, provenanceEvents } = useBatch();
  const [copiedHash, setCopiedHash] = useState(false);

  const copyHash = () => {
    navigator.clipboard?.writeText(currentBatch.rootHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2500);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-28 antialiased selection:bg-secondary/20 max-w-screen-md mx-auto shadow-sm border-x border-[#E6DFD5]/40">
      {/* Toast Notification */}
      {copiedHash && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-primary text-white text-xs px-3 py-1.5 rounded-full shadow-lg border border-secondary flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm text-emerald-400">check_circle</span>
          <span>Blockchain root hash copied to clipboard!</span>
        </div>
      )}

      {/* Top Navigation Shell */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 flex items-center justify-between px-4 h-16 max-w-screen-md mx-auto border-b border-[#E6DFD5] bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm">
        <button
          aria-label="Go back"
          onClick={() => onNavigate('product-passport')}
          className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-[#f0f3ff] transition-colors duration-150 active:scale-95 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="font-headline-sm text-headline-sm tracking-widest uppercase text-primary font-medium">
            HONEYCHAIN
          </span>
          <span className="font-code-telemetry text-code-telemetry text-on-surface-variant font-medium tracking-tight">
            {currentBatch.batchId}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('verification')}
          className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-[#f0f3ff] transition-colors duration-150"
          title="Cryptographically Verified"
        >
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified_user
          </span>
        </button>
      </header>

      {/* Main Content Container */}
      <main className="max-w-screen-md mx-auto pt-20 px-4 space-y-6">
        {/* Hero Header & Botanical Identification Card */}
        <div className="bg-surface-container-lowest border border-[#E6DFD5] rounded-xl p-5 shadow-[0_1px_3px_0_rgba(15,45,31,0.03)] mt-2">
          {/* Pill Header Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-600/30 text-amber-700 text-xs font-semibold tracking-wide mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-amber-800">
              ORIGIN TO BOTTLE • {provenanceEvents.length} VERIFIED CHRONICLES
            </span>
          </div>

          <h1 className="font-display-hero-mobile text-display-hero-mobile text-primary font-serif font-medium tracking-tight">
            From Hive to Bottle
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 leading-relaxed">
            Trace every custodial handover, environmental telemetry point, and scientific milestone from the wild apiary canopy to your sealed jar.
          </p>

          {/* Glass jar and batch summary teaser */}
          <div className="mt-4 pt-4 border-t border-[#E6DFD5]/60 flex items-center gap-3.5">
            <img
              className="w-14 h-14 rounded-lg object-cover border border-[#E6DFD5] shrink-0"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCF07Px8-Dbu8cpM7-m7kIbjtcqvRdRzgD3C6-DVAzFdLfyXq_gAaRxXzK5Tkq07ykBmM0YuyX-LjZvwvJo4wr3Cz6ASPoHKW_Mrs7xAnpBF1DJ8RnXAostly1SeUO-ps7tCxgEeeOgD1yX-NH3gHwew6naLVWe_Z7QnW4W2Y1_2d-DDiod5wlEM7sX02IPAvAxpcn7IS_-wUyKE_FY-ylHo5n8efAFsllyRkjPA_MPZprxZ955hqvG"
              alt="Artisanal Raw Forest Honey jar"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-title-md text-title-md text-primary truncate">{currentBatch.productName}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-container text-inverse-primary tracking-wider uppercase">
                  Verified
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-on-surface-variant font-code-telemetry text-code-telemetry">
                <span>{currentBatch.vesselSize}</span>
                <span>•</span>
                <span>{currentBatch.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Milestone Pills */}
        <div className="overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-container text-inverse-primary font-code-telemetry text-code-telemetry shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Harvest</span>
            </div>
            <span className="material-symbols-outlined text-outline text-xs">arrow_forward</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-container text-inverse-primary font-code-telemetry text-code-telemetry shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Extract</span>
            </div>
            <span className="material-symbols-outlined text-outline text-xs">arrow_forward</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-container text-inverse-primary font-code-telemetry text-code-telemetry shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Intake</span>
            </div>
            <span className="material-symbols-outlined text-outline text-xs">arrow_forward</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-container text-inverse-primary font-code-telemetry text-code-telemetry shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Assay</span>
            </div>
            <span className="material-symbols-outlined text-outline text-xs">arrow_forward</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-code-telemetry text-code-telemetry font-bold shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-900"></span>
              <span>Bottled</span>
            </div>
          </div>
        </div>

        {/* Vertical Provenance Timeline with Reactive Events */}
        <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-4 before:bottom-4 before:w-[2px] before:bg-gradient-to-b before:from-primary-container before:via-outline-variant before:to-primary-container">
          {provenanceEvents.map((evt, idx) => (
            <div
              key={evt.eventId}
              className="relative bg-surface-container-lowest border border-[#E6DFD5] rounded-xl p-5 shadow-[0_1px_3px_0_rgba(15,45,31,0.03)] hover:border-primary-container/40 transition-colors"
            >
              <div className="absolute -left-[31px] top-6 w-4 h-4 rounded-full bg-primary-container border-2 border-[#FAF8F5] flex items-center justify-center shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-inverse-primary"></span>
              </div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="font-label-caps text-label-caps text-secondary font-bold uppercase tracking-wider">
                    CHRONICLE 0{idx + 1} • {evt.eventType}
                  </span>
                  <h2 className="font-title-lg text-title-lg text-primary tracking-tight">{evt.eventType}</h2>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Verified
                </span>
              </div>
              <div className="text-on-surface-variant font-code-telemetry text-code-telemetry mb-3">
                {evt.timestamp}
              </div>
              <div className="bg-[#FAF8F5] rounded-lg p-3 border border-[#E6DFD5]/60 space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant font-body-sm">Location</span>
                  <span className="font-code-telemetry text-primary font-medium">{evt.location}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant font-body-sm">Custodial Actor</span>
                  <span className="font-code-telemetry text-primary font-semibold">{evt.actor}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-on-surface-variant font-body-sm">Cryptographic Stamp</span>
                  <span className="font-code-telemetry text-on-surface-variant font-mono text-[11px] truncate max-w-[180px]">
                    {evt.hash}
                  </span>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant/90 border-l-2 border-secondary/40 pl-3 py-0.5">
                {evt.description}
              </p>
            </div>
          ))}
        </div>

        {/* Cryptographic Block Seal Section */}
        <div className="bg-surface-container-lowest border border-[#E6DFD5] rounded-xl p-5 shadow-[0_1px_3px_0_rgba(15,45,31,0.03)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-secondary font-bold uppercase tracking-wider">
              BLOCKCHAIN CONSENSUS ATTESTATION
            </span>
            <span className="font-code-telemetry text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
              FINALIZED
            </span>
          </div>

          <div className="bg-[#FAF8F5] rounded-lg p-3 border border-[#E6DFD5]/60 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <span className="block font-label-caps text-[10px] text-on-surface-variant uppercase">
                Merkle Root Hash (SHA-256)
              </span>
              <span className="font-code-telemetry text-xs font-mono text-primary font-semibold truncate block mt-0.5">
                {currentBatch.rootHash}
              </span>
            </div>
            <button
              type="button"
              onClick={copyHash}
              className="p-2 rounded-lg text-primary hover:bg-[#d8e3fb] transition-colors active:scale-95 shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">content_copy</span>
            </button>
          </div>

          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Every recorded event is linked to the same product identity.
          </p>

          <div className="pt-2 space-y-2.5">
            <button
              type="button"
              onClick={() => onNavigate('lab-evidence')}
              className="w-full flex items-center justify-center gap-2 bg-primary-container text-white font-title-md text-title-md py-3.5 px-4 rounded-xl shadow-sm hover:bg-[#163B2A] transition-colors duration-150 active:scale-95 cursor-pointer"
            >
              <span>View Lab Evidence</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('lab-evidence')}
              className="w-full flex items-center justify-center gap-2 bg-white text-primary border border-[#E6DFD5] font-title-md text-title-md py-3 px-4 rounded-xl hover:bg-[#F5F2EB] hover:border-amber-600 transition-colors duration-150 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Download Chain Certificate (PDF)</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <span className="text-[11px] font-code-telemetry text-outline tracking-wider uppercase">
              DEMO DATA • HoneyChain Trust Protocol
            </span>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Shell */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E6DFD5] max-w-screen-md mx-auto shadow-sm">
        <a
          href="#scan"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('qr-scanner');
          }}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 transition-all duration-200 hover:text-primary active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined">qr_code_scanner</span>
          <span className="font-label-caps text-label-caps mt-1">Scan Bottle</span>
        </a>

        <a
          href="#attestation"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('verification');
          }}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 transition-all duration-200 hover:text-primary active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined">verified</span>
          <span className="font-label-caps text-label-caps mt-1">Attestation</span>
        </a>

        <a
          href="#passport"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('product-passport');
          }}
          className="flex flex-col items-center justify-center bg-primary-container text-inverse-primary rounded-xl px-4 py-1.5 transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            menu_book
          </span>
          <span className="font-label-caps text-label-caps mt-1 font-semibold">Passport</span>
        </a>
      </nav>
    </div>
  );
};
