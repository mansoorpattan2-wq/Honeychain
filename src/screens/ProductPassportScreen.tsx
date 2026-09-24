import React, { useState } from 'react';
import { Screen } from '../types';
import { useBatch } from '../context/BatchContext';
import { useAuth } from '../context/AuthContext';

interface ProductPassportScreenProps {
  onNavigate: (screen: Screen) => void;
}

export const ProductPassportScreen: React.FC<ProductPassportScreenProps> = ({ onNavigate }) => {
  const { currentBatch, provenanceEvents } = useBatch();
  const { currentUser } = useAuth();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showBeekeeperModal, setShowBeekeeperModal] = useState(false);

  return (
    <div className="bg-[#FAF8F5] text-on-surface antialiased min-h-screen pb-28 selection:bg-secondary-fixed selection:text-on-secondary-fixed max-w-screen-md mx-auto shadow-sm border-x border-[#E6DFD5]/40">
      {/* TopAppBar Shared Component Executed to Spec */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 h-16 max-w-screen-md mx-auto border-b border-[#E6DFD5] bg-[#FAF8F5]/95 backdrop-blur-md">
        <button
          aria-label="Go back"
          onClick={() => onNavigate('qr-scanner')}
          className="p-2 -ml-2 rounded-lg text-primary hover:bg-[#e7eeff] hover:text-primary transition-colors duration-150 active:scale-95 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="font-headline-sm text-headline-sm tracking-widest uppercase text-primary font-medium">
            HONEYCHAIN
          </span>
          <span className="font-label-caps text-label-caps text-on-surface-variant text-[10px] tracking-widest">
            Digital Passport v2.4
          </span>
        </div>

        <div className="flex items-center gap-1">
          {currentUser ? (
            <button
              aria-label="Supply Chain Dashboard"
              onClick={() => onNavigate('dashboard')}
              className="p-2 rounded-lg text-primary hover:bg-[#e7eeff] hover:text-primary transition-colors duration-150 active:scale-95 cursor-pointer"
              type="button"
              title="Supply Chain Dashboard"
            >
              <span className="material-symbols-outlined">dashboard</span>
            </button>
          ) : (
            <button
              aria-label="Supply Chain Login"
              onClick={() => onNavigate('auth')}
              className="p-2 rounded-lg text-primary hover:bg-[#e7eeff] hover:text-primary transition-colors duration-150 active:scale-95 cursor-pointer"
              type="button"
              title="Supply Chain Login"
            >
              <span className="material-symbols-outlined">login</span>
            </button>
          )}

          <button
            aria-label="Verified user status"
            onClick={() => onNavigate('verification')}
            className="p-2 -mr-2 rounded-lg text-primary hover:bg-[#e7eeff] hover:text-primary transition-colors duration-150 active:scale-95 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined">verified_user</span>
          </button>
        </div>
      </header>

      {/* Mobile Viewport Container */}
      <main className="max-w-screen-md mx-auto pt-20 px-4 space-y-6">
        {/* Hero Showcase Card */}
        <section className="bg-surface-container-lowest rounded-2xl p-5 border border-[#E6DFD5] shadow-sm relative overflow-hidden">
          {/* Ambient Honey Glow */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Pill Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed/40 border border-secondary-container/30 text-on-secondary-container font-label-caps text-label-caps tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse"></span>
              CERTIFIED BOTANICAL ORIGIN • SINGLE SOURCE
            </span>
            <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
              eco
            </span>
          </div>

          {/* Titles */}
          <div className="space-y-1 mb-4">
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-medium tracking-tight">
              {currentBatch.productName || currentBatch.honeyType}
            </h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2">
              <span>Raw</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              <span>Unheated</span>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              <span>{currentBatch.vesselSize || '500 g Artisanal Glass Vessel'}</span>
            </p>
          </div>

          {/* Jar Preview Frame */}
          <div className="relative w-full h-64 rounded-xl overflow-hidden border border-[#E6DFD5] bg-[#f0f3ff] mb-4 group">
            <img
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA14K-uvoIOGR25Z0eI0aGd1V0CxZ3NOcBO0P2Fl_0h8lO8FmU77LO8YzW5i5fMknsblHGo5NIyQlWSV_jn1ELL03w8YyYG5QETBlf9QGbGZ43cfGXn4HQWsCSAxOCUvLlpkpFSJylJdtvKjrjP6coLx3jnCP-u5F7eOA4nwQpj9UkkG7KZtVASNza49_DZ0c4tOHwtKQ8g314D8igXIILf88i936xBEHbK2hXPuq2-2GMnENgqIj4o"
              alt="Artisanal Honey Jar Sealed"
            />
            {/* Tamper-evident Indicator Tag */}
            <div className="absolute bottom-3 left-3 right-3 bg-surface-container-lowest/90 backdrop-blur-md rounded-lg px-3 py-2 flex items-center justify-between border border-[#E6DFD5]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-sm">lock</span>
                <span className="font-label-caps text-label-caps text-primary tracking-wide">
                  {currentBatch.packagingStatus === 'sealed_tamper_evident' ? 'TAMPER SEAL INTACT' : 'BATCH SEALED'}
                </span>
              </div>
              <span className="font-code-telemetry text-code-telemetry text-on-surface-variant">
                {currentBatch.nfcTag}
              </span>
            </div>
          </div>

          {/* Core Identity Strip */}
          <div className="grid grid-cols-2 gap-2 bg-[#FAF8F5] p-3 rounded-xl border border-[#E6DFD5]/60">
            <div>
              <span className="block font-label-caps text-label-caps text-on-surface-variant text-[10px]">
                BATCH NUMBER
              </span>
              <span className="font-code-telemetry text-code-telemetry text-primary font-semibold">
                {currentBatch.batchId}
              </span>
            </div>
            <div>
              <span className="block font-label-caps text-label-caps text-on-surface-variant text-[10px]">
                UNIQUE IDENTITY
              </span>
              <span className="font-code-telemetry text-code-telemetry text-secondary font-semibold">
                {currentBatch.uniqueId}
              </span>
            </div>
          </div>
        </section>

        {/* The Four Core Consumer Answers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-headline-sm text-headline-sm text-primary">Cryptographic Provenance</h2>
            <span className="font-label-caps text-label-caps text-on-surface-variant">4/4 VERIFIED METRICS</span>
          </div>

          {/* 1. WHERE: Origin & GIS Map */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 border border-[#E6DFD5] space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#e7eeff] flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-lg">explore</span>
                </div>
                <div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">1. ORIGIN &amp; TERROIR</span>
                  <h3 className="font-title-md text-title-md text-primary">{currentBatch.location}</h3>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-[10px]">
                GEO-FENCED
              </span>
            </div>
            <div className="relative h-32 rounded-xl overflow-hidden border border-[#E6DFD5]">
              <img
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuABTec_ySrlUddLBaotY-0PFCja4AEZV_oje55nq4FRiKSWWel-Opxl-3S7pY1UnDZpPRpQ_a5fY9tFsbsQphoTHFcegckKbNc3C3ult2AMM7rhoR1CGoh86ifNZH_aZ83MaltfcBkSezk4oZi31JeGpFD9RBZI3Io5lPn1XW0zN6mKrgaQy7NvVaFSGFuhXWAN9kWbdqcyZQPB5UsIkuNVNHOzG1gLU7niXlasDxg7idHDM4CmW9d-"
                alt="Forest satellite view"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-2.5">
                <div className="flex items-center justify-between w-full text-white">
                  <div className="flex items-center gap-1.5 font-code-telemetry text-code-telemetry">
                    <span className="material-symbols-outlined text-sm text-secondary-container">pin_drop</span>
                    <span>{currentBatch.coordinates}</span>
                  </div>
                  <span className="font-label-caps text-[10px] tracking-wider bg-primary-container/80 px-2 py-0.5 rounded">
                    0 PESTICIDE BUFFER
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. WHO: Master Beekeeper */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 border border-[#E6DFD5] space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#e7eeff] flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-lg">person_pin</span>
              </div>
              <div>
                <span className="font-label-caps text-label-caps text-on-surface-variant">2. HARVEST GUARDIAN</span>
                <h3 className="font-title-md text-title-md text-primary">{currentBatch.beekeeper}</h3>
              </div>
            </div>
            <div
              onClick={() => setShowBeekeeperModal(true)}
              className="flex items-center gap-3.5 bg-[#FAF8F5] p-3 rounded-xl border border-[#E6DFD5]/60 cursor-pointer hover:border-secondary transition-colors"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-xs">
                <img
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTlYRtFS9cmaHQ5f2WqP7nRFys6_RUecQPPbU9HKIFyJ1CA9dbDNYJrOPHaIqdIrsoSai-TBSZLg-j71pvlsNdmiftNBIfNI29F0rnqeooZWspzN52VZ6TO24Q0skvUXdTXfd_nLkX6-px_3NnZ7A0BYkdlyNWwpry4vXklKArjVfVJExROd1ErmhP1tU_QK0Uu-hz21PA3fG7QEcNhwIwqo8dcqBO0cXxm0ID3wPV81zEICa_RUOd"
                  alt="Master Beekeeper"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-title-md text-title-md text-on-surface">Registered Apiary Guardian</span>
                  <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {currentBatch.beekeeperReg}
                </p>
                <p className="font-body-sm text-body-sm italic text-primary/80">
                  "{currentBatch.beekeeperQuote}"
                </p>
              </div>
            </div>
          </div>

          {/* 3. WHEN: Harvest Moment */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 border border-[#E6DFD5] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#e7eeff] flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-lg">calendar_today</span>
                </div>
                <div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">3. TIME OF EXTRACTION</span>
                  <h3 className="font-title-md text-title-md text-primary">{currentBatch.harvestDate.split('•')[0]}</h3>
                </div>
              </div>
              <div className="text-right">
                <span className="font-data-metric text-data-metric text-secondary block">
                  {currentBatch.harvestDate.includes('•') ? currentBatch.harvestDate.split('•')[1].trim() : 'DAWN'}
                </span>
                <span className="font-label-caps text-label-caps text-on-surface-variant text-[10px]">
                  IST (DAWN WINDOW)
                </span>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E6DFD5]/60 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-base">wb_twilight</span>
              Harvested during dawn dew equilibrium prior to daytime thermal humidity fluctuations.
            </p>
          </div>

          {/* 4. UNDER WHAT CONDITIONS: Smart Hive Telemetry */}
          <div className="bg-surface-container-lowest rounded-2xl p-4 border border-[#E6DFD5] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#e7eeff] flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-lg">sensors</span>
                </div>
                <div>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">4. SMART HIVE TELEMETRY</span>
                  <h3 className="font-title-md text-title-md text-primary">Hive Node: {currentBatch.hiveId}</h3>
                </div>
              </div>
              <span className="font-code-telemetry text-code-telemetry text-on-primary-fixed-variant bg-primary-fixed/60 px-2 py-0.5 rounded">
                ONLINE LOCK
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E6DFD5]/60">
                <span className="font-label-caps text-label-caps text-on-surface-variant block text-[10px]">
                  BROOD TEMPERATURE
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-data-metric text-data-metric text-primary">{currentBatch.metrics.broodTemp}</span>
                  <span className="font-body-sm text-[10px] text-on-surface-variant">Optimal Homeostasis</span>
                </div>
              </div>
              <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E6DFD5]/60">
                <span className="font-label-caps text-label-caps text-on-surface-variant block text-[10px]">
                  RELATIVE HUMIDITY
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-data-metric text-data-metric text-primary">{currentBatch.metrics.humidity}</span>
                  <span className="font-body-sm text-[10px] text-on-surface-variant">Nectar Cure Band</span>
                </div>
              </div>
              <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E6DFD5]/60">
                <span className="font-label-caps text-label-caps text-on-surface-variant block text-[10px]">
                  QUEEN ACOUSTICS
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-data-metric text-data-metric text-secondary">{currentBatch.metrics.queenAcoustics}</span>
                  <span className="font-body-sm text-[10px] text-on-surface-variant">Calm Piping</span>
                </div>
              </div>
              <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E6DFD5]/60">
                <span className="font-label-caps text-label-caps text-on-surface-variant block text-[10px]">
                  BAROMETRIC PRESSURE
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="font-data-metric text-data-metric text-primary">{currentBatch.metrics.pressure}</span>
                  <span className="font-body-sm text-[10px] text-on-surface-variant">Stable Dawn</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Provenance Chain Stepper */}
        <section className="bg-surface-container-lowest rounded-2xl p-5 border border-[#E6DFD5] space-y-4">
          <div className="flex items-center justify-between border-b border-[#E6DFD5]/40 pb-3">
            <div>
              <span className="font-label-caps text-label-caps text-secondary uppercase">IMMUTABLE LEDGER</span>
              <h2 className="font-headline-sm text-headline-sm text-primary">Provenance Chain</h2>
            </div>
            <span className="font-code-telemetry text-code-telemetry text-on-surface-variant bg-[#e7eeff] px-2 py-1 rounded">
              {provenanceEvents.length} MILESTONES
            </span>
          </div>

          <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#E6DFD5]">
            {provenanceEvents.length > 0 ? (
              provenanceEvents.map((evt, idx) => (
                <div key={evt.eventId} className="relative">
                  <div
                    className={`absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      idx === provenanceEvents.length - 1 ? 'bg-secondary animate-pulse' : 'bg-primary-container'
                    }`}
                  ></div>
                  <div>
                    <span className="font-label-caps text-label-caps text-on-surface-variant text-[10px]">
                      {evt.eventType} • {evt.timestamp}
                    </span>
                    <h4 className="font-title-md text-title-md text-primary">{evt.actor}</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{evt.description}</p>
                    {evt.evidenceReference && (
                      <span className="inline-block mt-1 font-code-telemetry text-[11px] text-secondary bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#E6DFD5]">
                        Ref: {evt.evidenceReference}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-2 text-xs text-on-surface-variant">Milestone audit records synchronized.</div>
            )}
          </div>
        </section>

        {/* Prominent Call to Action Area */}
        <section className="space-y-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('honey-journey')}
            className="w-full bg-primary-container text-white py-4 px-6 rounded-xl font-title-md text-title-md flex items-center justify-center gap-2 hover:bg-primary transition-all duration-150 active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <span>View complete journey</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setShowWalletModal(true)}
              className="bg-surface-container-lowest text-primary py-3 px-3 rounded-xl border border-[#E6DFD5] font-body-md text-body-md font-medium flex items-center justify-center gap-1.5 hover:bg-[#FAF8F5] hover:border-secondary transition-colors duration-150 active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">account_balance_wallet</span>
              <span>Apple Wallet</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('lab-evidence')}
              className="bg-surface-container-lowest text-primary py-3 px-3 rounded-xl border border-[#E6DFD5] font-body-md text-body-md font-medium flex items-center justify-center gap-1.5 hover:bg-[#FAF8F5] hover:border-secondary transition-colors duration-150 active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">biotech</span>
              <span>Lab Analysis</span>
            </button>
          </div>
        </section>
      </main>

      {/* Apple Wallet Pass Simulation Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#0F2D1F] to-[#00170C] text-white rounded-2xl p-6 w-full max-w-sm border border-secondary shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowWalletModal(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-secondary text-2xl">account_balance_wallet</span>
              <div>
                <div className="font-headline-sm text-sm tracking-widest uppercase">HONEYCHAIN PASS</div>
                <div className="text-[10px] text-emerald-300">Apple Wallet Verified Pass</div>
              </div>
            </div>

            <div className="space-y-3 bg-white/10 backdrop-blur-md rounded-xl p-3.5 border border-white/20">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-white/70">Product</span>
                  <div className="font-semibold text-sm">{currentBatch.productName}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  {currentBatch.verificationStatus.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between items-start text-xs">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-white/70">Batch</span>
                  <div className="font-mono text-emerald-300">{currentBatch.batchId}</div>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-white/70">Harvest Date</span>
                  <div>{currentBatch.harvestDate.split('•')[0]}</div>
                </div>
              </div>
            </div>

            <p className="text-xs text-white/80 mt-4 text-center">
              Cryptographic NFC pass saved to Apple Wallet on your local device.
            </p>

            <button
              type="button"
              onClick={() => setShowWalletModal(false)}
              className="w-full mt-4 py-2.5 bg-secondary text-white font-semibold rounded-xl text-sm hover:bg-secondary/90 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Beekeeper Story Modal */}
      {showBeekeeperModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm border border-[#E6DFD5] shadow-2xl relative space-y-4">
            <button
              type="button"
              onClick={() => setShowBeekeeperModal(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-primary"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="flex items-center gap-3">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTlYRtFS9cmaHQ5f2WqP7nRFys6_RUecQPPbU9HKIFyJ1CA9dbDNYJrOPHaIqdIrsoSai-TBSZLg-j71pvlsNdmiftNBIfNI29F0rnqeooZWspzN52VZ6TO24Q0skvUXdTXfd_nLkX6-px_3NnZ7A0BYkdlyNWwpry4vXklKArjVfVJExROd1ErmhP1tU_QK0Uu-hz21PA3fG7QEcNhwIwqo8dcqBO0cXxm0ID3wPV81zEICa_RUOd"
                alt={currentBatch.beekeeper}
                className="w-12 h-12 rounded-full object-cover border-2 border-secondary"
              />
              <div>
                <h3 className="font-title-lg text-primary">{currentBatch.beekeeper}</h3>
                <p className="text-xs text-secondary font-medium">Registered Apiary Guardian</p>
              </div>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Serving the sustainable bioreserve cooperative, {currentBatch.beekeeper} uses traditional smoke-free, chemical-free
              bee-brushing methods to preserve wild bee colonies and forest equilibrium.
            </p>
            <div className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E6DFD5] text-[11px] font-mono text-primary">
              License: {currentBatch.beekeeperReg}
            </div>
            <button
              type="button"
              onClick={() => setShowBeekeeperModal(false)}
              className="w-full py-2 bg-primary-container text-white rounded-xl text-sm font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E6DFD5] max-w-screen-md mx-auto">
        {/* Item 1: Scan Bottle (Inactive) */}
        <button
          type="button"
          onClick={() => onNavigate('qr-scanner')}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 transition-all duration-200 hover:text-primary active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined mb-0.5">qr_code_scanner</span>
          <span className="font-label-caps text-label-caps">Scan Bottle</span>
        </button>

        {/* Item 2: Attestation (Inactive) */}
        <button
          type="button"
          onClick={() => onNavigate('verification')}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 transition-all duration-200 hover:text-primary active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined mb-0.5">verified</span>
          <span className="font-label-caps text-label-caps">Attestation</span>
        </button>

        {/* Item 3: Passport (ACTIVE) */}
        <button
          type="button"
          onClick={() => onNavigate('product-passport')}
          className="flex flex-col items-center justify-center bg-primary-container text-inverse-primary rounded-xl px-4 py-1.5 transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined mb-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
            menu_book
          </span>
          <span className="font-label-caps text-label-caps font-semibold">Passport</span>
        </button>
      </nav>
    </div>
  );
};
