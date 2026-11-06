import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  Award,
  Bell,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  KeyRound,
  Lock,
  MessageSquareCode,
  Pill,
  PlayCircle,
  Search,
  Shield,
  Smartphone,
  Stethoscope,
  User,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { UserRole } from '../../types';
import { Button, Card, InlineAlert, Stepper } from '../../components/common/UIPrimitives';
import {
  LocationCascadeSelect,
  PhoneInput,
  SelectField,
  TextInput,
} from '../../components/forms/FormControls';
import {
  PatientExplainerVideoModal,
  PatientExplainerVideoPlayer,
} from '../../components/patient/PatientExplainerVideo';
import { formatNumber } from '../../utils/formatters';
import { validateEgyptianPhone, validateFullName, validateRequired } from '../../utils/validation';
import { getDefaultHomeRouteForRole } from '../../services/permissions';

const SIMULATED_OTP_CODE = '4829';

export const WelcomeLoginPage: React.FC = () => {
  const { loginAsRole, session, patients, doctors, showToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const autostartHandledRef = useRef(false);

  // Main login mode: 'real' (interactive patient/doctor auth flow) vs 'demo' (1-click role cards)
  const [authTab, setAuthTab] = useState<'real' | 'demo'>('real');
  const [actorRole, setActorRole] = useState<'patient' | 'doctor'>('patient');
  const [authMethod, setAuthMethod] = useState<'otp' | 'password'>('otp');

  // Patient login states
  const [patientPhone, setPatientPhone] = useState('01012345678');
  const [patientPassword, setPatientPassword] = useState('12345678');
  const [otpStep, setOtpStep] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);
  const [authError, setAuthError] = useState<string | null>(null);

  // Doctor login states
  const [selectedDoctorId, setSelectedDoctorId] = useState('doc-1');
  const [doctorPhone, setDoctorPhone] = useState('01001112233');
  const [syndicateNumber, setSyndicateNumber] = useState('EG-MED-49821');
  const [doctorPassword, setDoctorPassword] = useState('doctor123');
  const [doctorOtpStep, setDoctorOtpStep] = useState(false);
  const [doctorOtpDigits, setDoctorOtpDigits] = useState<string[]>(['', '', '', '']);

  // Video modal state on login page
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const routeState = location.state as {
    forbiddenRole?: UserRole;
    currentRole?: UserRole;
    attemptedPath?: string;
  } | null;

  useEffect(() => {
    document.title = 'موعدي (Maw3edy) — تسجيل الدخول للمريض والطبيب';
    if (searchParams.get('autostart') === '1' && !session && !autostartHandledRef.current) {
      autostartHandledRef.current = true;
      loginAsRole('patient');
      navigate('/patient', { replace: true });
    }
  }, [loginAsRole, navigate, searchParams, session]);

  const roleCards: {
    role: UserRole;
    title: string;
    name: string;
    subtitle: string;
    buttonLabel: string;
    icon: React.ReactNode;
  }[] = [
    {
      role: 'patient',
      title: 'حساب المريض',
      name: 'أحمد محمد',
      subtitle: 'الهاتف: 01012345678 — حجز ومتابعة الدور والسجل الطبي',
      buttonLabel: 'دخول كمريض',
      icon: <User className="w-6 h-6" strokeWidth={1.75} />,
    },
    {
      role: 'doctor',
      title: 'حساب الطبيب',
      name: 'د. أحمد محمود',
      subtitle: 'قلب وأوعية دموية (Cardiology) — العيادات والروشتات والملاحظات السرية',
      buttonLabel: 'دخول كطبيب',
      icon: <Stethoscope className="w-6 h-6" strokeWidth={1.75} />,
    },
    {
      role: 'nurse',
      title: 'حساب الممرضة / الاستقبال',
      name: 'منى إبراهيم',
      subtitle: 'عيادة دار القلب — إدارة طابور اليوم واستدعاء المرضى',
      buttonLabel: 'دخول كممرضة',
      icon: <Users className="w-6 h-6" strokeWidth={1.75} />,
    },
    {
      role: 'admin',
      title: 'حساب مدير النظام',
      name: 'Platform Administrator',
      subtitle: 'إدارة الأطباء، العيادات، التخصصات، المحافظات، والتقييمات',
      buttonLabel: 'دخول كمدير النظام',
      icon: <Shield className="w-6 h-6" strokeWidth={1.75} />,
    },
  ];

  const handleOneClickLogin = (role: UserRole) => {
    loginAsRole(role);
    navigate(getDefaultHomeRouteForRole(role));
  };

  // Patient Login Handlers
  const handleStartPatientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const phoneCheck = validateEgyptianPhone(patientPhone);
    if (!phoneCheck.valid) {
      setAuthError(phoneCheck.error ?? 'رقم الموبايل غير صحيح');
      return;
    }

    if (authMethod === 'password') {
      if (patientPassword.trim().length < 4) {
        setAuthError('يرجى إدخال كلمة مرور صحيحة (4 أحرف أو أرقام على الأقل).');
        return;
      }
      completePatientLogin();
    } else {
      setOtpStep(true);
      setOtpDigits(['4', '8', '2', '9']);
      showToast('تم إرسال رمز التحقق (4829) في رسالة SMS محاكاة إلى موبايلك', 'info');
    }
  };

  const completePatientLogin = () => {
    const matchedPatient =
      patients.find((p) => p.phone === patientPhone.trim()) ?? patients[0];
    loginAsRole('patient', {
      id: matchedPatient.id,
      name: matchedPatient.name,
      phone: patientPhone.trim(),
    });
    navigate('/patient');
  };

  const handleVerifyPatientOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpDigits.join('');
    if (entered.length < 4) {
      setAuthError('يرجى إدخال رمز التحقق المكون من 4 أرقام (مثال: 4829).');
      return;
    }
    completePatientLogin();
  };

  // Doctor Login Handlers
  const handleDoctorSelectionChange = (docId: string) => {
    setSelectedDoctorId(docId);
    const found = doctors.find((d) => d.id === docId);
    if (found) {
      setDoctorPhone(found.phone);
    }
  };

  const handleStartDoctorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const phoneCheck = validateEgyptianPhone(doctorPhone);
    if (!phoneCheck.valid) {
      setAuthError(phoneCheck.error ?? 'يرجى إدخال رقم موبايل الطبيب بشكل صحيح.');
      return;
    }
    if (!syndicateNumber.trim()) {
      setAuthError('يرجى إدخال رقم قيد نقابة الأطباء أو الكود المهني.');
      return;
    }
    if (authMethod === 'password') {
      if (doctorPassword.trim().length < 4) {
        setAuthError('يرجى إدخال كلمة المرور المهنية.');
        return;
      }
      completeDoctorLogin();
    } else {
      setDoctorOtpStep(true);
      setDoctorOtpDigits(['4', '8', '2', '9']);
      showToast('تم إرسال كود تحقق الطبيب (4829) لتأكيد الجلسة الطبية', 'info');
    }
  };

  const completeDoctorLogin = () => {
    const matchedDoc =
      doctors.find((d) => d.id === selectedDoctorId) ??
      doctors.find((d) => d.phone === doctorPhone.trim()) ??
      doctors[0];
    loginAsRole('doctor', {
      id: matchedDoc.id,
      name: matchedDoc.name,
      phone: matchedDoc.phone,
      specialty: matchedDoc.specialtyAr,
    });
    navigate('/doctor');
  };

  const handleVerifyDoctorOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (doctorOtpDigits.join('').length < 4) {
      setAuthError('يرجى إدخال رمز التحقق المكون من 4 أرقام (4829).');
      return;
    }
    completeDoctorLogin();
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-[calc(100dvh-96px)]">
      {/* Start Panel (White — Real Login Flow & Demo Role Cards) */}
      <section className="w-full lg:w-[56%] bg-[var(--color-white)] px-4 sm:px-8 lg:px-12 py-8 sm:py-10 flex flex-col justify-center">
        <div className="max-w-[640px] mx-auto w-full">
          <div className="mb-5">
            <span className="inline-block text-[14px] font-bold text-[var(--color-dark-teal)] mb-1">
              منصة موعدي للرعاية الصحية الذكية — مصر
            </span>
            <h1 className="text-[26px] sm:text-[32px] font-bold text-[var(--color-primary-text)] leading-tight mb-1.5">
              بوابة تسجيل الدخول وإنشاء الحسابات
            </h1>
            <p className="text-[15px] text-[var(--color-secondary-text)]">
              جرب خطوات تسجيل الدخول الواقعية للمريض أو الطبيب (برقم الموبايل وكود التحقق OTP بدون باك إند)، أو استخدم الدخول السريع بضغطة واحدة.
            </p>
          </div>

          {routeState?.forbiddenRole && (
            <div className="mb-5">
              <InlineAlert variant="error" title="غير مصرح بالوصول إلى هذه الصفحة">
                حاولت فتح المسار <bdi dir="ltr">{routeState.attemptedPath}</bdi> المخصص لدور آخر.
                يرجى اختيار الحساب المناسب للمتابعة.
              </InlineAlert>
            </div>
          )}

          {session && (
            <div className="mb-5">
              <InlineAlert variant="info" title={`أنت مسجل الدخول حاليًا باسم: ${session.name}`}>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(getDefaultHomeRouteForRole(session.role))}
                  >
                    الانتقال إلى لوحة التحكم الحالية
                  </Button>
                </div>
              </InlineAlert>
            </div>
          )}

          {/* Top Mode Switcher: Real Flow vs One-Click Demo */}
          <div
            role="tablist"
            aria-label="طريقة تسجيل الدخول"
            className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1.5 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] border border-[var(--color-border)] mb-6"
          >
            <button
              type="button"
              role="tab"
              aria-selected={authTab === 'real'}
              onClick={() => {
                setAuthTab('real');
                setAuthError(null);
              }}
              className={`py-2.5 px-4 rounded-[var(--radius-sm)] text-[14px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                authTab === 'real'
                  ? 'bg-[var(--color-dark-teal)] text-[var(--color-white)] shadow-[var(--shadow-sm)]'
                  : 'text-[var(--color-dark-teal)] hover:bg-[var(--color-white)]/60'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>تسجيل الدخول الفعلي (مريض / طبيب)</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={authTab === 'demo'}
              onClick={() => {
                setAuthTab('demo');
                setAuthError(null);
              }}
              className={`py-2.5 px-4 rounded-[var(--radius-sm)] text-[14px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                authTab === 'demo'
                  ? 'bg-[var(--color-dark-teal)] text-[var(--color-white)] shadow-[var(--shadow-sm)]'
                  : 'text-[var(--color-dark-teal)] hover:bg-[var(--color-white)]/60'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>دخول تجريبي سريع (٤ أدوار بضغطة)</span>
            </button>
          </div>

          {authTab === 'real' ? (
            <Card padding="lg" className="mb-6 border-[var(--color-dark-teal)]/30">
              {/* Actor Switcher: Patient vs Doctor */}
              <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActorRole('patient');
                      setOtpStep(false);
                      setAuthError(null);
                    }}
                    className={`px-4 py-2 rounded-[var(--radius-sm)] text-[14px] font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                      actorRole === 'patient'
                        ? 'bg-[var(--color-neon-orange)] text-[var(--color-white)]'
                        : 'bg-[var(--color-muted)] text-[var(--color-primary-text)] hover:bg-[var(--color-light-teal)]'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>دخول المريض</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActorRole('doctor');
                      setDoctorOtpStep(false);
                      setAuthError(null);
                    }}
                    className={`px-4 py-2 rounded-[var(--radius-sm)] text-[14px] font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                      actorRole === 'doctor'
                        ? 'bg-[var(--color-dark-teal)] text-[var(--color-white)]'
                        : 'bg-[var(--color-muted)] text-[var(--color-primary-text)] hover:bg-[var(--color-light-teal)]'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>دخول الطبيب</span>
                  </button>
                </div>

                {/* Method Toggle: OTP vs Password */}
                <div className="flex items-center gap-1.5 text-[12px]">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('otp');
                      setOtpStep(false);
                      setDoctorOtpStep(false);
                    }}
                    className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                      authMethod === 'otp'
                        ? 'bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] font-bold'
                        : 'text-[var(--color-secondary-text)]'
                    }`}
                  >
                    برمز التحقق SMS
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMethod('password');
                      setOtpStep(false);
                      setDoctorOtpStep(false);
                    }}
                    className={`px-2.5 py-1 rounded font-semibold cursor-pointer ${
                      authMethod === 'password'
                        ? 'bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] font-bold'
                        : 'text-[var(--color-secondary-text)]'
                    }`}
                  >
                    بكلمة المرور
                  </button>
                </div>
              </div>

              {/* Mobile-only Explainer Video Banner (< 1024px only, zero desktop diff) */}
              <div className="lg:hidden mb-4 p-3 rounded-[var(--radius-md)] bg-[var(--color-dark-teal)] text-[var(--color-white)] flex items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[var(--color-neon-orange)] text-[var(--color-white)] flex items-center justify-center shrink-0">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold truncate">شاهد الفيديو التوضيحي للمريض</div>
                    <div className="text-[11px] text-[var(--color-white)]/80 truncate">شرح صوتي مصري تفاعلي (دقيقة واحدة)</div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => setVideoModalOpen(true)}
                  className="shrink-0 text-[13px] px-3 py-1.5 min-h-[38px]"
                >
                  تشغيل
                </Button>
              </div>

              {authError && (
                <div className="mb-4">
                  <InlineAlert variant="error" title="يرجى مراجعة البيانات المدخلة">
                    {authError}
                  </InlineAlert>
                </div>
              )}

              {/* PATIENT REAL LOGIN FLOW */}
              {actorRole === 'patient' && (
                <>
                  {!otpStep ? (
                    <form onSubmit={handleStartPatientLogin} className="space-y-4" noValidate>
                      <div>
                        <PhoneInput
                          label="رقم الموبايل المصري للمريض"
                          required
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          helperText="أدخل أي رقم مصري يبدأ بـ 010 أو 011 أو 012 أو 015 أو اختر حسابًا مسجلاً بالأسفل"
                        />
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <span className="text-[12px] text-[var(--color-secondary-text)]">
                            حسابات مرضى جاهزة للتجربة:
                          </span>
                          {patients.slice(0, 3).map((pat) => (
                            <button
                              key={pat.id}
                              type="button"
                              onClick={() => setPatientPhone(pat.phone)}
                              className={`px-2.5 py-1 rounded text-[12px] font-semibold border transition-colors cursor-pointer ${
                                patientPhone === pat.phone
                                  ? 'bg-[var(--color-light-teal)] border-[var(--color-dark-teal)] text-[var(--color-dark-teal)] font-bold'
                                  : 'bg-[var(--color-background)] border-[var(--color-border)] text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)]'
                              }`}
                            >
                              {pat.name} (<bdi dir="ltr">{pat.phone}</bdi>)
                            </button>
                          ))}
                        </div>
                      </div>

                      {authMethod === 'password' && (
                        <TextInput
                          label="كلمة المرور"
                          type="password"
                          required
                          value={patientPassword}
                          onChange={(e) => setPatientPassword(e.target.value)}
                          helperText="في النسخة التجريبية يمكنك استخدام كلمة المرور الافتراضية: 12345678"
                        />
                      )}

                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          fullWidth
                          icon={
                            authMethod === 'otp' ? (
                              <MessageSquareCode className="w-5 h-5" />
                            ) : (
                              <KeyRound className="w-5 h-5" />
                            )
                          }
                        >
                          {authMethod === 'otp'
                            ? 'إرسال رمز التحقق (SMS OTP) للمتابعة'
                            : 'تسجيل الدخول إلى حساب المريض'}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyPatientOtp} className="space-y-4">
                      <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] border border-[var(--color-dark-teal)]/25 flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[13px] text-[var(--color-dark-teal)]">
                          <strong>رسالة SMS محاكاة إلى {patientPhone}:</strong> كود الدخول لمنصة
                          موعدي هو{' '}
                          <span className="px-2 py-0.5 rounded bg-[var(--color-dark-teal)] text-[var(--color-white)] font-bold tabular-nums">
                            {SIMULATED_OTP_CODE}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setOtpDigits(['4', '8', '2', '9'])}
                          className="text-[12px] font-bold text-[var(--color-neon-orange)] hover:underline cursor-pointer"
                        >
                          ملء الكود تلقائيًا
                        </button>
                      </div>

                      <div>
                        <label className="block text-[14px] font-semibold text-[var(--color-primary-text)] mb-2">
                          أدخل رمز التحقق المكون من 4 أرقام:
                        </label>
                        <div dir="ltr" className="flex items-center justify-center gap-2 sm:gap-3">
                          {otpDigits.map((digit, index) => (
                            <input
                              key={index}
                              type="text"
                              inputMode="numeric"
                              autoComplete="one-time-code"
                              maxLength={1}
                              aria-label={`الرقم ${index + 1} من رمز التحقق`}
                              value={digit}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(-1);
                                const next = [...otpDigits];
                                next[index] = val;
                                setOtpDigits(next);
                              }}
                              className="w-12 h-12 sm:w-14 sm:h-14 text-center text-[20px] sm:text-[22px] font-bold tabular-nums rounded-[var(--radius-md)] border-2 border-[var(--color-dark-teal)] bg-[var(--color-white)] text-[var(--color-primary-text)] min-h-[48px]"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                        <Button type="submit" variant="primary" size="lg" fullWidth>
                          تأكيد الكود والدخول إلى بوابة المريض
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="md"
                          onClick={() => setOtpStep(false)}
                        >
                          تعديل الرقم
                        </Button>
                      </div>
                    </form>
                  )}
                </>
              )}

              {/* DOCTOR REAL LOGIN FLOW */}
              {actorRole === 'doctor' && (
                <>
                  {!doctorOtpStep ? (
                    <form onSubmit={handleStartDoctorLogin} className="space-y-4" noValidate>
                      <SelectField
                        label="اختر حساب الطبيب (٢٤ طبيبًا مسجلاً في المنصة)"
                        value={selectedDoctorId}
                        onChange={(e) => handleDoctorSelectionChange(e.target.value)}
                        options={doctors.map((d) => ({
                          value: d.id,
                          label: `${d.name} — ${d.specialtyAr}`,
                        }))}
                        helperText="يمكنك البحث باسم الطبيب أو التخصص داخل القائمة لتجربة حساب أي طبيب"
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <PhoneInput
                          label="رقم الموبايل المسجل للطبيب"
                          required
                          value={doctorPhone}
                          onChange={(e) => setDoctorPhone(e.target.value)}
                        />
                        <TextInput
                          label="رقم قيد نقابة الأطباء"
                          required
                          dir="ltr"
                          value={syndicateNumber}
                          onChange={(e) => setSyndicateNumber(e.target.value)}
                          placeholder="EG-MED-49821"
                        />
                      </div>

                      {authMethod === 'password' && (
                        <TextInput
                          label="كلمة المرور المهنية"
                          type="password"
                          required
                          value={doctorPassword}
                          onChange={(e) => setDoctorPassword(e.target.value)}
                        />
                      )}

                      <div className="pt-2">
                        <Button
                          type="submit"
                          variant="secondary"
                          size="lg"
                          fullWidth
                          icon={<Stethoscope className="w-5 h-5" />}
                        >
                          {authMethod === 'otp'
                            ? 'إرسال كود التحقق المهني للطبيب (OTP)'
                            : 'الدخول إلى بوابة الطبيب'}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyDoctorOtp} className="space-y-4">
                      <div className="p-3.5 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] border border-[var(--color-dark-teal)]/25 flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[13px] text-[var(--color-dark-teal)]">
                          <strong>تحقق الأمان للطبيب ({doctorPhone}):</strong> رمز تفعيل الجلسة
                          الطبية هو{' '}
                          <span className="px-2 py-0.5 rounded bg-[var(--color-dark-teal)] text-[var(--color-white)] font-bold tabular-nums">
                            {SIMULATED_OTP_CODE}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDoctorOtpDigits(['4', '8', '2', '9'])}
                          className="text-[12px] font-bold text-[var(--color-neon-orange)] hover:underline cursor-pointer"
                        >
                          ملء الكود تلقائيًا
                        </button>
                      </div>

                      <div>
                        <label className="block text-[14px] font-semibold text-[var(--color-primary-text)] mb-2">
                          أدخل رمز التحقق المهني المكون من 4 أرقام:
                        </label>
                        <div dir="ltr" className="flex items-center justify-center gap-2 sm:gap-3">
                          {doctorOtpDigits.map((digit, index) => (
                            <input
                              key={index}
                              type="text"
                              inputMode="numeric"
                              autoComplete="one-time-code"
                              maxLength={1}
                              aria-label={`الرقم ${index + 1} من كود الطبيب`}
                              value={digit}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(-1);
                                const next = [...doctorOtpDigits];
                                next[index] = val;
                                setDoctorOtpDigits(next);
                              }}
                              className="w-12 h-12 sm:w-14 sm:h-14 text-center text-[20px] sm:text-[22px] font-bold tabular-nums rounded-[var(--radius-md)] border-2 border-[var(--color-dark-teal)] bg-[var(--color-white)] text-[var(--color-primary-text)] min-h-[48px]"
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                        <Button type="submit" variant="secondary" size="lg" fullWidth>
                          تأكيد الكود وفتح لوحة تحكم الطبيب
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="md"
                          onClick={() => setDoctorOtpStep(false)}
                        >
                          رجوع
                        </Button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </Card>
          ) : (
            /* Four Demo Login Role Cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {roleCards.map((item) => (
                <Card
                  key={item.role}
                  padding="md"
                  className="flex flex-col justify-between border-[var(--color-border)] hover:border-[var(--color-dark-teal)] transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-[var(--color-secondary-text)]">
                          {item.title}
                        </div>
                        <h2 className="text-[18px] font-bold text-[var(--color-primary-text)]">
                          {item.name}
                        </h2>
                      </div>
                    </div>
                    <p className="text-[13px] text-[var(--color-secondary-text)] mb-4">
                      {item.subtitle}
                    </p>
                  </div>

                  <Button
                    variant={item.role === 'patient' ? 'primary' : 'secondary'}
                    size="md"
                    fullWidth
                    onClick={() => handleOneClickLogin(item.role)}
                  >
                    {item.buttonLabel}
                  </Button>
                </Card>
              ))}
            </div>
          )}

          {/* Registration Links for both Patient and Doctor */}
          <div className="pt-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="text-[14px] font-semibold text-[var(--color-primary-text)]">
              ليس لديك حساب؟ جرب رحلة التسجيل الكاملة:
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                icon={<UserPlus className="w-4 h-4" />}
                onClick={() => navigate('/register?role=patient')}
              >
                تسجيل مريض جديد
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={<Stethoscope className="w-4 h-4" />}
                onClick={() => navigate('/register?role=doctor')}
              >
                تسجيل طبيب جديد
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* End Panel (Dark Teal #0B434C — Brand, Value Proposition & Explainer Video Preview) */}
      <aside className="hidden lg:flex w-full lg:w-[44%] bg-[var(--color-dark-teal)] text-[var(--color-white)] px-6 sm:px-10 lg:px-12 py-10 lg:py-12 flex-col justify-between">
        <div className="max-w-[480px] mx-auto w-full my-auto">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <span className="w-4 h-4 rounded-full bg-[var(--color-neon-orange)]" />
            <span className="text-[26px] font-bold tracking-tight">موعدي — Maw3edy</span>
          </div>

          <h2 className="text-[28px] sm:text-[32px] leading-[1.35] text-[var(--color-white)] font-bold mb-3">
            عيادتك وموعدك وسجلّك الطبي في مكان واحد هادئ ومنظم.
          </h2>
          <p className="text-[15px] text-[var(--color-white)]/85 mb-6">
            يضم الآن ٢٤ طبيبًا استشاريًا وأخصائيًا في ١٠ تخصصات طبية في ٨ محافظات مصرية، مع نظام متابعة الطابور الحي والروشتات الإلكترونية.
          </p>

          {/* Interactive Video Teaser Card */}
          <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-teal-mid)] border border-[var(--color-white)]/20 mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-[var(--color-neon-orange)] text-[var(--color-white)] flex items-center justify-center shrink-0">
                <PlayCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-[var(--color-white)]">
                  فيديو توضيحي للمريض (دقيقة واحدة)
                </h3>
                <p className="text-[12px] text-[var(--color-white)]/80">
                  شاهد كيف تحجز موعدك وتتابع الطابور الحي وتستلم روشتتك.
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setVideoModalOpen(true)}
            >
              شاهد الفيديو
            </Button>
          </div>

          <ul className="space-y-4">
            <li className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-teal-mid)] text-[var(--color-white)] flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-[var(--color-neon-orange)]" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-[var(--color-white)] mb-0.5">
                  احجز بسهولة في دقائق
                </h3>
                <p className="text-[13px] text-[var(--color-white)]/80">
                  ابحث بالتخصص أو المحافظة واختر الموعد المناسب واحصل على رقم حجزك فورًا.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-teal-mid)] text-[var(--color-white)] flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5 text-[var(--color-neon-orange)]" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-[var(--color-white)] mb-0.5">
                  تابع دورك لحظة بلحظة
                </h3>
                <p className="text-[13px] text-[var(--color-white)]/80">
                  تعرف على عدد المرضى قبلك والوقت التقريبي المتبقي قبل النزول من منزلك.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-teal-mid)] text-[var(--color-white)] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-[var(--color-neon-orange)]" />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-[var(--color-white)] mb-0.5">
                  سجلّك الطبي وروشتاتك بأمان
                </h3>
                <p className="text-[13px] text-[var(--color-white)]/80">
                  احتفظ بتاريخ الزيارات، التحاليل، والروشتات الإلكترونية الجاهزة للطباعة.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </aside>

      <PatientExplainerVideoModal
        open={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
      />
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const { locations, specialties, registerPatient, registerDoctor, showToast } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'doctor' ? 'doctor' : 'patient';

  const [roleType, setRoleType] = useState<'patient' | 'doctor'>(initialRole);
  const [step, setStep] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Patient Registration Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['4', '8', '2', '9']);
  const [birthDate, setBirthDate] = useState('1992-05-15');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [governorate, setGovernorate] = useState('القاهرة');
  const [city, setCity] = useState('مدينة نصر');
  const [allergiesText, setAllergiesText] = useState('');
  const [chronicText, setChronicText] = useState('');

  // Doctor Registration Fields
  const [docName, setDocName] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [docSpecialty, setDocSpecialty] = useState(specialties[0]?.nameAr ?? 'قلب وأوعية دموية');
  const [docTitle, setDocTitle] = useState('استشاري وأخصائي أول');
  const [docSyndicateId, setDocSyndicateId] = useState('EG-MED-74210');
  const [docYearsExp, setDocYearsExp] = useState('12');
  const [clinicName, setClinicName] = useState('');
  const [clinicGov, setClinicGov] = useState('القاهرة');
  const [clinicCity, setClinicCity] = useState('مدينة نصر');
  const [clinicAddress, setClinicAddress] = useState('');
  const [clinicLandmark, setClinicLandmark] = useState('');
  const [consultationFee, setConsultationFee] = useState('350');
  const [followUpPrice, setFollowUpPrice] = useState('150');

  useEffect(() => {
    document.title =
      roleType === 'doctor'
        ? 'انضمام طبيب جديد — منصة موعدي'
        : 'إنشاء حساب مريض جديد — منصة موعدي';
  }, [roleType]);

  // Patient 3-step handlers
  const handlePatientStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    const nameCheck = validateFullName(name);
    if (!nameCheck.valid) nextErrors.name = nameCheck.error!;

    const phoneCheck = validateEgyptianPhone(phone);
    if (!phoneCheck.valid) nextErrors.phone = phoneCheck.error!;

    if (password.trim().length < 4) {
      nextErrors.password = 'يرجى إدخال كلمة مرور لا تقل عن 4 أحرف أو أرقام.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setOtpDigits(['4', '8', '2', '9']);
    showToast(`تم إرسال كود تفعيل الحساب (${SIMULATED_OTP_CODE}) إلى الرقم ${phone}`, 'info');
    setStep(2);
  };

  const handlePatientStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpDigits.join('').length < 4) {
      setErrors({ otp: 'يرجى إدخال رمز التفعيل المكون من 4 أرقام.' });
      return;
    }
    setErrors({});
    setStep(3);
  };

  const handlePatientComplete = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    const govCheck = validateRequired(governorate, 'المحافظة');
    if (!govCheck.valid) nextErrors.governorate = govCheck.error!;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const allergies = allergiesText
      .split('،')
      .map((s) => s.trim())
      .filter(Boolean);
    const chronicConditions = chronicText
      .split('،')
      .map((s) => s.trim())
      .filter(Boolean);

    registerPatient({
      name,
      phone,
      birthDate,
      gender,
      governorate,
      city: city || 'مدينة نصر',
      allergies,
      chronicConditions,
    });
    showToast('تم إنشاء حسابك وتفعيله بنجاح! شاهد الفيديو التوضيحي ودليل المريض الآن', 'success');
    navigate('/onboarding');
  };

  // Doctor 3-step handlers
  const handleDoctorStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    const nameCheck = validateFullName(docName);
    if (!nameCheck.valid) nextErrors.docName = nameCheck.error!;

    const phoneCheck = validateEgyptianPhone(docPhone);
    if (!phoneCheck.valid) nextErrors.docPhone = phoneCheck.error!;

    if (!docSyndicateId.trim()) {
      nextErrors.docSyndicateId = 'يرجى إدخال رقم قيد نقابة الأطباء.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setStep(2);
  };

  const handleDoctorStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!clinicName.trim()) {
      nextErrors.clinicName = 'يرجى إدخال اسم العيادة.';
    }
    if (!clinicAddress.trim()) {
      nextErrors.clinicAddress = 'يرجى إدخال العنوان التفصيلي للعيادة.';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setOtpDigits(['4', '8', '2', '9']);
    showToast(`تم إرسال كود تفعيل حساب الطبيب (${SIMULATED_OTP_CODE})`, 'info');
    setStep(3);
  };

  const handleDoctorComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpDigits.join('').length < 4) {
      setErrors({ otp: 'يرجى إدخال رمز التفعيل المكون من 4 أرقام.' });
      return;
    }

    registerDoctor({
      name: docName,
      phone: docPhone,
      specialtyAr: docSpecialty,
      titleAr: docTitle,
      yearsExperience: Math.max(1, Number(docYearsExp) || 10),
      consultationFee: Math.max(100, Number(consultationFee) || 350),
      followUpPrice: Math.max(50, Number(followUpPrice) || 150),
      clinicName,
      governorate: clinicGov,
      city: clinicCity || 'مدينة نصر',
      address: clinicAddress,
      landmark: clinicLandmark || 'بجوار الميدان الرئيسي',
    });
    showToast('تم تسجيل حساب الطبيب والعيادة بنجاح! مرحبًا بك في لوحة تحكم الطبيب', 'success');
    navigate('/doctor');
  };

  return (
    <div className="max-w-[720px] w-full mx-auto px-4 py-8 sm:py-10">
      <Card padding="lg">
        {/* Role Switcher Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-[var(--color-border)]">
          <div>
            <h1 className="mb-1">
              {roleType === 'patient'
                ? 'إنشاء حساب مريض جديد'
                : 'انضمام طبيب جديد إلى منصة موعدي'}
            </h1>
            <p className="text-[14px] text-[var(--color-secondary-text)]">
              {roleType === 'patient'
                ? 'رحلة تسجيل حقيقية من ٣ خطوات (تعمل بالكامل داخل المتصفح بدون باك إند).'
                : 'سجل بياناتك المهنية وبيانات عيادتك لتظهر فورًا للمرضى في نتائج البحث.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setRoleType('patient');
                setStep(1);
                setErrors({});
              }}
              className={`px-3.5 py-2 rounded-[var(--radius-sm)] text-[13px] font-bold flex items-center gap-1.5 cursor-pointer ${
                roleType === 'patient'
                  ? 'bg-[var(--color-neon-orange)] text-[var(--color-white)]'
                  : 'bg-[var(--color-muted)] text-[var(--color-primary-text)]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>كمريض</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRoleType('doctor');
                setStep(1);
                setErrors({});
              }}
              className={`px-3.5 py-2 rounded-[var(--radius-sm)] text-[13px] font-bold flex items-center gap-1.5 cursor-pointer ${
                roleType === 'doctor'
                  ? 'bg-[var(--color-dark-teal)] text-[var(--color-white)]'
                  : 'bg-[var(--color-muted)] text-[var(--color-primary-text)]'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>كطبيب</span>
            </button>
          </div>
        </div>

        {/* Stepper */}
        <div className="mb-6">
          <Stepper
            steps={
              roleType === 'patient'
                ? ['١. بيانات الحساب', '٢. تأكيد رقم الموبايل (OTP)', '٣. الملف الصحي والموقع']
                : ['١. البيانات المهنية والنقابة', '٢. بيانات العيادة والكشف', '٣. التفعيل والاعتماد']
            }
            currentStep={step - 1}
          />
        </div>

        {Object.keys(errors).length > 0 && (
          <div className="mb-5">
            <InlineAlert variant="error" title="يرجى مراجعة الحقول التالية:">
              <ul className="list-disc ps-5 space-y-1">
                {Object.values(errors)
                  .filter(Boolean)
                  .map((err) => (
                    <li key={err}>{err}</li>
                  ))}
              </ul>
            </InlineAlert>
          </div>
        )}

        {/* PATIENT 3-STEP FLOW */}
        {roleType === 'patient' && (
          <>
            {step === 1 && (
              <form onSubmit={handlePatientStep1} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    label="الاسم الثلاثي للمريض"
                    required
                    placeholder="مثال: محمد حسن علي"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={errors.name || undefined}
                  />
                  <PhoneInput
                    label="رقم الموبايل المصري"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    error={errors.phone || undefined}
                  />
                </div>
                <TextInput
                  label="كلمة المرور"
                  type="password"
                  required
                  placeholder="أدخل كلمة مرور مكونة من 6 أحرف أو أرقام"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password || undefined}
                />
                <div className="pt-4 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3">
                  <Button type="submit" variant="primary" size="lg">
                    متابعة وإرسال كود التحقق (SMS)
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => navigate('/login')}>
                    لديك حساب بالفعل؟ تسجيل الدخول
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handlePatientStep2} className="space-y-5">
                <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] border border-[var(--color-dark-teal)]/25 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[14px] text-[var(--color-dark-teal)]">
                    <strong>رسالة SMS محاكاة إلى {phone}:</strong> رمز تأكيد حسابك هو{' '}
                    <span className="px-2.5 py-0.5 rounded bg-[var(--color-dark-teal)] text-[var(--color-white)] font-bold tabular-nums">
                      {SIMULATED_OTP_CODE}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtpDigits(['4', '8', '2', '9'])}
                    className="text-[13px] font-bold text-[var(--color-neon-orange)] hover:underline cursor-pointer"
                  >
                    ملء الكود تلقائيًا
                  </button>
                </div>

                <div>
                  <label className="block text-[15px] font-semibold text-[var(--color-primary-text)] mb-2 text-center">
                    أدخل رمز التحقق المكون من 4 أرقام
                  </label>
                  <div dir="ltr" className="flex items-center justify-center gap-3">
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        aria-label={`الرقم ${index + 1}`}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(-1);
                          const next = [...otpDigits];
                          next[index] = val;
                          setOtpDigits(next);
                        }}
                        className="w-14 h-14 text-center text-[22px] font-bold tabular-nums rounded-[var(--radius-md)] border-2 border-[var(--color-dark-teal)] bg-[var(--color-white)]"
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
                  <Button type="submit" variant="primary" size="lg">
                    تأكيد الرمز واستكمال الملف الصحي
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    السابق
                  </Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handlePatientComplete} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    label="تاريخ الميلاد"
                    type="date"
                    required
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                  <SelectField
                    label="النوع"
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                    options={[
                      { value: 'male', label: 'ذكر' },
                      { value: 'female', label: 'أنثى' },
                    ]}
                  />
                </div>

                <LocationCascadeSelect
                  locations={locations}
                  governorate={governorate}
                  city={city}
                  onChangeGovernorate={setGovernorate}
                  onChangeCity={setCity}
                  allowAll={false}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    label="حساسية من أدوية أو أطعمة (اختياري)"
                    placeholder="مثال: البنسلين، الأسبرين"
                    value={allergiesText}
                    onChange={(e) => setAllergiesText(e.target.value)}
                    helperText="افصل بين أكثر من حساسية بفاصلة (،)"
                  />
                  <TextInput
                    label="أمراض مزمنة لمتابعة الطبيب (اختياري)"
                    placeholder="مثال: ضغط الدم، السكري"
                    value={chronicText}
                    onChange={(e) => setChronicText(e.target.value)}
                  />
                </div>

                <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
                  <Button type="submit" variant="primary" size="lg">
                    إتمام التسجيل ومشاهدة الفيديو التوضيحي
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>
                    السابق
                  </Button>
                </div>
              </form>
            )}
          </>
        )}

        {/* DOCTOR 3-STEP FLOW */}
        {roleType === 'doctor' && (
          <>
            {step === 1 && (
              <form onSubmit={handleDoctorStep1} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    label="اسم الطبيب الثلاثي"
                    required
                    placeholder="مثال: د. عمرو خالد المنيري"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    error={errors.docName || undefined}
                  />
                  <PhoneInput
                    label="رقم الموبايل للتواصل المهني"
                    required
                    value={docPhone}
                    onChange={(e) => setDocPhone(e.target.value)}
                    error={errors.docPhone || undefined}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField
                    label="التخصص الطبي الدقيق"
                    required
                    value={docSpecialty}
                    onChange={(e) => setDocSpecialty(e.target.value)}
                    options={specialties.map((s) => ({ value: s.nameAr, label: s.nameAr }))}
                  />
                  <TextInput
                    label="الدرجة العلمية / اللقب المهني"
                    required
                    placeholder="مثال: استشاري أمراض القلب — القصر العيني"
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    label="رقم قيد نقابة الأطباء"
                    required
                    dir="ltr"
                    value={docSyndicateId}
                    onChange={(e) => setDocSyndicateId(e.target.value)}
                    error={errors.docSyndicateId || undefined}
                  />
                  <TextInput
                    label="سنوات الخبرة الإكلينيكية"
                    type="number"
                    min={1}
                    max={50}
                    required
                    value={docYearsExp}
                    onChange={(e) => setDocYearsExp(e.target.value)}
                  />
                </div>

                <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
                  <Button type="submit" variant="secondary" size="lg">
                    التالي: بيانات العيادة والكشف
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => navigate('/login')}>
                    العودة لتسجيل الدخول
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleDoctorStep2} noValidate className="space-y-4">
                <TextInput
                  label="اسم العيادة أو المركز الطبي"
                  required
                  placeholder="مثال: عيادة الشفاء التخصصية"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  error={errors.clinicName || undefined}
                />

                <LocationCascadeSelect
                  locations={locations}
                  governorate={clinicGov}
                  city={clinicCity}
                  onChangeGovernorate={setClinicGov}
                  onChangeCity={setClinicCity}
                  allowAll={false}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    label="العنوان التفصيلي للعيادة"
                    required
                    placeholder="مثال: 25 شارع عباس العقاد، الدور الثالث"
                    value={clinicAddress}
                    onChange={(e) => setClinicAddress(e.target.value)}
                    error={errors.clinicAddress || undefined}
                  />
                  <TextInput
                    label="أقرب علامة مميزة"
                    placeholder="مثال: بجوار محطة المترو وأمام صيدلية العزبي"
                    value={clinicLandmark}
                    onChange={(e) => setClinicLandmark(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    label="سعر الكشف الأساسي (ج.م)"
                    type="number"
                    required
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                  />
                  <TextInput
                    label="سعر الاستشارة / الإعادة (ج.م)"
                    type="number"
                    required
                    value={followUpPrice}
                    onChange={(e) => setFollowUpPrice(e.target.value)}
                  />
                </div>

                <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
                  <Button type="submit" variant="secondary" size="lg">
                    التالي: تأكيد وتفعيل حساب الطبيب
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    السابق
                  </Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleDoctorComplete} className="space-y-5">
                <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] border border-[var(--color-dark-teal)]/25 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-[var(--color-dark-teal)]">
                      مراجعة بيانات الاعتماد المهني للطبيب
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-[var(--color-green)] text-[var(--color-white)] text-[12px] font-bold">
                      جاهز للتفعيل الفوري
                    </span>
                  </div>
                  <p className="text-[13px] text-[var(--color-secondary-text)]">
                    الطبيب: <strong>{docName}</strong> · التخصص: <strong>{docSpecialty}</strong> ·
                    العيادة: <strong>{clinicName}</strong> ({clinicGov} - {clinicCity})
                  </p>
                  <div className="text-[13px] text-[var(--color-dark-teal)] pt-1">
                    كود التفعيل المهني المرسل للموبايل ({docPhone}):{' '}
                    <span className="px-2 py-0.5 rounded bg-[var(--color-dark-teal)] text-[var(--color-white)] font-bold tabular-nums">
                      {SIMULATED_OTP_CODE}
                    </span>
                  </div>
                </div>

                <div dir="ltr" className="flex items-center justify-center gap-3">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      aria-label={`الرقم ${index + 1}`}
                      value={digit}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(-1);
                        const next = [...otpDigits];
                        next[index] = val;
                        setOtpDigits(next);
                      }}
                      className="w-14 h-14 text-center text-[22px] font-bold tabular-nums rounded-[var(--radius-md)] border-2 border-[var(--color-dark-teal)] bg-[var(--color-white)]"
                    />
                  ))}
                </div>

                <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
                  <Button type="submit" variant="primary" size="lg">
                    اعتماد الحساب والدخول إلى بوابة الطبيب
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>
                    السابق
                  </Button>
                </div>
              </form>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

// Mandatory 9-step Patient Onboarding Guide + Embedded Explanatory Video (Section 10)
export const OnboardingPage: React.FC = () => {
  const { completeOnboarding, showToast } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: '١. مرحبًا بك في منصة موعدي',
      description:
        'منصتك الطبية لحجز العيادات في مصر، متابعة دورك لحظة بلحظة، والاحتفاظ بسجلك الطبي وروشتاتك في مكان واحد.',
      tip: 'يمكنك مشاهدة الفيديو التوضيحي بالأسفل أو التصفح خطوة بخطوة.',
      icon: <CheckCircle2 className="w-10 h-10 text-[var(--color-dark-teal)]" strokeWidth={1.75} />,
    },
    {
      title: '٢. كيف تبحث عن الطبيب المناسب',
      description:
        'من صفحة "الأطباء"، ابحث باسم الطبيب أو اختر التخصص الطبي (١٠ تخصصات و٢٤ طبيبًا) مع تصفية النتائج حسب المحافظة والتقييم وسعر الكشف.',
      tip: 'البحث يدعم الكتابة العربية المرنة حتى بدون همزات.',
      icon: <Search className="w-10 h-10 text-[var(--color-dark-teal)]" strokeWidth={1.75} />,
    },
    {
      title: '٣. كيف تختار الفرع أو العيادة الأقرب لك',
      description:
        'يعمل بعض الأطباء في أكثر من عيادة. تعرض بطاقة العيادة العنوان التفصيلي، أقرب علامة مميزة، ومواعيد العمل وسعر الكشف والاستشارة.',
      tip: 'يمكنك نسخ عنوان العيادة بضغطة واحدة.',
      icon: <Building2 className="w-10 h-10 text-[var(--color-dark-teal)]" strokeWidth={1.75} />,
    },
    {
      title: '٤. خطوات حجز الموعد بسهولة',
      description:
        'اضغط "احجز الآن"، اختر الفرع والتاريخ والفترة (صباحًا أو مساءً)، ثم راجع ملخص الحجز وأكده لتحصل فورًا على رقم حجزك.',
      tip: 'مثال لرقم الحجز: #025.',
      icon: <Calendar className="w-10 h-10 text-[var(--color-dark-teal)]" strokeWidth={1.75} />,
    },
    {
      title: '٥. متابعة دورك في الطابور لحظة بلحظة',
      description:
        'من بطاقة "تتبع دورك"، ستشاهد رقم الحجز الذي يتم كشفه حاليًا، وترتيبك في الطابور، وعدد المرضى قبلك مباشرة.',
      tip: 'تتحدث الصفحة تلقائيًا عندما تستدعي الممرضة المريض التالي.',
      icon: <Activity className="w-10 h-10 text-[var(--color-dark-teal)]" strokeWidth={1.75} />,
    },
    {
      title: '٦. متى تتوجه إلى العيادة؟',
      description:
        'يعرض الموقع الوقت التقريبي المتبقي ويرسل لك إشعارًا عندما يتبقى أمامك 5 مرضى ثم مريضان لتصل في الموعد المناسب دون انتظار طويل.',
      tip: 'الوقت المعروض تقريبي ويُحسب حسب متوسط مدة الكشف.',
      icon: <Clock className="w-10 h-10 text-[var(--color-dark-teal)]" strokeWidth={1.75} />,
    },
    {
      title: '٧. الوصول إلى سجلك الطبي الكامل',
      description:
        'في قسم "السجل الطبي" ستجد الخط الزمني لزياراتك السابقة، التشخيصات، نتائج التحاليل، والأشعة، والتنبيهات الخاصة بالحساسية.',
      tip: 'يمكنك أيضًا إضافة ملفات تحاليلك لحفظها في ملفك.',
      icon: <FileText className="w-10 h-10 text-[var(--color-dark-teal)]" strokeWidth={1.75} />,
    },
    {
      title: '٨. عرض وطباعة الروشتات الإلكترونية',
      description:
        'بعد انتهاء الكشف، تظهر روشتتك الإلكترونية شاملة أسماء الأدوية، التركيز، الجرعة، والمواعيد قبل أو بعد الأكل مع إمكانية طباعتها كملف PDF.',
      tip: 'الروشتات التجريبية موضح عليها أنها لأغراض العرض فقط.',
      icon: <Pill className="w-10 h-10 text-[var(--color-dark-teal)]" strokeWidth={1.75} />,
    },
    {
      title: '٩. إدارة مواعيدك وتعديلها أو إلغاؤها',
      description:
        'من صفحة "حجوزاتي" يمكنك استعراض الحجوزات القادمة أو المكتملة، أو تأجيل موعدك ليوم آخر، أو إلغاء الحجز وتقييم زيارتك.',
      tip: 'يمكنك إعادة تشغيل هذا الدليل في أي وقت من صفحة "المساعدة".',
      icon: <ClipboardCheck className="w-10 h-10 text-[var(--color-dark-teal)]" strokeWidth={1.75} />,
    },
  ];

  const handleFinish = () => {
    completeOnboarding();
    showToast('تم إكمال دليل الاستخدام بنجاح! أهلاً بك في موعدي', 'success');
    navigate('/patient');
  };

  useEffect(() => {
    document.title = 'الفيديو التوضيحي ودليل استخدام منصة موعدي';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        completeOnboarding();
        navigate('/patient');
      } else if (e.key === 'ArrowLeft') {
        setStep((s) => Math.min(steps.length - 1, s + 1));
      } else if (e.key === 'ArrowRight') {
        setStep((s) => Math.max(0, s - 1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [completeOnboarding, navigate, steps.length]);

  const current = steps[step];
  const progressPct = Math.round(((step + 1) / steps.length) * 100);

  return (
    <div className="max-w-[920px] w-full mx-auto px-4 py-8 sm:py-10 space-y-8">
      {/* Interactive Explanatory Video right inside Onboarding */}
      <PatientExplainerVideoPlayer autoPlay />

      <Card padding="lg">
        {/* Top Progress Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[14px] font-bold text-[var(--color-dark-teal)]">
            دليل المريض التفاعلي — الخطوة {formatNumber(step + 1)} من {formatNumber(steps.length)}
          </span>
          <button
            type="button"
            onClick={handleFinish}
            className="text-[14px] font-semibold text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] hover:underline cursor-pointer"
          >
            تخطي الدليل والانتقال للرئيسية (Esc)
          </button>
        </div>

        <div className="w-full h-2.5 rounded-full bg-[var(--color-muted)] overflow-hidden mb-8">
          <div
            className="h-full bg-[var(--color-neon-orange)] transition-all duration-[var(--duration-normal)]"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Step Visual & Content */}
        <div className="text-center py-4 px-2 sm:px-6">
          <div className="w-20 h-20 rounded-full bg-[var(--color-light-teal)] border border-[var(--color-border)] flex items-center justify-center mx-auto mb-5">
            {current.icon}
          </div>
          <h1 className="text-[24px] sm:text-[26px] font-bold text-[var(--color-primary-text)] mb-3">
            {current.title}
          </h1>
          <p className="text-[16px] text-[var(--color-primary-text)] leading-relaxed mb-4">
            {current.description}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] text-[14px] font-semibold text-[var(--color-dark-teal)]">
            <Bell className="w-4 h-4 shrink-0 text-[var(--color-neon-orange)]" />
            <span>{current.tip}</span>
          </div>
        </div>

        {/* Step Dots */}
        <div className="flex max-sm:flex-wrap items-center justify-center gap-1.5 my-6" aria-hidden="true">
          {steps.map((_, idx) => (
            <span
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === step
                  ? 'w-6 bg-[var(--color-neon-orange)]'
                  : idx < step
                  ? 'w-2 bg-[var(--color-dark-teal)]'
                  : 'w-2 bg-[var(--color-border)]'
              }`}
            />
          ))}
        </div>

        {/* Footer Controls */}
        <div className="pt-5 border-t border-[var(--color-border)] flex items-center justify-between gap-3">
          {step < steps.length - 1 ? (
            <Button variant="primary" size="md" onClick={() => setStep((s) => s + 1)}>
              التالي
            </Button>
          ) : (
            <Button variant="primary" size="md" onClick={handleFinish}>
              ابدأ استخدام موعدي الآن
            </Button>
          )}

          <div className="flex items-center gap-2">
            {step > 0 && (
              <Button variant="outline" size="md" onClick={() => setStep((s) => s - 1)}>
                السابق
              </Button>
            )}
            <Button variant="ghost" size="md" onClick={handleFinish}>
              تخطي
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const NotFoundPage: React.FC = () => {
  const { session } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'الصفحة غير موجودة (404) — موعدي';
  }, []);

  return (
    <div className="max-w-[540px] w-full mx-auto px-4 py-16 text-center">
      <Card padding="lg">
        <div className="text-[42px] font-bold tabular-nums text-[var(--color-dark-teal)] mb-2">
          404
        </div>
        <h1 className="text-[22px] font-bold mb-2">عذرًا، هذه الصفحة غير موجودة</h1>
        <p className="text-[15px] text-[var(--color-secondary-text)] mb-6">
          ربما تم تغيير الرابط أو أن الصفحة التي تبحث عنها غير متوفرة حاليًا.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="secondary"
            onClick={() =>
              navigate(session ? getDefaultHomeRouteForRole(session.role) : '/login')
            }
          >
            العودة إلى الصفحة الرئيسية
          </Button>
          <Link
            to="/login"
            className="text-[14px] font-semibold text-[var(--color-dark-teal)] hover:underline px-3 py-2"
          >
            صفحة تبديل الحسابات
          </Link>
        </div>
      </Card>
    </div>
  );
};
