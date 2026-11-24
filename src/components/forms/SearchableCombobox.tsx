import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { matchesSearch } from '../../utils/formatters';

export interface ComboboxOption {
  id: string;
  label: string;
  badge?: string;
  subtext?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface SearchableComboboxProps {
  label: string;
  placeholder: string;
  searchPlaceholder?: string;
  value: string;
  options: ComboboxOption[];
  onChange: (selectedId: string) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
  id?: string;
}

export const SearchableCombobox: React.FC<SearchableComboboxProps> = ({
  label,
  placeholder,
  searchPlaceholder = 'ابحث بالاسم...',
  value,
  options,
  onChange,
  disabled = false,
  icon,
  className = '',
  id: externalId,
}) => {
  const generatedId = useId();
  const componentId = externalId || generatedId;

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const optionsListRef = useRef<HTMLDivElement>(null);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.id === value),
    [options, value]
  );

  // Filter options based on normalized Arabic text search
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    return options.filter((opt) =>
      matchesSearch(opt.label, searchQuery) ||
      (opt.subtext && matchesSearch(opt.subtext, searchQuery))
    );
  }, [options, searchQuery]);

  // Reset highlight index when filtered list changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredOptions]);

  // Handle outside clicks to close desktop popover
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Mobile body scroll lock when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      // Focus the input shortly after opening
      const timer = setTimeout(() => {
        if (window.innerWidth < 768) {
          mobileInputRef.current?.focus();
        } else {
          searchInputRef.current?.focus();
        }
      }, 60);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleSelect = (optionId: string, isOptionDisabled?: boolean) => {
    if (isOptionDisabled) return;
    onChange(optionId);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const current = filteredOptions[highlightedIndex];
      if (current && !current.disabled) {
        handleSelect(current.id, current.disabled);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full text-start ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Label */}
      {label && (
        <label
          htmlFor={`${componentId}-btn`}
          className="block text-[13.5px] font-bold text-[var(--color-primary-text)] mb-1.5"
        >
          {label}
        </label>
      )}

      {/* Main Trigger Button */}
      <button
        id={`${componentId}-btn`}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-[var(--radius-md)] border text-start transition-all cursor-pointer min-h-[44px] ${
          disabled
            ? 'bg-[var(--color-muted)] text-[var(--color-secondary-text)]/60 border-[var(--color-border)] cursor-not-allowed opacity-75'
            : isOpen
            ? 'bg-[var(--color-white)] border-[var(--color-dark-teal)] ring-2 ring-[var(--color-dark-teal)]/20 shadow-sm'
            : 'bg-[var(--color-white)] border-[var(--color-border)] hover:border-[var(--color-dark-teal)] shadow-2xs'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {(selectedOption?.icon || icon) && (
            <span className="text-[var(--color-dark-teal)] shrink-0">{selectedOption?.icon || icon}</span>
          )}
          <div className="flex items-center gap-2 truncate">
            {selectedOption ? (
              <>
                <span className="font-bold text-[15px] text-[var(--color-dark-teal)] truncate">
                  {selectedOption.label}
                </span>
                {selectedOption.badge && (
                  <span className="text-[11.5px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] shrink-0">
                    {selectedOption.badge}
                  </span>
                )}
              </>
            ) : (
              <span className="text-[14px] text-[var(--color-secondary-text)] font-normal">
                {placeholder}
              </span>
            )}
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-[var(--color-secondary-text)] shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[var(--color-dark-teal)]' : ''
          }`}
        />
      </button>

      {/* ======================================================== */}
      {/* DESKTOP POPOVER (>= 768px)                                */}
      {/* ======================================================== */}
      {isOpen && (
        <div className="hidden md:block absolute top-[calc(100%+6px)] inset-x-0 z-[var(--z-dropdown)] bg-[var(--color-white)] border border-[var(--color-border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] overflow-hidden animate-dropdown-in">
          {/* Popover Search Bar */}
          <div className="p-2 border-b border-[var(--color-border)] bg-[var(--color-background)]">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[var(--color-secondary-text)] absolute inset-inline-start-2.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full ps-8 pe-7 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-white)] text-[13.5px] text-[var(--color-primary-text)] focus:border-[var(--color-dark-teal)] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-inline-end-2 p-0.5 text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div
            ref={optionsListRef}
            role="listbox"
            className="max-h-[260px] overflow-y-auto dropdown-scroll p-1 space-y-0.5"
          >
            {filteredOptions.length === 0 ? (
              <div className="py-6 px-4 text-center text-[13px] text-[var(--color-secondary-text)]">
                لا توجد نتائج تطابق بحثك
              </div>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = opt.id === value;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    onClick={() => handleSelect(opt.id, opt.disabled)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-[var(--radius-sm)] text-start text-[14px] transition-colors cursor-pointer ${
                      opt.disabled
                        ? 'opacity-50 cursor-not-allowed bg-transparent text-[var(--color-secondary-text)]'
                        : isSelected
                        ? 'bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] font-bold'
                        : isHighlighted
                        ? 'bg-[var(--color-muted)] text-[var(--color-primary-text)]'
                        : 'text-[var(--color-primary-text)] hover:bg-[var(--color-muted)]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                      {isSelected ? (
                        <Check className="w-4 h-4 text-[var(--color-neon-orange)] shrink-0" />
                      ) : (
                        <span className="w-4 shrink-0" />
                      )}
                      {opt.icon && (
                        <span className="shrink-0 text-[var(--color-dark-teal)]">{opt.icon}</span>
                      )}
                      <div className="truncate">
                        <span className="truncate block font-semibold">{opt.label}</span>
                        {opt.subtext && (
                          <span className="text-[11px] text-[var(--color-secondary-text)] block truncate">
                            {opt.subtext}
                          </span>
                        )}
                      </div>
                    </div>

                    {opt.badge && (
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                          opt.disabled
                            ? 'bg-[var(--color-border)]/50 text-[var(--color-secondary-text)]'
                            : isSelected
                            ? 'bg-[var(--color-dark-teal)] text-[var(--color-white)]'
                            : 'bg-[var(--color-light-teal)] text-[var(--color-dark-teal)]'
                        }`}
                      >
                        {opt.badge}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MOBILE BOTTOM SHEET DRAWER (< 768px)                       */}
      {/* ======================================================== */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-[var(--z-drawer)] flex flex-col justify-end">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Bottom Sheet Drawer */}
          <div className="relative bg-[var(--color-white)] rounded-t-[var(--radius-lg)] border-t border-[var(--color-border)] shadow-[var(--shadow-md)] max-h-[85vh] flex flex-col z-10 animate-slide-up safe-area-bottom">
            {/* Drawer Drag Bar */}
            <div className="w-12 h-1.5 rounded-full bg-[var(--color-border)] mx-auto mt-3 shrink-0" />

            {/* Drawer Header */}
            <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <div>
                <h3 className="text-[17px] font-extrabold text-[var(--color-dark-teal)]">
                  {label || placeholder}
                </h3>
                <p className="text-[12px] text-[var(--color-secondary-text)]">
                  اختر من القائمة أدناه أو ابحث بالاسم
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-[var(--color-muted)] flex items-center justify-center text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Search Input (Must be 16px to prevent iOS auto-zoom) */}
            <div className="p-3 bg-[var(--color-background)] border-b border-[var(--color-border)]">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-[var(--color-secondary-text)] absolute inset-inline-start-3 pointer-events-none" />
                <input
                  ref={mobileInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ fontSize: '16px' }}
                  className="w-full ps-10 pe-9 py-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-white)] text-[16px] text-[var(--color-primary-text)] focus:border-[var(--color-dark-teal)] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-inline-end-2.5 p-1 text-[var(--color-secondary-text)] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Drawer Options List (touch targets >= 48px) */}
            <div className="overflow-y-auto p-2 space-y-1.5 flex-1 divide-y divide-[var(--color-border)]/40">
              {filteredOptions.length === 0 ? (
                <div className="py-12 text-center text-[14px] text-[var(--color-secondary-text)] space-y-2">
                  <p className="font-bold">لا توجد نتائج تطابق بحثك</p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-[13px] text-[var(--color-neon-orange)] font-bold underline"
                  >
                    مسح البحث وعرض كل الخيارات
                  </button>
                </div>
              ) : (
                filteredOptions.map((opt) => {
                  const isSelected = opt.id === value;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={opt.disabled}
                      onClick={() => handleSelect(opt.id, opt.disabled)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-[var(--radius-md)] text-start min-h-[48px] transition-colors cursor-pointer ${
                        opt.disabled
                          ? 'opacity-40 cursor-not-allowed bg-transparent'
                          : isSelected
                          ? 'bg-[var(--color-light-teal)] border border-[var(--color-dark-teal)]/30'
                          : 'active:bg-[var(--color-muted)]'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? 'border-[var(--color-neon-orange)] bg-[var(--color-neon-orange)] text-white'
                              : 'border-[var(--color-border)]'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>

                        {opt.icon && (
                          <span className="shrink-0 text-[var(--color-dark-teal)]">{opt.icon}</span>
                        )}

                        <div className="min-w-0 flex-1">
                          <span
                            className={`block text-[15.5px] truncate ${
                              isSelected
                                ? 'font-bold text-[var(--color-dark-teal)]'
                                : 'font-semibold text-[var(--color-primary-text)]'
                            }`}
                          >
                            {opt.label}
                          </span>
                          {opt.subtext && (
                            <span className="block text-[12px] text-[var(--color-secondary-text)] truncate mt-0.5">
                              {opt.subtext}
                            </span>
                          )}
                        </div>
                      </div>

                      {opt.badge && (
                        <span
                          className={`text-[12px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                            opt.disabled
                              ? 'bg-[var(--color-muted)] text-[var(--color-secondary-text)]/70'
                              : isSelected
                              ? 'bg-[var(--color-dark-teal)] text-[var(--color-white)]'
                              : 'bg-[var(--color-light-teal)] text-[var(--color-dark-teal)]'
                          }`}
                        >
                          {opt.badge}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
