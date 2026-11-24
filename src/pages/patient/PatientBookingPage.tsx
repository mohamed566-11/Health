import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle,
  ShieldAlert,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { TODAY_DATE } from '../../data/appointments';
import { checkFollowUpEligibility } from '../../services/queueService';
import { getPatientSession } from '../../services/storageService';
import { formatCurrencyEGP } from '../../utils/formatters';
import { validateEgyptianPhone, validateFullName } from '../../utils/validation';

const DAY_NAMES_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

export const PatientBookingPage: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const navigate = useNavigate();
  const { doctors, clinics, appointments, fines, bookPatientDirect } = useApp();

  const savedSession = useMemo(() => getPatientSession(), []);

  const doctor = doctors.find((d) => d.id === doctorId);
  const clinic = clinics.find((c) => doctor?.clinicIds.includes(c.id)) ?? clinics[0];

  const [name, setName] = useState(savedSession?.name || '');
  const [phone, setPhone] = useState(savedSession?.phone || '');
  const [errorMsg, setErrorMsg] = useState('');

  // Generate next 7 days starting from TODAY_DATE
  const availableDays = useMemo(() => {
    const list: {
      dateStr: string;
      dayName: string;
      label: string;
      isWorking: boolean;
      isAtCapacity: boolean;
      bookedCount: number;
    }[] = [];

    const baseDate = new Date(TODAY_DATE);
    const doctorWorkingDays = clinic?.workingDays || ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
    const maxCapacity = doctor?.maxPatientsPerDay ?? 30;

    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      const dayName = DAY_NAMES_AR[d.getDay()];

      const isWorking = doctorWorkingDays.includes(dayName);
      const bookedCount = appointments.filter(
        (a) => a.doctorId === doctor?.id && a.date === dateStr && a.status !== 'cancelled'
      ).length;
      const isAtCapacity = bookedCount >= maxCapacity;

      const label = i === 0 ? `${dayName} (اليوم)` : `${dayName} ${d.getDate()}/${d.getMonth() + 1}`;

      list.push({
        dateStr,
        dayName,
        label,
        isWorking,
        isAtCapacity,
        bookedCount,
      });
    }

    return list;
  }, [clinic?.workingDays, doctor?.id, doctor?.maxPatientsPerDay, appointments]);

  // First available working day as default
  const defaultAvailableDate = useMemo(() => {
    const firstValid = availableDays.find((d) => d.isWorking && !d.isAtCapacity);
    return firstValid?.dateStr || TODAY_DATE;
  }, [availableDays]);

  const [selectedDate, setSelectedDate] = useState(defaultAvailableDate);

  // Check unpaid fines for phone
  const unpaidFines = useMemo(() => {
    if (!phone || phone.length < 10) return [];
    const clean = phone.trim();
    return fines.filter((f) => f.patientPhone.trim() === clean && f.status === 'unpaid');
  }, [fines, phone]);

  const unpaidFinesTotal = useMemo(() => {
    return unpaidFines.reduce((sum, f) => sum + f.amount, 0);
  }, [unpaidFines]);

  // Check follow-up eligibility
  const followUpCheck = useMemo(() => {
    if (!phone || phone.length < 10 || !doctor) return { isFollowUp: false, daysRemaining: 0 };
    return checkFollowUpEligibility(
      appointments,
      phone,
      doctor.id,
      selectedDate,
      doctor.followUpDays ?? 14
    );
  }, [appointments, phone, doctor, selectedDate]);

  const basePrice = followUpCheck.isFollowUp ? (doctor?.followUpFee ?? 0) : (doctor?.consultationFee ?? 350);
  const totalPrice = basePrice + unpaidFinesTotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameValidation = validateFullName(name);
    if (!nameValidation.valid) {
      setErrorMsg(nameValidation.error || 'يرجى إدخال اسم ثلاثي أو ثنائي صحيح');
      return;
    }

    const phoneValidation = validateEgyptianPhone(phone);
    if (!phoneValidation.valid) {
      setErrorMsg(phoneValidation.error || 'يرجى إدخال رقم موبايل مصري صحيح (11 رقم)');
      return;
    }

    if (!selectedDate) {
      setErrorMsg('يرجى اختيار يوم الكشف');
      return;
    }

    if (!doctor) {
      setErrorMsg('بيانات الطبيب غير متوفرة');
      return;
    }

    setErrorMsg('');
    const newAppointment = bookPatientDirect({
      name: name.trim(),
      phone: phone.trim(),
      doctorId: doctor.id,
      date: selectedDate,
    });

    navigate(`/patient/track/${newAppointment.id}`);
  };

  if (!doctor) {
    return (
      <div className="max-w-[540px] mx-auto w-full py-12 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[var(--color-muted)] text-[var(--color-secondary-text)] flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-[22px] font-bold text-[var(--color-dark-teal)]">الطبيب غير متاح حاليًا</h2>
        <p className="text-[14px] text-[var(--color-secondary-text)]">
          لم يتم العثور على بيانات هذا الطبيب، قد يكون تم تحديث المعرف. يرجى اختيار طبيب آخر من القائمة.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => navigate('/patient')}
            className="px-5 py-2.5 rounded-[var(--radius-md)] bg-[#FF5533] hover:bg-[#E64525] text-white font-bold text-[14px] shadow-sm cursor-pointer"
          >
            العودة لاختيار طبيب ←
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[620px] mx-auto w-full space-y-4 sm:space-y-6 py-3 sm:py-8">
      {/* Doctor Header Card */}
      <div className="p-3 sm:p-5 rounded-[var(--radius-lg)] bg-[var(--color-dark-teal)] text-[var(--color-white)] shadow-sm space-y-1 sm:space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-[12px] font-bold text-[var(--color-neon-orange)]">
            حجز كشف جديد
          </span>
          <span className="text-[11px] sm:text-[12px] text-[var(--color-white)]/80">
            {clinic?.name}
          </span>
        </div>
        <h1 className="text-[18px] sm:text-[24px] font-bold">
          {doctor.name}
        </h1>
        <p className="text-[12px] sm:text-[13.5px] text-[var(--color-white)]/85">
          {doctor.titleAr} — {doctor.specialtyAr}
        </p>
      </div>

      {/* Main Booking Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3.5 sm:p-7 rounded-[var(--radius-lg)] bg-[var(--color-white)] border-2 border-[var(--color-border)] shadow-sm space-y-4 sm:space-y-6"
      >
        <div className="border-b border-[var(--color-border)] pb-2.5 sm:pb-3">
          <h2 className="text-[16px] sm:text-[18px] font-bold text-[var(--color-dark-teal)]">
            بيانات الحجز واستلام رقم الدور
          </h2>
          <p className="text-[12px] sm:text-[13px] text-[var(--color-secondary-text)]">
            اكتب اسمك ورقم تليفونك فقط لتسليمك التذكرة ومتابعة دورك مباشرة.
          </p>
        </div>

        {errorMsg && (
          <div className="p-2.5 sm:p-3 rounded-[var(--radius-sm)] bg-[var(--color-red-subtle)] border border-[var(--color-red)] text-[var(--color-red)] text-[12px] sm:text-[13px] font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 1. Name */}
        <div className="space-y-1">
          <label htmlFor="patient-name" className="block text-[13px] sm:text-[14px] font-bold text-[var(--color-primary-text)]">
            الاسم بالكامل:
          </label>
          <input
            id="patient-name"
            type="text"
            required
            placeholder="مثال: أحمد محمد علي"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            style={{ fontSize: '16px' }}
            className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-dark-teal)]/20 outline-none text-[16px] text-[var(--color-primary-text)] placeholder:text-[var(--color-secondary-text)]/50 transition-colors"
          />
        </div>

        {/* 2. Phone */}
        <div className="space-y-1">
          <label htmlFor="patient-phone" className="block text-[13px] sm:text-[14px] font-bold text-[var(--color-primary-text)]">
            رقم الموبايل المصري:
          </label>
          <input
            id="patient-phone"
            type="tel"
            inputMode="tel"
            required
            dir="ltr"
            placeholder="01012345678"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            style={{ fontSize: '16px' }}
            className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-dark-teal)]/20 outline-none text-[16px] text-end font-semibold tracking-wider text-[var(--color-primary-text)] placeholder:text-[var(--color-secondary-text)]/50 transition-colors"
          />
          <span className="text-[11px] sm:text-[12px] text-[var(--color-secondary-text)] block">
            سيرتبط سجل كشوفاتك وتذكرتك برقم هذا الموبايل تلقائيًا.
          </span>
        </div>

        {/* 3. Day Picker */}
        <div className="space-y-1.5 sm:space-y-2">
          <label className="block text-[13px] sm:text-[14px] font-bold text-[var(--color-primary-text)]">
            اختر يوم الكشف (خلال الـ 7 أيام القادمة):
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
            {availableDays.map((day) => {
              const isSelected = selectedDate === day.dateStr;
              const disabled = !day.isWorking || day.isAtCapacity;

              return (
                <button
                  key={day.dateStr}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedDate(day.dateStr)}
                  className={`p-2 sm:p-2.5 rounded-[var(--radius-md)] border text-center transition-all cursor-pointer disabled:cursor-not-allowed ${
                    isSelected
                      ? 'bg-[var(--color-dark-teal)] text-[var(--color-white)] border-[var(--color-dark-teal)] shadow-sm'
                      : disabled
                      ? 'bg-[var(--color-muted)] text-[var(--color-secondary-text)]/50 border-[var(--color-border)]/50 line-through opacity-60'
                      : 'bg-[var(--color-white)] text-[var(--color-primary-text)] border-[var(--color-border)] hover:border-[var(--color-dark-teal)]'
                  }`}
                >
                  <div className="font-bold text-[12px] sm:text-[13px]">{day.label}</div>
                  <div className="text-[10px] sm:text-[11px] opacity-80 mt-0.5">
                    {!day.isWorking
                      ? 'إجازة'
                      : day.isAtCapacity
                      ? 'اكتمل العدد'
                      : 'متاح للحجز'}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Follow-Up Badge (if applicable) */}
        {followUpCheck.isFollowUp && (
          <div className="p-2.5 sm:p-3 rounded-[var(--radius-md)] bg-[var(--color-green-subtle)] border border-[var(--color-green)] text-[var(--color-green)] text-[12px] sm:text-[13px] font-bold flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>أنت مؤهل لكشف استشارة / إعادة مجاني!</span>
            </div>
            <span className="text-[11px] sm:text-[12px]">متبقي {followUpCheck.daysRemaining} يوم</span>
          </div>
        )}

        {/* Unpaid Fine Warning (if applicable) */}
        {unpaidFinesTotal > 0 && (
          <div className="p-3 sm:p-3.5 rounded-[var(--radius-md)] bg-[var(--color-orange-subtle)] border border-[var(--color-neon-orange)]/50 text-[var(--color-primary-text)] text-[12px] sm:text-[13px] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[var(--color-neon-orange)]">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>توجد غرامة سابقة مسجلة على رقم الموبايل:</span>
            </div>
            <p className="text-[11.5px] sm:text-[12.5px] text-[var(--color-secondary-text)]">
              سيتم تحصيل الغرامة في الاستقبال مع الكشف:
              {' '}{formatCurrencyEGP(unpaidFinesTotal)}
            </p>
          </div>
        )}

        {/* Price Breakdown Banner */}
        <div className="p-3 sm:p-4 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] border border-[var(--color-border)] space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-[12.5px] sm:text-[13.5px]">
            <span className="text-[var(--color-secondary-text)]">
              {followUpCheck.isFollowUp ? 'رسوم الاستشارة (إعادة):' : 'سعر الكشف:'}
            </span>
            <strong className="text-[var(--color-primary-text)] tabular-nums">
              {formatCurrencyEGP(basePrice)}
            </strong>
          </div>

          {unpaidFinesTotal > 0 && (
            <div className="flex items-center justify-between text-[12.5px] sm:text-[13.5px] text-[var(--color-neon-orange)]">
              <span>الغرامة السابقة:</span>
              <strong className="tabular-nums">+ {formatCurrencyEGP(unpaidFinesTotal)}</strong>
            </div>
          )}

          <div className="border-t border-[var(--color-border)] pt-2 flex items-center justify-between text-[14.5px] sm:text-[16px] font-extrabold text-[var(--color-dark-teal)]">
            <span>الإجمالي المطلوب دفعه بالعيادة:</span>
            <span className="text-[17px] sm:text-[20px] tabular-nums text-[var(--color-neon-orange)]">
              {formatCurrencyEGP(totalPrice)}
            </span>
          </div>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          className="w-full py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-[var(--radius-md)] bg-[#FF5533] hover:bg-[#E64525] active:bg-[#CC391B] text-white font-bold text-[14.5px] sm:text-[17px] shadow-sm cursor-pointer transition-colors"
        >
          تأكيد الحجز واستلام رقم الدور ←
        </button>

        <p className="text-[11px] sm:text-[12px] text-center text-[var(--color-secondary-text)]">
          بمجرد التأكيد يتم إصدار تذكرتك فوريًا وتظهر أمامك على الشاشة بدون انتظار.
        </p>
      </form>
    </div>
  );
};
