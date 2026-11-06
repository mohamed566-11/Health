import React, { useState } from 'react';
import {
  Check,
  Clock,
  Copy,
  MapPin,
  Navigation,
  Phone,
  Wallet,
} from 'lucide-react';
import { Clinic } from '../../types';
import {
  formatCurrencyEGP,
  formatNumber,
  formatTime12hArabic,
  isClinicOpenNow,
} from '../../utils/formatters';
import { Button, Card } from '../common/UIPrimitives';
import { Modal } from '../modals/Overlays';
import { useApp } from '../../contexts/AppContext';

interface ClinicLocationCardProps {
  clinic: Clinic;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (clinic: Clinic) => void;
}

export const ClinicLocationCard: React.FC<ClinicLocationCardProps> = ({
  clinic,
  selectable = false,
  selected = false,
  onSelect,
}) => {
  const { showToast } = useApp();
  const [directionsOpen, setDirectionsOpen] = useState(false);

  const isOpen = isClinicOpenNow(clinic.startTime, clinic.endTime, clinic.isActive);

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fullText = `${clinic.name} — ${clinic.address}، ${clinic.city}، ${clinic.governorate}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(fullText).catch(() => {});
    }
    showToast('تم نسخ عنوان العيادة إلى الحافظة', 'success');
  };

  return (
    <>
      <Card
        interactive={selectable && clinic.isActive}
        selected={selected}
        padding="md"
        role={selectable ? 'radio' : undefined}
        aria-checked={selectable ? selected : undefined}
        tabIndex={selectable && clinic.isActive ? 0 : undefined}
        onClick={() => {
          if (selectable && clinic.isActive && onSelect) {
            onSelect(clinic);
          }
        }}
        onKeyDown={(e) => {
          if (selectable && clinic.isActive && onSelect && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onSelect(clinic);
          }
        }}
        className={`flex flex-col justify-between h-full ${
          !clinic.isActive ? 'opacity-65 bg-[var(--color-muted)]' : ''
        }`}
      >
        <div>
          {/* 1. Header row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              {selectable && (
                <span
                  className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                    selected
                      ? 'bg-[var(--color-dark-teal)] border-[var(--color-dark-teal)] text-[var(--color-white)]'
                      : 'border-[var(--color-secondary-text)] bg-[var(--color-white)]'
                  }`}
                >
                  {selected && <Check className="w-4 h-4" />}
                </span>
              )}
              <h3 className="text-[18px] font-bold text-[var(--color-primary-text)]">
                {clinic.name}
              </h3>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] text-[13px] font-semibold whitespace-nowrap shrink-0 border ${
                !clinic.isActive
                  ? 'bg-[var(--color-muted)] text-[var(--color-secondary-text)] border-[var(--color-border)]'
                  : isOpen
                  ? 'bg-[var(--color-green-subtle)] text-[var(--color-green)] border-[var(--color-green)]/30'
                  : 'bg-[var(--color-red-subtle)] text-[var(--color-red)] border-[var(--color-red)]/30'
              }`}
            >
              {!clinic.isActive ? 'العيادة متوقفة حاليًا' : isOpen ? 'مفتوحة الآن' : 'مغلقة'}
            </span>
          </div>

          {/* 2. Stylized abstract SVG map placeholder (120px height) */}
          <div className="relative h-[120px] w-full rounded-[var(--radius-md)] bg-[var(--color-light-teal)] border border-[var(--color-border)] overflow-hidden mb-4">
            <svg
              viewBox="0 0 400 120"
              className="w-full h-full object-cover"
              role="img"
              aria-label={`خريطة توضيحية لموقع ${clinic.name}`}
            >
              <rect width="400" height="120" fill="#EDF5F5" />
              {/* Stylized street grid lines */}
              <path
                d="M0 30 H400 M0 65 H400 M0 95 H400 M70 0 V120 M160 0 V120 M250 0 V120 M330 0 V120"
                stroke="#E3EBEA"
                strokeWidth="3"
              />
              <path
                d="M20 120 L140 0 M210 120 L350 0"
                stroke="#FFFFFF"
                strokeWidth="6"
                opacity="0.85"
              />
              {/* Subtle city block rectangles */}
              <rect x="80" y="36" width="70" height="22" rx="4" fill="#E5F0F1" />
              <rect x="260" y="70" width="60" height="20" rx="4" fill="#E5F0F1" />
              {/* Pin drop shadow */}
              <ellipse cx="200" cy="82" rx="14" ry="5" fill="#0B434C" opacity="0.18" />
              {/* Dark Teal Pin with Neon Orange center dot */}
              <path
                d="M200 22 C186 22 175 33 175 47 C175 64 200 82 200 82 C200 82 225 64 225 47 C225 33 214 22 200 22 Z"
                fill="#0B434C"
              />
              <circle cx="200" cy="46" r="8" fill="#FF5533" />
            </svg>
            <span className="absolute bottom-2 start-2.5 px-2 py-0.5 rounded bg-[var(--color-white)]/90 text-[12px] font-semibold text-[var(--color-secondary-text)] border border-[var(--color-border)]">
              خريطة توضيحية — {clinic.governorate} · {clinic.city}
            </span>
          </div>

          {/* 3. Address block */}
          <div className="space-y-1.5 mb-4">
            <div className="flex items-start gap-2 text-[15px] font-semibold text-[var(--color-primary-text)]">
              <MapPin
                className="w-5 h-5 text-[var(--color-dark-teal)] shrink-0 mt-1"
                strokeWidth={1.75}
              />
              <span>{clinic.address}</span>
            </div>
            <p className="text-[13px] text-[var(--color-secondary-text)] ps-7">
              {clinic.governorate} · {clinic.city} · {clinic.district} — {clinic.landmark}
            </p>
          </div>

          {/* 4. Meta row (3 compact items with icons) */}
          <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-[var(--color-border)] text-[13px] mb-4">
            <div className="flex items-center gap-1.5 text-[var(--color-secondary-text)]">
              <Navigation className="w-4 h-4 text-[var(--color-dark-teal)] shrink-0" />
              <span className="tabular-nums">حوالي {formatNumber(clinic.distanceKm)} كم تقريبًا</span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--color-secondary-text)]">
              <Clock className="w-4 h-4 text-[var(--color-dark-teal)] shrink-0" />
              <span className="tabular-nums">
                {formatTime12hArabic(clinic.startTime)} – {formatTime12hArabic(clinic.endTime)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-[var(--color-primary-text)]">
              <Wallet className="w-4 h-4 text-[var(--color-dark-teal)] shrink-0" />
              <span className="tabular-nums">{formatCurrencyEGP(clinic.consultationPrice)}</span>
            </div>
          </div>
        </div>

        {/* 5. Actions row */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Navigation className="w-4 h-4" />}
            onClick={(e) => {
              e.stopPropagation();
              setDirectionsOpen(true);
            }}
          >
            الاتجاهات
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Copy className="w-4 h-4" />}
            onClick={handleCopyAddress}
          >
            نسخ العنوان
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Phone className="w-4 h-4" />}
            onClick={(e) => {
              e.stopPropagation();
              showToast(`اتصال هاتفي تجريبي بالعيادة: ${clinic.phone}`, 'info');
            }}
          >
            اتصال
          </Button>
        </div>
      </Card>

      <Modal
        open={directionsOpen}
        onClose={() => setDirectionsOpen(false)}
        title={`الاتجاهات إلى ${clinic.name}`}
        footer={
          <Button variant="secondary" onClick={() => setDirectionsOpen(false)}>
            حسناً، فهمت
          </Button>
        }
      >
        <div className="space-y-3 text-[15px]">
          <p className="font-semibold text-[var(--color-dark-teal)]">
            تنبيه الوضع التجريبي: خدمة الخرائط الخارجية والاتجاهات الحية محاكاة في هذه النسخة.
          </p>
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] border border-[var(--color-border)] space-y-1.5">
            <p>
              <strong>العنوان بالتفصيل:</strong> {clinic.address}
            </p>
            <p>
              <strong>المحافظة والمدينة:</strong> {clinic.governorate} — {clinic.city} ({clinic.district})
            </p>
            <p>
              <strong>علامة مميزة للوصول:</strong> {clinic.landmark}
            </p>
            <p>
              <strong>رقم تليفون الاستقبال:</strong> <bdi dir="ltr">{clinic.phone}</bdi>
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};
