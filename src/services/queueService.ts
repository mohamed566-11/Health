import { Appointment, Doctor } from '../types';

export interface QueueMetrics {
  bookingNumber: string;
  currentPosition: number;
  patientsAhead: number;
  estimatedWaitMinutes: number;
  currentlyExamining: Appointment | null;
  nextEligible: Appointment | null;
  activeQueueList: Appointment[];
}

export interface PatientTrackingMetrics {
  ticketNumber: number;
  displayedNumber: number;
  actualCurrent: number;
  ahead: number;
  waitMinutes: number;
  approxClockTime: string;
  isImmediate: boolean;
}

const ACTIVE_QUEUE_STATUSES: Appointment['status'][] = [
  'in_examination',
  'arrived',
  'waiting',
  'booked',
  'late',
];

/**
 * Returns sequential ticket number starting at 1 per doctor per date.
 */
export function getNextTicketNumber(
  appointments: Appointment[],
  doctorId: string,
  date: string
): number {
  const sameDay = appointments.filter(
    (a) => a.doctorId === doctorId && a.date === date
  );
  if (sameDay.length === 0) return 1;
  const maxTicket = Math.max(...sameDay.map((a) => a.ticketNumber || 0));
  return maxTicket + 1;
}

/**
 * Calculates current actual ticket and displayed ticket for a doctor on a given date.
 * actualCurrent: ticket number of the patient currently in_examination; if none, the last completed ticket; 0 if nobody started.
 * displayedNumber = actualCurrent + doctor.queueOffset (default 4).
 */
export function getDoctorQueueState(
  appointments: Appointment[],
  doctorId: string,
  date: string,
  queueOffset = 4
): {
  sameDay: Appointment[];
  currentlyExamining: Appointment | null;
  actualCurrent: number;
  displayedNumber: number;
} {
  const sameDay = appointments
    .filter((a) => a.doctorId === doctorId && a.date === date)
    .sort((a, b) => (a.ticketNumber || 0) - (b.ticketNumber || 0));

  const currentlyExamining =
    sameDay.find((a) => a.status === 'in_examination') ?? null;

  let actualCurrent = 0;
  if (currentlyExamining) {
    actualCurrent = currentlyExamining.ticketNumber || 0;
  } else {
    // Find the last completed ticket
    const completedList = sameDay.filter((a) => a.status === 'completed');
    if (completedList.length > 0) {
      const lastCompleted = completedList[completedList.length - 1];
      actualCurrent = lastCompleted.ticketNumber || 0;
    }
  }

  const displayedNumber = actualCurrent + queueOffset;

  return {
    sameDay,
    currentlyExamining,
    actualCurrent,
    displayedNumber,
  };
}

/**
 * Formats approximate clock time in Arabic e.g. "حوالي 7:40 م"
 */
export function formatApproxClockTime(minutesFromNow: number): string {
  const targetDate = new Date(Date.now() + minutesFromNow * 60 * 1000);
  let hours = targetDate.getHours();
  const minutes = targetDate.getMinutes();
  const period = hours >= 12 ? 'م' : 'ص';
  hours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `حوالي ${hours}:${formattedMinutes} ${period}`;
}

/**
 * Single source of truth for the 4 Patient Tracking Boxes:
 * - Box 1: رقم حجزك (ticketNumber)
 * - Box 2: الدكتور عنده رقم (displayedNumber)
 * - Box 3: قدامك كام كشف (ahead = max(0, myTicket - displayedNumber))
 * - Box 4: الوقت التقريبي (time = ahead * avgExamMinutes)
 */
export function calculatePatientTrackingMetrics(
  appointment: Appointment,
  appointments: Appointment[],
  doctor?: Partial<Doctor> | null
): PatientTrackingMetrics {
  const offset = doctor?.queueOffset ?? 4;
  const avgMinutes = doctor?.avgExamMinutes ?? 10;

  const { actualCurrent, displayedNumber } = getDoctorQueueState(
    appointments,
    appointment.doctorId,
    appointment.date,
    offset
  );

  const myTicket = appointment.ticketNumber || 1;
  const ahead = Math.max(0, myTicket - displayedNumber);
  const waitMinutes = ahead * avgMinutes;
  const approxClockTime = formatApproxClockTime(waitMinutes);
  const isImmediate = ahead === 0;

  return {
    ticketNumber: myTicket,
    displayedNumber,
    actualCurrent,
    ahead,
    waitMinutes,
    approxClockTime,
    isImmediate,
  };
}

/**
 * Checks if a patient is eligible for follow-up (إعادة) with the SAME doctor within followUpDays.
 */
export function checkFollowUpEligibility(
  appointments: Appointment[],
  patientPhone: string,
  doctorId: string,
  targetDate: string,
  followUpDays = 14
): {
  isFollowUp: boolean;
  daysRemaining: number;
  previousVisitDate?: string;
} {
  if (!patientPhone) return { isFollowUp: false, daysRemaining: 0 };

  const cleanPhone = patientPhone.trim();
  const pastCompleted = appointments
    .filter(
      (a) =>
        a.doctorId === doctorId &&
        a.patientPhone.trim() === cleanPhone &&
        a.status === 'completed'
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (pastCompleted.length === 0) {
    return { isFollowUp: false, daysRemaining: 0 };
  }

  const latestVisit = pastCompleted[0];
  const targetMs = new Date(targetDate).getTime();
  const visitMs = new Date(latestVisit.date).getTime();
  const diffDays = Math.floor((targetMs - visitMs) / (1000 * 60 * 60 * 24));

  if (diffDays >= 0 && diffDays <= followUpDays) {
    return {
      isFollowUp: true,
      daysRemaining: followUpDays - diffDays,
      previousVisitDate: latestVisit.date,
    };
  }

  return { isFollowUp: false, daysRemaining: 0 };
}

/**
 * Sorts appointments for a clinic on a given date in queue order.
 */
export function getSortedClinicQueue(
  appointments: Appointment[],
  clinicId: string,
  date: string
): Appointment[] {
  return appointments
    .filter((a) => a.clinicId === clinicId && a.date === date)
    .sort((a, b) => (a.ticketNumber || a.queuePosition) - (b.ticketNumber || b.queuePosition));
}

/**
 * Calculates live queue metrics for a specific appointment.
 */
export function calculateQueueMetricsForAppointment(
  appointments: Appointment[],
  targetAppointment: Appointment,
  avgExamDurationMin = 15
): QueueMetrics {
  const sameDayClinic = getSortedClinicQueue(
    appointments,
    targetAppointment.clinicId,
    targetAppointment.date
  );

  const activeList = sameDayClinic.filter((a) => ACTIVE_QUEUE_STATUSES.includes(a.status));
  const currentlyExamining =
    sameDayClinic.find((a) => a.status === 'in_examination') ?? null;
  const nextEligible =
    sameDayClinic.find((a) => a.status === 'arrived' || a.status === 'waiting' || a.status === 'booked' || a.status === 'late') ?? null;

  const indexInActive = activeList.findIndex((a) => a.id === targetAppointment.id);
  const currentPosition =
    indexInActive !== -1 ? indexInActive + 1 : targetAppointment.queuePosition;
  const patientsAhead = Math.max(0, currentPosition - 1);

  let estimatedWaitMinutes = 0;
  if (targetAppointment.status === 'in_examination' || targetAppointment.status === 'completed') {
    estimatedWaitMinutes = 0;
  } else if (patientsAhead === 4 && avgExamDurationMin === 15) {
    estimatedWaitMinutes = 45;
  } else {
    estimatedWaitMinutes = patientsAhead * avgExamDurationMin;
  }

  return {
    bookingNumber: targetAppointment.bookingNumber,
    currentPosition,
    patientsAhead,
    estimatedWaitMinutes,
    currentlyExamining,
    nextEligible,
    activeQueueList: activeList,
  };
}

/**
 * Re-normalizes active queue positions sequentially (1, 2, 3...) after a status change or reorder.
 */
export function recalculateClinicQueuePositions(
  appointments: Appointment[],
  clinicId: string,
  date: string
): Appointment[] {
  const clinicDay = appointments
    .filter((a) => a.clinicId === clinicId && a.date === date)
    .sort((a, b) => (a.ticketNumber || a.queuePosition) - (b.ticketNumber || b.queuePosition));

  let activePos = 1;
  const updatedById = new Map<string, Appointment>();

  for (const apt of clinicDay) {
    if (ACTIVE_QUEUE_STATUSES.includes(apt.status)) {
      updatedById.set(apt.id, { ...apt, queuePosition: activePos });
      activePos += 1;
    } else {
      updatedById.set(apt.id, apt);
    }
  }

  return appointments.map((apt) => updatedById.get(apt.id) ?? apt);
}

/**
 * Completes the currently examining patient (if any) and moves the next eligible patient into 'in_examination'.
 * Enforces single active examination per clinic/doctor.
 */
export function advanceClinicQueue(
  appointments: Appointment[],
  clinicId: string,
  date: string,
  nowIso = new Date().toISOString()
): {
  updatedAppointments: Appointment[];
  completedAppointment: Appointment | null;
  startedAppointment: Appointment | null;
} {
  const clinicDay = getSortedClinicQueue(appointments, clinicId, date);
  const currentExam = clinicDay.find((a) => a.status === 'in_examination') ?? null;

  // Next eligible prioritizes 'arrived', then 'waiting', then 'booked'
  const nextCandidate =
    clinicDay.find((a) => a.status === 'arrived') ??
    clinicDay.find((a) => a.status === 'waiting') ??
    clinicDay.find((a) => a.status === 'booked') ??
    clinicDay.find((a) => a.status === 'late') ??
    null;

  const afterStatusChange = appointments.map((apt) => {
    if (currentExam && apt.id === currentExam.id) {
      return {
        ...apt,
        status: 'completed' as const,
        completedAt: nowIso,
        updatedAt: nowIso,
      };
    }
    if (nextCandidate && apt.id === nextCandidate.id) {
      return {
        ...apt,
        status: 'in_examination' as const,
        enteredAt: nowIso,
        examinationStartedAt: nowIso,
        updatedAt: nowIso,
      };
    }
    return apt;
  });

  const reindexed = recalculateClinicQueuePositions(afterStatusChange, clinicId, date);
  return {
    updatedAppointments: reindexed,
    completedAppointment: currentExam ? { ...currentExam, status: 'completed' } : null,
    startedAppointment: nextCandidate ? { ...nextCandidate, status: 'in_examination' } : null,
  };
}
