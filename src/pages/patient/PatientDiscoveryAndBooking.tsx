import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Filter,
  HelpCircle,
  MapPin,
  Pill,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Stethoscope,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import {
  Avatar,
  Breadcrumbs,
  Button,
  Card,
  EmptyState,
  InlineAlert,
  RatingDisplay,
  StatusBadge,
  Stepper,
  Tabs,
} from '../../components/common/UIPrimitives';
import {
  DatePicker,
  LocationCascadeSelect,
  SearchInput,
  SelectField,
  StarRatingInput,
  TextArea,
  TimeSlotPicker,
} from '../../components/forms/FormControls';
import { DoctorCard } from '../../components/cards/DoctorCard';
import { ClinicLocationCard } from '../../components/cards/ClinicLocationCard';
import { Modal } from '../../components/modals/Overlays';
import {
  PatientExplainerVideoModal,
  PatientExplainerVideoPlayer,
} from '../../components/patient/PatientExplainerVideo';
import {
  formatCurrencyEGP,
  formatDateArabic,
  formatDoctorsCount,
  formatMinutesCount,
  formatNumber,
  formatPatientsCount,
  formatShortDateArabic,
  matchesSearch,
} from '../../utils/formatters';
import { calculateQueueMetricsForAppointment } from '../../services/queueService';
import { canSubmitReview } from '../../services/permissions';
import { TODAY_DATE } from '../../data/appointments';

export const PatientDashboardPage: React.FC = () => {
  const {
    session,
    patients,
    doctors,
    clinics,
    specialties,
    appointments,
    prescriptions,
  } = useApp();
  const navigate = useNavigate();
  const [quickSearch, setQuickSearch] = useState('');
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const specialtyScrollRef = useRef<HTMLDivElement>(null);

  const scrollSpecialties = (dir: 'left' | 'right') => {
    const el = specialtyScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  const currentPatient =
    patients.find((p) => p.id === (session?.id ?? 'pat-1')) ?? patients[0];

  useEffect(() => {
    document.title = 'الرئيسية — موعدي (Maw3edy)';
  }, []);

  const myAppointments = useMemo(
    () => appointments.filter((a) => a.patientId === currentPatient.id),
    [appointments, currentPatient.id]
  );

  const activeQueueAppointment = useMemo(
    () =>
      myAppointments.find(
        (a) =>
          a.date === TODAY_DATE &&
          ['in_examination', 'arrived', 'waiting', 'booked'].includes(a.status)
      ) ?? null,
    [myAppointments]
  );

  const upcomingAppointment = useMemo(
    () =>
      myAppointments.find(
        (a) =>
          a.id !== activeQueueAppointment?.id &&
          ['booked', 'waiting', 'arrived'].includes(a.status)
      ) ?? null,
    [activeQueueAppointment?.id, myAppointments]
  );

  const queueMetrics = useMemo(() => {
    if (!activeQueueAppointment) return null;
    const clinic = clinics.find((c) => c.id === activeQueueAppointment.clinicId);
    return calculateQueueMetricsForAppointment(
      appointments,
      activeQueueAppointment,
      clinic?.avgExamDurationMin ?? 15
    );
  }, [activeQueueAppointment, appointments, clinics]);

  const myRecentPrescriptions = useMemo(
    () =>
      prescriptions
        .filter((rx) => rx.patientId === currentPatient.id)
        .slice(0, 3),
    [currentPatient.id, prescriptions]
  );

  const nearbyClinics = useMemo(
    () =>
      [...clinics]
        .filter((c) => c.isActive)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 3),
    [clinics]
  );

  const handleQuickSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(
      quickSearch.trim()
        ? `/patient/doctors?q=${encodeURIComponent(quickSearch.trim())}`
        : '/patient/doctors'
    );
  };

  return (
    <div className="space-y-8">
      {/* Onboarding Prompt if not completed */}
      {!currentPatient.onboardingCompleted && (
        <InlineAlert variant="info" title="دليل الاستخدام التفاعلي متاح لك">
          <div className="flex flex-wrap items-center justify-between gap-3 mt-1">
            <span>تعرف على كيفية حجز المواعيد ومتابعة الطابور في 9 خطوات سريعة ومبسطة.</span>
            <Button size="sm" variant="secondary" onClick={() => navigate('/onboarding')}>
              بدء الدليل التفاعلي
            </Button>
          </div>
        </InlineAlert>
      )}

      {/* Greeting Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1>مرحبًا، {currentPatient.name}</h1>
          <p className="text-[15px] text-[var(--color-secondary-text)]">
            نتمنى لك دوام الصحة والعافية — تابع مواعيدك وسجلك الطبي بكل سهولة.
          </p>
        </div>
        <div className="text-[14px] font-semibold text-[var(--color-dark-teal)] bg-[var(--color-light-teal)] px-3.5 py-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] self-start sm:self-auto">
          {formatDateArabic(TODAY_DATE)}
        </div>
      </div>

      {/* Row 1: Large Search Card */}
      <Card padding="md">
        <form onSubmit={handleQuickSearchSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <SearchInput
                value={quickSearch}
                onChange={setQuickSearch}
                placeholder="ابحث باسم الطبيب، التخصص، أو المحافظة (مثال: د. أحمد محمود، قلب، مدينة نصر)..."
              />
            </div>
            <Button
              type="submit"
              variant="secondary"
              icon={<Search className="w-4 h-4" />}
            >
              بحث عن طبيب
            </Button>
          </div>

          <div className="relative flex items-center gap-1">
            {/* سهم يسار */}
            <button
              type="button"
              onClick={() => scrollSpecialties('left')}
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-[var(--color-light-teal)] hover:bg-[var(--color-teal-subtle)] border border-[var(--color-border)] text-[var(--color-dark-teal)] transition-colors cursor-pointer"
              aria-label="تمرير يسار"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* التخصصات */}
            <div
              ref={specialtyScrollRef}
              className="flex items-center gap-2 overflow-x-auto scrollbar-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <span className="text-[13px] font-semibold text-[var(--color-secondary-text)] shrink-0">
                التخصصات السريعة:
              </span>
              {specialties.map((spec) => (
                <button
                  key={spec.id}
                  type="button"
                  onClick={() =>
                    navigate(`/patient/doctors?specialty=${encodeURIComponent(spec.nameAr)}`)
                  }
                  className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-light-teal)] hover:bg-[var(--color-teal-subtle)] text-[var(--color-dark-teal)] text-[13px] font-semibold border border-[var(--color-border)] whitespace-nowrap shrink-0 cursor-pointer transition-colors"
                >
                  {spec.nameAr}
                </button>
              ))}
            </div>

            {/* سهم يمين */}
            <button
              type="button"
              onClick={() => scrollSpecialties('right')}
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-[var(--color-light-teal)] hover:bg-[var(--color-teal-subtle)] border border-[var(--color-border)] text-[var(--color-dark-teal)] transition-colors cursor-pointer"
              aria-label="تمرير يمين"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </Card>

      {/* Row 1.5: Interactive Patient Explanatory Video Walkthrough */}
      <section aria-label="الفيديو التوضيحي للمريض">
        <PatientExplainerVideoPlayer
          compact
          onExpandModal={() => setVideoModalOpen(true)}
        />
      </section>

      <PatientExplainerVideoModal
        open={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
      />

      {/* Row 2: Two-column layout (Active Queue Hero + Upcoming Appointment | Quick Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          {/* Active Queue Hero Card */}
          {activeQueueAppointment && queueMetrics ? (
            <div className="rounded-[var(--radius-lg)] bg-[var(--color-dark-teal)] text-[var(--color-white)] p-5 sm:p-6 border border-[var(--color-dark-teal)]">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="inline-flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[var(--color-neon-orange)]" />
                  <span className="text-[15px] font-bold">دورك النشط اليوم في العيادة</span>
                </div>
                <span className="text-[13px] text-[var(--color-white)]/80">
                  {activeQueueAppointment.clinicName}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-[var(--color-white)]/15 mb-5">
                <div>
                  <div className="text-[13px] text-[var(--color-white)]/75">رقم حجزك</div>
                  <div className="text-[28px] font-bold tabular-nums text-[var(--color-neon-orange)]">
                    {queueMetrics.bookingNumber}
                  </div>
                </div>
                <div>
                  <div className="text-[13px] text-[var(--color-white)]/75">ترتيبك الحالي</div>
                  <div className="text-[26px] font-bold tabular-nums">
                    المركز {formatNumber(queueMetrics.currentPosition)}
                  </div>
                </div>
                <div>
                  <div className="text-[13px] text-[var(--color-white)]/75">المرضى قبلك</div>
                  <div className="text-[22px] font-bold tabular-nums mt-1">
                    {formatPatientsCount(queueMetrics.patientsAhead)}
                  </div>
                </div>
                <div>
                  <div className="text-[13px] text-[var(--color-white)]/75">
                    الوقت المتبقي (تقريبي)
                  </div>
                  <div className="text-[22px] font-bold tabular-nums mt-1">
                    {formatMinutesCount(queueMetrics.estimatedWaitMinutes)}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-[14px] text-[var(--color-white)]/90">
                  الطبيب: <strong>{activeQueueAppointment.doctorName}</strong> · داخل الكشف الآن:{' '}
                  <strong className="tabular-nums text-[var(--color-neon-orange)]">
                    {queueMetrics.currentlyExamining?.bookingNumber ?? '#021'}
                  </strong>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => navigate(`/patient/queue/${activeQueueAppointment.id}`)}
                >
                  تتبع دورك لحظة بلحظة
                </Button>
              </div>
            </div>
          ) : (
            <Card padding="md" className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-[18px] font-bold mb-1">لا يوجد طابور نشط لك اليوم</h2>
                <p className="text-[14px] text-[var(--color-secondary-text)]">
                  احجز موعدك مع أحد الأطباء المتاحين اليوم لمتابعة دورك لحظة بلحظة.
                </p>
              </div>
              <Button variant="primary" size="md" onClick={() => navigate('/patient/doctors')}>
                احجز موعدًا
              </Button>
            </Card>
          )}

          {/* Upcoming Appointment Card */}
          {upcomingAppointment && (
            <Card padding="md">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="text-[18px] font-bold">موعدك القادم المسجل</h2>
                <StatusBadge status={upcomingAppointment.status} size="sm" />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-[var(--color-border)]">
                <div className="space-y-1">
                  <div className="text-[16px] font-bold text-[var(--color-primary-text)]">
                    {upcomingAppointment.doctorName} — {upcomingAppointment.specialtyAr}
                  </div>
                  <div className="text-[14px] text-[var(--color-secondary-text)]">
                    {upcomingAppointment.clinicName}
                  </div>
                  <div className="text-[14px] font-semibold text-[var(--color-dark-teal)] tabular-nums">
                    {formatShortDateArabic(upcomingAppointment.date)} · الساعة{' '}
                    {upcomingAppointment.timeSlot} · حجز رقم {upcomingAppointment.bookingNumber}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/patient/appointments/${upcomingAppointment.id}`)}
                  >
                    التفاصيل
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Side Column: Quick Actions Grid */}
        <div className="lg:col-span-4">
          <Card padding="md">
            <h2 className="text-[18px] font-bold mb-4">الوصول السريع</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/patient/records"
                className="p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] hover:border-[var(--color-dark-teal)] hover:bg-[var(--color-light-teal)] flex flex-col items-start gap-2 transition-colors"
              >
                <FileText className="w-6 h-6 text-[var(--color-dark-teal)]" />
                <span className="font-bold text-[15px] text-[var(--color-primary-text)]">
                  السجل الطبي
                </span>
                <span className="text-[12px] text-[var(--color-secondary-text)]">
                  الزيارات والتحاليل
                </span>
              </Link>

              <Link
                to="/patient/prescriptions"
                className="p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] hover:border-[var(--color-dark-teal)] hover:bg-[var(--color-light-teal)] flex flex-col items-start gap-2 transition-colors"
              >
                <Pill className="w-6 h-6 text-[var(--color-dark-teal)]" />
                <span className="font-bold text-[15px] text-[var(--color-primary-text)]">
                  الروشتات
                </span>
                <span className="text-[12px] text-[var(--color-secondary-text)]">
                  عرض وطباعة PDF
                </span>
              </Link>

              <Link
                to="/patient/appointments"
                className="p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] hover:border-[var(--color-dark-teal)] hover:bg-[var(--color-light-teal)] flex flex-col items-start gap-2 transition-colors"
              >
                <Calendar className="w-6 h-6 text-[var(--color-dark-teal)]" />
                <span className="font-bold text-[15px] text-[var(--color-primary-text)]">
                  حجوزاتي
                </span>
                <span className="text-[12px] text-[var(--color-secondary-text)]">
                  إدارة وتأجيل المواعيد
                </span>
              </Link>

              <Link
                to="/patient/help"
                className="p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] hover:border-[var(--color-dark-teal)] hover:bg-[var(--color-light-teal)] flex flex-col items-start gap-2 transition-colors"
              >
                <HelpCircle className="w-6 h-6 text-[var(--color-dark-teal)]" />
                <span className="font-bold text-[15px] text-[var(--color-primary-text)]">
                  المساعدة
                </span>
                <span className="text-[12px] text-[var(--color-secondary-text)]">
                  دليل استخدام الموقع
                </span>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Row 3: Recommended Specialties */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2>التخصصات الطبية المتاحة</h2>
          <Link
            to="/patient/doctors"
            className="text-[14px] font-bold text-[var(--color-dark-teal)] hover:underline"
          >
            عرض جميع الأطباء ({formatNumber(doctors.filter((d) => d.status === 'approved').length)})
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {specialties.map((spec) => {
            const count = doctors.filter(
              (d) => d.specialtyId === spec.id && d.status === 'approved'
            ).length;
            return (
              <Card
                key={spec.id}
                interactive
                padding="md"
                onClick={() =>
                  navigate(`/patient/doctors?specialty=${encodeURIComponent(spec.nameAr)}`)
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[17px] font-bold text-[var(--color-primary-text)] mb-1">
                      {spec.nameAr}
                    </h3>
                    <p className="text-[13px] text-[var(--color-secondary-text)] line-clamp-2">
                      {spec.description}
                    </p>
                  </div>
                  <span className="text-[13px] font-bold text-[var(--color-dark-teal)] whitespace-nowrap">
                    {formatDoctorsCount(count)}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Row 4: Nearby Clinics */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2>عيادات قريبة منك</h2>
          <span className="text-[13px] text-[var(--color-secondary-text)]">
            مرتبة حسب المسافة التقريبية
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nearbyClinics.map((clinic) => (
            <ClinicLocationCard key={clinic.id} clinic={clinic} />
          ))}
        </div>
      </section>

      {/* Row 5: Recent Prescriptions */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2>أحدث الروشتات الإلكترونية</h2>
          <Link
            to="/patient/prescriptions"
            className="text-[14px] font-bold text-[var(--color-dark-teal)] hover:underline"
          >
            عرض الكل
          </Link>
        </div>
        {myRecentPrescriptions.length === 0 ? (
          <EmptyState
            icon={<Pill className="w-8 h-8" />}
            title="لا توجد روشتات مسجلة بعد"
            description="ستظهر روشتاتك الإلكترونية هنا فور إصدارها من الطبيب المعالج."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myRecentPrescriptions.map((rx) => (
              <Card key={rx.id} padding="md" className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[16px] font-bold text-[var(--color-primary-text)]">
                    {rx.diagnosis}
                  </div>
                  <div className="text-[14px] text-[var(--color-secondary-text)]">
                    {rx.doctorName} · {rx.specialtyAr} · {formatShortDateArabic(rx.date)}
                  </div>
                  <div className="text-[13px] font-semibold text-[var(--color-dark-teal)]">
                    عدد الأدوية الموصوفة: {formatNumber(rx.medicines.length)}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/patient/prescriptions/${rx.id}`)}
                >
                  عرض الروشتة
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

// Patient Doctor Search Page with URL query string sync & filters
export const DoctorSearchPage: React.FC = () => {
  const { doctors, clinics, specialties, locations } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const q = searchParams.get('q') ?? '';
  const specialty = searchParams.get('specialty') ?? '';
  const governorate = searchParams.get('gov') ?? '';
  const city = searchParams.get('city') ?? '';
  const maxPrice = Number(searchParams.get('maxPrice') ?? '500');
  const minRating = Number(searchParams.get('minRating') ?? '0');
  const sortBy = searchParams.get('sort') ?? 'rating';

  useEffect(() => {
    document.title = 'البحث عن الأطباء والعيادات — موعدي';
  }, []);

  const updateParam = (key: string, val: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!val || (key === 'maxPrice' && val === '500') || (key === 'minRating' && val === '0')) {
          next.delete(key);
        } else {
          next.set(key, val);
        }
        return next;
      },
      { replace: true }
    );
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const filteredDoctors = useMemo(() => {
    return doctors
      .filter((doc) => doc.status === 'approved')
      .filter((doc) => {
        const docClinics = clinics.filter((c) => doc.clinicIds.includes(c.id));
        const searchableText = [
          doc.name,
          doc.specialtyAr,
          doc.specialtyEn,
          doc.titleAr,
          ...docClinics.map((c) => `${c.name} ${c.governorate} ${c.city} ${c.district}`),
        ].join(' ');

        if (q && !matchesSearch(searchableText, q)) return false;
        if (specialty && !matchesSearch(doc.specialtyAr, specialty)) return false;
        if (doc.consultationFee > maxPrice) return false;
        if (doc.rating < minRating) return false;

        if (governorate) {
          const matchesGov = docClinics.some((c) => matchesSearch(c.governorate, governorate));
          if (!matchesGov) return false;
        }
        if (city) {
          const matchesCity = docClinics.some((c) => matchesSearch(c.city, city));
          if (!matchesCity) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.consultationFee - b.consultationFee;
        if (sortBy === 'experience') return b.yearsExperience - a.yearsExperience;
        return b.rating - a.rating;
      });
  }, [city, clinics, doctors, governorate, maxPrice, minRating, q, sortBy, specialty]);

  const FilterControls = () => {
    const priceProgress = Math.min(
      100,
      Math.max(0, ((maxPrice - 200) / (500 - 200)) * 100)
    );

    return (
      <div className="space-y-6">
        {/* Filter card header */}
        <div className="space-y-4 pb-5 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-[var(--color-dark-teal)] to-[var(--color-teal-mid)] text-[var(--color-white)] flex items-center justify-center shadow-[0_8px_18px_-10px_rgba(11,67,76,0.6)] shrink-0">
              <Filter className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-[19px] sm:text-[20px] font-bold text-[var(--color-primary-text)] leading-tight">
                تصفية النتائج
              </h2>
              <p className="text-[12px] text-[var(--color-secondary-text)] mt-1">
                اختار التخصص والميزانية المناسبة ليك
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={clearAllFilters}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-[10px] bg-[var(--color-muted)] hover:bg-[var(--color-light-teal)] border border-[var(--color-border)] text-[12px] font-bold text-[var(--color-dark-teal)] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>مسح كل الفلاتر</span>
          </button>
        </div>

        <SelectField
          label="التخصص الطبي"
          value={specialty}
          onChange={(e) => updateParam('specialty', e.target.value)}
          options={[
            { value: '', label: 'كل التخصصات' },
            ...specialties.map((s) => ({ value: s.nameAr, label: s.nameAr })),
          ]}
        />

        {/* Location block */}
        <div className="space-y-3 p-3.5 rounded-[14px] bg-[var(--color-muted)]/60 border border-[var(--color-border)]">
          <div className="flex items-center gap-2 text-[13px] font-bold text-[var(--color-dark-teal)]">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>نطاق البحث</span>
          </div>
          <LocationCascadeSelect
            locations={locations}
            governorate={governorate}
            city={city}
            onChangeGovernorate={(gov) => updateParam('gov', gov)}
            onChangeCity={(ct) => updateParam('city', ct)}
            stacked
          />
        </div>

        {/* Price range block */}
        <div className="space-y-3 p-4 rounded-[14px] bg-gradient-to-b from-[var(--color-light-teal)] via-[var(--color-white)] to-[var(--color-white)] border border-[var(--color-dark-teal)]/15">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="price-range"
              className="flex items-center gap-2 text-[14px] font-bold text-[var(--color-primary-text)]"
            >
              <Wallet className="w-4 h-4 text-[var(--color-dark-teal)] shrink-0" />
              <span>الحد الأقصى لسعر الكشف</span>
            </label>
            <span className="px-2.5 py-1 rounded-[8px] bg-[var(--color-dark-teal)] text-[var(--color-white)] text-[14px] font-bold tabular-nums whitespace-nowrap">
              {formatCurrencyEGP(maxPrice)}
            </span>
          </div>
          <input
            id="price-range"
            type="range"
            dir="ltr"
            min={200}
            max={500}
            step={25}
            value={maxPrice}
            onChange={(e) => updateParam('maxPrice', e.target.value)}
            className="price-range w-full"
            style={{ '--range-progress': `${priceProgress}%` } as React.CSSProperties}
          />
          <div
            dir="ltr"
            className="flex items-center justify-between text-[11px] font-semibold text-[var(--color-secondary-text)] tabular-nums"
          >
            <span>{formatCurrencyEGP(200)}</span>
            <span>{formatCurrencyEGP(500)}</span>
          </div>
        </div>

        <SelectField
          label="الحد الأدنى للتقييم"
          value={String(minRating)}
          onChange={(e) => updateParam('minRating', e.target.value)}
          options={[
            { value: '0', label: 'كل التقييمات' },
            { value: '4.5', label: '4.5 نجوم فأعلى' },
            { value: '4.8', label: '4.8 نجوم فأعلى' },
          ]}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'الرئيسية', to: '/patient' },
          { label: 'البحث عن الأطباء' },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1>ابحث عن الطبيب والعيادة المناسبة</h1>
          <p className="text-[15px] text-[var(--color-secondary-text)]">
            اختر طبيبك حسب التخصص، المحافظة، والتقييم واحجز موعدك مباشرة.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="lg:hidden"
          icon={<SlidersHorizontal className="w-4 h-4" />}
          onClick={() => setMobileFiltersOpen(true)}
        >
          تصفية النتائج
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
        {/* Desktop Sticky Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-[88px]">
          <Card
            padding="lg"
            className="border-[var(--color-dark-teal)]/10 shadow-[0_18px_45px_-28px_rgba(11,67,76,0.45)]"
          >
            {FilterControls()}
          </Card>
        </aside>

        {/* Main Results Area */}
        <div className="lg:col-span-8 space-y-4">
          <Card padding="sm">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
              <div className="flex-1">
                <SearchInput
                  value={q}
                  onChange={(val) => updateParam('q', val)}
                  placeholder="ابحث باسم الطبيب، التخصص، أو اسم العيادة..."
                />
              </div>
              <div className="w-full sm:w-[230px]">
                <SelectField
                  label="ترتيب الأطباء حسب"
                  value={sortBy}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  options={[
                    { value: 'rating', label: 'الأعلى تقييمًا' },
                    { value: 'price_asc', label: 'الأقل سعرًا للكشف' },
                    { value: 'experience', label: 'الأكثر سنوات خبرة' },
                  ]}
                />
              </div>
            </div>
          </Card>

          {/* Active Filter Removable Chips */}
          {(specialty || governorate || city || maxPrice < 500 || minRating > 0) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] text-[var(--color-secondary-text)]">الفلاتر النشطة:</span>
              {specialty && (
                <button
                  type="button"
                  onClick={() => updateParam('specialty', '')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-sm)] bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] text-[13px] font-semibold cursor-pointer"
                >
                  <span>{specialty}</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              {(governorate || city) && (
                <button
                  type="button"
                  onClick={() => {
                    updateParam('gov', '');
                    updateParam('city', '');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[var(--radius-sm)] bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] text-[13px] font-semibold cursor-pointer"
                >
                  <span>
                    {governorate}
                    {city ? `، ${city}` : ''}
                  </span>
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          <div className="text-[14px] font-semibold text-[var(--color-secondary-text)]">
            تم العثور على <strong className="text-[var(--color-primary-text)]">{formatDoctorsCount(filteredDoctors.length)}</strong>
          </div>

          {filteredDoctors.length === 0 ? (
            <EmptyState
              icon={<Stethoscope className="w-8 h-8" />}
              title="لا توجد نتائج مطابقة لبحثك"
              description="جرب تغيير كلمات البحث أو مسح بعض الفلاتر لعرض جميع الأطباء المتاحين."
              actionLabel="مسح الفلاتر وعرض الكل"
              onAction={clearAllFilters}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredDoctors.map((doc) => {
                const primaryClinic = clinics.find((c) => doc.clinicIds.includes(c.id));
                return <DoctorCard key={doc.id} doctor={doc} primaryClinic={primaryClinic} />;
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Bottom Sheet Modal */}
      <Modal
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title="تصفية نتائج الأطباء"
        footer={
          <Button
            variant="primary"
            fullWidth
            onClick={() => setMobileFiltersOpen(false)}
          >
            عرض النتائج ({formatNumber(filteredDoctors.length)})
          </Button>
        }
      >
        {FilterControls()}
      </Modal>
    </div>
  );
};

// Doctor Profile Page with Multi-Clinic selector & Reviews
export const DoctorProfilePage: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const {
    session,
    doctors,
    clinics,
    reviews,
    appointments,
    submitReview,
  } = useApp();
  const navigate = useNavigate();

  const doctor = doctors.find((d) => d.id === doctorId) ?? doctors[0];
  const doctorClinics = clinics.filter((c) => doctor.clinicIds.includes(c.id));
  const [selectedClinicId, setSelectedClinicId] = useState(
    doctorClinics[0]?.id ?? clinics[0].id
  );
  const [activeTab, setActiveTab] = useState('about');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [overallRating, setOverallRating] = useState(5);
  const [commRating, setCommRating] = useState(5);
  const [punctRating, setPunctRating] = useState(5);
  const [orgRating, setOrgRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    document.title = `${doctor.name} — ${doctor.specialtyAr} | موعدي`;
  }, [doctor.name, doctor.specialtyAr]);

  const selectedClinic =
    doctorClinics.find((c) => c.id === selectedClinicId) ?? doctorClinics[0] ?? clinics[0];

  const doctorReviews = reviews.filter(
    (r) => r.doctorId === doctor.id && r.status === 'published'
  );

  const completedAptWithDoctor = appointments.find(
    (a) =>
      a.patientId === (session?.id ?? 'pat-1') &&
      a.doctorId === doctor.id &&
      a.status === 'completed'
  );

  const eligibleForReview = canSubmitReview(session, Boolean(completedAptWithDoctor));

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completedAptWithDoctor) return;
    submitReview({
      appointmentId: completedAptWithDoctor.id,
      patientId: session?.id ?? 'pat-1',
      patientName: session?.name ?? 'أحمد محمد',
      doctorId: doctor.id,
      doctorName: doctor.name,
      clinicId: selectedClinic.id,
      overallRating,
      communicationRating: commRating,
      punctualityRating: punctRating,
      organizationRating: orgRating,
      comment: comment.trim() || 'تجربة ممتازة وعيادة منظمة.',
    });
    setReviewModalOpen(false);
    setComment('');
  };

  return (
    <div className="space-y-6 pb-16 lg:pb-0">
      <Breadcrumbs
        items={[
          { label: 'الرئيسية', to: '/patient' },
          { label: 'الأطباء', to: '/patient/doctors' },
          { label: doctor.name },
        ]}
      />

      {/* Doctor Identity Header Card */}
      <Card padding="lg">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <Avatar name={doctor.name} size={96} variant="teal" />
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1>{doctor.name}</h1>
              <span className="text-[13px] font-semibold text-[var(--color-green)] bg-[var(--color-green-subtle)] px-2.5 py-0.5 rounded-[var(--radius-sm)] border border-[var(--color-green)]/30">
                حساب طبيب موثق (تجريبي)
              </span>
            </div>
            <p className="text-[16px] font-bold text-[var(--color-dark-teal)]">
              {doctor.specialtyAr} · {doctor.titleAr}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[14px] text-[var(--color-secondary-text)] pt-1">
              <RatingDisplay rating={doctor.rating} reviewsCount={doctorReviews.length} />
              <span>·</span>
              <span>خبرة {formatNumber(doctor.yearsExperience)} سنة</span>
              <span>·</span>
              <span>أقرب موعد: {doctor.nextAvailableText}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Desktop Two-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-6">
          <Tabs
            tabs={[
              { id: 'about', label: 'نبذة والمؤهلات العلمية' },
              { id: 'clinics', label: 'العيادات ومواعيد العمل', count: doctorClinics.length },
              { id: 'reviews', label: 'تقييمات المرضى', count: doctorReviews.length },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {activeTab === 'about' && (
            <Card padding="md" className="space-y-5">
              <div>
                <h2 className="text-[18px] font-bold mb-2">نبذة عن الطبيب</h2>
                <p className="text-[16px] text-[var(--color-primary-text)]">{doctor.bio}</p>
              </div>
              <div className="pt-4 border-t border-[var(--color-border)]">
                <h3 className="text-[17px] font-bold mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[var(--color-dark-teal)]" />
                  <span>المؤهلات العلمية والزمالات</span>
                </h3>
                <ul className="space-y-2 text-[15px] list-disc ps-5 text-[var(--color-primary-text)]">
                  {doctor.qualifications.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </div>
            </Card>
          )}

          {activeTab === 'clinics' && (
            <div className="space-y-4">
              {doctorClinics.map((clinic) => (
                <ClinicLocationCard
                  key={clinic.id}
                  clinic={clinic}
                  selectable
                  selected={clinic.id === selectedClinic.id}
                  onSelect={(c) => setSelectedClinicId(c.id)}
                />
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <Card padding="md" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-[18px] font-bold">آراء وتقييمات المرضى</h2>
                  <p className="text-[14px] text-[var(--color-secondary-text)]">
                    التقييمات مقتصرة على المرضى الذين أتموا كشفًا فعليًا لدى الطبيب.
                  </p>
                </div>
                {eligibleForReview && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setReviewModalOpen(true)}
                  >
                    إضافة تقييم لزيارتك
                  </Button>
                )}
              </Card>

              {doctorReviews.map((rev) => (
                <Card key={rev.id} padding="md" className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[15px]">{rev.patientName}</span>
                    <RatingDisplay rating={rev.overallRating} />
                  </div>
                  <p className="text-[15px] text-[var(--color-primary-text)]">{rev.comment}</p>
                  <div className="text-[13px] text-[var(--color-secondary-text)] pt-1">
                    التواصل: {rev.communicationRating}/5 · الالتزام بالموعد: {rev.punctualityRating}/5 · تنظيم العيادة: {rev.organizationRating}/5 · {formatShortDateArabic(rev.createdAt)}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sticky Side Booking Summary Card */}
        <aside className="lg:col-span-4 sticky top-[88px]">
          <Card padding="md" className="space-y-4">
            <h2 className="text-[18px] font-bold text-[var(--color-dark-teal)]">
              حجز موعد في العيادة
            </h2>

            {doctorClinics.length > 1 && (
              <SelectField
                label="اختر فرع العيادة"
                value={selectedClinic.id}
                onChange={(e) => setSelectedClinicId(e.target.value)}
                options={doctorClinics.map((c) => ({ value: c.id, label: c.name }))}
              />
            )}

            <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] border border-[var(--color-border)] space-y-2 text-[14px]">
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-secondary-text)]">الفرع المحدد:</span>
                <strong className="text-[var(--color-primary-text)]">{selectedClinic.city}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-secondary-text)]">سعر الكشف:</span>
                <strong className="tabular-nums text-[var(--color-dark-teal)] text-[16px]">
                  {formatCurrencyEGP(selectedClinic.consultationPrice)}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-secondary-text)]">سعر الاستشارة:</span>
                <strong className="tabular-nums">
                  {formatCurrencyEGP(selectedClinic.followUpPrice)}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-secondary-text)]">أيام العمل:</span>
                <span className="font-semibold">{selectedClinic.workingDays.join('، ')}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() =>
                navigate(`/patient/booking/${doctor.id}?clinicId=${selectedClinic.id}`)
              }
            >
              احجز الآن
            </Button>
          </Card>
        </aside>
      </div>

      {/* Review Submission Modal */}
      <Modal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title={`تقييم زيارتك لدى ${doctor.name}`}
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <StarRatingInput
            label="التقييم العام للزيارة"
            value={overallRating}
            onChange={setOverallRating}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StarRatingInput label="تواصل الطبيب" value={commRating} onChange={setCommRating} />
            <StarRatingInput label="دقة المواعيد" value={punctRating} onChange={setPunctRating} />
            <StarRatingInput label="تنظيم العيادة" value={orgRating} onChange={setOrgRating} />
          </div>
          <TextArea
            label="تعليقك على الزيارة (اختياري)"
            placeholder="شارك رأيك لمساعدة المرضى الآخرين..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="pt-3 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setReviewModalOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit" variant="primary">
              نشر التقييم
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// Multi-Step Appointment Booking Flow (Section 11 & 30)
export const BookingPage: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  const [searchParams] = useSearchParams();
  const { doctors, clinics, bookAppointment } = useApp();
  const navigate = useNavigate();

  const doctor = doctors.find((d) => d.id === doctorId) ?? doctors[0];
  const doctorClinics = clinics.filter((c) => doctor.clinicIds.includes(c.id));

  const [step, setStep] = useState(0);
  const [selectedClinicId, setSelectedClinicId] = useState(
    searchParams.get('clinicId') ?? doctorClinics[0]?.id ?? clinics[0].id
  );
  const [selectedDate, setSelectedDate] = useState(TODAY_DATE);
  const [selectedSlot, setSelectedSlot] = useState('06:30 م');
  const [visitType, setVisitType] = useState<'consultation' | 'follow_up'>('consultation');
  const [symptoms, setSymptoms] = useState('');

  useEffect(() => {
    document.title = `حجز موعد لدى ${doctor.name} — موعدي`;
  }, [doctor.name]);

  const selectedClinic =
    doctorClinics.find((c) => c.id === selectedClinicId) ?? doctorClinics[0] ?? clinics[0];
  const fee =
    visitType === 'follow_up'
      ? selectedClinic.followUpPrice
      : selectedClinic.consultationPrice;

  const stepLabels = [
    'اختيار العيادة',
    'تحديد التاريخ',
    'اختيار الموعد',
    'مراجعة التفاصيل',
  ];

  const handleConfirmBooking = () => {
    const created = bookAppointment({
      doctorId: doctor.id,
      clinicId: selectedClinic.id,
      date: selectedDate,
      timeSlot: selectedSlot,
      type: visitType,
      symptomsOrReason: symptoms,
    });
    navigate(`/patient/booking-confirmation/${created.id}`);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'الرئيسية', to: '/patient' },
          { label: doctor.name, to: `/patient/doctors/${doctor.id}` },
          { label: 'حجز موعد' },
        ]}
      />

      <h1>حجز موعد لدى {doctor.name}</h1>

      <Stepper steps={stepLabels} currentStep={step} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <Card padding="lg" className="space-y-6">
            {step === 0 && (
              <div className="space-y-4" role="radiogroup" aria-label="اختر العيادة">
                <h2>١. اختر فرع العيادة المناسب لك</h2>
                <div className="grid grid-cols-1 gap-4">
                  {doctorClinics.map((clinic) => (
                    <ClinicLocationCard
                      key={clinic.id}
                      clinic={clinic}
                      selectable
                      selected={clinic.id === selectedClinic.id}
                      onSelect={(c) => setSelectedClinicId(c.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2>٢. اختر تاريخ الزيارة</h2>
                <DatePicker
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  closedDates={selectedClinic.closedDates}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2>٣. اختر الفترة الزمنية ونوع الكشف</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVisitType('consultation')}
                    className={`p-4 rounded-[var(--radius-md)] border text-start cursor-pointer ${
                      visitType === 'consultation'
                        ? 'border-[var(--color-dark-teal)] bg-[var(--color-light-teal)] font-bold'
                        : 'border-[var(--color-border)]'
                    }`}
                  >
                    <div className="text-[16px]">كشف جديد</div>
                    <div className="text-[14px] tabular-nums text-[var(--color-dark-teal)]">
                      {formatCurrencyEGP(selectedClinic.consultationPrice)}
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisitType('follow_up')}
                    className={`p-4 rounded-[var(--radius-md)] border text-start cursor-pointer ${
                      visitType === 'follow_up'
                        ? 'border-[var(--color-dark-teal)] bg-[var(--color-light-teal)] font-bold'
                        : 'border-[var(--color-border)]'
                    }`}
                  >
                    <div className="text-[16px]">استشارة / متابعة</div>
                    <div className="text-[14px] tabular-nums text-[var(--color-dark-teal)]">
                      {formatCurrencyEGP(selectedClinic.followUpPrice)}
                    </div>
                  </button>
                </div>
                <TimeSlotPicker selectedSlot={selectedSlot} onSelectSlot={setSelectedSlot} />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h2>٤. مراجعة تفاصيل الحجز وتأكيده</h2>
                <TextArea
                  label="سبب الزيارة أو الأعراض باختصار (اختياري)"
                  placeholder="مثال: متابعة ضغط الدم أو مراجعة نتائج التحاليل..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />
                <InlineAlert variant="info" title="الدفع نقدًا في استقبال العيادة">
                  لا يطلب موقع موعدي أي بطاقات بنكية؛ يتم سداد قيمة الكشف ({formatCurrencyEGP(fee)}) عند الحضور للاستقبال.
                </InlineAlert>
              </div>
            )}

            {/* Step Navigation Footer */}
            <div className="pt-5 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
              {step < 3 ? (
                <Button variant="primary" size="md" onClick={() => setStep((s) => s + 1)}>
                  التالي
                </Button>
              ) : (
                <Button variant="primary" size="lg" onClick={handleConfirmBooking}>
                  تأكيد الحجز الآن
                </Button>
              )}

              {step > 0 ? (
                <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
                  السابق
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => navigate(`/patient/doctors/${doctor.id}`)}
                >
                  إلغاء
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Live Booking Summary Side Panel */}
        <aside className="lg:col-span-4">
          <Card padding="md" className="space-y-3">
            <h3 className="text-[17px] font-bold text-[var(--color-dark-teal)]">
              ملخص الحجز الحالي
            </h3>
            <div className="space-y-2.5 text-[14px] pt-2 border-t border-[var(--color-border)]">
              <div className="flex justify-between">
                <span className="text-[var(--color-secondary-text)]">الطبيب:</span>
                <strong>{doctor.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-secondary-text)]">التخصص:</span>
                <span>{doctor.specialtyAr}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-secondary-text)]">العيادة:</span>
                <span className="text-end font-semibold">{selectedClinic.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-secondary-text)]">التاريخ:</span>
                <strong className="tabular-nums">{formatShortDateArabic(selectedDate)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-secondary-text)]">الموعد:</span>
                <strong className="tabular-nums">{selectedSlot}</strong>
              </div>
              <div className="flex justify-between pt-2 border-t border-[var(--color-border)] text-[16px]">
                <span className="font-bold">قيمة الكشف:</span>
                <strong className="tabular-nums text-[var(--color-dark-teal)]">
                  {formatCurrencyEGP(fee)}
                </strong>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
};

// Booking Confirmation Page (Section 30)
export const BookingConfirmationPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const { appointments, showToast } = useApp();
  const navigate = useNavigate();

  const appointment =
    appointments.find((a) => a.id === appointmentId) ?? appointments[0];

  useEffect(() => {
    if (appointment) {
      document.title = `تم تأكيد الحجز ${appointment.bookingNumber} — موعدي`;
    }
  }, [appointment]);

  if (!appointment) {
    return (
      <div className="max-w-[640px] mx-auto py-12 text-center space-y-4">
        <EmptyState
          icon={<Calendar className="w-12 h-12" />}
          title="لم يتم العثور على الحجز"
          description="لا تتوفر تفاصيل لهذا الموعد حاليًا."
          action={
            <Button variant="primary" onClick={() => navigate('/patient/doctors')}>
              حجز كشف جديد
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-[640px] mx-auto py-6">
      <Card padding="lg" className="text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[var(--color-green-subtle)] text-[var(--color-green)] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-12 h-12" strokeWidth={2} />
        </div>

        <div>
          <h1 className="text-[26px] font-bold text-[var(--color-green)] mb-1">
            تم تأكيد حجزك بنجاح!
          </h1>
          <p className="text-[15px] text-[var(--color-secondary-text)]">
            تم حفظ موعدك وإصدار رقم الدخول في طابور العيادة.
          </p>
        </div>

        <div className="p-5 rounded-[var(--radius-lg)] bg-[var(--color-light-teal)] border border-[var(--color-dark-teal)]/30">
          <div className="text-[14px] font-semibold text-[var(--color-secondary-text)]">
            رقم الحجز الخاص بك
          </div>
          <div className="text-[38px] font-bold tabular-nums text-[var(--color-dark-teal)] my-1">
            {appointment.bookingNumber}
          </div>
          <div className="text-[14px] font-semibold text-[var(--color-primary-text)]">
            الترتيب في الطابور: المركز {formatNumber(appointment.queuePosition)}
          </div>
        </div>

        <div className="text-start space-y-2.5 p-4 rounded-[var(--radius-md)] bg-[var(--color-muted)] text-[14px]">
          <div className="flex justify-between">
            <span className="text-[var(--color-secondary-text)]">اسم المريض:</span>
            <strong>{appointment.patientName}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-secondary-text)]">الطبيب المعالج:</span>
            <strong>{appointment.doctorName}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-secondary-text)]">العيادة:</span>
            <span>{appointment.clinicName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-secondary-text)]">التاريخ والموعد:</span>
            <strong className="tabular-nums">
              {formatShortDateArabic(appointment.date)} — {appointment.timeSlot}
            </strong>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--color-secondary-text)]">قيمة الكشف:</span>
            <strong className="tabular-nums">{formatCurrencyEGP(appointment.fee)}</strong>
          </div>
        </div>

        {/* Three actions in exact order from Section 30: تتبع دورك (primary), إضافة للتقويم (simulated), العودة للرئيسية (ghost) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(`/patient/queue/${appointment.id}`)}
          >
            تتبع دورك
          </Button>
          <Button
            variant="outline"
            size="md"
            icon={<Calendar className="w-4 h-4" />}
            onClick={() =>
              showToast('تمت إضافة تذكير الموعد إلى التقويم (محاكاة في الوضع التجريبي)', 'success')
            }
          >
            إضافة للتقويم
          </Button>
          <Button variant="ghost" size="md" onClick={() => navigate('/patient')}>
            العودة للرئيسية
          </Button>
        </div>
      </Card>
    </div>
  );
};
