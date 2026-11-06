import React from 'react';
import { Calendar, Clock, MapPin, Stethoscope, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Clinic, Doctor } from '../../types';
import { formatCurrencyEGP, formatNumber } from '../../utils/formatters';
import { Avatar, Button, Card, RatingDisplay } from '../common/UIPrimitives';

export const DoctorCard: React.FC<{
  doctor: Doctor;
  primaryClinic?: Clinic;
}> = ({ doctor, primaryClinic }) => {
  const navigate = useNavigate();

  return (
    <Card padding="md" className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-start gap-3.5 mb-3">
          <div className="shrink-0 mt-0.5">
            <Avatar name={doctor.name} size={56} variant="teal" />
          </div>
          <div className="min-w-0 flex-1">
            <h3
              title={doctor.name}
              className="text-[16px] leading-snug font-bold text-[var(--color-primary-text)] line-clamp-2 break-words"
            >
              {doctor.name}
            </h3>
            <p className="text-[13px] font-semibold text-[var(--color-dark-teal)] flex items-center gap-1 mt-1">
              <Stethoscope className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
              <span className="line-clamp-1">{doctor.specialtyAr}</span>
            </p>
            <div className="mt-1">
              <RatingDisplay rating={doctor.rating} reviewsCount={doctor.reviewsCount} />
            </div>
          </div>
        </div>

        <p className="text-[14px] text-[var(--color-secondary-text)] line-clamp-2 mb-4">
          {doctor.titleAr}
        </p>

        <div className="space-y-2 py-3 border-t border-b border-[var(--color-border)] text-[14px] mb-4">
          {primaryClinic && (
            <div className="flex items-center gap-2 text-[var(--color-primary-text)]">
              <MapPin
                className="w-4 h-4 text-[var(--color-dark-teal)] shrink-0"
                strokeWidth={1.75}
              />
              <span className="truncate">
                {primaryClinic.city} · {primaryClinic.district} — حوالي{' '}
                {formatNumber(primaryClinic.distanceKm)} كم
              </span>
            </div>
          )}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[var(--color-secondary-text)]">
              <Wallet
                className="w-4 h-4 text-[var(--color-dark-teal)] shrink-0"
                strokeWidth={1.75}
              />
              <span>سعر الكشف:</span>
              <strong className="tabular-nums text-[var(--color-primary-text)]">
                {formatCurrencyEGP(doctor.consultationFee)}
              </strong>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-green)]">
              <Clock className="w-4 h-4 shrink-0" />
              <span>{doctor.nextAvailableText}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <Button
          variant="secondary"
          size="sm"
          icon={<Calendar className="w-4 h-4" />}
          onClick={() => navigate(`/patient/booking/${doctor.id}`)}
        >
          احجز الآن
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/patient/doctors/${doctor.id}`)}
        >
          عرض الملف
        </Button>
      </div>
    </Card>
  );
};
