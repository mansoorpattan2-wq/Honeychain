export type Screen =
  | 'qr-scanner'
  | 'honey-journey'
  | 'verification'
  | 'product-passport'
  | 'lab-evidence'
  | 'auth'
  | 'dashboard';

export type UserRole = 'beekeeper' | 'laboratory_officer' | 'processor' | 'admin' | 'consumer';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  organization?: string;
  registrationNumber?: string;
  createdAt: string;
}

export interface HiveItem {
  hiveId: string;
  name: string;
  beekeeperUid: string;
  beekeeperName: string;
  locationName: string;
  coordinates: string;
  status: 'active' | 'harvested' | 'dormant';
  createdAt: string;
}

export interface SensorReadingItem {
  readingId: string;
  hiveId: string;
  timestamp: string;
  broodTemp: string;
  humidity: string;
  queenAcoustics: string;
  pressure: string;
  recordedBy?: string;
}

export interface BatchInfo {
  batchId: string;
  uniqueId: string;
  honeyType: string;
  productName: string;
  vesselSize: string;
  beekeeper: string;
  beekeeperUid?: string;
  beekeeperReg: string;
  beekeeperQuote: string;
  hiveId: string;
  harvestDate: string;
  location: string;
  coordinates: string;
  quantity: string;
  labStatus: 'pending' | 'verified' | 'rejected';
  processingStatus: 'harvested' | 'extracted' | 'filtered' | 'bottled';
  packagingStatus: 'unsealed' | 'sealed_tamper_evident';
  verificationStatus: 'pending' | 'verified' | 'flagged';
  labCertificateId: string;
  testingLab: string;
  nfcTag: string;
  rootHash: string;
  blockNumber: string;
  blockTimestamp: string;
  createdAt: string;
  updatedAt: string;
  metrics: {
    c4Sugar: string;
    diastase: string;
    hmf: string;
    floralDna: string;
    moisture: string;
    broodTemp: string;
    humidity: string;
    queenAcoustics: string;
    pressure: string;
  };
}

export interface LabReportItem {
  reportId: string;
  batchId: string;
  labName: string;
  analystUid?: string;
  accreditation: string;
  sampleId: string;
  sampleReceivedDate: string;
  verifiedReleasedDate: string;
  status: 'passed' | 'failed';
  c4Sugar: string;
  diastase: string;
  hmf: string;
  floralDna: string;
  moisture: string;
  documentUrl?: string;
  documentName?: string;
  digitalSignatureHash: string;
  createdAt: string;
}

export interface ProcessingRecordItem {
  recordId: string;
  batchId: string;
  facility: string;
  processorUid?: string;
  extractionTemp: string;
  method: string;
  pasteurized: boolean;
  timestamp: string;
  notes?: string;
}

export interface PackagingRecordItem {
  recordId: string;
  batchId: string;
  facility: string;
  bottlerUid?: string;
  nfcTagId: string;
  vesselBatch: string;
  totalUnits: number;
  timestamp: string;
}

export interface ProvenanceEventItem {
  eventId: string;
  batchId: string;
  eventType: 'BLOOM' | 'TELEMETRY' | 'HARVEST' | 'EXTRACTION' | 'LAB_ACCREDITATION' | 'PACKAGING' | 'CUSTOM';
  actor: string;
  actorUid?: string;
  actorRole?: string;
  timestamp: string;
  location: string;
  description: string;
  evidenceReference?: string;
  hash: string;
}

export interface VerificationRecordItem {
  verificationId: string;
  batchId: string;
  timestamp: string;
  clientType: string;
  status: string;
}

// Default demonstration batch matching user brief: HNY-2026-0001
export const DEFAULT_BATCH: BatchInfo = {
  batchId: 'HNY-2026-0001',
  uniqueId: 'HNC-7F4A-91D2-AX04',
  honeyType: 'Wild Forest Raw Honey',
  productName: 'Wild Forest Honey',
  vesselSize: '500 g Artisanal Glass Vessel',
  beekeeper: 'S. Ramesh',
  beekeeperReg: 'Tribal Cooperative Society Reg #TCS-884',
  beekeeperQuote: 'Hand-harvested using brush-off methods without chemical repellents or smoker agitation.',
  hiveId: 'HIVE-AP-0042',
  harvestDate: '18 Sep 2026 • 06:42 IST',
  location: 'Nallamala Forest edge, Andhra Pradesh',
  coordinates: '15.8281° N, 78.8682° E',
  quantity: '120 kg (240 Jars)',
  labStatus: 'verified',
  processingStatus: 'bottled',
  packagingStatus: 'sealed_tamper_evident',
  verificationStatus: 'verified',
  labCertificateId: 'EUR-IND-2026-991',
  testingLab: 'Eurofins Agri-Testing Lab, Bangalore (ISO/IEC 17025 Accredited Ref #EUR-9948)',
  nfcTag: 'Hex #26A9-E',
  rootHash: 'SHA-256: 91e63a87f2b58d99c43b8210fec18a7ac2',
  blockNumber: '#4,921,804',
  blockTimestamp: '18 Sep 2026, 06:42:19 IST',
  createdAt: '2026-09-18T06:42:00Z',
  updatedAt: '2026-09-20T17:52:00Z',
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
