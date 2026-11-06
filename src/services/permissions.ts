import { DoctorPrivateNote, UserRole, UserSession } from '../types';

/**
 * Strict permission & privacy layer for Maw3edy (موعدي).
 *
 * CRITICAL PRIVACY RULES (Section 13):
 * - A doctor can ONLY view/edit/create their own private notes.
 * - Patients cannot see private notes.
 * - Nurses cannot see private notes.
 * - Other doctors cannot see another doctor's private notes.
 * - Admin accounts must NOT automatically gain access to private clinical notes.
 */

export function canAccessRoleRoute(session: UserSession | null, requiredRole: UserRole): boolean {
  if (!session) return false;
  return session.role === requiredRole;
}

export function canViewPrivateNote(session: UserSession | null, note: DoctorPrivateNote): boolean {
  if (!session) return false;
  if (session.role !== 'doctor') return false;
  return session.id === note.doctorId;
}

export function canWritePrivateNote(session: UserSession | null, authorDoctorId: string): boolean {
  if (!session) return false;
  if (session.role !== 'doctor') return false;
  return session.id === authorDoctorId;
}

export function filterAccessiblePrivateNotes(
  session: UserSession | null,
  allNotes: DoctorPrivateNote[],
  patientId?: string
): DoctorPrivateNote[] {
  if (!session || session.role !== 'doctor') {
    return [];
  }
  return allNotes
    .filter((note) => {
      const isAuthor = note.doctorId === session.id;
      const matchesPatient = patientId ? note.patientId === patientId : true;
      return isAuthor && matchesPatient;
    })
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
}

export function canEditMedicalRecordsOrPrescriptions(session: UserSession | null): boolean {
  return Boolean(session && session.role === 'doctor');
}

export function canOperateClinicQueue(session: UserSession | null): boolean {
  return Boolean(session && (session.role === 'nurse' || session.role === 'doctor'));
}

export function canSubmitReview(
  session: UserSession | null,
  hasCompletedAppointmentWithDoctor: boolean
): boolean {
  if (!session || session.role !== 'patient') return false;
  return hasCompletedAppointmentWithDoctor;
}

export function getDefaultHomeRouteForRole(role: UserRole): string {
  switch (role) {
    case 'patient':
      return '/patient';
    case 'doctor':
      return '/doctor';
    case 'nurse':
      return '/nurse';
    case 'admin':
      return '/admin';
  }
}
