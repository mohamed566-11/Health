/**
 * Centralized formatting utilities for Maw3edy (موعدي)
 * Uses Western digits (0-9) by default for phone numbers, booking numbers, times, and prices.
 */

export function formatNumber(value: number, useArabicIndic = false): string {
  return new Intl.NumberFormat(useArabicIndic ? 'ar-EG-u-nu-arab' : 'ar-EG-u-nu-latn').format(value);
}

export function formatCurrencyEGP(amount: number): string {
  const formatted = new Intl.NumberFormat('ar-EG-u-nu-latn', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted} ج.م`;
}

export function formatDateArabic(dateStrOrObj: string | Date): string {
  const date = typeof dateStrOrObj === 'string' ? new Date(dateStrOrObj) : dateStrOrObj;
  if (Number.isNaN(date.getTime())) return String(dateStrOrObj);
  return new Intl.DateTimeFormat('ar-EG-u-nu-latn-ca-gregory', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatShortDateArabic(dateStrOrObj: string | Date): string {
  const date = typeof dateStrOrObj === 'string' ? new Date(dateStrOrObj) : dateStrOrObj;
  if (Number.isNaN(date.getTime())) return String(dateStrOrObj);
  return new Intl.DateTimeFormat('ar-EG-u-nu-latn-ca-gregory', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatTime12hArabic(time24: string): string {
  const parts = time24.split(':');
  if (parts.length < 2) return time24;
  const hour24 = parseInt(parts[0], 10);
  const minute = parts[1];
  if (Number.isNaN(hour24)) return time24;
  const period = hour24 >= 12 ? 'م' : 'ص';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${minute} ${period}`;
}

export function formatRelativeTimeArabic(isoString: string, nowMs = Date.now()): string {
  const targetMs = new Date(isoString).getTime();
  if (Number.isNaN(targetMs)) return 'الآن';
  const diffSec = Math.round((targetMs - nowMs) / 1000);
  const absSec = Math.abs(diffSec);

  if (absSec < 45) return 'منذ لحظات';

  const rtf = new Intl.RelativeTimeFormat('ar-EG-u-nu-latn', { numeric: 'always' });
  const diffMin = Math.round(diffSec / 60);
  if (Math.abs(diffMin) < 60) {
    return rtf.format(diffMin, 'minute');
  }
  const diffHours = Math.round(diffMin / 60);
  if (Math.abs(diffHours) < 24) {
    return rtf.format(diffHours, 'hour');
  }
  const diffDays = Math.round(diffHours / 24);
  return rtf.format(diffDays, 'day');
}

export interface ArabicPluralForms {
  zero: string;
  one: string;
  two: string;
  few: string;   // 3-10
  many: string;  // 11-99
  other: string; // 100+
}

const pluralRulesAr = new Intl.PluralRules('ar-EG');

export function pluralizeArabic(count: number, forms: ArabicPluralForms): string {
  if (count === 0) return forms.zero;
  if (count === 1) return forms.one;
  if (count === 2) return forms.two;
  const rule = pluralRulesAr.select(count);
  const numStr = formatNumber(count);
  switch (rule) {
    case 'few':
      return `${numStr} ${forms.few}`;
    case 'many':
      return `${numStr} ${forms.many}`;
    default:
      return `${numStr} ${forms.other}`;
  }
}

export function formatPatientsCount(count: number): string {
  return pluralizeArabic(count, {
    zero: 'لا يوجد مرضى',
    one: 'مريض واحد',
    two: 'مريضان',
    few: 'مرضى',
    many: 'مريضًا',
    other: 'مريض',
  });
}

export function formatMinutesCount(minutes: number): string {
  return pluralizeArabic(minutes, {
    zero: 'أقل من دقيقة',
    one: 'دقيقة واحدة',
    two: 'دقيقتان',
    few: 'دقائق',
    many: 'دقيقة',
    other: 'دقيقة',
  });
}

export function formatAppointmentsCount(count: number): string {
  return pluralizeArabic(count, {
    zero: 'لا توجد حجوزات',
    one: 'حجز واحد',
    two: 'حجزان',
    few: 'حجوزات',
    many: 'حجزًا',
    other: 'حجز',
  });
}

export function formatDoctorsCount(count: number): string {
  return pluralizeArabic(count, {
    zero: 'لا يوجد أطباء',
    one: 'طبيب واحد',
    two: 'طبيبان',
    few: 'أطباء',
    many: 'طبيبًا',
    other: 'طبيب',
  });
}

/**
 * Normalizes Arabic text for search (ignores hamza variations, ta-marbuta, alef maqsura, and diacritics)
 * so typing "اسكندرية" matches "الإسكندرية".
 */
export function normalizeArabicText(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '') // strip harakat / diacritics
    .replace(/[أإآٱ]/g, 'ا')               // normalize alef variants
    .replace(/ة/g, 'ه')                    // normalize ta-marbuta
    .replace(/ى/g, 'ي')                    // normalize alef maqsura
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي');
}

export function matchesSearch(haystack: string, query: string): boolean {
  if (!query.trim()) return true;
  return normalizeArabicText(haystack).includes(normalizeArabicText(query));
}

export function getInitials(name: string): string {
  const cleaned = name
    .replace(/^د\.\s*/, '')
    .replace(/^أ\.د\.\s*/, '')
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'م';
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0]} ${parts[parts.length - 1][0]}`;
}

export function isClinicOpenNow(startTime: string, endTime: string, isActive = true): boolean {
  if (!isActive) return false;
  const [startH] = startTime.split(':').map(Number);
  const [endH] = endTime.split(':').map(Number);
  if (Number.isNaN(startH) || Number.isNaN(endH)) return true;
  // In demo mode, default to open during clinic hours or standard day window
  return endH >= startH;
}
