import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, name: string, role: UserRole, organization?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  switchDemoRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Quick Demo accounts mapping for seamless role switching
export const DEMO_USERS: Record<UserRole, { email: string; pass: string; name: string; org: string; reg?: string }> = {
  beekeeper: {
    email: 'ramesh@nallamala-honey.org',
    pass: 'beekeeper123',
    name: 'S. Ramesh',
    org: 'Nallamala Tribal Honey Cooperative',
    reg: 'Tribal Cooperative Society Reg #TCS-884',
  },
  laboratory_officer: {
    email: 'anita.roy@eurofins-agri.com',
    pass: 'labofficer123',
    name: 'Dr. Anita Roy',
    org: 'Eurofins Agri-Testing Bangalore (ISO/IEC 17025)',
    reg: 'ISO/IEC 17025:2017 Lead Analyst',
  },
  processor: {
    email: 'sunil.verma@honeychain-processors.in',
    pass: 'processor123',
    name: 'Sunil Verma',
    org: 'HoneyChain Cold Extraction & Bottling AP-01',
    reg: 'FSSAI License #10020042000192',
  },
  admin: {
    email: 'admin@honeychain.io',
    pass: 'admin123456',
    name: 'Admin Overseer',
    org: 'HoneyChain Decentralized Consortium',
  },
  consumer: {
    email: 'consumer@honeychain.io',
    pass: 'consumer123',
    name: 'Verified Consumer',
    org: 'Public Botanical Honey Consumer',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profileDoc = await getDoc(doc(db, 'users', user.uid));
          if (profileDoc.exists()) {
            setUserProfile(profileDoc.data() as UserProfile);
          } else {
            // Auto fallback profile if doc missing
            const fallback: UserProfile = {
              uid: user.uid,
              email: user.email || 'user@honeychain.io',
              displayName: user.displayName || user.email?.split('@')[0] || 'User',
              role: 'consumer',
              createdAt: new Date().toISOString(),
            };
            await setDoc(doc(db, 'users', user.uid), fallback);
            setUserProfile(fallback);
          }
        } catch (err) {
          console.warn('Profile fetch warning:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const snap = await getDoc(doc(db, 'users', cred.user.uid));
    if (snap.exists()) {
      setUserProfile(snap.data() as UserProfile);
    }
  };

  const signUp = async (email: string, pass: string, name: string, role: UserRole, organization?: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const profile: UserProfile = {
      uid: cred.user.uid,
      email,
      displayName: name,
      role,
      organization: organization || '',
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', cred.user.uid), profile);
    setUserProfile(profile);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const user = cred.user;
    const profileDoc = await getDoc(doc(db, 'users', user.uid));
    if (profileDoc.exists()) {
      setUserProfile(profileDoc.data() as UserProfile);
    } else {
      const isAdminEmail = user.email === 'admin@honeychain.io' || user.email === 'mansoorpattan2@gmail.com';
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || 'user@honeychain.io',
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        role: isAdminEmail ? 'admin' : 'consumer',
        organization: isAdminEmail ? 'HoneyChain Administrator' : 'HoneyChain Verified Member',
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', user.uid), newProfile);
      setUserProfile(newProfile);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUserProfile(null);
  };

  // Instant demo switcher for evaluation / user exploration
  const switchDemoRole = async (role: UserRole) => {
    const target = DEMO_USERS[role];
    try {
      await signIn(target.email, target.pass);
    } catch {
      // If doesn't exist yet, create it seamlessly
      try {
        await signUp(target.email, target.pass, target.name, role, target.org);
      } catch (e) {
        console.error('Demo switch creation error:', e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
