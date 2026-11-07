import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  Bell,
  Building2,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  HelpCircle,
  Home,
  LayoutDashboard,
  Lock,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Pill,
  PlayCircle,
  PlusCircle,
  Search,
  Settings,
  Shield,
  Stethoscope,
  User,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { UserRole } from '../types';
import { Avatar } from '../components/common/UIPrimitives';
import { DemoTopBanner, ToastViewport } from '../components/modals/Overlays';
import { PatientExplainerVideoModal } from '../components/patient/PatientExplainerVideo';
import { formatNumber, formatRelativeTimeArabic } from '../utils/formatters';
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

export const PatientLayout: React.FC = () => {
  const { session, notifications, markNotificationRead, logout, debugGrid } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const actionsContainerRef = useRef<HTMLDivElement>(null);

  const patientNotifs = notifications.filter(
    (n) => n.userId === (session?.id ?? 'pat-1')
  );
  const unreadCount = patientNotifs.filter((n) => !n.read).length;

  useEffect(() => {
    setUserMenuOpen(false);
    setNotifOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!userMenuOpen && !notifOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        actionsContainerRef.current &&
        !actionsContainerRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
        setNotifOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setUserMenuOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [notifOpen, userMenuOpen]);

  const desktopNavLinks = [
    { to: '/patient', label: 'الرئيسية', end: true },
    { to: '/patient/doctors', label: 'الأطباء' },
    { to: '/patient/appointments', label: 'حجوزاتي' },
    { to: '/patient/records', label: 'السجل الطبي' },
    { to: '/patient/prescriptions', label: 'الروشتات' },
  ];

  const mobileBottomLinks = [
    { to: '/patient', label: 'الرئيسية', icon: <Home className="w-5 h-5" />, end: true },
    { to: '/patient/doctors', label: 'الأطباء', icon: <Stethoscope className="w-5 h-5" /> },
    { to: '/patient/appointments', label: 'حجوزاتي', icon: <Calendar className="w-5 h-5" /> },
    { to: '/patient/records', label: 'السجل', icon: <FileText className="w-5 h-5" /> },
    { to: '/patient/profile', label: 'حسابي', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[var(--color-background)] max-md:pb-[calc(76px+env(safe-area-inset-bottom,0px))] md:pb-0">
      <a href="#main-content" className="skip-link">
        تخطي إلى المحتوى الرئيسي
      </a>
      {debugGrid && <div className="debug-grid-overlay" aria-hidden="true" />}

      {/* Patient Top Header (Dark Teal #0B434C) */}
      <header className="sticky top-0 z-[var(--z-sticky)] h-[56px] md:h-[64px] bg-[var(--color-dark-teal)] text-[var(--color-white)] px-4 sm:px-6 lg:px-8 border-b border-[var(--color-white)]/10">
        <div className="max-w-[1200px] h-full mx-auto flex items-center justify-between gap-4 sm:gap-6">
          {/* Zone 1: Brand wordmark */}
          <Link
            to="/patient"
            className="text-[22px] font-bold tracking-tight text-[var(--color-white)] whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="w-3 h-3 rounded-full bg-[var(--color-neon-orange)] inline-block" />
            <span>موعدي</span>
          </Link>

          {/* Zone 2: Desktop Navigation Links */}
          <nav
            aria-label="التنقل الرئيسي للمريض"
            className="hidden md:flex items-center gap-6 text-[15px]"
          >
            {desktopNavLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `py-2 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'border-[var(--color-neon-orange)] text-[var(--color-white)] font-bold'
                      : 'border-transparent text-[var(--color-white)]/80 hover:text-[var(--color-white)]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Actions (Explainer Video, Search, Notifications, User & Demo Switcher) */}
          <div
            ref={actionsContainerRef}
            className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 relative"
          >
            <button
              type="button"
              onClick={() => setVideoModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-teal-mid)] hover:bg-[var(--color-neon-orange)] text-[var(--color-white)] text-[13px] font-bold transition-colors cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-[var(--color-neon-orange)] shrink-0" />
              <span className="hidden sm:inline">فيديو الشرح</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/patient/doctors')}
              aria-label="بحث عن طبيب"
              className="w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center text-[var(--color-white)] hover:bg-[var(--color-teal-hover)] cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setNotifOpen((o) => !o);
                  setUserMenuOpen(false);
                }}
                aria-label={`الإشعارات (${unreadCount} غير مقروءة)`}
                aria-expanded={notifOpen}
                className="relative w-10 h-10 rounded-[var(--radius-sm)] flex items-center justify-center text-[var(--color-white)] hover:bg-[var(--color-teal-hover)] cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 end-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--color-neon-orange)] text-[var(--color-white)] text-[11px] font-bold tabular-nums flex items-center justify-center">
                    {formatNumber(unreadCount)}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute end-0 mt-2 w-[300px] sm:w-[350px] max-w-[calc(100vw-2rem)] bg-[var(--color-white)] text-[var(--color-primary-text)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-md)] z-[var(--z-dropdown)] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
                    <span className="font-bold text-[15px]">الإشعارات</span>
                    <Link
                      to="/patient/notifications"
                      className="text-[13px] font-semibold text-[var(--color-dark-teal)] hover:underline"
                    >
                      عرض الكل
                    </Link>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto divide-y divide-[var(--color-border)]">
                    {patientNotifs.slice(0, 4).map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          markNotificationRead(n.id);
                          setNotifOpen(false);
                          if (n.linkTo) navigate(n.linkTo);
                        }}
                        className={`w-full text-start p-3.5 hover:bg-[var(--color-light-teal)] transition-colors cursor-pointer ${
                          !n.read ? 'bg-[var(--color-light-teal)]/50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[14px] font-bold text-[var(--color-primary-text)]">
                            {n.title}
                          </span>
                          <span className="text-[12px] text-[var(--color-secondary-text)]">
                            {formatRelativeTimeArabic(n.createdAt)}
                          </span>
                        </div>
                        <p className="text-[13px] text-[var(--color-secondary-text)] line-clamp-2">
                          {n.message}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User & DEMO MODE Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen((o) => !o);
                  setNotifOpen(false);
                }}
                aria-expanded={userMenuOpen}
                aria-label="قائمة الحساب وتبديل الوضع التجريبي"
                className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-teal-hover)] cursor-pointer"
              >
                <Avatar name={session?.name ?? 'أحمد محمد'} size={32} variant="light" />
                <span className="hidden sm:inline text-[14px] font-semibold truncate max-w-[120px]">
                  {session?.name ?? 'أحمد محمد'}
                </span>
                <ChevronDown className="w-4 h-4 opacity-80" />
              </button>

              {userMenuOpen && (
                <div className="absolute end-0 mt-2 w-[280px] bg-[var(--color-white)] text-[var(--color-primary-text)] rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-md)] z-[var(--z-dropdown)] p-2 space-y-1">
                  <Link
                    to="/patient/profile"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-sm)] text-[14px] font-semibold hover:bg-[var(--color-light-teal)]"
                  >
                    <User className="w-4 h-4 text-[var(--color-dark-teal)]" />
                    <span>الملف الشخصي والإعدادات</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setVideoModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-sm)] text-[14px] font-semibold text-[var(--color-dark-teal)] hover:bg-[var(--color-light-teal)] cursor-pointer"
                  >
                    <PlayCircle className="w-4 h-4 text-[var(--color-neon-orange)]" />
                    <span>تشغيل الفيديو التوضيحي للمريض</span>
                  </button>
                  <Link
                    to="/patient/help"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-sm)] text-[14px] font-semibold hover:bg-[var(--color-light-teal)]"
                  >
                    <HelpCircle className="w-4 h-4 text-[var(--color-dark-teal)]" />
                    <span>المساعدة ودليل الاستخدام</span>
                  </Link>
                  <div className="border-t border-[var(--color-border)] my-1 pt-1">
                    <DemoAccountSwitcherMenu onSelected={() => setUserMenuOpen(false)} />
                  </div>
                  <div className="border-t border-[var(--color-border)] pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        navigate('/login');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[var(--radius-sm)] text-[14px] font-semibold text-[var(--color-red)] hover:bg-[var(--color-red-subtle)] cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Container (max-width 1200px) */}
      <main
        id="main-content"
        className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
      >
        <Outlet />
      </main>

      <PatientExplainerVideoModal
        open={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
      />

      <SiteFooter />

      {/* Mobile Fixed Bottom Navigation (5 items) */}
      <nav
        aria-label="التنقل السفلي للمريض"
        className="md:hidden fixed bottom-0 inset-x-0 min-h-[64px] bg-[var(--color-white)] border-t border-[var(--color-border)] z-[var(--z-sticky)] grid grid-cols-5 no-print"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {mobileBottomLinks.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center gap-1 text-[12px] transition-colors ${
                isActive
                  ? 'text-[var(--color-dark-teal)] font-bold'
                  : 'text-[var(--color-secondary-text)] font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute top-0 inset-x-3 h-[3px] rounded-b-full bg-[var(--color-neon-orange)]"
                  />
                )}
                {item.icon}
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

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
              logout();
              navigate('/login');
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
                to="/login"
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
