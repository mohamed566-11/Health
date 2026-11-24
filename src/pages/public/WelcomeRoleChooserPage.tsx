import React from 'react';
import { CalendarCheck, Stethoscope, UserCheck, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

export const WelcomeRoleChooserPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsRole } = useApp();

  const handlePatientSelect = () => {
    navigate('/patient');
  };

  const handleNurseSelect = () => {
    loginAsRole('nurse');
    navigate('/nurse');
  };

  const handleDoctorSelect = () => {
    loginAsRole('doctor');
    navigate('/doctor');
  };

  return (
    <div className="flex-1 flex flex-col justify-between max-w-[960px] mx-auto w-full px-3 sm:px-6 py-4 sm:py-12">
      {/* Brand Header */}
      <div className="text-center space-y-2 sm:space-y-3 mb-4 sm:mb-10">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[var(--color-teal)]/10 text-[var(--color-dark-teal)] text-[11.5px] sm:text-[13px] font-bold">
          <CalendarCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-neon-orange)]" />
          <span>منظومة حجز العيادات وإدارة الطوابير الذكية</span>
        </div>
        <h1 className="text-[22px] sm:text-[38px] font-extrabold text-[var(--color-dark-teal)]">
          موعدي <span className="text-[var(--color-neon-orange)]">(Maw3edy)</span>
        </h1>
        <p className="text-[13px] sm:text-[17px] text-[var(--color-secondary-text)] max-w-[560px] mx-auto leading-relaxed">
          اختر صفتك للدخول مباشرة. للمرضى: احجز كشفك في ثوانٍ بدون أي تسجيل مسبق وتابع دورك لحظة بلحظة.
        </p>
      </div>

      {/* 3 Large Role Cards (Scaled ~25% more compact on mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 my-auto">
        {/* Card 1: Patient (Primary Hero) */}
        <button
          type="button"
          onClick={handlePatientSelect}
          className="group relative flex flex-col items-center text-center p-4 sm:p-8 rounded-[var(--radius-lg)] bg-[var(--color-white)] border-2 border-[var(--color-neon-orange)] shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] hover:border-[var(--color-neon-orange)] transition-all cursor-pointer transform hover:-translate-y-1 active:translate-y-0"
        >
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[var(--color-neon-orange)]/10 text-[var(--color-neon-orange)] flex items-center justify-center mb-3 sm:mb-5 group-hover:scale-110 transition-transform">
            <Users className="w-7 h-7 sm:w-10 sm:h-10" />
          </div>
          <span className="text-[11.5px] sm:text-[13px] font-bold text-[var(--color-neon-orange)] uppercase tracking-wider mb-0.5 sm:mb-1">
            دخول فوري بدون تسجيل
          </span>
          <h2 className="text-[18px] sm:text-[26px] font-bold text-[var(--color-dark-teal)] mb-1.5 sm:mb-2">
            أنا مريض
          </h2>
          <p className="text-[12.5px] sm:text-[14px] text-[var(--color-secondary-text)] mb-4 sm:mb-6 leading-relaxed">
            احجز عند أفضل الأطباء، واستلم رقم دورك فورًا وتتبع الطابور مباشرة من موبايلك.
          </p>
          <span className="mt-auto w-full py-2.5 px-3 sm:py-3 sm:px-4 rounded-[var(--radius-md)] bg-[#FF5533] text-white font-bold text-[14px] sm:text-[16px] group-hover:bg-[#E64525] active:bg-[#CC391B] transition-colors shadow-sm">
            احجز كشفك الآن ←
          </span>
        </button>

        {/* Card 2: Doctor */}
        <button
          type="button"
          onClick={handleDoctorSelect}
          className="group relative flex flex-col items-center text-center p-4 sm:p-8 rounded-[var(--radius-lg)] bg-[var(--color-white)] border-2 border-[var(--color-border)] hover:border-[var(--color-dark-teal)] hover:bg-[var(--color-light-teal)] shadow-sm hover:shadow-[var(--shadow-md)] transition-all cursor-pointer transform hover:-translate-y-1 active:translate-y-0"
        >
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] flex items-center justify-center mb-3 sm:mb-5 group-hover:scale-110 transition-transform">
            <Stethoscope className="w-7 h-7 sm:w-10 sm:h-10" />
          </div>
          <span className="text-[11.5px] sm:text-[13px] font-bold text-[var(--color-secondary-text)] group-hover:text-[var(--color-dark-teal)] mb-0.5 sm:mb-1">
            منظومة العيادة
          </span>
          <h2 className="text-[18px] sm:text-[26px] font-bold text-[var(--color-dark-teal)] mb-1.5 sm:mb-2">
            أنا دكتور
          </h2>
          <p className="text-[12.5px] sm:text-[14px] text-[var(--color-secondary-text)] mb-4 sm:mb-6 leading-relaxed">
            إدارة الكشوفات، استدعاء المرضى، كتابة الروشتات الإلكترونية، ومراجعة سجل الحالات.
          </p>
          <span className="mt-auto w-full py-2.5 px-3 sm:py-3 sm:px-4 rounded-[var(--radius-md)] bg-[#0B434C] text-white font-bold text-[14px] sm:text-[16px] group-hover:bg-[#06252A] active:bg-[#08333A] transition-colors">
            دخول الطبيب ←
          </span>
        </button>

        {/* Card 3: Nurse */}
        <button
          type="button"
          onClick={handleNurseSelect}
          className="group relative flex flex-col items-center text-center p-4 sm:p-8 rounded-[var(--radius-lg)] bg-[var(--color-white)] border-2 border-[var(--color-border)] hover:border-[var(--color-dark-teal)] hover:bg-[var(--color-light-teal)] shadow-sm hover:shadow-[var(--shadow-md)] transition-all cursor-pointer transform hover:-translate-y-1 active:translate-y-0"
        >
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[var(--color-teal-subtle)] text-[var(--color-dark-teal)] flex items-center justify-center mb-3 sm:mb-5 group-hover:scale-110 transition-transform">
            <UserCheck className="w-7 h-7 sm:w-10 sm:h-10" />
          </div>
          <span className="text-[11.5px] sm:text-[13px] font-bold text-[var(--color-secondary-text)] group-hover:text-[var(--color-dark-teal)] mb-0.5 sm:mb-1">
            الاستقبال والتحكم
          </span>
          <h2 className="text-[18px] sm:text-[26px] font-bold text-[var(--color-dark-teal)] mb-1.5 sm:mb-2">
            أنا ممرض / استقبال
          </h2>
          <p className="text-[12.5px] sm:text-[14px] text-[var(--color-secondary-text)] mb-4 sm:mb-6 leading-relaxed">
            تسجيل وصول الحالات، استدعاء التالي، تحصيل الرسوم والغرامات، وتنظيم حركة العيادة.
          </p>
          <span className="mt-auto w-full py-2.5 px-3 sm:py-3 sm:px-4 rounded-[var(--radius-md)] bg-[#165B66] text-white font-bold text-[14px] sm:text-[16px] group-hover:bg-[#0B434C] active:bg-[#08333A] transition-colors">
            دخول التمريض ←
          </span>
        </button>
      </div>
    </div>
  );
};
