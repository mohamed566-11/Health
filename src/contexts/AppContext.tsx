import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  AppNotification,
  Appointment,
  AppointmentStatus,
  Clinic,
  Doctor,
  DoctorPrivateNote,
  GovernorateLocation,
  MedicalRecordItem,
  MedicineCatalogItem,
  Nurse,
  Patient,
  Prescription,
  PrescriptionTemplate,
  Review,
  Specialty,
  UserRole,
  UserSession,
} from '../types';
import {
  deletePrivateNoteForDoctor,
  getPrivateNotesForDoctor,
  getStorageWarning,
  loadFullSnapshot,
  savePrivateNoteForDoctor,
  seedAllDemoData,
  SnapshotState,
  STORAGE_KEYS,
  writeStorage,
} from '../services/storageService';
import { getSavedSession, loginAsDemoRole, logoutSession } from '../services/mockAuth';
import { advanceClinicQueue, recalculateClinicQueuePositions } from '../services/queueService';
import { TODAY_DATE } from '../data/appointments';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  undoLabel?: string;
  onUndo?: () => void;
}

interface AppContextValue extends SnapshotState {
  session: UserSession | null;
  storageWarning: string | null;
  toasts: ToastItem[];
  lastSyncAt: string;
  debugGrid: boolean;
  setDebugGrid: React.Dispatch<React.SetStateAction<boolean>>;
  showToast: (
    message: string,
    type?: ToastItem['type'],
    undoConfig?: { label?: string; onUndo: () => void }
  ) => void;
  dismissToast: (id: string) => void;
  loginAsRole: (role: UserRole, customSession?: Partial<UserSession>) => UserSession;
  logout: () => void;
  registerPatient: (input: {
    name: string;
    phone: string;
    birthDate: string;
    gender: 'male' | 'female';
    governorate: string;
    city: string;
    allergies?: string[];
    chronicConditions?: string[];
  }) => Patient;
  registerDoctor: (input: {
    name: string;
    phone: string;
    specialtyAr: string;
    titleAr: string;
    yearsExperience: number;
    consultationFee: number;
    followUpPrice: number;
    clinicName: string;
    governorate: string;
    city: string;
    address: string;
    landmark: string;
  }) => Doctor;
  completeOnboarding: (patientId?: string) => void;
  restartOnboarding: (patientId?: string) => void;
  bookAppointment: (input: {
    doctorId: string;
    clinicId: string;
    date: string;
    timeSlot: string;
    type: 'consultation' | 'follow_up';
    symptomsOrReason?: string;
  }) => Appointment;
  cancelAppointment: (appointmentId: string, reason?: string) => void;
  postponeAppointment: (appointmentId: string, newDate: string, newTimeSlot: string, reason?: string) => void;
  startExamination: (appointmentId: string) => void;
  finishExaminationAndCallNext: (clinicId: string, date?: string) => {
    completed: Appointment | null;
    started: Appointment | null;
  };
  updateAppointmentStatus: (
    appointmentId: string,
    status: AppointmentStatus,
    reason?: string
  ) => void;
  moveAppointmentInQueue: (appointmentId: string, direction: 'up' | 'down', reason?: string) => void;
  addWalkInAppointment: (input: {
    patientName: string;
    patientPhone: string;
    patientAge?: number;
    clinicId: string;
    doctorId: string;
    queuePosition?: number;
    adminNotes?: string;
  }) => Appointment;
  announceClinicDelay: (clinicId: string, delayMinutes: number) => void;
  saveClinic: (clinic: Clinic) => void;
  toggleClinicActive: (clinicId: string) => void;
  savePrescription: (
    input: Omit<Prescription, 'id' | 'createdAt'>,
    completeAppointmentId?: string
  ) => Prescription;
  savePrescriptionTemplate: (input: Omit<PrescriptionTemplate, 'id'>) => PrescriptionTemplate;
  toggleFavoriteMedicine: (medicineId: string) => void;
  addMedicalRecord: (input: Omit<MedicalRecordItem, 'id'>) => MedicalRecordItem;
  getDoctorPrivateNotes: (patientId?: string) => DoctorPrivateNote[];
  saveDoctorPrivateNote: (input: {
    id?: string;
    patientId: string;
    visitId?: string;
    content: string;
    isPinned?: boolean;
  }) => DoctorPrivateNote;
  deleteDoctorPrivateNote: (noteId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  sendSimulatedNotification: (input: {
    userId: string;
    type: AppNotification['type'];
    title: string;
    message: string;
    linkTo?: string;
  }) => void;
  updatePatientProfile: (patientId: string, patch: Partial<Patient>) => void;
  submitReview: (input: Omit<Review, 'id' | 'createdAt' | 'status'>) => Review;
  updateDoctorStatusAdmin: (doctorId: string, status: Doctor['status']) => void;
  saveDoctorAdmin: (doctor: Doctor) => void;
  saveNurseAdmin: (nurse: Nurse) => void;
  saveSpecialtyAdmin: (specialty: Specialty) => void;
  saveLocationAdmin: (location: GovernorateLocation) => void;
  updateReviewStatusAdmin: (reviewId: string, status: Review['status']) => void;
  resetAllDemoData: () => void;
  refreshFromStorage: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [snapshot, setSnapshot] = useState<SnapshotState>(() => loadFullSnapshot());
  const [session, setSession] = useState<UserSession | null>(() => getSavedSession());
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [lastSyncAt, setLastSyncAt] = useState<string>(() => new Date().toISOString());
  const [debugGrid, setDebugGrid] = useState(false);
  const [privateNotesVersion, setPrivateNotesVersion] = useState(0);

  const refreshFromStorage = useCallback(() => {
    setSnapshot(loadFullSnapshot());
    setSession(getSavedSession());
    setLastSyncAt(new Date().toISOString());
    setPrivateNotesVersion((v) => v + 1);
  }, []);

  // Cross-tab sync via storage event
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (!e.key || e.key.startsWith('maw3edy:v1')) {
        refreshFromStorage();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [refreshFromStorage]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (
      message: string,
      type: ToastItem['type'] = 'success',
      undoConfig?: { label?: string; onUndo: () => void }
    ) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const item: ToastItem = {
        id,
        type,
        message,
        undoLabel: undoConfig?.label ?? (undoConfig ? 'تراجع' : undefined),
        onUndo: undoConfig?.onUndo,
      };
      setToasts((prev) => {
        const filtered = prev.filter((t) => t.message !== message && !(type === 'info' && t.type === 'info'));
        return [item, ...filtered].slice(0, 2);
      });
      if (type !== 'error') {
        window.setTimeout(() => {
          dismissToast(id);
        }, 3500);
      }
    },
    [dismissToast]
  );

  const loginAsRole = useCallback(
    (role: UserRole, customSession?: Partial<UserSession>) => {
      const nextSession = loginAsDemoRole(role, customSession);
      setSession(nextSession);
      showToast(`تم تسجيل الدخول بحساب تجريبي: ${nextSession.name}`, 'info');
      return nextSession;
    },
    [showToast]
  );

  const logout = useCallback(() => {
    logoutSession();
    setSession(null);
    showToast('تم تسجيل الخروج بنجاح', 'info');
  }, [showToast]);

  const registerPatient = useCallback(
    (input: {
      name: string;
      phone: string;
      birthDate: string;
      gender: 'male' | 'female';
      governorate: string;
      city: string;
      allergies?: string[];
      chronicConditions?: string[];
    }) => {
      const newPatient: Patient = {
        id: `pat-${Date.now()}`,
        name: input.name.trim(),
        phone: input.phone.trim(),
        birthDate: input.birthDate,
        gender: input.gender,
        governorate: input.governorate,
        city: input.city,
        allergies: input.allergies ?? [],
        chronicConditions: input.chronicConditions ?? [],
        onboardingCompleted: false,
        notificationPrefs: {
          queueAlerts: true,
          appointmentReminders: true,
          prescriptionReady: true,
        },
        createdAt: new Date().toISOString(),
      };
      const nextPatients = [newPatient, ...snapshot.patients];
      writeStorage(STORAGE_KEYS.patients, nextPatients);
      const newSession: UserSession = {
        id: newPatient.id,
        role: 'patient',
        name: newPatient.name,
        phone: newPatient.phone,
      };
      writeStorage(STORAGE_KEYS.session, newSession);
      setSnapshot((prev) => ({ ...prev, patients: nextPatients }));
      setSession(newSession);
      return newPatient;
    },
    [snapshot.patients]
  );

  const registerDoctor = useCallback(
    (input: {
      name: string;
      phone: string;
      specialtyAr: string;
      titleAr: string;
      yearsExperience: number;
      consultationFee: number;
      followUpPrice: number;
      clinicName: string;
      governorate: string;
      city: string;
      address: string;
      landmark: string;
    }) => {
      const matchedSpec =
        snapshot.specialties.find((s) => s.nameAr === input.specialtyAr) ??
        snapshot.specialties[0];
      const docId = `doc-${Date.now()}`;
      const clinicId = `clinic-${Date.now()}`;
      const formattedName = input.name.trim().startsWith('د.')
        ? input.name.trim()
        : `د. ${input.name.trim()}`;

      const newClinic: Clinic = {
        id: clinicId,
        doctorId: docId,
        name: input.clinicName.trim() || `عيادة ${formattedName}`,
        address: input.address.trim() || `${input.city} — الشارع الرئيسي`,
        governorate: input.governorate,
        city: input.city,
        district: input.city,
        landmark: input.landmark.trim() || 'بجوار الميدان الرئيسي',
        distanceKm: 3.5,
        workingDays: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'],
        startTime: '12:00',
        endTime: '21:00',
        consultationPrice: input.consultationFee,
        followUpPrice: input.followUpPrice,
        dailyPatientLimit: 25,
        avgExamDurationMin: 15,
        isActive: true,
        bookingsPaused: false,
        announcedDelayMin: 0,
        closedDates: [],
        phone: input.phone.trim(),
      };

      const newDoctor: Doctor = {
        id: docId,
        name: formattedName,
        specialtyId: matchedSpec.id,
        specialtyAr: matchedSpec.nameAr,
        specialtyEn: matchedSpec.nameEn,
        titleAr: input.titleAr.trim() || `أخصائي ${matchedSpec.nameAr}`,
        qualifications: [
          input.titleAr.trim() || `ماجستير ${matchedSpec.nameAr}`,
          'عضو نقابة أطباء مصر',
        ],
        bio: `طبيب متخصص في ${matchedSpec.nameAr} بخبرة ${input.yearsExperience} سنوات في التشخيص والعلاج والمتابعة الدقيقة للمرضى.`,
        yearsExperience: input.yearsExperience,
        rating: 4.9,
        reviewsCount: 12,
        consultationFee: input.consultationFee,
        clinicIds: [clinicId],
        status: 'approved',
        phone: input.phone.trim(),
        nextAvailableText: 'اليوم 06:00 م',
        doctorStatus: 'available',
      };

      const nextClinics = [newClinic, ...snapshot.clinics];
      const nextDoctors = [newDoctor, ...snapshot.doctors];
      writeStorage(STORAGE_KEYS.clinics, nextClinics);
      writeStorage(STORAGE_KEYS.doctors, nextDoctors);

      const newSession: UserSession = {
        id: newDoctor.id,
        role: 'doctor',
        name: newDoctor.name,
        phone: newDoctor.phone,
        specialty: newDoctor.specialtyAr,
      };
      writeStorage(STORAGE_KEYS.session, newSession);
      setSnapshot((prev) => ({
        ...prev,
        clinics: nextClinics,
        doctors: nextDoctors,
      }));
      setSession(newSession);
      return newDoctor;
    },
    [snapshot.clinics, snapshot.doctors, snapshot.specialties]
  );

  const completeOnboarding = useCallback(
    (patientId?: string) => {
      const targetId = patientId ?? session?.id ?? 'pat-1';
      const nextPatients = snapshot.patients.map((p) =>
        p.id === targetId ? { ...p, onboardingCompleted: true } : p
      );
      writeStorage(STORAGE_KEYS.patients, nextPatients);
      setSnapshot((prev) => ({ ...prev, patients: nextPatients }));
    },
    [session?.id, snapshot.patients]
  );

  const restartOnboarding = useCallback(
    (patientId?: string) => {
      const targetId = patientId ?? session?.id ?? 'pat-1';
      const nextPatients = snapshot.patients.map((p) =>
        p.id === targetId ? { ...p, onboardingCompleted: false } : p
      );
      writeStorage(STORAGE_KEYS.patients, nextPatients);
      setSnapshot((prev) => ({ ...prev, patients: nextPatients }));
    },
    [session?.id, snapshot.patients]
  );

  const sendSimulatedNotification = useCallback(
    (input: {
      userId: string;
      type: AppNotification['type'];
      title: string;
      message: string;
      linkTo?: string;
    }) => {
      const created: AppNotification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        userId: input.userId,
        type: input.type,
        title: input.title,
        message: input.message,
        read: false,
        createdAt: new Date().toISOString(),
        linkTo: input.linkTo,
      };
      setSnapshot((prev) => {
        const nextNotifs = [created, ...prev.notifications];
        writeStorage(STORAGE_KEYS.notifications, nextNotifs);
        return { ...prev, notifications: nextNotifs };
      });
    },
    []
  );

  const bookAppointment = useCallback(
    (input: {
      doctorId: string;
      clinicId: string;
      date: string;
      timeSlot: string;
      type: 'consultation' | 'follow_up';
      symptomsOrReason?: string;
    }): Appointment => {
      const patientId = session?.role === 'patient' ? session.id : 'pat-1';
      const patient = snapshot.patients.find((p) => p.id === patientId) ?? snapshot.patients[0];
      const doctor = snapshot.doctors.find((d) => d.id === input.doctorId) ?? snapshot.doctors[0];
      const clinic = snapshot.clinics.find((c) => c.id === input.clinicId) ?? snapshot.clinics[0];

      const sameClinicDay = snapshot.appointments.filter(
        (a) =>
          a.clinicId === clinic.id &&
          a.date === input.date &&
          a.status !== 'cancelled' &&
          a.status !== 'no_show'
      );
      const nextQueuePos = sameClinicDay.length + 1;
      const numericBooking = 28 + snapshot.appointments.length;
      const bookingNumber = `#0${numericBooking}`;
      const nowIso = new Date().toISOString();

      const created: Appointment = {
        id: `apt-${Date.now()}`,
        bookingNumber,
        patientId: patient.id,
        patientName: patient.name,
        patientPhone: patient.phone,
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialtyAr: doctor.specialtyAr,
        clinicId: clinic.id,
        clinicName: clinic.name,
        date: input.date,
        timeSlot: input.timeSlot,
        queuePosition: nextQueuePos,
        status: input.date === TODAY_DATE ? 'waiting' : 'booked',
        fee: input.type === 'follow_up' ? clinic.followUpPrice : clinic.consultationPrice,
        type: input.type,
        symptomsOrReason: input.symptomsOrReason?.trim() || 'كشف طبي عام',
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      const nextAppointments = [created, ...snapshot.appointments];
      writeStorage(STORAGE_KEYS.appointments, nextAppointments);
      setSnapshot((prev) => ({ ...prev, appointments: nextAppointments }));

      sendSimulatedNotification({
        userId: patient.id,
        type: 'booking_confirmed',
        title: 'تم تأكيد حجزك بنجاح',
        message: `تم تأكيد حجزك رقم ${created.bookingNumber} لدى ${doctor.name} في ${clinic.name} بتاريخ ${input.date} (${input.timeSlot}).`,
        linkTo: `/patient/queue/${created.id}`,
      });

      return created;
    },
    [
      sendSimulatedNotification,
      session,
      snapshot.appointments,
      snapshot.clinics,
      snapshot.doctors,
      snapshot.patients,
    ]
  );

  const cancelAppointment = useCallback(
    (appointmentId: string, reason = 'تم الإلغاء بناءً على طلب المستخدم') => {
      const target = snapshot.appointments.find((a) => a.id === appointmentId);
      if (!target) return;
      const nowIso = new Date().toISOString();
      const updated = snapshot.appointments.map((a) =>
        a.id === appointmentId
          ? { ...a, status: 'cancelled' as const, statusChangeReason: reason, updatedAt: nowIso }
          : a
      );
      const reindexed = recalculateClinicQueuePositions(updated, target.clinicId, target.date);
      writeStorage(STORAGE_KEYS.appointments, reindexed);
      setSnapshot((prev) => ({ ...prev, appointments: reindexed }));
      setLastSyncAt(nowIso);
      showToast(`تم إلغاء الحجز ${target.bookingNumber}`, 'info');
    },
    [showToast, snapshot.appointments]
  );

  const postponeAppointment = useCallback(
    (appointmentId: string, newDate: string, newTimeSlot: string, reason?: string) => {
      const target = snapshot.appointments.find((a) => a.id === appointmentId);
      if (!target) return;
      const nowIso = new Date().toISOString();
      const updated = snapshot.appointments.map((a) =>
        a.id === appointmentId
          ? {
              ...a,
              date: newDate,
              timeSlot: newTimeSlot,
              status: newDate === TODAY_DATE ? ('waiting' as const) : ('booked' as const),
              statusChangeReason: reason || 'تم تأجيل الموعد',
              updatedAt: nowIso,
            }
          : a
      );
      const reindexed = recalculateClinicQueuePositions(updated, target.clinicId, target.date);
      writeStorage(STORAGE_KEYS.appointments, reindexed);
      setSnapshot((prev) => ({ ...prev, appointments: reindexed }));
      setLastSyncAt(nowIso);

      sendSimulatedNotification({
        userId: target.patientId,
        type: 'appointment_postponed',
        title: 'تم تعديل موعد حجزك',
        message: `تم نقل حجزك ${target.bookingNumber} إلى تاريخ ${newDate} الساعة ${newTimeSlot}.`,
        linkTo: `/patient/appointments/${target.id}`,
      });
      showToast(`تم تأجيل الحجز ${target.bookingNumber} بنجاح`, 'success');
    },
    [sendSimulatedNotification, showToast, snapshot.appointments]
  );

  const startExamination = useCallback(
    (appointmentId: string) => {
      const target = snapshot.appointments.find((a) => a.id === appointmentId);
      if (!target) return;
      const nowIso = new Date().toISOString();

      // Prevent multiple active examinations in the same clinic
      const updated = snapshot.appointments.map((a) => {
        if (
          a.clinicId === target.clinicId &&
          a.date === target.date &&
          a.status === 'in_examination' &&
          a.id !== appointmentId
        ) {
          return { ...a, status: 'completed' as const, updatedAt: nowIso };
        }
        if (a.id === appointmentId) {
          return {
            ...a,
            status: 'in_examination' as const,
            examinationStartedAt: nowIso,
            updatedAt: nowIso,
          };
        }
        return a;
      });

      const reindexed = recalculateClinicQueuePositions(updated, target.clinicId, target.date);
      writeStorage(STORAGE_KEYS.appointments, reindexed);
      setSnapshot((prev) => ({ ...prev, appointments: reindexed }));
      setLastSyncAt(nowIso);

      showToast(`بدأ الكشف الآن للمريض: ${target.patientName} (${target.bookingNumber})`, 'success');
    },
    [showToast, snapshot.appointments]
  );

  const finishExaminationAndCallNext = useCallback(
    (clinicId: string, date = TODAY_DATE) => {
      const nowIso = new Date().toISOString();
      const { updatedAppointments, completedAppointment, startedAppointment } = advanceClinicQueue(
        snapshot.appointments,
        clinicId,
        date,
        nowIso
      );

      writeStorage(STORAGE_KEYS.appointments, updatedAppointments);
      setSnapshot((prev) => ({ ...prev, appointments: updatedAppointments }));
      setLastSyncAt(nowIso);

      // Notify patients in queue whose turns are approaching
      const activeAfter = updatedAppointments
        .filter(
          (a) =>
            a.clinicId === clinicId &&
            a.date === date &&
            (a.status === 'in_examination' ||
              a.status === 'arrived' ||
              a.status === 'waiting' ||
              a.status === 'booked')
        )
        .sort((a, b) => a.queuePosition - b.queuePosition);

      activeAfter.forEach((apt, idx) => {
        const ahead = idx;
        if (ahead === 1) {
          sendSimulatedNotification({
            userId: apt.patientId,
            type: 'you_are_next',
            title: 'دورك هو القادم مباشرة!',
            message: `رقم حجزك ${apt.bookingNumber}: أنت المريض التالي للدخول إلى غرفة الكشف.`,
            linkTo: `/patient/queue/${apt.id}`,
          });
        } else if (ahead === 2) {
          sendSimulatedNotification({
            userId: apt.patientId,
            type: 'two_ahead',
            title: 'اقترب دورك — أمامك مريضان',
            message: `رقم حجزك ${apt.bookingNumber}: يرجى التواجد في استراحة العيادة الآن.`,
            linkTo: `/patient/queue/${apt.id}`,
          });
        }
      });

      if (startedAppointment) {
        showToast(
          `تم إنهاء الكشف واستدعاء المريض التالي: ${startedAppointment.patientName} (${startedAppointment.bookingNumber})`,
          'success'
        );
      } else if (completedAppointment) {
        showToast(`تم إنهاء الكشف للمريض: ${completedAppointment.patientName}`, 'success');
      } else {
        showToast('لا توجد حالات نشطة في الانتظار حاليًا', 'info');
      }

      return { completed: completedAppointment, started: startedAppointment };
    },
    [sendSimulatedNotification, showToast, snapshot.appointments]
  );

  const updateAppointmentStatus = useCallback(
    (appointmentId: string, status: AppointmentStatus, reason?: string) => {
      const target = snapshot.appointments.find((a) => a.id === appointmentId);
      if (!target) return;
      const previousState = [...snapshot.appointments];
      const nowIso = new Date().toISOString();

      const updated = snapshot.appointments.map((a) =>
        a.id === appointmentId
          ? {
              ...a,
              status,
              statusChangeReason: reason ?? a.statusChangeReason,
              updatedAt: nowIso,
            }
          : a
      );
      const reindexed = recalculateClinicQueuePositions(updated, target.clinicId, target.date);
      writeStorage(STORAGE_KEYS.appointments, reindexed);
      setSnapshot((prev) => ({ ...prev, appointments: reindexed }));
      setLastSyncAt(nowIso);

      showToast(`تم تحديث حالة الحجز ${target.bookingNumber}`, 'success', {
        label: 'تراجع',
        onUndo: () => {
          writeStorage(STORAGE_KEYS.appointments, previousState);
          setSnapshot((prev) => ({ ...prev, appointments: previousState }));
        },
      });
    },
    [showToast, snapshot.appointments]
  );

  const moveAppointmentInQueue = useCallback(
    (appointmentId: string, direction: 'up' | 'down', reason?: string) => {
      const target = snapshot.appointments.find((a) => a.id === appointmentId);
      if (!target) return;

      const clinicActive = snapshot.appointments
        .filter(
          (a) =>
            a.clinicId === target.clinicId &&
            a.date === target.date &&
            ['in_examination', 'arrived', 'waiting', 'booked'].includes(a.status)
        )
        .sort((a, b) => a.queuePosition - b.queuePosition);

      const idx = clinicActive.findIndex((a) => a.id === appointmentId);
      if (idx === -1) return;
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= clinicActive.length) return;

      // Do not move above the patient currently in examination
      if (clinicActive[swapIdx].status === 'in_examination') {
        showToast('لا يمكن تقديم مريض قبل الحالة الموجودة داخل غرفة الكشف حاليًا', 'warning');
        return;
      }

      const neighbor = clinicActive[swapIdx];
      const nowIso = new Date().toISOString();
      const updated = snapshot.appointments.map((a) => {
        if (a.id === target.id) {
          return {
            ...a,
            queuePosition: neighbor.queuePosition,
            statusChangeReason: reason || a.statusChangeReason,
            updatedAt: nowIso,
          };
        }
        if (a.id === neighbor.id) {
          return {
            ...a,
            queuePosition: target.queuePosition,
            updatedAt: nowIso,
          };
        }
        return a;
      });

      const reindexed = recalculateClinicQueuePositions(updated, target.clinicId, target.date);
      writeStorage(STORAGE_KEYS.appointments, reindexed);
      setSnapshot((prev) => ({ ...prev, appointments: reindexed }));
      setLastSyncAt(nowIso);
      showToast(`تم تعديل ترتيب الحجز ${target.bookingNumber} في قائمة الانتظار`, 'success');
    },
    [showToast, snapshot.appointments]
  );

  const addWalkInAppointment = useCallback(
    (input: {
      patientName: string;
      patientPhone: string;
      patientAge?: number;
      clinicId: string;
      doctorId: string;
      queuePosition?: number;
      adminNotes?: string;
    }): Appointment => {
      const clinic = snapshot.clinics.find((c) => c.id === input.clinicId) ?? snapshot.clinics[0];
      const doctor = snapshot.doctors.find((d) => d.id === input.doctorId) ?? snapshot.doctors[0];
      const nowIso = new Date().toISOString();

      // Find or create patient record
      let patient = snapshot.patients.find((p) => p.phone === input.patientPhone.trim());
      let nextPatients = snapshot.patients;
      if (!patient) {
        patient = {
          id: `pat-${Date.now()}`,
          name: input.patientName.trim(),
          phone: input.patientPhone.trim(),
          birthDate: '1990-01-01',
          gender: 'male',
          governorate: clinic.governorate,
          city: clinic.city,
          allergies: [],
          chronicConditions: [],
          onboardingCompleted: true,
          notificationPrefs: {
            queueAlerts: true,
            appointmentReminders: true,
            prescriptionReady: true,
          },
          createdAt: nowIso,
        };
        nextPatients = [patient, ...snapshot.patients];
        writeStorage(STORAGE_KEYS.patients, nextPatients);
      }

      const clinicActive = snapshot.appointments.filter(
        (a) =>
          a.clinicId === clinic.id &&
          a.date === TODAY_DATE &&
          ['in_examination', 'arrived', 'waiting', 'booked'].includes(a.status)
      );
      const pos = input.queuePosition && input.queuePosition > 0
        ? input.queuePosition
        : clinicActive.length + 1;

      const created: Appointment = {
        id: `apt-${Date.now()}`,
        bookingNumber: `#W${snapshot.appointments.length + 10}`,
        patientId: patient.id,
        patientName: input.patientName.trim(),
        patientPhone: input.patientPhone.trim(),
        patientAge: input.patientAge,
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialtyAr: doctor.specialtyAr,
        clinicId: clinic.id,
        clinicName: clinic.name,
        date: TODAY_DATE,
        timeSlot: 'حالة حضور مباشر',
        queuePosition: pos,
        status: 'arrived',
        fee: clinic.consultationPrice,
        type: 'walk_in',
        adminNotes: input.adminNotes?.trim(),
        symptomsOrReason: input.adminNotes?.trim() || 'حضور مباشر للاستقبال',
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      const nextAppointments = recalculateClinicQueuePositions(
        [...snapshot.appointments, created],
        clinic.id,
        TODAY_DATE
      );
      writeStorage(STORAGE_KEYS.appointments, nextAppointments);
      setSnapshot((prev) => ({
        ...prev,
        patients: nextPatients,
        appointments: nextAppointments,
      }));
      setLastSyncAt(nowIso);
      showToast(`تمت إضافة ${created.patientName} إلى طابور اليوم برقم ${created.bookingNumber}`, 'success');
      return created;
    },
    [showToast, snapshot.appointments, snapshot.clinics, snapshot.doctors, snapshot.patients]
  );

  const announceClinicDelay = useCallback(
    (clinicId: string, delayMinutes: number) => {
      const nextClinics = snapshot.clinics.map((c) =>
        c.id === clinicId ? { ...c, announcedDelayMin: delayMinutes } : c
      );
      writeStorage(STORAGE_KEYS.clinics, nextClinics);
      setSnapshot((prev) => ({ ...prev, clinics: nextClinics }));

      const clinic = snapshot.clinics.find((c) => c.id === clinicId);
      const waitingPatients = snapshot.appointments.filter(
        (a) =>
          a.clinicId === clinicId &&
          a.date === TODAY_DATE &&
          ['waiting', 'arrived', 'booked'].includes(a.status)
      );

      waitingPatients.forEach((apt) => {
        sendSimulatedNotification({
          userId: apt.patientId,
          type: 'doctor_delayed',
          title: 'تنبيه بتأخر موعد العيادة',
          message: `نعتذر عن تأخر المواعيد في ${clinic?.name ?? 'العيادة'} بمقدار ${delayMinutes} دقيقة تقريبًا.`,
          linkTo: `/patient/queue/${apt.id}`,
        });
      });

      showToast(`تم إعلان تأخير ${delayMinutes} دقيقة وإشعار المرضى المنتظرين`, 'info');
    },
    [sendSimulatedNotification, showToast, snapshot.appointments, snapshot.clinics]
  );

  const saveClinic = useCallback(
    (clinic: Clinic) => {
      const exists = snapshot.clinics.some((c) => c.id === clinic.id);
      const nextClinics = exists
        ? snapshot.clinics.map((c) => (c.id === clinic.id ? clinic : c))
        : [clinic, ...snapshot.clinics];
      writeStorage(STORAGE_KEYS.clinics, nextClinics);
      setSnapshot((prev) => ({ ...prev, clinics: nextClinics }));
      showToast(exists ? 'تم تحديث بيانات العيادة بنجاح' : 'تمت إضافة العيادة الجديدة بنجاح', 'success');
    },
    [showToast, snapshot.clinics]
  );

  const toggleClinicActive = useCallback(
    (clinicId: string) => {
      const nextClinics = snapshot.clinics.map((c) =>
        c.id === clinicId ? { ...c, isActive: !c.isActive } : c
      );
      writeStorage(STORAGE_KEYS.clinics, nextClinics);
      setSnapshot((prev) => ({ ...prev, clinics: nextClinics }));
      showToast('تم تحديث حالة تفعيل العيادة', 'info');
    },
    [showToast, snapshot.clinics]
  );

  const savePrescription = useCallback(
    (
      input: Omit<Prescription, 'id' | 'createdAt'>,
      completeAppointmentId?: string
    ): Prescription => {
      const nowIso = new Date().toISOString();
      const created: Prescription = {
        ...input,
        id: `rx-${Date.now()}`,
        createdAt: nowIso,
      };
      const nextPrescriptions = [created, ...snapshot.prescriptions];
      writeStorage(STORAGE_KEYS.prescriptions, nextPrescriptions);

      let nextAppointments = snapshot.appointments;
      if (completeAppointmentId) {
        nextAppointments = snapshot.appointments.map((a) =>
          a.id === completeAppointmentId
            ? {
                ...a,
                status: 'completed' as const,
                diagnosis: input.diagnosis,
                prescriptionId: created.id,
                updatedAt: nowIso,
              }
            : a
        );
        writeStorage(STORAGE_KEYS.appointments, nextAppointments);
      }

      const newRecord: MedicalRecordItem = {
        id: `rec-${Date.now()}`,
        patientId: input.patientId,
        doctorId: input.doctorId,
        doctorName: input.doctorName,
        specialtyAr: input.specialtyAr,
        type: 'visit',
        title: `زيارة طبية وتشخيص: ${input.diagnosis}`,
        summary: `تم فحص المريض وإصدار روشتة إلكترونية تحتوي على ${input.medicines.length} أدوية. ${input.additionalNotes || ''}`,
        date: input.date,
      };
      const nextRecords = [newRecord, ...snapshot.medicalRecords];
      writeStorage(STORAGE_KEYS.medicalRecords, nextRecords);

      setSnapshot((prev) => ({
        ...prev,
        prescriptions: nextPrescriptions,
        appointments: nextAppointments,
        medicalRecords: nextRecords,
      }));

      sendSimulatedNotification({
        userId: input.patientId,
        type: 'prescription_available',
        title: 'روشتة إلكترونية جديدة',
        message: `أصدر ${input.doctorName} روشتة إلكترونية جديدة لك بتاريخ ${input.date}.`,
        linkTo: `/patient/prescriptions/${created.id}`,
      });

      showToast('تم حفظ الروشتة وإضافتها إلى سجل المريض بنجاح', 'success');
      return created;
    },
    [
      sendSimulatedNotification,
      showToast,
      snapshot.appointments,
      snapshot.medicalRecords,
      snapshot.prescriptions,
    ]
  );

  const savePrescriptionTemplate = useCallback(
    (input: Omit<PrescriptionTemplate, 'id'>): PrescriptionTemplate => {
      const created: PrescriptionTemplate = {
        ...input,
        id: `tpl-${Date.now()}`,
      };
      const nextTemplates = [created, ...snapshot.templates];
      writeStorage(STORAGE_KEYS.templates, nextTemplates);
      setSnapshot((prev) => ({ ...prev, templates: nextTemplates }));
      showToast('تم حفظ القالب في قوالب الروشتات السريعة', 'success');
      return created;
    },
    [showToast, snapshot.templates]
  );

  const toggleFavoriteMedicine = useCallback(
    (medicineId: string) => {
      const nextMeds = snapshot.medicines.map((m) =>
        m.id === medicineId ? { ...m, isFavorite: !m.isFavorite } : m
      );
      writeStorage(STORAGE_KEYS.medicines, nextMeds);
      setSnapshot((prev) => ({ ...prev, medicines: nextMeds }));
    },
    [snapshot.medicines]
  );

  const addMedicalRecord = useCallback(
    (input: Omit<MedicalRecordItem, 'id'>): MedicalRecordItem => {
      const created: MedicalRecordItem = {
        ...input,
        id: `rec-${Date.now()}`,
      };
      const nextRecords = [created, ...snapshot.medicalRecords];
      writeStorage(STORAGE_KEYS.medicalRecords, nextRecords);
      setSnapshot((prev) => ({ ...prev, medicalRecords: nextRecords }));
      showToast('تمت إضافة السجل الطبي بنجاح', 'success');
      return created;
    },
    [showToast, snapshot.medicalRecords]
  );

  // Private clinical notes gated strictly by session
  const getDoctorPrivateNotes = useCallback(
    (patientId?: string): DoctorPrivateNote[] => {
      void privateNotesVersion;
      return getPrivateNotesForDoctor(session, patientId);
    },
    [privateNotesVersion, session]
  );

  const saveDoctorPrivateNote = useCallback(
    (input: {
      id?: string;
      patientId: string;
      visitId?: string;
      content: string;
      isPinned?: boolean;
    }): DoctorPrivateNote => {
      const saved = savePrivateNoteForDoctor(session, input);
      setPrivateNotesVersion((v) => v + 1);
      showToast('تم حفظ الملاحظة الإكلينيكية الخاصة بك بسرية تامة', 'success');
      return saved;
    },
    [session, showToast]
  );

  const deleteDoctorPrivateNote = useCallback(
    (noteId: string) => {
      deletePrivateNoteForDoctor(session, noteId);
      setPrivateNotesVersion((v) => v + 1);
      showToast('تم حذف الملاحظة الخاصة', 'info');
    },
    [session, showToast]
  );

  const markNotificationRead = useCallback(
    (notificationId: string) => {
      const nextNotifs = snapshot.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      writeStorage(STORAGE_KEYS.notifications, nextNotifs);
      setSnapshot((prev) => ({ ...prev, notifications: nextNotifs }));
    },
    [snapshot.notifications]
  );

  const markAllNotificationsRead = useCallback(() => {
    const nextNotifs = snapshot.notifications.map((n) => ({ ...n, read: true }));
    writeStorage(STORAGE_KEYS.notifications, nextNotifs);
    setSnapshot((prev) => ({ ...prev, notifications: nextNotifs }));
    showToast('تم تحديد جميع الإشعارات كمقروءة', 'info');
  }, [showToast, snapshot.notifications]);

  const updatePatientProfile = useCallback(
    (patientId: string, patch: Partial<Patient>) => {
      const nextPatients = snapshot.patients.map((p) =>
        p.id === patientId ? { ...p, ...patch } : p
      );
      writeStorage(STORAGE_KEYS.patients, nextPatients);
      setSnapshot((prev) => ({ ...prev, patients: nextPatients }));
      if (session?.id === patientId && patch.name) {
        const nextSess = { ...session, name: patch.name, phone: patch.phone ?? session.phone };
        writeStorage(STORAGE_KEYS.session, nextSess);
        setSession(nextSess);
      }
      showToast('تم حفظ التعديلات على الملف الشخصي بنجاح', 'success');
    },
    [session, showToast, snapshot.patients]
  );

  const submitReview = useCallback(
    (input: Omit<Review, 'id' | 'createdAt' | 'status'>): Review => {
      const created: Review = {
        ...input,
        id: `rev-${Date.now()}`,
        status: 'published',
        createdAt: new Date().toISOString(),
      };
      const nextReviews = [created, ...snapshot.reviews];
      writeStorage(STORAGE_KEYS.reviews, nextReviews);
      setSnapshot((prev) => ({ ...prev, reviews: nextReviews }));
      showToast('شكرًا لتقييمك! تم نشر التقييم بنجاح', 'success');
      return created;
    },
    [showToast, snapshot.reviews]
  );

  const updateDoctorStatusAdmin = useCallback(
    (doctorId: string, status: Doctor['status']) => {
      const nextDoctors = snapshot.doctors.map((d) =>
        d.id === doctorId ? { ...d, status } : d
      );
      writeStorage(STORAGE_KEYS.doctors, nextDoctors);
      setSnapshot((prev) => ({ ...prev, doctors: nextDoctors }));
      showToast('تم تحديث حالة حساب الطبيب بنجاح', 'success');
    },
    [showToast, snapshot.doctors]
  );

  const saveDoctorAdmin = useCallback(
    (doctor: Doctor) => {
      const exists = snapshot.doctors.some((d) => d.id === doctor.id);
      const nextDoctors = exists
        ? snapshot.doctors.map((d) => (d.id === doctor.id ? doctor : d))
        : [doctor, ...snapshot.doctors];
      writeStorage(STORAGE_KEYS.doctors, nextDoctors);
      setSnapshot((prev) => ({ ...prev, doctors: nextDoctors }));
      showToast('تم حفظ بيانات الطبيب بنجاح', 'success');
    },
    [showToast, snapshot.doctors]
  );

  const saveNurseAdmin = useCallback(
    (nurse: Nurse) => {
      const exists = snapshot.nurses.some((n) => n.id === nurse.id);
      const nextNurses = exists
        ? snapshot.nurses.map((n) => (n.id === nurse.id ? nurse : n))
        : [nurse, ...snapshot.nurses];
      writeStorage(STORAGE_KEYS.nurses, nextNurses);
      setSnapshot((prev) => ({ ...prev, nurses: nextNurses }));
      showToast(exists ? 'تم تحديث حساب الممرضة' : 'تم إنشاء حساب الممرضة بنجاح', 'success');
    },
    [showToast, snapshot.nurses]
  );

  const saveSpecialtyAdmin = useCallback(
    (specialty: Specialty) => {
      const exists = snapshot.specialties.some((s) => s.id === specialty.id);
      const nextSpecs = exists
        ? snapshot.specialties.map((s) => (s.id === specialty.id ? specialty : s))
        : [specialty, ...snapshot.specialties];
      writeStorage(STORAGE_KEYS.specialties, nextSpecs);
      setSnapshot((prev) => ({ ...prev, specialties: nextSpecs }));
      showToast('تم حفظ التخصص الطبي بنجاح', 'success');
    },
    [showToast, snapshot.specialties]
  );

  const saveLocationAdmin = useCallback(
    (location: GovernorateLocation) => {
      const exists = snapshot.locations.some((l) => l.id === location.id);
      const nextLocs = exists
        ? snapshot.locations.map((l) => (l.id === location.id ? location : l))
        : [...snapshot.locations, location];
      writeStorage(STORAGE_KEYS.locations, nextLocs);
      setSnapshot((prev) => ({ ...prev, locations: nextLocs }));
      showToast('تم تحديث بيانات النطاق الجغرافي بنجاح', 'success');
    },
    [showToast, snapshot.locations]
  );

  const updateReviewStatusAdmin = useCallback(
    (reviewId: string, status: Review['status']) => {
      const nextReviews = snapshot.reviews.map((r) =>
        r.id === reviewId ? { ...r, status } : r
      );
      writeStorage(STORAGE_KEYS.reviews, nextReviews);
      setSnapshot((prev) => ({ ...prev, reviews: nextReviews }));
      showToast('تم تحديث حالة التقييم', 'info');
    },
    [showToast, snapshot.reviews]
  );

  const resetAllDemoData = useCallback(() => {
    seedAllDemoData(false);
    setSnapshot(loadFullSnapshot());
    setPrivateNotesVersion((v) => v + 1);
    setLastSyncAt(new Date().toISOString());
    showToast('تمت إعادة ضبط جميع البيانات التجريبية إلى الوضع الافتراضي', 'info');
  }, [showToast]);

  const value = useMemo<AppContextValue>(
    () => ({
      ...snapshot,
      session,
      storageWarning: getStorageWarning(),
      toasts,
      lastSyncAt,
      debugGrid,
      setDebugGrid,
      showToast,
      dismissToast,
      loginAsRole,
      logout,
      registerPatient,
      registerDoctor,
      completeOnboarding,
      restartOnboarding,
      bookAppointment,
      cancelAppointment,
      postponeAppointment,
      startExamination,
      finishExaminationAndCallNext,
      updateAppointmentStatus,
      moveAppointmentInQueue,
      addWalkInAppointment,
      announceClinicDelay,
      saveClinic,
      toggleClinicActive,
      savePrescription,
      savePrescriptionTemplate,
      toggleFavoriteMedicine,
      addMedicalRecord,
      getDoctorPrivateNotes,
      saveDoctorPrivateNote,
      deleteDoctorPrivateNote,
      markNotificationRead,
      markAllNotificationsRead,
      sendSimulatedNotification,
      updatePatientProfile,
      submitReview,
      updateDoctorStatusAdmin,
      saveDoctorAdmin,
      saveNurseAdmin,
      saveSpecialtyAdmin,
      saveLocationAdmin,
      updateReviewStatusAdmin,
      resetAllDemoData,
      refreshFromStorage,
    }),
    [
      addMedicalRecord,
      addWalkInAppointment,
      announceClinicDelay,
      bookAppointment,
      cancelAppointment,
      completeOnboarding,
      debugGrid,
      deleteDoctorPrivateNote,
      dismissToast,
      finishExaminationAndCallNext,
      getDoctorPrivateNotes,
      lastSyncAt,
      loginAsRole,
      logout,
      markAllNotificationsRead,
      markNotificationRead,
      moveAppointmentInQueue,
      postponeAppointment,
      refreshFromStorage,
      registerDoctor,
      registerPatient,
      resetAllDemoData,
      restartOnboarding,
      saveClinic,
      saveDoctorAdmin,
      saveDoctorPrivateNote,
      saveLocationAdmin,
      saveNurseAdmin,
      savePrescription,
      savePrescriptionTemplate,
      saveSpecialtyAdmin,
      sendSimulatedNotification,
      session,
      showToast,
      snapshot,
      startExamination,
      submitReview,
      toasts,
      toggleClinicActive,
      toggleFavoriteMedicine,
      updateAppointmentStatus,
      updateDoctorStatusAdmin,
      updatePatientProfile,
      updateReviewStatusAdmin,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return ctx;
}
