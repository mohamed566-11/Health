import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  Bell,
  BellRing,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  MapPin,
  Printer,
  ShieldAlert,
  XCircle,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { TODAY_DATE } from '../../data/appointments';
import { calculatePatientTrackingMetrics } from '../../services/queueService';
import { formatDateArabic } from '../../utils/formatters';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  booked: { label: 'محجوز — في انتظار الحضور', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  arrived: { label: 'وصلت العيادة — بالاستراحة', color: 'bg-teal-50 text-teal-800 border-teal-200' },
  in_examination: { label: 'داخل غرفة الكشف الآن', color: 'bg-orange-50 text-orange-800 border-orange-300 animate-pulse' },
  completed: { label: 'تم الكشف بنجاح', color: 'bg-green-50 text-green-800 border-green-200' },
  late: { label: 'متأخر عن الموعد', color: 'bg-amber-50 text-amber-800 border-amber-300' },
  no_show: { label: 'لم يحضر بالموعد', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  cancelled: { label: 'الحجز ملغي', color: 'bg-red-50 text-red-700 border-red-200' },
};

/**
 * Plays short WebAudio beep without external assets.
 */
function playAlertBeep() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // Ignore audio restriction
  }
}

export const PatientTrackingPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const { appointments, doctors, clinics, updateAppointmentNotifyAt, cancelAppointment, showToast } = useApp();

  const appointment = appointments.find((a) => a.id === appointmentId);
  const doctor = doctors.find((d) => d.id === appointment?.doctorId);
  const clinic = clinics.find((c) => c.id === appointment?.clinicId);

  const [notifiedFired, setNotifiedFired] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  if (!appointment) {
    return (
      <div className="max-w-[540px] mx-auto w-full py-12 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[var(--color-muted)] text-[var(--color-secondary-text)] flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-[22px] font-bold text-[var(--color-dark-teal)]">لم يتم العثور على هذا الحجز</h2>
        <p className="text-[14px] text-[var(--color-secondary-text)]">
          قد يكون رقم الحجز غير صحيح أو تم حذفه. يمكنك البحث برقم هاتفك أو حجز كشف جديد.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            to="/patient/find"
            className="px-5 py-2.5 rounded-[var(--radius-md)] bg-[#FF5533] hover:bg-[#E64525] text-white font-bold text-[14px] shadow-sm"
          >
            البحث برقم الموبايل
          </Link>
          <Link
            to="/patient"
            className="px-5 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-white)] border border-[var(--color-border)] text-[var(--color-primary-text)] font-bold text-[14px]"
          >
            حجز كشف جديد
          </Link>
        </div>
      </div>
    );
  }
  const alertAudioPlayedRef = useRef(false);

  useEffect(() => {
    if (appointment) {
      document.title = `تذكرة دورك #${appointment.ticketNumber} (${doctor?.name || 'العيادة'}) — موعدي`;
    }
  }, [appointment, doctor?.name]);

  const isToday = appointment?.date === TODAY_DATE;

  // Single Source of Truth for the 4 Glanceable Boxes
  const metrics = useMemo(() => {
    if (!appointment) return null;
    return calculatePatientTrackingMetrics(appointment, appointments, doctor);
  }, [appointment, appointments, doctor]);

  const notifyThreshold = appointment?.notifyAt ?? 4;

  // Request Notification permission and save choice
  const handleSetNotifyAt = async (threshold: 3 | 4) => {
    if (!appointment) return;
    updateAppointmentNotifyAt(appointment.id, threshold);

    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        if (Notification.permission === 'default') {
          await Notification.requestPermission();
        }
      } catch {
        // Notification permission handled gracefully
      }
    }
  };

  // Monitor threshold trigger
  useEffect(() => {
    if (!isToday || !metrics || !appointment) return;
    if (appointment.status === 'completed' || appointment.status === 'cancelled') return;

    if (metrics.ahead > 0 && metrics.ahead <= notifyThreshold && !notifiedFired && !alertAudioPlayedRef.current) {
      setNotifiedFired(true);
      alertAudioPlayedRef.current = true;

      // 1. WebAudio Beep
      playAlertBeep();

      // 2. Phone Vibration
      if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }

      // 3. Browser Notification
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification('موعدي — اقترب دورك بالعيادة!', {
            body: `متبقي أمامك ${metrics.ahead} كشوفات فقط. يرجى التوجه للعيادة فورًا.`,
            icon: '/favicon.ico',
          });
        } catch {
          // notification ignore
        }
      }
    }
  }, [isToday, metrics, notifyThreshold, notifiedFired, appointment]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showToast('تم نسخ رابط التذكرة لمشاركتها', 'success');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleConfirmCancel = () => {
    if (!appointment) return;
    cancelAppointment(appointment.id, 'إلغاء من قبل المريض عبر التطبيق');
    setShowCancelModal(false);
    showToast('تم إلغاء الحجز بنجاح', 'info');
  };

  if (!appointment) {
    return (
      <div className="max-w-[560px] mx-auto py-12 text-center space-y-4">
        <h1 className="text-[20px] font-bold text-[var(--color-primary-text)]">
          لم يتم العثور على التذكرة المطلوبة
        </h1>
        <button
          type="button"
          onClick={() => navigate('/patient')}
          className="px-5 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-dark-teal)] text-[var(--color-white)] font-bold cursor-pointer"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const currentStatusInfo = STATUS_LABELS[appointment.status] || {
    label: appointment.status,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const isCancellable = ['booked', 'waiting', 'arrived', 'late'].includes(appointment.status);

  return (
    <div className="max-w-[760px] mx-auto w-full space-y-3.5 sm:space-y-6 py-2.5 sm:py-6 px-3 sm:px-0">
      {/* Alert Banner when Threshold reached */}
      {notifiedFired && isToday && appointment.status !== 'completed' && (
        <div className="p-3 sm:p-4 rounded-[var(--radius-md)] sm:rounded-[var(--radius-lg)] bg-[var(--color-neon-orange)] text-[var(--color-white)] shadow-md flex items-center justify-between gap-2.5 animate-bounce">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 animate-pulse" />
            <div>
              <strong className="block text-[13.5px] sm:text-[15px]">انتبه! اقترب دورك الآن في العيادة</strong>
              <span className="text-[11.5px] sm:text-[13px] opacity-90">
                متبقي أمامك {metrics?.ahead} كشوفات فقط. اتفضل تحرك للعيادة حتى لا يفوتك الدور!
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setNotifiedFired(false)}
            className="px-2.5 py-1 rounded bg-black/20 text-[11px] sm:text-[12px] font-bold hover:bg-black/30 cursor-pointer shrink-0"
          >
            إغلاق
          </button>
        </div>
      )}

      {/* Ticket Header & Status Pill */}
      <div className="p-3 sm:p-5 rounded-[var(--radius-md)] sm:rounded-[var(--radius-lg)] bg-[var(--color-white)] border-2 border-[var(--color-border)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[11px] sm:text-[12px] font-bold text-[var(--color-neon-orange)]">
              تذكرة كشف إلكترونية حية
            </span>
            <span className="text-[var(--color-border)]">·</span>
            <button
              type="button"
              onClick={handleCopyLink}
              className="text-[10.5px] sm:text-[11.5px] font-bold text-[var(--color-dark-teal)] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-600" /> : <Copy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
              <span>{copiedLink ? 'تم نسخ الرابط!' : 'مشاركة الرابط'}</span>
            </button>
          </div>
          <h1 className="text-[17px] sm:text-[22px] font-extrabold text-[var(--color-dark-teal)]">
            {doctor?.name}
          </h1>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11.5px] sm:text-[13px] text-[var(--color-secondary-text)] mt-0.5 sm:mt-1">
            <span>{clinic?.name}</span>
            <span>·</span>
            <span>{formatDateArabic(appointment.date)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-1 shrink-0">
          <span
            className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border text-[11.5px] sm:text-[13px] font-bold inline-flex items-center gap-1.5 self-start sm:self-auto ${currentStatusInfo.color}`}
          >
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current" />
            <span>{currentStatusInfo.label}</span>
          </span>
          <span className="text-[11px] sm:text-[12px] text-[var(--color-secondary-text)]">
            باسم: <strong>{appointment.patientName}</strong> (<bdi dir="ltr">{appointment.patientPhone}</bdi>)
          </span>
        </div>
      </div>

      {/* Future Date Friendly Notice */}
      {!isToday ? (
        <div className="p-4 sm:p-6 rounded-[var(--radius-md)] sm:rounded-[var(--radius-lg)] bg-[var(--color-white)] border-2 border-[var(--color-border)] text-center space-y-2 sm:space-y-3 shadow-sm">
          <Calendar className="w-9 h-9 sm:w-12 sm:h-12 text-[var(--color-dark-teal)] mx-auto opacity-80" />
          <h2 className="text-[16px] sm:text-[20px] font-bold text-[var(--color-dark-teal)]">
            حجزك مؤكد ليوم {formatDateArabic(appointment.date)}
          </h2>
          <p className="text-[12px] sm:text-[14px] text-[var(--color-secondary-text)] max-w-[440px] mx-auto leading-relaxed">
            رقم حجزك المسجل هو <strong className="text-[var(--color-neon-orange)] text-[15px] sm:text-[18px]">#{appointment.ticketNumber}</strong>.
            الأرقام وحركة الطابور الحية هتبدأ تظهر مباشرة يوم الكشف أول ما العيادة تبدأ.
          </p>
          <div className="inline-block p-2.5 sm:p-3 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] border border-[var(--color-border)] text-[11.5px] sm:text-[13px] font-semibold text-[var(--color-dark-teal)]">
            احفظ هذا الرابط، أو أدخل رقم تليفونك في أي وقت لفتح التذكرة.
          </div>
        </div>
      ) : (
        /* The Four Glanceable Boxes (Live Queue Ticket) */
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            {/* Box 1: رقم حجزك */}
            <div className="p-2.5 sm:p-5 rounded-[var(--radius-md)] sm:rounded-[var(--radius-lg)] bg-[var(--color-dark-teal)] text-[var(--color-white)] text-center shadow-sm flex flex-col justify-between">
              <span className="text-[11px] sm:text-[13px] font-bold text-[var(--color-white)]/80 block">
                رقم حجزك
              </span>
              <div className="my-1 sm:my-2">
                <span className="text-[26px] sm:text-[44px] font-black tabular-nums text-[var(--color-neon-orange)]">
                  #{appointment.ticketNumber}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-[var(--color-white)]/70">
                رقمك الثابت بالعيادة
              </span>
            </div>

            {/* Box 2: الدكتور عنده رقم (Displayed Number) */}
            <div className="p-2.5 sm:p-5 rounded-[var(--radius-md)] sm:rounded-[var(--radius-lg)] bg-[var(--color-white)] border-2 border-[var(--color-border)] text-center shadow-sm flex flex-col justify-between">
              <span className="text-[11px] sm:text-[13px] font-bold text-[var(--color-secondary-text)] block">
                الدكتور عنده رقم
              </span>
              <div className="my-1 sm:my-2">
                <span className="text-[26px] sm:text-[44px] font-black tabular-nums text-[var(--color-dark-teal)]">
                  {metrics?.displayedNumber ?? '—'}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-[var(--color-secondary-text)]">
                الرقم المعروض حاليًا
              </span>
            </div>

            {/* Box 3: قدامك كام كشف + Alert Selector */}
            <div className="p-2.5 sm:p-5 rounded-[var(--radius-md)] sm:rounded-[var(--radius-lg)] bg-[var(--color-white)] border-2 border-[var(--color-border)] text-center shadow-sm flex flex-col justify-between">
              <span className="text-[11px] sm:text-[13px] font-bold text-[var(--color-secondary-text)] block">
                قدامك كام كشف
              </span>
              <div className="my-1 sm:my-2">
                <span className="text-[26px] sm:text-[44px] font-black tabular-nums text-[var(--color-neon-orange)]">
                  {metrics?.ahead ?? 0}
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-[var(--color-secondary-text)]">
                {metrics?.ahead === 0 ? 'دورك الآن!' : 'حالات متبقية'}
              </span>
            </div>

            {/* Box 4: الوقت التقريبي */}
            <div className="p-2.5 sm:p-5 rounded-[var(--radius-md)] sm:rounded-[var(--radius-lg)] bg-[var(--color-light-teal)] border-2 border-[var(--color-border)] text-center shadow-sm flex flex-col justify-between">
              <span className="text-[11px] sm:text-[13px] font-bold text-[var(--color-dark-teal)] block">
                الوقت التقريبي
              </span>
              <div className="my-1 sm:my-2">
                {metrics?.isImmediate ? (
                  <span className="text-[14px] sm:text-[20px] font-black text-[var(--color-neon-orange)] block leading-tight">
                    اتفضل روح العيادة دلوقتي
                  </span>
                ) : (
                  <div>
                    <span className="text-[22px] sm:text-[32px] font-black tabular-nums text-[var(--color-dark-teal)]">
                      {metrics?.waitMinutes}
                    </span>
                    <span className="text-[11px] sm:text-[12px] font-bold text-[var(--color-dark-teal)] me-0.5 sm:me-1"> دقيقة</span>
                    <div className="text-[10.5px] sm:text-[11.5px] font-bold text-[var(--color-neon-orange)] mt-0.5">
                      {metrics?.approxClockTime}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] text-[var(--color-secondary-text)]">
                محدث تلقائيًا
              </span>
            </div>
          </div>

          {/* Alert Button (Box 3 Smart Control) */}
          <div className="p-3 sm:p-4 rounded-[var(--radius-md)] sm:rounded-[var(--radius-lg)] bg-[var(--color-white)] border border-[var(--color-border)] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-neon-orange)] shrink-0" />
              <div>
                <strong className="text-[12.5px] sm:text-[13.5px] text-[var(--color-primary-text)] block">
                  خاصية التنبيه الصوتي الذكي
                </strong>
                <span className="text-[11px] sm:text-[12px] text-[var(--color-secondary-text)]">
                  اختر متى تريد أن ننبهك بصوت واهتزاز على الموبايل:
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-center">
              <button
                type="button"
                onClick={() => handleSetNotifyAt(4)}
                className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-[var(--radius-sm)] text-[11px] sm:text-[12.5px] font-bold cursor-pointer transition-colors ${
                  notifyThreshold === 4
                    ? 'bg-[var(--color-dark-teal)] text-[var(--color-white)] shadow-xs'
                    : 'bg-[var(--color-muted)] text-[var(--color-secondary-text)] hover:bg-[var(--color-border)]'
                }`}
              >
                فاضل 4 كشوفات
              </button>
              <button
                type="button"
                onClick={() => handleSetNotifyAt(3)}
                className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-[var(--radius-sm)] text-[11px] sm:text-[12.5px] font-bold cursor-pointer transition-colors ${
                  notifyThreshold === 3
                    ? 'bg-[var(--color-dark-teal)] text-[var(--color-white)] shadow-xs'
                    : 'bg-[var(--color-muted)] text-[var(--color-secondary-text)] hover:bg-[var(--color-border)]'
                }`}
              >
                فاضل 3 كشوفات
              </button>
            </div>
          </div>
          <div className="text-[10.5px] sm:text-[11.5px] text-[var(--color-secondary-text)] px-1">
            * تنبيه: التنبيه الصوتي واهتزاز الموبايل يعمل طالما صفحة المتصفح مفتوحة.
          </div>
        </div>
      )}

      {/* Clinic Details Card */}
      {clinic && (
        <div className="p-3 sm:p-5 rounded-[var(--radius-md)] sm:rounded-[var(--radius-lg)] bg-[var(--color-white)] border border-[var(--color-border)] shadow-xs space-y-1.5 sm:space-y-2">
          <div className="flex items-center gap-1.5 text-[var(--color-dark-teal)] font-bold text-[13.5px] sm:text-[15px]">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-neon-orange)] shrink-0" />
            <span>عنوان العيادة وتفاصيل الوصول:</span>
          </div>
          <p className="text-[12px] sm:text-[13.5px] text-[var(--color-primary-text)] ps-5 sm:ps-6">
            {clinic.address} — {clinic.city}، {clinic.governorate}
            {clinic.landmark && <span className="text-[var(--color-secondary-text)]"> ({clinic.landmark})</span>}
          </p>
          <div className="text-[11px] sm:text-[12.5px] text-[var(--color-secondary-text)] ps-5 sm:ps-6 flex items-center gap-1.5">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>مواعيد عمل العيادة: {clinic.startTime} إلى {clinic.endTime}</span>
          </div>
        </div>
      )}

      {/* Post-Visit Prescription Action */}
      {appointment.status === 'completed' && (
        <div className="p-3.5 sm:p-5 rounded-[var(--radius-md)] sm:rounded-[var(--radius-lg)] bg-[var(--color-green-subtle)] border-2 border-[var(--color-green)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
          <div className="space-y-0.5 sm:space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[14px] sm:text-[16px] text-[var(--color-green)]">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>انتهى الكشف الطبي — الروشتة الإلكترونية جاهزة!</span>
            </div>
            <p className="text-[11.5px] sm:text-[13px] text-[var(--color-primary-text)]">
              تم تسجيل تشخيص الطبيب وإصدار الروشتة وجدول الأدوية بدقة. يمكنك فتحها وطباعتها الآن.
            </p>
          </div>
          <Link
            to={`/patient/prescriptions/${appointment.prescriptionId || 'rx-1'}`}
            className="px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-[var(--radius-md)] bg-[var(--color-green)] text-[var(--color-white)] font-bold text-[12.5px] sm:text-[14px] inline-flex items-center justify-center gap-2 shadow-sm whitespace-nowrap hover:opacity-95 self-start sm:self-auto"
          >
            <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>عرض وطباعة الروشتة</span>
          </Link>
        </div>
      )}

      {/* Pending Fines Banner if any */}
      {(appointment.finesTotal || 0) > 0 && (
        <div className="p-3 sm:p-4 rounded-[var(--radius-md)] bg-[var(--color-orange-subtle)] border border-[var(--color-neon-orange)]/40 flex items-center justify-between gap-2 text-[11.5px] sm:text-[13px]">
          <div className="flex items-center gap-2 text-[var(--color-primary-text)]">
            <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-neon-orange)] shrink-0" />
            <span>توجد غرامة مسجلة على هذا الحجز: {appointment.finesTotal} ج.م</span>
          </div>
          <span className="font-bold text-[var(--color-neon-orange)]">
            {appointment.pricePaid ? 'تم السداد بالعيادة ✓' : 'تُدفع بالاستقبال'}
          </span>
        </div>
      )}

      {/* Patient Actions: Cancel Appointment */}
      {isCancellable && (
        <div className="p-3 sm:p-4 rounded-[var(--radius-md)] bg-[var(--color-muted)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-[11.5px] sm:text-[13px]">
          <div className="text-[var(--color-secondary-text)]">
            هل طرأ ظرف ولن تستطيع الحضور؟ إلغاء الحجز مبكراً يجنبك غرامات عدم الحضور ويفسح المجال لمريض آخر.
          </div>
          <button
            type="button"
            onClick={() => setShowCancelModal(true)}
            className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-red)] text-[var(--color-red)] font-bold text-[11.5px] sm:text-[12.5px] hover:bg-[var(--color-red-subtle)] cursor-pointer whitespace-nowrap self-start sm:self-auto transition-colors"
          >
            إلغاء هذا الحجز
          </button>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4">
          <div className="max-w-[440px] w-full bg-[var(--color-white)] rounded-[var(--radius-md)] sm:rounded-[var(--radius-lg)] p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-[var(--color-red)]">
              <XCircle className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              <h3 className="text-[16px] sm:text-[18px] font-bold">تأكيد إلغاء الحجز</h3>
            </div>
            <p className="text-[12.5px] sm:text-[14px] text-[var(--color-secondary-text)] leading-relaxed">
              هل أنت متأكد من إلغاء تذكرتك رقم <strong className="text-[var(--color-primary-text)]">#{appointment.ticketNumber}</strong> عند {doctor?.name}؟ سيتم حذف دورك من الطابور.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-[var(--radius-md)] bg-[var(--color-muted)] text-[var(--color-primary-text)] font-semibold text-[12px] sm:text-[13px] hover:bg-[var(--color-border)] cursor-pointer"
              >
                تراجع
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-[var(--radius-md)] bg-[var(--color-red)] text-[var(--color-white)] font-bold text-[12px] sm:text-[13px] hover:bg-[var(--color-red-hover)] cursor-pointer"
              >
                نعم، تأكيد الإلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="pt-3 sm:pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
        <Link
          to="/patient"
          className="text-[11.5px] sm:text-[13px] font-bold text-[var(--color-dark-teal)] hover:underline inline-flex items-center gap-1"
        >
          <span>← حجز موعد جديد</span>
        </Link>
        <Link
          to="/patient/find"
          className="text-[11.5px] sm:text-[13px] font-bold text-[var(--color-neon-orange)] hover:underline"
        >
          فتح حسابي وجميع تذاكري
        </Link>
      </div>
    </div>
  );
};
