export type UserRole = 'patient' | 'doctor' | 'nurse' | 'admin';

export type AppointmentStatus =
  | 'booked'
  | 'waiting'
  | 'arrived'
  | 'in_examination'
  | 'completed'
  | 'no_show'
  | 'cancelled';

export interface UserSession {
  id: string;
  role: UserRole;
  name: string;
  phone?: string;
  specialty?: string;
  clinicId?: string;
}

export interface Specialty {
  id: string;
  nameAr: string;
  nameEn: string;
  description: string;
  iconName: string;
  active: boolean;
}

export interface GovernorateLocation {
  id: string;
  nameAr: string;
  nameEn: string;
  cities: {
    id: string;
    nameAr: string;
    districts: string[];
  }[];
}

export interface Clinic {
  id: string;
  doctorId: string;
  name: string;
  address: string;
  governorate: string;
  city: string;
  district: string;
  landmark: string;
  distanceKm: number;
  workingDays: string[];
  startTime: string; // e.g. "10:00"
  endTime: string;   // e.g. "21:00"
  breakStart?: string;
  breakEnd?: string;
  consultationPrice: number;
  followUpPrice: number;
  dailyPatientLimit: number;
  avgExamDurationMin: number;
  isActive: boolean;
  bookingsPaused?: boolean;
  announcedDelayMin?: number;
  closedDates?: string[];
  phone: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialtyId: string;
  specialtyAr: string;
  specialtyEn: string;
  titleAr: string;
  qualifications: string[];
  bio: string;
  yearsExperience: number;
  rating: number;
  reviewsCount: number;
  consultationFee: number;
  clinicIds: string[];
  status: 'approved' | 'pending' | 'suspended' | 'rejected';
  phone: string;
  nextAvailableText: string;
  doctorStatus: 'available' | 'in_examination' | 'delayed' | 'off_duty';
}

export interface Patient {
  id: string;
  name: string;
  phone: string;
  birthDate: string;
  gender: 'male' | 'female';
  governorate: string;
  city: string;
  allergies: string[];
  chronicConditions: string[];
  bloodType?: string;
  onboardingCompleted: boolean;
  notificationPrefs: {
    queueAlerts: boolean;
    appointmentReminders: boolean;
    prescriptionReady: boolean;
  };
  createdAt: string;
}

export interface Nurse {
  id: string;
  name: string;
  phone: string;
  clinicId: string;
  doctorId: string;
  shift: string;
  active: boolean;
}

export interface Appointment {
  id: string;
  bookingNumber: string; // e.g. "#025"
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientAge?: number;
  doctorId: string;
  doctorName: string;
  specialtyAr: string;
  clinicId: string;
  clinicName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "06:30 م"
  queuePosition: number;
  status: AppointmentStatus;
  fee: number;
  type: 'consultation' | 'follow_up' | 'walk_in';
  symptomsOrReason?: string;
  adminNotes?: string;
  statusChangeReason?: string;
  diagnosis?: string;
  prescriptionId?: string;
  createdAt: string;
  updatedAt: string;
  examinationStartedAt?: string;
}

export interface MedicineCatalogItem {
  id: string;
  nameEn: string;
  nameAr: string;
  activeIngredient: string;
  strength: string;
  dosageForm: string;
  defaultDosage: string;
  defaultFrequency: string;
  defaultDuration: string;
  defaultFoodRelation: 'قبل الأكل' | 'بعد الأكل' | 'مع الأكل' | 'بدون ارتباط بالأكل';
  isFavorite?: boolean;
  usageCount?: number;
}

export interface PrescribedMedicine {
  id: string;
  medicineId?: string;
  name: string;
  strength: string;
  dosageForm: string;
  dosage: string;
  frequency: string;
  timeOfUse: string;
  foodRelation: string;
  duration: string;
  quantity: string;
  instructions: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientAge?: number;
  doctorId: string;
  doctorName: string;
  doctorTitle: string;
  specialtyAr: string;
  clinicId: string;
  clinicName: string;
  appointmentId?: string;
  date: string;
  diagnosis: string;
  medicines: PrescribedMedicine[];
  additionalNotes: string;
  createdAt: string;
}

export interface PrescriptionTemplate {
  id: string;
  doctorId: string;
  title: string;
  diagnosis: string;
  medicines: PrescribedMedicine[];
  additionalNotes: string;
}

export interface DoctorPrivateNote {
  id: string;
  patientId: string;
  doctorId: string;
  visitId?: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecordItem {
  id: string;
  patientId: string;
  doctorId?: string;
  doctorName: string;
  specialtyAr: string;
  type: 'visit' | 'lab' | 'imaging' | 'report' | 'document';
  title: string;
  summary: string;
  date: string;
  fileMetadata?: {
    fileName: string;
    fileSizeKb: number;
    fileType: string;
  };
}

export interface AppNotification {
  id: string;
  userId: string; // patientId or role target
  type:
    | 'booking_confirmed'
    | 'doctor_delayed'
    | 'five_ahead'
    | 'two_ahead'
    | 'you_are_next'
    | 'appointment_postponed'
    | 'prescription_available';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  linkTo?: string;
}

export interface Review {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  clinicId: string;
  overallRating: number;
  communicationRating: number;
  punctualityRating: number;
  organizationRating: number;
  comment: string;
  status: 'published' | 'flagged' | 'hidden';
  createdAt: string;
}
