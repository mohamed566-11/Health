import React, { useEffect, useState } from 'react';
import {
  Baby,
  Bone,
  Brain,
  ChevronLeft,
  HeartPulse,
  MapPin,
  Stethoscope,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { getPatientFlow, setPatientFlow } from '../../services/storageService';

const SPECIALTY_ICONS: Record<string, React.ReactNode> = {
  'spec-1': <HeartPulse className="w-8 h-8" />,
  'spec-2': <Stethoscope className="w-8 h-8" />,
  'spec-3': <Bone className="w-8 h-8" />,
  'spec-4': <Baby className="w-8 h-8" />,
  'spec-5': <Brain className="w-8 h-8" />,
};

export const PatientSpecialtiesPage: React.FC = () => {
  const navigate = useNavigate();
  const { specialties } = useApp();
  const [flow, setFlowState] = useState(() => getPatientFlow());

  useEffect(() => {
    document.title = 'اختر التخصص الطبي — موعدي';
  }, []);

  const handleSelectSpecialty = (specialtyId: string, specialtyName: string) => {
    const nextFlow = {
      ...flow,
      specialtyId,
      specialtyName,
    };
    setFlowState(nextFlow);
    setPatientFlow(nextFlow);
    navigate('/patient/doctors');
  };

  return (
    <div className="max-w-[840px] mx-auto w-full space-y-4 sm:space-y-8 py-3 sm:py-8 px-3 sm:px-0">
      {/* Location Breadcrumb Pill */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[var(--color-light-teal)] border border-[var(--color-border)] text-[11.5px] sm:text-[13px] font-semibold text-[var(--color-dark-teal)]">
          <MapPin className="w-3.5 h-3.5 text-[var(--color-neon-orange)] shrink-0" />
          <span>
            {flow.governorateName ? `${flow.governorateName} — ${flow.centerName || 'كل المراكز'}` : 'كل المحافظات'}
          </span>
        </div>
        <Link
          to="/patient"
          className="text-[11.5px] sm:text-[13px] font-bold text-[var(--color-dark-teal)] hover:underline"
        >
          تغيير المكان
        </Link>
      </div>

      {/* Screen Title */}
      <div className="text-center space-y-1 sm:space-y-2">
        <span className="text-[11px] sm:text-[12px] font-bold text-[var(--color-neon-orange)] uppercase tracking-wider">
          الخطوة 2 من 3
        </span>
        <h1 className="text-[20px] sm:text-[34px] font-extrabold text-[var(--color-dark-teal)]">
          ما هو التخصص المطلوب؟
        </h1>
        <p className="text-[12.5px] sm:text-[16px] text-[var(--color-secondary-text)]">
          اختر التخصص لعرض الأطباء المتاحين وجداول مواعيدهم فورًا.
        </p>
      </div>

      {/* 5 Large Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
        {specialties.slice(0, 5).map((spec) => {
          const isSelected = flow.specialtyId === spec.id;
          const icon = SPECIALTY_ICONS[spec.id] ?? <Stethoscope className="w-8 h-8" />;

          return (
            <button
              key={spec.id}
              type="button"
              onClick={() => handleSelectSpecialty(spec.id, spec.nameAr)}
              className={`group flex flex-col items-center text-center p-4 sm:p-6 rounded-[var(--radius-md)] sm:rounded-[var(--radius-lg)] border-2 transition-all cursor-pointer transform hover:-translate-y-1 active:translate-y-0 ${
                isSelected
                  ? 'bg-[var(--color-light-teal)] border-[var(--color-neon-orange)] shadow-md'
                  : 'bg-[var(--color-white)] border-[var(--color-border)] hover:border-[var(--color-dark-teal)] shadow-sm hover:shadow-md'
              }`}
            >
              <div
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-2.5 sm:mb-4 transition-transform group-hover:scale-110 ${
                  isSelected
                    ? 'bg-[var(--color-neon-orange)] text-[var(--color-white)]'
                    : 'bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] group-hover:bg-[var(--color-dark-teal)] group-hover:text-[var(--color-white)]'
                }`}
              >
                {icon}
              </div>

              <h2 className="text-[16px] sm:text-[20px] font-bold text-[var(--color-dark-teal)] mb-1 sm:mb-1.5">
                {spec.nameAr}
              </h2>

              <p className="text-[11.5px] sm:text-[13px] text-[var(--color-secondary-text)] line-clamp-2 leading-relaxed mb-3 sm:mb-4">
                {spec.description}
              </p>

              <span className="mt-auto inline-flex items-center gap-1 text-[12px] sm:text-[13px] font-bold text-[var(--color-neon-orange)] group-hover:underline">
                <span>عرض الأطباء</span>
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
