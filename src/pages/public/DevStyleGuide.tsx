import React, { useEffect, useState } from 'react';
import { Calendar, Check, Grid, HeartPulse, Stethoscope, Users } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import {
  Avatar,
  Breadcrumbs,
  Button,
  Card,
  EmptyState,
  ErrorState,
  InlineAlert,
  RatingDisplay,
  SegmentedControl,
  Skeleton,
  StatusBadge,
  Stepper,
  Tabs,
} from '../../components/common/UIPrimitives';
import {
  DatePicker,
  PhoneInput,
  SearchInput,
  StarRatingInput,
  TextInput,
  TimeSlotPicker,
} from '../../components/forms/FormControls';
import { ClinicLocationCard } from '../../components/cards/ClinicLocationCard';

export const DevStyleGuidePage: React.FC = () => {
  const { clinics, debugGrid, setDebugGrid } = useApp();
  const [activeTab, setActiveTab] = useState('tokens');
  const [segment, setSegment] = useState('edit');
  const [sampleDate, setSampleDate] = useState('2026-11-05');
  const [sampleSlot, setSampleSlot] = useState('06:15 م');
  const [sampleStars, setSampleStars] = useState(5);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    document.title = 'دليل التصميم والمكونات (/dev/ui) — موعدي';
  }, []);

  const colorTokens = [
    { name: '--color-dark-teal', hex: '#0B434C', role: 'اللون الأساسي والتنقل' },
    { name: '--color-white', hex: '#FFFFFF', role: 'الخلفيات والبطاقات' },
    { name: '--color-neon-orange', hex: '#FF5533', role: 'الإجراء الرئيسي والتمييز' },
    { name: '--color-green', hex: '#23845C', role: 'النجاح وإتمام الكشف فقط' },
    { name: '--color-red', hex: '#D94848', role: 'الأخطاء والإلغاء والتحذيرات الحرجة فقط' },
    { name: '--color-background', hex: '#F5F8F8', role: 'خلفية الصفحات' },
    { name: '--color-light-teal', hex: '#EDF5F5', role: 'الأسطح الهادئة والتحديد' },
    { name: '--color-primary-text', hex: '#16363A', role: 'النص الأساسي' },
    { name: '--color-secondary-text', hex: '#708486', role: 'النص الثانوي' },
    { name: '--color-border', hex: '#E3EBEA', role: 'الحدود والفواصل' },
  ];

  return (
    <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: 'الرئيسية', to: '/' },
          { label: 'دليل التصميم والمكونات (/dev/ui)' },
        ]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1>دليل التصميم والمكونات الحية (/dev/ui)</h1>
          <p className="text-[15px] text-[var(--color-secondary-text)]">
            مرجع شامل لألوان الهوية، التايبوجرافي العربي، المسافات، وجميع المكونات التفاعلية وحالاتها.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<Grid className="w-4 h-4" />}
          onClick={() => setDebugGrid((g) => !g)}
        >
          {debugGrid ? 'إخفاء شبكة 8px' : 'إظهار شبكة المحاذاة 8px'}
        </Button>
      </div>

      <Tabs
        tabs={[
          { id: 'tokens', label: 'الألوان والتايبوجرافي' },
          { id: 'buttons', label: 'الأزرار والشارات' },
          { id: 'forms', label: 'النماذج وأدوات الإدخال' },
          { id: 'cards', label: 'بطاقات العيادات والحالات' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Colors & Typography */}
      <section className="space-y-6">
        <h2>١. نظام الألوان الصارم (Brand Color Tokens)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {colorTokens.map((t) => (
            <Card key={t.name} padding="sm">
              <div
                className="h-14 w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] mb-2"
                style={{ backgroundColor: t.hex }}
              />
              <div className="text-[13px] font-bold text-[var(--color-primary-text)]">
                <bdi dir="ltr">{t.hex}</bdi>
              </div>
              <div className="text-[12px] text-[var(--color-secondary-text)]">
                <bdi dir="ltr">{t.name}</bdi>
              </div>
              <div className="text-[12px] text-[var(--color-primary-text)] mt-1">{t.role}</div>
            </Card>
          ))}
        </div>

        <Card padding="md" className="space-y-3">
          <h2>٢. مقياس الخط العربي (Cairo Type Scale)</h2>
          <div style={{ fontSize: 'var(--text-display)', fontWeight: 700, lineHeight: 1.3 }}>
            عنوان ترحيبي (Display) — منصة موعدي للرعاية الصحية
          </div>
          <h1>عنوان رئيسي (H1) — قائمة الأطباء والعيادات</h1>
          <h2>عنوان قسم (H2) — تفاصيل الحجز والطابور</h2>
          <h3>عنوان بطاقة فرعي (H3) — د. أحمد محمود استشاري القلب</h3>
          <p className="text-[16px]">
            نص أساسي (Body 16px / 1.75) — يتيح لك موقع موعدي حجز موعدك ومتابعة دورك في العيادة لحظة بلحظة باللغة العربية الواضحة.
          </p>
          <p className="text-[14px] text-[var(--color-secondary-text)]">
            نص ثانوي مساعد (Small 14px) — جميع الأرقام بنمط Tabular Numerals: <span className="tabular-nums font-bold">01012345678 — #025 — 350 ج.م</span>
          </p>
        </Card>
      </section>

      {/* Buttons & Status Badges */}
      <section className="space-y-6">
        <Card padding="md" className="space-y-4">
          <h2>٣. الأزرار وحالات الطابور (Buttons & StatusBadges)</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="lg">
              إجراء رئيسي (Primary)
            </Button>
            <Button variant="secondary">ثانوي (Dark Teal)</Button>
            <Button variant="outline">إطار (Outline)</Button>
            <Button variant="ghost">نصي (Ghost)</Button>
            <Button variant="success-confirm" icon={<Check className="w-4 h-4" />}>
              إنهاء الكشف واستدعاء التالي
            </Button>
            <Button variant="danger">إلغاء الحجز (Danger)</Button>
            <Button variant="secondary" loading>
              جاري الحفظ...
            </Button>
            <Button variant="secondary" disabled>
              معطل (Disabled)
            </Button>
          </div>

          <div className="pt-4 border-t border-[var(--color-border)] flex flex-wrap items-center gap-2.5">
            <StatusBadge status="booked" />
            <StatusBadge status="waiting" />
            <StatusBadge status="arrived" />
            <StatusBadge status="in_examination" />
            <StatusBadge status="completed" />
            <StatusBadge status="no_show" />
            <StatusBadge status="cancelled" />
          </div>

          <div className="pt-4 border-t border-[var(--color-border)] flex flex-wrap items-center gap-4">
            <Avatar name="د. أحمد محمود" size={32} />
            <Avatar name="أحمد محمد" size={40} />
            <Avatar name="منى إبراهيم" size={56} />
            <Avatar name="سارة عبد الرحمن" size={96} />
            <RatingDisplay rating={4.9} reviewsCount={142} />
            <SegmentedControl
              options={[
                { id: 'edit', label: 'تحرير الروشتة' },
                { id: 'preview', label: 'معاينة الطباعة' },
              ]}
              value={segment}
              onChange={setSegment}
            />
          </div>
        </Card>
      </section>

      {/* Form Controls */}
      <section className="space-y-6">
        <Card padding="md" className="space-y-5">
          <h2>٤. عناصر النماذج والتقويم والمواعيد</h2>
          <Stepper
            steps={['اختيار العيادة', 'تحديد التاريخ', 'اختيار الموعد', 'مراجعة الحجز', 'التأكيد']}
            currentStep={1}
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TextInput label="اسم المريض" required defaultValue="أحمد محمد" />
            <PhoneInput label="رقم الموبايل" required defaultValue="01012345678" />
            <TextInput
              label="حقل به خطأ تحقق"
              required
              defaultValue="123"
              error="يرجى إدخال رقم موبايل مصري صحيح مكون من 11 رقمًا."
            />
          </div>
          <SearchInput value={searchVal} onChange={setSearchVal} />
          <StarRatingInput label="تقييم تجربة الزيارة" value={sampleStars} onChange={setSampleStars} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DatePicker selectedDate={sampleDate} onSelectDate={setSampleDate} />
            <TimeSlotPicker selectedSlot={sampleSlot} onSelectSlot={setSampleSlot} />
          </div>
        </Card>
      </section>

      {/* Clinic Location Card & States */}
      <section className="space-y-6">
        <h2>٥. بطاقة موقع العيادة وحالات التحميل والفراغ والخطأ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ClinicLocationCard clinic={clinics[0]} />
          <div className="space-y-4">
            <InlineAlert variant="info" title="تنبيه معلوماتي">
              جميع المكونات تتبع خصائص CSS المنطقية (Logical Properties) لدعم RTL الكامل.
            </InlineAlert>
            <Skeleton className="h-24 w-full" />
            <EmptyState
              icon={<Calendar className="w-8 h-8" />}
              title="لا توجد حجوزات قادمة"
              description="يمكنك البحث عن طبيب وحجز موعد جديد في أقل من دقيقة."
              actionLabel="احجز موعدًا الآن"
              onAction={() => {}}
            />
            <ErrorState />
          </div>
        </div>
      </section>
    </div>
  );
};
