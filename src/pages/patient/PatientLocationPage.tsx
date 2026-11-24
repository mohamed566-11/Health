import React, { useEffect, useMemo, useState } from 'react';
import {
  Baby,
  Bone,
  Brain,
  Calendar,
  Compass,
  Filter,
  HeartPulse,
  MapPin,
  RefreshCw,
  Search,
  Stethoscope,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { SearchableCombobox } from '../../components/forms/SearchableCombobox';
import { getPatientFlow, getPatientSession, setPatientFlow } from '../../services/storageService';
import { formatCurrencyEGP, formatDoctorsCount } from '../../utils/formatters';

const SPECIALTY_ICONS: Record<string, React.ReactNode> = {
  'spec-1': <HeartPulse className="w-6 h-6" />,
  'spec-2': <Stethoscope className="w-6 h-6" />,
  'spec-3': <Bone className="w-6 h-6" />,
  'spec-4': <Baby className="w-6 h-6" />,
  'spec-5': <Brain className="w-6 h-6" />,
};

export const PatientLocationPage: React.FC = () => {
  const navigate = useNavigate();
  const { locations, specialties, doctors, clinics } = useApp();

  const [savedFlow, setSavedFlowState] = useState(() => getPatientFlow());
  const [selectedGovId, setSelectedGovId] = useState(
    savedFlow.governorateId || locations[0]?.id || 'gov-cairo'
  );
  const [selectedCenterId, setSelectedCenterId] = useState(savedFlow.centerId || '');
  const [selectedSpecId, setSelectedSpecId] = useState(savedFlow.specialtyId || '');
  const [session] = useState(() => getPatientSession());

  const currentGov = useMemo(
    () => locations.find((g) => g.id === selectedGovId) ?? locations[0],
    [locations, selectedGovId]
  );

  const centers = useMemo(() => currentGov?.cities ?? [], [currentGov]);

  useEffect(() => {
    document.title = 'حجز كشف طبي — اختر العيادة والطبيب | موعدي';
  }, []);

  // Compute doctor count per governorate
  const govOptions = useMemo(() => {
    return locations.map((gov) => {
      const docCount = doctors.filter((doc) => {
        if (doc.status !== 'approved') return false;
        return clinics.some(
          (c) => doc.clinicIds.includes(c.id) && c.governorate === gov.nameAr
        );
      }).length;

      return {
        id: gov.id,
        label: gov.nameAr,
        badge: formatDoctorsCount(docCount),
        subtext: docCount === 0 ? 'لا يتوفر أطباء حاليًا' : undefined,
      };
    });
  }, [locations, doctors, clinics]);

  // Compute doctor count per center in current governorate
  const centerOptions = useMemo(() => {
    const allOption = {
      id: '',
      label: `كل المراكز في ${currentGov?.nameAr || 'المحافظة'}`,
      badge: undefined,
    };

    const items = centers.map((center) => {
      const docCount = doctors.filter((doc) => {
        if (doc.status !== 'approved') return false;
        return clinics.some(
          (c) =>
            doc.clinicIds.includes(c.id) &&
            c.governorate === currentGov?.nameAr &&
            c.city === center.nameAr
        );
      }).length;

      return {
        id: center.id,
        label: center.nameAr,
        badge: formatDoctorsCount(docCount),
        disabled: docCount === 0,
        subtext: docCount === 0 ? 'مفيش دكاترة هنا دلوقتي' : undefined,
      };
    });

    return [allOption, ...items];
  }, [centers, currentGov, doctors, clinics]);

  // Compute doctor count per specialty for current location filter
  const specialtyOptionsWithCounts = useMemo(() => {
    const currentCenterObj = centers.find((c) => c.id === selectedCenterId);

    return specialties.slice(0, 5).map((spec) => {
      const count = doctors.filter((doc) => {
        if (doc.status !== 'approved' || doc.specialtyId !== spec.id) return false;
        return clinics.some((c) => {
          if (!doc.clinicIds.includes(c.id)) return false;
          if (currentGov && c.governorate !== currentGov.nameAr) return false;
          if (currentCenterObj && c.city !== currentCenterObj.nameAr) return false;
          return true;
        });
      }).length;

      return {
        ...spec,
        doctorCount: count,
      };
    });
  }, [specialties, doctors, clinics, currentGov, centers, selectedCenterId]);

  // Handle governorate change
  const handleGovChange = (govId: string) => {
    const gov = locations.find((g) => g.id === govId);
    setSelectedGovId(govId);
    setSelectedCenterId(''); // reset center when governorate changes
    const nextFlow = {
      ...savedFlow,
      governorateId: govId,
      governorateName: gov?.nameAr,
      centerId: undefined,
      centerName: undefined,
    };
    setSavedFlowState(nextFlow);
    setPatientFlow(nextFlow);
  };

  // Handle center change
  const handleCenterChange = (centerId: string) => {
    setSelectedCenterId(centerId);
    const centerObj = centers.find((c) => c.id === centerId);
    const nextFlow = {
      ...savedFlow,
      governorateId: currentGov?.id,
      governorateName: currentGov?.nameAr,
      centerId: centerId || undefined,
      centerName: centerObj?.nameAr,
    };
    setSavedFlowState(nextFlow);
    setPatientFlow(nextFlow);
  };

  // Handle specialty select
  const handleSpecialtySelect = (specId: string, specName: string) => {
    const nextSpecId = selectedSpecId === specId ? '' : specId;
    setSelectedSpecId(nextSpecId);
    const nextFlow = {
      ...savedFlow,
      specialtyId: nextSpecId || undefined,
      specialtyName: nextSpecId ? specName : undefined,
    };
    setSavedFlowState(nextFlow);
    setPatientFlow(nextFlow);
  };

  // Filter doctors according to current selections
  const currentCenterObj = useMemo(
    () => centers.find((c) => c.id === selectedCenterId),
    [centers, selectedCenterId]
  );

  const matchedDoctorsWithClinics = useMemo(() => {
    return doctors
      .filter((d) => d.status === 'approved')
      .map((doctor) => {
        const matchingClinics = clinics.filter((c) => {
          if (!doctor.clinicIds.includes(c.id)) return false;
          if (currentGov && c.governorate !== currentGov.nameAr) return false;
          if (currentCenterObj && c.city !== currentCenterObj.nameAr) return false;
          return true;
        });

        const isSpecMatch = !selectedSpecId || doctor.specialtyId === selectedSpecId;
        const isMatch = isSpecMatch && matchingClinics.length > 0;

        return {
          doctor,
          clinic: matchingClinics[0],
          isMatch,
        };
      })
      .filter((item) => item.isMatch);
  }, [doctors, clinics, currentGov, currentCenterObj, selectedSpecId]);

  // Options for professional Specialty Combobox
  const specialtyComboboxOptions = useMemo(() => {
    const allOption = {
      id: '',
      label: 'كل التخصصات الطبية',
      badge: `${matchedDoctorsWithClinics.length} دكتور`,
      icon: <Stethoscope className="w-4 h-4 text-[var(--color-dark-teal)]" />,
    };

    const items = specialtyOptionsWithCounts.map((spec) => ({
      id: spec.id,
      label: spec.nameAr,
      badge: formatDoctorsCount(spec.doctorCount),
      subtext: spec.description,
      disabled: spec.doctorCount === 0,
      icon: SPECIALTY_ICONS[spec.id],
    }));

    return [allOption, ...items];
  }, [specialtyOptionsWithCounts, matchedDoctorsWithClinics.length]);

  const handleBookDoctor = (doctorId: string) => {
    const nextFlow = { ...savedFlow, doctorId };
    setPatientFlow(nextFlow);
    navigate(`/patient/book/${doctorId}`);
  };

  const handleResetFilters = () => {
    setSelectedCenterId('');
    setSelectedSpecId('');
    const nextFlow = {
      ...savedFlow,
      centerId: undefined,
      centerName: undefined,
      specialtyId: undefined,
      specialtyName: undefined,
    };
    setSavedFlowState(nextFlow);
    setPatientFlow(nextFlow);
  };

  return (
    <div className="max-w-[880px] mx-auto w-full space-y-4 sm:space-y-7 py-3 sm:py-8">
      {/* Top Banner: Quick Reopen Active Ticket */}
      <div className="flex items-center justify-between p-2.5 sm:p-4 rounded-[var(--radius-lg)] bg-[var(--color-dark-teal)] text-[var(--color-white)] shadow-sm">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-neon-orange)] shrink-0" />
          <div className="text-[12px] sm:text-[14px]">
            <span>حاجز كشف بالفعل؟ </span>
            <span className="text-[var(--color-white)]/80">تابع دورك ووقت وصولك مباشرة.</span>
          </div>
        </div>
        <Link
          to={session?.lastAppointmentId ? `/patient/track/${session.lastAppointmentId}` : '/patient/find'}
          className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-[var(--radius-sm)] bg-[#FF5533] hover:bg-[#E64525] active:bg-[#CC391B] text-white font-bold text-[12px] sm:text-[13px] whitespace-nowrap shadow-xs transition-colors"
        >
          {session?.lastAppointmentId ? 'تذكرتي الحالية ←' : 'تابع حجزك ←'}
        </Link>
      </div>

      {/* Hero Title */}
      <div className="text-center space-y-1.5 sm:space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] text-[11.5px] sm:text-[12.5px] font-bold">
          <Filter className="w-3.5 h-3.5 text-[var(--color-neon-orange)]" />
          <span>اختر المكان والتخصص واحجز في ثوانٍ</span>
        </div>
        <h1 className="text-[20px] sm:text-[32px] font-extrabold text-[var(--color-dark-teal)]">
          ابحث عن طبيبك واحجز دورك فورًا
        </h1>
        <p className="text-[12.5px] sm:text-[15px] text-[var(--color-secondary-text)] max-w-[560px] mx-auto leading-relaxed">
          حدد المحافظة والمركز والتخصص الطبي لتظهر لك قائمة الأطباء المتاحين بالأسعار ومواعيد العمل.
        </p>
      </div>

      {/* Cascading Filter Bar (3 Professional Dropdowns) */}
      <div className="p-3 sm:p-5 rounded-[var(--radius-lg)] bg-[var(--color-white)] border-2 border-[var(--color-border)] shadow-sm space-y-3 sm:space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4">
          {/* 1. Governorate Selector */}
          <SearchableCombobox
            label="1. المحافظة:"
            placeholder="اختر المحافظة..."
            value={selectedGovId}
            options={govOptions}
            onChange={handleGovChange}
            icon={<MapPin className="w-4 h-4 text-[var(--color-dark-teal)]" />}
          />

          {/* 2. Center Selector */}
          <SearchableCombobox
            label={`2. المركز / الحي في ${currentGov?.nameAr || 'المحافظة'}:`}
            placeholder={`كل المراكز في ${currentGov?.nameAr || 'المحافظة'}`}
            value={selectedCenterId}
            options={centerOptions}
            onChange={handleCenterChange}
            icon={<MapPin className="w-4 h-4 text-[var(--color-neon-orange)]" />}
          />

          {/* 3. Professional Specialty Dropdown */}
          <SearchableCombobox
            label="3. التخصص الطبي:"
            placeholder="كل التخصصات الطبية"
            value={selectedSpecId}
            options={specialtyComboboxOptions}
            onChange={(id) => {
              const spec = specialties.find((s) => s.id === id);
              handleSpecialtySelect(id, spec?.nameAr || '');
            }}
            icon={<Stethoscope className="w-4 h-4 text-[var(--color-neon-orange)]" />}
          />
        </div>

        {/* Quick specialty chips for 1-tap fast switching */}
        <div className="pt-2 border-t border-[var(--color-border)]/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-[var(--color-secondary-text)] shrink-0 hidden sm:inline">
            اختيار سريع:
          </span>
          <button
            type="button"
            onClick={() => handleSpecialtySelect('', '')}
            className={`px-2.5 py-1 rounded-full text-[11.5px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
              !selectedSpecId
                ? 'bg-[var(--color-dark-teal)] text-white shadow-2xs'
                : 'bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] hover:bg-[var(--color-border)]'
            }`}
          >
            الكل
          </button>
          {specialtyOptionsWithCounts.map((spec) => {
            const isSelected = selectedSpecId === spec.id;
            return (
              <button
                key={spec.id}
                type="button"
                onClick={() => handleSpecialtySelect(spec.id, spec.nameAr)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#FF5533] text-white shadow-2xs'
                    : 'bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] hover:bg-[var(--color-border)]'
                }`}
              >
                <span>{spec.nameAr}</span>
                <span className="text-[10px] opacity-80">({spec.doctorCount})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Available Doctors List Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h2 className="text-[18px] sm:text-[22px] font-extrabold text-[var(--color-dark-teal)]">
            الأطباء المتاحون ({matchedDoctorsWithClinics.length})
          </h2>
          <p className="text-[12px] sm:text-[13px] text-[var(--color-secondary-text)]">
            في {currentCenterObj?.nameAr || currentGov?.nameAr || 'المنطقة المحددة'}
            {selectedSpecId ? ` — تخصص ${specialties.find((s) => s.id === selectedSpecId)?.nameAr}` : ''}
          </p>
        </div>

        {(selectedCenterId || selectedSpecId) && (
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[11.5px] font-bold text-[var(--color-secondary-text)] hover:text-[var(--color-dark-teal)] hover:bg-[var(--color-muted)] cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>إعادة ضبط</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {matchedDoctorsWithClinics.length === 0 ? (
        <div className="text-center py-10 px-4 rounded-[var(--radius-lg)] bg-[var(--color-white)] border-2 border-dashed border-[var(--color-border)] space-y-3">
          <div className="w-12 h-12 rounded-full bg-[var(--color-muted)] text-[var(--color-secondary-text)] flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-[18px] font-bold text-[var(--color-primary-text)]">
              مفيش دكاترة هنا دلوقتي
            </h3>
            <p className="text-[13px] text-[var(--color-secondary-text)] max-w-[420px] mx-auto leading-relaxed">
              لم نعثر على أطباء يطابقون خياراتك في{' '}
              <strong>{currentCenterObj?.nameAr || currentGov?.nameAr}</strong>. يمكنك تغيير المركز أو تجربة تخصص آخر.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {selectedCenterId && (
              <button
                type="button"
                onClick={() => setSelectedCenterId('')}
                className="px-3.5 py-1.5 rounded-[var(--radius-md)] bg-[var(--color-dark-teal)] text-[var(--color-white)] font-bold text-[12.5px] hover:bg-[var(--color-teal-hover)] cursor-pointer"
              >
                عرض كل المراكز في {currentGov?.nameAr}
              </button>
            )}
            {selectedSpecId && (
              <button
                type="button"
                onClick={() => setSelectedSpecId('')}
                className="px-3.5 py-1.5 rounded-[var(--radius-md)] bg-[var(--color-white)] border border-[var(--color-border)] text-[var(--color-primary-text)] font-bold text-[12.5px] hover:bg-[var(--color-muted)] cursor-pointer"
              >
                عرض كل التخصصات
              </button>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3.5 py-1.5 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] font-bold text-[12.5px] hover:bg-[var(--color-muted)] cursor-pointer"
            >
              إلغاء جميع الفلاتر
            </button>
          </div>
        </div>
      ) : (
        /* Doctor Cards List (Scaled ~25% more compact on mobile) */
        <div className="space-y-3 sm:space-y-4">
          {matchedDoctorsWithClinics.map(({ doctor, clinic }) => {
            const workingDaysText = clinic?.workingDays?.join('، ') || 'السبت، الإثنين، الأربعاء';

            return (
              <div
                key={doctor.id}
                className="group p-3.5 sm:p-5 rounded-[var(--radius-lg)] bg-[var(--color-white)] border-2 border-[var(--color-border)] hover:border-[var(--color-dark-teal)] shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
              >
                {/* Doctor Bio & Clinic Details */}
                <div className="space-y-1.5 sm:space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] sm:text-[12px] font-bold px-2 py-0.5 rounded bg-[var(--color-teal)]/10 text-[var(--color-dark-teal)]">
                      {doctor.specialtyAr}
                    </span>
                    <span className="text-[11px] sm:text-[12px] text-[var(--color-secondary-text)]">
                      خبرة {doctor.yearsExperience} سنة
                    </span>
                    <span className="text-[11px] sm:text-[12px] text-amber-600 font-bold">
                      ★ {doctor.rating} ({doctor.reviewsCount})
                    </span>
                  </div>

                  <h3 className="text-[17px] sm:text-[21px] font-bold text-[var(--color-dark-teal)]">
                    {doctor.name}
                  </h3>

                  <p className="text-[12.5px] sm:text-[13.5px] text-[var(--color-primary-text)] line-clamp-2">
                    {doctor.titleAr}
                  </p>

                  <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-[11.5px] sm:text-[13px] text-[var(--color-secondary-text)] pt-0.5">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[var(--color-neon-orange)] shrink-0" />
                      <span>{clinic.name} — {clinic.address}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[var(--color-dark-teal)] shrink-0" />
                      <span>أيام العمل: {workingDaysText}</span>
                    </span>
                  </div>
                </div>

                {/* Price & Book Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2.5 sm:pt-0 border-[var(--color-border)] shrink-0 gap-2">
                  <div className="text-start sm:text-end">
                    <span className="text-[10px] sm:text-[11px] font-bold text-[var(--color-secondary-text)] block">
                      سعر الكشف
                    </span>
                    <span className="text-[18px] sm:text-[22px] font-extrabold text-[var(--color-dark-teal)] tabular-nums">
                      {formatCurrencyEGP(doctor.consultationFee)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBookDoctor(doctor.id)}
                    className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 rounded-[var(--radius-md)] bg-[#FF5533] hover:bg-[#E64525] active:bg-[#CC391B] text-white font-bold text-[13.5px] sm:text-[15px] shadow-sm cursor-pointer transition-colors"
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
