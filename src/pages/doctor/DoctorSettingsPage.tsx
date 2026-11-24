import React, { useEffect, useState } from 'react';
import {
  Check,
  Save,
  Settings,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export const DoctorSettingsPage: React.FC = () => {
  const { session, doctors, updateDoctorSettings } = useApp();

  const currentDoctor =
    doctors.find((d) => d.id === (session?.id ?? 'doc-1')) ?? doctors[0];

  const [queueOffset, setQueueOffset] = useState(currentDoctor?.queueOffset ?? 4);
  const [avgExamMinutes, setAvgExamMinutes] = useState(currentDoctor?.avgExamMinutes ?? 10);
  const [lateAction, setLateAction] = useState<'fine' | 'cancel'>(currentDoctor?.lateAction ?? 'fine');
  const [defaultLateFine, setDefaultLateFine] = useState(currentDoctor?.defaultLateFine ?? 50);
  const [defaultNoShowFine, setDefaultNoShowFine] = useState(currentDoctor?.defaultNoShowFine ?? 100);
  const [followUpDays, setFollowUpDays] = useState(currentDoctor?.followUpDays ?? 14);
  const [followUpFee, setFollowUpFee] = useState(currentDoctor?.followUpFee ?? 0);
  const [maxPatientsPerDay, setMaxPatientsPerDay] = useState(currentDoctor?.maxPatientsPerDay ?? 30);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    document.title = 'إعدادات الطابور والكشوفات — الطبيب';
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDoctor) return;

    updateDoctorSettings(currentDoctor.id, {
      queueOffset: Number(queueOffset) || 4,
      avgExamMinutes: Number(avgExamMinutes) || 10,
      lateAction,
      defaultLateFine: Number(defaultLateFine) || 0,
      defaultNoShowFine: Number(defaultNoShowFine) || 0,
      followUpDays: Number(followUpDays) || 14,
      followUpFee: Number(followUpFee) || 0,
      maxPatientsPerDay: Number(maxPatientsPerDay) || 30,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (!currentDoctor) return null;

  return (
    <div className="max-w-[760px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[var(--color-neon-orange)] uppercase mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>لوائح وسياسات العيادة</span>
          </div>
          <h1 className="text-[24px] sm:text-[28px] font-extrabold text-[var(--color-dark-teal)]">
            إعدادات الطابور وغرامات الحجز
          </h1>
          <p className="text-[14px] text-[var(--color-secondary-text)]">
            تتحكم هذه الإعدادات في حسابات أرقام الطابور، التنبيهات المسبقة، وسياسات التأخير والاستشارة للمرضى.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--color-green-subtle)] border border-[var(--color-green)] text-[var(--color-green)] text-[14px] font-bold flex items-center gap-2 shadow-xs">
          <Check className="w-4 h-4 shrink-0" />
          <span>تم حفظ الإعدادات وتحديثها على الفور عبر المنظومة كاملة.</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="p-6 rounded-[var(--radius-lg)] bg-[var(--color-white)] border border-[var(--color-border)] shadow-sm space-y-6">
        {/* 1. Queue Offset */}
        <div className="space-y-1.5 pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <label htmlFor="queue-offset" className="text-[15px] font-bold text-[var(--color-primary-text)]">
              فارق التنبيه والطلب المسبق (Queue Offset):
            </label>
            <span className="text-[16px] font-black tabular-nums text-[var(--color-dark-teal)]">
              +{queueOffset} تذاكر
            </span>
          </div>
          <p className="text-[13px] text-[var(--color-secondary-text)] leading-relaxed">
            الرقم المعروض للمريض = (رقم الحالة الحالية داخل الكشف + الفارق). هذا يضمن استدعاء المريض قبل دوره بحوالي {queueOffset} كشوفات حتى لا تفرغ صالة الاستراحة أبدًا.
          </p>
          <input
            id="queue-offset"
            type="number"
            min={1}
            max={10}
            value={queueOffset}
            onChange={(e) => setQueueOffset(Number(e.target.value))}
            className="w-full sm:w-48 px-3.5 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] font-bold text-[15px] outline-none focus:border-[var(--color-dark-teal)]"
          />
        </div>

        {/* 2. Avg Exam Minutes */}
        <div className="space-y-1.5 pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center justify-between">
            <label htmlFor="avg-minutes" className="text-[15px] font-bold text-[var(--color-primary-text)]">
              متوسط مدة الكشف الفعلي (بالدقائق):
            </label>
            <span className="text-[16px] font-black tabular-nums text-[var(--color-dark-teal)]">
              {avgExamMinutes} دقيقة
            </span>
          </div>
          <p className="text-[13px] text-[var(--color-secondary-text)] leading-relaxed">
            يُستخدم لحساب الوقت التقريبي (Box 4) المعروض في تذكرة المريض: المتبقي = (العدد أمامه × متوسط الكشف).
          </p>
          <input
            id="avg-minutes"
            type="number"
            min={3}
            max={60}
            value={avgExamMinutes}
            onChange={(e) => setAvgExamMinutes(Number(e.target.value))}
            className="w-full sm:w-48 px-3.5 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] font-bold text-[15px] outline-none focus:border-[var(--color-dark-teal)]"
          />
        </div>

        {/* 3. Late Action & Penalties */}
        <div className="space-y-3 pb-4 border-b border-[var(--color-border)]">
          <label className="text-[15px] font-bold text-[var(--color-primary-text)] block">
            إجراء تأخير المريض عن موعده (Late Action):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              className={`p-3.5 rounded-[var(--radius-md)] border-2 cursor-pointer flex items-center justify-between transition-colors ${
                lateAction === 'fine'
                  ? 'border-[var(--color-dark-teal)] bg-[var(--color-light-teal)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-dark-teal)]'
              }`}
            >
              <div>
                <span className="font-bold text-[14px] text-[var(--color-primary-text)] block">
                  فرض غرامة تأخير ونقله لآخر الطابور
                </span>
                <span className="text-[12px] text-[var(--color-secondary-text)]">
                  يُكشف عليه بنهاية اليوم وتضاف الغرامة لحسابه.
                </span>
              </div>
              <input
                type="radio"
                name="lateAction"
                checked={lateAction === 'fine'}
                onChange={() => setLateAction('fine')}
                className="ms-2 accent-[var(--color-dark-teal)]"
              />
            </label>

            <label
              className={`p-3.5 rounded-[var(--radius-md)] border-2 cursor-pointer flex items-center justify-between transition-colors ${
                lateAction === 'cancel'
                  ? 'border-[var(--color-red)] bg-[var(--color-red-subtle)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-red)]'
              }`}
            >
              <div>
                <span className="font-bold text-[14px] text-[var(--color-primary-text)] block">
                  إلغاء الحجز تلقائيًا
                </span>
                <span className="text-[12px] text-[var(--color-secondary-text)]">
                  يُلغى الموعد ويتم إشعار المريض بسبب الإلغاء.
                </span>
              </div>
              <input
                type="radio"
                name="lateAction"
                checked={lateAction === 'cancel'}
                onChange={() => setLateAction('cancel')}
                className="ms-2 accent-[var(--color-red)]"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label htmlFor="late-fine" className="text-[13.5px] font-semibold text-[var(--color-primary-text)] block mb-1">
                غرامة التأخير الافتراضية (ج.م):
              </label>
              <input
                id="late-fine"
                type="number"
                min={0}
                step={10}
                value={defaultLateFine}
                onChange={(e) => setDefaultLateFine(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] font-bold text-[15px] outline-none focus:border-[var(--color-dark-teal)]"
              />
            </div>

            <div>
              <label htmlFor="noshow-fine" className="text-[13.5px] font-semibold text-[var(--color-primary-text)] block mb-1">
                غرامة عدم الحضور التام No-Show (ج.م):
              </label>
              <input
                id="noshow-fine"
                type="number"
                min={0}
                step={10}
                value={defaultNoShowFine}
                onChange={(e) => setDefaultNoShowFine(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] font-bold text-[15px] outline-none focus:border-[var(--color-dark-teal)]"
              />
            </div>
          </div>
        </div>

        {/* 4. Follow-Up Window & Fee */}
        <div className="space-y-3 pb-4 border-b border-[var(--color-border)]">
          <label className="text-[15px] font-bold text-[var(--color-primary-text)] block">
            صلاحية ورسوم كشف الاستشارة (إعادة):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="followup-days" className="text-[13.5px] font-semibold text-[var(--color-primary-text)] block mb-1">
                فترة صلاحية الإعادة (بالأيام):
              </label>
              <input
                id="followup-days"
                type="number"
                min={1}
                max={60}
                value={followUpDays}
                onChange={(e) => setFollowUpDays(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] font-bold text-[15px] outline-none focus:border-[var(--color-dark-teal)]"
              />
              <span className="text-[11.5px] text-[var(--color-secondary-text)] block mt-0.5">
                أي مريض يكشف بنفس الموبايل خلال هذه الفترة يُصنف كـ "إعادة".
              </span>
            </div>

            <div>
              <label htmlFor="followup-fee" className="text-[13.5px] font-semibold text-[var(--color-primary-text)] block mb-1">
                سعر كشف الاستشارة / الإعادة (ج.م):
              </label>
              <input
                id="followup-fee"
                type="number"
                min={0}
                step={10}
                value={followUpFee}
                onChange={(e) => setFollowUpFee(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] font-bold text-[15px] outline-none focus:border-[var(--color-dark-teal)]"
              />
              <span className="text-[11.5px] text-[var(--color-secondary-text)] block mt-0.5">
                0 ج.م يعني الاستشارة مجانية تمامًا.
              </span>
            </div>
          </div>
        </div>

        {/* 5. Max Patients per day */}
        <div className="space-y-1.5">
          <label htmlFor="max-patients" className="text-[15px] font-bold text-[var(--color-primary-text)] block">
            الحد الأقصى لحالات الكشف يوميًا:
          </label>
          <input
            id="max-patients"
            type="number"
            min={5}
            max={100}
            value={maxPatientsPerDay}
            onChange={(e) => setMaxPatientsPerDay(Number(e.target.value))}
            className="w-full sm:w-48 px-3.5 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] font-bold text-[15px] outline-none focus:border-[var(--color-dark-teal)]"
          />
          <span className="text-[12px] text-[var(--color-secondary-text)] block">
            عند الوصول لهذا العدد يُغلق اليوم تلقائيًا في شاشة اختيار الأيام للمرضى.
          </span>
        </div>

        {/* Save CTA */}
        <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-dark-teal)] hover:bg-[var(--color-teal-hover)] text-[var(--color-white)] font-bold text-[15px] flex items-center gap-2 cursor-pointer shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>حفظ الإعدادات</span>
          </button>
        </div>
      </form>
    </div>
  );
};
