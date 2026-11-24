import React, { useEffect, useState } from 'react';
import {
  Activity,
  Building2,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  LayoutDashboard,
  Lock,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Pill,
  PlusCircle,
  Settings,
  Shield,
  Stethoscope,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { UserRole } from '../types';
import { Avatar } from '../components/common/UIPrimitives';
import { ToastViewport } from '../components/modals/Overlays';
import { getDefaultHomeRouteForRole } from '../services/permissions';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

const DemoAccountSwitcherMenu: React.FC<{
  onSelected?: () => void;
  compact?: boolean;
}> = ({ onSelected, compact = false }) => {
  const { session, loginAsRole } = useApp();
  const navigate = useNavigate();

  const roles: { role: UserRole; label: string; sub: string }[] = [
    { role: 'patient', label: 'مريض: أحمد محمد', sub: '01012345678' },
    { role: 'doctor', label: 'طبيب: د. أحمد محمود', sub: 'قلب وأوعية دموية' },
    { role: 'nurse', label: 'ممرضة: منى إبراهيم', sub: 'عيادة دار القلب' },
    { role: 'admin', label: 'مدير النظام: Admin', sub: 'إدارة المنصة' },
  ];

  const handleSwitch = (role: UserRole) => {
    loginAsRole(role);
    onSelected?.();
    navigate(getDefaultHomeRouteForRole(role));
  };

  return (
    <div className="space-y-1" role="group" aria-label="تبديل الحساب التجريبي">
      {!compact && (
        <p className="text-[12px] font-bold text-[var(--color-secondary-text)] px-2 py-1">
          تبديل الحساب التجريبي (DEMO MODE)
        </p>
      )}
      {roles.map((r) => {
        const active = session?.role === r.role;
        return (
          <button
            key={r.role}
            type="button"
            onClick={() => handleSwitch(r.role)}
            className={`w-full text-start px-3 py-2 rounded-[var(--radius-sm)] text-[13px] flex items-center justify-between gap-2 transition-colors cursor-pointer ${
              active
                ? 'bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] font-bold'
                : 'text-[var(--color-primary-text)] hover:bg-[var(--color-muted)]'
            }`}
          >
            <div>
              <div className="font-semibold">{r.label}</div>
              <div className="text-[12px] text-[var(--color-secondary-text)]">{r.sub}</div>
            </div>
            {active && (
              <span className="text-[12px] font-bold text-[var(--color-neon-orange)]">الحالي</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export const SiteFooter: React.FC = () => {
  return null;
};

export const PublicLayout: React.FC = () => {
  const { debugGrid } = useApp();
  return (
    <div className="min-h-[100dvh] flex flex-col bg-[var(--color-background)]">
      <a href="#main-content" className="skip-link">
        تخطي إلى المحتوى الرئيسي
      </a>
      {debugGrid && <div className="debug-grid-overlay" aria-hidden="true" />}
      <main id="main-content" className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <SiteFooter />
      <ToastViewport />
    </div>
  );
};

interface StaffNavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
}

const StaffWorkspaceShell: React.FC<{
  roleTitle: string;
  roleSubtitle: string;
  navItems: StaffNavItem[];
  maxWidthClass?: string;
}> = ({ roleTitle, roleSubtitle, navItems, maxWidthClass = 'max-w-[1280px]' }) => {
  const { session, logout, debugGrid } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [demoSwitcherOpen, setDemoSwitcherOpen] = useState(false);

  // Lock body scroll only when mobile drawer is open below 1024px
  useLockBodyScroll(mobileDrawerOpen);

  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  // Close drawer on Escape
  useEffect(() => {
    if (!mobileDrawerOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileDrawerOpen]);

  const SidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full bg-[var(--color-dark-teal)] text-[var(--color-white)] select-none">
      {/* Brand + Role Header */}
      <div className="p-4 border-b border-[var(--color-white)]/15 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="w-3.5 h-3.5 rounded-full bg-[var(--color-neon-orange)] shrink-0" />
          {(!collapsed || isMobile) && (
            <div className="truncate">
              <div className="text-[20px] font-bold leading-tight">موعدي</div>
              <div className="text-[12px] text-[var(--color-white)]/75 truncate">{roleTitle}</div>
            </div>
          )}
        </div>
        {isMobile ? (
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(false)}
            aria-label="إغلاق القائمة"
            className="w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center hover:bg-[var(--color-teal-hover)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? 'توسيع القائمة الجانبية' : 'طي القائمة الجانبية'}
            className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center hover:bg-[var(--color-teal-hover)] cursor-pointer"
          >
            {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav aria-label={roleTitle} className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            title={collapsed && !isMobile ? item.label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-[var(--radius-md)] text-[15px] transition-colors ${
                isActive
                  ? 'bg-[var(--color-teal-mid)] text-[var(--color-white)] font-bold ring-1 ring-[var(--color-neon-orange)]'
                  : 'text-[var(--color-white)]/85 hover:bg-[var(--color-teal-hover)] hover:text-[var(--color-white)] font-semibold'
              }`
            }
          >
            <span className="shrink-0">{item.icon}</span>
            {(!collapsed || isMobile) && <span className="truncate">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom DEMO MODE Switcher & User Card */}
      <div className="p-2.5 border-t border-[var(--color-white)]/15 space-y-1.5">
        {(!collapsed || isMobile) && (
          <div className="bg-[var(--color-teal-hover)] rounded-[var(--radius-md)] p-2">
            <button
              type="button"
              onClick={() => setDemoSwitcherOpen((o) => !o)}
              className="w-full flex items-center justify-between text-[13px] font-bold text-[var(--color-white)] cursor-pointer"
            >
              <span>تبديل الحساب التجريبي</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {demoSwitcherOpen && (
              <div className="mt-2 bg-[var(--color-white)] rounded-[var(--radius-sm)] p-1.5">
                <DemoAccountSwitcherMenu
                  compact
                  onSelected={() => {
                    setDemoSwitcherOpen(false);
                    setMobileDrawerOpen(false);
                  }}
                />
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-2 px-2 py-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar name={session?.name ?? roleTitle} size={32} variant="light" />
            {(!collapsed || isMobile) && (
              <div className="min-w-0">
                <div className="text-[14px] font-bold truncate">{session?.name}</div>
                <div className="text-[12px] text-[var(--color-white)]/70 truncate">
                  {roleSubtitle}
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              const isAdmin = session?.role === 'admin';
              logout();
              navigate(isAdmin ? '/administration' : '/');
            }}
            aria-label="تسجيل الخروج"
            title="تسجيل الخروج"
            className="w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center text-[var(--color-white)]/85 hover:bg-[var(--color-red)] hover:text-[var(--color-white)] transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[var(--color-background)]">
      <a href="#main-content" className="skip-link">
        تخطي إلى المحتوى الرئيسي
      </a>
      {debugGrid && <div className="debug-grid-overlay" aria-hidden="true" />}

      <div className="flex-1 flex">
        {/* Persistent Desktop Sidebar (Right side in RTL) */}
        <aside
          aria-label="القائمة الجانبية"
          className={`hidden lg:block shrink-0 transition-all duration-[var(--duration-normal)] no-print ${
            collapsed ? 'w-[76px]' : 'w-[264px]'
          }`}
        >
          <div className="sticky top-0 h-[100dvh]">{SidebarContent(false)}</div>
        </aside>

        {/* Mobile Drawer (Accessible off-canvas dialog < 1024px) */}
        {mobileDrawerOpen && (
          <div
            id="staff-mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={`قائمة التنقل لـ ${roleTitle}`}
            className="lg:hidden fixed inset-0 z-[var(--z-drawer)] bg-[var(--color-primary-text)]/50 flex animate-fadeIn"
            onClick={() => setMobileDrawerOpen(false)}
          >
            <div
              className="w-[280px] max-w-[85vw] h-full shadow-2xl safe-area-top safe-area-bottom"
              onClick={(e) => e.stopPropagation()}
            >
              {SidebarContent(true)}
            </div>
          </div>
        )}

        {/* Main Workspace Column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar inside Content Area */}
          <header className="sticky top-0 z-[var(--z-sticky)] h-[64px] bg-[var(--color-white)] border-b border-[var(--color-border)] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 no-print">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                aria-label="فتح القائمة الجانبية"
                aria-expanded={mobileDrawerOpen}
                aria-controls="staff-mobile-drawer"
                className="lg:hidden w-10 h-10 rounded-[var(--radius-sm)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary-text)] hover:bg-[var(--color-light-teal)] cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <span className="text-[16px] font-bold text-[var(--color-dark-teal)]">
                  {roleTitle}
                </span>
                <span className="hidden sm:inline text-[13px] text-[var(--color-secondary-text)] ms-2">
                  · الخميس، 5 نوفمبر 2026
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden md:inline-flex items-center gap-1.5 text-[13px] text-[var(--color-secondary-text)]">
                <Clock className="w-4 h-4 text-[var(--color-dark-teal)]" />
                <span>مزامنة فورية عبر المتصفح</span>
              </span>
              <Link
                to="/"
                className="px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[13px] font-semibold text-[var(--color-dark-teal)] hover:bg-[var(--color-light-teal)]"
              >
                تبديل الدور
              </Link>
            </div>
          </header>

          <main
            id="main-content"
            className={`flex-1 w-full ${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8`}
          >
            <Outlet />
          </main>

          <SiteFooter />
        </div>
      </div>

      <ToastViewport />
    </div>
  );
};

export const DoctorLayout: React.FC = () => {
  const navItems: StaffNavItem[] = [
    {
      to: '/doctor',
      label: 'لوحة تحكم الطبيب',
      icon: <LayoutDashboard className="w-5 h-5" />,
      end: true,
    },
    {
      to: '/doctor/patients',
      label: 'سجل وبحث المرضى',
      icon: <Users className="w-5 h-5" />,
    },
    {
      to: '/doctor/prescriptions/new',
      label: 'كتابة روشتة إلكترونية',
      icon: <Pill className="w-5 h-5" />,
    },
    {
      to: '/doctor/notes',
      label: 'ملاحظاتي الخاصة (سري)',
      icon: <Lock className="w-5 h-5" />,
    },
    {
      to: '/doctor/clinics',
      label: 'إدارة العيادات',
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      to: '/doctor/schedule',
      label: 'جدول المواعيد والإجازات',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      to: '/doctor/settings',
      label: 'إعدادات الطابور والكشوفات',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <StaffWorkspaceShell
      roleTitle="بوابة الطبيب"
      roleSubtitle="قلب وأوعية دموية"
      navItems={navItems}
    />
  );
};

export const NurseLayout: React.FC = () => {
  const navItems: StaffNavItem[] = [
    {
      to: '/nurse',
      label: 'ملخص الاستقبال اليومي',
      icon: <LayoutDashboard className="w-5 h-5" />,
      end: true,
    },
    {
      to: '/nurse/queue',
      label: 'إدارة طابور الكشف الحي',
      icon: <Activity className="w-5 h-5" />,
    },
    {
      to: '/nurse/walk-in',
      label: 'إضافة حالة حضور مباشر',
      icon: <UserPlus className="w-5 h-5" />,
    },
    {
      to: '/nurse/patients',
      label: 'دليل المرضى والحجوزات',
      icon: <ClipboardList className="w-5 h-5" />,
    },
  ];

  return (
    <StaffWorkspaceShell
      roleTitle="مكتب الاستقبال والتمريض"
      roleSubtitle="عيادة دار القلب — مدينة نصر"
      navItems={navItems}
    />
  );
};

export const AdminLayout: React.FC = () => {
  const navItems: StaffNavItem[] = [
    {
      to: '/admin',
      label: 'نظرة عامة على المنصة',
      icon: <LayoutDashboard className="w-5 h-5" />,
      end: true,
    },
    {
      to: '/admin/doctors',
      label: 'إدارة الأطباء والتراخيص',
      icon: <Stethoscope className="w-5 h-5" />,
    },
    {
      to: '/admin/patients',
      label: 'المرضى المسجلون',
      icon: <Users className="w-5 h-5" />,
    },
    {
      to: '/admin/nurses',
      label: 'التمريض والاستقبال',
      icon: <PlusCircle className="w-5 h-5" />,
    },
    {
      to: '/admin/clinics',
      label: 'العيادات المسجلة',
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      to: '/admin/specialties',
      label: 'التخصصات الطبية',
      icon: <Shield className="w-5 h-5" />,
    },
    {
      to: '/admin/locations',
      label: 'المحافظات والمدن',
      icon: <MapPin className="w-5 h-5" />,
    },
    {
      to: '/admin/reviews',
      label: 'التقييمات والشكاوى',
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      to: '/admin/settings',
      label: 'إعدادات النظام التجريبي',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <StaffWorkspaceShell
      roleTitle="إدارة منصة موعدي"
      roleSubtitle="Super Administrator"
      navItems={navItems}
      maxWidthClass="max-w-[1440px]"
    />
  );
};
