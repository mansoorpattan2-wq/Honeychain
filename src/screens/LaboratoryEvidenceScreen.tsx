import React, { useState } from 'react';
import { Screen } from '../types';
import { useBatch } from '../context/BatchContext';

interface LaboratoryEvidenceScreenProps {
  onNavigate: (screen: Screen) => void;
}

export const LaboratoryEvidenceScreen: React.FC<LaboratoryEvidenceScreenProps> = ({ onNavigate }) => {
  const { currentBatch, labReport } = useBatch();
  const [isMismatch, setIsMismatch] = useState<boolean>(false);
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const copyReportId = () => {
    navigator.clipboard?.writeText(currentBatch.labCertificateId);
    setCopiedNotification('Report ID copied to clipboard!');
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  return (
    <div className="bg-[#FAF8F5] text-on-surface min-h-screen pb-28 antialiased selection:bg-secondary/20 max-w-screen-md mx-auto shadow-sm border-x border-[#E6DFD5]/40">
      {/* Toast Notification */}
      {copiedNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-primary text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg border border-secondary flex items-center gap-1.5 animate-bounce">
          <span className="material-symbols-outlined text-sm text-secondary-container">check_circle</span>
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* TopAppBar Component */}
      <header className="fixed top-0 left-0 right-0 w-full z-50 flex items-center justify-between px-4 h-16 max-w-screen-md mx-auto border-b border-[#E6DFD5] bg-[#FAF8F5]/95 backdrop-blur-md">
        <button
          aria-label="Go back"
          onClick={() => onNavigate('verification')}
          className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-primary hover:bg-[#e7eeff] transition-colors duration-150 active:scale-95 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="font-headline-sm text-headline-sm tracking-widest uppercase text-primary font-medium">
            HONEYCHAIN
          </span>
          <span className="font-label-caps text-label-caps text-on-surface-variant text-[10px] tracking-widest">
            BIOCHEMICAL AUDIT
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            aria-label="Download Official Certificate"
            className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-[#e7eeff] transition-colors duration-150 active:scale-95 cursor-pointer"
            onClick={() => setShowPdfModal(true)}
            type="button"
          >
            <span className="material-symbols-outlined">download</span>
          </button>
        </div>
      </header>

      {/* Main Scrollable Canvas */}
      <main className="max-w-screen-md mx-auto pt-20 px-4 space-y-5">
        {/* Hero / Document Badge & Editorial Title */}
        <section className="space-y-3 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/40 border border-[#E6DFD5] text-on-primary-fixed">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
            <span className="font-label-caps text-label-caps uppercase">
              ISO/IEC 17025 ACCREDITED TESTING • {currentBatch.testingLab.split(',')[0]}
            </span>
          </div>

          <div className="space-y-1.5">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-serif font-medium">
              Laboratory Certificate
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Independent biochemical assay, authenticity verification, and cryptographic chain-of-custody match for batch integrity.
            </p>
          </div>

          <div className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-[#dee8ff]/60 border border-[#E6DFD5]/40">
            <div className="flex items-center gap-1.5 text-on-surface">
              <span className="material-symbols-outlined text-secondary text-sm">biotech</span>
              <span className="font-label-caps text-label-caps uppercase text-on-surface">
                {labReport ? `${labReport.accreditation} AUDIT BENCH` : 'AUDIT BENCHMARK DATA'}
              </span>
            </div>
            <span className="font-code-telemetry text-code-telemetry text-on-surface-variant">v4.8.2</span>
          </div>
        </section>

        {/* Certificate Metadata Card */}
        <section className="bg-surface-container-lowest rounded-xl border border-[#E6DFD5] p-4 shadow-sm space-y-4">
          <div className="flex items-start justify-between border-b border-[#E6DFD5]/40 pb-3">
            <div>
              <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">Certificate Identifier</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-title-lg text-title-lg text-primary font-mono tracking-tight font-bold" id="report-id-text">
                  {currentBatch.labCertificateId}
                </span>
                <button
                  aria-label="Copy Report ID"
                  className="p-1 rounded hover:bg-[#e7eeff] text-on-surface-variant active:scale-95 transition-all cursor-pointer"
                  onClick={copyReportId}
                  type="button"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                </button>
              </div>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-caps text-label-caps">
              FINAL REPORT
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="space-y-0.5">
              <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase">Sample ID</span>
              <span className="font-code-telemetry text-code-telemetry font-bold text-on-surface">SAMPLE-{currentBatch.batchId.slice(-7)}</span>
            </div>
            <div className="space-y-0.5">
              <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase">Batch ID</span>
              <span className="font-code-telemetry text-code-telemetry font-bold text-primary">{currentBatch.batchId}</span>
            </div>
            <div className="col-span-2 space-y-0.5 pt-1 border-t border-[#E6DFD5]/30">
              <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase">Testing Facility</span>
              <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                {currentBatch.testingLab}
              </span>
              <p className="font-label-caps text-label-caps text-on-surface-variant/80">
                ISO/IEC 17025:2017 Accredited Lab Ref #{currentBatch.labCertificateId}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase">Sample Received</span>
              <span className="font-body-sm text-body-sm text-on-surface">{currentBatch.harvestDate.split('•')[0]}</span>
            </div>
            <div className="space-y-0.5">
              <span className="font-label-caps text-label-caps text-on-surface-variant block uppercase">Verified Released</span>
              <span className="font-body-sm text-body-sm text-on-surface">{labReport?.verifiedReleasedDate || 'Current'}</span>
            </div>
          </div>
        </section>

        {/* Three Primary Identity & Custody Verification Pills */}
        <section className="grid grid-cols-3 gap-2">
          <div className="bg-surface-container-lowest border border-primary-fixed p-2.5 rounded-xl flex flex-col items-center text-center shadow-sm">
            <span className="material-symbols-outlined text-primary mb-1 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Sample Identity</span>
            <span className="font-code-telemetry text-code-telemetry font-bold text-primary mt-0.5">MATCHED ✓</span>
          </div>

          <div className="bg-surface-container-lowest border border-primary-fixed p-2.5 rounded-xl flex flex-col items-center text-center shadow-sm">
            <span className="material-symbols-outlined text-primary mb-1 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              inventory_2
            </span>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Physical Seal</span>
            <span className="font-code-telemetry text-code-telemetry font-bold text-primary mt-0.5">INTACT ✓</span>
          </div>

          <div className="bg-surface-container-lowest border border-primary-fixed p-2.5 rounded-xl flex flex-col items-center text-center shadow-sm">
            <span className="material-symbols-outlined text-secondary mb-1 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Purity Seal</span>
            <span className="font-code-telemetry text-code-telemetry font-bold text-secondary mt-0.5">PASS 100%</span>
          </div>
        </section>

        {/* Scientific Assay Benchmark Results Table */}
        <section className="bg-surface-container-lowest rounded-xl border border-[#E6DFD5] p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#E6DFD5]/40 pb-2">
            <h2 className="font-title-md text-title-md text-primary font-bold">Assay Parameters</h2>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              4/4 TESTS CONFORMING
            </span>
          </div>

          <div className="divide-y divide-[#E6DFD5]/30">
            {/* Row 1: C4 Sugars */}
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-body-sm font-semibold text-primary block">C4 Sugar Adulteration (EA-IRMS)</span>
                <span className="text-[11px] text-on-surface-variant">AOAC 998.12 Standard &lt; 7.0%</span>
              </div>
              <div className="text-right">
                <span className="font-code-telemetry text-sm font-bold text-emerald-700 block">
                  {currentBatch.metrics.c4Sugar}
                </span>
                <span className="font-label-caps text-[10px] text-primary">PASSED</span>
              </div>
            </div>

            {/* Row 2: Diastase Activity */}
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-body-sm font-semibold text-primary block">Diastase Activity (Schade Scale)</span>
                <span className="text-[11px] text-on-surface-variant">Enzyme integrity &gt; 8.0 DN</span>
              </div>
              <div className="text-right">
                <span className="font-code-telemetry text-sm font-bold text-primary block">
                  {currentBatch.metrics.diastase}
                </span>
                <span className="font-label-caps text-[10px] text-primary">RAW / UNHEATED</span>
              </div>
            </div>

            {/* Row 3: HMF */}
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-body-sm font-semibold text-primary block">Hydroxymethylfurfural (HMF)</span>
                <span className="text-[11px] text-on-surface-variant">Thermal marker max 40 mg/kg</span>
              </div>
              <div className="text-right">
                <span className="font-code-telemetry text-sm font-bold text-primary block">
                  {currentBatch.metrics.hmf}
                </span>
                <span className="font-label-caps text-[10px] text-primary">PRISTINE</span>
              </div>
            </div>

            {/* Row 4: Floral DNA Profile */}
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-body-sm font-semibold text-primary block">Floral Botanical Species DNA</span>
                <span className="text-[11px] text-on-surface-variant">Melissopalynology rbcL marker</span>
              </div>
              <div className="text-right">
                <span className="font-code-telemetry text-sm font-bold text-secondary block">
                  {currentBatch.metrics.floralDna}
                </span>
                <span className="font-label-caps text-[10px] text-secondary">SPECIES MATCH</span>
              </div>
            </div>
          </div>
        </section>

        {/* Cryptographic Chain-of-Custody Stepper */}
        <section className="bg-surface-container-lowest rounded-xl border border-[#E6DFD5] p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#E6DFD5]/40 pb-2">
            <h2 className="font-title-md text-title-md text-primary font-bold">Cryptographic Chain-of-Custody</h2>
            <button
              type="button"
              onClick={() => setIsMismatch(!isMismatch)}
              className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#E6DFD5] bg-[#FAF8F5] text-on-surface-variant hover:text-primary cursor-pointer"
            >
              {isMismatch ? 'Reset Tamper Demo' : 'Simulate Mismatch'}
            </button>
          </div>

          <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E6DFD5]">
            <div className="relative flex flex-col group">
              <span className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-primary-container ring-4 ring-white"></span>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Step 01 • Physical Jar NFC Identifier
              </span>
              <span className="font-code-telemetry text-code-telemetry font-bold text-on-surface mt-0.5">
                {currentBatch.nfcTag}
              </span>
            </div>

            <div className="relative flex flex-col group">
              <span className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-primary-container ring-4 ring-white"></span>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Step 02 • Master Harvest Batch ID
              </span>
              <span className="font-code-telemetry text-code-telemetry font-bold text-primary mt-0.5">
                {currentBatch.batchId}
              </span>
            </div>

            <div className="relative flex flex-col group">
              <span className="absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full bg-primary-container ring-4 ring-white"></span>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Step 03 • Certified Assay Identifier
              </span>
              <span className="font-code-telemetry text-code-telemetry font-bold text-on-surface mt-0.5">
                {currentBatch.labCertificateId}
              </span>
            </div>

            <div className="relative flex flex-col group">
              <span
                className={`absolute -left-6 top-0.5 w-3.5 h-3.5 rounded-full ring-4 ring-white ${
                  isMismatch ? 'bg-error' : 'bg-secondary'
                }`}
              ></span>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Step 04 • Ledger Merkle Hash
              </span>
              <span
                className={`font-code-telemetry text-code-telemetry font-mono ${
                  isMismatch ? 'text-error font-bold' : 'text-on-surface'
                }`}
                id="hash-text"
              >
                {isMismatch ? 'SHA-256: 3c1a80f1...d891 (MISMATCH)' : currentBatch.rootHash}
              </span>
            </div>
          </div>

          {!isMismatch ? (
            <div className="bg-primary-fixed/30 border border-primary-fixed rounded-xl p-3.5 space-y-2" id="verified-success-state">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <h4 className="font-title-md text-title-md text-primary font-bold">Evidence belongs to this product</h4>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface">
                Cryptographic match verified against block #{currentBatch.blockNumber}. The physical batch timestamp matches the certified assay within 48 milliseconds.
              </p>
            </div>
          ) : (
            <div className="bg-error-container/40 border border-error rounded-xl p-3.5 space-y-2" id="verified-mismatch-state">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  gpp_bad
                </span>
                <h4 className="font-title-md text-title-md text-error font-bold">⚠ Verification Mismatch Detected</h4>
              </div>
              <p className="font-body-sm text-body-sm text-on-error-container">
                Simulated tampering test: Cryptographic hash of the document does not match batch {currentBatch.batchId}.
              </p>
            </div>
          )}
        </section>

        {/* Botanical Authenticity Footer Note */}
        <footer className="pt-4 pb-6 text-center space-y-2 border-t border-[#E6DFD5]/40">
          <div className="flex items-center justify-center gap-1.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">lock</span>
            <span className="font-label-caps text-label-caps uppercase">HoneyChain Trust Protocol • Zero Knowledge Origin</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs mx-auto">
            Audited by {currentBatch.testingLab}. Secured by cryptographic attestations on public decentralized ledger infrastructure.
          </p>
        </footer>
      </main>

      {/* PDF Modal Simulator */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md max-h-[85vh] overflow-y-auto border border-[#E6DFD5] shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-error">picture_as_pdf</span>
                <div>
                  <h3 className="font-title-md text-primary font-bold">Official Assay Report</h3>
                  <p className="text-[11px] font-mono text-on-surface-variant">{currentBatch.labCertificateId}.pdf</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E6DFD5] space-y-3 text-xs font-mono">
              <div className="flex justify-between border-b pb-2">
                <span>LABORATORY:</span>
                <span className="font-semibold text-primary">{currentBatch.testingLab}</span>
              </div>
              <div className="flex justify-between">
                <span>BATCH CODE:</span>
                <span className="text-primary font-bold">{currentBatch.batchId}</span>
              </div>
              <div className="flex justify-between">
                <span>EA-IRMS C4 ADULTERATION:</span>
                <span className="text-emerald-700 font-bold">{currentBatch.metrics.c4Sugar} (Pass)</span>
              </div>
              <div className="flex justify-between">
                <span>DIASTASE ENZYME ACTIVITY:</span>
                <span className="text-primary font-bold">{currentBatch.metrics.diastase} (Active)</span>
              </div>
              <div className="flex justify-between">
                <span>HMF HEATING RESIDUE:</span>
                <span className="text-primary font-bold">{currentBatch.metrics.hmf} (&lt; 40 limit)</span>
              </div>
              <div className="flex justify-between">
                <span>FLORAL SPECIES DNA:</span>
                <span className="text-secondary font-bold">{currentBatch.metrics.floralDna}</span>
              </div>
              <div className="pt-2 border-t text-[10px] text-on-surface-variant">
                DIGITAL SIGNATURE HASH:
                <div className="text-[9px] text-primary truncate select-all">{currentBatch.rootHash}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowPdfModal(false)}
                className="flex-1 py-2.5 bg-primary-container text-white rounded-xl text-sm font-semibold hover:bg-[#163B2A]"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E6DFD5] max-w-screen-md mx-auto shadow-sm">
        {/* Tab 1: Scan Bottle */}
        <a
          href="#scan"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('qr-scanner');
          }}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 transition-all duration-200 hover:text-primary active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
          <span className="font-label-caps text-label-caps mt-0.5">Scan Bottle</span>
        </a>

        {/* Tab 2: Attestation (ACTIVE) */}
        <a
          href="#attestation"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('verification');
          }}
          className="flex flex-col items-center justify-center bg-primary-container text-inverse-primary rounded-xl px-4 py-1.5 transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified
          </span>
          <span className="font-label-caps text-label-caps mt-0.5 font-bold">Attestation</span>
        </a>

        {/* Tab 3: Passport (Inactive) */}
        <a
          href="#passport"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('product-passport');
          }}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 transition-all duration-200 hover:text-primary active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">menu_book</span>
          <span className="font-label-caps text-label-caps mt-0.5">Passport</span>
        </a>
      </nav>
    </div>
  );
};
