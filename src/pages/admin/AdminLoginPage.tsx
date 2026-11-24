import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, Shield, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loginAsRole, showToast } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'بوابة الإدارة المركزية — موعدي';
  }, []);

  // If already logged in as admin, redirect to /admin directly
  useEffect(() => {
    if (session?.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [session, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    if (!cleanUsername || !cleanPassword) {
      setErrorMsg('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    setIsSubmitting(true);

    // Strict Admin Credentials Check
    if (cleanUsername === 'admin' && cleanPassword === 'admin') {
      loginAsRole('admin', {
        id: 'admin-1',
        name: 'مدير المنظومة (Admin)',
      });
      showToast('تم تسجيل الدخول بنجاح كمدير للنظام', 'success');
      const fromPath = (location.state as { from?: string })?.from || '/admin';
      navigate(fromPath, { replace: true });
    } else {
      setIsSubmitting(false);
      setErrorMsg('بيانات الدخول غير صحيحة. يرجى التأكد من اسم المستخدم وكلمة المرور.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[440px] space-y-6">
        {/* Header Icon & Brand */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-dark-teal)] text-[var(--color-white)] flex items-center justify-center mx-auto shadow-md">
            <Shield className="w-8 h-8 text-[var(--color-neon-orange)]" />
          </div>
          <h1 className="text-[22px] sm:text-[26px] font-extrabold text-[var(--color-dark-teal)]">
            بوابة الإدارة المركزية
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[var(--color-secondary-text)]">
            لوحة تحكم منصة موعدي (Maw3edy Super Admin)
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[var(--color-white)] rounded-[var(--radius-lg)] border-2 border-[var(--color-border)] p-6 sm:p-8 shadow-sm space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-red-subtle)] border border-[var(--color-red)] text-[var(--color-red)] text-[13px] font-bold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-username"
                className="block text-[13px] font-bold text-[var(--color-primary-text)]"
              >
                اسم المستخدم:
              </label>
              <div className="relative">
                <input
                  id="admin-username"
                  type="text"
                  required
                  autoFocus
                  dir="ltr"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  style={{ fontSize: '16px' }}
                  className="w-full ps-10 pe-3 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-dark-teal)]/20 outline-none text-[15px] font-medium text-[var(--color-primary-text)] placeholder:text-[var(--color-secondary-text)]/40 transition-colors"
                />
                <User className="w-4 h-4 text-[var(--color-secondary-text)] absolute start-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="block text-[13px] font-bold text-[var(--color-primary-text)]"
              >
                كلمة المرور:
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  dir="ltr"
                  placeholder="admin"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  style={{ fontSize: '16px' }}
                  className="w-full ps-10 pe-10 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-dark-teal)]/20 outline-none text-[15px] font-medium text-[var(--color-primary-text)] placeholder:text-[var(--color-secondary-text)]/40 transition-colors"
                />
                <Lock className="w-4 h-4 text-[var(--color-secondary-text)] absolute start-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary-text)] hover:text-[var(--color-dark-teal)] p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-[var(--radius-md)] bg-[var(--color-dark-teal)] hover:bg-[var(--color-teal-hover)] active:bg-[var(--color-teal-pressed)] text-white font-bold text-[14.5px] shadow-sm cursor-pointer transition-colors disabled:opacity-60 flex items-center justify-center gap-2 pt-3"
            >
              <span>تسجيل الدخول إلى لوحة الإدارة ←</span>
            </button>
          </form>

          {/* Quick Credential Hint */}
          <div className="p-2.5 rounded-[var(--radius-sm)] bg-[var(--color-light-teal)] border border-[var(--color-border)] text-center text-[11.5px] text-[var(--color-dark-teal)] font-medium">
            بيانات الدخول الإدارية:{' '}
            <strong className="text-[var(--color-neon-orange)]" dir="ltr">admin</strong> / كلمة المرور:{' '}
            <strong className="text-[var(--color-neon-orange)]" dir="ltr">admin</strong>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            to="/"
            className="text-[13px] font-bold text-[var(--color-secondary-text)] hover:text-[var(--color-dark-teal)] hover:underline inline-flex items-center gap-1"
          >
            <span>← العودة إلى الصفحة الرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
