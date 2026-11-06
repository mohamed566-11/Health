import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bell,
  Calendar,
  Check,
  Clock,
  FileText,
  HelpCircle,
  Pill,
  Printer,
  RefreshCw,
  ShieldCheck,
  Stethoscope,
  User,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import {
  Breadcrumbs,
  Button,
  Card,
  EmptyState,
  InlineAlert,
  StatusBadge,
  Tabs,
} from '../../components/common/UIPrimitives';
import {
  DatePicker,
  FileDropzone,
  LocationCascadeSelect,
  PhoneInput,
  SelectField,
  TextInput,
  TimeSlotPicker,
} from '../../components/forms/FormControls';
import { ConfirmDialog, Modal } from '../../components/modals/Overlays';
import { PatientExplainerVideoPlayer } from '../../components/patient/PatientExplainerVideo';
import {
  formatCurrencyEGP,
  formatDateArabic,
  formatMinutesCount,
  formatNumber,
  formatPatientsCount,
  formatRelativeTimeArabic,
  formatShortDateArabic,
} from '../../utils/formatters';
import { calculateQueueMetricsForAppointment } from '../../services/queueService';
import { validateEgyptianPhone, validateFullName } from '../../utils/validation';
import { TODAY_DATE } from '../../data/appointments';

// Live Queue Tracking Page (Section 11 & 30)
export const QueueTrackingPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const {
    appointments,
    clinics,
    doctors,
    lastSyncAt,
    refreshFromStorage,
  } = useApp();
  const navigate = useNavigate();

  // Lightweight polling interval ONLY on queue-related pages (Section 11 & 22)
  useEffect(() => {
    document.title = 'متابعة الدور اللحظي — موعدي';
    const interval = window.setInterval(() => {
      refreshFromStorage();
    }, 3000);
    return () => window.clearInterval(interval);
  }, [refreshFromStorage]);

  const appointment =
    appointments.find((a) => a.id === appointmentId) ??
    appointments.find((a) => a.id === 'apt-6') ??
    appointments[0];

  const clinic = clinics.find((c) => c.id === appointment?.clinicId) ?? clinics[0];
  const doctor = doctors.find((d) => d.id === appointment?.doctorId) ?? doctors[0];

  const metrics = useMemo(
    () =>
      appointment && clinic
        ? calculateQueueMetricsForAppointment(
            appointments,
            appointment,
            clinic.avgExamDurationMin
          )
        : null,
    [appointment, appointments, clinic]
  );

  if (!appointment || !clinic || !doctor || !metrics) {
    return (
      <div className="max-w-[640px] mx-auto py-12 text-center space-y-4">
        <EmptyState
          icon={<Activity className="w-12 h-12" />}
          title="لا توجد بيانات طابور لعرضها"
          description="يرجى اختيار موعد صالح لمتابعة تفاصيل الانتظار اللحظية."
          action={
            <Button variant="primary" onClick={() => navigate('/patient/appointments')}>
              الانتقال إلى حجوزاتي
            </Button>
          }
        />
      </div>
    );
  }

  const doctorStatusLabel = {
    available: 'الطبيب متواجد بالعيادة',
    in_examination: 'الطبيب يفحص مريضًا الآن',
    delayed: `تأخير معلن (${clinic.announcedDelayMin || 15} دقيقة)`,
    off_duty: 'الطبيب خارج أوقات العمل',
  }[doctor.doctorStatus];

  return (
    <div className="space-y-6 max-w-[860px] mx-auto">
      <Breadcrumbs
        items={[
          { label: 'الرئيسية', to: '/patient' },
          { label: 'حجوزاتي', to: '/patient/appointments' },
          { label: `تتبع الدور (${appointment.bookingNumber})` },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1>متابعة الدور المباشر في العيادة</h1>
          <p className="text-[14px] text-[var(--color-secondary-text)]">
            تتحدث البيانات تلقائيًا فور قيام ممرضة الاستقبال باستدعاء المريض التالي.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<RefreshCw className="w-4 h-4" />}
          onClick={refreshFromStorage}
        >
          تحديث الآن
        </Button>
      </div>

      {/* Live Queue Hero Card (aria-live polite) */}
      <div
        aria-live="polite"
        className="rounded-[var(--radius-lg)] bg-[var(--color-dark-teal)] text-[var(--color-white)] p-6 sm:p-8 border border-[var(--color-dark-teal)] space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-white)]/15 pb-4">
          <div className="flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-[var(--color-neon-orange)]" />
            <span className="text-[16px] font-bold">{doctorStatusLabel}</span>
          </div>
          <div className="text-[13px] text-[var(--color-white)]/80">
            آخر تحديث: {formatRelativeTimeArabic(lastSyncAt)}
          </div>
        </div>

        {/* 4 Key Queue Figures (Matches Section 11 Example: #025, Position 5, Ahead 4, ~45 min) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-start">
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-teal-hover)]">
            <div className="text-[13px] text-[var(--color-white)]/75 mb-1">رقم حجزك</div>
            <div className="text-[34px] font-bold tabular-nums text-[var(--color-neon-orange)] leading-none">
              {metrics.bookingNumber}
            </div>
          </div>

          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-teal-hover)]">
            <div className="text-[13px] text-[var(--color-white)]/75 mb-1">ترتيبك الحالي</div>
            <div className="text-[30px] font-bold tabular-nums leading-none">
              {formatNumber(metrics.currentPosition)}
            </div>
          </div>

          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-teal-hover)]">
            <div className="text-[13px] text-[var(--color-white)]/75 mb-1">المرضى قبلك</div>
            <div className="text-[24px] font-bold tabular-nums leading-tight">
              {formatPatientsCount(metrics.patientsAhead)}
            </div>
          </div>

          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-teal-hover)]">
            <div className="text-[13px] text-[var(--color-white)]/75 mb-1">
              الوقت المتبقي (تقريبي)
            </div>
            <div className="text-[24px] font-bold tabular-nums leading-tight">
              {formatMinutesCount(metrics.estimatedWaitMinutes)}
            </div>
          </div>
        </div>

        {/* Horizontal Queue Track */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-[13px] text-[var(--color-white)]/85">
            <span>
              داخل الكشف الآن:{' '}
              <strong className="tabular-nums text-[var(--color-neon-orange)]">
                {metrics.currentlyExamining?.bookingNumber ?? 'لا يوجد'}
              </strong>
            </span>
            <span>موقعك في الطابور ({metrics.bookingNumber})</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-2">
            {metrics.activeQueueList.map((item, idx) => {
              const isMe = item.id === appointment.id;
              const isExam = item.status === 'in_examination';
              return (
                <div
                  key={item.id}
                  className={`flex-1 min-w-[92px] p-2.5 rounded-[var(--radius-sm)] text-center border transition-all ${
                    isMe
                      ? 'bg-[var(--color-neon-orange)] text-[var(--color-white)] border-[var(--color-white)] font-bold'
                      : isExam
                      ? 'bg-[var(--color-green)] text-[var(--color-white)] border-transparent font-bold'
                      : 'bg-[var(--color-teal-hover)] text-[var(--color-white)]/85 border-[var(--color-white)]/15'
                  }`}
                >
                  <div className="text-[12px]">
                    {isExam ? 'داخل الكشف' : isMe ? 'أنت هنا' : `المركز ${idx + 1}`}
                  </div>
                  <div className="text-[16px] tabular-nums font-bold">{item.bookingNumber}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Appointment & Clinic Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card padding="md" className="space-y-3">
          <h2 className="text-[18px] font-bold">بيانات الموعد والعيادة</h2>
          <div className="space-y-2 text-[14px] pt-2 border-t border-[var(--color-border)]">
            <div className="flex justify-between">
              <span className="text-[var(--color-secondary-text)]">الطبيب:</span>
              <strong>{appointment.doctorName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-secondary-text)]">العيادة:</span>
              <span className="font-semibold text-end">{appointment.clinicName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-secondary-text)]">التاريخ:</span>
              <span className="tabular-nums">{formatDateArabic(appointment.date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-secondary-text)]">الحالة الحالية:</span>
              <StatusBadge status={appointment.status} size="sm" />
            </div>
          </div>
        </Card>

        {/* Plain Arabic Explainer for Older Users */}
        <Card padding="md" className="space-y-2 bg-[var(--color-light-teal)]">
          <h2 className="text-[18px] font-bold text-[var(--color-dark-teal)]">
            ماذا يعني هذا؟ (إرشادات للمريض)
          </h2>
          <p className="text-[15px] text-[var(--color-primary-text)] leading-relaxed">
            • <strong>الوقت المتبقي تقريبي:</strong> يُحسب بناءً على متوسط مدة الكشف ({clinic.avgExamDurationMin} دقيقة لكل مريض) وقد يقل أو يزيد قليلًا حسب حالة كل مريض.
          </p>
          <p className="text-[15px] text-[var(--color-primary-text)] leading-relaxed">
            • ننصحك بالتواجد في العيادة عندما يصبح <strong>المرضى قبلك مريضين (2)</strong> لضمان الدخول في موعدك المحدد.
          </p>
        </Card>
      </div>
    </div>
  );
};

// Patient Appointments List Page with 4 Tabs
export const AppointmentsPage: React.FC = () => {
  const { session, appointments, cancelAppointment, postponeAppointment } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'completed' | 'cancelled'>('active');
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
  const [postponeTargetId, setPostponeTargetId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState('2026-11-08');
  const [newSlot, setNewSlot] = useState('06:30 م');

  useEffect(() => {
    document.title = 'حجوزاتي ومواعيدي — موعدي';
  }, []);

  const myAppointments = useMemo(
    () => appointments.filter((a) => a.patientId === (session?.id ?? 'pat-1')),
    [appointments, session?.id]
  );

  const categorized = useMemo(() => {
    return {
      active: myAppointments.filter(
        (a) =>
          a.date === TODAY_DATE &&
          ['in_examination', 'arrived', 'waiting', 'booked'].includes(a.status)
      ),
      upcoming: myAppointments.filter(
        (a) =>
          a.date !== TODAY_DATE &&
          ['booked', 'waiting', 'arrived'].includes(a.status)
      ),
      completed: myAppointments.filter((a) => a.status === 'completed'),
      cancelled: myAppointments.filter(
        (a) => a.status === 'cancelled' || a.status === 'no_show'
      ),
    };
  }, [myAppointments]);

  const currentList = categorized[activeTab];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1>حجوزاتي ومواعيدي</h1>
          <p className="text-[15px] text-[var(--color-secondary-text)]">
            تابع حجوزاتك النشطة والقادمة أو استعرض سجل الزيارات المكتملة.
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => navigate('/patient/doctors')}>
          حجز موعد جديد
        </Button>
      </div>

      <Tabs
        tabs={[
          { id: 'active', label: 'الحجوزات النشطة اليوم', count: categorized.active.length },
          { id: 'upcoming', label: 'الحجوزات القادمة', count: categorized.upcoming.length },
          { id: 'completed', label: 'المكتملة', count: categorized.completed.length },
          { id: 'cancelled', label: 'الملغاة', count: categorized.cancelled.length },
        ]}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as typeof activeTab)}
      />

      {currentList.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-8 h-8" />}
          title="لا توجد حجوزات في هذا القسم"
          description="يمكنك البحث عن طبيب وحجز موعد جديد في أي وقت."
          actionLabel="ابحث عن طبيب"
          onAction={() => navigate('/patient/doctors')}
        />
      ) : (
        <div className="space-y-4">
          {currentList.map((apt) => (
            <Card key={apt.id} padding="md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-[var(--radius-sm)] bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] font-bold tabular-nums text-[16px]">
                    {apt.bookingNumber}
                  </span>
                  <div>
                    <h2 className="text-[18px] font-bold">{apt.doctorName}</h2>
                    <p className="text-[13px] text-[var(--color-secondary-text)]">
                      {apt.specialtyAr} · {apt.clinicName}
                    </p>
                  </div>
                </div>
                <StatusBadge status={apt.status} />
              </div>

              <div className="py-3 flex flex-wrap items-center justify-between gap-4 text-[14px]">
                <div className="space-x-4 space-x-reverse">
                  <span className="text-[var(--color-secondary-text)]">التاريخ:</span>{' '}
                  <strong className="tabular-nums">{formatShortDateArabic(apt.date)}</strong>
                  <span className="mx-2">·</span>
                  <span className="text-[var(--color-secondary-text)]">الموعد:</span>{' '}
                  <strong className="tabular-nums">{apt.timeSlot}</strong>
                  <span className="mx-2">·</span>
                  <span className="text-[var(--color-secondary-text)]">الكشف:</span>{' '}
                  <strong className="tabular-nums">{formatCurrencyEGP(apt.fee)}</strong>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {['in_examination', 'arrived', 'waiting', 'booked'].includes(apt.status) && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/patient/queue/${apt.id}`)}
                      >
                        تتبع الدور
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPostponeTargetId(apt.id)}
                      >
                        طلب تأجيل
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setCancelTargetId(apt.id)}
                      >
                        إلغاء الحجز
                      </Button>
                    </>
                  )}
                  {apt.prescriptionId && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Pill className="w-4 h-4" />}
                      onClick={() => navigate(`/patient/prescriptions/${apt.prescriptionId}`)}
                    >
                      عرض الروشتة
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/patient/appointments/${apt.id}`)}
                  >
                    التفاصيل
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={Boolean(cancelTargetId)}
        onClose={() => setCancelTargetId(null)}
        onConfirm={() => {
          if (cancelTargetId) cancelAppointment(cancelTargetId);
        }}
        title="تأكيد إلغاء الحجز"
        description="سيتم إلغاء الحجز وإخراجه من طابور العيادة ولا يمكن التراجع عن هذا الإجراء. هل تريد تأكيد الإلغاء؟"
        confirmLabel="نعم، إلغاء الحجز"
      />

      {/* Postpone Appointment Modal */}
      <Modal
        open={Boolean(postponeTargetId)}
        onClose={() => setPostponeTargetId(null)}
        title="طلب تأجيل الموعد"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPostponeTargetId(null)}>
              تراجع
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (postponeTargetId) {
                  postponeAppointment(postponeTargetId, newDate, newSlot);
                  setPostponeTargetId(null);
                }
              }}
            >
              تأكيد الموعد الجديد
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <DatePicker selectedDate={newDate} onSelectDate={setNewDate} />
          <TimeSlotPicker selectedSlot={newSlot} onSelectSlot={setNewSlot} />
        </div>
      </Modal>
    </div>
  );
};

// Appointment Details Page
export const AppointmentDetailsPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const { appointments, clinics, cancelAppointment } = useApp();
  const navigate = useNavigate();
  const [confirmCancel, setConfirmCancel] = useState(false);

  const apt =
    appointments.find((a) => a.id === appointmentId) ?? appointments[0];
  const clinic = clinics.find((c) => c.id === apt?.clinicId) ?? clinics[0];

  useEffect(() => {
    if (apt) {
      document.title = `تفاصيل الحجز ${apt.bookingNumber} — موعدي`;
    }
  }, [apt]);

  if (!apt || !clinic) {
    return (
      <div className="max-w-[640px] mx-auto py-12 text-center space-y-4">
        <EmptyState
          icon={<Calendar className="w-12 h-12" />}
          title="لم يتم العثور على الحجز"
          description="لا توجد بيانات مسجلة لهذا الحجز حاليًا."
          action={
            <Button variant="primary" onClick={() => navigate('/patient/appointments')}>
              العودة إلى حجوزاتي
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-[780px] mx-auto space-y-6">
      <Breadcrumbs
        items={[
          { label: 'الرئيسية', to: '/patient' },
          { label: 'حجوزاتي', to: '/patient/appointments' },
          { label: `حجز ${apt.bookingNumber}` },
        ]}
      />

      <Card padding="lg" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
          <div>
            <span className="text-[13px] font-bold text-[var(--color-secondary-text)]">
              رقم الحجز: {apt.bookingNumber}
            </span>
            <h1 className="text-[24px] font-bold">{apt.doctorName}</h1>
            <p className="text-[15px] text-[var(--color-dark-teal)] font-semibold">
              {apt.specialtyAr}
            </p>
          </div>
          <StatusBadge status={apt.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[15px]">
          <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--color-muted)]">
            <div className="text-[13px] text-[var(--color-secondary-text)]">التاريخ والموعد</div>
            <div className="font-bold tabular-nums">
              {formatDateArabic(apt.date)} — {apt.timeSlot}
            </div>
          </div>
          <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--color-muted)]">
            <div className="text-[13px] text-[var(--color-secondary-text)]">قيمة الكشف</div>
            <div className="font-bold tabular-nums">{formatCurrencyEGP(apt.fee)}</div>
          </div>
          <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--color-muted)] sm:col-span-2">
            <div className="text-[13px] text-[var(--color-secondary-text)]">العيادة والعنوان</div>
            <div className="font-bold">{clinic.name}</div>
            <div className="text-[14px] text-[var(--color-secondary-text)]">
              {clinic.address} — {clinic.landmark}
            </div>
          </div>
          {apt.diagnosis && (
            <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] sm:col-span-2">
              <div className="text-[13px] text-[var(--color-dark-teal)] font-bold">
                التشخيص المسجل للزيارة
              </div>
              <div className="font-semibold">{apt.diagnosis}</div>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            {['in_examination', 'arrived', 'waiting', 'booked'].includes(apt.status) && (
              <Button
                variant="primary"
                onClick={() => navigate(`/patient/queue/${apt.id}`)}
              >
                تتبع دورك الآن
              </Button>
            )}
            {apt.prescriptionId && (
              <Button
                variant="secondary"
                icon={<Pill className="w-4 h-4" />}
                onClick={() => navigate(`/patient/prescriptions/${apt.prescriptionId}`)}
              >
                عرض الروشتة الإلكترونية
              </Button>
            )}
          </div>
          {['waiting', 'booked', 'arrived'].includes(apt.status) && (
            <Button variant="danger" size="sm" onClick={() => setConfirmCancel(true)}>
              إلغاء الحجز
            </Button>
          )}
        </div>
      </Card>

      <ConfirmDialog
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        onConfirm={() => {
          cancelAppointment(apt.id);
          navigate('/patient/appointments');
        }}
        title="إلغاء الحجز"
        description="سيتم إلغاء الحجز ولا يمكن التراجع. هل تريد المتابعة؟"
        confirmLabel="تأكيد الإلغاء"
      />
    </div>
  );
};

// Patient Medical Records Page (Never exposes private doctor notes!)
export const MedicalRecordsPage: React.FC = () => {
  const { session, patients, medicalRecords, addMedicalRecord } = useApp();
  const [filterType, setFilterType] = useState<string>('all');

  const currentPatient =
    patients.find((p) => p.id === (session?.id ?? 'pat-1')) ?? patients[0];

  useEffect(() => {
    document.title = 'السجل الطبي والتقارير — موعدي';
  }, []);

  const myRecords = useMemo(
    () =>
      medicalRecords
        .filter((r) => r.patientId === currentPatient.id)
        .filter((r) => (filterType === 'all' ? true : r.type === filterType)),
    [currentPatient.id, filterType, medicalRecords]
  );

  const typeLabelMap: Record<string, string> = {
    visit: 'زيارة طبية',
    lab: 'تحاليل معملية',
    imaging: 'أشعة وفحوصات',
    report: 'تقرير طبي',
    document: 'ملف مرفق',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>السجل الطبي الشامل</h1>
        <p className="text-[15px] text-[var(--color-secondary-text)]">
          تاريخ الزيارات، التشخيصات، نتائج التحاليل، والأشعة الخاصة بك.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Left Timeline Column */}
        <div className="lg:col-span-8 space-y-6">
          <Tabs
            tabs={[
              { id: 'all', label: 'كل السجلات' },
              { id: 'visit', label: 'الزيارات' },
              { id: 'lab', label: 'التحاليل' },
              { id: 'imaging', label: 'الأشعة' },
              { id: 'report', label: 'التقارير والملفات' },
            ]}
            activeTab={filterType}
            onChange={setFilterType}
          />

          {/* Timeline */}
          <div className="relative ps-6 border-s-2 border-[var(--color-dark-teal)]/30 space-y-5">
            {myRecords.map((rec) => (
              <div key={rec.id} className="relative">
                <span
                  aria-hidden="true"
                  className="w-3.5 h-3.5 rounded-full bg-[var(--color-dark-teal)] ring-4 ring-[var(--color-background)] absolute -start-[31px] top-5"
                />
                <Card padding="md" className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[13px] font-bold text-[var(--color-dark-teal)]">
                      {typeLabelMap[rec.type]} · {rec.specialtyAr}
                    </span>
                    <span className="text-[13px] tabular-nums text-[var(--color-secondary-text)]">
                      {formatShortDateArabic(rec.date)}
                    </span>
                  </div>
                  <h3 className="text-[17px] font-bold text-[var(--color-primary-text)]">
                    {rec.title}
                  </h3>
                  <p className="text-[15px] text-[var(--color-primary-text)]">{rec.summary}</p>
                  <div className="text-[13px] text-[var(--color-secondary-text)] pt-1">
                    الجهة / الطبيب: <strong>{rec.doctorName}</strong>
                    {rec.fileMetadata && (
                      <span className="ms-3 text-[var(--color-dark-teal)] font-semibold">
                        · مرفق: <bdi dir="ltr">{rec.fileMetadata.fileName}</bdi> (
                        {rec.fileMetadata.fileSizeKb} KB)
                      </span>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Medical Summary & Simulated Upload */}
        <aside className="lg:col-span-4 space-y-5 sticky top-[88px]">
          <Card padding="md" className="space-y-4">
            <h2 className="text-[18px] font-bold text-[var(--color-dark-teal)]">
              الملخص الصحي والتنبيهات
            </h2>
            <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--color-red-subtle)] border border-[var(--color-red)]/30">
              <div className="flex items-center gap-2 font-bold text-[14px] text-[var(--color-red)] mb-1">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>الحساسية المسجلة</span>
              </div>
              <p className="text-[14px] text-[var(--color-primary-text)]">
                {currentPatient.allergies.length > 0
                  ? currentPatient.allergies.join(' — ')
                  : 'لا توجد حساسية دوائية مسجلة'}
              </p>
            </div>

            <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] border border-[var(--color-border)] space-y-1.5 text-[14px]">
              <div>
                <span className="text-[var(--color-secondary-text)]">الأمراض المزمنة:</span>{' '}
                <strong>
                  {currentPatient.chronicConditions.join('، ') || 'لا يوجد'}
                </strong>
              </div>
              <div>
                <span className="text-[var(--color-secondary-text)]">فصيلة الدم:</span>{' '}
                <strong dir="ltr">{currentPatient.bloodType ?? 'A+'}</strong>
              </div>
            </div>

            <FileDropzone
              onFileMetadataSelected={(meta) => {
                addMedicalRecord({
                  patientId: currentPatient.id,
                  doctorName: 'ملف مرفوع بواسطة المريض',
                  specialtyAr: 'مستندات وفحوصات',
                  type: 'document',
                  title: `مرفق طبي: ${meta.fileName}`,
                  summary: `تم رفع بيانات الملف (${meta.fileSizeKb} كيلوبايت) وحفظه في السجل التجريبي.`,
                  date: TODAY_DATE,
                  fileMetadata: meta,
                });
              }}
            />
          </Card>
        </aside>
      </div>
    </div>
  );
};

// Patient Prescriptions List Page
export const PrescriptionsListPage: React.FC = () => {
  const { session, prescriptions } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'الروشتات الإلكترونية — موعدي';
  }, []);

  const myPrescriptions = prescriptions.filter(
    (rx) => rx.patientId === (session?.id ?? 'pat-1')
  );

  return (
    <div className="space-y-6">
      <div>
        <h1>الروشتات الإلكترونية</h1>
        <p className="text-[15px] text-[var(--color-secondary-text)]">
          جميع الروشتات الصادرة من أطبائك مع تفاصيل الجرعات وإمكانية الطباعة بصيغة PDF.
        </p>
      </div>

      {myPrescriptions.length === 0 ? (
        <EmptyState
          icon={<Pill className="w-8 h-8" />}
          title="لا توجد روشتات مسجلة"
          description="تظهر الروشتات هنا تلقائيًا بعد إتمام الكشف لدى الطبيب."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {myPrescriptions.map((rx) => (
            <Card key={rx.id} padding="md" className="flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[13px] text-[var(--color-secondary-text)]">
                  <span className="font-bold text-[var(--color-dark-teal)]">
                    {rx.specialtyAr}
                  </span>
                  <span className="tabular-nums">{formatShortDateArabic(rx.date)}</span>
                </div>
                <h2 className="text-[18px] font-bold">{rx.diagnosis}</h2>
                <p className="text-[14px] text-[var(--color-secondary-text)]">
                  الطبيب: <strong>{rx.doctorName}</strong> — {rx.clinicName}
                </p>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {rx.medicines.map((m) => (
                    <span
                      key={m.id}
                      className="text-[13px] text-[var(--color-dark-teal)] bg-[var(--color-light-teal)] px-2.5 py-1 rounded-[var(--radius-sm)] font-semibold"
                    >
                      {m.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-3 border-t border-[var(--color-border)] flex justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<FileText className="w-4 h-4" />}
                  onClick={() => navigate(`/patient/prescriptions/${rx.id}`)}
                >
                  فتح الروشتة والطباعة
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Printable / PDF-Style Prescription View Page (Section 11 & 30)
export const PrescriptionViewPage: React.FC = () => {
  const { prescriptionId } = useParams<{ prescriptionId: string }>();
  const { prescriptions } = useApp();
  const navigate = useNavigate();

  const rx =
    prescriptions.find((p) => p.id === prescriptionId) ?? prescriptions[0];

  useEffect(() => {
    if (rx) {
      document.title = `روشتة طبية (${rx.patientName}) — موعدي`;
    }
  }, [rx]);

  if (!rx) {
    return (
      <div className="max-w-[640px] mx-auto py-12 text-center space-y-4">
        <EmptyState
          icon={<Pill className="w-12 h-12" />}
          title="لم يتم العثور على الروشتة المطلوبة"
          description="قد تكون الروشتة غير متوفرة أو لم تصدر بعد."
          action={
            <Button variant="primary" onClick={() => navigate('/patient/prescriptions')}>
              العودة إلى قائمة الروشتات
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-3 max-w-[794px] mx-auto">
        <Breadcrumbs
          items={[
            { label: 'الرئيسية', to: '/patient' },
            { label: 'الروشتات', to: '/patient/prescriptions' },
            { label: `روشتة ${formatShortDateArabic(rx.date)}` },
          ]}
        />
        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="md"
            icon={<Printer className="w-4 h-4" />}
            onClick={() => window.print()}
          >
            طباعة / حفظ كملف PDF
          </Button>
          <Button variant="ghost" onClick={() => navigate(-1)}>
            رجوع
          </Button>
        </div>
      </div>

      {/* A4 Paper Card (max-w-[794px]) */}
      <div className="overflow-x-auto">
      <article
        aria-label="وثيقة الروشتة الإلكترونية"
        className="prescription-paper max-w-[794px] mx-auto bg-[var(--color-white)] rounded-[var(--radius-lg)] border-2 border-[var(--color-dark-teal)] p-6 sm:p-10 space-y-6"
      >
        {/* Top Demo Medical Disclaimer Banner (Visible on screen AND print) */}
        <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--color-red-subtle)] border border-[var(--color-red)] text-[var(--color-red)] text-center font-bold text-[14px]">
          روشتة تجريبية للعرض فقط — غير صالحة طبيًا ولا يُصرف بها دواء من الصيدليات (DEMO ONLY)
        </div>

        {/* Doctor & Clinic Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b-2 border-[var(--color-dark-teal)]">
          <div>
            <h1 className="text-[24px] font-bold text-[var(--color-dark-teal)]">
              {rx.doctorName}
            </h1>
            <p className="text-[15px] font-semibold text-[var(--color-primary-text)]">
              {rx.doctorTitle} — {rx.specialtyAr}
            </p>
            <p className="text-[13px] text-[var(--color-secondary-text)] mt-1">
              {rx.clinicName}
            </p>
          </div>
          <div className="text-start sm:text-end text-[14px] space-y-1">
            <div>
              <span className="text-[var(--color-secondary-text)]">رقم الروشتة:</span>{' '}
              <strong className="tabular-nums" dir="ltr">
                {rx.id.toUpperCase()}
              </strong>
            </div>
            <div>
              <span className="text-[var(--color-secondary-text)]">تاريخ الإصدار:</span>{' '}
              <strong className="tabular-nums">{formatDateArabic(rx.date)}</strong>
            </div>
          </div>
        </div>

        {/* Patient & Diagnosis Block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] border border-[var(--color-border)] text-[15px]">
          <div>
            <span className="text-[var(--color-secondary-text)]">اسم المريض:</span>{' '}
            <strong>{rx.patientName}</strong>
            {rx.patientAge && <span> ({rx.patientAge} سنة)</span>}
          </div>
          <div>
            <span className="text-[var(--color-secondary-text)]">التشخيص الإكلينيكي:</span>{' '}
            <strong className="text-[var(--color-dark-teal)]">{rx.diagnosis}</strong>
          </div>
        </div>

        {/* Medicines Table */}
        <div className="space-y-3">
          <h2 className="text-[18px] font-bold text-[var(--color-dark-teal)] flex items-center gap-2">
            <Pill className="w-5 h-5" />
            <span>الأدوية الموصوفة والجرعات (℞)</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[14px]">
              <thead>
                <tr className="bg-[var(--color-dark-teal)] text-[var(--color-white)]">
                  <th className="p-3 text-start rounded-ss-[var(--radius-sm)]">الدواء والتركيز</th>
                  <th className="p-3 text-start">الجرعة والتكرار</th>
                  <th className="p-3 text-start">الموعد والارتباط بالأكل</th>
                  <th className="p-3 text-start rounded-se-[var(--radius-sm)]">المدة والكمية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {rx.medicines.map((med) => (
                  <tr key={med.id} className="align-top">
                    <td className="p-3">
                      <div className="font-bold text-[15px] text-[var(--color-primary-text)]">
                        <bdi>{med.name}</bdi>
                      </div>
                      <div className="text-[13px] text-[var(--color-secondary-text)]">
                        {med.dosageForm} · {med.strength}
                      </div>
                      {med.instructions && (
                        <div className="text-[13px] text-[var(--color-dark-teal)] mt-1">
                          تعليمات: {med.instructions}
                        </div>
                      )}
                    </td>
                    <td className="p-3 font-semibold">
                      <div>{med.dosage}</div>
                      <div className="text-[13px] text-[var(--color-secondary-text)]">
                        {med.frequency}
                      </div>
                    </td>
                    <td className="p-3">
                      <div>{med.timeOfUse}</div>
                      <div className="text-[13px] font-semibold text-[var(--color-dark-teal)]">
                        {med.foodRelation}
                      </div>
                    </td>
                    <td className="p-3 tabular-nums">
                      <div className="font-bold">{med.duration}</div>
                      <div className="text-[13px] text-[var(--color-secondary-text)]">
                        {med.quantity}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Notes */}
        {rx.additionalNotes && (
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-muted)] border border-[var(--color-border)]">
            <div className="text-[14px] font-bold text-[var(--color-primary-text)] mb-1">
              إرشادات وتعليمات إضافية للمريض:
            </div>
            <p className="text-[15px] text-[var(--color-primary-text)]">{rx.additionalNotes}</p>
          </div>
        )}

        {/* Footer Disclaimer */}
        <div className="pt-5 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-2 text-[13px] text-[var(--color-secondary-text)]">
          <span>منصة موعدي (Maw3edy) — نموذج روشتة إلكترونية تجريبية</span>
          <span className="font-bold text-[var(--color-red)]">
            روشتة تجريبية — غير صالحة طبيًا
          </span>
        </div>
      </article>
      </div>
    </div>
  );
};

// Patient Notifications Page
export const NotificationsPage: React.FC = () => {
  const {
    session,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'مركز الإشعارات — موعدي';
  }, []);

  const myNotifs = notifications.filter(
    (n) => n.userId === (session?.id ?? 'pat-1')
  );

  return (
    <div className="max-w-[780px] mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1>مركز الإشعارات والتنبيهات</h1>
          <p className="text-[15px] text-[var(--color-secondary-text)]">
            تنبيهات تأكيد الحجز، اقتراب الدور في الطابور، وتوفر الروشتات الإلكترونية.
          </p>
        </div>
        {myNotifs.some((n) => !n.read) && (
          <Button variant="outline" size="sm" onClick={markAllNotificationsRead}>
            تحديد الكل كمقروء
          </Button>
        )}
      </div>

      {myNotifs.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-8 h-8" />}
          title="لا توجد إشعارات حاليًا"
          description="ستصلك تنبيهات الطابور والمواعيد هنا."
        />
      ) : (
        <div className="space-y-3">
          {myNotifs.map((n) => (
            <Card
              key={n.id}
              padding="md"
              className={`flex items-start justify-between gap-4 ${
                !n.read ? 'border-[var(--color-dark-teal)] bg-[var(--color-light-teal)]/50' : ''
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {!n.read && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-neon-orange)]" />
                  )}
                  <h2 className="text-[16px] font-bold">{n.title}</h2>
                  <span className="text-[12px] text-[var(--color-secondary-text)]">
                    · {formatRelativeTimeArabic(n.createdAt)}
                  </span>
                </div>
                <p className="text-[15px] text-[var(--color-primary-text)]">{n.message}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {n.linkTo && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      markNotificationRead(n.id);
                      navigate(n.linkTo!);
                    }}
                  >
                    عرض
                  </Button>
                )}
                {!n.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markNotificationRead(n.id)}
                  >
                    تمت القراءة
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Patient Profile & Settings Page
export const PatientProfilePage: React.FC = () => {
  const {
    session,
    patients,
    locations,
    updatePatientProfile,
    restartOnboarding,
    resetAllDemoData,
  } = useApp();
  const navigate = useNavigate();

  const currentPatient =
    patients.find((p) => p.id === (session?.id ?? 'pat-1')) ?? patients[0];

  const [name, setName] = useState(currentPatient.name);
  const [phone, setPhone] = useState(currentPatient.phone);
  const [birthDate, setBirthDate] = useState(currentPatient.birthDate);
  const [gender, setGender] = useState<'male' | 'female'>(currentPatient.gender);
  const [governorate, setGovernorate] = useState(currentPatient.governorate);
  const [city, setCity] = useState(currentPatient.city);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  useEffect(() => {
    document.title = 'الملف الشخصي والإعدادات — موعدي';
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErr: Record<string, string> = {};
    const nameRes = validateFullName(name);
    if (!nameRes.valid) nextErr.name = nameRes.error!;
    const phoneRes = validateEgyptianPhone(phone);
    if (!phoneRes.valid) nextErr.phone = phoneRes.error!;
    setErrors(nextErr);
    if (Object.keys(nextErr).length > 0) return;

    updatePatientProfile(currentPatient.id, {
      name,
      phone,
      birthDate,
      gender,
      governorate,
      city,
    });
  };

  return (
    <div className="max-w-[760px] mx-auto space-y-6">
      <h1>الملف الشخصي وإعدادات الحساب</h1>

      <Card padding="lg">
        <form onSubmit={handleSave} className="space-y-4">
          <h2 className="text-[18px] font-bold mb-2">البيانات الشخصية الأساسية</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="الاسم الكامل"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
            <PhoneInput
              label="رقم الموبايل المصري"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="تاريخ الميلاد"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
            <SelectField
              label="النوع"
              value={gender}
              onChange={(e) => setGender(e.target.value as 'male' | 'female')}
              options={[
                { value: 'male', label: 'ذكر' },
                { value: 'female', label: 'أنثى' },
              ]}
            />
          </div>

          <LocationCascadeSelect
            locations={locations}
            governorate={governorate}
            city={city}
            onChangeGovernorate={setGovernorate}
            onChangeCity={setCity}
            allowAll={false}
          />

          <div className="pt-4 border-t border-[var(--color-border)] flex justify-start">
            <Button type="submit" variant="primary">
              حفظ التعديلات
            </Button>
          </div>
        </form>
      </Card>

      <Card padding="md" className="space-y-4">
        <h2 className="text-[18px] font-bold">المساعدة وإعدادات الوضع التجريبي</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={() => {
              restartOnboarding(currentPatient.id);
              navigate('/onboarding');
            }}
          >
            إعادة تشغيل الدليل التفاعلي (Onboarding)
          </Button>
          <Button variant="ghost" onClick={() => navigate('/patient/help')}>
            صفحة المساعدة والأسئلة الشائعة
          </Button>
          <Button variant="danger" size="sm" onClick={() => setResetDialogOpen(true)}>
            إعادة ضبط البيانات التجريبية
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={resetAllDemoData}
        title="إعادة ضبط البيانات التجريبية"
        description="سيتم استعادة البيانات الافتراضية للموقع وحذف التغييرات المؤقتة. هل أنت متأكد؟"
        confirmLabel="نعم، إعادة الضبط"
      />
    </div>
  );
};

// Patient Help Page with Restart Onboarding button
export const PatientHelpPage: React.FC = () => {
  const { restartOnboarding } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'المساعدة ودليل الاستخدام — موعدي';
  }, []);

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1>المساعدة والفيديو التوضيحي لاستخدام موعدي</h1>
          <p className="text-[15px] text-[var(--color-secondary-text)]">
            شاهد الفيديو التفاعلي أو تصفح دليل الخطوات المبسط لحجز العيادات ومتابعة الدور اللحظي.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            restartOnboarding();
            navigate('/onboarding');
          }}
        >
          تشغيل الدليل التفاعلي (9 خطوات)
        </Button>
      </div>

      <PatientExplainerVideoPlayer />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card padding="md" className="space-y-2">
          <h2 className="text-[17px] font-bold text-[var(--color-dark-teal)]">
            كيف يتم حساب وقت الانتظار؟
          </h2>
          <p className="text-[14px] text-[var(--color-primary-text)]">
            يحسب النظام عدد المرضى المتواجدين قبلك في الطابور مضروبًا في متوسط زمن الكشف في العيادة، ويتحدث الرقم تلقائيًا كلما أنهت الممرضة كشف مريض.
          </p>
        </Card>

        <Card padding="md" className="space-y-2">
          <h2 className="text-[17px] font-bold text-[var(--color-dark-teal)]">
            هل يمكنني تجربة دور الطبيب أو الممرضة؟
          </h2>
          <p className="text-[14px] text-[var(--color-primary-text)]">
            نعم! من قائمة الحساب أعلى الصفحة، يمكنك التبديل بضغطة واحدة إلى حساب الممرضة أو الطبيب أو مدير النظام لتجربة جميع شاشات المنصة.
          </p>
        </Card>
      </div>
    </div>
  );
};
