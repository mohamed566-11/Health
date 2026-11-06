import { UserRole, UserSession } from '../types';
import { readStorage, STORAGE_KEYS, writeStorage } from './storageService';

export const DEMO_ACCOUNTS: Record<UserRole, UserSession> = {
  patient: {
    id: 'pat-1',
    role: 'patient',
    name: 'أحمد محمد',
    phone: '01012345678',
  },
  doctor: {
    id: 'doc-1',
    role: 'doctor',
    name: 'د. أحمد محمود',
    specialty: 'قلب وأوعية دموية (Cardiology)',
    clinicId: 'clinic-1',
  },
  nurse: {
    id: 'nurse-1',
    role: 'nurse',
    name: 'منى إبراهيم',
    clinicId: 'clinic-1',
  },
  admin: {
    id: 'admin-1',
    role: 'admin',
    name: 'Platform Administrator',
  },
};

export function getSavedSession(): UserSession | null {
  return readStorage<UserSession | null>(STORAGE_KEYS.session, null);
}

export function loginAsDemoRole(role: UserRole, customSession?: Partial<UserSession>): UserSession {
  const base = DEMO_ACCOUNTS[role];
  const session: UserSession = {
    ...base,
    ...customSession,
    role,
  };
  writeStorage(STORAGE_KEYS.session, session);
  return session;
}

export function logoutSession(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEYS.session);
    }
  } catch {
    // ignore
  }
}
