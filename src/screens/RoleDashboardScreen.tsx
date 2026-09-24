import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBatch } from '../context/BatchContext';
import { Screen, BatchInfo, ProvenanceEventItem, LabReportItem } from '../types';
import {
  createHoneyBatch,
  updateHoneyBatch,
  addProvenanceEvent,
  saveLabReport,
  uploadEvidenceDocument
} from '../services/honeyChainService';

interface RoleDashboardScreenProps {
  onNavigate: (screen: Screen) => void;
}

export const RoleDashboardScreen: React.FC<RoleDashboardScreenProps> = ({ onNavigate }) => {
  const { userProfile, signOut } = useAuth();
  const { currentBatch, allBatches, selectBatch, refreshBatchData } = useBatch();

  const [activeTab, setActiveTab] = useState<'create_batch' | 'provenance' | 'lab_upload' | 'qr_manage'>('create_batch');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // New Batch Form State
  const [batchIdInput, setBatchIdInput] = useState(`HNY-2026-000${allBatches.length + 1}`);
  const [honeyType, setHoneyType] = useState('Wild Forest Raw Honey');
  const [beekeeperName, setBeekeeperName] = useState(userProfile?.displayName || 'S. Ramesh');
  const [hiveId, setHiveId] = useState('HIVE-AP-0042');
  const [locationName, setLocationName] = useState('Nallamala Forest edge, Andhra Pradesh');
  const [quantity, setQuantity] = useState('120 kg (240 Jars)');

  // Provenance Event Form State
  const [eventType, setEventType] = useState<ProvenanceEventItem['eventType']>('HARVEST');
  const [eventLocation, setEventLocation] = useState('Nallamala Bioreserve Edge');
  const [eventDesc, setEventDesc] = useState('');
  const [eventDocRef, setEventDocRef] = useState('');

  // Lab Report Form State
  const [labReportId, setLabReportId] = useState(`EUR-IND-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [c4Sugar, setC4Sugar] = useState('0.00%');
  const [diastase, setDiastase] = useState('19.4 DN');
  const [hmf, setHmf] = useState('4.2 mg/kg');
  const [floralDna, setFloralDna] = useState('91.4% Native Forest Flora');
  const [moisture, setMoisture] = useState('17.8%');
  const [labStatus, setLabStatus] = useState<'passed' | 'failed'>('passed');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  const notifySuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  // 1. Handle New Batch Creation (Beekeeper, Processor, Admin)
  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);
    try {
      const newBatch: BatchInfo = {
        batchId: batchIdInput.trim(),
        uniqueId: `HNC-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-AX04`,
        honeyType,
        productName: honeyType,
        vesselSize: '500 g Artisanal Glass Vessel',
        beekeeper: beekeeperName,
        beekeeperUid: userProfile?.uid,
        beekeeperReg: 'Tribal Cooperative Society Reg #TCS-884',
        beekeeperQuote: 'Hand-harvested using brush-off methods without chemical repellents or smoker agitation.',
        hiveId,
        harvestDate: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • Dawn IST`,
        location: locationName,
        coordinates: '15.8281° N, 78.8682° E',
        quantity,
        labStatus: 'pending',
        processingStatus: 'harvested',
        packagingStatus: 'unsealed',
        verificationStatus: 'pending',
        labCertificateId: 'Pending Verification',
        testingLab: 'Eurofins Agri-Testing Lab, Bangalore (ISO/IEC 17025 Accredited)',
        nfcTag: `Hex #${Math.random().toString(16).substring(2, 6).toUpperCase()}-E`,
        rootHash: `SHA-256: ${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
        blockNumber: `#4,92${Math.floor(1000 + Math.random() * 9000)}`,
        blockTimestamp: `${new Date().toLocaleString()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metrics: {
          c4Sugar: '0.00%',
          diastase: '19.4 DN',
          hmf: '4.2 mg/kg',
          floralDna: '91.4%',
          moisture: '17.8%',
          broodTemp: '31.4°C',
          humidity: '61.8%',
          queenAcoustics: '228 Hz',
          pressure: '1012 hPa',
        },
      };

      await createHoneyBatch(newBatch);

      // Create initial genesis provenance event
      const genesisEvent: ProvenanceEventItem = {
        eventId: `EVT-${Date.now()}`,
        batchId: newBatch.batchId,
        eventType: 'HARVEST',
        actor: userProfile?.displayName || beekeeperName,
        actorUid: userProfile?.uid,
        actorRole: userProfile?.role || 'beekeeper',
        timestamp: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • IST`,
        location: locationName,
        description: `Batch registered: ${quantity} of ${honeyType} harvested from ${hiveId}.`,
        evidenceReference: `HARVEST-${newBatch.batchId}`,
        hash: newBatch.rootHash,
      };
      await addProvenanceEvent(genesisEvent);

      await refreshBatchData();
      await selectBatch(newBatch.batchId);
      notifySuccess(`Batch ${newBatch.batchId} created and registered on HoneyChain!`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to register honey batch');
    } finally {
      setSubmitting(false);
    }
  };

  // 2. Handle Adding Provenance Information
  const handleAddProvenance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDesc.trim()) return;
    setErrorMessage(null);
    setSubmitting(true);
    try {
      const event: ProvenanceEventItem = {
        eventId: `EVT-${Date.now()}`,
        batchId: currentBatch.batchId,
        eventType,
        actor: userProfile?.displayName || 'Authorized Actor',
        actorUid: userProfile?.uid,
        actorRole: userProfile?.role || 'actor',
        timestamp: `${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • IST`,
        location: eventLocation,
        description: eventDesc,
        evidenceReference: eventDocRef || undefined,
        hash: `SHA-256: ${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
      };

      await addProvenanceEvent(event);

      // Update processing or packaging status accordingly
      if (eventType === 'EXTRACTION') {
        await updateHoneyBatch(currentBatch.batchId, { processingStatus: 'extracted' });
      } else if (eventType === 'PACKAGING') {
        await updateHoneyBatch(currentBatch.batchId, {
          processingStatus: 'bottled',
          packagingStatus: 'sealed_tamper_evident',
        });
      }

      await refreshBatchData();
      setEventDesc('');
      notifySuccess(`Provenance milestone appended to batch ${currentBatch.batchId}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to append provenance milestone');
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Handle Lab Evidence Upload
  const handleUploadLabEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);
    try {
      let fileUrl = '';
      if (fileToUpload) {
        fileUrl = await uploadEvidenceDocument(
          fileToUpload,
          `lab-reports/${currentBatch.batchId}/${Date.now()}_${fileToUpload.name}`
        );
      }

      const report: LabReportItem = {
        reportId: labReportId.trim(),
        batchId: currentBatch.batchId,
        labName: userProfile?.organization || 'Eurofins Agri-Testing Lab, Bangalore',
        analystUid: userProfile?.uid,
        accreditation: 'ISO/IEC 17025:2017 Accredited Lab Ref #EUR-9948',
        sampleId: `SAMPLE-${currentBatch.batchId.substring(4)}`,
        sampleReceivedDate: `${new Date().toLocaleDateString('en-GB')} 09:30 IST`,
        verifiedReleasedDate: `${new Date().toLocaleDateString('en-GB')} 17:50 IST`,
        status: labStatus,
        c4Sugar,
        diastase,
        hmf,
        floralDna,
        moisture,
        documentUrl: fileUrl || undefined,
        documentName: fileToUpload?.name || 'Certificate_EUR_Attestation.pdf',
        digitalSignatureHash: `SHA-256: ${Math.random().toString(36).substring(2, 12)}7ac2`,
        createdAt: new Date().toISOString(),
      };

      await saveLabReport(report);

      // Add provenance event for lab release
      await addProvenanceEvent({
        eventId: `EVT-${Date.now()}`,
        batchId: currentBatch.batchId,
        eventType: 'LAB_ACCREDITATION',
        actor: userProfile?.displayName || 'Laboratory Analyst',
        actorUid: userProfile?.uid,
        actorRole: 'laboratory_officer',
        timestamp: `${new Date().toLocaleDateString('en-GB')} IST`,
        location: userProfile?.organization || 'Eurofins Agri-Testing Bangalore',
        description: `ISO/IEC 17025 certificate ${report.reportId} released: C4 adulteration ${c4Sugar}, Diastase ${diastase}. Status: ${labStatus.toUpperCase()}`,
        evidenceReference: report.documentName,
        hash: report.digitalSignatureHash,
      });

      await refreshBatchData();
      notifySuccess(`Laboratory assay ${report.reportId} registered for batch ${currentBatch.batchId}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload laboratory report');
    } finally {
      setSubmitting(false);
    }
  };

  const userRole = userProfile?.role || 'consumer';
  const qrVerificationUrl = `${window.location.origin}/#passport`;

  return (
    <div className="bg-[#FAF8F5] text-on-surface antialiased min-h-screen pb-28 max-w-screen-md mx-auto shadow-sm border-x border-[#E6DFD5]/40 flex flex-col">
      {/* Toast Notification */}
      {successMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-primary-container text-white text-xs px-4 py-2 rounded-full shadow-lg border border-secondary flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-sm text-secondary-container">check_circle</span>
          <span>{successMessage}</span>
        </div>
      )}

      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 h-16 max-w-screen-md mx-auto border-b border-[#E6DFD5] bg-[#FAF8F5]/95 backdrop-blur-md">
        <button
          aria-label="Go back"
          onClick={() => onNavigate('product-passport')}
          className="p-2 -ml-2 rounded-lg text-primary hover:bg-[#e7eeff] hover:text-primary transition-colors duration-150 active:scale-95 cursor-pointer"
          type="button"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="font-headline-sm text-headline-sm tracking-widest uppercase text-primary font-medium">
            HONEYCHAIN
          </span>
          <span className="font-label-caps text-label-caps text-secondary text-[10px] tracking-widest uppercase">
            {userRole.replace('_', ' ')} DASHBOARD
          </span>
        </div>

        <button
          onClick={() => onNavigate('verification')}
          className="p-2 -mr-2 rounded-lg text-primary"
          type="button"
        >
          <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified_user
          </span>
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-md mx-auto pt-20 px-4 space-y-5 flex-1 w-full">
        {/* User Role Card & Batch Switcher */}
        <section className="bg-surface-container-lowest rounded-2xl p-4 border border-[#E6DFD5] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center font-bold">
                {userProfile?.displayName?.[0] || 'U'}
              </div>
              <div>
                <h2 className="font-title-md text-primary">{userProfile?.displayName || 'Supply Chain Actor'}</h2>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  {userProfile?.organization || 'Registered HoneyChain Supply Chain Node'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-caps text-[11px] uppercase font-bold">
                {userRole.replace('_', ' ')}
              </span>
              <button
                type="button"
                onClick={() => {
                  signOut();
                  onNavigate('auth');
                }}
                title="Switch Account"
                className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-lg transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
              </button>
            </div>
          </div>

          {/* Active Batch Selector */}
          <div className="pt-2 border-t border-[#E6DFD5]/60 flex items-center justify-between gap-2">
            <span className="text-xs font-label-caps text-on-surface-variant uppercase whitespace-nowrap">
              Active Batch:
            </span>
            <select
              value={currentBatch.batchId}
              onChange={(e) => selectBatch(e.target.value)}
              className="flex-1 max-w-[240px] px-2.5 py-1.5 text-xs font-mono rounded-lg border border-[#E6DFD5] bg-[#FAF8F5] focus:outline-none focus:border-primary font-semibold text-primary"
            >
              {allBatches.map((b) => (
                <option key={b.batchId} value={b.batchId}>
                  {b.batchId} ({b.honeyType.substring(0, 16)}...)
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => onNavigate('product-passport')}
              className="px-2.5 py-1 text-xs rounded-lg bg-[#e7eeff] text-primary hover:bg-primary-fixed font-medium cursor-pointer"
            >
              View
            </button>
          </div>
        </section>

        {/* Dashboard Tabs */}
        <div className="flex bg-[#F5F2EB] p-1 rounded-xl border border-[#E6DFD5] overflow-x-auto gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('create_batch')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-title-md whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'create_batch'
                ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Register Batch
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('provenance')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-title-md whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'provenance'
                ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Add Provenance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lab_upload')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-title-md whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'lab_upload'
                ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Lab Evidence
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('qr_manage')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-title-md whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'qr_manage'
                ? 'bg-surface-container-lowest text-primary shadow-xs font-bold'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            QR Verification
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-error-container/30 border border-error text-error text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* TAB 1: CREATE HONEY BATCH */}
        {activeTab === 'create_batch' && (
          <section className="bg-surface-container-lowest rounded-2xl p-5 border border-[#E6DFD5] shadow-sm space-y-4">
            <div>
              <h3 className="font-title-lg text-primary">Register New Honey Batch</h3>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Create a botanical batch entity on Firestore linked to apiary telemetry.
              </p>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-label-caps text-on-surface-variant uppercase mb-1">
                    Batch ID (e.g. HNY-2026-0004)
                  </label>
                  <input
                    type="text"
                    required
                    value={batchIdInput}
                    onChange={(e) => setBatchIdInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E6DFD5] bg-[#FAF8F5] focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-label-caps text-on-surface-variant uppercase mb-1">
                    Smart Hive ID
                  </label>
                  <input
                    type="text"
                    required
                    value={hiveId}
                    onChange={(e) => setHiveId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E6DFD5] bg-[#FAF8F5] focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-label-caps text-on-surface-variant uppercase mb-1">
                  Honey Variety / Floral Type
                </label>
                <input
                  type="text"
                  required
                  value={honeyType}
                  onChange={(e) => setHoneyType(e.target.value)}
                  placeholder="e.g. Wild Forest Raw Honey"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DFD5] bg-[#FAF8F5] focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-label-caps text-on-surface-variant uppercase mb-1">
                    Beekeeper Name
                  </label>
                  <input
                    type="text"
                    required
                    value={beekeeperName}
                    onChange={(e) => setBeekeeperName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DFD5] bg-[#FAF8F5] focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-label-caps text-on-surface-variant uppercase mb-1">
                    Harvest Quantity
                  </label>
                  <input
                    type="text"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 120 kg (240 Jars)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DFD5] bg-[#FAF8F5] focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-label-caps text-on-surface-variant uppercase mb-1">
                  Terroir / Location
                </label>
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DFD5] bg-[#FAF8F5] focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-primary-container text-white font-title-md text-sm rounded-xl shadow-sm hover:bg-[#163b2a] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span className="material-symbols-outlined text-sm">add_circle</span>
                <span>{submitting ? 'Registering...' : 'Register Batch in Firestore'}</span>
              </button>
            </form>
          </section>
        )}

        {/* TAB 2: ADD PROVENANCE EVENT */}
        {activeTab === 'provenance' && (
          <section className="bg-surface-container-lowest rounded-2xl p-5 border border-[#E6DFD5] shadow-sm space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-title-lg text-primary">Append Provenance Event</h3>
                <span className="font-code-telemetry text-xs text-primary font-bold">{currentBatch.batchId}</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Records are cryptographically hashed and sequenced chronologically.
              </p>
            </div>

            <form onSubmit={handleAddProvenance} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-label-caps text-on-surface-variant uppercase mb-1">
                    Event Type
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DFD5] bg-[#FAF8F5] focus:outline-none focus:border-primary"
                  >
                    <option value="BLOOM">Bloom &amp; Nectar Flow</option>
                    <option value="TELEMETRY">Telemetry Lock</option>
                    <option value="HARVEST">Dawn Apiary Harvest</option>
                    <option value="EXTRACTION">Cold Extraction</option>
                    <option value="LAB_ACCREDITATION">Lab Testing Verified</option>
                    <option value="PACKAGING">Packaging &amp; Tamper Seal</option>
                    <option value="CUSTOM">Custom Supply Chain Milestone</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-label-caps text-on-surface-variant uppercase mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="e.g. Processing Unit AP-01"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DFD5] bg-[#FAF8F5] focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-label-caps text-on-surface-variant uppercase mb-1">
                  Event Description &amp; Verification Observations
                </label>
                <textarea
                  required
                  rows={3}
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="e.g. Unheated cold extraction completed at 28.5°C using sterile stainless equipment..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DFD5] bg-[#FAF8F5] focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-label-caps text-on-surface-variant uppercase mb-1">
                  Evidence / Log Reference Code
                </label>
                <input
                  type="text"
                  value={eventDocRef}
                  onChange={(e) => setEventDocRef(e.target.value)}
                  placeholder="e.g. PROC-LOG-GNT-994"
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E6DFD5] bg-[#FAF8F5] focus:outline-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-primary-container text-white font-title-md text-sm rounded-xl shadow-sm hover:bg-[#163b2a] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span className="material-symbols-outlined text-sm">history_edu</span>
                <span>{submitting ? 'Appending...' : 'Append to Immutable Ledger'}</span>
              </button>
            </form>
          </section>
        )}

        {/* TAB 3: LAB EVIDENCE UPLOAD */}
        {activeTab === 'lab_upload' && (
          <section className="bg-surface-container-lowest rounded-2xl p-5 border border-[#E6DFD5] shadow-sm space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-title-lg text-primary">Biochemical Assay &amp; Certificate</h3>
                <span className="font-code-telemetry text-xs text-primary font-bold">{currentBatch.batchId}</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Upload laboratory test document and register biochemical parameters.
              </p>
            </div>

            <form onSubmit={handleUploadLabEvidence} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-label-caps text-on-surface-variant uppercase mb-1">
                    Certificate ID
                  </label>
                  <input
                    type="text"
                    required
                    value={labReportId}
                    onChange={(e) => setLabReportId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#E6DFD5] bg-[#FAF8F5] focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-label-caps text-on-surface-variant uppercase mb-1">
                    Overall Assay Status
                  </label>
                  <select
                    value={labStatus}
                    onChange={(e) => setLabStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#E6DFD5] bg-[#FAF8F5] focus:outline-none focus:border-primary font-bold text-primary"
                  >
                    <option value="passed">PASSED (Pristine Pure)</option>
                    <option value="failed">FAILED (Flagged Adulteration)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-label-caps text-on-surface-variant uppercase mb-1">
                    C4 Sugar (EA-IRMS)
                  </label>
                  <input
                    type="text"
                    value={c4Sugar}
                    onChange={(e) => setC4Sugar(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs font-mono rounded-lg border border-[#E6DFD5] bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-label-caps text-on-surface-variant uppercase mb-1">
                    Diastase (DN)
                  </label>
                  <input
                    type="text"
                    value={diastase}
                    onChange={(e) => setDiastase(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs font-mono rounded-lg border border-[#E6DFD5] bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-label-caps text-on-surface-variant uppercase mb-1">
                    HMF (mg/kg)
                  </label>
                  <input
                    type="text"
                    value={hmf}
                    onChange={(e) => setHmf(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs font-mono rounded-lg border border-[#E6DFD5] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-label-caps text-on-surface-variant uppercase mb-1">
                    Moisture Content
                  </label>
                  <input
                    type="text"
                    value={moisture}
                    onChange={(e) => setMoisture(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs font-mono rounded-lg border border-[#E6DFD5] bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-label-caps text-on-surface-variant uppercase mb-1">
                    Floral DNA Purity
                  </label>
                  <input
                    type="text"
                    value={floralDna}
                    onChange={(e) => setFloralDna(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs font-mono rounded-lg border border-[#E6DFD5] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-label-caps text-on-surface-variant uppercase mb-1">
                  Upload Lab Certificate (PDF / Image to Firebase Storage)
                </label>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setFileToUpload(e.target.files?.[0] || null)}
                  className="w-full text-xs text-on-surface-variant file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-fixed file:text-on-primary-fixed hover:file:bg-[#adceb9]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-primary-container text-white font-title-md text-sm rounded-xl shadow-sm hover:bg-[#163b2a] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span className="material-symbols-outlined text-sm">science</span>
                <span>{submitting ? 'Certifying...' : 'Certify & Save to Blockchain'}</span>
              </button>
            </form>
          </section>
        )}

        {/* TAB 4: QR CODE & PUBLIC VERIFICATION */}
        {activeTab === 'qr_manage' && (
          <section className="bg-surface-container-lowest rounded-2xl p-5 border border-[#E6DFD5] shadow-sm space-y-4 text-center">
            <div>
              <h3 className="font-title-lg text-primary">Unique Batch QR Verification</h3>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Public verification URL for batch <span className="font-mono font-bold text-primary">{currentBatch.batchId}</span>
              </p>
            </div>

            {/* Generated QR View */}
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E6DFD5] inline-block mx-auto space-y-3">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  `${window.location.origin}/verify/${currentBatch.batchId}`
                )}`}
                alt={`QR code for ${currentBatch.batchId}`}
                className="w-44 h-44 mx-auto rounded-lg border border-[#E6DFD5] shadow-xs"
              />
              <div className="font-mono text-xs font-bold text-primary">{currentBatch.batchId}</div>
              <div className="font-body-sm text-[11px] text-on-surface-variant">
                URL: {window.location.origin}/verify/{currentBatch.batchId}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(`${window.location.origin}/verify/${currentBatch.batchId}`);
                  notifySuccess('Verification link copied!');
                }}
                className="py-2.5 px-3 bg-surface-container-lowest border border-[#E6DFD5] rounded-xl font-medium hover:bg-[#FAF8F5] flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
                <span>Copy Verify Link</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('product-passport')}
                className="py-2.5 px-3 bg-primary-container text-white rounded-xl font-medium hover:bg-[#163b2a] flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">menu_book</span>
                <span>Test Consumer Passport</span>
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Docked Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#E6DFD5] max-w-screen-md mx-auto">
        <button
          type="button"
          onClick={() => onNavigate('qr-scanner')}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 transition-all hover:text-primary active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined mb-0.5">qr_code_scanner</span>
          <span className="font-label-caps text-label-caps">Scan Bottle</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('verification')}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 transition-all hover:text-primary active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined mb-0.5">verified</span>
          <span className="font-label-caps text-label-caps">Attestation</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('product-passport')}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1.5 transition-all hover:text-primary active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined mb-0.5">menu_book</span>
          <span className="font-label-caps text-label-caps">Passport</span>
        </button>
      </nav>
    </div>
  );
};
