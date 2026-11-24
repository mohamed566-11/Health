import {
  AppNotification,
  Appointment,
  Clinic,
  Doctor,
  DoctorPrivateNote,
  Fine,
  GovernorateLocation,
  MedicalRecordItem,
  MedicineCatalogItem,
  Nurse,
  Patient,
  PatientFlowState,
  PatientSession,
  Prescription,
  PrescriptionTemplate,
  Review,
  Specialty,
  UserSession,
} from '../types';
import { SEED_APPOINTMENTS } from '../data/appointments';
import { SEED_CLINICS, SEED_LOCATIONS, SEED_SPECIALTIES } from '../data/clinics';
import { SEED_DOCTORS } from '../data/doctors';
import { SEED_FINES } from '../data/fines';
import { SEED_MEDICINES, SEED_TEMPLATES } from '../data/medicines';
import { SEED_NOTES } from '../data/notes';
import { SEED_NURSES } from '../data/nurses';
import { SEED_PATIENTS } from '../data/patients';
import { SEED_PRESCRIPTIONS } from '../data/prescriptions';
import { SEED_MEDICAL_RECORDS, SEED_NOTIFICATIONS, SEED_REVIEWS } from '../data/reviews';
import { canViewPrivateNote, canWritePrivateNote, filterAccessiblePrivateNotes } from './permissions';

const NAMESPACE = 'maw3edy:v1';
const SCHEMA_VERSION = '5.0.0';

export const STORAGE_KEYS = {
  version: `${NAMESPACE}:schema_version`,
  session: `${NAMESPACE}:session`,
  doctors: `${NAMESPACE}:doctors`,
  patients: `${NAMESPACE}:patients`,
  nurses: `${NAMESPACE}:nurses`,
  clinics: `${NAMESPACE}:clinics`,
  specialties: `${NAMESPACE}:specialties`,
  locations: `${NAMESPACE}:locations`,
  appointments: `${NAMESPACE}:appointments`,
  prescriptions: `${NAMESPACE}:prescriptions`,
  templates: `${NAMESPACE}:templates`,
  medicines: `${NAMESPACE}:medicines`,
  privateNotes: `${NAMESPACE}:private_notes`,
  medicalRecords: `${NAMESPACE}:medical_records`,
  notifications: `${NAMESPACE}:notifications`,
  reviews: `${NAMESPACE}:reviews`,
  fines: `${NAMESPACE}:fines`,
  patientFlow: `${NAMESPACE}:patient-flow`,
  patientSession: `${NAMESPACE}:patient-session`,
  lastUpdated: `${NAMESPACE}:last_updated`,
} as const;

// In-memory fallback if localStorage is blocked/unavailable
const memoryFallback = new Map<string, string>();
let storageErrorWarning: string | null = null;

export function getStorageWarning(): string | null {
  return storageErrorWarning;
}

function rawGet(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    storageErrorWarning = 'تعذر الوصول إلى التخزين المحلي للمتصفح؛ يتم حفظ التغييرات مؤقتًا خلال الجلسة الحالية.';
  }
  return memoryFallback.get(key) ?? null;
}

function rawSet(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
      window.localStorage.setItem(STORAGE_KEYS.lastUpdated, String(Date.now()));
      return;
    }
  } catch {
    storageErrorWarning = 'مساحة التخزين المحلي ممتلئة أو مقيدة في وضع التصفح الخفي؛ يتم الحفظ مؤقتًا.';
  }
  memoryFallback.set(key, value);
}

function rawRemove(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
  memoryFallback.delete(key);
}

export function readStorage<T>(key: string, fallback: T): T {
  const raw = rawGet(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  rawSet(key, JSON.stringify(value));
}

export function ensureSeeded(): void {
  const currentVersion = rawGet(STORAGE_KEYS.version);
  if (currentVersion === SCHEMA_VERSION && rawGet(STORAGE_KEYS.doctors)) {
    return;
  }
  seedAllDemoData(false);
}

export function seedAllDemoData(clearSession = false): void {
  writeStorage(STORAGE_KEYS.version, SCHEMA_VERSION);
  writeStorage(STORAGE_KEYS.doctors, SEED_DOCTORS);
  writeStorage(STORAGE_KEYS.patients, SEED_PATIENTS);
  writeStorage(STORAGE_KEYS.nurses, SEED_NURSES);
  writeStorage(STORAGE_KEYS.clinics, SEED_CLINICS);
  writeStorage(STORAGE_KEYS.specialties, SEED_SPECIALTIES);
  writeStorage(STORAGE_KEYS.locations, SEED_LOCATIONS);
  writeStorage(STORAGE_KEYS.appointments, SEED_APPOINTMENTS);
  writeStorage(STORAGE_KEYS.prescriptions, SEED_PRESCRIPTIONS);
  writeStorage(STORAGE_KEYS.templates, SEED_TEMPLATES);
  writeStorage(STORAGE_KEYS.medicines, SEED_MEDICINES);
  writeStorage(STORAGE_KEYS.privateNotes, SEED_NOTES);
  writeStorage(STORAGE_KEYS.medicalRecords, SEED_MEDICAL_RECORDS);
  writeStorage(STORAGE_KEYS.notifications, SEED_NOTIFICATIONS);
  writeStorage(STORAGE_KEYS.reviews, SEED_REVIEWS);
  writeStorage(STORAGE_KEYS.fines, SEED_FINES);
  if (clearSession) {
    rawRemove(STORAGE_KEYS.session);
  }
}

// Strict Private Notes Data-Access Functions (Enforces Section 13 Privacy at Storage Layer)
export function getPrivateNotesForDoctor(
  session: UserSession | null,
  patientId?: string
): DoctorPrivateNote[] {
  const allNotes = readStorage<DoctorPrivateNote[]>(STORAGE_KEYS.privateNotes, SEED_NOTES);
  return filterAccessiblePrivateNotes(session, allNotes, patientId);
}

export function savePrivateNoteForDoctor(
  session: UserSession | null,
  noteInput: {
    id?: string;
    patientId: string;
    visitId?: string;
    content: string;
    isPinned?: boolean;
  }
): DoctorPrivateNote {
  if (!session || session.role !== 'doctor' || !canWritePrivateNote(session, session.id)) {
    throw new Error('غير مصرح بالوصول إلى الملاحظات الإكلينيكية الخاصة.');
  }
  const allNotes = readStorage<DoctorPrivateNote[]>(STORAGE_KEYS.privateNotes, SEED_NOTES);
  const nowIso = new Date().toISOString();

  if (noteInput.id) {
    const existingIndex = allNotes.findIndex((n) => n.id === noteInput.id);
    if (existingIndex === -1) {
      throw new Error('الملاحظة غير موجودة.');
    }
    const existing = allNotes[existingIndex];
    if (!canViewPrivateNote(session, existing)) {
      throw new Error('لا يمكنك تعديل ملاحظات خاصة بطبيب آخر.');
    }
    const updated: DoctorPrivateNote = {
      ...existing,
      content: noteInput.content.trim(),
      isPinned: noteInput.isPinned ?? existing.isPinned,
      updatedAt: nowIso,
    };
    allNotes[existingIndex] = updated;
    writeStorage(STORAGE_KEYS.privateNotes, allNotes);
    return updated;
  }

  const created: DoctorPrivateNote = {
    id: `note-${Date.now()}`,
    patientId: noteInput.patientId,
    doctorId: session.id,
    visitId: noteInput.visitId,
    content: noteInput.content.trim(),
    isPinned: Boolean(noteInput.isPinned),
    createdAt: nowIso,
    updatedAt: nowIso,
  };
  const next = [created, ...allNotes];
  writeStorage(STORAGE_KEYS.privateNotes, next);
  return created;
}

export function deletePrivateNoteForDoctor(session: UserSession | null, noteId: string): void {
  if (!session || session.role !== 'doctor') {
    throw new Error('غير مصرح بحذف الملاحظات الخاصة.');
  }
  const allNotes = readStorage<DoctorPrivateNote[]>(STORAGE_KEYS.privateNotes, SEED_NOTES);
  const target = allNotes.find((n) => n.id === noteId);
  if (!target || !canViewPrivateNote(session, target)) {
    throw new Error('غير مصرح بحذف هذه الملاحظة.');
  }
  writeStorage(
    STORAGE_KEYS.privateNotes,
    allNotes.filter((n) => n.id !== noteId)
  );
}

export interface SnapshotState {
  doctors: Doctor[];
  patients: Patient[];
  nurses: Nurse[];
  clinics: Clinic[];
  specialties: Specialty[];
  locations: GovernorateLocation[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  templates: PrescriptionTemplate[];
  medicines: MedicineCatalogItem[];
  medicalRecords: MedicalRecordItem[];
  notifications: AppNotification[];
  reviews: Review[];
  fines: Fine[];
}

export function loadFullSnapshot(): SnapshotState {
  ensureSeeded();
  return {
    doctors: readStorage(STORAGE_KEYS.doctors, SEED_DOCTORS),
    patients: readStorage(STORAGE_KEYS.patients, SEED_PATIENTS),
    nurses: readStorage(STORAGE_KEYS.nurses, SEED_NURSES),
    clinics: readStorage(STORAGE_KEYS.clinics, SEED_CLINICS),
    specialties: readStorage(STORAGE_KEYS.specialties, SEED_SPECIALTIES),
    locations: readStorage(STORAGE_KEYS.locations, SEED_LOCATIONS),
    appointments: readStorage(STORAGE_KEYS.appointments, SEED_APPOINTMENTS),
    prescriptions: readStorage(STORAGE_KEYS.prescriptions, SEED_PRESCRIPTIONS),
    templates: readStorage(STORAGE_KEYS.templates, SEED_TEMPLATES),
    medicines: readStorage(STORAGE_KEYS.medicines, SEED_MEDICINES),
    medicalRecords: readStorage(STORAGE_KEYS.medicalRecords, SEED_MEDICAL_RECORDS),
    notifications: readStorage(STORAGE_KEYS.notifications, SEED_NOTIFICATIONS),
    reviews: readStorage(STORAGE_KEYS.reviews, SEED_REVIEWS),
    fines: readStorage(STORAGE_KEYS.fines, SEED_FINES),
  };
}

// ==========================================
// BACKEND-READY REPOSITORY INTERFACE
// ==========================================

export async function getDoctorsRepo(): Promise<Doctor[]> {
  return readStorage<Doctor[]>(STORAGE_KEYS.doctors, SEED_DOCTORS);
}

export async function getDoctorByIdRepo(id: string): Promise<Doctor | undefined> {
  const doctors = readStorage<Doctor[]>(STORAGE_KEYS.doctors, SEED_DOCTORS);
  return doctors.find((d) => d.id === id);
}

export async function getUnpaidFinesForPhoneRepo(phone: string): Promise<Fine[]> {
  const cleanPhone = phone.trim();
  const fines = readStorage<Fine[]>(STORAGE_KEYS.fines, SEED_FINES);
  return fines.filter((f) => f.patientPhone.trim() === cleanPhone && f.status === 'unpaid');
}

export async function getUnpaidFinesTotalForPhoneRepo(phone: string): Promise<number> {
  const unpaid = await getUnpaidFinesForPhoneRepo(phone);
  return unpaid.reduce((sum, f) => sum + f.amount, 0);
}

export async function createFineRepo(fine: Omit<Fine, 'id' | 'createdAt' | 'status'>): Promise<Fine> {
  const fines = readStorage<Fine[]>(STORAGE_KEYS.fines, SEED_FINES);
  const newFine: Fine = {
    ...fine,
    id: `fine-${Date.now()}`,
    status: 'unpaid',
    createdAt: new Date().toISOString(),
  };
  writeStorage(STORAGE_KEYS.fines, [newFine, ...fines]);
  return newFine;
}

export async function markFinesAsPaidRepo(fineIds: string[]): Promise<void> {
  const fines = readStorage<Fine[]>(STORAGE_KEYS.fines, SEED_FINES);
  const now = new Date().toISOString();
  const updated = fines.map((f) =>
    fineIds.includes(f.id) ? { ...f, status: 'paid' as const, paidAt: now } : f
  );
  writeStorage(STORAGE_KEYS.fines, updated);
}

export async function updateDoctorSettingsRepo(
  doctorId: string,
  settings: Partial<Doctor>
): Promise<Doctor> {
  const doctors = readStorage<Doctor[]>(STORAGE_KEYS.doctors, SEED_DOCTORS);
  const idx = doctors.findIndex((d) => d.id === doctorId);
  if (idx === -1) throw new Error('الطبيب غير موجود');
  const updated: Doctor = {
    ...doctors[idx],
    ...settings,
  };
  doctors[idx] = updated;
  writeStorage(STORAGE_KEYS.doctors, doctors);
  return updated;
}

export function getPatientSession(): PatientSession | null {
  return readStorage<PatientSession | null>(STORAGE_KEYS.patientSession, null);
}

export function setPatientSession(session: PatientSession | null): void {
  if (!session) {
    rawRemove(STORAGE_KEYS.patientSession);
  } else {
    writeStorage(STORAGE_KEYS.patientSession, session);
  }
}

export function getPatientFlow(): PatientFlowState {
  return readStorage<PatientFlowState>(STORAGE_KEYS.patientFlow, {});
}

export function setPatientFlow(flow: PatientFlowState): void {
  writeStorage(STORAGE_KEYS.patientFlow, flow);
}
