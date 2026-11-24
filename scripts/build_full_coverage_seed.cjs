const fs = require('fs');
const path = require('path');
const { GOVERNORATES, SPECIALTIES } = require('./generate_seed.cjs');

// Read existing DOCTOR_SPECS from build_seed_data.cjs
const buildSeedContent = fs.readFileSync(path.join(__dirname, 'build_seed_data.cjs'), 'utf8');

// Extract existing DOCTOR_SPECS
const match = buildSeedContent.match(/const DOCTOR_SPECS = (\[[\s\S]*?\n\];)/);
let existingDoctorSpecs = [];
if (match) {
  try {
    existingDoctorSpecs = eval(match[1]);
  } catch (e) {
    console.error('Failed to parse existing DOCTOR_SPECS, fallback to basic', e);
  }
}

const FIRST_NAMES_MALE = [
  'أحمد', 'محمد', 'محمود', 'حازم', 'هاني', 'شريف', 'طارق', 'عصام', 'إيهاب',
  'وائل', 'أسامة', 'تامر', 'كريم', 'خالد', 'شادي', 'مصطفى', 'علاء', 'هيثم',
  'حسام', 'باهر', 'إسلام', 'ياسر', 'مدحت', 'سامح', 'عمرو', 'مروان', 'أيمن'
];

const FIRST_NAMES_FEMALE = [
  'سارة', 'منى', 'نرمين', 'ريم', 'سمر', 'لمياء', 'نادية', 'نهال', 'مي',
  'منال', 'داليا', 'جيهان', 'رانيا', 'أميرة', 'مروة', 'نورهان', 'ياسمين', 'شيرين'
];

const LAST_NAMES = [
  'المهدي', 'القاضي', 'البحيري', 'الشربيني', 'رضوان', 'سراج', 'غنيم', 'عبد العزيز',
  'عاشور', 'يحيى', 'خيري', 'عبد النور', 'الخولي', 'حسانين', 'البدري', 'الدسوقي',
  'سليمان', 'الشامي', 'صبري', 'الصاوي', 'زكي', 'عثمان', 'فهمي', 'توفيق',
  'الجندي', 'نبيل', 'الشناوي', 'الألفي', 'منصور', 'الباز', 'شوقي', 'جمال',
  'سلطان', 'حمزة', 'شعلان', 'عفيفي', 'بركات', 'الصاغ', 'الهواري', 'صقر'
];

const specDetails = {
  'spec-1': {
    ar: 'قلب',
    en: 'Cardiology',
    title: 'استشاري أمراض القلب والقسطرة التداخلية وضغط الدم',
    baseFee: 350,
  },
  'spec-2': {
    ar: 'باطنة',
    en: 'Internal Medicine',
    title: 'استشاري الجهاز الهضمي والكبد ومناظير الجهاز الهضمي',
    baseFee: 280,
  },
  'spec-3': {
    ar: 'عظام',
    en: 'Orthopedics',
    title: 'استشاري جراحة العظام ومناظير المفاصل والكسور',
    baseFee: 320,
  },
  'spec-4': {
    ar: 'نسا وتوليد',
    en: 'Obstetrics & Gynecology',
    title: 'استشاري طب وجراحة النساء والتوليد والحقن المجهري',
    baseFee: 300,
  },
  'spec-5': {
    ar: 'مخ وأعصاب',
    en: 'Neurology',
    title: 'استشاري المخ والأعصاب والعمود الفقري والصرع والصداع',
    baseFee: 340,
  },
};

// Check coverage: governorate + specId
const coverage = new Set();
existingDoctorSpecs.forEach((d) => {
  coverage.add(`${d.gov}__${d.specId}`);
});

let nextDocIndex = existingDoctorSpecs.length + 1;
const allDoctorSpecs = [...existingDoctorSpecs];

let nameCounter = 0;

// Loop over all 27 governorates and all 5 specialties
GOVERNORATES.forEach((gov, govIdx) => {
  SPECIALTIES.forEach((spec, specIdx) => {
    const key = `${gov.nameAr}__${spec.id}`;
    if (!coverage.has(key)) {
      // Pick a city in this governorate
      const cityObj = gov.cities[(specIdx + govIdx) % gov.cities.length] || gov.cities[0];
      const district = cityObj.districts[specIdx % cityObj.districts.length] || 'وسط البلد';

      // Pick gender
      const isFemale = (govIdx + specIdx) % 3 === 0;
      const firstName = isFemale
        ? FIRST_NAMES_FEMALE[nameCounter % FIRST_NAMES_FEMALE.length]
        : FIRST_NAMES_MALE[nameCounter % FIRST_NAMES_MALE.length];
      const lastName = LAST_NAMES[(nameCounter * 3 + govIdx) % LAST_NAMES.length];
      nameCounter++;

      const docName = `د. ${firstName} ${lastName}`;
      const docId = `doc-${nextDocIndex}`;
      const clinicId = `clinic-${nextDocIndex}`;

      const phonePrefixes = ['010', '011', '012', '015'];
      const prefix = phonePrefixes[(nextDocIndex + govIdx) % phonePrefixes.length];
      const phoneNum = `${prefix}${String(10000000 + (nextDocIndex * 739) % 89999999)}`;

      const specInfo = specDetails[spec.id];
      const fee = specInfo.baseFee + ((govIdx % 4) * 20) - 20;
      const exp = 12 + ((nextDocIndex * 3) % 15);
      const rating = parseFloat((4.7 + ((nextDocIndex % 3) * 0.1)).toFixed(1));
      const reviews = 35 + ((nextDocIndex * 17) % 120);

      const daysOptions = [
        ['السبت', 'الاثنين', 'الأربعاء'],
        ['الأحد', 'الثلاثاء', 'الخميس'],
        ['السبت', 'الأحد', 'الثلاثاء', 'الأربعاء'],
        ['الاثنين', 'الأربعاء', 'الخميس'],
      ];
      const days = daysOptions[(nextDocIndex + specIdx) % daysOptions.length];

      allDoctorSpecs.push({
        id: docId,
        name: docName,
        specId: spec.id,
        title: specInfo.title,
        gov: gov.nameAr,
        city: cityObj.nameAr,
        district: district,
        clinicName: `عيادة ${docName} لـ${specInfo.ar} — ${cityObj.nameAr}`,
        address: `شارع ${district}، برج الصفوة الطبي، الدور الثاني`,
        landmark: `بالقرب من ميدان المحطة — ${cityObj.nameAr}`,
        fee: fee,
        phone: phoneNum,
        exp: exp,
        rating: rating,
        reviews: reviews,
        days: days,
        offset: 3 + (nextDocIndex % 3),
      });

      coverage.add(key);
      nextDocIndex++;
    }
  });
});

console.log(`Total doctors after full coverage: ${allDoctorSpecs.length}`);

// Generate SEED_DOCTORS
const SEED_DOCTORS = allDoctorSpecs.map((d, idx) => {
  const spec = specDetails[d.specId] || { ar: 'طب عام', en: 'General' };
  const clinicId = `clinic-${idx + 1}`;
  return {
    id: d.id,
    name: d.name,
    specialtyId: d.specId,
    specialtyAr: spec.ar,
    specialtyEn: spec.en,
    titleAr: d.title,
    qualifications: [
      `دكتوراه ${spec.ar} — كلية الطب`,
      `زمالة الجمعية الطبية المصرية في تخصص ${spec.ar}`,
      `استشاري معتمد لدى النقابة العامة للأطباء`,
    ],
    bio: `خبرة سريرية تمتد لأكثر من ${d.exp} عامًا في تقديم أفضل رعاية طبية متكاملة وفق أحدث البروتوكولات العالمية.`,
    yearsExperience: d.exp,
    rating: d.rating,
    reviewsCount: d.reviews,
    consultationFee: d.fee,
    clinicIds: [clinicId],
    status: 'approved',
    phone: d.phone,
    nextAvailableText: idx % 3 === 0 ? 'اليوم 06:30 م' : idx % 3 === 1 ? 'اليوم 07:00 م' : 'غدًا 04:00 م',
    doctorStatus: idx === 0 ? 'in_examination' : 'available',
    queueOffset: d.offset || 4,
    avgExamMinutes: 10,
    lateAction: 'fine',
    defaultLateFine: 50,
    defaultNoShowFine: 100,
    followUpDays: 14,
    followUpFee: 0,
    maxPatientsPerDay: 30,
  };
});

// Generate SEED_CLINICS
const SEED_CLINICS = allDoctorSpecs.map((d, idx) => {
  const clinicId = `clinic-${idx + 1}`;
  return {
    id: clinicId,
    doctorId: d.id,
    name: d.clinicName,
    address: d.address,
    governorate: d.gov,
    city: d.city,
    district: d.district,
    landmark: d.landmark,
    distanceKm: parseFloat((1.5 + (idx % 10) * 0.8).toFixed(1)),
    workingDays: d.days,
    startTime: '13:00',
    endTime: '22:00',
    consultationPrice: d.fee,
    followUpPrice: 0,
    dailyPatientLimit: 30,
    avgExamDurationMin: 10,
    isActive: true,
    bookingsPaused: false,
    announcedDelayMin: 0,
    closedDates: [],
    phone: d.phone,
  };
});

// Generate SEED_NURSES (assign nurses for clinics)
const NURSE_FIRST_NAMES = ['منى', 'سماح', 'إيمان', 'دعاء', 'مروة', 'فاطمة', 'أسماء', 'هبة', 'رانيا', 'ياسمين', 'شيرين', 'أميرة'];
const NURSE_LAST_NAMES = ['إبراهيم', 'عبد الفتاح', 'حسانين', 'محمود', 'صابر', 'علي', 'السيد', 'مصطفى', 'شوقي', 'غانم'];

const SEED_NURSES = allDoctorSpecs.map((d, idx) => {
  const nurseId = `nurse-${idx + 1}`;
  const clinicId = `clinic-${idx + 1}`;
  const firstName = NURSE_FIRST_NAMES[idx % NURSE_FIRST_NAMES.length];
  const lastName = NURSE_LAST_NAMES[(idx * 3) % NURSE_LAST_NAMES.length];
  return {
    id: nurseId,
    name: `${firstName} ${lastName}`,
    phone: `010${String(11000000 + (idx * 571) % 88999999)}`,
    clinicId: clinicId,
    doctorId: d.id,
    shift: idx % 2 === 0 ? 'الفترة المسائية (12:00 م – 10:00 م)' : 'الفترة الصباحية (09:00 ص – 05:00 م)',
    active: true,
  };
});

// Write clinics.ts
const clinicsTsContent = `import { Clinic, GovernorateLocation, Specialty } from '../types';

export const SEED_SPECIALTIES: Specialty[] = ${JSON.stringify(SPECIALTIES, null, 2)};

export const SEED_LOCATIONS: GovernorateLocation[] = ${JSON.stringify(GOVERNORATES, null, 2)};

export const SEED_CLINICS: Clinic[] = ${JSON.stringify(SEED_CLINICS, null, 2)};
`;
fs.writeFileSync(path.join(__dirname, '../src/data/clinics.ts'), clinicsTsContent, 'utf8');
console.log('Successfully wrote src/data/clinics.ts');

// Write doctors.ts
const doctorsTsContent = `import { Doctor } from '../types';

export const SEED_DOCTORS: Doctor[] = ${JSON.stringify(SEED_DOCTORS, null, 2)};
`;
fs.writeFileSync(path.join(__dirname, '../src/data/doctors.ts'), doctorsTsContent, 'utf8');
console.log('Successfully wrote src/data/doctors.ts');

// Write nurses.ts
const nursesTsContent = `import { Nurse } from '../types';

export const SEED_NURSES: Nurse[] = ${JSON.stringify(SEED_NURSES, null, 2)};
`;
fs.writeFileSync(path.join(__dirname, '../src/data/nurses.ts'), nursesTsContent, 'utf8');
console.log('Successfully wrote src/data/nurses.ts');

console.log('Complete database generated successfully with 100% coverage across all 27 governorates and 5 specialties!');
