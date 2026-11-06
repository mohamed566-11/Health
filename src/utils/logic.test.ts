import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatCurrencyEGP,
  formatPatientsCount,
  matchesSearch,
  normalizeArabicText,
} from './formatters';
import { validateEgyptianPhone, validateFullName } from './validation';
import {
  canViewPrivateNote,
  filterAccessiblePrivateNotes,
} from '../services/permissions';
import { SEED_NOTES } from '../data/notes';
import { SEED_APPOINTMENTS } from '../data/appointments';
import { SEED_DOCTORS } from '../data/doctors';
import { SEED_CLINICS, SEED_LOCATIONS, SEED_SPECIALTIES } from '../data/clinics';
import {
  advanceClinicQueue,
  calculateQueueMetricsForAppointment,
} from '../services/queueService';

test('Arabic pluralization and currency formatting', () => {
  assert.equal(formatPatientsCount(0), 'لا يوجد مرضى');
  assert.equal(formatPatientsCount(1), 'مريض واحد');
  assert.equal(formatPatientsCount(2), 'مريضان');
  assert.equal(formatPatientsCount(4), '4 مرضى');
  assert.equal(formatPatientsCount(11), '11 مريضًا');
  assert.equal(formatCurrencyEGP(350), '350 ج.م');
});

test('Arabic normalization matches Alexandria and hamza/ta-marbuta variations', () => {
  assert.equal(normalizeArabicText('الإسكندرية'), normalizeArabicText('الاسكندريه'));
  assert.equal(matchesSearch('الإسكندرية', 'اسكندرية'), true);
  assert.equal(matchesSearch('محافظة الإسكندرية - سموحة', 'اسكندريه'), true);
  assert.equal(matchesSearch('د. أحمد محمود', 'احمد'), true);
});

test('Egyptian phone number and full name validation', () => {
  assert.equal(validateEgyptianPhone('01012345678').valid, true);
  assert.equal(validateEgyptianPhone('01551234987').valid, true);
  assert.equal(validateEgyptianPhone('01912345678').valid, false);
  assert.equal(validateEgyptianPhone('01012345').valid, false);
  assert.equal(validateFullName('أحمد محمد').valid, true);
  assert.equal(validateFullName('أحمد').valid, false);
});

test('Strict doctor private notes privacy enforcement', () => {
  const doc1Session = { id: 'doc-1', role: 'doctor' as const, name: 'د. أحمد محمود' };
  const doc4Session = { id: 'doc-4', role: 'doctor' as const, name: 'د. محمد عبد التواب' };
  const patientSession = { id: 'pat-1', role: 'patient' as const, name: 'أحمد محمد' };
  const nurseSession = { id: 'nurse-1', role: 'nurse' as const, name: 'منى إبراهيم' };
  const adminSession = { id: 'admin-1', role: 'admin' as const, name: 'Admin' };

  const doc1NotesForPat1 = filterAccessiblePrivateNotes(doc1Session, SEED_NOTES, 'pat-1');
  assert.equal(doc1NotesForPat1.length, 2);
  assert.equal(doc1NotesForPat1.every((n) => n.doctorId === 'doc-1'), true);

  const doc4NotesForPat1 = filterAccessiblePrivateNotes(doc4Session, SEED_NOTES, 'pat-1');
  assert.equal(doc4NotesForPat1.length, 1);
  assert.equal(doc4NotesForPat1[0].doctorId, 'doc-4');

  // Patient, Nurse, and Admin must never access any private notes
  assert.equal(filterAccessiblePrivateNotes(patientSession, SEED_NOTES, 'pat-1').length, 0);
  assert.equal(filterAccessiblePrivateNotes(nurseSession, SEED_NOTES, 'pat-1').length, 0);
  assert.equal(filterAccessiblePrivateNotes(adminSession, SEED_NOTES, 'pat-1').length, 0);
  assert.equal(canViewPrivateNote(adminSession, SEED_NOTES[0]), false);
});

test('Live queue metrics and Finish Examination & Call Next progression', () => {
  const targetApt = SEED_APPOINTMENTS.find((a) => a.id === 'apt-6')!;
  assert.equal(targetApt.bookingNumber, '#025');

  const initialMetrics = calculateQueueMetricsForAppointment(SEED_APPOINTMENTS, targetApt, 15);
  assert.equal(initialMetrics.currentPosition, 5);
  assert.equal(initialMetrics.patientsAhead, 4);
  assert.equal(initialMetrics.estimatedWaitMinutes, 45);
  assert.equal(initialMetrics.currentlyExamining?.bookingNumber, '#021');

  // Advance queue (Nurse presses Finish Examination & Call Next)
  const { updatedAppointments, completedAppointment, startedAppointment } = advanceClinicQueue(
    SEED_APPOINTMENTS,
    'clinic-1',
    targetApt.date
  );
  assert.equal(completedAppointment?.bookingNumber, '#021');
  assert.equal(startedAppointment?.bookingNumber, '#022');

  const updatedTarget = updatedAppointments.find((a) => a.id === 'apt-6')!;
  const nextMetrics = calculateQueueMetricsForAppointment(updatedAppointments, updatedTarget, 15);
  assert.equal(nextMetrics.currentPosition, 4);
  assert.equal(nextMetrics.patientsAhead, 3);
  assert.equal(nextMetrics.estimatedWaitMinutes, 45); // 3 * 15 = 45
});

test('Expanded medical catalog includes 24 doctors, 10 specialties, 18 clinics, and 8 governorates', () => {
  assert.equal(SEED_DOCTORS.length, 24);
  assert.equal(SEED_SPECIALTIES.length, 10);
  assert.equal(SEED_CLINICS.length, 18);
  assert.equal(SEED_LOCATIONS.length, 8);
  const approvedDoctors = SEED_DOCTORS.filter((d) => d.status === 'approved');
  assert.equal(approvedDoctors.length, 23);
});

test('Patient explainer video scenes and duration integrity', async () => {
  const { EXPLAINER_SCENES, TOTAL_DURATION_SEC, NARRATOR_VOICES } = await import(
    '../components/patient/PatientExplainerVideo.js'
  );
  assert.equal(EXPLAINER_SCENES.length, 5);
  assert.equal(TOTAL_DURATION_SEC, 92.8);
  assert.equal(NARRATOR_VOICES.salma.nameAr, 'د. سلمى');
  assert.equal(NARRATOR_VOICES.karim.nameAr, 'د. كريم');

  // Verify chronological startSec and endSec continuity
  for (let i = 0; i < EXPLAINER_SCENES.length; i++) {
    const scene = EXPLAINER_SCENES[i];
    assert.ok(scene.audioFiles.salma.startsWith('/audio/egyptian-salma-scene-'));
    assert.ok(scene.audioFiles.karim.startsWith('/audio/egyptian-karim-scene-'));
    assert.equal(scene.microSteps.length, 3);
    assert.ok(scene.durationSec > 0);
    if (i > 0) {
      assert.ok(scene.startSec >= EXPLAINER_SCENES[i - 1].endSec - 0.2);
    }
  }
});

test('Safe queue calculations on empty collections', () => {
  const mockApt = {
    id: 'apt-test',
    bookingNumber: '#099',
    patientId: 'pat-1',
    patientName: 'مريض تجريبي',
    patientPhone: '01012345678',
    doctorId: 'doc-1',
    doctorName: 'د. أحمد',
    specialtyAr: 'باطنة',
    clinicId: 'clinic-1',
    clinicName: 'عيادة الدقي',
    date: '2026-11-06',
    timeSlot: '06:00 م',
    queuePosition: 1,
    status: 'booked' as const,
    fee: 300,
    type: 'consultation' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const emptyQueueMetrics = calculateQueueMetricsForAppointment([], mockApt, 15);
  assert.equal(emptyQueueMetrics.patientsAhead, 0);
  assert.equal(emptyQueueMetrics.currentlyExamining, null);
  assert.equal(emptyQueueMetrics.nextEligible, null);
  assert.equal(emptyQueueMetrics.activeQueueList.length, 0);
});
