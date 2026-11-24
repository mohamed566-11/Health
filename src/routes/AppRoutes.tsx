import React, { Suspense } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import {
  AdminLayout,
  DoctorLayout,
  NurseLayout,
  PublicLayout,
} from '../layouts/AppLayouts';
import { RequireRole } from './guards/RequireRole';
import { Skeleton } from '../components/common/UIPrimitives';
import {
  NotFoundPage,
} from '../pages/public/PublicPages';
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';
import { DevStyleGuidePage } from '../pages/public/DevStyleGuide';
import { WelcomeRoleChooserPage } from '../pages/public/WelcomeRoleChooserPage';
import { PatientLocationPage } from '../pages/patient/PatientLocationPage';
import { PatientSpecialtiesPage } from '../pages/patient/PatientSpecialtiesPage';
import { PatientDoctorsPage } from '../pages/patient/PatientDoctorsPage';
import { PatientBookingPage } from '../pages/patient/PatientBookingPage';
import { PatientTrackingPage } from '../pages/patient/PatientTrackingPage';
import { PatientFindBookingPage } from '../pages/patient/PatientFindBookingPage';
import { PrescriptionViewPage } from '../pages/patient/PrescriptionViewPage';
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
import { DoctorSettingsPage } from '../pages/doctor/DoctorSettingsPage';
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

const ParamRedirectToTrack: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  return <Navigate to={appointmentId ? `/patient/track/${appointmentId}` : '/patient/find'} replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* Public & Patient Flow Routes (No Login Required) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<WelcomeRoleChooserPage />} />
          <Route path="/administration" element={<AdminLoginPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="/onboarding" element={<Navigate to="/" replace />} />
          <Route path="/dev/ui" element={<DevStyleGuidePage />} />

          {/* Redesigned Streamlined Patient Flow */}
          <Route path="/patient" element={<PatientLocationPage />} />
          <Route path="/patient/specialties" element={<PatientSpecialtiesPage />} />
          <Route path="/patient/doctors" element={<PatientDoctorsPage />} />
          <Route path="/patient/book/:doctorId" element={<PatientBookingPage />} />
          <Route path="/patient/track/:appointmentId" element={<PatientTrackingPage />} />
          <Route path="/patient/find" element={<PatientFindBookingPage />} />
          <Route path="/patient/prescriptions/:prescriptionId" element={<PrescriptionViewPage />} />

          {/* Legacy route aliases (prevent 404 on bookmarks & simulated links) */}
          <Route path="/patient/queue/:appointmentId" element={<ParamRedirectToTrack />} />
          <Route path="/patient/appointments/:appointmentId" element={<ParamRedirectToTrack />} />
          <Route path="/patient/appointments" element={<Navigate to="/patient/find" replace />} />
          <Route path="/patient/records" element={<Navigate to="/patient/find" replace />} />
          <Route path="/patient/profile" element={<Navigate to="/patient/find" replace />} />
          <Route path="/patient/help" element={<Navigate to="/patient" replace />} />
          <Route path="/patient/notifications" element={<Navigate to="/patient/find" replace />} />
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
          <Route path="settings" element={<DoctorSettingsPage />} />
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
