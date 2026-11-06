import React, { useEffect, useId, useRef, useState } from 'react';
import {
  AlertCircle,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Star,
  Upload,
  X,
} from 'lucide-react';
import { GovernorateLocation } from '../../types';
import { formatShortDateArabic } from '../../utils/formatters';

interface BaseFieldProps {
  label: string;
  required?: boolean;
  helperText?: string;
  error?: string;
}

export const TextInput: React.FC<
  BaseFieldProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({ label, required, helperText, error, className = '', id, ...rest }) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label
        htmlFor={inputId}
        className="text-[15px] font-semibold text-[var(--color-primary-text)] flex items-center gap-1.5"
      >
        <span>{label}</span>
        {required && (
          <span className="text-[13px] font-normal text-[var(--color-secondary-text)]">
            (مطلوب)
          </span>
        )}
      </label>
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        className={`h-[48px] px-3.5 rounded-[var(--radius-sm)] bg-[var(--color-white)] border text-[16px] text-[var(--color-primary-text)] placeholder:text-[var(--color-secondary-text)] transition-colors ${
          error
            ? 'border-[var(--color-red)] bg-[var(--color-red-subtle)]/30'
            : 'border-[var(--color-border)] hover:border-[var(--color-dark-teal)]'
        } ${className}`}
        {...rest}
      />
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-red)]"
        >
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : (
        helperText && (
          <p id={helperId} className="text-[13px] text-[var(--color-secondary-text)]">
            {helperText}
          </p>
        )
      )}
    </div>
  );
};

export const PhoneInput: React.FC<
  Omit<BaseFieldProps & React.InputHTMLAttributes<HTMLInputElement>, 'type'>
> = (props) => {
  return (
    <TextInput
      type="tel"
      dir="ltr"
      inputMode="numeric"
      placeholder="01012345678"
      maxLength={11}
      className="text-start tabular-nums"
      {...props}
    />
  );
};

export const TextArea: React.FC<
  BaseFieldProps &
    React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
      maxChars?: number;
    }
> = ({ label, required, helperText, error, maxChars = 400, value, id, ...rest }) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="text-[15px] font-semibold text-[var(--color-primary-text)] flex items-center gap-1.5"
        >
          <span>{label}</span>
          {required && (
            <span className="text-[13px] font-normal text-[var(--color-secondary-text)]">
              (مطلوب)
            </span>
          )}
        </label>
        {maxChars && (
          <span className="text-[13px] tabular-nums text-[var(--color-secondary-text)]">
            {currentLength} / {maxChars}
          </span>
        )}
      </div>
      <textarea
        id={inputId}
        value={value}
        maxLength={maxChars}
        aria-invalid={Boolean(error)}
        rows={3}
        className={`p-3.5 rounded-[var(--radius-sm)] bg-[var(--color-white)] border text-[16px] text-[var(--color-primary-text)] placeholder:text-[var(--color-secondary-text)] transition-colors ${
          error
            ? 'border-[var(--color-red)]'
            : 'border-[var(--color-border)] hover:border-[var(--color-dark-teal)]'
        }`}
        {...rest}
      />
      {error ? (
        <p
          role="alert"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-red)]"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </p>
      ) : (
        helperText && (
          <p className="text-[13px] text-[var(--color-secondary-text)]">{helperText}</p>
        )
      )}
    </div>
  );
};

// Custom Accessible RTL Dropdown with Search & Keyboard/Click-outside support
export const SelectField: React.FC<
  BaseFieldProps &
    React.SelectHTMLAttributes<HTMLSelectElement> & {
      options: { value: string; label: string }[];
      onValueChange?: (value: string) => void;
    }
> = ({
  label,
  required,
  helperText,
  error,
  options,
  id,
  value,
  onChange,
  onValueChange,
  disabled,
  className = '',
  ...rest
}) => {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const [open, setOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const currentVal = value !== undefined ? String(value) : options[0]?.value ?? '';
  const selectedOption = options.find((o) => o.value === currentVal) ?? options[0];

  // Detect open direction on toggle
  const handleToggle = () => {
    if (disabled) return;
    if (!open) {
      // Calculate space below trigger before opening
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) {
        const spaceBelow = window.innerHeight - rect.bottom;
        // Estimate dropdown height: ~44px per option + 16px padding
        const estimatedHeight = Math.min(options.length * 44 + 20, 300);
        setOpenUpward(spaceBelow < estimatedHeight + 16);
      }
    }
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFilterQuery('');
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setFilterQuery('');
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const handleSelectOption = (nextVal: string) => {
    onValueChange?.(nextVal);
    if (onChange) {
      const syntheticEvent = {
        target: { value: nextVal, name: rest.name ?? '' },
        currentTarget: { value: nextVal, name: rest.name ?? '' },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }
    setOpen(false);
    setFilterQuery('');
  };

  const visibleOptions = filterQuery.trim()
    ? options.filter((o) => o.label.toLowerCase().includes(filterQuery.trim().toLowerCase()))
    : options;

  return (
    <div ref={containerRef} className={`flex flex-col gap-1.5 w-full relative ${className}`}>
      <label
        htmlFor={selectId}
        className="text-[15px] font-semibold text-[var(--color-primary-text)] flex items-center gap-1.5"
      >
        <span>{label}</span>
        {required && (
          <span className="text-[13px] font-normal text-[var(--color-secondary-text)]">
            (مطلوب)
          </span>
        )}
      </label>

      {/* Hidden native select for form semantics and screen readers */}
      <select
        id={`${selectId}-native`}
        tabIndex={-1}
        aria-hidden="true"
        value={currentVal}
        disabled={disabled}
        onChange={(e) => handleSelectOption(e.target.value)}
        className="sr-only"
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Custom Interactive Trigger Button */}
      <button
        ref={triggerRef}
        id={selectId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={Boolean(error)}
        onClick={handleToggle}
        className={`group h-[52px] w-full px-3 rounded-[14px] border-2 text-[15px] text-[var(--color-primary-text)] flex items-center justify-between gap-3 text-start transition-all duration-200 ${
          disabled
            ? 'opacity-55 bg-[var(--color-muted)] cursor-not-allowed border-[var(--color-border)]'
            : error
            ? 'border-[var(--color-red)] bg-[var(--color-red-subtle)]/25 cursor-pointer'
            : open
            ? 'border-[var(--color-dark-teal)] bg-[var(--color-white)] ring-4 ring-[var(--color-dark-teal)]/10 shadow-[0_8px_20px_-8px_rgba(11,67,76,0.35)] cursor-pointer'
            : 'border-[var(--color-border)] bg-[var(--color-white)] hover:border-[var(--color-dark-teal)]/60 hover:shadow-[0_4px_12px_-6px_rgba(11,67,76,0.25)] cursor-pointer'
        }`}
      >
        <span className="flex items-center gap-2.5 min-w-0">
          <span
            aria-hidden="true"
            className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
              open ? 'bg-[var(--color-neon-orange)]' : 'bg-[var(--color-dark-teal)]/45'
            }`}
          />
          <span className="truncate font-semibold">
            {selectedOption ? selectedOption.label : 'اختر...'}
          </span>
        </span>
        <span
          aria-hidden="true"
          className={`w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 transition-all duration-200 ${
            open
              ? 'bg-[var(--color-neon-orange)] text-[var(--color-white)]'
              : 'bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] group-hover:bg-[var(--color-teal-subtle)]'
          }`}
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </span>
      </button>

      {/* Floating Dropdown Menu — auto-direction (up / down) */}
      {open && !disabled && (
        <div
          role="listbox"
          aria-label={label}
          className={`absolute inset-x-0 z-[var(--z-dropdown)] bg-[var(--color-white)] border border-[var(--color-dark-teal)]/15 rounded-[16px] shadow-[0_20px_50px_-12px_rgba(11,67,76,0.35)] overflow-hidden ${
            openUpward
              ? 'bottom-[calc(100%+8px)] animate-dropup-in'
              : 'top-[calc(100%+8px)] animate-dropdown-in'
          }`}
        >
          {/* accent bar — top for downward, bottom for upward */}
          {!openUpward && (
            <div className="h-1 bg-gradient-to-l from-[var(--color-neon-orange)] via-[var(--color-neon-orange)]/60 to-[var(--color-dark-teal)]/40" />
          )}

          {options.length > 6 && (
            <div className="p-2.5 border-b border-[var(--color-border)] bg-gradient-to-l from-[var(--color-light-teal)] via-[var(--color-white)] to-[var(--color-white)]">
              <div className="relative">
                <Search className="w-4 h-4 text-[var(--color-secondary-text)] absolute start-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="ابحث داخل القائمة..."
                  className="w-full h-10 ps-8 pe-3 rounded-[10px] bg-[var(--color-white)] border border-[var(--color-border)] text-[13px] text-[var(--color-primary-text)] placeholder:text-[var(--color-secondary-text)] transition-colors focus:border-[var(--color-dark-teal)] focus:ring-2 focus:ring-[var(--color-dark-teal)]/10"
                />
              </div>
            </div>
          )}

          <div className="dropdown-scroll max-h-[280px] overflow-y-auto p-1.5">
            {visibleOptions.length === 0 ? (
              <div className="px-3.5 py-6 text-[13px] text-[var(--color-secondary-text)] text-center">
                لا توجد نتائج مطابقة
              </div>
            ) : (
              visibleOptions.map((opt) => {
                const isSelected = opt.value === currentVal;
                return (
                  <button
                    key={opt.value || '__empty__'}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectOption(opt.value)}
                    className={`w-full px-3 py-2.5 rounded-[10px] text-[14px] text-start flex items-center justify-between gap-2.5 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] font-bold'
                        : 'text-[var(--color-primary-text)] hover:bg-[var(--color-muted)] font-medium'
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[var(--color-dark-teal)] text-[var(--color-white)] flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* accent bar at bottom when opening upward */}
          {openUpward && (
            <div className="h-1 bg-gradient-to-l from-[var(--color-neon-orange)] via-[var(--color-neon-orange)]/60 to-[var(--color-dark-teal)]/40" />
          )}
        </div>
      )}

      {error ? (
        <p
          role="alert"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-red)]"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </p>
      ) : (
        helperText && (
          <p className="text-[13px] text-[var(--color-secondary-text)]">{helperText}</p>
        )
      )}
    </div>
  );
};

export const SearchInput: React.FC<{
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}> = ({ value, onChange, placeholder = 'ابحث باسم الطبيب، التخصص، أو المنطقة...', ariaLabel }) => {
  const id = useId();
  return (
    <div className="relative w-full">
      <label htmlFor={id} className="sr-only">
        {ariaLabel ?? placeholder}
      </label>
      <Search
        className="w-5 h-5 text-[var(--color-secondary-text)] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        aria-hidden="true"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-[48px] ps-11 pe-10 rounded-[var(--radius-sm)] bg-[var(--color-white)] border border-[var(--color-border)] hover:border-[var(--color-dark-teal)] text-[16px] text-[var(--color-primary-text)] placeholder:text-[var(--color-secondary-text)]"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="مسح البحث"
          className="absolute end-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-secondary-text)] hover:bg-[var(--color-muted)] cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export const StarRatingInput: React.FC<{
  label: string;
  value: number;
  onChange: (rating: number) => void;
}> = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[15px] font-semibold text-[var(--color-primary-text)]">{label}</span>
      <div role="radiogroup" aria-label={label} className="inline-flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const active = star <= value;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${star} نجوم`}
              onClick={() => onChange(star)}
              className="w-11 h-11 rounded-[var(--radius-sm)] flex items-center justify-center hover:bg-[var(--color-light-teal)] cursor-pointer"
            >
              <Star
                className={`w-6 h-6 transition-transform ${
                  active
                    ? 'fill-[var(--color-neon-orange)] text-[var(--color-neon-orange)]'
                    : 'text-[var(--color-border)]'
                }`}
              />
            </button>
          );
        })}
        <span className="ms-2 text-[14px] font-bold tabular-nums text-[var(--color-dark-teal)]">
          {value} / 5
        </span>
      </div>
    </div>
  );
};

// Lightweight custom Arabic DatePicker (next 14 days starting today, week layout)
export const DatePicker: React.FC<{
  selectedDate: string;
  onSelectDate: (date: string) => void;
  closedDates?: string[];
}> = ({ selectedDate, onSelectDate, closedDates = [] }) => {
  const baseDate = new Date('2026-11-05T12:00:00');
  const [pageOffset, setPageOffset] = useState(0);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + pageOffset * 7 + i);
    const iso = d.toISOString().slice(0, 10);
    const weekday = new Intl.DateTimeFormat('ar-EG', { weekday: 'short' }).format(d);
    const dayNum = d.getDate();
    const monthName = new Intl.DateTimeFormat('ar-EG', { month: 'short' }).format(d);
    const isFriday = d.getDay() === 5;
    const isClosed = isFriday || closedDates.includes(iso);
    const isToday = iso === '2026-11-05';
    return { iso, weekday, dayNum, monthName, isClosed, isToday };
  });

  return (
    <div className="bg-[var(--color-white)] rounded-[var(--radius-md)] border border-[var(--color-border)] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 font-bold text-[var(--color-primary-text)]">
          <CalendarIcon className="w-5 h-5 text-[var(--color-dark-teal)]" />
          <span>اختر تاريخ الموعد</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={pageOffset === 0}
            onClick={() => setPageOffset((p) => Math.max(0, p - 1))}
            aria-label="الأسبوع السابق"
            className="w-9 h-9 rounded-[var(--radius-sm)] border border-[var(--color-border)] flex items-center justify-center disabled:opacity-40 hover:bg-[var(--color-light-teal)] cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={pageOffset >= 3}
            onClick={() => setPageOffset((p) => Math.min(3, p + 1))}
            aria-label="الأسبوع التالي"
            className="w-9 h-9 rounded-[var(--radius-sm)] border border-[var(--color-border)] flex items-center justify-center disabled:opacity-40 hover:bg-[var(--color-light-teal)] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2" role="listbox" aria-label="الأيام المتاحة">
        {days.map((day) => {
          const isSelected = day.iso === selectedDate;
          return (
            <button
              key={day.iso}
              type="button"
              role="option"
              aria-selected={isSelected}
              aria-disabled={day.isClosed}
              disabled={day.isClosed}
              onClick={() => onSelectDate(day.iso)}
              className={`relative flex flex-col items-center justify-center p-3 min-h-[78px] rounded-[var(--radius-md)] border transition-colors cursor-pointer ${
                day.isClosed
                  ? 'bg-[var(--color-muted)] text-[var(--color-secondary-text)] border-[var(--color-border)] opacity-55 cursor-not-allowed line-through'
                  : isSelected
                  ? 'bg-[var(--color-dark-teal)] text-[var(--color-white)] border-[var(--color-dark-teal)] font-bold'
                  : 'bg-[var(--color-white)] text-[var(--color-primary-text)] border-[var(--color-border)] hover:border-[var(--color-dark-teal)] hover:bg-[var(--color-light-teal)]'
              }`}
            >
              <span className="text-[13px]">{day.weekday}</span>
              <span className="text-[18px] font-bold tabular-nums my-0.5">{day.dayNum}</span>
              <span className="text-[12px] opacity-85">
                {day.isToday ? 'اليوم' : day.monthName}
              </span>
              {!day.isClosed && !isSelected && (
                <span
                  aria-hidden="true"
                  className="w-1.5 h-1.5 rounded-full bg-[var(--color-neon-orange)] mt-1"
                />
              )}
            </button>
          );
        })}
      </div>
      <p className="text-[13px] text-[var(--color-secondary-text)] mt-3">
        التاريخ المحدد: <strong className="text-[var(--color-primary-text)]">{formatShortDateArabic(selectedDate)}</strong>
      </p>
    </div>
  );
};

// TimeSlotPicker grouped by صباحًا and مساءً
export const TimeSlotPicker: React.FC<{
  selectedSlot: string;
  onSelectSlot: (slot: string) => void;
}> = ({ selectedSlot, onSelectSlot }) => {
  const morningSlots = [
    { label: '11:00 ص', available: true },
    { label: '11:30 ص', available: true },
    { label: '12:00 م', available: false },
    { label: '12:30 م', available: true },
  ];
  const eveningSlots = [
    { label: '05:00 م', available: false },
    { label: '05:30 م', available: true },
    { label: '06:00 م', available: true },
    { label: '06:15 م', available: true },
    { label: '06:30 م', available: true },
    { label: '07:00 م', available: true },
    { label: '07:30 م', available: true },
    { label: '08:00 م', available: false },
  ];

  const renderGroup = (title: string, slots: { label: string; available: boolean }[]) => (
    <div className="mb-4 last:mb-0">
      <h4 className="text-[14px] font-bold text-[var(--color-secondary-text)] mb-2">{title}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {slots.map((slot) => {
          const isSelected = selectedSlot === slot.label;
          return (
            <button
              key={slot.label}
              type="button"
              disabled={!slot.available}
              aria-disabled={!slot.available}
              aria-pressed={isSelected}
              onClick={() => onSelectSlot(slot.label)}
              className={`min-h-[44px] px-3 py-2 rounded-[var(--radius-sm)] border text-[14px] tabular-nums font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                !slot.available
                  ? 'bg-[var(--color-muted)] text-[var(--color-secondary-text)] border-[var(--color-border)] line-through opacity-60 cursor-not-allowed'
                  : isSelected
                  ? 'bg-[var(--color-dark-teal)] text-[var(--color-white)] border-[var(--color-dark-teal)]'
                  : 'bg-[var(--color-white)] text-[var(--color-primary-text)] border-[var(--color-border)] hover:border-[var(--color-dark-teal)] hover:bg-[var(--color-light-teal)]'
              }`}
            >
              {isSelected && <Check className="w-4 h-4 shrink-0" />}
              <span>{slot.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-[var(--color-white)] rounded-[var(--radius-md)] border border-[var(--color-border)] p-4">
      {renderGroup('الفترة الصباحية والظهيرة (صباحًا)', morningSlots)}
      {renderGroup('الفترة المسائية (مساءً)', eveningSlots)}
    </div>
  );
};

// Cascading Governorate -> City selector
export const LocationCascadeSelect: React.FC<{
  locations: GovernorateLocation[];
  governorate: string;
  city: string;
  onChangeGovernorate: (gov: string) => void;
  onChangeCity: (city: string) => void;
  allowAll?: boolean;
  stacked?: boolean;
}> = ({
  locations,
  governorate,
  city,
  onChangeGovernorate,
  onChangeCity,
  allowAll = true,
  stacked = false,
}) => {
  const selectedGovObj = locations.find((l) => l.nameAr === governorate);
  const cities = selectedGovObj ? selectedGovObj.cities : [];

  return (
    <div
      className={`grid grid-cols-1 gap-3 w-full ${
        stacked ? '' : 'sm:grid-cols-2'
      }`}
    >
      <SelectField
        label="المحافظة"
        value={governorate}
        onChange={(e) => {
          const nextGov = e.target.value;
          onChangeGovernorate(nextGov);
          if (city) {
            onChangeCity('');
          }
        }}
        options={[
          ...(allowAll ? [{ value: '', label: 'كل المحافظات' }] : []),
          ...locations.map((loc) => ({ value: loc.nameAr, label: loc.nameAr })),
        ]}
      />
      <SelectField
        label="المدينة / المنطقة"
        value={city}
        disabled={!governorate}
        onChange={(e) => onChangeCity(e.target.value)}
        options={[
          { value: '', label: governorate ? 'كل المدن' : 'اختر المحافظة أولًا' },
          ...cities.map((c) => ({ value: c.nameAr, label: c.nameAr })),
        ]}
      />
    </div>
  );
};

// Simulated FileDropzone (stores metadata only, never real files)
export const FileDropzone: React.FC<{
  onFileMetadataSelected: (meta: { fileName: string; fileSizeKb: number; fileType: string }) => void;
}> = ({ onFileMetadataSelected }) => {
  const inputId = useId();
  return (
    <div className="border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-dark-teal)] rounded-[var(--radius-md)] p-5 text-center bg-[var(--color-muted)]/50 transition-colors">
      <Upload className="w-8 h-8 text-[var(--color-dark-teal)] mx-auto mb-2" />
      <label
        htmlFor={inputId}
        className="block text-[15px] font-semibold text-[var(--color-dark-teal)] cursor-pointer hover:underline"
      >
        اضغط لاختيار ملف تحاليل أو أشعة (محاكاة تجريبية)
      </label>
      <p className="text-[13px] text-[var(--color-secondary-text)] mt-1">
        يتم حفظ اسم الملف وحجمه فقط داخل المتصفح لأغراض العرض التجريبي.
      </p>
      <input
        id={inputId}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onFileMetadataSelected({
              fileName: file.name,
              fileSizeKb: Math.max(12, Math.round(file.size / 1024)),
              fileType: file.type || 'application/pdf',
            });
            e.target.value = '';
          }
        }}
      />
    </div>
  );
};
