import React, { createContext, useContext, useState, useEffect } from 'react';
import { BatchInfo, DEFAULT_BATCH, ProvenanceEventItem, LabReportItem } from '../types';
import {
  getHoneyBatch,
  getProvenanceEventsForBatch,
  getLabReportForBatch,
  seedDemoDataIfNeeded,
  getAllHoneyBatches
} from '../services/honeyChainService';

interface BatchContextType {
  currentBatch: BatchInfo;
  allBatches: BatchInfo[];
  provenanceEvents: ProvenanceEventItem[];
  labReport: LabReportItem | null;
  loading: boolean;
  error: string | null;
  selectBatch: (batchId: string) => Promise<boolean>;
  refreshBatchData: () => Promise<void>;
}

const BatchContext = createContext<BatchContextType | undefined>(undefined);

export const BatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentBatch, setCurrentBatch] = useState<BatchInfo>(DEFAULT_BATCH);
  const [allBatches, setAllBatches] = useState<BatchInfo[]>([DEFAULT_BATCH]);
  const [provenanceEvents, setProvenanceEvents] = useState<ProvenanceEventItem[]>([]);
  const [labReport, setLabReport] = useState<LabReportItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize and seed demo data on app startup
  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        await seedDemoDataIfNeeded();
        // Load initial primary demonstration batch HNY-2026-0001
        const b = await getHoneyBatch('HNY-2026-0001');
        const list = await getAllHoneyBatches();
        const evts = await getProvenanceEventsForBatch('HNY-2026-0001');
        const rep = await getLabReportForBatch('HNY-2026-0001');

        if (mounted) {
          if (b) setCurrentBatch(b);
          setAllBatches(list);
          setProvenanceEvents(evts);
          setLabReport(rep);
        }
      } catch (err: any) {
        console.error('Batch initialization error:', err);
        if (mounted) setError(err.message || 'Failed to sync with HoneyChain network');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  const selectBatch = async (batchId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const b = await getHoneyBatch(batchId);
      if (b) {
        setCurrentBatch(b);
        const [evts, rep] = await Promise.all([
          getProvenanceEventsForBatch(batchId),
          getLabReportForBatch(batchId),
        ]);
        setProvenanceEvents(evts);
        setLabReport(rep);
        setLoading(false);
        return true;
      } else {
        setError(`Batch "${batchId}" not found in cryptographic registry.`);
        setLoading(false);
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Error loading batch from ledger');
      setLoading(false);
      return false;
    }
  };

  const refreshBatchData = async () => {
    if (!currentBatch.batchId) return;
    try {
      const [b, list, evts, rep] = await Promise.all([
        getHoneyBatch(currentBatch.batchId),
        getAllHoneyBatches(),
        getProvenanceEventsForBatch(currentBatch.batchId),
        getLabReportForBatch(currentBatch.batchId),
      ]);
      if (b) setCurrentBatch(b);
      setAllBatches(list);
      setProvenanceEvents(evts);
      setLabReport(rep);
    } catch (err) {
      console.warn('Batch refresh error:', err);
    }
  };

  return (
    <BatchContext.Provider
      value={{
        currentBatch,
        allBatches,
        provenanceEvents,
        labReport,
        loading,
        error,
        selectBatch,
        refreshBatchData,
      }}
    >
      {children}
    </BatchContext.Provider>
  );
};

export const useBatch = () => {
  const context = useContext(BatchContext);
  if (!context) {
    throw new Error('useBatch must be used within a BatchProvider');
  }
  return context;
};
