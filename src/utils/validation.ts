export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateEgyptianPhone(phone: string): ValidationResult {
  const cleaned = phone.replace(/\s+/g, '').trim();
  if (!cleaned) {
    return { valid: false, error: 'رقم الهاتف مطلوب.' };
  }
  const regex = /^01[0125][0-9]{8}$/;
  if (!regex.test(cleaned)) {
    return {
      valid: false,
      error: 'يرجى إدخال رقم موبايل مصري صحيح مكون من 11 رقمًا يبدأ بـ 010 أو 011 أو 012 أو 015.',
    };
  }
  return { valid: true };
}

export function validateFullName(name: string): ValidationResult {
  const trimmed = name.trim();
  if (!trimmed) {
    return { valid: false, error: 'الاسم الكامل مطلوب.' };
  }
  if (trimmed.length < 4 || trimmed.split(/\s+/).length < 2) {
    return { valid: false, error: 'يرجى كتابة الاسم ثنائيًا على الأقل.' };
  }
  return { valid: true };
}

export function validateRequired(value: string, fieldLabel: string): ValidationResult {
  if (!value || !value.trim()) {
    return { valid: false, error: `حقل ${fieldLabel} مطلوب.` };
  }
  return { valid: true };
}

export function validatePositiveNumber(value: number | string, fieldLabel: string): ValidationResult {
  const num = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(num) || num <= 0) {
    return { valid: false, error: `يرجى إدخال قيمة صحيحة أكبر من صفر في ${fieldLabel}.` };
  }
  return { valid: true };
}
