const arDictionary = {
  appName: 'موعدي',
  appNameEn: 'Maw3edy',
  demoBannerText: 'وضع تجريبي: كل البيانات وهمية ومحفوظة في متصفحك فقط',
  resetDemoData: 'إعادة ضبط البيانات',
  skipToContent: 'تخطي إلى المحتوى الرئيسي',
  requiredLabel: '(مطلوب)',
  approximateLabel: 'تقريبي',
  simulatedPrescriptionBanner: 'روشتة تجريبية — غير صالحة طبيًا ولا يُصرف بها دواء',
  privateNotesBadge: 'ملاحظات سرية — لا يراها غيرك',
  roles: {
    patient: 'مريض',
    doctor: 'طبيب',
    nurse: 'ممرضة / استقبال',
    admin: 'مدير النظام',
  },
  statuses: {
    booked: 'مؤكد بالحجز',
    waiting: 'في الانتظار',
    arrived: 'حضر للعيادة',
    in_examination: 'داخل الكشف',
    completed: 'تم الكشف',
    no_show: 'لم يحضر',
    cancelled: 'ملغي',
  },
} as const;

export type TranslationKey = keyof typeof arDictionary;

export function useTranslation() {
  return {
    t: arDictionary,
    dir: 'rtl' as const,
    lang: 'ar' as const,
  };
}
