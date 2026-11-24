import React, { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  MapPin,
  Search,
  Stethoscope,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { getPatientFlow, setPatientFlow } from '../../services/storageService';
import { formatCurrencyEGP } from '../../utils/formatters';

export const PatientDoctorsPage: React.FC = () => {
  const navigate = useNavigate();
  const { doctors, clinics, specialties } = useApp();
  const [flow] = useState(() => getPatientFlow());

  useEffect(() => {
    document.title = 'قائمة الأطباء المتاحين — موعدي';
  }, []);

  // Filter doctors by chosen location & specialty
  const matchedDoctorsWithClinics = useMemo(() => {
    return doctors
      .filter((d) => d.status === 'approved')
      .map((doctor) => {
        // Find matching clinics for this doctor
        const matchingClinics = clinics.filter((c) => {
          if (!doctor.clinicIds.includes(c.id)) return false;
          if (flow.governorateName && c.governorate !== flow.governorateName) return false;
          if (flow.centerName && c.city !== flow.centerName) return false;
          return true;
        });

        const isSpecMatch = !flow.specialtyId || doctor.specialtyId === flow.specialtyId;

        return {
          doctor,
          matchingClinics,
          isMatch: isSpecMatch && matchingClinics.length > 0,
        };
      })
      .filter((item) => item.isMatch);
  }, [doctors, clinics, flow.governorateName, flow.centerName, flow.specialtyId]);

  const currentSpecialty = specialties.find((s) => s.id === flow.specialtyId);

  const handleSelectDoctor = (doctorId: string) => {
    const nextFlow = { ...flow, doctorId };
    setPatientFlow(nextFlow);
    navigate(`/patient/book/${doctorId}`);
  };

  return (
    <div className="max-w-[800px] mx-auto w-full space-y-4 sm:space-y-6 py-3 sm:py-8 px-3 sm:px-0">
      {/* Location & Specialty Context Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 p-2.5 sm:p-3.5 rounded-[var(--radius-md)] sm:rounded-[var(--radius-lg)] bg-[var(--color-light-teal)] border border-[var(--color-border)]">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11.5px] sm:text-[13px] font-semibold text-[var(--color-dark-teal)]">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--color-neon-orange)] shrink-0" />
            <strong>{flow.governorateName || 'كل المحافظات'}</strong> — {flow.centerName || 'كل المراكز'}
          </span>
          <span>·</span>
          <span className="inline-flex items-center gap-1">
            <Stethoscope className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--color-dark-teal)] shrink-0" />
            <strong>تخصص: {currentSpecialty?.nameAr || flow.specialtyName || 'الكل'}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/patient/specialties"
            className="text-[11.5px] sm:text-[13px] font-bold text-[var(--color-dark-teal)] hover:underline"
          >
            تغيير التخصص
          </Link>
          <span className="text-[var(--color-border)]">|</span>
          <Link
            to="/patient"
            className="text-[11.5px] sm:text-[13px] font-bold text-[var(--color-secondary-text)] hover:underline"
          >
            تغيير المكان
          </Link>
        </div>
      </div>

      {/* Screen Title */}
      <div>
        <h1 className="text-[18px] sm:text-[30px] font-extrabold text-[var(--color-dark-teal)]">
          الأطباء المتاحون في {flow.centerName || flow.governorateName || 'منطقتك'}
        </h1>
        <p className="text-[12px] sm:text-[14px] text-[var(--color-secondary-text)] mt-0.5 sm:mt-1">
          اختر الطبيب المناسب للانتقال مباشرة إلى خطوة حجز رقم الدور.
        </p>
      </div>

      {/* Empty State */}
      {matchedDoctorsWithClinics.length === 0 ? (
        <div className="text-center py-8 sm:py-12 px-3 sm:px-4 rounded-[var(--radius-md)] sm:rounded-[var(--radius-lg)] bg-[var(--color-white)] border-2 border-dashed border-[var(--color-border)] space-y-3 sm:space-y-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[var(--color-muted)] text-[var(--color-secondary-text)] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-[16px] sm:text-[20px] font-bold text-[var(--color-primary-text)]">
              مفيش دكاترة هنا دلوقتي
            </h2>
            <p className="text-[12px] sm:text-[14px] text-[var(--color-secondary-text)] max-w-[420px] mx-auto">
              لم نعثر على أطباء في تخصص {currentSpecialty?.nameAr || 'المطلوب'} داخل {flow.centerName || 'هذا المركز'}. يمكنك تجربة مركز مجاور أو تغيير التخصص.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-1 sm:pt-2">
            <button
              type="button"
              onClick={() => navigate('/patient')}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-[var(--radius-md)] bg-[var(--color-dark-teal)] text-[var(--color-white)] font-bold text-[12.5px] sm:text-[14px] hover:bg-[var(--color-teal-hover)] cursor-pointer"
            >
              تغيير المكان / المركز
            </button>
            <button
              type="button"
              onClick={() => navigate('/patient/specialties')}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-[var(--radius-md)] bg-[var(--color-white)] border border-[var(--color-border)] text-[var(--color-primary-text)] font-bold text-[12.5px] sm:text-[14px] hover:bg-[var(--color-muted)] cursor-pointer"
            >
              اختيار تخصص آخر
            </button>
          </div>
        </div>
      ) : (
        /* Doctor Cards List */
        <div className="space-y-2.5 sm:space-y-4">
          {matchedDoctorsWithClinics.map(({ doctor, matchingClinics }) => {
            const clinic = matchingClinics[0];
            const workingDaysText = clinic?.workingDays?.join('، ') || 'السبت، الإثنين، الأربعاء';

            return (
              <div
                key={doctor.id}
                className="group p-3.5 sm:p-6 rounded-[var(--radius-md)] sm:rounded-[var(--radius-lg)] bg-[var(--color-white)] border-2 border-[var(--color-border)] hover:border-[var(--color-dark-teal)] shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
              >
                {/* Doctor Bio & Clinic Details */}
                <div className="space-y-1.5 sm:space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-[11px] sm:text-[12px] font-bold px-1.5 py-0.5 rounded bg-[var(--color-teal)]/10 text-[var(--color-dark-teal)]">
                      {doctor.specialtyAr}
                    </span>
                    <span className="text-[11px] sm:text-[12px] text-[var(--color-secondary-text)]">
                      خبرة {doctor.yearsExperience} سنة
                    </span>
                  </div>

                  <h2 className="text-[16px] sm:text-[22px] font-bold text-[var(--color-dark-teal)]">
                    {doctor.name}
                  </h2>

                  <p className="text-[12px] sm:text-[13.5px] text-[var(--color-primary-text)] line-clamp-2">
                    {doctor.titleAr}
                  </p>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 sm:gap-x-4 text-[11.5px] sm:text-[13px] text-[var(--color-secondary-text)] pt-0.5 sm:pt-1">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--color-neon-orange)] shrink-0" />
                      <span>{clinic.name} — {clinic.address}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--color-dark-teal)] shrink-0" />
                      <span>أيام العمل: {workingDaysText}</span>
                    </span>
                  </div>
                </div>

                {/* Price & Book Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-[var(--color-border)] shrink-0 gap-2">
                  <div className="text-start sm:text-end">
                    <span className="text-[10px] sm:text-[11px] font-bold text-[var(--color-secondary-text)] block">
                      سعر الكشف
                    </span>
                    <span className="text-[16px] sm:text-[22px] font-extrabold text-[var(--color-dark-teal)] tabular-nums">
                      {formatCurrencyEGP(doctor.consultationFee)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectDoctor(doctor.id)}
                    className="w-auto px-4 py-2 sm:px-5 sm:py-2.5 rounded-[var(--radius-md)] bg-[#FF5533] hover:bg-[#E64525] active:bg-[#CC391B] text-white font-bold text-[13px] sm:text-[15px] shadow-sm cursor-pointer transition-colors"
                  >
                    احجز دورك الآن ←
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
