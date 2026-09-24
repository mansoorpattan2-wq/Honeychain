import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase';
import {
  BatchInfo,
  UserProfile,
  ProvenanceEventItem,
  LabReportItem,
  ProcessingRecordItem,
  PackagingRecordItem,
  SensorReadingItem,
  HiveItem,
  DEFAULT_BATCH
} from '../types';

// ==========================================
// ERROR HANDLING (Firebase Standardized Schema)
// ==========================================
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// ==========================================
// SEEDING SERVICE
// ==========================================
export const DEMO_BATCHES: BatchInfo[] = [
  DEFAULT_BATCH,
  {
    batchId: 'HNY-2026-0002',
    uniqueId: 'HNC-8B2C-33F1-NY02',
    honeyType: 'Kashmir Acacia Raw Monofloral',
    productName: 'Kashmir White Acacia Honey',
    vesselSize: '450 g Hexagonal Glass Jar',
    beekeeper: 'Farooq Mir',
    beekeeperReg: 'Himalayan Organic Apiary Society #HOAS-219',
    beekeeperQuote: 'Transhumant valley hives nurtured amidst high-altitude white robinia blooms in Pahalgam.',
    hiveId: 'HIVE-KSH-0108',
    harvestDate: '02 Aug 2026 • 07:15 IST',
    location: 'Lidder Valley Canopy, Jammu & Kashmir',
    coordinates: '34.0152° N, 75.3168° E',
    quantity: '95 kg (210 Jars)',
    labStatus: 'verified',
    processingStatus: 'bottled',
    packagingStatus: 'sealed_tamper_evident',
    verificationStatus: 'verified',
    labCertificateId: 'EUR-IND-2026-784',
    testingLab: 'Eurofins Agri-Testing Lab, New Delhi (ISO/IEC 17025 Accredited Ref #EUR-8821)',
    nfcTag: 'Hex #19BC-K',
    rootHash: 'SHA-256: 4a9d7211fc5e9821db28394af983c21a44e',
    blockNumber: '#4,912,019',
    blockTimestamp: '02 Aug 2026, 07:22:10 IST',
    createdAt: '2026-08-02T07:15:00Z',
    updatedAt: '2026-08-05T14:10:00Z',
    metrics: {
      c4Sugar: '0.00%',
      diastase: '17.2 DN',
      hmf: '3.1 mg/kg',
      floralDna: '96.2%',
      moisture: '16.4%',
      broodTemp: '32.1°C',
      humidity: '58.2%',
      queenAcoustics: '235 Hz',
      pressure: '890 hPa',
    },
  },
  {
    batchId: 'HNY-2026-0003',
    uniqueId: 'HNC-91D0-449A-WB03',
    honeyType: 'Sundarbans Mangrove Multi-floral Wild Honey',
    productName: 'Sundarbans Mangrove Wild Honey',
    vesselSize: '500 g Artisanal Glass Vessel',
    beekeeper: 'S. Ramesh',
    beekeeperReg: 'Tribal Cooperative Society Reg #TCS-884',
    beekeeperQuote: 'Sustainably collected with the Sundarbans forest protection committee during Khalisa bloom.',
    hiveId: 'HIVE-SBN-0021',
    harvestDate: '12 Sep 2026 • 05:50 IST',
    location: 'Sundarbans Biosphere Reserve, West Bengal',
    coordinates: '21.9497° N, 89.1833° E',
    quantity: '180 kg (360 Jars)',
    labStatus: 'pending',
    processingStatus: 'extracted',
    packagingStatus: 'unsealed',
    verificationStatus: 'pending',
    labCertificateId: 'EUR-IND-2026-Pending',
    testingLab: 'Eurofins Agri-Testing Lab, Bangalore (Assay in process)',
    nfcTag: 'Hex #993A-S',
    rootHash: 'SHA-256: 82df1099ba4201cd9918237fcab0192e44',
    blockNumber: '#4,920,110',
    blockTimestamp: '12 Sep 2026, 06:12:00 IST',
    createdAt: '2026-09-12T05:50:00Z',
    updatedAt: '2026-09-14T09:30:00Z',
    metrics: {
      c4Sugar: '0.00%',
      diastase: '21.0 DN',
      hmf: '5.4 mg/kg',
      floralDna: '88.9%',
      moisture: '18.2%',
      broodTemp: '30.8°C',
      humidity: '68.4%',
      queenAcoustics: '222 Hz',
      pressure: '1008 hPa',
    },
  },
];

export const DEMO_PROVENANCE_EVENTS: ProvenanceEventItem[] = [
  {
    eventId: 'EVT-001',
    batchId: 'HNY-2026-0001',
    eventType: 'BLOOM',
    actor: 'Tribal Forestry Monitor',
    actorRole: 'Ecological Observer',
    timestamp: '28 Aug 2026 • 08:00 IST',
    location: 'Nallamala Forest Canopy',
    description: 'Wild Neem & Mahua blossom peak nectar flow documented in foraging surveillance logs.',
    evidenceReference: 'BIO-OBS-2026-NLL-04',
    hash: 'SHA-256: 7f81b99a...32c1',
  },
  {
    eventId: 'EVT-002',
    batchId: 'HNY-2026-0001',
    eventType: 'TELEMETRY',
    actor: 'Smart Hive IoT Mesh (Autonomous)',
    actorRole: 'IoT Node #04',
    timestamp: '18 Sep 2026 • 06:00 IST',
    location: 'Apiary Station AP-42',
    description: 'Autonomous sensor equilibrium readings sealed: Brood 31.4°C, Humidity 61.8%, Acoustics 228Hz.',
    evidenceReference: 'IOT-TELEMETRY-HIVE-0042',
    hash: 'SHA-256: b20194cf...19a2',
  },
  {
    eventId: 'EVT-003',
    batchId: 'HNY-2026-0001',
    eventType: 'HARVEST',
    actor: 'S. Ramesh',
    actorRole: 'Master Beekeeper',
    timestamp: '18 Sep 2026 • 06:42 IST',
    location: 'Nallamala Forest Edge, AP',
    description: 'Brush-off dawn harvest completed without smoke agitation or chemical repellents.',
    evidenceReference: 'HARVEST-REG-TCS-884',
    hash: 'SHA-256: c982310f...44fa',
  },
  {
    eventId: 'EVT-004',
    batchId: 'HNY-2026-0001',
    eventType: 'EXTRACTION',
    actor: 'Sunil Verma (Bioreserve Processing)',
    actorRole: 'Certified Processor',
    timestamp: '19 Sep 2026 • 11:30 IST',
    location: 'Guntur Cold-Processing Facility',
    description: 'Centrifugal cold extraction maintained strictly at 28.5°C. Unheated, raw state preserved.',
    evidenceReference: 'PROC-LOG-GNT-994',
    hash: 'SHA-256: d558291a...88bc',
  },
  {
    eventId: 'EVT-005',
    batchId: 'HNY-2026-0001',
    eventType: 'LAB_ACCREDITATION',
    actor: 'Dr. Anita Roy',
    actorRole: 'Lead Biochemist (Eurofins Scientific)',
    timestamp: '20 Sep 2026 • 17:52 IST',
    location: 'Eurofins Agri-Testing Lab, Bangalore',
    description: 'ISO/IEC 17025 Certificate EUR-IND-2026-991 signed: 0.00% C4 adulteration, 19.4 DN Diastase.',
    evidenceReference: 'EUR-IND-2026-991.pdf',
    hash: 'SHA-256: 91e63a87f2b58d99c43b8210fec18a7ac2',
  },
  {
    eventId: 'EVT-006',
    batchId: 'HNY-2026-0001',
    eventType: 'PACKAGING',
    actor: 'Sunil Verma (HoneyChain Operations)',
    actorRole: 'Packaging Controller',
    timestamp: '21 Sep 2026 • 10:15 IST',
    location: 'Packaging Unit AP-01',
    description: 'Artisanal glass bottles filled, cryptographically serialized, and sealed with NFC Tamper tags.',
    evidenceReference: 'PKG-SEAL-HEX-26A9-E',
    hash: 'SHA-256: fa103982...ee91',
  },
];

export async function seedDemoDataIfNeeded(): Promise<boolean> {
  try {
    const defaultBatchRef = doc(db, 'honeyBatches', 'HNY-2026-0001');
    const snap = await getDoc(defaultBatchRef);

    if (snap.exists()) {
      return false; // Already seeded
    }

    // Seed Batches
    for (const b of DEMO_BATCHES) {
      await setDoc(doc(db, 'honeyBatches', b.batchId), b);
    }

    // Seed Provenance Events
    for (const evt of DEMO_PROVENANCE_EVENTS) {
      await setDoc(doc(db, 'provenanceEvents', evt.eventId), evt);
    }

    // Seed Demo Lab Report
    const demoLabReport: LabReportItem = {
      reportId: 'EUR-IND-2026-991',
      batchId: 'HNY-2026-0001',
      labName: 'Eurofins Agri-Testing Lab, Bangalore',
      accreditation: 'ISO/IEC 17025:2017 Accredited Lab Ref #EUR-9948',
      sampleId: 'SAMPLE-HNC-041',
      sampleReceivedDate: '20 Sep 2026, 09:26 IST',
      verifiedReleasedDate: '20 Sep 2026, 17:52 IST',
      status: 'passed',
      c4Sugar: '0.00%',
      diastase: '19.4 DN',
      hmf: '4.2 mg/kg',
      floralDna: '91.4% Native Forest Flora',
      moisture: '17.8%',
      digitalSignatureHash: 'SHA-256: 91e63a87f2b58d99c43b8210fec18a7ac2',
      createdAt: '2026-09-20T17:52:00Z',
    };
    await setDoc(doc(db, 'labReports', demoLabReport.reportId), demoLabReport);

    // Seed Hives
    const demoHives: HiveItem[] = [
      {
        hiveId: 'HIVE-AP-0042',
        name: 'Nallamala Solar Hive Node #42',
        beekeeperUid: 'beekeeper-ramesh',
        beekeeperName: 'S. Ramesh',
        locationName: 'Nallamala Forest edge, AP',
        coordinates: '15.8281° N, 78.8682° E',
        status: 'active',
        createdAt: '2026-01-15T00:00:00Z',
      },
      {
        hiveId: 'HIVE-KSH-0108',
        name: 'Pahalgam Alpine Hive #108',
        beekeeperUid: 'beekeeper-farooq',
        beekeeperName: 'Farooq Mir',
        locationName: 'Lidder Valley Canopy, J&K',
        coordinates: '34.0152° N, 75.3168° E',
        status: 'active',
        createdAt: '2026-03-10T00:00:00Z',
      },
    ];
    for (const h of demoHives) {
      await setDoc(doc(db, 'hives', h.hiveId), h);
    }

    // Seed Sensor Reading
    const demoSensor: SensorReadingItem = {
      readingId: 'READ-HIVE-0042-01',
      hiveId: 'HIVE-AP-0042',
      timestamp: '18 Sep 2026 • 06:40 IST',
      broodTemp: '31.4°C',
      humidity: '61.8%',
      queenAcoustics: '228 Hz',
      pressure: '1012 hPa',
      recordedBy: 'Smart Sensor Mesh #42',
    };
    await setDoc(doc(db, 'sensorReadings', demoSensor.readingId), demoSensor);

    return true;
  } catch (err) {
    console.warn('Demo data initialization status:', err);
    return false;
  }
}

// ==========================================
// DATA ACCESS & MUTATION FUNCTIONS
// ==========================================

export async function getHoneyBatch(batchId: string): Promise<BatchInfo | null> {
  try {
    const snap = await getDoc(doc(db, 'honeyBatches', batchId));
    if (snap.exists()) {
      return snap.data() as BatchInfo;
    }
  } catch (err: any) {
    console.warn(`Notice accessing batch ${batchId} from Firestore:`, err?.message || err);
  }
  return DEMO_BATCHES.find((b) => b.batchId === batchId) || (batchId === DEFAULT_BATCH.batchId ? DEFAULT_BATCH : null);
}

export async function getAllHoneyBatches(): Promise<BatchInfo[]> {
  try {
    const q = query(collection(db, 'honeyBatches'));
    const snapshot = await getDocs(q);
    const list: BatchInfo[] = [];
    snapshot.forEach((d) => list.push(d.data() as BatchInfo));
    if (list.length > 0) return list;
  } catch (err: any) {
    console.warn('Notice accessing batch list from Firestore:', err?.message || err);
  }
  return DEMO_BATCHES;
}

export async function createHoneyBatch(batch: BatchInfo): Promise<void> {
  try {
    await setDoc(doc(db, 'honeyBatches', batch.batchId), batch);
  } catch (err: any) {
    handleFirestoreError(err, OperationType.CREATE, `honeyBatches/${batch.batchId}`);
  }
}

export async function updateHoneyBatch(batchId: string, updates: Partial<BatchInfo>): Promise<void> {
  try {
    await updateDoc(doc(db, 'honeyBatches', batchId), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    handleFirestoreError(err, OperationType.UPDATE, `honeyBatches/${batchId}`);
  }
}

export async function getProvenanceEventsForBatch(batchId: string): Promise<ProvenanceEventItem[]> {
  try {
    const q = query(
      collection(db, 'provenanceEvents'),
      where('batchId', '==', batchId)
    );
    const snapshot = await getDocs(q);
    const list: ProvenanceEventItem[] = [];
    snapshot.forEach((d) => list.push(d.data() as ProvenanceEventItem));
    if (list.length > 0) return list;
  } catch (err: any) {
    console.warn(`Notice accessing provenance for ${batchId}:`, err?.message || err);
  }
  return DEMO_PROVENANCE_EVENTS.filter((e) => e.batchId === batchId);
}

export async function addProvenanceEvent(event: ProvenanceEventItem): Promise<void> {
  try {
    await setDoc(doc(db, 'provenanceEvents', event.eventId), event);
  } catch (err: any) {
    handleFirestoreError(err, OperationType.CREATE, `provenanceEvents/${event.eventId}`);
  }
}

export async function getLabReportForBatch(batchId: string): Promise<LabReportItem | null> {
  try {
    const q = query(
      collection(db, 'labReports'),
      where('batchId', '==', batchId),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs[0].data() as LabReportItem;
    }
  } catch (err: any) {
    console.warn(`Notice accessing lab report for ${batchId}:`, err?.message || err);
  }
  return batchId === 'HNY-2026-0001'
    ? {
        reportId: 'EUR-IND-2026-991',
        batchId: 'HNY-2026-0001',
        labName: 'Eurofins Agri-Testing Lab, Bangalore',
        accreditation: 'ISO/IEC 17025:2017 Accredited Lab Ref #EUR-9948',
        sampleId: 'SAMPLE-HNC-041',
        sampleReceivedDate: '20 Sep 2026, 09:26 IST',
        verifiedReleasedDate: '20 Sep 2026, 17:52 IST',
        status: 'passed',
        c4Sugar: '0.00%',
        diastase: '19.4 DN',
        hmf: '4.2 mg/kg',
        floralDna: '91.4% Native Forest Flora',
        moisture: '17.8%',
        digitalSignatureHash: 'SHA-256: 91e63a87f2b58d99c43b8210fec18a7ac2',
        createdAt: '2026-09-20T17:52:00Z',
      }
    : null;
}

export async function saveLabReport(report: LabReportItem): Promise<void> {
  try {
    await setDoc(doc(db, 'labReports', report.reportId), report);
    // Also update batch status
    await updateHoneyBatch(report.batchId, {
      labStatus: report.status === 'passed' ? 'verified' : 'rejected',
      labCertificateId: report.reportId,
      testingLab: report.labName,
      verificationStatus: report.status === 'passed' ? 'verified' : 'flagged',
      metrics: {
        c4Sugar: report.c4Sugar,
        diastase: report.diastase,
        hmf: report.hmf,
        floralDna: report.floralDna,
        moisture: report.moisture,
        broodTemp: '31.4°C',
        humidity: '61.8%',
        queenAcoustics: '228 Hz',
        pressure: '1012 hPa',
      },
    });
  } catch (err: any) {
    handleFirestoreError(err, OperationType.WRITE, `labReports/${report.reportId}`);
  }
}

export async function uploadEvidenceDocument(file: File, path: string): Promise<string> {
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}

export async function recordVerificationScan(batchId: string, clientType: string = 'web-consumer'): Promise<void> {
  try {
    const recId = `VER-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await setDoc(doc(db, 'verificationRecords', recId), {
      verificationId: recId,
      batchId,
      timestamp: new Date().toISOString(),
      clientType,
      status: 'CONFIRMED',
    });
  } catch (err) {
    // Non-blocking telemetry
    console.warn('Scan logging skipped:', err);
  }
}
