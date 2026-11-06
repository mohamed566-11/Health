import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Building2,
  Calendar,
  Check,
  Clock,
  Edit3,
  FileText,
  Lock,
  Pin,
  Plus,
  Search,
  Star,
  Stethoscope,
  Trash2,
  UserCheck,
  Users,
  UserX,
} from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import {
  Clinic,
  MedicineCatalogItem,
  PrescribedMedicine,
} from '../../types';
import {
  Avatar,
  Breadcrumbs,
  Button,
  Card,
  EmptyState,
  InlineAlert,
  RatingDisplay,
  SegmentedControl,
  StatusBadge,
  Stepper,
  Tabs,
} from '../../components/common/UIPrimitives';
import {
  LocationCascadeSelect,
  SearchInput,
  SelectField,
  TextArea,
  TextInput,
} from '../../components/forms/FormControls';
import { KpiCard, SegmentedStatusBar } from '../../components/common/DashboardCharts';
import { ClinicLocationCard } from '../../components/cards/ClinicLocationCard';
import {
  formatCurrencyEGP,
  formatDateArabic,
  formatNumber,
  formatShortDateArabic,
  matchesSearch,
} from '../../utils/formatters';
import { TODAY_DATE } from '../../data/appointments';

// 1. Doctor Dashboard Page
export const DoctorDashboardPage: React.FC = () => {
  const { session, appointments, doctors, clinics } = useApp();
  const navigate = useNavigate();

  const currentDoctor =
    doctors.find((d) => d.id === (session?.id ?? 'doc-1')) ?? doctors[0];

  useEffect(() => {
    document.title = `لوحة تحكم الطبيب (${currentDoctor.name}) — موعدي`;
  }, [currentDoctor.name]);

  const todayAppointments = useMemo(
    () =>
      appointments
        .filter((a) => a.doctorId === currentDoctor.id && a.date === TODAY_DATE)
        .sort((a, b) => a.queuePosition - b.queuePosition),
    [appointments, currentDoctor.id]
  );

  const examinedCount = todayAppointments.filter((a) => a.status === 'completed').length;
  const waitingCount = todayAppointments.filter((a) =>
    ['in_examination', 'arrived', 'waiting', 'booked'].includes(a.status)
  ).length;
  const noShowCount = todayAppointments.filter((a) => a.status === 'no_show').length;

  const primaryClinic =
    clinics.find((c) => currentDoctor.clinicIds.includes(c.id)) ?? clinics[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1>مرحبًا، {currentDoctor.name}</h1>
          <p className="text-[15px] text-[var(--color-secondary-text)]">
            {currentDoctor.titleAr} — ملخص العيادة وحالات اليوم ({formatDateArabic(TODAY_DATE)}).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="primary"
            onClick={() => navigate('/doctor/prescriptions/new')}
          >
            كتابة روشتة إلكترونية
          </Button>
          <Button variant="outline" onClick={() => navigate('/doctor/patients')}>
            بحث المرضى
          </Button>
        </div>
      </div>

      {/* Row 1: 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={<Calendar className="w-6 h-6" />}
          label="إجمالي حجوزات اليوم"
          value={todayAppointments.length}
          unit="حجز"
          trendText="+14% عن الأمس"
          trendDirection="up"
        />
        <KpiCard
          icon={<UserCheck className="w-6 h-6" />}
          label="تم الكشف عليهم"
          value={examinedCount}
          unit="مريض"
        />
        <KpiCard
          icon={<Users className="w-6 h-6" />}
          label="مرضى في الانتظار"
          value={waitingCount}
          unit="مريض"
        />
        <KpiCard
          icon={<UserX className="w-6 h-6" />}
          label="لم يحضروا"
          value={noShowCount}
          unit="حالة"
        />
      </div>

      {/* Row 2: Today's Patient List + Side Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <Card padding="md" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-bold">قائمة مرضى اليوم ({primaryClinic.name})</h2>
              <span className="text-[13px] font-semibold text-[var(--color-secondary-text)]">
                مرتبة حسب أولوية الدخول
              </span>
            </div>

            <div className="divide-y divide-[var(--color-border)]">
              {todayAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] font-bold tabular-nums text-[15px]">
                      {apt.bookingNumber}
                    </span>
                    <div>
                      <div className="font-bold text-[16px] text-[var(--color-primary-text)]">
                        {apt.patientName}
                        {apt.patientAge ? ` (${apt.patientAge} سنة)` : ''}
                      </div>
                      <div className="text-[13px] text-[var(--color-secondary-text)]">
                        الموعد: {apt.timeSlot} · {apt.symptomsOrReason || 'كشف عام'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={apt.status} size="sm" />
                    <Button
                      variant={apt.status === 'in_examination' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => navigate(`/doctor/visit/${apt.id}`)}
                    >
                      {apt.status === 'completed' ? 'مراجعة الزيارة' : 'بدء الكشف'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/doctor/patients/${apt.patientId}`)}
                    >
                      ملف المريض
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-5">
          <Card padding="md" className="space-y-3">
            <h3 className="text-[17px] font-bold">مؤشرات الأداء والعيادة</h3>
            <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-[var(--color-dark-teal)]" />
                <span className="text-[14px] font-semibold">متوسط مدة الكشف</span>
              </div>
              <strong className="text-[18px] tabular-nums text-[var(--color-dark-teal)]">
                {formatNumber(primaryClinic.avgExamDurationMin)} دقيقة تقريبًا
              </strong>
            </div>

            <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--color-muted)] flex items-center justify-between">
              <span className="text-[14px] font-semibold">التقييم العام للمرضى</span>
              <RatingDisplay
                rating={currentDoctor.rating}
                reviewsCount={currentDoctor.reviewsCount}
              />
            </div>
          </Card>

          <SegmentedStatusBar
            title="توزيع حالات طابور اليوم"
            items={[
              { label: 'تم الكشف', count: examinedCount, colorVar: '--color-dark-teal' },
              { label: 'في الانتظار', count: waitingCount, colorVar: '--color-neon-orange' },
              { label: 'لم يحضر', count: noShowCount, colorVar: '--color-secondary-text' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

// 2. Doctor Clinics Management Page with Live ClinicLocationCard Preview
export const DoctorClinicsPage: React.FC = () => {
  const { session, clinics, locations, saveClinic, toggleClinicActive } = useApp();
  const doctorId = session?.role === 'doctor' ? session.id : 'doc-1';
  const myClinics = clinics.filter((c) => c.doctorId === doctorId);

  const [editingClinic, setEditingClinic] = useState<Clinic>(
    myClinics[0] ?? clinics[0]
  );

  useEffect(() => {
    document.title = 'إدارة العيادات والفروع — بوابة الطبيب';
  }, []);

  const handleCreateNew = () => {
    setEditingClinic({
      id: `clinic-${Date.now()}`,
      doctorId,
      name: 'عيادة جديدة — فرع التجمع الخامس',
      address: 'شارع التسعين الشمالي، مجمع العيادات الطبية',
      governorate: 'القاهرة',
      city: 'مدينة نصر',
      district: 'التجمع',
      landmark: 'بجوار المستشفى الجوي التخصصي',
      distanceKm: 5.0,
      workingDays: ['السبت', 'الاثنين', 'الأربعاء'],
      startTime: '14:00',
      endTime: '21:00',
      consultationPrice: 400,
      followUpPrice: 180,
      dailyPatientLimit: 20,
      avgExamDurationMin: 15,
      isActive: true,
      phone: '01009998877',
    });
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveClinic(editingClinic);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1>إدارة العيادات والفروع</h1>
          <p className="text-[15px] text-[var(--color-secondary-text)]">
            أضف أو عدل بيانات عياداتك، العناوين، أسعار الكشف، والحد الأقصى للحجوزات اليومية.
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleCreateNew}
        >
          إضافة عيادة جديدة
        </Button>
      </div>

      {/* Clinics selector strip */}
      <div className="flex flex-wrap items-center gap-3">
        {myClinics.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setEditingClinic(c)}
            className={`px-4 py-2.5 rounded-[var(--radius-md)] border text-[14px] font-bold transition-colors cursor-pointer ${
              editingClinic.id === c.id
                ? 'bg-[var(--color-dark-teal)] text-[var(--color-white)] border-[var(--color-dark-teal)]'
                : 'bg-[var(--color-white)] text-[var(--color-primary-text)] border-[var(--color-border)] hover:bg-[var(--color-light-teal)]'
            }`}
          >
            {c.name} {!c.isActive ? '(متوقفة)' : ''}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <Card padding="lg">
            <form onSubmit={handleSaveSubmit} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-bold">بيانات العيادة</h2>
                {myClinics.some((c) => c.id === editingClinic.id) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toggleClinicActive(editingClinic.id);
                      setEditingClinic((prev) => ({ ...prev, isActive: !prev.isActive }));
                    }}
                  >
                    {editingClinic.isActive ? 'إيقاف العيادة مؤقتًا' : 'تفعيل العيادة'}
                  </Button>
                )}
              </div>

              <TextInput
                label="اسم العيادة"
                required
                value={editingClinic.name}
                onChange={(e) =>
                  setEditingClinic((prev) => ({ ...prev, name: e.target.value }))
                }
              />

              <LocationCascadeSelect
                locations={locations}
                governorate={editingClinic.governorate}
                city={editingClinic.city}
                onChangeGovernorate={(gov) =>
                  setEditingClinic((prev) => ({ ...prev, governorate: gov }))
                }
                onChangeCity={(ct) =>
                  setEditingClinic((prev) => ({ ...prev, city: ct }))
                }
                allowAll={false}
              />

              <TextInput
                label="العنوان التفصيلي"
                required
                value={editingClinic.address}
                onChange={(e) =>
                  setEditingClinic((prev) => ({ ...prev, address: e.target.value }))
                }
              />

              <TextInput
                label="علامة مميزة للوصول (Landmark)"
                value={editingClinic.landmark}
                onChange={(e) =>
                  setEditingClinic((prev) => ({ ...prev, landmark: e.target.value }))
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                  label="سعر الكشف (ج.م)"
                  type="number"
                  value={String(editingClinic.consultationPrice)}
                  onChange={(e) =>
                    setEditingClinic((prev) => ({
                      ...prev,
                      consultationPrice: Number(e.target.value) || 0,
                    }))
                  }
                />
                <TextInput
                  label="سعر الاستشارة (ج.م)"
                  type="number"
                  value={String(editingClinic.followUpPrice)}
                  onChange={(e) =>
                    setEditingClinic((prev) => ({
                      ...prev,
                      followUpPrice: Number(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                  label="الحد الأقصى للمرضى يوميًا"
                  type="number"
                  value={String(editingClinic.dailyPatientLimit)}
                  onChange={(e) =>
                    setEditingClinic((prev) => ({
                      ...prev,
                      dailyPatientLimit: Number(e.target.value) || 15,
                    }))
                  }
                />
                <TextInput
                  label="متوسط مدة الكشف (بالدقائق)"
                  type="number"
                  value={String(editingClinic.avgExamDurationMin)}
                  onChange={(e) =>
                    setEditingClinic((prev) => ({
                      ...prev,
                      avgExamDurationMin: Number(e.target.value) || 15,
                    }))
                  }
                />
              </div>

              <div className="pt-4 border-t border-[var(--color-border)]">
                <Button type="submit" variant="primary">
                  حفظ بيانات العيادة
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Live Preview of ClinicLocationCard */}
        <aside className="lg:col-span-5 sticky top-[88px] space-y-3">
          <h3 className="text-[16px] font-bold text-[var(--color-secondary-text)]">
            معاينة مباشرة لبطاقة العيادة كما تظهر للمريض:
          </h3>
          <ClinicLocationCard clinic={editingClinic} />
        </aside>
      </div>
    </div>
  );
};

// 3. Doctor Schedule Management Page
export const DoctorSchedulePage: React.FC = () => {
  const { clinics, saveClinic, announceClinicDelay } = useApp();
  const [selectedClinicId, setSelectedClinicId] = useState(clinics[0].id);
  const clinic = clinics.find((c) => c.id === selectedClinicId) ?? clinics[0];

  const [startTime, setStartTime] = useState(clinic.startTime);
  const [endTime, setEndTime] = useState(clinic.endTime);
  const [breakStart, setBreakStart] = useState(clinic.breakStart ?? '16:00');
  const [breakEnd, setBreakEnd] = useState(clinic.breakEnd ?? '17:00');
  const [workingDays, setWorkingDays] = useState<string[]>(clinic.workingDays);
  const [delayMinutes, setDelayMinutes] = useState(20);

  useEffect(() => {
    document.title = 'جدول المواعيد والإجازات — بوابة الطبيب';
  }, []);

  const allWeekDays = [
    'السبت',
    'الأحد',
    'الاثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
  ];

  const toggleDay = (day: string) => {
    setWorkingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>إدارة جدول المواعيد الأسبوعي</h1>
        <p className="text-[15px] text-[var(--color-secondary-text)]">
          تحديد أيام وساعات العمل، فترات الراحة، إيقاف الحجز مؤقتًا، أو إعلان تأخير للمرضى.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card padding="lg" className="space-y-5">
            <SelectField
              label="اختر العيادة"
              value={selectedClinicId}
              onChange={(e) => setSelectedClinicId(e.target.value)}
              options={clinics.slice(0, 2).map((c) => ({ value: c.id, label: c.name }))}
            />

            <div>
              <span className="block text-[15px] font-semibold mb-2">أيام العمل المتاحة</span>
              <div className="flex flex-wrap gap-2">
                {allWeekDays.map((day) => {
                  const active = workingDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-[var(--radius-sm)] border text-[14px] font-bold cursor-pointer ${
                        active
                          ? 'bg-[var(--color-dark-teal)] text-[var(--color-white)] border-[var(--color-dark-teal)]'
                          : 'bg-[var(--color-white)] text-[var(--color-secondary-text)] border-[var(--color-border)]'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput
                label="وقت بدء العيادة"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <TextInput
                label="وقت انتهاء العيادة"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput
                label="بداية فترة الراحة (Break)"
                type="time"
                value={breakStart}
                onChange={(e) => setBreakStart(e.target.value)}
              />
              <TextInput
                label="نهاية فترة الراحة"
                type="time"
                value={breakEnd}
                onChange={(e) => setBreakEnd(e.target.value)}
              />
            </div>

            <div className="pt-4 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="primary"
                onClick={() =>
                  saveClinic({
                    ...clinic,
                    workingDays,
                    startTime,
                    endTime,
                    breakStart,
                    breakEnd,
                  })
                }
              >
                حفظ الجدول الأسبوعي
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  saveClinic({
                    ...clinic,
                    bookingsPaused: !clinic.bookingsPaused,
                  })
                }
              >
                {clinic.bookingsPaused ? 'استئناف استقبال الحجوزات' : 'إيقاف الحجوزات مؤقتًا'}
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card padding="md" className="space-y-4">
            <h2 className="text-[18px] font-bold">إعلان تأخير طارئ للمرضى</h2>
            <p className="text-[14px] text-[var(--color-secondary-text)]">
              يرسل إشعارًا فوريًا لجميع المرضى المنتظرين في طابور اليوم ويحدث وقت الانتظار التقريبي.
            </p>
            <SelectField
              label="مدة التأخير المتوقعة"
              value={String(delayMinutes)}
              onChange={(e) => setDelayMinutes(Number(e.target.value))}
              options={[
                { value: '15', label: '15 دقيقة' },
                { value: '30', label: '30 دقيقة' },
                { value: '45', label: '45 دقيقة' },
                { value: '60', label: '60 دقيقة' },
              ]}
            />
            <Button
              variant="secondary"
              fullWidth
              onClick={() => announceClinicDelay(clinic.id, delayMinutes)}
            >
              إرسال تنبيه التأخير للمرضى
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

// 4. Doctor Patient Search Page
export const DoctorPatientsPage: React.FC = () => {
  const { patients, appointments } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.title = 'بحث وسجل المرضى — بوابة الطبيب';
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
        <h1>بحث المرضى والملفات الإكلينيكية</h1>
        <p className="text-[15px] text-[var(--color-secondary-text)]">
          ابحث بالاسم الكامل أو رقم الموبايل لعرض الزيارات السابقة، الروشتات، وملاحظاتك الإكلينيكية السرية.
        </p>
      </div>

      <Card padding="sm">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="ابحث باسم المريض أو رقم الموبايل (مثال: أحمد محمد أو 01012345678)..."
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((pat) => {
          const visitCount = appointments.filter(
            (a) => a.patientId === pat.id && a.status === 'completed'
          ).length;
          return (
            <Card key={pat.id} padding="md" className="flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Avatar name={pat.name} size={40} variant="teal" />
                  <div>
                    <h2 className="text-[17px] font-bold">{pat.name}</h2>
                    <div className="text-[13px] text-[var(--color-secondary-text)]" dir="ltr">
                      {pat.phone}
                    </div>
                  </div>
                </div>
                <div className="text-[13px] text-[var(--color-secondary-text)] space-y-1 mt-2">
                  <div>
                    المحافظة: <strong>{pat.governorate} — {pat.city}</strong>
                  </div>
                  <div>
                    الزيارات المكتملة: <strong>{formatNumber(visitCount)}</strong>
                  </div>
                  {pat.allergies.length > 0 && (
                    <div className="text-[var(--color-red)] font-semibold">
                      حساسية: {pat.allergies.join('، ')}
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/doctor/patients/${pat.id}`)}
                >
                  فتح ملف المريض والملاحظات
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/doctor/prescriptions/new?patientId=${pat.id}`)}
                >
                  كتابة روشتة
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// 5. Doctor Patient Profile with Private Clinical Notes Tab (Section 12 & 13)
export const DoctorPatientProfilePage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const {
    session,
    patients,
    appointments,
    prescriptions,
    medicalRecords,
    getDoctorPrivateNotes,
    saveDoctorPrivateNote,
    deleteDoctorPrivateNote,
  } = useApp();
  const navigate = useNavigate();

  const patient = patients.find((p) => p.id === patientId) ?? patients[0];
  const [activeTab, setActiveTab] = useState('notes');
  const [noteContent, setNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    if (patient) {
      document.title = `ملف المريض: ${patient.name} — بوابة الطبيب`;
    }
  }, [patient]);

  if (!patient) {
    return (
      <div className="max-w-[640px] mx-auto py-12 text-center space-y-4">
        <EmptyState
          icon={<Users className="w-12 h-12" />}
          title="لم يتم العثور على المريض"
          description="لا تتوفر بيانات لهذا المريض في النظام حاليًا."
          action={
            <Button variant="primary" onClick={() => navigate('/doctor/patients')}>
              العودة إلى قائمة المرضى
            </Button>
          }
        />
      </div>
    );
  }

  // Strictly filtered private notes belonging ONLY to the logged-in doctor
  const myPrivateNotes = getDoctorPrivateNotes(patient.id);

  const myPrescriptionsForPatient = prescriptions.filter(
    (rx) => rx.patientId === patient.id && rx.doctorId === (session?.id ?? 'doc-1')
  );

  const patientVisits = appointments.filter((a) => a.patientId === patient.id);
  const patientRecords = medicalRecords.filter((r) => r.patientId === patient.id);

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    saveDoctorPrivateNote({
      id: editingNoteId ?? undefined,
      patientId: patient.id,
      content: noteContent,
      isPinned,
    });
    setNoteContent('');
    setEditingNoteId(null);
    setIsPinned(false);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'لوحة الطبيب', to: '/doctor' },
          { label: 'المرضى', to: '/doctor/patients' },
          { label: patient.name },
        ]}
      />

      {/* Patient Identity & Allergy Alert Header */}
      <Card padding="lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <Avatar name={patient.name} size={56} variant="teal" />
            <div>
              <h1>{patient.name}</h1>
              <div className="text-[14px] text-[var(--color-secondary-text)] mt-0.5">
                الهاتف: <bdi dir="ltr">{patient.phone}</bdi> · المحافظة: {patient.governorate} ({patient.city}) · فصيلة الدم: <bdi dir="ltr">{patient.bloodType ?? 'A+'}</bdi>
              </div>
              {patient.allergies.length > 0 && (
                <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-[var(--radius-sm)] bg-[var(--color-red-subtle)] text-[var(--color-red)] border border-[var(--color-red)]/30 text-[13px] font-bold">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>تنبيه حساسية دوائية: {patient.allergies.join(' — ')}</span>
                </div>
              )}
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => navigate(`/doctor/prescriptions/new?patientId=${patient.id}`)}
          >
            كتابة روشتة لهذا المريض
          </Button>
        </div>
      </Card>

      <Tabs
        tabs={[
          {
            id: 'notes',
            label: 'ملاحظاتي الخاصة (لا يراها غيرك)',
            count: myPrivateNotes.length,
            icon: <Lock className="w-4 h-4 text-[var(--color-neon-orange)]" />,
          },
          { id: 'overview', label: 'السجل الطبي والتقارير', count: patientRecords.length },
          { id: 'visits', label: 'الزيارات والتشخيصات', count: patientVisits.length },
          {
            id: 'prescriptions',
            label: 'الروشتات الصادرة مني',
            count: myPrescriptionsForPatient.length,
          },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Tab 1: Private Clinical Notes (Section 13) */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5">
            <Card padding="md">
              <form onSubmit={handleSaveNote} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-[17px] font-bold flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[var(--color-dark-teal)]" />
                    <span>
                      {editingNoteId ? 'تعديل الملاحظة الخاصة' : 'إضافة ملاحظة إكلينيكية خاصة'}
                    </span>
                  </h2>
                  <span className="text-[12px] font-bold text-[var(--color-dark-teal)] bg-[var(--color-light-teal)] px-2.5 py-0.5 rounded-[var(--radius-sm)]">
                    لا يراها غيرك
                  </span>
                </div>

                <TextArea
                  label="محتوى الملاحظة السرية"
                  required
                  placeholder="دون ملاحظاتك الإكلينيكية الخاصة حول استجابة المريض أو خطة المتابعة القادمة..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                />

                <label className="inline-flex items-center gap-2 text-[14px] font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="w-4 h-4 accent-[var(--color-dark-teal)]"
                  />
                  <span>تثبيت هذه الملاحظة في أعلى ملف المريض</span>
                </label>

                <div className="flex items-center gap-2 pt-2">
                  <Button type="submit" variant="primary" size="md">
                    {editingNoteId ? 'حفظ التعديلات' : 'حفظ الملاحظة السرية'}
                  </Button>
                  {editingNoteId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingNoteId(null);
                        setNoteContent('');
                        setIsPinned(false);
                      }}
                    >
                      إلغاء التعديل
                    </Button>
                  )}
                </div>
              </form>
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <InlineAlert variant="info" title="خصوصية تامة للملاحظات الإكلينيكية">
              هذه الملاحظات مشفرة ومرتبطة بحسابك أنت فقط ({session?.name}). لا يمكن للمريض أو الممرضة أو أي طبيب آخر أو مدير النظام الاطلاع عليها.
            </InlineAlert>

            {myPrivateNotes.length === 0 ? (
              <EmptyState
                icon={<Lock className="w-8 h-8" />}
                title="لا توجد ملاحظات خاصة مسجلة لهذا المريض"
                description="أضف أول ملاحظة إكلينيكية خاصة بك من النموذج الجانبي."
              />
            ) : (
              myPrivateNotes.map((note) => (
                <Card
                  key={note.id}
                  padding="md"
                  className={
                    note.isPinned
                      ? 'border-[var(--color-dark-teal)] bg-[var(--color-light-teal)]/50'
                      : ''
                  }
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 text-[13px] font-bold text-[var(--color-dark-teal)]">
                      {note.isPinned && (
                        <Pin className="w-4 h-4 text-[var(--color-neon-orange)]" />
                      )}
                      <span>{ note.isPinned ? 'ملاحظة مثبتة' : 'ملاحظة خاصة' }</span>
                      <span className="text-[var(--color-secondary-text)] font-normal">
                        · آخر تحديث: {formatShortDateArabic(note.updatedAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          saveDoctorPrivateNote({
                            id: note.id,
                            patientId: note.patientId,
                            content: note.content,
                            isPinned: !note.isPinned,
                          })
                        }
                        aria-label={note.isPinned ? 'إلغاء تثبيت الملاحظة' : 'تثبيت الملاحظة'}
                        className="px-2.5 py-1 rounded text-[12px] font-semibold bg-[var(--color-white)] border border-[var(--color-border)] hover:bg-[var(--color-muted)] cursor-pointer"
                      >
                        {note.isPinned ? 'إلغاء التثبيت' : 'تثبيت'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNoteId(note.id);
                          setNoteContent(note.content);
                          setIsPinned(note.isPinned);
                        }}
                        aria-label="تعديل الملاحظة"
                        className="p-1.5 rounded text-[var(--color-dark-teal)] hover:bg-[var(--color-light-teal)] cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteDoctorPrivateNote(note.id)}
                        aria-label="حذف الملاحظة"
                        className="p-1.5 rounded text-[var(--color-red)] hover:bg-[var(--color-red-subtle)] cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[15px] text-[var(--color-primary-text)] leading-relaxed">
                    {note.content}
                  </p>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Overview & Medical Records */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {patientRecords.map((rec) => (
            <Card key={rec.id} padding="md">
              <div className="flex justify-between text-[13px] text-[var(--color-secondary-text)] mb-1">
                <span className="font-bold text-[var(--color-dark-teal)]">{rec.specialtyAr}</span>
                <span>{formatShortDateArabic(rec.date)}</span>
              </div>
              <h3 className="text-[17px] font-bold mb-1">{rec.title}</h3>
              <p className="text-[15px]">{rec.summary}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Tab 3: Visits */}
      {activeTab === 'visits' && (
        <div className="space-y-4">
          {patientVisits.map((v) => (
            <Card key={v.id} padding="md" className="flex items-center justify-between gap-4">
              <div>
                <div className="font-bold text-[16px]">
                  {formatShortDateArabic(v.date)} — {v.doctorName}
                </div>
                <div className="text-[14px] text-[var(--color-secondary-text)]">
                  التشخيص: {v.diagnosis ?? (v.symptomsOrReason || 'كشف طبي')}
                </div>
              </div>
              <StatusBadge status={v.status} size="sm" />
            </Card>
          ))}
        </div>
      )}

      {/* Tab 4: Prescriptions created by logged-in doctor */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          {myPrescriptionsForPatient.map((rx) => (
            <Card key={rx.id} padding="md" className="space-y-2">
              <div className="flex justify-between">
                <strong className="text-[16px]">{rx.diagnosis}</strong>
                <span className="text-[13px] text-[var(--color-secondary-text)]">
                  {formatShortDateArabic(rx.date)}
                </span>
              </div>
              <div className="text-[14px] text-[var(--color-secondary-text)]">
                الأدوية: {rx.medicines.map((m) => m.name).join(' ، ')}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// 6. Electronic Prescription Builder with Smart Medicine Autocomplete (Section 12 & 30)
export const PrescriptionBuilderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const {
    session,
    patients,
    doctors,
    clinics,
    medicines,
    templates,
    savePrescription,
    savePrescriptionTemplate,
    toggleFavoriteMedicine,
  } = useApp();
  const navigate = useNavigate();

  const currentDoctor =
    doctors.find((d) => d.id === (session?.id ?? 'doc-1')) ?? doctors[0];
  const primaryClinic =
    clinics.find((c) => currentDoctor.clinicIds.includes(c.id)) ?? clinics[0];

  const [selectedPatientId, setSelectedPatientId] = useState(
    searchParams.get('patientId') ?? 'pat-1'
  );
  const [diagnosis, setDiagnosis] = useState('ارتفاع ضغط الدم الأساسي مع متابعة دهون الدم');
  const [prescribedList, setPrescribedList] = useState<PrescribedMedicine[]>([
    {
      id: 'item-1',
      medicineId: 'med-1',
      name: 'كونكور 5 مجم (Concor 5 mg)',
      strength: '5 مجم',
      dosageForm: 'أقراص',
      dosage: 'قرص واحد',
      frequency: 'مرة واحدة يوميًا',
      timeOfUse: 'صباحًا',
      foodRelation: 'بعد الإفطار',
      duration: '30 يومًا',
      quantity: 'علبة واحدة',
      instructions: 'قياس الضغط والنبض بانتظام.',
    },
  ]);
  const [additionalNotes, setAdditionalNotes] = useState(
    'تقليل الملح في الطعام والمشي 30 دقيقة يوميًا.'
  );

  // Smart Medicine Combobox state
  const [medQuery, setMedQuery] = useState('');
  const [comboOpen, setComboOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileMode, setMobileMode] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    document.title = 'محرر الروشتة الإلكترونية الذكي — بوابة الطبيب';
  }, []);

  const selectedPatient =
    patients.find((p) => p.id === selectedPatientId) ?? patients[0];

  const matchingMedicines = useMemo(() => {
    if (!medQuery.trim()) return medicines.slice(0, 6);
    return medicines.filter((m) =>
      matchesSearch(`${m.nameAr} ${m.nameEn} ${m.activeIngredient}`, medQuery)
    );
  }, [medQuery, medicines]);

  const addMedicineFromCatalog = (med: MedicineCatalogItem) => {
    const newItem: PrescribedMedicine = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      medicineId: med.id,
      name: `${med.nameAr} (${med.nameEn})`,
      strength: med.strength,
      dosageForm: med.dosageForm,
      dosage: med.defaultDosage,
      frequency: med.defaultFrequency,
      timeOfUse: 'صباحًا / مساءً',
      foodRelation: med.defaultFoodRelation,
      duration: med.defaultDuration,
      quantity: 'علبة واحدة',
      instructions: '',
    };
    setPrescribedList((prev) => [...prev, newItem]);
    setMedQuery('');
    setComboOpen(false);
  };

  const updateMedicineField = (
    id: string,
    field: keyof PrescribedMedicine,
    val: string
  ) => {
    setPrescribedList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: val } : m))
    );
  };

  const removeMedicineItem = (id: string) => {
    setPrescribedList((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSavePrescription = () => {
    if (!diagnosis.trim() || prescribedList.length === 0) return;
    savePrescription({
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      patientAge: 40,
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      doctorTitle: currentDoctor.titleAr,
      specialtyAr: currentDoctor.specialtyAr,
      clinicId: primaryClinic.id,
      clinicName: primaryClinic.name,
      date: TODAY_DATE,
      diagnosis,
      medicines: prescribedList,
      additionalNotes,
    });
    navigate(`/doctor/patients/${selectedPatient.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1>محرر الروشتة الإلكترونية</h1>
          <p className="text-[15px] text-[var(--color-secondary-text)]">
            أضف الأدوية بالبحث الذكي أو من القوالب الجاهزة مع معاينة فورية للروشتة.
          </p>
        </div>
        <div className="lg:hidden">
          <SegmentedControl
            options={[
              { id: 'edit', label: 'تحرير الروشتة' },
              { id: 'preview', label: 'معاينة الورقة' },
            ]}
            value={mobileMode}
            onChange={(id) => setMobileMode(id as 'edit' | 'preview')}
          />
        </div>
      </div>

      {/* Desktop Side-by-Side Split (Editor | Live Paper Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Start Pane: Editor */}
        <div
          className={`lg:col-span-7 space-y-5 ${
            mobileMode === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          <Card padding="md" className="space-y-4">
            <SelectField
              label="اختر المريض"
              required
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              options={patients.map((p) => ({
                value: p.id,
                label: `${p.name} — ${p.phone}`,
              }))}
            />

            {selectedPatient.allergies.length > 0 && (
              <div className="p-3 rounded-[var(--radius-sm)] bg-[var(--color-red-subtle)] border border-[var(--color-red)]/30 text-[13px] font-bold text-[var(--color-red)] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>تنبيه حساسية للمريض: {selectedPatient.allergies.join(' — ')}</span>
              </div>
            )}

            <TextInput
              label="التشخيص الإكلينيكي"
              required
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </Card>

          {/* Smart Medicine Autocomplete Combobox */}
          <Card padding="md" className="space-y-4">
            <h2 className="text-[17px] font-bold">إضافة دواء (بحث ذكي بالعربية أو الإنجليزية)</h2>

            <div className="relative">
              <label htmlFor="med-combobox" className="sr-only">
                ابحث عن اسم الدواء أو المادة الفعالة
              </label>
              <div className="relative">
                <Search className="w-5 h-5 text-[var(--color-secondary-text)] absolute start-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="med-combobox"
                  role="combobox"
                  aria-expanded={comboOpen}
                  aria-controls="med-listbox"
                  aria-autocomplete="list"
                  value={medQuery}
                  onFocus={() => setComboOpen(true)}
                  onChange={(e) => {
                    setMedQuery(e.target.value);
                    setComboOpen(true);
                    setActiveIndex(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setActiveIndex((i) => Math.min(matchingMedicines.length - 1, i + 1));
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setActiveIndex((i) => Math.max(0, i - 1));
                    } else if (e.key === 'Enter' && comboOpen && matchingMedicines[activeIndex]) {
                      e.preventDefault();
                      addMedicineFromCatalog(matchingMedicines[activeIndex]);
                    } else if (e.key === 'Escape') {
                      setComboOpen(false);
                    }
                  }}
                  placeholder="اكتب حرفين من اسم الدواء (مثال: كونكور، Concor، أوجمنتين، Ator)..."
                  className="w-full h-[48px] ps-11 pe-4 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-white)] text-[16px]"
                />
              </div>

              {comboOpen && matchingMedicines.length > 0 && (
                <ul
                  id="med-listbox"
                  role="listbox"
                  className="mt-1 max-h-[260px] overflow-y-auto rounded-[var(--radius-md)] bg-[var(--color-white)] border border-[var(--color-dark-teal)] shadow-[var(--shadow-md)] divide-y divide-[var(--color-border)] z-[var(--z-dropdown)]"
                >
                  {matchingMedicines.map((med, idx) => (
                    <li
                      key={med.id}
                      role="option"
                      aria-selected={idx === activeIndex}
                      onClick={() => addMedicineFromCatalog(med)}
                      className={`p-3 flex items-center justify-between gap-3 cursor-pointer ${
                        idx === activeIndex
                          ? 'bg-[var(--color-light-teal)]'
                          : 'hover:bg-[var(--color-muted)]'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-[15px] text-[var(--color-primary-text)]">
                          {med.nameAr} — <bdi dir="ltr">{med.nameEn}</bdi>
                        </div>
                        <div className="text-[12px] text-[var(--color-secondary-text)]">
                          المادة الفعالة: <bdi dir="ltr">{med.activeIngredient}</bdi> · {med.strength} · {med.dosageForm}
                        </div>
                      </div>
                      <span className="text-[13px] font-bold text-[var(--color-dark-teal)]">
                        + إضافة
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Favorite & Quick Templates Bar */}
            <div className="space-y-2 pt-2">
              <div className="text-[13px] font-bold text-[var(--color-secondary-text)]">
                الأدوية المفضلة والأكثر استخدامًا:
              </div>
              <div className="flex flex-wrap gap-2">
                {medicines
                  .filter((m) => m.isFavorite)
                  .map((med) => (
                    <button
                      key={med.id}
                      type="button"
                      onClick={() => addMedicineFromCatalog(med)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-light-teal)] hover:bg-[var(--color-teal-subtle)] text-[var(--color-dark-teal)] text-[13px] font-semibold border border-[var(--color-border)] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{med.nameAr}</span>
                    </button>
                  ))}
              </div>
            </div>

            {templates.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[var(--color-border)]">
                <div className="text-[13px] font-bold text-[var(--color-secondary-text)]">
                  قوالب الروشتات المحفوظة:
                </div>
                <div className="flex flex-wrap gap-2">
                  {templates.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => {
                        setDiagnosis(tpl.diagnosis);
                        setPrescribedList(tpl.medicines);
                        setAdditionalNotes(tpl.additionalNotes);
                      }}
                      className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-muted)] hover:bg-[var(--color-light-teal)] text-[var(--color-primary-text)] text-[13px] font-semibold border border-[var(--color-border)] cursor-pointer"
                    >
                      تطبيق قالب: {tpl.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Editable Medicine Items */}
          <div className="space-y-4">
            {prescribedList.map((med, index) => (
              <Card key={med.id} padding="md" className="space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
                  <span className="font-bold text-[16px] text-[var(--color-dark-teal)]">
                    الدواء {formatNumber(index + 1)}: {med.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeMedicineItem(med.id)}
                    aria-label={`حذف ${med.name}`}
                    className="text-[var(--color-red)] hover:bg-[var(--color-red-subtle)] p-1.5 rounded cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <TextInput
                    label="الجرعة"
                    value={med.dosage}
                    onChange={(e) => updateMedicineField(med.id, 'dosage', e.target.value)}
                  />
                  <TextInput
                    label="التكرار"
                    value={med.frequency}
                    onChange={(e) => updateMedicineField(med.id, 'frequency', e.target.value)}
                  />
                  <TextInput
                    label="الارتباط بالأكل"
                    value={med.foodRelation}
                    onChange={(e) => updateMedicineField(med.id, 'foodRelation', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <TextInput
                    label="المدة"
                    value={med.duration}
                    onChange={(e) => updateMedicineField(med.id, 'duration', e.target.value)}
                  />
                  <TextInput
                    label="الكمية"
                    value={med.quantity}
                    onChange={(e) => updateMedicineField(med.id, 'quantity', e.target.value)}
                  />
                  <TextInput
                    label="تعليمات خاصة"
                    value={med.instructions}
                    onChange={(e) => updateMedicineField(med.id, 'instructions', e.target.value)}
                  />
                </div>
              </Card>
            ))}
          </div>

          <Card padding="md" className="space-y-4">
            <TextArea
              label="إرشادات وملاحظات إضافية على الروشتة"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
            />

            <div className="pt-3 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <Button variant="primary" size="lg" onClick={handleSavePrescription}>
                  حفظ الروشتة في سجل المريض
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    savePrescriptionTemplate({
                      doctorId: currentDoctor.id,
                      title: diagnosis.slice(0, 32),
                      diagnosis,
                      medicines: prescribedList,
                      additionalNotes,
                    })
                  }
                >
                  حفظ كقالب
                </Button>
              </div>
              <Button variant="ghost" onClick={() => navigate('/doctor')}>
                إلغاء
              </Button>
            </div>
          </Card>
        </div>

        {/* End Pane: Live Paper Preview */}
        <aside
          className={`lg:col-span-5 sticky top-[88px] ${
            mobileMode === 'edit' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="bg-[var(--color-white)] rounded-[var(--radius-lg)] border-2 border-[var(--color-dark-teal)] p-5 space-y-4">
            <div className="p-2 rounded bg-[var(--color-red-subtle)] text-[var(--color-red)] text-center text-[12px] font-bold">
              معاينة روشتة تجريبية — غير صالحة طبيًا
            </div>
            <div className="border-b border-[var(--color-border)] pb-3">
              <div className="font-bold text-[18px] text-[var(--color-dark-teal)]">
                {currentDoctor.name}
              </div>
              <div className="text-[13px] text-[var(--color-secondary-text)]">
                {primaryClinic.name}
              </div>
            </div>

            <div className="text-[14px] space-y-1 bg-[var(--color-light-teal)] p-3 rounded-[var(--radius-sm)]">
              <div>
                <strong>المريض:</strong> {selectedPatient.name}
              </div>
              <div>
                <strong>التشخيص:</strong> {diagnosis}
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="text-[14px] font-bold text-[var(--color-dark-teal)]">
                الأدوية الموصوفة ({formatNumber(prescribedList.length)}):
              </div>
              {prescribedList.map((m) => (
                <div
                  key={m.id}
                  className="p-2.5 rounded border border-[var(--color-border)] text-[13px]"
                >
                  <div className="font-bold text-[var(--color-primary-text)]">{m.name}</div>
                  <div className="text-[var(--color-secondary-text)]">
                    {m.dosage} · {m.frequency} · {m.foodRelation} · لمدة {m.duration}
                  </div>
                </div>
              ))}
            </div>

            {additionalNotes && (
              <div className="text-[13px] p-2.5 rounded bg-[var(--color-muted)]">
                <strong>تعليمات:</strong> {additionalNotes}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

// 7. Doctor Private Notes Overview Page (/doctor/notes)
export const DoctorNotesPage: React.FC = () => {
  const { patients, getDoctorPrivateNotes, saveDoctorPrivateNote, deleteDoctorPrivateNote } =
    useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.title = 'ملاحظاتي الإكلينيكية السرية — بوابة الطبيب';
  }, []);

  const allMyNotes = getDoctorPrivateNotes();

  const filteredNotes = useMemo(
    () =>
      allMyNotes.filter((n) => {
        const pat = patients.find((p) => p.id === n.patientId);
        return matchesSearch(`${pat?.name ?? ''} ${n.content}`, query);
      }),
    [allMyNotes, patients, query]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-[var(--color-dark-teal)]" />
            <span>سجل ملاحظاتي الإكلينيكية السرية</span>
          </h1>
          <p className="text-[15px] text-[var(--color-secondary-text)]">
            جميع الملاحظات الخاصة التي دونتها لنفسك حول مرضاك — لا يراها غيرك.
          </p>
        </div>
      </div>

      <InlineAlert variant="info" title="حماية الخصوصية الإكلينيكية (Section 13)">
        تخضع هذه الصفحة لحماية صلاحيات صارمة؛ لا يظهر هنا سوى الملاحظات التي أنشأتها بحسابك الحالي، ولا يمكن للمرضى أو التمريض أو الإدارة الوصول إليها.
      </InlineAlert>

      <Card padding="sm">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="ابحث في ملاحظاتك الخاصة أو باسم المريض..."
        />
      </Card>

      <div className="space-y-4">
        {filteredNotes.map((note) => {
          const pat = patients.find((p) => p.id === note.patientId);
          return (
            <Card key={note.id} padding="md" className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {note.isPinned && (
                    <Pin className="w-4 h-4 text-[var(--color-neon-orange)]" />
                  )}
                  <strong className="text-[16px] text-[var(--color-dark-teal)]">
                    المريض: {pat?.name ?? note.patientId}
                  </strong>
                  <span className="text-[12px] text-[var(--color-secondary-text)]">
                    · {formatShortDateArabic(note.updatedAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/doctor/patients/${note.patientId}`)}
                  >
                    ملف المريض
                  </Button>
                  <button
                    type="button"
                    onClick={() =>
                      saveDoctorPrivateNote({
                        id: note.id,
                        patientId: note.patientId,
                        content: note.content,
                        isPinned: !note.isPinned,
                      })
                    }
                    className="text-[13px] font-semibold text-[var(--color-dark-teal)] px-2 py-1 hover:underline cursor-pointer"
                  >
                    {note.isPinned ? 'إلغاء التثبيت' : 'تثبيت'}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteDoctorPrivateNote(note.id)}
                    aria-label="حذف الملاحظة"
                    className="text-[var(--color-red)] p-1.5 hover:bg-[var(--color-red-subtle)] rounded cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-[15px] text-[var(--color-primary-text)]">{note.content}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// 8. Complete 8-Step Doctor Visit Examination Workflow (Section 14 & 30)
export const DoctorVisitWorkflowPage: React.FC = () => {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const {
    session,
    appointments,
    patients,
    doctors,
    clinics,
    medicalRecords,
    getDoctorPrivateNotes,
    saveDoctorPrivateNote,
    savePrescription,
    updateAppointmentStatus,
  } = useApp();
  const navigate = useNavigate();

  const apt =
    appointments.find((a) => a.id === appointmentId) ?? appointments[1] ?? appointments[0];
  const patient = patients.find((p) => p.id === apt?.patientId) ?? patients[0];
  const doctor =
    doctors.find((d) => d.id === (session?.id ?? 'doc-1')) ?? doctors[0];
  const clinic = clinics.find((c) => c.id === apt?.clinicId) ?? clinics[0];

  const [step, setStep] = useState(0);
  const [diagnosis, setDiagnosis] = useState(
    apt?.diagnosis ?? 'ارتفاع ضغط الدم الأساسي المنتظم — متابعة دورية'
  );
  const [privateNoteText, setPrivateNoteText] = useState('');
  const [medName, setMedName] = useState('كونكور 5 مجم (Concor 5 mg)');
  const [medDosage, setMedDosage] = useState('قرص واحد صباحًا بعد الإفطار');

  useEffect(() => {
    if (patient) {
      document.title = `سير الكشف الطبي: ${patient.name} — بوابة الطبيب`;
    }
  }, [patient]);

  if (!apt || !patient || !doctor || !clinic) {
    return (
      <div className="max-w-[640px] mx-auto py-12 text-center space-y-4">
        <EmptyState
          icon={<Stethoscope className="w-12 h-12" />}
          title="لم يتم العثور على حالة كشف"
          description="يرجى اختيار مريض من قائمة الانتظار للبدء في جلسة الكشف."
          action={
            <Button variant="primary" onClick={() => navigate('/doctor')}>
              العودة إلى لوحة تحكم الطبيب
            </Button>
          }
        />
      </div>
    );
  }

  const workflowSteps = [
    'بيانات المريض والحساسية',
    'السجل الطبي السابق',
    'ملاحظاتي السرية السابقة',
    'التشخيص والروشتة والملاحظات',
  ];

  const myPreviousNotes = getDoctorPrivateNotes(patient.id);
  const patientRecords = medicalRecords.filter((r) => r.patientId === patient.id);

  const handleCompleteVisit = () => {
    if (privateNoteText.trim()) {
      saveDoctorPrivateNote({
        patientId: patient.id,
        visitId: apt.id,
        content: privateNoteText.trim(),
        isPinned: false,
      });
    }

    savePrescription(
      {
        patientId: patient.id,
        patientName: patient.name,
        patientAge: apt.patientAge ?? 45,
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorTitle: doctor.titleAr,
        specialtyAr: doctor.specialtyAr,
        clinicId: clinic.id,
        clinicName: clinic.name,
        appointmentId: apt.id,
        date: TODAY_DATE,
        diagnosis,
        medicines: [
          {
            id: `vmed-${Date.now()}`,
            name: medName,
            strength: '5 مجم',
            dosageForm: 'أقراص',
            dosage: medDosage,
            frequency: 'مرة واحدة يوميًا',
            timeOfUse: 'صباحًا',
            foodRelation: 'بعد الإفطار',
            duration: '30 يومًا',
            quantity: 'علبة واحدة',
            instructions: 'المتابعة الدورية.',
          },
        ],
        additionalNotes: 'تم إتمام الكشف وحفظ الزيارة.',
      },
      apt.id
    );

    updateAppointmentStatus(apt.id, 'completed');
    navigate('/doctor');
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'لوحة الطبيب', to: '/doctor' },
          { label: `كشف المريض: ${patient.name} (${apt.bookingNumber})` },
        ]}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1>جلسة الكشف الطبي: {patient.name}</h1>
          <p className="text-[14px] text-[var(--color-secondary-text)]">
            رقم الحجز: {apt.bookingNumber} · شكوى المريض: {apt.symptomsOrReason}
          </p>
        </div>
        <StatusBadge status={apt.status} />
      </div>

      <Stepper steps={workflowSteps} currentStep={step} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <Card padding="lg" className="space-y-5">
            {step === 0 && (
              <div className="space-y-4">
                <h2>١. مراجعة بيانات المريض والتنبيهات الدوائية</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[15px]">
                  <div className="p-3.5 rounded bg-[var(--color-muted)]">
                    <strong>الاسم:</strong> {patient.name}
                  </div>
                  <div className="p-3.5 rounded bg-[var(--color-muted)]">
                    <strong>الأمراض المزمنة:</strong>{' '}
                    {patient.chronicConditions.join('، ') || 'لا يوجد'}
                  </div>
                </div>
                {patient.allergies.length > 0 && (
                  <InlineAlert variant="error" title="تنبيه حساسية دوائية هام">
                    {patient.allergies.join(' — ')}
                  </InlineAlert>
                )}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <h2>٢. مراجعة الزيارات والسجل الطبي السابق</h2>
                {patientRecords.map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-[var(--radius-md)] border border-[var(--color-border)] space-y-1"
                  >
                    <div className="font-bold">{r.title}</div>
                    <p className="text-[14px] text-[var(--color-secondary-text)]">{r.summary}</p>
                  </div>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h2 className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[var(--color-dark-teal)]" />
                  <span>٣. مراجعة ملاحظاتي الإكلينيكية السرية السابقة</span>
                </h2>
                {myPreviousNotes.length === 0 ? (
                  <p className="text-[14px] text-[var(--color-secondary-text)]">
                    لا توجد ملاحظات خاصة سابقة لهذا المريض.
                  </p>
                ) : (
                  myPreviousNotes.map((n) => (
                    <div
                      key={n.id}
                      className="p-3.5 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] border border-[var(--color-border)]"
                    >
                      <p className="text-[15px]">{n.content}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h2>٤. تسجيل التشخيص والروشتة والملاحظة السرية</h2>
                <TextInput
                  label="التشخيص الإكلينيكي للزيارة الحالية"
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    label="الدواء الأساسي"
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                  />
                  <TextInput
                    label="الجرعة وطريقة الاستخدام"
                    value={medDosage}
                    onChange={(e) => setMedDosage(e.target.value)}
                  />
                </div>
                <TextArea
                  label="ملاحظة إكلينيكية خاصة جديدة (سرية — لا يراها غيرك)"
                  placeholder="دون أي ملاحظة خاصة لهذه الزيارة..."
                  value={privateNoteText}
                  onChange={(e) => setPrivateNoteText(e.target.value)}
                />
              </div>
            )}

            <div className="pt-5 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
              {step < 3 ? (
                <Button variant="primary" onClick={() => setStep((s) => s + 1)}>
                  حفظ ومتابعة
                </Button>
              ) : (
                <Button
                  variant="success-confirm"
                  size="lg"
                  icon={<Check className="w-5 h-5" />}
                  onClick={handleCompleteVisit}
                >
                  إنهاء الكشف وحفظ الزيارة
                </Button>
              )}

              {step > 0 && (
                <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
                  الخطوة السابقة
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* Context Summary Panel */}
        <aside className="lg:col-span-4">
          <Card padding="md" className="space-y-3">
            <h3 className="text-[16px] font-bold text-[var(--color-dark-teal)]">
              ملخص سريع للمريض
            </h3>
            <div className="text-[14px] space-y-2">
              <div>
                <strong>المريض:</strong> {patient.name}
              </div>
              <div>
                <strong>الحساسية:</strong>{' '}
                <span className="text-[var(--color-red)] font-semibold">
                  {patient.allergies.join('، ') || 'لا يوجد'}
                </span>
              </div>
              <div>
                <strong>عدد ملاحظاتي الخاصة:</strong> {formatNumber(myPreviousNotes.length)}
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
};
