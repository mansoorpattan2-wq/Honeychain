import React, { useState } from 'react';
import { Screen } from '../types';
import { useBatch } from '../context/BatchContext';
import { useAuth } from '../context/AuthContext';
import { recordVerificationScan } from '../services/honeyChainService';

interface QRScannerScreenProps {
  onNavigate: (screen: Screen) => void;
}

type ScannerState = 'camera' | 'scanning' | 'detected' | 'invalid';

export const QRScannerScreen: React.FC<QRScannerScreenProps> = ({ onNavigate }) => {
  const { currentBatch, allBatches, selectBatch } = useBatch();
  const { currentUser, userProfile } = useAuth();

  const [scannerState, setScannerState] = useState<ScannerState>('detected');
  const [torchOn, setTorchOn] = useState(false);
  const [lensFront, setLensFront] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualIdInput, setManualIdInput] = useState('');
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedNotification(label);
    setTimeout(() => setCopiedNotification(null), 2500);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (manualIdInput.trim()) {
      const found = await selectBatch(manualIdInput.trim());
      setShowManualModal(false);
      if (found) {
        setScannerState('detected');
        recordVerificationScan(manualIdInput.trim());
      } else {
        setScannerState('invalid');
      }
    }
  };

  const handleViewPassport = () => {
    recordVerificationScan(currentBatch.batchId);
    onNavigate('product-passport');
  };

  return (
    <div className="relative w-full max-w-md min-h-screen flex flex-col bg-[#FAF8F5] shadow-2xl pb-24 overflow-x-hidden border-x border-[#E6DFD5]/70 mx-auto">
      {/* Toast Notification */}
      {copiedNotification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-primary text-white text-xs px-3 py-1.5 rounded-full shadow-lg border border-secondary flex items-center gap-1.5 animate-bounce">
          <span className="material-symbols-outlined text-sm text-secondary-container">check_circle</span>
          <span>{copiedNotification}</span>
        </div>
      )}

      {/* TopAppBar (Shared Components Spec) */}
      <header className="fixed top-0 left-0 right-0 max-w-md mx-auto w-full z-50 flex items-center justify-between px-4 h-16 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E6DFD5] shadow-sm">
        <button
          aria-label="Go back"
          onClick={() => onNavigate('product-passport')}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-primary hover:bg-[#e7eeff] transition-colors active:scale-95"
          type="button"
        >
          <span className="material-symbols-outlined text-primary text-[22px]">arrow_back</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="font-headline-sm text-headline-sm tracking-widest uppercase text-primary font-medium">
            HONEYCHAIN
          </span>
          <span className="font-code-telemetry text-[10px] tracking-wider text-secondary uppercase font-semibold">
            Optical Ledger 2.4
          </span>
        </div>

        <div className="flex items-center gap-1">
          {currentUser ? (
            <button
              aria-label="Supply Chain Dashboard"
              onClick={() => onNavigate('dashboard')}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-primary hover:bg-[#e7eeff] transition-colors active:scale-95"
              type="button"
              title="Supply Chain Dashboard"
            >
              <span className="material-symbols-outlined text-primary text-[22px]">dashboard</span>
            </button>
          ) : (
            <button
              aria-label="Supply Chain Sign In"
              onClick={() => onNavigate('auth')}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-primary hover:bg-[#e7eeff] transition-colors active:scale-95"
              type="button"
              title="Supply Chain Portal"
            >
              <span className="material-symbols-outlined text-primary text-[22px]">login</span>
            </button>
          )}

          <button
            aria-label="Security attestations"
            onClick={() => onNavigate('verification')}
            className="w-10 h-10 flex items-center justify-center rounded-lg text-primary hover:bg-[#e7eeff] transition-colors active:scale-95"
            type="button"
          >
            <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
          </button>
        </div>
      </header>

      {/* Main Viewport Canvas */}
      <main className="flex-1 flex flex-col pt-20 px-4">
        {/* Viewfinder Section Header */}
        <section className="mt-2 mb-3 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FEF3C7] border border-secondary/30 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest">
              Photometric Alignment
            </span>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">
            Scan Honey QR
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            Position the QR code inside the frame.
          </p>
        </section>

        {/* Interactive State Switcher Chips */}
        <section className="mb-4">
          <div className="flex items-center justify-between gap-1 p-1 bg-[#F5F2EB] rounded-xl border border-[#E6DFD5] overflow-x-auto">
            <button
              id="chip-camera"
              type="button"
              onClick={() => setScannerState('camera')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-code-telemetry text-[11px] text-center whitespace-nowrap transition-all duration-150 ${
                scannerState === 'camera'
                  ? 'bg-white text-primary shadow-sm font-semibold border border-[#E6DFD5]'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Camera Active
            </button>
            <button
              id="chip-scanning"
              type="button"
              onClick={() => setScannerState('scanning')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-code-telemetry text-[11px] text-center whitespace-nowrap transition-all duration-150 ${
                scannerState === 'scanning'
                  ? 'bg-white text-primary shadow-sm font-semibold border border-[#E6DFD5]'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Scanning...
            </button>
            <button
              id="chip-detected"
              type="button"
              onClick={() => setScannerState('detected')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-code-telemetry text-[11px] text-center whitespace-nowrap transition-all duration-150 ${
                scannerState === 'detected'
                  ? 'bg-white text-primary shadow-sm font-semibold border border-[#E6DFD5]'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              QR Detected ✓
            </button>
            <button
              id="chip-invalid"
              type="button"
              onClick={() => setScannerState('invalid')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-code-telemetry text-[11px] text-center whitespace-nowrap transition-all duration-150 ${
                scannerState === 'invalid'
                  ? 'bg-white text-primary shadow-sm font-semibold border border-[#E6DFD5]'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Invalid QR ⚠
            </button>
          </div>
        </section>

        {/* Optical Viewfinder Container */}
        <section className="relative w-full aspect-[4/4.4] rounded-2xl overflow-hidden bg-primary-container border border-[#E6DFD5] shadow-lg flex items-center justify-center">
          {/* Simulated Camera Feed */}
          <div className="absolute inset-0 z-0">
            <img
              id="camera-preview-feed"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiJINdM-4l4hL34ZjNaXYGK-5aGhJncdK9O1ZRYkgVo3kDKGo8-ZZ47A-p1MYuTRv5TYEXveB6vjraVaQy1QCmdi16TjmpwVSsP0Uag7ri_DM5JoRw-smX79d1vG4mu5ZzxBxIEFGrMVBjN2I6cXc8Q6kMcewzNWCd-0ItF2fjGO4jy_7XU9xDqGlBVgG1V9mlZtPn2ed_755SSiOJoLaZgyZnx0eg6vsbTa3sTSmM5xclDlzkGd-3"
              alt="Artisan honey jar sealed with QR code tamper band"
              className={`w-full h-full object-cover opacity-75 scale-105 filter brightness-95 contrast-105 transition-all duration-500 ${
                lensFront ? 'scale-x-[-1]' : ''
              } ${torchOn ? 'brightness-125' : ''}`}
            />
            {/* Grid Telemetry Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-primary/60 pointer-events-none"></div>
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#FEF3C7 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            ></div>
          </div>

          {/* Target Scan Reticle Box */}
          <div
            id="reticle-box"
            className={`relative z-10 w-[74%] aspect-square rounded-xl transition-all duration-300 ${
              scannerState === 'detected'
                ? 'border-2 border-emerald-500 shadow-[0_0_24px_rgba(16,185,129,0.35)] backdrop-blur-none'
                : scannerState === 'invalid'
                ? 'border-2 border-error shadow-[0_0_20px_rgba(186,26,26,0.3)]'
                : scannerState === 'scanning'
                ? 'border border-[#FE932C] ring-2 ring-[#FE932C]/30 backdrop-blur-[1px]'
                : 'border border-secondary/40 backdrop-blur-[1px]'
            }`}
          >
            {/* Viewfinder Golden Reticle Corners */}
            <span className="absolute -top-1 -left-1 w-6 h-6 border-t-[3px] border-l-[3px] border-secondary-container rounded-tl-md shadow-[0_0_8px_rgba(254,147,44,0.6)]"></span>
            <span className="absolute -top-1 -right-1 w-6 h-6 border-t-[3px] border-r-[3px] border-secondary-container rounded-tr-md shadow-[0_0_8px_rgba(254,147,44,0.6)]"></span>
            <span className="absolute -bottom-1 -left-1 w-6 h-6 border-b-[3px] border-l-[3px] border-secondary-container rounded-bl-md shadow-[0_0_8px_rgba(254,147,44,0.6)]"></span>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 border-b-[3px] border-r-[3px] border-secondary-container rounded-br-md shadow-[0_0_8px_rgba(254,147,44,0.6)]"></span>

            {/* Laser Beam Line */}
            {scannerState !== 'detected' && (
              <div
                id="scan-ray"
                className="absolute left-1.5 right-1.5 h-[2px] bg-gradient-to-r from-transparent via-[#FE932C] to-transparent shadow-[0_0_12px_#FE932C] animate-scan-ray"
              ></div>
            )}

            {/* Central Crosshair Calibration */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <div className="w-10 h-10 border border-secondary-fixed-dim/60 rounded-full flex items-center justify-center animate-lens-pulse">
                <div className="w-1.5 h-1.5 bg-secondary-container rounded-full"></div>
              </div>
            </div>

            {/* Top Alignment Callout */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-primary-container/90 backdrop-blur-md px-3 py-1 rounded-full border border-secondary/40 flex items-center gap-1.5 shadow-md">
              <span className="material-symbols-outlined text-[13px] text-secondary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>
                shield
              </span>
              <span className="font-code-telemetry text-[10px] text-white tracking-wider uppercase font-semibold">
                SECURE PRODUCT VERIFICATION
              </span>
            </div>

            {/* Bottom Telemetry Coordinates */}
            <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span
                id="reticle-telemetry-text"
                className="font-code-telemetry text-[10px] text-[#FEF3C7] tracking-widest uppercase bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm"
              >
                {scannerState === 'detected'
                  ? `LOCK ACQUIRED • ${currentBatch.batchId}`
                  : scannerState === 'invalid'
                  ? 'CHECKSUM MISMATCH • RE-SCAN'
                  : scannerState === 'scanning'
                  ? 'ANALYZING QR PATTERN...'
                  : 'FOCUS LOCK • ISO 160 • 4K TELEMETRY'}
              </span>
            </div>
          </div>

          {/* Camera Ambient Controls */}
          <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
            <button
              aria-label="Toggle flashlight"
              type="button"
              onClick={() => setTorchOn(!torchOn)}
              className={`w-9 h-9 rounded-full backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all active:scale-95 ${
                torchOn ? 'bg-secondary text-white ring-2 ring-secondary' : 'bg-primary/70 hover:bg-primary'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </button>
            <div className="px-3 py-1 rounded-full bg-primary/70 backdrop-blur-md border border-white/20 text-white font-code-telemetry text-[11px] tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>AUTO-EXPOSURE: ACTIVE</span>
            </div>
            <button
              aria-label="Switch camera lens"
              type="button"
              onClick={() => setLensFront(!lensFront)}
              className="w-9 h-9 rounded-full bg-primary/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-primary transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">flip_camera_ios</span>
            </button>
          </div>
        </section>

        {/* Detection Feedback / Verification Card */}
        <section className="mt-4">
          {scannerState !== 'invalid' ? (
            <div
              id="state-card-detected"
              className="bg-surface-container-lowest border border-[#E6DFD5] rounded-2xl p-4 shadow-sm relative overflow-hidden transition-all duration-200"
            >
              {/* Top Row: Badge & Status */}
              <div className="flex items-center justify-between pb-3 border-b border-[#F5F2EB]">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEF3C7] border border-secondary/30">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                  <span className="font-label-caps text-label-caps text-secondary uppercase font-bold tracking-wider">
                    {scannerState === 'scanning' ? 'Decoding QR...' : 'QR detected'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-on-surface-variant font-code-telemetry text-[11px]">
                  <span
                    className={`material-symbols-outlined text-secondary text-[16px] ${
                      scannerState === 'scanning' ? 'animate-spin' : ''
                    }`}
                  >
                    sync
                  </span>
                  <span className="text-primary font-medium" id="verification-status-label">
                    {scannerState === 'scanning'
                      ? 'Decoding ECC Reed-Solomon...'
                      : scannerState === 'camera'
                      ? 'Aligning jar lid seal...'
                      : 'Verifying product identity...'}
                  </span>
                </div>
              </div>

              {/* Batch ID and Cryptographic Hash */}
              <div className="pt-3 flex items-start justify-between">
                <div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider uppercase block">
                    Target Batch Certificate
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-code-telemetry text-body-md text-primary font-bold tracking-tight">
                      {currentBatch.batchId}
                    </span>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
                    </span>
                  </div>
                  <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5">
                    {currentBatch.honeyType} • {currentBatch.location}
                  </p>
                </div>

                {/* Certified Seal Icon Capsule */}
                <div className="w-11 h-11 rounded-xl bg-[#FAF8F5] border border-[#E6DFD5] flex items-center justify-center shrink-0 shadow-inner">
                  <span className="material-symbols-outlined text-secondary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    workspace_premium
                  </span>
                </div>
              </div>

              {/* Cryptographic Hash Telemetry Strip */}
              <div
                className="mt-3 py-2 px-3 bg-[#FAF8F5] rounded-xl border border-[#E6DFD5]/80 flex items-center justify-between cursor-pointer hover:bg-[#f2efe9] transition-colors"
                onClick={() => copyToClipboard(currentBatch.rootHash, 'Hash Copied')}
                title="Click to copy hash"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="material-symbols-outlined text-[15px] text-on-surface-variant shrink-0">tag</span>
                  <span className="font-code-telemetry text-[11px] text-on-surface-variant truncate">
                    {currentBatch.rootHash.substring(0, 24)}...
                  </span>
                </div>
                <span className="font-code-telemetry text-[10px] text-primary-container bg-primary-fixed px-2 py-0.5 rounded font-semibold shrink-0">
                  ON-CHAIN
                </span>
              </div>

              {/* Action CTA for Detected State (Must match xpath `//button[contains(., 'View Complete Hive Passport')]`) */}
              <button
                type="button"
                onClick={handleViewPassport}
                className="w-full mt-3.5 py-3 px-4 rounded-xl bg-primary-container text-white font-title-md text-title-md hover:bg-[#163B2A] transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer"
              >
                <span>View Complete Hive Passport</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          ) : (
            /* Invalid State Card */
            <div id="state-card-invalid" className="bg-surface-container-lowest border border-error/30 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2.5 text-error">
                <span className="material-symbols-outlined text-[24px]">warning</span>
                <div>
                  <h3 className="font-title-md text-title-md font-bold text-error">Unrecognized Cryptographic Hash</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                    QR signature does not correspond to an authentic HoneyChain harvested batch.
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="w-full mt-3 py-2.5 rounded-xl border border-[#E6DFD5] bg-white text-primary font-title-md text-[13px] hover:bg-[#FAF8F5] cursor-pointer"
                onClick={() => setScannerState('camera')}
              >
                Re-align Scanner
              </button>
            </div>
          )}
        </section>

        {/* Manual ID Entry Option */}
        <section className="mt-4 p-3.5 rounded-2xl bg-[#F5F2EB]/60 border border-[#E6DFD5] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-white border border-[#E6DFD5] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-primary text-[18px]">pin</span>
            </div>
            <div className="min-w-0">
              <p className="font-body-sm text-[12px] text-primary font-medium truncate">
                Trouble scanning? Enter 16-character Batch ID manually
              </p>
              <p className="font-code-telemetry text-[10px] text-on-surface-variant">Located on tamper seal underside</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowManualModal(true)}
            className="shrink-0 px-3.5 py-2 rounded-lg bg-white text-primary border border-[#E6DFD5] font-code-telemetry text-body-sm font-semibold hover:border-secondary hover:text-secondary transition-colors active:scale-95 shadow-sm cursor-pointer"
          >
            Enter ID
          </button>
        </section>

        {/* Discrete System Notice / Disclaimer */}
        <footer className="mt-4 mb-2 text-center">
          <p className="font-code-telemetry text-[10px] text-outline tracking-wider uppercase font-semibold">
            DEMO DATA • HoneyChain Optical Ledger
          </p>
          <p className="font-body-sm text-[11px] text-on-surface-variant/80 mt-0.5">
            Patent Pending Cryptographic Pollen Barcode System • Zero-Knowledge Origin Proof
          </p>
        </footer>
      </main>

      {/* Manual ID Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm border border-[#E6DFD5] shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">pin</span>
                <h3 className="font-title-lg text-title-lg text-primary">Enter Batch ID</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="text-on-surface-variant hover:text-primary"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="font-body-sm text-on-surface-variant text-xs">
              Select or type the code printed on the tamper-evident band under the jar seal.
            </p>

            {/* Quick Batch Options */}
            <div className="flex flex-wrap gap-1.5">
              {allBatches.map((b) => (
                <button
                  key={b.batchId}
                  type="button"
                  onClick={() => setManualIdInput(b.batchId)}
                  className="px-2 py-1 text-[11px] font-mono bg-[#FAF8F5] border border-[#E6DFD5] rounded-md hover:border-secondary text-primary"
                >
                  {b.batchId}
                </button>
              ))}
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3">
              <input
                type="text"
                value={manualIdInput}
                onChange={(e) => setManualIdInput(e.target.value)}
                placeholder="e.g. HNY-2026-0001"
                className="w-full px-3 py-2 border border-[#E6DFD5] rounded-lg font-code-telemetry text-sm text-primary focus:outline-none focus:border-primary-container"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="flex-1 py-2 border border-[#E6DFD5] rounded-xl text-sm font-medium text-on-surface-variant"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary-container text-white rounded-xl text-sm font-semibold hover:bg-[#163B2A]"
                >
                  Verify Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto w-full z-50 flex justify-around items-center px-4 py-2 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-outline-variant/40 shadow-sm">
        {/* Tab 1: Scan Bottle (ACTIVE) */}
        <button
          aria-current="page"
          type="button"
          onClick={() => onNavigate('qr-scanner')}
          className="flex flex-col items-center justify-center bg-primary-container text-inverse-primary rounded-xl px-4 py-1.5 transition-all duration-200 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            qr_code_scanner
          </span>
          <span className="font-label-caps text-label-caps mt-0.5 tracking-wider">Scan Bottle</span>
        </button>

        {/* Tab 2: Attestation (Inactive) */}
        <button
          type="button"
          onClick={() => onNavigate('verification')}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 transition-all duration-200 hover:text-primary active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">verified</span>
          <span className="font-label-caps text-label-caps mt-0.5 tracking-wider">Attestation</span>
        </button>

        {/* Tab 3: Passport (Inactive) */}
        <button
          type="button"
          onClick={() => onNavigate('product-passport')}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 transition-all duration-200 hover:text-primary active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[22px]">menu_book</span>
          <span className="font-label-caps text-label-caps mt-0.5 tracking-wider">Passport</span>
        </button>
      </nav>
    </div>
  );
};
