import React from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Info,
  Loader2,
  Star,
  UserCheck,
  UserX,
  XCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppointmentStatus } from '../../types';
import { formatNumber, getInitials } from '../../utils/formatters';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success-confirm';

export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidthMobile?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'md',
  loading = false,
  icon,
  fullWidthMobile = false,
  fullWidth = false,
  children,
  disabled,
  className = '',
  type = 'button',
  ...rest
}) => {
  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'min-h-[40px] px-3.5 py-1.5 text-[14px]',
    md: 'min-h-[48px] px-5 py-2.5 text-[16px]',
    lg: 'min-h-[56px] px-6 py-3 text-[19px]',
  };

  // Respect Section 27 Orange contrast rule:
  // White text on orange fill requires bold >= 18.7px (WCAG large text).
  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-[var(--color-neon-orange)] hover:bg-[var(--color-orange-hover)] active:bg-[var(--color-orange-pressed)] text-[var(--color-white)] font-bold text-[19px] border border-transparent',
    secondary:
      'bg-[var(--color-dark-teal)] hover:bg-[var(--color-teal-hover)] active:bg-[var(--color-teal-pressed)] text-[var(--color-white)] font-semibold border border-transparent',
    outline:
      'bg-[var(--color-white)] hover:bg-[var(--color-light-teal)] active:bg-[var(--color-teal-subtle)] text-[var(--color-dark-teal)] font-semibold border border-[var(--color-dark-teal)]',
    ghost:
      'bg-transparent hover:bg-[var(--color-light-teal)] active:bg-[var(--color-teal-subtle)] text-[var(--color-primary-text)] font-semibold border border-transparent',
    danger:
      'bg-[var(--color-red)] hover:bg-[var(--color-red-hover)] text-[var(--color-white)] font-semibold border border-transparent',
    'success-confirm':
      'bg-[var(--color-green)] hover:bg-[var(--color-green-hover)] text-[var(--color-white)] font-bold border border-transparent',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] transition-all duration-[var(--duration-fast)] cursor-pointer select-none whitespace-nowrap shrink-0 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : fullWidthMobile ? 'w-full sm:w-auto' : ''} ${className}`}
      {...rest}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin shrink-0" aria-hidden="true" />
      ) : (
        icon && <span className="shrink-0 inline-flex items-center">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  selected?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export const Card: React.FC<CardProps> = ({
  interactive = false,
  selected = false,
  padding = 'md',
  children,
  className = '',
  ...rest
}) => {
  const padMap = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-5 lg:p-6',
    lg: 'p-5 sm:p-6 lg:p-8',
  };

  return (
    <div
      className={`bg-[var(--color-white)] rounded-[var(--radius-lg)] border transition-colors duration-[var(--duration-fast)] ${
        selected
          ? 'border-[var(--color-dark-teal)] bg-[var(--color-light-teal)] ring-1 ring-[var(--color-dark-teal)]'
          : 'border-[var(--color-border)]'
      } ${
        interactive
          ? 'hover:border-[var(--color-dark-teal)] hover:bg-[var(--color-light-teal)]/50 cursor-pointer'
          : ''
      } ${padMap[padding]} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export const StatusBadge: React.FC<{
  status: AppointmentStatus;
  size?: 'sm' | 'md';
}> = ({ status, size = 'md' }) => {
  const config: Record<
    AppointmentStatus,
    { label: string; classes: string; icon: React.ReactNode }
  > = {
    booked: {
      label: 'مؤكد بالحجز',
      classes:
        'bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] border-[var(--color-border)]',
      icon: <Calendar className="w-4 h-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />,
    },
    waiting: {
      label: 'في الانتظار',
      classes:
        'bg-[var(--color-orange-subtle)] text-[var(--color-primary-text)] border-[var(--color-neon-orange)]/40',
      icon: (
        <Clock
          className="w-4 h-4 shrink-0 text-[var(--color-neon-orange)]"
          strokeWidth={2}
          aria-hidden="true"
        />
      ),
    },
    arrived: {
      label: 'حضر للعيادة',
      classes:
        'bg-[var(--color-teal-subtle)] text-[var(--color-dark-teal)] border-[var(--color-dark-teal)]/30',
      icon: <UserCheck className="w-4 h-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />,
    },
    in_examination: {
      label: 'داخل الكشف الآن',
      classes:
        'bg-[var(--color-dark-teal)] text-[var(--color-white)] border-[var(--color-dark-teal)]',
      icon: <Activity className="w-4 h-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />,
    },
    completed: {
      label: 'تم الكشف',
      classes:
        'bg-[var(--color-green-subtle)] text-[var(--color-green)] border-[var(--color-green)]/30',
      icon: <Check className="w-4 h-4 shrink-0" strokeWidth={2} aria-hidden="true" />,
    },
    no_show: {
      label: 'لم يحضر',
      classes:
        'bg-[var(--color-muted)] text-[var(--color-primary-text)] border-[var(--color-border)]',
      icon: <UserX className="w-4 h-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />,
    },
    cancelled: {
      label: 'ملغي',
      classes:
        'bg-[var(--color-red-subtle)] text-[var(--color-red)] border-[var(--color-red)]/30',
      icon: <XCircle className="w-4 h-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />,
    },
  };

  const item = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border font-semibold whitespace-nowrap shrink-0 ${
        size === 'sm' ? 'px-2.5 py-1 text-[13px]' : 'px-3 py-1.5 text-[14px]'
      } ${item.classes}`}
    >
      {item.icon}
      <span>{item.label}</span>
    </span>
  );
};

export const Avatar: React.FC<{
  name: string;
  size?: 32 | 40 | 56 | 96;
  variant?: 'teal' | 'light' | 'muted';
}> = ({ name, size = 40, variant }) => {
  const initials = getInitials(name);
  const hash = name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const chosenVariant =
    variant ?? (hash % 3 === 0 ? 'teal' : hash % 3 === 1 ? 'light' : 'muted');

  const bgMap = {
    teal: 'bg-[var(--color-dark-teal)] text-[var(--color-white)]',
    light: 'bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] border border-[var(--color-border)]',
    muted: 'bg-[var(--color-teal-subtle)] text-[var(--color-primary-text)] border border-[var(--color-border)]',
  };

  const sizeMap: Record<number, string> = {
    32: 'w-8 h-8 text-[13px]',
    40: 'w-10 h-10 text-[14px]',
    56: 'w-14 h-14 text-[18px]',
    96: 'w-24 h-24 text-[26px]',
  };

  return (
    <div
      aria-hidden="true"
      className={`rounded-full inline-flex items-center justify-center font-bold shrink-0 select-none ${sizeMap[size]} ${bgMap[chosenVariant]}`}
    >
      {initials}
    </div>
  );
};

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export const Tabs: React.FC<{
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
}> = ({ tabs, activeTab, onChange, ariaLabel = 'الأقسام' }) => {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="flex items-center gap-2 overflow-x-auto border-b border-[var(--color-border)] no-scrollbar"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-3 min-h-[48px] text-[16px] font-semibold border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              isActive
                ? 'border-[var(--color-neon-orange)] text-[var(--color-dark-teal)] font-bold'
                : 'border-transparent text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span className="text-[13px] tabular-nums text-[var(--color-secondary-text)]">
                ({formatNumber(tab.count)})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export const SegmentedControl: React.FC<{
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
}> = ({ options, value, onChange, ariaLabel }) => {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex items-center p-1 rounded-[var(--radius-md)] bg-[var(--color-muted)] border border-[var(--color-border)]"
    >
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.id)}
            className={`px-4 py-2 min-h-[40px] rounded-[var(--radius-sm)] text-[14px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              active
                ? 'bg-[var(--color-dark-teal)] text-[var(--color-white)]'
                : 'text-[var(--color-primary-text)] hover:bg-[var(--color-light-teal)]'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

export const Breadcrumbs: React.FC<{
  items: { label: string; to?: string }[];
}> = ({ items }) => {
  return (
    <nav aria-label="مسار الصفحة" className="hidden md:flex items-center gap-2 text-[14px] text-[var(--color-secondary-text)] mb-3">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${idx}`}>
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="hover:text-[var(--color-dark-teal)] hover:underline transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={isLast ? 'text-[var(--color-primary-text)] font-semibold' : ''}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronLeft className="w-4 h-4 shrink-0 text-[var(--color-secondary-text)]" aria-hidden="true" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export const Stepper: React.FC<{
  steps: string[];
  currentStep: number; // 0-indexed
}> = ({ steps, currentStep }) => {
  const progressPercent = Math.round(((currentStep + 1) / steps.length) * 100);

  return (
    <div className="w-full mb-6" aria-label="خطوات التقدم">
      {/* Mobile compact stepper */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[14px] font-bold text-[var(--color-dark-teal)]">
            الخطوة {formatNumber(currentStep + 1)} من {formatNumber(steps.length)}: {steps[currentStep]}
          </span>
          <span className="text-[13px] tabular-nums text-[var(--color-secondary-text)]">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-[var(--color-muted)] overflow-hidden">
          <div
            className="h-full bg-[var(--color-neon-orange)] transition-all duration-[var(--duration-normal)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Desktop horizontal stepper */}
      <ol className="hidden md:flex items-center justify-between gap-2">
        {steps.map((label, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;
          return (
            <li key={label} className="flex items-center gap-3 flex-1">
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-8 h-8 rounded-full inline-flex items-center justify-center text-[14px] font-bold tabular-nums shrink-0 ${
                    isCompleted
                      ? 'bg-[var(--color-green)] text-[var(--color-white)]'
                      : isCurrent
                      ? 'bg-[var(--color-dark-teal)] text-[var(--color-white)] ring-2 ring-[var(--color-neon-orange)] ring-offset-2'
                      : 'bg-[var(--color-muted)] text-[var(--color-secondary-text)] border border-[var(--color-border)]'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : formatNumber(idx + 1)}
                </span>
                <span
                  className={`text-[14px] whitespace-nowrap ${
                    isCurrent
                      ? 'font-bold text-[var(--color-dark-teal)]'
                      : isCompleted
                      ? 'font-semibold text-[var(--color-primary-text)]'
                      : 'text-[var(--color-secondary-text)]'
                  }`}
                >
                  {label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`h-[2px] flex-1 mx-2 ${
                    isCompleted ? 'bg-[var(--color-green)]' : 'bg-[var(--color-border)]'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export const RatingDisplay: React.FC<{
  rating: number;
  reviewsCount?: number;
}> = ({ rating, reviewsCount }) => {
  return (
    <div className="inline-flex items-center gap-1.5 text-[14px] tabular-nums">
      <Star
        className="w-4 h-4 fill-[var(--color-neon-orange)] text-[var(--color-neon-orange)] shrink-0"
        aria-hidden="true"
      />
      <span className="font-bold text-[var(--color-primary-text)]">{rating.toFixed(1)}</span>
      {typeof reviewsCount === 'number' && (
        <span className="text-[var(--color-secondary-text)]">
          ({formatNumber(reviewsCount)} تقييم)
        </span>
      )}
    </div>
  );
};

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-6 w-full' }) => (
  <div
    aria-hidden="true"
    className={`animate-pulse rounded-[var(--radius-md)] bg-[var(--color-muted)] border border-[var(--color-border)]/50 ${className}`}
  />
);

export const EmptyState: React.FC<{
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: React.ReactNode;
}> = ({ icon, title, description, actionLabel, onAction, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-10 px-4 bg-[var(--color-white)] rounded-[var(--radius-lg)] border border-[var(--color-border)]">
    <div className="w-16 h-16 rounded-full bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] flex items-center justify-center mb-4">
      {icon ?? <Calendar className="w-8 h-8" strokeWidth={1.75} />}
    </div>
    <h3 className="text-[18px] font-bold text-[var(--color-primary-text)] mb-1">{title}</h3>
    <p className="text-[14px] text-[var(--color-secondary-text)] max-w-md mb-5">{description}</p>
    {action
      ? action
      : actionLabel && onAction && (
          <Button variant="secondary" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
  </div>
);

export const ErrorState: React.FC<{
  message?: string;
  onRetry?: () => void;
}> = ({
  message = 'حدث خطأ غير متوقع أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.',
  onRetry,
}) => (
  <div
    role="alert"
    className="flex flex-col items-center justify-center text-center py-8 px-4 bg-[var(--color-red-subtle)] rounded-[var(--radius-lg)] border border-[var(--color-red)]/30"
  >
    <AlertCircle className="w-10 h-10 text-[var(--color-red)] mb-3" />
    <h3 className="text-[18px] font-bold text-[var(--color-primary-text)] mb-1">
      تعذر إتمام العملية
    </h3>
    <p className="text-[14px] text-[var(--color-primary-text)] max-w-md mb-4">{message}</p>
    {onRetry && (
      <Button variant="secondary" size="sm" onClick={onRetry}>
        إعادة المحاولة
      </Button>
    )}
  </div>
);

export const InlineAlert: React.FC<{
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
}> = ({ variant = 'info', title, children }) => {
  const styles = {
    info: {
      box: 'bg-[var(--color-light-teal)] border-[var(--color-dark-teal)]/30 text-[var(--color-primary-text)]',
      icon: <Info className="w-5 h-5 text-[var(--color-dark-teal)] shrink-0 mt-0.5" />,
    },
    success: {
      box: 'bg-[var(--color-green-subtle)] border-[var(--color-green)]/40 text-[var(--color-primary-text)]',
      icon: <CheckCircle2 className="w-5 h-5 text-[var(--color-green)] shrink-0 mt-0.5" />,
    },
    warning: {
      box: 'bg-[var(--color-orange-subtle)] border-[var(--color-neon-orange)]/40 text-[var(--color-primary-text)]',
      icon: <AlertTriangle className="w-5 h-5 text-[var(--color-neon-orange)] shrink-0 mt-0.5" />,
    },
    error: {
      box: 'bg-[var(--color-red-subtle)] border-[var(--color-red)]/40 text-[var(--color-primary-text)]',
      icon: <AlertCircle className="w-5 h-5 text-[var(--color-red)] shrink-0 mt-0.5" />,
    },
  }[variant];

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-3 p-4 rounded-[var(--radius-md)] border ${styles.box}`}
    >
      {styles.icon}
      <div className="text-[14px]">
        {title && <p className="font-bold mb-0.5">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
};
