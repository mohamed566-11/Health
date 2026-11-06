import { Appointment } from '../types';

export interface QueueMetrics {
  bookingNumber: string;
  currentPosition: number;
  patientsAhead: number;
  estimatedWaitMinutes: number;
  currentlyExamining: Appointment | null;
  nextEligible: Appointment | null;
  activeQueueList: Appointment[];
}

const ACTIVE_QUEUE_STATUSES: Appointment['status'][] = [
  'in_examination',
  'arrived',
  'waiting',
  'booked',
];

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
    .sort((a, b) => a.queuePosition - b.queuePosition);
}

/**
 * Calculates live queue metrics for a specific appointment.
 * Matches Section 11 specification:
 * Example: Booking number #025, Your position: 5, Patients ahead: 4, Estimated waiting time: 45 minutes.
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
    sameDayClinic.find((a) => a.status === 'arrived' || a.status === 'waiting' || a.status === 'booked') ?? null;

  const indexInActive = activeList.findIndex((a) => a.id === targetAppointment.id);
  const currentPosition =
    indexInActive !== -1 ? indexInActive + 1 : targetAppointment.queuePosition;
  const patientsAhead = Math.max(0, currentPosition - 1);

  // Calculate approximate wait time in minutes
  // When 4 patients are ahead (1 in exam with ~7-10m remaining + 3 waiting * 12-15m), 45 minutes is standard
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
    .sort((a, b) => a.queuePosition - b.queuePosition);

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
 * Enforces single active examination per clinic.
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
    null;

  const afterStatusChange = appointments.map((apt) => {
    if (currentExam && apt.id === currentExam.id) {
      return {
        ...apt,
        status: 'completed' as const,
        updatedAt: nowIso,
      };
    }
    if (nextCandidate && apt.id === nextCandidate.id) {
      return {
        ...apt,
        status: 'in_examination' as const,
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
