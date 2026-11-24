import React, { useEffect } from 'react';
import { Pill, Printer } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { Breadcrumbs, Button, EmptyState } from '../../components/common/UIPrimitives';
import { formatDateArabic, formatShortDateArabic } from '../../utils/formatters';

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
            <Button variant="primary" onClick={() => navigate('/patient')}>
              العودة إلى الصفحة الرئيسية
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-0 py-2 sm:py-6">
      <div className="no-print flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 max-w-[794px] mx-auto">
        <Breadcrumbs
          items={[
            { label: 'الرئيسية', to: '/patient' },
            { label: `روشتة ${formatShortDateArabic(rx.date)}` },
          ]}
        />
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            onClick={() => window.print()}
          >
            طباعة / حفظ كملف PDF
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            رجوع
          </Button>
        </div>
      </div>

      {/* A4 Paper Card (max-w-[794px]) */}
      <div className="overflow-x-auto">
        <article
          aria-label="وثيقة الروشتة الإلكترونية"
          className="prescription-paper max-w-[794px] mx-auto bg-[var(--color-white)] rounded-[var(--radius-md)] sm:rounded-[var(--radius-lg)] border-2 border-[var(--color-dark-teal)] p-3.5 sm:p-10 max-md:p-3.5 max-md:space-y-3.5 space-y-6"
        >
          {/* Top Demo Medical Disclaimer Banner (Visible on screen AND print) */}
          <div className="p-2 sm:p-3 rounded-[var(--radius-sm)] bg-[var(--color-red-subtle)] border border-[var(--color-red)] text-[var(--color-red)] text-center font-bold text-[11.5px] sm:text-[14px]">
            روشتة تجريبية للعرض فقط — غير صالحة طبيًا ولا يُصرف بها دواء من الصيدليات (DEMO ONLY)
          </div>

          {/* Doctor & Clinic Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 pb-3 sm:pb-5 border-b-2 border-[var(--color-dark-teal)]">
            <div>
              <h1 className="text-[18px] sm:text-[24px] font-bold text-[var(--color-dark-teal)]">
                {rx.doctorName}
              </h1>
              <p className="text-[12.5px] sm:text-[15px] font-semibold text-[var(--color-primary-text)]">
                {rx.doctorTitle} — {rx.specialtyAr}
              </p>
              <p className="text-[11.5px] sm:text-[13px] text-[var(--color-secondary-text)] mt-0.5 sm:mt-1">
                {rx.clinicName}
              </p>
            </div>
            <div className="text-start sm:text-end text-[12px] sm:text-[14px] space-y-0.5 sm:space-y-1">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 p-2.5 sm:p-4 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] border border-[var(--color-border)] text-[12.5px] sm:text-[15px]">
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
          <div className="space-y-2.5 sm:space-y-3">
            <h2 className="text-[15px] sm:text-[18px] font-bold text-[var(--color-dark-teal)] flex items-center gap-1.5 sm:gap-2">
              <Pill className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>الأدوية الموصوفة والجرعات (℞)</span>
            </h2>

            {/* Desktop/Tablet/Print Table (Protected range >= 640px + Print) */}
            <div className="hidden sm:block print:block overflow-x-auto">
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

            {/* Mobile Screen Cards (< 640px, Hidden in Print) */}
            <div className="block sm:hidden print:hidden space-y-2.5">
              {rx.medicines.map((med, idx) => (
                <div
                  key={med.id || idx}
                  className="p-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] space-y-2 shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-[var(--color-border)]/60 pb-1.5">
                    <div>
                      <div className="font-bold text-[13.5px] text-[var(--color-primary-text)]">
                        <bdi>{med.name}</bdi>
                      </div>
                      <div className="text-[11.5px] text-[var(--color-secondary-text)]">
                        {med.dosageForm} · {med.strength}
                      </div>
                    </div>
                    <span className="text-[10.5px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--color-teal)]/10 text-[var(--color-dark-teal)] shrink-0">
                      ℞ {idx + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[11.5px]">
                    <div>
                      <span className="text-[var(--color-secondary-text)] block text-[10px]">الجرعة والتكرار:</span>
                      <strong className="text-[var(--color-primary-text)] block">{med.dosage}</strong>
                      <span className="text-[10.5px] text-[var(--color-secondary-text)] block">{med.frequency}</span>
                    </div>
                    <div>
                      <span className="text-[var(--color-secondary-text)] block text-[10px]">الموعد والأكل:</span>
                      <span className="text-[var(--color-primary-text)] block">{med.timeOfUse}</span>
                      <strong className="text-[var(--color-dark-teal)] text-[10.5px] block">{med.foodRelation}</strong>
                    </div>
                    <div className="col-span-2 flex items-center justify-between border-t border-[var(--color-border)]/40 pt-1.5 text-[11px]">
                      <div>
                        <span className="text-[var(--color-secondary-text)]">المدة: </span>
                        <strong className="text-[var(--color-primary-text)]">{med.duration}</strong>
                      </div>
                      <div>
                        <span className="text-[var(--color-secondary-text)]">الكمية: </span>
                        <strong className="text-[var(--color-primary-text)]">{med.quantity}</strong>
                      </div>
                    </div>
                  </div>

                  {med.instructions && (
                    <div className="text-[11px] text-[var(--color-dark-teal)] bg-[var(--color-teal)]/10 p-1.5 rounded-[var(--radius-sm)]">
                      تعليمات: {med.instructions}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          {rx.additionalNotes && (
            <div className="p-2.5 sm:p-4 rounded-[var(--radius-md)] bg-[var(--color-muted)] border border-[var(--color-border)]">
              <div className="text-[12px] sm:text-[14px] font-bold text-[var(--color-primary-text)] mb-0.5 sm:mb-1">
                إرشادات وتعليمات إضافية للمريض:
              </div>
              <p className="text-[12.5px] sm:text-[15px] text-[var(--color-primary-text)]">{rx.additionalNotes}</p>
            </div>
          )}

          {/* Footer Disclaimer */}
          <div className="pt-3 sm:pt-5 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2 text-[11px] sm:text-[13px] text-[var(--color-secondary-text)]">
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
