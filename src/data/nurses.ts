import { Nurse } from '../types';

export const SEED_NURSES: Nurse[] = [
  {
    id: 'nurse-1',
    name: 'منى إبراهيم',
    phone: '01011223344',
    clinicId: 'clinic-1',
    doctorId: 'doc-1',
    shift: 'الفترة المسائية (12:00 م – 10:00 م)',
    active: true,
  },
  {
    id: 'nurse-2',
    name: 'سماح عبد الفتاح',
    phone: '01122334455',
    clinicId: 'clinic-2',
    doctorId: 'doc-1',
    shift: 'الفترة المسائية (05:00 م – 10:00 م)',
    active: true,
  },
  {
    id: 'nurse-3',
    name: 'إيمان ربيع حسانين',
    phone: '01233445566',
    clinicId: 'clinic-3',
    doctorId: 'doc-2',
    shift: 'الفترة النهارية والمسائية (01:00 م – 09:00 م)',
    active: true,
  },
  {
    id: 'nurse-4',
    name: 'دعاء سيد محمود',
    phone: '01544556677',
    clinicId: 'clinic-5',
    doctorId: 'doc-4',
    shift: 'الفترة الصباحية والمسائية (11:00 ص – 08:00 م)',
    active: true,
  },
];
