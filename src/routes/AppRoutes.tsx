import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  AdminLayout,
  DoctorLayout,
  NurseLayout,
  PatientLayout,
  PublicLayout,
} from '../layouts/AppLayouts';
import { RequireRole } from './guards/RequireRole';
import { Skeleton } from '../components/common/UIPrimitives';
import {
  NotFoundPage,
  OnboardingPage,
  RegisterPage,
  WelcomeLoginPage,
} from '../pages/public/PublicPages';
import { DevStyleGuidePage } from '../pages/public/DevStyleGuide';
import {
  BookingConfirmationPage,
  BookingPage,
  DoctorProfilePage,
  DoctorSearchPage,
  PatientDashboardPage,
} from '../pages/patient/PatientDiscoveryAndBooking';
import {
  AppointmentDetailsPage,
  AppointmentsPage,
  MedicalRecordsPage,
  NotificationsPage,
  PatientHelpPage,
  PatientProfilePage,
  PrescriptionsListPage,
  PrescriptionViewPage,
  QueueTrackingPage,
} from '../pages/patient/PatientCareAndRecords';
import {
  DoctorClinicsPage,
  DoctorDashboardPage,
  DoctorNotesPage,
  DoctorPatientProfilePage,
  DoctorPatientsPage,
  DoctorSchedulePage,
  DoctorVisitWorkflowPage,
  PrescriptionBuilderPage,
} from '../pages/doctor/DoctorPages';
import {
  NurseDashboardPage,
  NursePatientsPage,
  NurseQueuePage,
  NurseWalkInPage,
} from '../pages/nurse/NursePages';
import {
  AdminClinicsPage,
  AdminDashboardPage,
  AdminDoctorsPage,
  AdminLocationsPage,
  AdminNursesPage,
  AdminPatientsPage,
  AdminReviewsPage,
  AdminSettingsPage,
  AdminSpecialtiesPage,
} from '../pages/admin/AdminPages';

const RouteFallback: React.FC = () => (
  <div className="max-w-[1200px] mx-auto p-6 space-y-4">
    <Skeleton className="h-10 w-64" />
    <Skeleton className="h-36 w-full" />
    <Skeleton className="h-64 w-full" />
  </div>
);

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Public & Authentication Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<WelcomeLoginPage />} />
          <Route path="/login" element={<WelcomeLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/dev/ui" element={<DevStyleGuidePage />} />
        </Route>

        {/* Patient Area Routes (Protected by RequireRole="patient") */}
        <Route
          path="/patient"
          element={
            <RequireRole role="patient">
              <PatientLayout />
            </RequireRole>
          }
        >
          <Route index element={<PatientDashboardPage />} />
          <Route path="doctors" element={<DoctorSearchPage />} />
          <Route path="doctors/:doctorId" element={<DoctorProfilePage />} />
          <Route path="booking/:doctorId" element={<BookingPage />} />
          <Route
            path="booking-confirmation/:appointmentId"
            element={<BookingConfirmationPage />}
          />
          <Route path="queue/:appointmentId" element={<QueueTrackingPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="appointments/:appointmentId" element={<AppointmentDetailsPage />} />
          <Route path="records" element={<MedicalRecordsPage />} />
          <Route path="prescriptions" element={<PrescriptionsListPage />} />
          <Route path="prescriptions/:prescriptionId" element={<PrescriptionViewPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<PatientProfilePage />} />
          <Route path="help" element={<PatientHelpPage />} />
        </Route>

        {/* Doctor Area Routes (Protected by RequireRole="doctor") */}
        <Route
          path="/doctor"
          element={
            <RequireRole role="doctor">
              <DoctorLayout />
            </RequireRole>
          }
        >
          <Route index element={<DoctorDashboardPage />} />
          <Route path="clinics" element={<DoctorClinicsPage />} />
          <Route path="schedule" element={<DoctorSchedulePage />} />
          <Route path="patients" element={<DoctorPatientsPage />} />
          <Route path="patients/:patientId" element={<DoctorPatientProfilePage />} />
          <Route path="prescriptions/new" element={<PrescriptionBuilderPage />} />
          <Route path="notes" element={<DoctorNotesPage />} />
          <Route path="visit/:appointmentId" element={<DoctorVisitWorkflowPage />} />
        </Route>

        {/* Nurse / Receptionist Area Routes (Protected by RequireRole="nurse") */}
        <Route
          path="/nurse"
          element={
            <RequireRole role="nurse">
              <NurseLayout />
            </RequireRole>
          }
        >
          <Route index element={<NurseDashboardPage />} />
          <Route path="queue" element={<NurseQueuePage />} />
          <Route path="walk-in" element={<NurseWalkInPage />} />
          <Route path="patients" element={<NursePatientsPage />} />
        </Route>

        {/* Super Admin Area Routes (Protected by RequireRole="admin") */}
        <Route
          path="/admin"
          element={
            <RequireRole role="admin">
              <AdminLayout />
            </RequireRole>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="doctors" element={<AdminDoctorsPage />} />
          <Route path="patients" element={<AdminPatientsPage />} />
          <Route path="nurses" element={<AdminNursesPage />} />
          <Route path="clinics" element={<AdminClinicsPage />} />
          <Route path="specialties" element={<AdminSpecialtiesPage />} />
          <Route path="locations" element={<AdminLocationsPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        {/* 404 Catch-All */}
        <Route element={<PublicLayout />}>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
};
