import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  Compass,
  FileText,
  LogOut,
  Phone,
  PlusCircle,
  Printer,
  Search,
  ShieldAlert,
  Sparkles,
  User,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { TODAY_DATE } from '../../data/appointments';
import { getPatientSession, setPatientSession } from '../../services/storageService';
import { formatCurrencyEGP, formatDateArabic } from '../../utils/formatters';
import { validateEgyptianPhone } from '../../utils/validation';

export const PatientFindBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { appointments, doctors, clinics, prescriptions, fines } = useApp();

  const [session, setSessionState] = useState(() => getPatientSession());
  const [phoneInput, setPhoneInput] = useState(session?.phone || '');
  const [hasSearched, setHasSearched] = useState(Boolean(session?.phone));
  const [errorMsg, setErrorMsg] = useState('');
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  useEffect(() => {
    document.title = 'حسابي وتذاكر الكشف — موعدي';
  }, []);

  const activePhone = (isEditingPhone ? '' : session?.phone) || (hasSearched ? phoneInput.trim() : '');

  // Patient appointments
  const { upcomingBookings, pastBookings } = useMemo(() => {
    if (!activePhone || activePhone.length < 10) {
      return { upcomingBookings: [], pastBookings: [] };
    }
    const clean = activePhone.trim();
    const all = appointments.filter((a) => a.patientPhone.trim() === clean);

    const upcoming = all
      .filter((a) => a.status !== 'cancelled' && a.status !== 'completed')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const past = all
      .filter((a) => a.status === 'completed' || a.status === 'cancelled')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { upcomingBookings: upcoming, pastBookings: past };
  }, [appointments, activePhone]);

  // Unpaid fines for this phone
  const patientUnpaidFines = useMemo(() => {
    if (!activePhone) return [];
    return fines.filter((f) => f.patientPhone.trim() === activePhone.trim() && f.status === 'unpaid');
  }, [fines, activePhone]);

  const unpaidFinesTotal = patientUnpaidFines.reduce((sum, f) => sum + f.amount, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneVal = validateEgyptianPhone(phoneInput);
    if (!phoneVal.valid) {
      setErrorMsg(phoneVal.error || 'يرجى إدخال رقم موبايل مصري صحيح (11 رقم)');
      return;
    }
    setErrorMsg('');
    setHasSearched(true);
    setIsEditingPhone(false);

    // Save into patient session so user doesn't have to enter it again
    const matchedName = appointments.find((a) => a.patientPhone.trim() === phoneInput.trim())?.patientName || session?.name || 'مريض';
    const nextSession = {
      phone: phoneInput.trim(),
      name: matchedName,
    };
    setPatientSession(nextSession);
    setSessionState(nextSession);
  };

  const handleSwitchAccount = () => {
    setIsEditingPhone(true);
    setPhoneInput('');
  };

  const handleForgetDevice = () => {
    setPatientSession(null);
    setSessionState(null);
    setPhoneInput('');
    setHasSearched(false);
    setIsEditingPhone(true);
  };

  return (
    <div className="max-w-[760px] mx-auto w-full space-y-4 sm:space-y-6 py-3 sm:py-8 px-3 sm:px-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-[var(--color-border)] pb-3 sm:pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] font-bold text-[var(--color-neon-orange)] uppercase mb-0.5 sm:mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>بوابة المريض المباشرة</span>
          </div>
          <h1 className="text-[18px] sm:text-[28px] font-extrabold text-[var(--color-dark-teal)]">
            حسابي وتذاكر الكشف
          </h1>
          <p className="text-[12px] sm:text-[14px] text-[var(--color-secondary-text)]">
            تابع أدوارك الحية، راجع روشتاتك الطبية، واحجز عند أطبائك المفضلين بدون كلمات سر.
          </p>
        </div>

        <Link
          to="/patient"
          className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-[var(--radius-md)] bg-[#FF5533] text-white text-[12.5px] sm:text-[14px] font-bold shadow-xs hover:bg-[#E64525] active:bg-[#CC391B] transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>حجز كشف جديد</span>
        </Link>
      </div>

      {/* Patient Profile Card (if phone is active and not editing) */}
      {activePhone && !isEditingPhone ? (
        <div className="p-3 sm:p-5 rounded-[var(--radius-md)] sm:rounded-[var(--radius-lg)] bg-[var(--color-dark-teal)] text-[var(--color-white)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[var(--color-neon-orange)] text-[var(--color-white)] flex items-center justify-center font-bold text-[14px] sm:text-[18px] shrink-0">
              <User className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="text-[15px] sm:text-[18px] font-extrabold">
                {session?.name || upcomingBookings[0]?.patientName || pastBookings[0]?.patientName || 'أهلاً بك'}
              </div>
              <div className="text-[11.5px] sm:text-[13px] text-[var(--color-white)]/80 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span dir="ltr">{activePhone}</span>
                <span className="text-[var(--color-white)]/40">·</span>
                <span className="text-[var(--color-neon-orange)] font-bold">مسجل على هذا الجهاز</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t sm:border-t-0 border-[var(--color-white)]/15 pt-2 sm:pt-0">
            <button
              type="button"
              onClick={handleSwitchAccount}
              className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-teal-hover)] text-[11px] sm:text-[12.5px] font-bold text-[var(--color-white)] hover:bg-[var(--color-white)] hover:text-[var(--color-dark-teal)] cursor-pointer transition-colors"
            >
              تغيير الرقم
            </button>
            <button
              type="button"
              onClick={handleForgetDevice}
              title="تسجيل الخروج من هذا المتصفح"
              className="p-1 sm:p-1.5 rounded-[var(--radius-sm)] text-[var(--color-white)]/70 hover:text-[var(--color-red)] hover:bg-[var(--color-white)]/10 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Phone Lookup Form */
        <form
          onSubmit={handleSearch}
          className="p-3.5 sm:p-7 rounded-[var(--radius-md)] sm:rounded-[var(--radius-lg)] bg-[var(--color-white)] border-2 border-[var(--color-border)] shadow-sm space-y-3 sm:space-y-4"
        >
          <div className="space-y-1 sm:space-y-1.5">
            <label htmlFor="search-phone" className="block text-[12.5px] sm:text-[14px] font-bold text-[var(--color-primary-text)]">
              أدخل رقم موبايلك لفتح حسابك وتذاكرك:
            </label>
            <input
              id="search-phone"
              type="tel"
              inputMode="tel"
              required
              dir="ltr"
              placeholder="01012345678"
              value={phoneInput}
              onChange={(e) => {
                setPhoneInput(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              style={{ fontSize: '16px' }}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-dark-teal)]/20 outline-none text-[15px] sm:text-[17px] text-end font-semibold tracking-wider text-[var(--color-primary-text)] placeholder:text-[var(--color-secondary-text)]/50 transition-colors"
            />
            {errorMsg && (
              <span className="text-[11px] sm:text-[12px] font-bold text-[var(--color-red)] block mt-1">
                {errorMsg}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-[var(--radius-md)] bg-[var(--color-dark-teal)] hover:bg-[var(--color-teal-hover)] text-[var(--color-white)] font-bold text-[13px] sm:text-[15px] shadow-sm cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>فتح حسابي والتذاكر ←</span>
            </button>
            {session?.phone && (
              <button
                type="button"
                onClick={() => setIsEditingPhone(false)}
                className="px-3 sm:px-4 py-2 sm:py-3 rounded-[var(--radius-md)] bg-[var(--color-muted)] text-[var(--color-secondary-text)] font-bold text-[12px] sm:text-[14px] hover:bg-[var(--color-border)] cursor-pointer"
              >
                إلغاء
              </button>
            )}
          </div>
        </form>
      )}

      {/* Unpaid Fines Notice if any */}
      {unpaidFinesTotal > 0 && (
        <div className="p-3 sm:p-4 rounded-[var(--radius-md)] sm:rounded-[var(--radius-lg)] bg-[var(--color-orange-subtle)] border-2 border-[var(--color-neon-orange)]/40 flex items-center justify-between gap-2.5 sm:gap-3 text-[12px] sm:text-[14px]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-neon-orange)] shrink-0" />
            <div>
              <strong className="block text-[var(--color-primary-text)] font-bold">
                توجد غرامات سابقة معلقة بإجمالي {formatCurrencyEGP(unpaidFinesTotal)}
              </strong>
              <span className="text-[11px] sm:text-[12px] text-[var(--color-secondary-text)]">
                سيتم تحصيلها تلقائيًا بالعيادة عند حضور كشفك القادم.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Active & Upcoming Tickets */}
      {activePhone && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] sm:text-[18px] font-extrabold text-[var(--color-dark-teal)] flex items-center gap-1.5 sm:gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-neon-orange)]" />
              <span>الحجوزات النشطة والقادمة ({upcomingBookings.length})</span>
            </h2>
          </div>

          {upcomingBookings.length === 0 ? (
            <div className="p-4 sm:p-6 rounded-[var(--radius-md)] sm:rounded-[var(--radius-lg)] bg-[var(--color-white)] border border-[var(--color-border)] text-center space-y-1.5 sm:space-y-2">
              <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--color-secondary-text)]/50 mx-auto" />
              <p className="text-[13px] sm:text-[14px] font-bold text-[var(--color-primary-text)]">
                لا توجد حجوزات نشطة حالياً.
              </p>
              <p className="text-[12px] sm:text-[13px] text-[var(--color-secondary-text)]">
                احجز كشفك الآن في ثوانٍ بدون أي تسجيل مسبق وتابع دورك لحظة بلحظة.
              </p>
              <Link
                to="/patient"
                className="inline-block mt-1 sm:mt-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-[var(--radius-md)] bg-[#FF5533] text-white text-[12px] sm:text-[13px] font-bold hover:bg-[#E64525] active:bg-[#CC391B]"
              >
                احجز كشفك الآن ←
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5 sm:space-y-3">
              {upcomingBookings.map((apt) => {
                const doc = doctors.find((d) => d.id === apt.doctorId);
                const cln = clinics.find((c) => c.id === apt.clinicId);
                const isToday = apt.date === TODAY_DATE;

                return (
                  <div
                    key={apt.id}
                    className="p-3 sm:p-5 rounded-[var(--radius-md)] sm:rounded-[var(--radius-lg)] bg-[var(--color-white)] border-2 border-[var(--color-border)] hover:border-[var(--color-dark-teal)] shadow-xs transition-all space-y-2 sm:space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-b border-[var(--color-border)] pb-2 sm:pb-3">
                      <div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-[15px] sm:text-[18px] font-extrabold text-[var(--color-dark-teal)]">
                            {doc?.name}
                          </span>
                          {isToday ? (
                            <span className="text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--color-neon-orange)]/15 text-[var(--color-neon-orange)]">
                              اليوم
                            </span>
                          ) : (
                            <span className="text-[10px] sm:text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                              موعد قادم
                            </span>
                          )}
                        </div>
                        <div className="text-[11.5px] sm:text-[13px] text-[var(--color-secondary-text)] mt-0.5">
                          {doc?.specialtyAr} · {cln?.name} ({cln?.governorate} — {cln?.city})
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <div className="text-start sm:text-end">
                          <span className="text-[10px] sm:text-[11px] text-[var(--color-secondary-text)] block">رقم حجزك</span>
                          <span className="text-[20px] sm:text-[24px] font-black tabular-nums text-[var(--color-neon-orange)]">
                            #{apt.ticketNumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 text-[11.5px] sm:text-[13px] text-[var(--color-secondary-text)]">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="flex items-center gap-1 font-semibold text-[var(--color-primary-text)]">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-dark-teal)]" />
                          <span>{formatDateArabic(apt.date)}</span>
                        </span>
                        <span>·</span>
                        <span className="font-semibold">{apt.timeSlot}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => navigate(`/patient/track/${apt.id}`)}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-[var(--radius-md)] bg-[var(--color-dark-teal)] hover:bg-[var(--color-teal-hover)] text-[var(--color-white)] text-[12px] sm:text-[13.5px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                      >
                        <span>متابعة التذكرة والطابور</span>
                        <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Past Visits & Medical Prescriptions */}
      {activePhone && pastBookings.length > 0 && (
        <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4 border-t border-[var(--color-border)]">
          <h2 className="text-[15px] sm:text-[18px] font-extrabold text-[var(--color-dark-teal)] flex items-center gap-1.5 sm:gap-2">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-dark-teal)]" />
            <span>سجل الزيارات السابقة والروشتات ({pastBookings.length})</span>
          </h2>

          <div className="space-y-2.5 sm:space-y-3">
            {pastBookings.map((apt) => {
              const doc = doctors.find((d) => d.id === apt.doctorId);
              const rx = prescriptions.find((p) => p.appointmentId === apt.id);

              return (
                <div
                  key={apt.id}
                  className="p-3 sm:p-5 rounded-[var(--radius-md)] sm:rounded-[var(--radius-lg)] bg-[var(--color-white)] border border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-[12px] sm:text-[14px]"
                >
                  <div className="space-y-0.5 sm:space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-[14px] sm:text-[16px] text-[var(--color-primary-text)]">{doc?.name}</strong>
                      <span className="text-[11px] sm:text-[12px] px-1.5 py-0.5 rounded-full bg-[var(--color-muted)] text-[var(--color-secondary-text)] font-semibold">
                        {apt.status === 'completed' ? 'تم الكشف ✓' : 'ملغي'}
                      </span>
                    </div>
                    <div className="text-[11.5px] sm:text-[13px] text-[var(--color-secondary-text)]">
                      {formatDateArabic(apt.date)} · عيادة {apt.clinicName}
                    </div>
                    {apt.diagnosis && (
                      <div className="text-[11.5px] sm:text-[12.5px] text-[var(--color-dark-teal)] font-medium">
                        التشخيص: {apt.diagnosis}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {apt.status === 'completed' && (
                      <Link
                        to={`/patient/prescriptions/${rx?.id || 'rx-1'}`}
                        className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] border border-[var(--color-dark-teal)]/30 text-[var(--color-dark-teal)] hover:bg-[var(--color-dark-teal)] hover:text-[var(--color-white)] text-[11.5px] sm:text-[13px] font-bold flex items-center gap-1 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>عرض الروشتة</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="text-center pt-4 sm:pt-6">
        <Link
          to="/patient"
          className="text-[12px] sm:text-[14px] font-bold text-[var(--color-secondary-text)] hover:text-[var(--color-dark-teal)] hover:underline inline-flex items-center gap-1"
        >
          <span>← العودة إلى الصفحة الرئيسية</span>
        </Link>
      </div>
    </div>
  );
};
