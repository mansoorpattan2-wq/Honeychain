/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Screen } from './types';
import { AuthProvider } from './context/AuthContext';
import { BatchProvider, useBatch } from './context/BatchContext';
import { QRScannerScreen } from './screens/QRScannerScreen';
import { CompleteHoneyJourneyScreen } from './screens/CompleteHoneyJourneyScreen';
import { VerificationScreen } from './screens/VerificationScreen';
import { ProductPassportScreen } from './screens/ProductPassportScreen';
import { LaboratoryEvidenceScreen } from './screens/LaboratoryEvidenceScreen';
import { AuthScreen } from './screens/AuthScreen';
import { RoleDashboardScreen } from './screens/RoleDashboardScreen';

function AppNavigation() {
  // Initial Screen: HoneyChain — QR Scanner (matching prototype spec)
  const [currentScreen, setCurrentScreen] = useState<Screen>('qr-scanner');
  const [transitionDir, setTransitionDir] = useState<'forward' | 'back' | 'none'>('none');
  const { selectBatch } = useBatch();

  const handleNavigate = (nextScreen: Screen) => {
    // Determine transition direction based on prototype navigation semantics
    if (
      (currentScreen === 'honey-journey' && nextScreen === 'product-passport') ||
      (currentScreen === 'verification' && nextScreen === 'qr-scanner') ||
      (currentScreen === 'product-passport' && nextScreen === 'qr-scanner') ||
      (currentScreen === 'lab-evidence' && nextScreen === 'product-passport') ||
      (currentScreen === 'dashboard' && nextScreen === 'qr-scanner') ||
      (currentScreen === 'auth' && nextScreen === 'qr-scanner')
    ) {
      setTransitionDir('back');
    } else {
      setTransitionDir('forward');
    }

    setCurrentScreen(nextScreen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Synchronize deep-links and QR verification URL parsing: /verify/<batchId> or #verify/<batchId>
  useEffect(() => {
    const handleUrlRouting = async () => {
      // 1. Check path (e.g. /verify/HNY-2026-0001)
      const pathname = window.location.pathname;
      const verifyMatch = pathname.match(/\/verify\/([A-Za-z0-9_-]+)/);
      if (verifyMatch && verifyMatch[1]) {
        const batchId = verifyMatch[1];
        await selectBatch(batchId);
        setCurrentScreen('product-passport');
        return;
      }

      // 2. Check hash (e.g. #/verify/HNY-2026-0001 or #verify/HNY-2026-0001)
      const hash = window.location.hash.toLowerCase();
      const hashVerifyMatch = window.location.hash.match(/#\/?verify\/([A-Za-z0-9_-]+)/i);
      if (hashVerifyMatch && hashVerifyMatch[1]) {
        const batchId = hashVerifyMatch[1];
        await selectBatch(batchId);
        setCurrentScreen('product-passport');
        return;
      }

      if (hash === '#scan') setCurrentScreen('qr-scanner');
      else if (hash === '#journey') setCurrentScreen('honey-journey');
      else if (hash === '#attestation') setCurrentScreen('verification');
      else if (hash === '#passport') setCurrentScreen('product-passport');
      else if (hash === '#lab' || hash === '#evidence') setCurrentScreen('lab-evidence');
      else if (hash === '#auth' || hash === '#login') setCurrentScreen('auth');
      else if (hash === '#dashboard') setCurrentScreen('dashboard');
    };

    handleUrlRouting();
    window.addEventListener('hashchange', handleUrlRouting);
    return () => window.removeEventListener('hashchange', handleUrlRouting);
  }, [selectBatch]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#111C2D] font-sans antialiased overflow-x-hidden selection:bg-secondary/20">
      <div
        key={currentScreen}
        className={`w-full transition-opacity duration-200 ${
          transitionDir === 'back'
            ? 'animate-in fade-in slide-in-from-left-4'
            : transitionDir === 'forward'
            ? 'animate-in fade-in slide-in-from-right-4'
            : ''
        }`}
      >
        {currentScreen === 'qr-scanner' && (
          <QRScannerScreen onNavigate={handleNavigate} />
        )}
        {currentScreen === 'honey-journey' && (
          <CompleteHoneyJourneyScreen onNavigate={handleNavigate} />
        )}
        {currentScreen === 'verification' && (
          <VerificationScreen onNavigate={handleNavigate} />
        )}
        {currentScreen === 'product-passport' && (
          <ProductPassportScreen onNavigate={handleNavigate} />
        )}
        {currentScreen === 'lab-evidence' && (
          <LaboratoryEvidenceScreen onNavigate={handleNavigate} />
        )}
        {currentScreen === 'auth' && (
          <AuthScreen onNavigate={handleNavigate} />
        )}
        {currentScreen === 'dashboard' && (
          <RoleDashboardScreen onNavigate={handleNavigate} />
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BatchProvider>
        <AppNavigation />
      </BatchProvider>
    </AuthProvider>
  );
}
