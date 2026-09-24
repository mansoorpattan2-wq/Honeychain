import React, { useState } from 'react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { UserRole, Screen } from '../types';

interface AuthScreenProps {
  onNavigate: (screen: Screen) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onNavigate }) => {
  const { currentUser, userProfile, signIn, signUp, signInWithGoogle, signOut, switchDemoRole } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('beekeeper');
  const [organization, setOrganization] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      onNavigate('dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      if (isRegister) {
        await signUp(email, password, displayName, role, organization);
      } else {
        await signIn(email, password);
      }
      onNavigate('dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = async (selectedRole: UserRole) => {
    setErrorMsg(null);
    setLoading(true);
    try {
      await switchDemoRole(selectedRole);
      onNavigate('dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Demo role switch failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF8F5] text-on-surface antialiased min-h-screen pb-28 max-w-screen-md mx-auto shadow-sm border-x border-[#E6DFD5]/40 flex flex-col">
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
          <span className="font-label-caps text-label-caps text-on-surface-variant text-[10px] tracking-widest">
            AUTHENTICATION &amp; ROLES
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
      <main className="max-w-screen-md mx-auto pt-20 px-4 space-y-6 flex-1 w-full">
        {/* Hero Section */}
        <section className="text-center pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed/40 border border-[#E6DFD5] text-on-primary-fixed mb-2">
            <span className="material-symbols-outlined text-sm text-primary">security</span>
            <span className="font-label-caps text-label-caps uppercase">
              ROLE-BASED SUPPLY CHAIN ACCESS
            </span>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary font-medium tracking-tight">
            {currentUser ? 'Authenticated HoneyChain Node' : isRegister ? 'Register Node Account' : 'Supply Chain Login'}
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mx-auto mt-1">
            Access authorized dashboards for beekeepers, accredited laboratories, cold processors, and consortium admins.
          </p>
        </section>

        {/* Current User Card if already signed in */}
        {currentUser && userProfile && (
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-[#E6DFD5] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-container text-white flex items-center justify-center font-bold text-lg">
                  {userProfile.displayName?.[0] || 'U'}
                </div>
                <div>
                  <h3 className="font-title-md text-primary">{userProfile.displayName}</h3>
                  <p className="font-body-sm text-on-surface-variant">{userProfile.email}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-secondary-fixed text-on-secondary-fixed rounded-full text-xs font-label-caps uppercase font-bold">
                {userProfile.role.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                className="py-2.5 px-4 bg-primary-container text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#163b2a]"
              >
                <span className="material-symbols-outlined text-sm">dashboard</span>
                <span>Open Dashboard</span>
              </button>
              <button
                type="button"
                onClick={() => signOut()}
                className="py-2.5 px-4 bg-surface-container-lowest border border-[#E6DFD5] text-error rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-error-container/20"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Demo Role Switcher (Crucial for Reviewers & Testing) */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 border border-[#E6DFD5] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-secondary font-bold uppercase">
              QUICK ROLE SWITCHER (ONE-CLICK DEMO)
            </span>
            <span className="font-code-telemetry text-code-telemetry text-on-surface-variant text-[11px]">
              Ready Credentials
            </span>
          </div>
          <p className="font-body-sm text-xs text-on-surface-variant">
            Click any role below to instantly log in as that supply-chain participant with tailored permissions:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Beekeeper */}
            <button
              type="button"
              onClick={() => handleDemoSelect('beekeeper')}
              disabled={loading}
              className="p-3 bg-[#FAF8F5] border border-[#E6DFD5] hover:border-secondary rounded-xl text-left flex items-start gap-2.5 transition-all active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined text-secondary text-xl">hive</span>
              <div>
                <div className="font-title-md text-xs text-primary font-bold">Beekeeper (S. Ramesh)</div>
                <div className="font-body-sm text-[11px] text-on-surface-variant">Register batches &amp; harvest info</div>
              </div>
            </button>

            {/* Lab Officer */}
            <button
              type="button"
              onClick={() => handleDemoSelect('laboratory_officer')}
              disabled={loading}
              className="p-3 bg-[#FAF8F5] border border-[#E6DFD5] hover:border-secondary rounded-xl text-left flex items-start gap-2.5 transition-all active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined text-secondary text-xl">science</span>
              <div>
                <div className="font-title-md text-xs text-primary font-bold">Lab Officer (Dr. Anita Roy)</div>
                <div className="font-body-sm text-[11px] text-on-surface-variant">Upload assays &amp; certificate files</div>
              </div>
            </button>

            {/* Processor */}
            <button
              type="button"
              onClick={() => handleDemoSelect('processor')}
              disabled={loading}
              className="p-3 bg-[#FAF8F5] border border-[#E6DFD5] hover:border-secondary rounded-xl text-left flex items-start gap-2.5 transition-all active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined text-secondary text-xl">precision_manufacturing</span>
              <div>
                <div className="font-title-md text-xs text-primary font-bold">Processor (Sunil Verma)</div>
                <div className="font-body-sm text-[11px] text-on-surface-variant">Cold extraction &amp; NFC bottling</div>
              </div>
            </button>

            {/* Admin */}
            <button
              type="button"
              onClick={() => handleDemoSelect('admin')}
              disabled={loading}
              className="p-3 bg-[#FAF8F5] border border-[#E6DFD5] hover:border-secondary rounded-xl text-left flex items-start gap-2.5 transition-all active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined text-secondary text-xl">admin_panel_settings</span>
              <div>
                <div className="font-title-md text-xs text-primary font-bold">Consortium Admin</div>
                <div className="font-body-sm text-[11px] text-on-surface-variant">Full ledger oversight &amp; rules</div>
              </div>
            </button>
          </div>
        </div>

        {/* Email / Password Form */}
        <div className="bg-surface-container-lowest rounded-2xl p-5 border border-[#E6DFD5] shadow-sm space-y-4">
          {/* Continue with Google */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#FAF8F5] border border-[#E6DFD5] hover:border-primary text-on-surface font-title-md text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-[0.99]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span className="text-primary font-medium">Continue with Google Account</span>
          </button>

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-[#E6DFD5] w-full"></div>
            <span className="bg-surface-container-lowest px-3 text-[10px] text-on-surface-variant font-code-telemetry uppercase tracking-wider absolute">
              or supply chain credentials
            </span>
          </div>

          <div className="flex border-b border-[#E6DFD5] pb-2">
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-1.5 text-center font-title-md text-sm border-b-2 transition-all ${
                !isRegister ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-1.5 text-center font-title-md text-sm border-b-2 transition-all ${
                isRegister ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant'
              }`}
            >
              Register New Actor
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-error-container/30 border border-error text-error text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-label-caps text-on-surface-variant uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. S. Ramesh"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#E6DFD5] bg-[#FAF8F5] focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-label-caps text-on-surface-variant uppercase mb-1">
                    Supply Chain Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#E6DFD5] bg-[#FAF8F5] focus:outline-none focus:border-primary"
                  >
                    <option value="beekeeper">Beekeeper</option>
                    <option value="laboratory_officer">Laboratory Officer</option>
                    <option value="processor">Honey Processor</option>
                    <option value="admin">System Admin</option>
                    <option value="consumer">Consumer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-label-caps text-on-surface-variant uppercase mb-1">
                    Organization / Cooperative
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Nallamala Tribal Society"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-[#E6DFD5] bg-[#FAF8F5] focus:outline-none focus:border-primary"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-label-caps text-on-surface-variant uppercase mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="actor@honeychain.io"
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#E6DFD5] bg-[#FAF8F5] focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-label-caps text-on-surface-variant uppercase mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 text-sm rounded-xl border border-[#E6DFD5] bg-[#FAF8F5] focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-container text-white font-title-md text-sm rounded-xl shadow-sm hover:bg-[#163b2a] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{isRegister ? 'Register Account' : 'Authenticate Credentials'}</span>
                  <span className="material-symbols-outlined text-sm">lock_open</span>
                </>
              )}
            </button>
          </form>
        </div>
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
