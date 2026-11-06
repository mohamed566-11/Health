import React, { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Calendar,
  Check,
  MapPin,
  MessageSquare,
  Plus,
  RotateCcw,
  Shield,
  Stethoscope,
  Users,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Doctor, Nurse, Specialty } from '../../types';
import {
  Button,
  Card,
  InlineAlert,
  RatingDisplay,
} from '../../components/common/UIPrimitives';
import {
  PhoneInput,
  SearchInput,
  SelectField,
  TextInput,
} from '../../components/forms/FormControls';
import { KpiCard, SegmentedStatusBar } from '../../components/common/DashboardCharts';
import { ConfirmDialog, Modal } from '../../components/modals/Overlays';
import {
  formatCurrencyEGP,
  formatNumber,
  formatShortDateArabic,
  matchesSearch,
} from '../../utils/formatters';
import { TODAY_DATE } from '../../data/appointments';

// 1. Admin Dashboard Page
export const AdminDashboardPage: React.FC = () => {
  const {
    doctors,
    patients,
    clinics,
    appointments,
    reviews,
    updateDoctorStatusAdmin,
  } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'لوحة إدارة منصة موعدي — Super Admin';
  }, []);

  const dailyBookings = appointments.filter((a) => a.date === TODAY_DATE).length;
  const activeBookings = appointments.filter((a) =>
    ['in_examination', 'arrived', 'waiting', 'booked'].includes(a.status)
  ).length;
  const pendingDoctors = doctors.filter((d) => d.status === 'pending');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1>لوحة التحكم الإدارية للمنصة (Super Admin)</h1>
          <p className="text-[15px] text-[var(--color-secondary-text)]">
            مراقبة الأطباء، العيادات، المرضى، التخصصات، والتقييمات في جميع المحافظات.
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate('/admin/doctors')}>
          إدارة الأطباء والتراخيص
        </Button>
      </div>

      {/* 6 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          icon={<Stethoscope className="w-6 h-6" />}
          label="إجمالي الأطباء"
          value={doctors.length}
        />
        <KpiCard
          icon={<Users className="w-6 h-6" />}
          label="إجمالي المرضى"
          value={patients.length}
        />
        <KpiCard
          icon={<Building2 className="w-6 h-6" />}
          label="العيادات المسجلة"
          value={clinics.length}
        />
        <KpiCard
          icon={<Calendar className="w-6 h-6" />}
          label="حجوزات اليوم"
          value={dailyBookings}
        />
        <KpiCard
          icon={<Check className="w-6 h-6" />}
          label="الحجوزات النشطة"
          value={activeBookings}
        />
        <KpiCard
          icon={<MessageSquare className="w-6 h-6" />}
          label="التقييمات"
          value={reviews.length}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Card padding="md" className="space-y-4">
            <h2 className="text-[18px] font-bold">طلبات اعتماد الأطباء الجديدة</h2>
            {pendingDoctors.length === 0 ? (
              <p className="text-[14px] text-[var(--color-secondary-text)]">
                تمت مراجعة جميع طلبات الأطباء المعلقة.
              </p>
            ) : (
              pendingDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] border border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-[16px]">{doc.name}</div>
                    <div className="text-[14px] text-[var(--color-secondary-text)]">
                      {doc.specialtyAr} — {doc.titleAr}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="success-confirm"
                      size="sm"
                      onClick={() => updateDoctorStatusAdmin(doc.id, 'approved')}
                    >
                      اعتماد الحساب
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => updateDoctorStatusAdmin(doc.id, 'rejected')}
                    >
                      رفض
                    </Button>
                  </div>
                </div>
              ))
            )}
          </Card>
        </div>

        <div className="lg:col-span-5">
          <SegmentedStatusBar
            title="توزيع حالات الأطباء المسجلين"
            items={[
              {
                label: 'معتمد',
                count: doctors.filter((d) => d.status === 'approved').length,
                colorVar: '--color-dark-teal',
              },
              {
                label: 'قيد المراجعة',
                count: doctors.filter((d) => d.status === 'pending').length,
                colorVar: '--color-neon-orange',
              },
              {
                label: 'موقوف / مرفوض',
                count: doctors.filter(
                  (d) => d.status === 'suspended' || d.status === 'rejected'
                ).length,
                colorVar: '--color-secondary-text',
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

// 2. Admin Doctors Management Page
export const AdminDoctorsPage: React.FC = () => {
  const { doctors, specialties, updateDoctorStatusAdmin, saveDoctorAdmin } = useApp();
  const [query, setQuery] = useState('');
  const [editingDoc, setEditingDoc] = useState<Doctor | null>(null);

  useEffect(() => {
    document.title = 'إدارة الأطباء — إدارة منصة موعدي';
  }, []);

  const filtered = useMemo(
    () =>
      doctors.filter((d) =>
        matchesSearch(`${d.name} ${d.specialtyAr} ${d.titleAr}`, query)
      ),
    [doctors, query]
  );

  const statusLabel: Record<Doctor['status'], { text: string; classes: string }> = {
    approved: {
      text: 'معتمد ونشط',
      classes: 'bg-[var(--color-green-subtle)] text-[var(--color-green)]',
    },
    pending: {
      text: 'بانتظار الاعتماد',
      classes: 'bg-[var(--color-orange-subtle)] text-[var(--color-primary-text)]',
    },
    suspended: {
      text: 'موقوف مؤقتًا',
      classes: 'bg-[var(--color-muted)] text-[var(--color-secondary-text)]',
    },
    rejected: {
      text: 'مرفوض',
      classes: 'bg-[var(--color-red-subtle)] text-[var(--color-red)]',
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1>إدارة الأطباء والتراخيص ({formatNumber(doctors.length)})</h1>
          <p className="text-[15px] text-[var(--color-secondary-text)]">
            اعتماد الأطباء الجدد، تعديل البيانات، أو إيقاف الحسابات التجريبية.
          </p>
        </div>
      </div>

      <Card padding="sm">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="ابحث باسم الطبيب أو التخصص..."
        />
      </Card>

      <Card padding="none" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[15px] border-collapse">
            <thead>
              <tr className="bg-[var(--color-muted)] text-[var(--color-secondary-text)] border-b border-[var(--color-border)] text-[13px]">
                <th className="py-3 px-4 text-start">الطبيب</th>
                <th className="py-3 px-4 text-start">التخصص</th>
                <th className="py-3 px-4 text-start">سعر الكشف</th>
                <th className="py-3 px-4 text-start">التقييم</th>
                <th className="py-3 px-4 text-start">الحالة</th>
                <th className="py-3 px-4 text-start">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-[var(--color-light-teal)]/40">
                  <td className="py-3.5 px-4">
                    <div className="font-bold">{doc.name}</div>
                    <div className="text-[13px] text-[var(--color-secondary-text)]">
                      {doc.titleAr}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[var(--color-dark-teal)]">
                    {doc.specialtyAr}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums font-bold">
                    {formatCurrencyEGP(doc.consultationFee)}
                  </td>
                  <td className="py-3.5 px-4">
                    <RatingDisplay rating={doc.rating} reviewsCount={doc.reviewsCount} />
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-[var(--radius-sm)] text-[13px] font-bold ${
                        statusLabel[doc.status].classes
                      }`}
                    >
                      {statusLabel[doc.status].text}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {doc.status !== 'approved' && (
                        <Button
                          variant="success-confirm"
                          size="sm"
                          onClick={() => updateDoctorStatusAdmin(doc.id, 'approved')}
                        >
                          اعتماد
                        </Button>
                      )}
                      {doc.status === 'approved' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateDoctorStatusAdmin(doc.id, 'suspended')}
                        >
                          إيقاف مؤقت
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingDoc(doc)}
                      >
                        تعديل
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={Boolean(editingDoc)}
        onClose={() => setEditingDoc(null)}
        title={`تعديل بيانات ${editingDoc?.name ?? ''}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditingDoc(null)}>
              إلغاء
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                if (editingDoc) {
                  saveDoctorAdmin(editingDoc);
                  setEditingDoc(null);
                }
              }}
            >
              حفظ التعديلات
            </Button>
          </>
        }
      >
        {editingDoc && (
          <div className="space-y-4">
            <TextInput
              label="اسم الطبيب"
              value={editingDoc.name}
              onChange={(e) => setEditingDoc({ ...editingDoc, name: e.target.value })}
            />
            <SelectField
              label="التخصص"
              value={editingDoc.specialtyAr}
              onChange={(e) => setEditingDoc({ ...editingDoc, specialtyAr: e.target.value })}
              options={specialties.map((s) => ({ value: s.nameAr, label: s.nameAr }))}
            />
            <TextInput
              label="سعر الكشف الأساسي (ج.م)"
              type="number"
              value={String(editingDoc.consultationFee)}
              onChange={(e) =>
                setEditingDoc({
                  ...editingDoc,
                  consultationFee: Number(e.target.value) || 300,
                })
              }
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

// 3. Admin Patients Management Page (Strictly No Private Clinical Notes!)
export const AdminPatientsPage: React.FC = () => {
  const { patients } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    document.title = 'إدارة المرضى — إدارة منصة موعدي';
  }, []);

  const filtered = patients.filter(
    (p) => matchesSearch(p.name, query) || p.phone.includes(query.trim())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1>سجل حسابات المرضى ({formatNumber(patients.length)})</h1>
        <p className="text-[15px] text-[var(--color-secondary-text)]">
          عرض البيانات الإدارية الأساسية للحسابات فقط.
        </p>
      </div>

      <InlineAlert variant="info" title="حماية الخصوصية الطبية للمرضى">
        وفقًا لقواعد الخصوصية في منصة موعدي، لا يملك حساب مدير النظام صلاحية الاطلاع على الملاحظات الإكلينيكية الخاصة بالأطباء.
      </InlineAlert>

      <Card padding="sm">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="ابحث باسم المريض أو رقم الهاتف..."
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <Card key={p.id} padding="md" className="space-y-1.5">
            <div className="font-bold text-[17px]">{p.name}</div>
            <div className="text-[14px] text-[var(--color-secondary-text)]" dir="ltr">
              {p.phone}
            </div>
            <div className="text-[13px] text-[var(--color-secondary-text)]">
              المحافظة: {p.governorate} · المدينة: {p.city}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// 4. Admin Nurses Management Page
export const AdminNursesPage: React.FC = () => {
  const { nurses, clinics, doctors, saveNurseAdmin } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('01055667788');
  const [clinicId, setClinicId] = useState(clinics[0].id);

  useEffect(() => {
    document.title = 'إدارة التمريض والاستقبال — إدارة منصة موعدي';
  }, []);

  const handleCreateNurse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const clinic = clinics.find((c) => c.id === clinicId) ?? clinics[0];
    saveNurseAdmin({
      id: `nurse-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      clinicId: clinic.id,
      doctorId: clinic.doctorId,
      shift: 'الفترة المسائية (04:00 م – 10:00 م)',
      active: true,
    });
    setName('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1>إدارة حسابات التمريض والاستقبال ({formatNumber(nurses.length)})</h1>
          <p className="text-[15px] text-[var(--color-secondary-text)]">
            إنشاء حسابات الممرضات وتعيينهن للعيادات المختلفة.
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setModalOpen(true)}
        >
          إضافة حساب ممرضة جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nurses.map((nurse) => {
          const clinic = clinics.find((c) => c.id === nurse.clinicId);
          const doc = doctors.find((d) => d.id === nurse.doctorId);
          return (
            <Card key={nurse.id} padding="md" className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-bold">{nurse.name}</h2>
                <span className="text-[13px] font-bold text-[var(--color-green)]">نشط</span>
              </div>
              <div className="text-[14px] text-[var(--color-secondary-text)]" dir="ltr">
                {nurse.phone}
              </div>
              <div className="text-[14px]">
                <strong>العيادة المعينة:</strong> {clinic?.name ?? '—'}
              </div>
              <div className="text-[13px] text-[var(--color-secondary-text)]">
                الطبيب: {doc?.name ?? '—'} · الشيفت: {nurse.shift}
              </div>
            </Card>
          );
        })}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="إنشاء حساب ممرضة / استقبال جديد"
      >
        <form onSubmit={handleCreateNurse} className="space-y-4">
          <TextInput
            label="اسم الممرضة"
            required
            placeholder="مثال: هبة الله محمود"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <PhoneInput
            label="رقم الموبايل"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <SelectField
            label="تعيين إلى عيادة"
            value={clinicId}
            onChange={(e) => setClinicId(e.target.value)}
            options={clinics.map((c) => ({ value: c.id, label: c.name }))}
          />
          <div className="pt-3 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              إلغاء
            </Button>
            <Button type="submit" variant="primary">
              إنشاء الحساب
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// 5. Admin Clinics Page
export const AdminClinicsPage: React.FC = () => {
  const { clinics, toggleClinicActive } = useApp();

  useEffect(() => {
    document.title = 'إدارة العيادات — إدارة منصة موعدي';
  }, []);

  return (
    <div className="space-y-6">
      <h1>العيادات المسجلة على المنصة ({formatNumber(clinics.length)})</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clinics.map((c) => (
          <Card key={c.id} padding="md" className="flex flex-col justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-[18px] font-bold">{c.name}</h2>
              <p className="text-[14px] text-[var(--color-secondary-text)]">
                {c.governorate} · {c.city} — {c.address}
              </p>
              <div className="text-[14px] font-semibold text-[var(--color-dark-teal)]">
                الكشف: {formatCurrencyEGP(c.consultationPrice)} · الاستشارة: {formatCurrencyEGP(c.followUpPrice)}
              </div>
            </div>
            <div className="pt-3 border-t border-[var(--color-border)] flex items-center justify-between">
              <span className="text-[13px] font-bold">
                الحالة: {c.isActive ? 'مفعلة' : 'متوقفة'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleClinicActive(c.id)}
              >
                {c.isActive ? 'إيقاف مؤقت' : 'تفعيل'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// 6. Admin Specialties Page
export const AdminSpecialtiesPage: React.FC = () => {
  const { specialties, saveSpecialtyAdmin } = useApp();
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    document.title = 'التخصصات الطبية — إدارة منصة موعدي';
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameAr.trim()) return;
    const created: Specialty = {
      id: `spec-${Date.now()}`,
      nameAr: nameAr.trim(),
      nameEn: nameEn.trim() || 'Specialty',
      description: desc.trim() || 'تخصص طبي معتمد على منصة موعدي.',
      iconName: 'Stethoscope',
      active: true,
    };
    saveSpecialtyAdmin(created);
    setNameAr('');
    setNameEn('');
    setDesc('');
  };

  return (
    <div className="space-y-6">
      <h1>إدارة التخصصات الطبية ({formatNumber(specialties.length)})</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5">
          <Card padding="md">
            <form onSubmit={handleAdd} className="space-y-4">
              <h2 className="text-[18px] font-bold">إضافة تخصص طبي جديد</h2>
              <TextInput
                label="اسم التخصص بالعربية"
                required
                placeholder="مثال: أنف وأذن وحنجرة"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
              />
              <TextInput
                label="الاسم بالإنجليزية"
                placeholder="ENT"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
              />
              <TextInput
                label="وصف مختصر"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              <Button type="submit" variant="primary">
                حفظ التخصص
              </Button>
            </form>
          </Card>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {specialties.map((s) => (
            <Card key={s.id} padding="md" className="space-y-1">
              <div className="font-bold text-[17px]">{s.nameAr}</div>
              <div className="text-[13px] text-[var(--color-dark-teal)] font-semibold">
                {s.nameEn}
              </div>
              <p className="text-[13px] text-[var(--color-secondary-text)]">{s.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// 7. Admin Geographic Locations Page (Cairo, Giza, Beni Suef, Fayoum, Minya, Alexandria)
export const AdminLocationsPage: React.FC = () => {
  const { locations } = useApp();

  useEffect(() => {
    document.title = 'النطاق الجغرافي والمحافظات — إدارة منصة موعدي';
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1>النطاق الجغرافي والمحافظات المدعومة ({formatNumber(locations.length)})</h1>
        <p className="text-[15px] text-[var(--color-secondary-text)]">
          تغطي المنصة القاهرة، الجيزة، الإسكندرية، بني سويف، الفيوم، والمنيا مع المدن والأحياء التابعة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {locations.map((gov) => (
          <Card key={gov.id} padding="md" className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
              <h2 className="text-[18px] font-bold text-[var(--color-dark-teal)]">
                محافظة {gov.nameAr}
              </h2>
              <span className="text-[13px] text-[var(--color-secondary-text)]">{gov.nameEn}</span>
            </div>
            <div className="space-y-2.5 text-[14px]">
              {gov.cities.map((c) => (
                <div key={c.id}>
                  <div className="font-bold text-[var(--color-primary-text)]">{c.nameAr}</div>
                  <div className="text-[13px] text-[var(--color-secondary-text)]">
                    الأحياء: {c.districts.join(' · ')}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// 8. Admin Reviews and Complaints Page
export const AdminReviewsPage: React.FC = () => {
  const { reviews, updateReviewStatusAdmin } = useApp();

  useEffect(() => {
    document.title = 'التقييمات والشكاوى — إدارة منصة موعدي';
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1>مراجعة التقييمات والشكاوى ({formatNumber(reviews.length)})</h1>
        <p className="text-[15px] text-[var(--color-secondary-text)]">
          متابعة تقييمات المرضى بعد انتهاء الكشف واعتمادها أو إخفاؤها.
        </p>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <Card key={rev.id} padding="md" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <strong className="text-[16px]">{rev.patientName}</strong>
                <span className="text-[13px] text-[var(--color-secondary-text)]">
                  قيم زيارة <strong>{rev.doctorName}</strong>
                </span>
                <RatingDisplay rating={rev.overallRating} />
              </div>
              <p className="text-[15px] text-[var(--color-primary-text)]">{rev.comment}</p>
              <div className="text-[12px] text-[var(--color-secondary-text)]">
                الحالة: {rev.status === 'published' ? 'منشور' : rev.status === 'flagged' ? 'مُبلغ عنه للمراجعة' : 'مخفي'} · {formatShortDateArabic(rev.createdAt)}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {rev.status !== 'published' && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => updateReviewStatusAdmin(rev.id, 'published')}
                >
                  نشر التقييم
                </Button>
              )}
              {rev.status !== 'hidden' && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => updateReviewStatusAdmin(rev.id, 'hidden')}
                >
                  إخفاء
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// 9. Admin Settings Page
export const AdminSettingsPage: React.FC = () => {
  const { resetAllDemoData } = useApp();
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    document.title = 'إعدادات النظام التجريبي — إدارة منصة موعدي';
  }, []);

  return (
    <div className="max-w-[680px] space-y-6">
      <h1>إعدادات النظام والبيانات التجريبية</h1>
      <Card padding="lg" className="space-y-4">
        <h2 className="text-[18px] font-bold">إدارة التخزين المحلي (localStorage)</h2>
        <p className="text-[15px] text-[var(--color-secondary-text)]">
          يتم حفظ جميع الحجوزات والطوابير والروشتات محليًا داخل متصفحك تحت نطاق المفاتيح <bdi dir="ltr">maw3edy:v1:*</bdi>. يمكنك استعادة الحالة الأولية للبيانات التجريبية في أي وقت.
        </p>
        <Button
          variant="danger"
          icon={<RotateCcw className="w-4 h-4" />}
          onClick={() => setConfirmOpen(true)}
        >
          إعادة ضبط جميع البيانات التجريبية للمنصة
        </Button>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={resetAllDemoData}
        title="إعادة ضبط قاعدة البيانات التجريبية"
        description="سيتم مسح جميع التعديلات وإعادة تحميل البيانات المصرية الافتراضية (8 أطباء، 12 مريضًا، 6 عيادات، 15 حجزًا). هل تريد المتابعة؟"
        confirmLabel="نعم، إعادة الضبط"
      />
    </div>
  );
};
