import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  RotateCcw,
  ShieldAlert,
  X,
} from 'lucide-react';
import { Button } from '../common/UIPrimitives';
import { useApp } from '../../contexts/AppContext';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  headerIcon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  destructive?: boolean;
  maxWidthClass?: string;
  overlayClassName?: string;
  panelClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  bodyClassName?: string;
  closeButtonClassName?: string;
  hideHeader?: boolean;
  customHeader?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title = '',
  subtitle,
  headerIcon,
  children,
  footer,
  destructive = false,
  maxWidthClass = 'sm:max-w-[560px]',
  overlayClassName = 'bg-[var(--color-primary-text)]/50 p-0 sm:p-4',
  panelClassName = 'bg-[var(--color-white)] rounded-t-[var(--radius-lg)] sm:rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-md)] max-h-[92dvh]',
  headerClassName = 'px-5 py-4 border-b border-[var(--color-border)]',
  titleClassName = 'text-[18px] font-bold text-[var(--color-primary-text)]',
  subtitleClassName = 'text-[13px] text-[var(--color-secondary-text)] mt-0.5',
  bodyClassName = 'p-5',
  closeButtonClassName = 'w-10 h-10 rounded-full flex items-center justify-center text-[var(--color-secondary-text)] hover:bg-[var(--color-muted)] cursor-pointer',
  hideHeader = false,
  customHeader,
}) => {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[var(--z-modal)] flex items-end sm:items-center justify-center ${overlayClassName}`}
      onClick={() => {
        if (!destructive) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${maxWidthClass} overflow-hidden flex flex-col ${panelClassName}`}
      >
        {/* Mobile bottom-sheet drag handle */}
        {!headerIcon && !customHeader && !hideHeader && (
          <div className="sm:hidden w-12 h-1.5 bg-[var(--color-border)] rounded-full mx-auto mt-2.5" />
        )}
        {customHeader ? (
          customHeader
        ) : hideHeader ? null : (
          <div className={`flex items-start justify-between gap-3 ${headerClassName}`}>
            <div className="flex items-start gap-3 min-w-0">
              {headerIcon && (
                <span className="w-10 h-10 rounded-xl bg-[var(--color-neon-orange)] text-[var(--color-white)] flex items-center justify-center shrink-0 shadow-sm">
                  {headerIcon}
                </span>
              )}
              <div className="min-w-0">
                <h2 id="modal-title" className={titleClassName}>
                  {title}
                </h2>
                {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق النافذة"
              className={closeButtonClassName}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
        <div className={`overflow-y-auto flex-1 ${bodyClassName}`}>{children}</div>
        {footer && (
          <div className="px-5 py-4 bg-[var(--color-muted)] border-t border-[var(--color-border)] flex items-center justify-between gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const ConfirmDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'secondary';
}> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'تأكيد الإجراء',
  cancelLabel = 'تراجع',
  variant = 'danger',
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      destructive={variant === 'danger'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className={`w-6 h-6 shrink-0 mt-0.5 ${
            variant === 'danger' ? 'text-[var(--color-red)]' : 'text-[var(--color-neon-orange)]'
          }`}
        />
        <p className="text-[16px] text-[var(--color-primary-text)]">{description}</p>
      </div>
    </Modal>
  );
};

export const ToastViewport: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed z-[var(--z-toast)] top-12 inset-x-4 sm:top-auto sm:bottom-6 sm:end-6 sm:start-auto sm:w-[380px] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((toast) => {
        const iconMap = {
          success: <CheckCircle2 className="w-5 h-5 text-[var(--color-green)] shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-[var(--color-red)] shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-[var(--color-neon-orange)] shrink-0" />,
          info: <Info className="w-5 h-5 text-[var(--color-dark-teal)] shrink-0" />,
        };
        return (
          <div
            key={toast.id}
            role={toast.type === 'error' ? 'alert' : 'status'}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-white)] border border-[var(--color-dark-teal)]/25 shadow-[var(--shadow-md)] text-[14px] font-semibold text-[var(--color-primary-text)]"
          >
            <div className="flex items-center gap-2.5">
              {iconMap[toast.type]}
              <span>{toast.message}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {toast.onUndo && (
                <button
                  type="button"
                  onClick={() => {
                    toast.onUndo?.();
                    dismissToast(toast.id);
                  }}
                  className="px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] font-bold hover:underline cursor-pointer"
                >
                  {toast.undoLabel ?? 'تراجع'}
                </button>
              )}
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="إغلاق الإشعار"
                className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--color-secondary-text)] hover:bg-[var(--color-muted)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Demo Mode Top Banner disabled per user request
export const DemoTopBanner: React.FC = () => {
  return null;
};

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, errorMessage: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-[100dvh] flex items-center justify-center p-6 bg-[var(--color-background)]">
          <div className="max-w-md w-full bg-[var(--color-white)] p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] text-center">
            <ShieldAlert className="w-12 h-12 text-[var(--color-red)] mx-auto mb-3" />
            <h1 className="text-[22px] font-bold mb-2">عذرًا، حدث خطأ غير متوقع</h1>
            <p className="text-[14px] text-[var(--color-secondary-text)] mb-5">
              يمكنك تحديث الصفحة أو استعادة البيانات الافتراضية للمتابعة.
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                window.location.href = '/';
              }}
            >
              العودة إلى الصفحة الرئيسية
            </Button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
