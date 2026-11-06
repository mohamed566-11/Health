import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowDown,
  ArrowUp,
  Bell,
  Calendar,
  Check,
  Clock,
  Phone,
  Play,
  UserCheck,
  UserPlus,
  Users,
  UserX,
  XCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Appointment, AppointmentStatus } from '../../types';
import {
  Button,
  Card,
  InlineAlert,
  StatusBadge,
} from '../../components/common/UIPrimitives';
import {
  PhoneInput,
  SearchInput,
  SelectField,
  TextArea,
  TextInput,
} from '../../components/forms/FormControls';
import { KpiCard } from '../../components/common/DashboardCharts';
import { ConfirmDialog, Modal } from '../../components/modals/Overlays';
import {
  formatDateArabic,
  formatNumber,
  matchesSearch,
} from '../../utils/formatters';
import { validateEgyptianPhone, validateFullName } from '../../utils/validation';
import { TODAY_DATE } from '../../data/appointments';

// 1. Nurse Operational Dashboard Page
export const NurseDashboardPage: React.FC = () => {
  const {
    appointments,
    clinics,
    finishExaminationAndCallNext,
  } = useApp();
  const navigate = useNavigate();

  const clinic = clinics[0];

  useEffect(() => {
    document.title = 'لوحة الاستقبال والتمريض — موعدي';
  }, []);

  const todayList = useMemo(
    () =>
      appointments
        .filter((a) => a.clinicId === clinic.id && a.date === TODAY_DATE)
        .sort((a, b) => a.queuePosition - b.queuePosition),
    [appointments, clinic.id]
  );

  const totalBookings = todayList.length;
  const waitingCount = todayList.filter((a) => a.status === 'waiting' || a.status === 'booked').length;
  const arrivedCount = todayList.filter((a) => a.status === 'arrived').length;
  const completedCount = todayList.filter((a) => a.status === 'completed').length;
  const noShowCount = todayList.filter((a) => a.status === 'no_show').length;

  const currentlyExamining = todayList.find((a) => a.status === 'in_examination') ?? null;
  const nextPatient =
    todayList.find((a) => a.status === 'arrived') ??
    todayList.find((a) => a.status === 'waiting') ??
    todayList.find((a) => a.status === 'booked') ??
    null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1>مكتب الاستقبال وإدارة العيادة</h1>
          <p className="text-[15px] text-[var(--color-secondary-text)]">
            {clinic.name} — {formatDateArabic(TODAY_DATE)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            onClick={() => navigate('/nurse/queue')}
          >
            فتح شاشة التحكم في الطابور
          </Button>
          <Button
            variant="outline"
            icon={<UserPlus className="w-4 h-4" />}
            onClick={() => navigate('/nurse/walk-in')}
          >
            إضافة حالة حضور مباشر
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={<Calendar className="w-6 h-6" />}
          label="إجمالي حجوزات اليوم"
          value={totalBookings}
          unit="حجز"
        />
        <KpiCard
          icon={<UserCheck className="w-6 h-6" />}
          label="حضروا بالاستراحة"
          value={arrivedCount}
          unit="مريض"
        />
        <KpiCard
          icon={<Clock className="w-6 h-6" />}
          label="في الانتظار"
          value={waitingCount}
          unit="مريض"
        />
        <KpiCard
          icon={<Check className="w-6 h-6" />}
          label="تم الكشف عليهم"
          value={completedCount}
          unit="مريض"
        />
      </div>

      {/* Current Examination & Next Patient Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="lg" className="bg-[var(--color-dark-teal)] text-[var(--color-white)] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-bold text-[var(--color-neon-orange)]">
              داخل غرفة الكشف الآن
            </span>
            <Activity className="w-5 h-5 text-[var(--color-neon-orange)]" />
          </div>
          {currentlyExamining ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[24px] font-bold">{currentlyExamining.patientName}</div>
                  <div className="text-[14px] text-[var(--color-white)]/80" dir="ltr">
                    {currentlyExamining.patientPhone}
                  </div>
                </div>
                <span className="text-[32px] font-bold tabular-nums text-[var(--color-neon-orange)]">
                  {currentlyExamining.bookingNumber}
                </span>
              </div>
              <Button
                variant="success-confirm"
                size="lg"
                fullWidth
                icon={<Check className="w-5 h-5" />}
                onClick={() => finishExaminationAndCallNext(clinic.id, TODAY_DATE)}
              >
                إنهاء الكشف واستدعاء التالي
              </Button>
            </>
          ) : (
            <p className="text-[15px]">لا يوجد مريض داخل غرفة الكشف حاليًا.</p>
          )}
        </Card>

        <Card padding="lg" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold text-[var(--color-dark-teal)]">
              المريض التالي في الدور
            </h2>
            <span className="text-[13px] font-semibold text-[var(--color-secondary-text)]">
              لم يحضر اليوم: {formatNumber(noShowCount)}
            </span>
          </div>
          {nextPatient ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] border border-[var(--color-border)]">
                <div>
                  <div className="text-[20px] font-bold">{nextPatient.patientName}</div>
                  <div className="text-[14px] text-[var(--color-secondary-text)]">
                    الموعد: {nextPatient.timeSlot} · الهاتف: <bdi dir="ltr">{nextPatient.patientPhone}</bdi>
                  </div>
                </div>
                <span className="text-[26px] font-bold tabular-nums text-[var(--color-dark-teal)]">
                  {nextPatient.bookingNumber}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => navigate('/nurse/queue')}>
                  إدارة الطابور بالكامل
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-[15px] text-[var(--color-secondary-text)]">
              لا يوجد مرضى في قائمة الانتظار حاليًا.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

// 2. Nurse Daily Patient Queue Control-Room Page (Section 15 & 30)
export const NurseQueuePage: React.FC = () => {
  const {
    appointments,
    clinics,
    startExamination,
    finishExaminationAndCallNext,
    updateAppointmentStatus,
    moveAppointmentInQueue,
    sendSimulatedNotification,
    announceClinicDelay,
    showToast,
  } = useApp();
  const navigate = useNavigate();

  const clinic = clinics[0];
  const [confirmAction, setConfirmAction] = useState<{
    appointment: Appointment;
    targetStatus: AppointmentStatus;
    title: string;
    description: string;
  } | null>(null);
  const [manualReason, setManualReason] = useState('');
  const [delayModalOpen, setDelayModalOpen] = useState(false);
  const [delayMin, setDelayMin] = useState(15);

  useEffect(() => {
    document.title = 'إدارة طابور الكشف الحي — مكتب الاستقبال';
  }, []);

  const todayQueue = useMemo(
    () =>
      appointments
        .filter((a) => a.clinicId === clinic.id && a.date === TODAY_DATE)
        .sort((a, b) => a.queuePosition - b.queuePosition),
    [appointments, clinic.id]
  );

  const currentlyExamining =
    todayQueue.find((a) => a.status === 'in_examination') ?? null;

  const nextEligible =
    todayQueue.find((a) => a.status === 'arrived') ??
    todayQueue.find((a) => a.status === 'waiting') ??
    todayQueue.find((a) => a.status === 'booked') ??
    null;

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1>غرفة التحكم في طابور العيادة اليومي</h1>
          <p className="text-[15px] text-[var(--color-secondary-text)]">
            أي تحديث هنا ينعكس فورًا على شاشة تتبع الدور لدى المريض (Cross-tab sync).
          </p>
        </div>
        <Button
          variant="outline"
          icon={<UserPlus className="w-4 h-4" />}
          onClick={() => navigate('/nurse/walk-in')}
        >
          إضافة حالة حضور مباشر (Walk-in)
        </Button>
      </div>

      {/* Control-Room Two-Column Desktop Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main Column (~65% -> 8 cols): Current Exam Hero + Queue Table/Cards */}
        <div className="lg:col-span-8 space-y-5">
          {/* Current Examination Hero Card */}
          <div className="rounded-[var(--radius-lg)] bg-[var(--color-dark-teal)] text-[var(--color-white)] p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="inline-flex items-center gap-2 font-bold text-[15px]">
                <Activity className="w-5 h-5 text-[var(--color-neon-orange)]" />
                <span>الحالة الحالية داخل غرفة الكشف</span>
              </div>
              <span className="text-[13px] text-[var(--color-white)]/80">
                متوسط الكشف: {clinic.avgExamDurationMin} دقيقة
              </span>
            </div>

            {currentlyExamining ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-[var(--color-white)]/15">
                <div>
                  <div className="text-[24px] font-bold">{currentlyExamining.patientName}</div>
                  <div className="text-[14px] text-[var(--color-white)]/85">
                    رقم الهاتف: <bdi dir="ltr">{currentlyExamining.patientPhone}</bdi> · وقت الحجز:{' '}
                    {currentlyExamining.timeSlot}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-teal-hover)] text-[var(--color-neon-orange)] text-[28px] font-bold tabular-nums">
                    {currentlyExamining.bookingNumber}
                  </span>
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t border-[var(--color-white)]/15 flex items-center justify-between">
                <span>غرفة الكشف خالية حاليًا. اضغط "بدء الكشف" لإدخال المريض التالي.</span>
                {nextEligible && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => startExamination(nextEligible.id)}
                  >
                    بدء الكشف لـ {nextEligible.bookingNumber}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Desktop Queue Table (>= 768px) */}
          <Card padding="none" className="hidden md:block overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <h2 className="text-[18px] font-bold">قائمة انتظار اليوم بالكامل</h2>
              <span className="text-[13px] text-[var(--color-secondary-text)]">
                إجمالي المسجلين: {formatNumber(todayQueue.length)}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-[15px] border-collapse">
                <thead>
                  <tr className="bg-[var(--color-muted)] text-[var(--color-secondary-text)] border-b border-[var(--color-border)] text-[13px]">
                    <th className="py-3 px-4 text-start">الترتيب</th>
                    <th className="py-3 px-4 text-start">رقم الحجز</th>
                    <th className="py-3 px-4 text-start">اسم المريض والهاتف</th>
                    <th className="py-3 px-4 text-start">الموعد</th>
                    <th className="py-3 px-4 text-start">الحالة</th>
                    <th className="py-3 px-4 text-start">إجراءات التحكم</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  {todayQueue.map((apt) => {
                    const isActive = ['in_examination', 'arrived', 'waiting', 'booked'].includes(
                      apt.status
                    );
                    return (
                      <tr
                        key={apt.id}
                        className={`hover:bg-[var(--color-light-teal)]/50 transition-colors ${
                          apt.status === 'in_examination' ? 'bg-[var(--color-light-teal)]' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 font-bold tabular-nums">
                          {isActive ? formatNumber(apt.queuePosition) : '—'}
                        </td>
                        <td className="py-3.5 px-4 font-bold tabular-nums text-[var(--color-dark-teal)]">
                          {apt.bookingNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[var(--color-primary-text)]">
                            {apt.patientName}
                          </div>
                          <div className="text-[13px] text-[var(--color-secondary-text)]" dir="ltr">
                            {apt.patientPhone}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 tabular-nums text-[14px]">{apt.timeSlot}</td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={apt.status} size="sm" />
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {apt.status !== 'in_examination' &&
                              apt.status !== 'completed' &&
                              apt.status !== 'cancelled' && (
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => startExamination(apt.id)}
                                >
                                  بدء الكشف
                                </Button>
                              )}

                            {(apt.status === 'waiting' || apt.status === 'booked') && (
                              <button
                                type="button"
                                onClick={() => updateAppointmentStatus(apt.id, 'arrived')}
                                className="px-2.5 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-dark-teal)] text-[13px] font-semibold text-[var(--color-dark-teal)] hover:bg-[var(--color-light-teal)] cursor-pointer"
                              >
                                وصل العيادة
                              </button>
                            )}

                            {isActive && apt.status !== 'in_examination' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => moveAppointmentInQueue(apt.id, 'up')}
                                  aria-label={`تقديم ${apt.patientName} في الدور`}
                                  title="تقديم في الدور"
                                  className="w-8 h-8 rounded border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-light-teal)] cursor-pointer"
                                >
                                  <ArrowUp className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveAppointmentInQueue(apt.id, 'down')}
                                  aria-label={`تأخير ${apt.patientName} في الدور`}
                                  title="تأخير في الدور"
                                  className="w-8 h-8 rounded border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-light-teal)] cursor-pointer"
                                >
                                  <ArrowDown className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmAction({
                                      appointment: apt,
                                      targetStatus: 'no_show',
                                      title: 'تسجيل عدم حضور المريض (No Show)',
                                      description: `هل تريد تسجيل المريض "${apt.patientName}" (${apt.bookingNumber}) كـ "لم يحضر" واستبعاده من الطابور النشط؟`,
                                    })
                                  }
                                  className="px-2 py-1 rounded text-[12px] font-semibold text-[var(--color-secondary-text)] hover:bg-[var(--color-muted)] cursor-pointer"
                                >
                                  لم يحضر
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmAction({
                                      appointment: apt,
                                      targetStatus: 'cancelled',
                                      title: 'إلغاء حجز المريض',
                                      description: `سيتم إلغاء حجز "${apt.patientName}" (${apt.bookingNumber}). هل أنت متأكد؟`,
                                    })
                                  }
                                  className="px-2 py-1 rounded text-[12px] font-semibold text-[var(--color-red)] hover:bg-[var(--color-red-subtle)] cursor-pointer"
                                >
                                  إلغاء
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile Stacked Queue Cards (< 768px) */}
          <div className="md:hidden space-y-3">
            {todayQueue.map((apt) => (
              <Card key={apt.id} padding="md" className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] font-bold tabular-nums">
                      {apt.bookingNumber}
                    </span>
                    <strong className="text-[16px]">{apt.patientName}</strong>
                  </div>
                  <StatusBadge status={apt.status} size="sm" />
                </div>
                <div className="text-[13px] text-[var(--color-secondary-text)] flex justify-between">
                  <span dir="ltr">{apt.patientPhone}</span>
                  <span>الموعد: {apt.timeSlot}</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--color-border)]">
                  {apt.status !== 'in_examination' && apt.status !== 'completed' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => startExamination(apt.id)}
                    >
                      بدء الكشف
                    </Button>
                  )}
                  {(apt.status === 'waiting' || apt.status === 'booked') && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateAppointmentStatus(apt.id, 'arrived')}
                    >
                      وصل العيادة
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Side Column (~35% -> 4 cols): Next Patient & Big Primary Actions & Communication */}
        <aside className="lg:col-span-4 space-y-5 sticky top-[88px]">
          <Card padding="md" className="space-y-4">
            <h2 className="text-[18px] font-bold text-[var(--color-dark-teal)]">
              الإجراء السريع للطابور
            </h2>

            {nextEligible && (
              <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] border border-[var(--color-border)]">
                <div className="text-[12px] font-bold text-[var(--color-secondary-text)]">
                  المريض التالي للاستدعاء:
                </div>
                <div className="flex items-center justify-between mt-1">
                  <strong className="text-[17px]">{nextEligible.patientName}</strong>
                  <span className="text-[20px] font-bold tabular-nums text-[var(--color-dark-teal)]">
                    {nextEligible.bookingNumber}
                  </span>
                </div>
              </div>
            )}

            <Button
              variant="success-confirm"
              size="lg"
              fullWidth
              icon={<Check className="w-5 h-5" />}
              onClick={() => finishExaminationAndCallNext(clinic.id, TODAY_DATE)}
            >
              إنهاء الكشف واستدعاء التالي
            </Button>

            {nextEligible && !currentlyExamining && (
              <Button
                variant="secondary"
                size="md"
                fullWidth
                icon={<Play className="w-4 h-4" />}
                onClick={() => startExamination(nextEligible.id)}
              >
                بدء الكشف للمريض التالي
              </Button>
            )}
          </Card>

          {/* Communication Shortcuts */}
          <Card padding="md" className="space-y-3">
            <h3 className="text-[16px] font-bold">التواصل والتنبيهات للمرضى</h3>
            <Button
              variant="outline"
              size="sm"
              fullWidth
              icon={<Bell className="w-4 h-4" />}
              onClick={() => {
                if (nextEligible) {
                  sendSimulatedNotification({
                    userId: nextEligible.patientId,
                    type: 'you_are_next',
                    title: 'اقترب دورك للدخول',
                    message: `رقم حجزك ${nextEligible.bookingNumber}: يرجى التوجه إلى غرفة الكشف الآن.`,
                    linkTo: `/patient/queue/${nextEligible.id}`,
                  });
                  showToast(`تم إرسال تنبيه اقتراب الدور للمريض: ${nextEligible.patientName}`, 'success');
                }
              }}
            >
              إشعار للمريض التالي باقتراب دوره
            </Button>

            <Button
              variant="outline"
              size="sm"
              fullWidth
              icon={<Phone className="w-4 h-4" />}
              onClick={() => {
                if (nextEligible) {
                  showToast(
                    `جاري الاتصال الهاتفي (محاكاة) بـ ${nextEligible.patientName}: ${nextEligible.patientPhone}`,
                    'info'
                  );
                }
              }}
            >
              اتصال هاتفي بالمريض التالي (محاكاة)
            </Button>

            <Button
              variant="ghost"
              size="sm"
              fullWidth
              icon={<Clock className="w-4 h-4" />}
              onClick={() => setDelayModalOpen(true)}
            >
              إعلان تأخير في مواعيد العيادة
            </Button>
          </Card>
        </aside>
      </div>

      {/* Mobile Sticky Bottom One-Handed Action Bar */}
      <div
        className="lg:hidden fixed bottom-0 inset-x-0 z-[var(--z-sticky)] bg-[var(--color-white)] border-t border-[var(--color-border)] p-3 flex items-center gap-2.5 no-print"
        style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom))' }}
      >
        <Button
          variant="success-confirm"
          size="md"
          className="flex-1"
          onClick={() => finishExaminationAndCallNext(clinic.id, TODAY_DATE)}
        >
          إنهاء واستدعاء التالي
        </Button>
        {nextEligible && (
          <Button
            variant="secondary"
            size="md"
            onClick={() => startExamination(nextEligible.id)}
          >
            بدء الكشف
          </Button>
        )}
      </div>

      {/* Confirmation Modal with Optional Reason */}
      <Modal
        open={Boolean(confirmAction)}
        onClose={() => {
          setConfirmAction(null);
          setManualReason('');
        }}
        title={confirmAction?.title ?? 'تأكيد'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmAction(null)}>
              تراجع
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (confirmAction) {
                  updateAppointmentStatus(
                    confirmAction.appointment.id,
                    confirmAction.targetStatus,
                    manualReason || undefined
                  );
                  setConfirmAction(null);
                  setManualReason('');
                }
              }}
            >
              تأكيد الإجراء
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-[15px]">{confirmAction?.description}</p>
          <TextInput
            label="سبب التعديل اليدوي (اختياري)"
            placeholder="مثال: اعتذار المريض هاتفيًا أو تأخره عن الموعد..."
            value={manualReason}
            onChange={(e) => setManualReason(e.target.value)}
          />
        </div>
      </Modal>

      {/* Announce Delay Modal */}
      <Modal
        open={delayModalOpen}
        onClose={() => setDelayModalOpen(false)}
        title="إعلان تأخير للمرضى في الطابور"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDelayModalOpen(false)}>
              إلغاء
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                announceClinicDelay(clinic.id, delayMin);
                setDelayModalOpen(false);
              }}
            >
              إرسال الإشعار
            </Button>
          </>
        }
      >
        <SelectField
          label="مدة التأخير المتوقعة"
          value={String(delayMin)}
          onChange={(e) => setDelayMin(Number(e.target.value))}
          options={[
            { value: '15', label: '15 دقيقة' },
            { value: '30', label: '30 دقيقة' },
            { value: '45', label: '45 دقيقة' },
          ]}
        />
      </Modal>
    </div>
  );
};

// 3. Nurse Walk-In Patient Registration Page (Section 15)
export const NurseWalkInPage: React.FC = () => {
  const { clinics, addWalkInAppointment } = useApp();
  const navigate = useNavigate();

  const clinic = clinics[0];
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState('35');
  const [queuePosition, setQueuePosition] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    document.title = 'إضافة حالة حضور مباشر (Walk-in) — مكتب الاستقبال';
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErr: Record<string, string> = {};
    const nameCheck = validateFullName(patientName);
    if (!nameCheck.valid) nextErr.name = nameCheck.error!;
    const phoneCheck = validateEgyptianPhone(patientPhone);
    if (!phoneCheck.valid) nextErr.phone = phoneCheck.error!;
    setErrors(nextErr);
    if (Object.keys(nextErr).length > 0) return;

    addWalkInAppointment({
      patientName,
      patientPhone,
      patientAge: patientAge ? Number(patientAge) : undefined,
      clinicId: clinic.id,
      doctorId: clinic.doctorId,
      queuePosition: queuePosition ? Number(queuePosition) : undefined,
      adminNotes,
    });
    navigate('/nurse/queue');
  };

  return (
    <div className="max-w-[640px] mx-auto space-y-6">
      <div>
        <h1>إضافة حالة حضور مباشر بدون حجز مسبق (Walk-in)</h1>
        <p className="text-[15px] text-[var(--color-secondary-text)]">
          تسجيل مريض حضر مباشرة إلى مكتب الاستقبال وإدراجه في طابور اليوم.
        </p>
      </div>

      <Card padding="lg">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="اسم المريض الكامل"
              required
              placeholder="مثال: سعيد عبد الله محمود"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              error={errors.name}
            />
            <PhoneInput
              label="رقم الموبايل المصري"
              required
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              error={errors.phone}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput
              label="السن (اختياري)"
              type="number"
              value={patientAge}
              onChange={(e) => setPatientAge(e.target.value)}
            />
            <TextInput
              label="ترتيب الطابور المطلوب (اتركه فارغًا للإضافة في نهاية الطابور)"
              type="number"
              placeholder="تلقائي"
              value={queuePosition}
              onChange={(e) => setQueuePosition(e.target.value)}
            />
          </div>

          <TextArea
            label="ملاحظات إدارية للاستقبال (اختياري)"
            placeholder="مثال: كشف مستعجل أو تحويل من طوارئ..."
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
          />

          <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
            <Button type="submit" variant="primary" size="lg">
              إضافة للطابور وإصدار رقم دخول
            </Button>
            <Button variant="ghost" onClick={() => navigate('/nurse/queue')}>
              إلغاء
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

// 4. Nurse Patients Directory Page (Administrative Info Only — No Private Clinical Notes!)
export const NursePatientsPage: React.FC = () => {
  const { patients, appointments } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.title = 'دليل المرضى والحجوزات — مكتب الاستقبال';
  }, []);

  const filtered = useMemo(
    () =>
      patients.filter(
        (p) => matchesSearch(p.name, query) || p.phone.includes(query.trim())
      ),
    [patients, query]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1>دليل المرضى المسجلين (بيانات الاستقبال)</h1>
        <p className="text-[15px] text-[var(--color-secondary-text)]">
          عرض بيانات الاتصال والحجوزات الإدارية فقط — الملاحظات الطبية الخاصة بالطبيب محجوبة تمامًا.
        </p>
      </div>

      <Card padding="sm">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="ابحث باسم المريض أو رقم الهاتف..."
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const patientApts = appointments.filter((a) => a.patientId === p.id);
          return (
            <Card key={p.id} padding="md" className="space-y-2">
              <div className="font-bold text-[17px]">{p.name}</div>
              <div className="text-[14px] text-[var(--color-secondary-text)]" dir="ltr">
                {p.phone}
              </div>
              <div className="text-[13px] text-[var(--color-secondary-text)]">
                المحافظة: {p.governorate} — {p.city} · إجمالي الحجوزات: {formatNumber(patientApts.length)}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
