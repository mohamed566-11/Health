import { Clinic, GovernorateLocation, Specialty } from '../types';

export const SEED_SPECIALTIES: Specialty[] = [
  {
    "id": "spec-1",
    "nameAr": "قلب",
    "nameEn": "Cardiology",
    "description": "تشخيص وعلاج أمراض القلب والشرايين وضغط الدم المرتفع والقسطرة القلبية.",
    "iconName": "HeartPulse",
    "active": true
  },
  {
    "id": "spec-2",
    "nameAr": "باطنة",
    "nameEn": "Internal Medicine",
    "description": "متابعة الأمراض المزمنة والسكري والغدد الصماء وأمراض الجهاز الهضمي والكبد.",
    "iconName": "Stethoscope",
    "active": true
  },
  {
    "id": "spec-3",
    "nameAr": "عظام",
    "nameEn": "Orthopedics",
    "description": "علاج آلام المفاصل والعمود الفقري والكسور وإصابات الملاعب ومناظير الركبة.",
    "iconName": "Bone",
    "active": true
  },
  {
    "id": "spec-4",
    "nameAr": "نسا وتوليد",
    "nameEn": "Obstetrics & Gynecology",
    "description": "متابعة الحمل والولادة الطبيعية والقيصرية وعلاج تأخر الإنجاب والموجات الصوتية.",
    "iconName": "Baby",
    "active": true
  },
  {
    "id": "spec-5",
    "nameAr": "مخ وأعصاب",
    "nameEn": "Neurology",
    "description": "تشخيص وعلاج الصداع النصفي، التهاب الأعصاب، الجلطات الدماغية، واضطرابات النوم.",
    "iconName": "Brain",
    "active": true
  }
];

export const SEED_LOCATIONS: GovernorateLocation[] = [
  {
    "id": "gov-cairo",
    "nameAr": "القاهرة",
    "nameEn": "Cairo",
    "cities": [
      {
        "id": "city-nasr",
        "nameAr": "مدينة نصر",
        "districts": [
          "مكرم عبيد",
          "عباس العقاد",
          "الحي السابع",
          "طريق النصر"
        ]
      },
      {
        "id": "city-heliopolis",
        "nameAr": "مصر الجديدة",
        "districts": [
          "الكوربة",
          "روكسي",
          "ميدان الحجاز",
          "أرض الجولف"
        ]
      },
      {
        "id": "city-maadi",
        "nameAr": "المعادي",
        "districts": [
          "المعادي الجديدة",
          "زهراء المعادي",
          "دجلة",
          "شارع 9"
        ]
      },
      {
        "id": "city-tagamoa",
        "nameAr": "التجمع الخامس",
        "districts": [
          "شارع التسعين",
          "النرجس",
          "الياسمين",
          "المستثمرين"
        ]
      },
      {
        "id": "city-shubra",
        "nameAr": "شبرا",
        "districts": [
          "شبرا مصر",
          "روض الفرج",
          "الخلفاوي",
          "شبرا الخيمة"
        ]
      },
      {
        "id": "city-downtown",
        "nameAr": "وسط البلد",
        "districts": [
          "طلعت حرب",
          "التحرير",
          "باب اللوق",
          "عابدين"
        ]
      },
      {
        "id": "city-mokattam",
        "nameAr": "المقطم",
        "districts": [
          "الهضبة العليا",
          "الهضبة الوسطى",
          "شارع 9"
        ]
      },
      {
        "id": "city-helwan",
        "nameAr": "حلوان",
        "districts": [
          "المشروع الأمريكي",
          "حدائق حلوان",
          "المعصرة"
        ]
      },
      {
        "id": "city-zaytoun",
        "nameAr": "الزيتون",
        "districts": [
          "سراي القبة",
          "حلمية الزيتون",
          "ابن سندر"
        ]
      },
      {
        "id": "city-rehab",
        "nameAr": "الرحاب والشروق",
        "districts": [
          "السوق الشرقي",
          "بوابة 6",
          "الحي الأول"
        ]
      }
    ]
  },
  {
    "id": "gov-giza",
    "nameAr": "الجيزة",
    "nameEn": "Giza",
    "cities": [
      {
        "id": "city-dokki",
        "nameAr": "الدقي",
        "districts": [
          "ميدان الدقي",
          "شارع التحرير",
          "شارع مصدق",
          "ميدان المساحة"
        ]
      },
      {
        "id": "city-mohandessin",
        "nameAr": "المهندسين",
        "districts": [
          "جامعة الدول العربية",
          "ميدان لبنان",
          "شارع البطل أحمد عبد العزيز",
          "شارع شهاب"
        ]
      },
      {
        "id": "city-october",
        "nameAr": "6 أكتوبر",
        "districts": [
          "ميدان الحصري",
          "الحي المتميز",
          "المنطقة الصناعية",
          "الحي الأول"
        ]
      },
      {
        "id": "city-zayed",
        "nameAr": "الشيخ زايد",
        "districts": [
          "الحي الأول",
          "بيفرلي هيلز",
          "زايد 2000",
          "محور 26 يوليو"
        ]
      },
      {
        "id": "city-haram",
        "nameAr": "الهرم",
        "districts": [
          "المريوطية",
          "التعاون",
          "مشعل",
          "العريش"
        ]
      },
      {
        "id": "city-faisal",
        "nameAr": "فيصل",
        "districts": [
          "العشرين",
          "حسن محمد",
          "الطالبية فيصل"
        ]
      },
      {
        "id": "city-agouza",
        "nameAr": "العجوزة",
        "districts": [
          "شارع النيل",
          "شاهين",
          "ميدان سفنكس"
        ]
      },
      {
        "id": "city-omraniya",
        "nameAr": "العمرانية",
        "districts": [
          "شارع خاتم المرسلين",
          "العمرانية الغربية"
        ]
      },
      {
        "id": "city-hawamdeya",
        "nameAr": "الحوامدية",
        "districts": [
          "شارع الجمهورية",
          "طريق مصر أسيوط"
        ]
      }
    ]
  },
  {
    "id": "gov-alex",
    "nameAr": "الإسكندرية",
    "nameEn": "Alexandria",
    "cities": [
      {
        "id": "city-smouha",
        "nameAr": "سموحة",
        "districts": [
          "فيكتور عمانويل",
          "فوزي معاذ",
          "طريق 14 مايو"
        ]
      },
      {
        "id": "city-raml",
        "nameAr": "محطة الرمل",
        "districts": [
          "سعد زغلول",
          "صفية زغلول",
          "المنشية"
        ]
      },
      {
        "id": "city-sidi-gaber",
        "nameAr": "سيدي جابر",
        "districts": [
          "المشير",
          "شارع سوريا",
          "سيدي جابر الشيخ"
        ]
      },
      {
        "id": "city-gleem",
        "nameAr": "جليم",
        "districts": [
          "طريق الجيش",
          "شارع أبو قير"
        ]
      },
      {
        "id": "city-lauran",
        "nameAr": "لوران",
        "districts": [
          "شارع الإقبال",
          "طريق الحرية"
        ]
      },
      {
        "id": "city-sidi-bishr",
        "nameAr": "سيدي بشر",
        "districts": [
          "خالد بن الوليد",
          "سيدي بشر بحري",
          "جمال عبد الناصر"
        ]
      },
      {
        "id": "city-miami",
        "nameAr": "ميامي",
        "districts": [
          "شارع إسكندر إبراهيم",
          "العصافرة",
          "طريق الكورنيش"
        ]
      },
      {
        "id": "city-ibrahimiya",
        "nameAr": "الإبراهيمية",
        "districts": [
          "شارع لاجيتيه",
          "طريق الحرية"
        ]
      },
      {
        "id": "city-kafr-abdo",
        "nameAr": "كفر عبده",
        "districts": [
          "شارع خليل خياط",
          "ميدان سان مارك"
        ]
      },
      {
        "id": "city-agami",
        "nameAr": "العجمي",
        "districts": [
          "البيطاش",
          "الهانوفيل",
          "أبو تلات"
        ]
      }
    ]
  },
  {
    "id": "gov-qalyubia",
    "nameAr": "القليوبية",
    "nameEn": "Qalyubia",
    "cities": [
      {
        "id": "city-banha",
        "nameAr": "بنها",
        "districts": [
          "الأتريب",
          "الأهرام",
          "الفلل",
          "كفر الجزار"
        ]
      },
      {
        "id": "city-shubra-el-kheima",
        "nameAr": "شبرا الخيمة",
        "districts": [
          "مسطرد",
          "بهتيم",
          "الشارع الجديد"
        ]
      },
      {
        "id": "city-toukh",
        "nameAr": "طوخ",
        "districts": [
          "وسط البلد",
          "شارع المحكمة"
        ]
      },
      {
        "id": "city-qalyub",
        "nameAr": "قليوب",
        "districts": [
          "ميدان المحطة",
          "شارع العاشر"
        ]
      },
      {
        "id": "city-khanka",
        "nameAr": "الخانكة",
        "districts": [
          "المركز",
          "أبو زعبل"
        ]
      },
      {
        "id": "city-qanater",
        "nameAr": "القناطر الخيرية",
        "districts": [
          "الكورنيش",
          "الشارع السياحي"
        ]
      }
    ]
  },
  {
    "id": "gov-sharqia",
    "nameAr": "الشرقية",
    "nameEn": "Sharqia",
    "cities": [
      {
        "id": "city-zagazig",
        "nameAr": "الزقازيق",
        "districts": [
          "القومية",
          "شارع الجلاء",
          "ميدان المنتزه",
          "حي الزهور"
        ]
      },
      {
        "id": "city-10th-ramadan",
        "nameAr": "العاشر من رمضان",
        "districts": [
          "الأردنية",
          "المجاورة الأولى",
          "المجاورة التاسعة"
        ]
      },
      {
        "id": "city-bilbeis",
        "nameAr": "بلبيس",
        "districts": [
          "شارع المحطة",
          "سعد زغلول"
        ]
      },
      {
        "id": "city-minya-el-qamh",
        "nameAr": "منيا القمح",
        "districts": [
          "شارع الجمهورية",
          "ميدان المدارس"
        ]
      },
      {
        "id": "city-faqous",
        "nameAr": "فاقوس",
        "districts": [
          "الدروس",
          "المنشية"
        ]
      },
      {
        "id": "city-abu-kebir",
        "nameAr": "أبو كبير",
        "districts": [
          "وسط المدينة",
          "شارع التحرير"
        ]
      },
      {
        "id": "city-hehya",
        "nameAr": "ههيا",
        "districts": [
          "الشارع الرئيسي",
          "المحطة"
        ]
      }
    ]
  },
  {
    "id": "gov-dakahlia",
    "nameAr": "الدقهلية",
    "nameEn": "Dakahlia",
    "cities": [
      {
        "id": "city-mansoura",
        "nameAr": "المنصورة",
        "districts": [
          "المشاية السفلية",
          "حي الجامعة",
          "شارع الجمهورية",
          "توريل"
        ]
      },
      {
        "id": "city-talkha",
        "nameAr": "طلخا",
        "districts": [
          "شارع صلاح سالم",
          "تقسيم بهاء",
          "ميدان المحطة"
        ]
      },
      {
        "id": "city-mit-ghamr",
        "nameAr": "ميت غمر",
        "districts": [
          "شارع بورسعيد",
          "الحرية"
        ]
      },
      {
        "id": "city-senbellawein",
        "nameAr": "السنبلاوين",
        "districts": [
          "شارع المعاهدة",
          "ميدان المحطة"
        ]
      },
      {
        "id": "city-dekernes",
        "nameAr": "دكرنس",
        "districts": [
          "شارع العروبة",
          "المحكمة"
        ]
      },
      {
        "id": "city-belqas",
        "nameAr": "بلقاس",
        "districts": [
          "شارع التحرير",
          "الصناعة"
        ]
      },
      {
        "id": "city-sherbin",
        "nameAr": "شربين",
        "districts": [
          "شارع الجيش",
          "ميدان الساعة"
        ]
      }
    ]
  },
  {
    "id": "gov-gharbia",
    "nameAr": "الغربية",
    "nameEn": "Gharbia",
    "cities": [
      {
        "id": "city-tanta",
        "nameAr": "طنطا",
        "districts": [
          "شارع البحر",
          "النحاس",
          "الاستاد",
          "سيجر"
        ]
      },
      {
        "id": "city-mahalla",
        "nameAr": "المحلة الكبرى",
        "districts": [
          "شكري القوتلي",
          "الشون",
          "المنشية",
          "الرجبي"
        ]
      },
      {
        "id": "city-kafr-el-zayat",
        "nameAr": "كفر الزيات",
        "districts": [
          "شارع الجيش",
          "المحطة"
        ]
      },
      {
        "id": "city-zefta",
        "nameAr": "زفتى",
        "districts": [
          "شارع الجمهورية",
          "ميدان التحرير"
        ]
      },
      {
        "id": "city-basyoun",
        "nameAr": "بسيون",
        "districts": [
          "وسط البلد",
          "المعهد الديني"
        ]
      },
      {
        "id": "city-santa",
        "nameAr": "السنطة",
        "districts": [
          "شارع بورسعيد",
          "الموقف"
        ]
      }
    ]
  },
  {
    "id": "gov-menofia",
    "nameAr": "المنوفية",
    "nameEn": "Menofia",
    "cities": [
      {
        "id": "city-shebin",
        "nameAr": "شبين الكوم",
        "districts": [
          "شارع الجلاء",
          "البر الشرقي",
          "ميدان شرف",
          "حي الجامعة"
        ]
      },
      {
        "id": "city-quesna",
        "nameAr": "قويسنا",
        "districts": [
          "شارع عبد المحسن الصباحي",
          "المنطقة الصناعية"
        ]
      },
      {
        "id": "city-menouf",
        "nameAr": "منوف",
        "districts": [
          "شارع الجيش",
          "الحصوة"
        ]
      },
      {
        "id": "city-ashmoun",
        "nameAr": "أشمون",
        "districts": [
          "شارع الروضة",
          "وسط المدينة"
        ]
      },
      {
        "id": "city-tala",
        "nameAr": "تلا",
        "districts": [
          "شارع المدارس",
          "المحطة"
        ]
      },
      {
        "id": "city-sadat",
        "nameAr": "مدينة السادات",
        "districts": [
          "المنطقة الرابعة",
          "المحور المركزي"
        ]
      }
    ]
  },
  {
    "id": "gov-beheira",
    "nameAr": "البحيرة",
    "nameEn": "Beheira",
    "cities": [
      {
        "id": "city-damanhour",
        "nameAr": "دمنهور",
        "districts": [
          "شارع عبد السلام الشاذلي",
          "ميدان الساعة",
          "الروضة"
        ]
      },
      {
        "id": "city-kafr-el-dawar",
        "nameAr": "كفر الدوار",
        "districts": [
          "المهاجرين",
          "وسط البلد",
          "الحدائق"
        ]
      },
      {
        "id": "city-itay-baroud",
        "nameAr": "إيتاي البارود",
        "districts": [
          "شارع الجمهورية",
          "المحطة"
        ]
      },
      {
        "id": "city-kom-hamada",
        "nameAr": "كوم حمادة",
        "districts": [
          "شارع التحرير",
          "المركز"
        ]
      },
      {
        "id": "city-abu-hummus",
        "nameAr": "أبو حمص",
        "districts": [
          "شارع ناصر",
          "الموقف"
        ]
      },
      {
        "id": "city-hosh-eisa",
        "nameAr": "حوش عيسى",
        "districts": [
          "الشارع الرئيسي",
          "المحكمة"
        ]
      }
    ]
  },
  {
    "id": "gov-kafr-el-sheikh",
    "nameAr": "كفر الشيخ",
    "nameEn": "Kafr El Sheikh",
    "cities": [
      {
        "id": "city-kafr-center",
        "nameAr": "كفر الشيخ",
        "districts": [
          "شارع النبوي المهندس",
          "حي الجامعة",
          "سخا"
        ]
      },
      {
        "id": "city-desouk",
        "nameAr": "دسوق",
        "districts": [
          "ميدان العارف بالله الدسوقي",
          "شارع سعد زغلول",
          "الكورنيش"
        ]
      },
      {
        "id": "city-fouh",
        "nameAr": "فوه",
        "districts": [
          "شارع الكورنيش",
          "المسجد التايه"
        ]
      },
      {
        "id": "city-metoubes",
        "nameAr": "مطوبس",
        "districts": [
          "وسط البلد",
          "طريق رشيد"
        ]
      },
      {
        "id": "city-bila",
        "nameAr": "بيلا",
        "districts": [
          "شارع الأهرام",
          "المحطة"
        ]
      },
      {
        "id": "city-sidi-salem",
        "nameAr": "سيدي سالم",
        "districts": [
          "الشارع التجاري",
          "المعهد الأزهري"
        ]
      }
    ]
  },
  {
    "id": "gov-damietta",
    "nameAr": "دمياط",
    "nameEn": "Damietta",
    "cities": [
      {
        "id": "city-damietta-center",
        "nameAr": "دمياط",
        "districts": [
          "ميدان سرور",
          "شارع الجلاء",
          "الأعصر"
        ]
      },
      {
        "id": "city-new-damietta",
        "nameAr": "دمياط الجديدة",
        "districts": [
          "المنطقة المركزية",
          "الحي الثاني",
          "شارع الكفراوي"
        ]
      },
      {
        "id": "city-ras-el-bar",
        "nameAr": "رأس البر",
        "districts": [
          "شارع النيل",
          "شارع 109",
          "اللسان"
        ]
      },
      {
        "id": "city-kafr-saad",
        "nameAr": "كفر سعد",
        "districts": [
          "شارع بورسعيد",
          "المحطة"
        ]
      },
      {
        "id": "city-faraskour",
        "nameAr": "فارسكور",
        "districts": [
          "شارع الجمهورية",
          "الموقف الجديد"
        ]
      }
    ]
  },
  {
    "id": "gov-port-said",
    "nameAr": "بورسعيد",
    "nameEn": "Port Said",
    "cities": [
      {
        "id": "city-port-sharq",
        "nameAr": "حي الشرق",
        "districts": [
          "شارع الجمهورية",
          "طرح البحر",
          "شارع محمد علي"
        ]
      },
      {
        "id": "city-port-arab",
        "nameAr": "حي العرب",
        "districts": [
          "شارع الثلاثيني",
          "سوق السمك الجديد",
          "شارع النصر"
        ]
      },
      {
        "id": "city-port-manakh",
        "nameAr": "حي المناخ",
        "districts": [
          "شارع 23 يوليو",
          "شارع الأمين"
        ]
      },
      {
        "id": "city-port-dawahe",
        "nameAr": "حي الضواحي",
        "districts": [
          "منطقة السلام",
          "شارع البترول"
        ]
      },
      {
        "id": "city-port-zohour",
        "nameAr": "حي الزهور",
        "districts": [
          "علي بن أبي طالب",
          "عمر بن الخطاب"
        ]
      },
      {
        "id": "city-port-fouad",
        "nameAr": "بورفؤاد",
        "districts": [
          "ميدان الجامع الكبير",
          "شارع التأميم",
          "الملاحات"
        ]
      }
    ]
  },
  {
    "id": "gov-ismailia",
    "nameAr": "الإسماعيلية",
    "nameEn": "Ismailia",
    "cities": [
      {
        "id": "city-ismailia-center",
        "nameAr": "الإسماعيلية",
        "districts": [
          "شارع السلطان حسين",
          "ميدان الممر",
          "حي الشيخ زايد",
          "نمرة 6"
        ]
      },
      {
        "id": "city-fayed",
        "nameAr": "فايد",
        "districts": [
          "شارع الجيش",
          "منطقة البحيرات"
        ]
      },
      {
        "id": "city-qantara-west",
        "nameAr": "القنطرة غرب",
        "districts": [
          "شارع التحرير",
          "السوق التجاري"
        ]
      },
      {
        "id": "city-qantara-east",
        "nameAr": "القنطرة شرق",
        "districts": [
          "المدينة السكنية",
          "طريق العريش"
        ]
      },
      {
        "id": "city-tell-kebir",
        "nameAr": "التل الكبير",
        "districts": [
          "شارع المعاهدة",
          "المحطة"
        ]
      }
    ]
  },
  {
    "id": "gov-suez",
    "nameAr": "السويس",
    "nameEn": "Suez",
    "cities": [
      {
        "id": "city-suez-center",
        "nameAr": "حي السويس",
        "districts": [
          "بورتوفيق",
          "شارع الجيش",
          "الكورنيش الجديد"
        ]
      },
      {
        "id": "city-arbaeen",
        "nameAr": "الأربعين",
        "districts": [
          "ميدان الأربعين",
          "شارع النيل",
          "تل القلزم"
        ]
      },
      {
        "id": "city-faisal-suez",
        "nameAr": "فيصل",
        "districts": [
          "مدينة الصباح",
          "الأمل",
          "مبارك 1"
        ]
      },
      {
        "id": "city-ataqa",
        "nameAr": "عتاقة",
        "districts": [
          "السماد",
          "المنطقة الحرة",
          "العين السخنة"
        ]
      },
      {
        "id": "city-ganayen",
        "nameAr": "الجناين",
        "districts": [
          "منطقة الشلوفة",
          "جنيفة"
        ]
      }
    ]
  },
  {
    "id": "gov-fayoum",
    "nameAr": "الفيوم",
    "nameEn": "Fayoum",
    "cities": [
      {
        "id": "city-fayoum-center",
        "nameAr": "الفيوم",
        "districts": [
          "المسلة",
          "الباجور",
          "لطف الله",
          "دلة"
        ]
      },
      {
        "id": "city-senouris",
        "nameAr": "سنورس",
        "districts": [
          "شارع الجمهورية",
          "ميدان المحطة"
        ]
      },
      {
        "id": "city-etsa",
        "nameAr": "إطسا",
        "districts": [
          "شارع النادي",
          "المركز"
        ]
      },
      {
        "id": "city-tamiya",
        "nameAr": "طامية",
        "districts": [
          "شارع 23 يوليو",
          "ميدان الساعة"
        ]
      },
      {
        "id": "city-ibshway",
        "nameAr": "إبشواي",
        "districts": [
          "شارع المدارس",
          "طريق بحيرة قارون"
        ]
      },
      {
        "id": "city-youssef-seddiq",
        "nameAr": "يوسف الصديق",
        "districts": [
          "قارون",
          "وادي الحيتان"
        ]
      }
    ]
  },
  {
    "id": "gov-beni-suef",
    "nameAr": "بني سويف",
    "nameEn": "Beni Suef",
    "cities": [
      {
        "id": "city-beni-suef-center",
        "nameAr": "بني سويف",
        "districts": [
          "عبد السلام عارف",
          "المرماح",
          "ميدان الزراعيين",
          "شرق النيل"
        ]
      },
      {
        "id": "city-wasta",
        "nameAr": "الواسطى",
        "districts": [
          "شارع سعد زغلول",
          "ميدان المحطة"
        ]
      },
      {
        "id": "city-nasser",
        "nameAr": "ناصر",
        "districts": [
          "شارع بورسعيد",
          "ميدان الشجرة"
        ]
      },
      {
        "id": "city-beba",
        "nameAr": "ببا",
        "districts": [
          "شارع التحرير",
          "الفابريقة"
        ]
      },
      {
        "id": "city-fashn",
        "nameAr": "الفشن",
        "districts": [
          "شارع الترعة",
          "المركز"
        ]
      },
      {
        "id": "city-ihnasiya",
        "nameAr": "إهناسيا",
        "districts": [
          "شارع الوحدة",
          "ميدان المحكمة"
        ]
      }
    ]
  },
  {
    "id": "gov-minya",
    "nameAr": "المنيا",
    "nameEn": "Minya",
    "cities": [
      {
        "id": "city-minya-center",
        "nameAr": "المنيا",
        "districts": [
          "طه حسين",
          "ميدان بالاس",
          "أرض سلطان",
          "كورنيش النيل"
        ]
      },
      {
        "id": "city-mallawi",
        "nameAr": "ملوي",
        "districts": [
          "شارع المجيدي",
          "ميدان المحطة",
          "سيف الغرب"
        ]
      },
      {
        "id": "city-maghagha",
        "nameAr": "مغاغة",
        "districts": [
          "شارع الجمهورية",
          "ميدان التحرير"
        ]
      },
      {
        "id": "city-beni-mazar",
        "nameAr": "بني مزار",
        "districts": [
          "شارع المحطة",
          "طريق المطار"
        ]
      },
      {
        "id": "city-samalout",
        "nameAr": "سمالوط",
        "districts": [
          "شارع الجلاء",
          "ميدان المستشفى"
        ]
      },
      {
        "id": "city-abu-qurqas",
        "nameAr": "أبو قرقاص",
        "districts": [
          "شارع النادي",
          "المركز"
        ]
      }
    ]
  },
  {
    "id": "gov-asyut",
    "nameAr": "أسيوط",
    "nameEn": "Asyut",
    "cities": [
      {
        "id": "city-asyut-center",
        "nameAr": "أسيوط",
        "districts": [
          "حي الجامعة",
          "شارع الجمهورية",
          "يسري راغب",
          "نزلة عبد اللاه"
        ]
      },
      {
        "id": "city-dairut",
        "nameAr": "ديروط",
        "districts": [
          "شارع المعاهدة",
          "ميدان المحطة"
        ]
      },
      {
        "id": "city-qoussiya",
        "nameAr": "القوصية",
        "districts": [
          "شارع الجلاء",
          "الريان"
        ]
      },
      {
        "id": "city-manfalut",
        "nameAr": "منفلوط",
        "districts": [
          "شارع البنك",
          "الميدان الرئيسي"
        ]
      },
      {
        "id": "city-abnoub",
        "nameAr": "أبنوب",
        "districts": [
          "شارع التحرير",
          "المركز"
        ]
      },
      {
        "id": "city-fateh",
        "nameAr": "الفتح",
        "districts": [
          "قرية بني مر",
          "الشارع العام"
        ]
      },
      {
        "id": "city-sedfa",
        "nameAr": "صدفا",
        "districts": [
          "شارع المحطة",
          "المجلس"
        ]
      }
    ]
  },
  {
    "id": "gov-sohag",
    "nameAr": "سوهاج",
    "nameEn": "Sohag",
    "cities": [
      {
        "id": "city-sohag-center",
        "nameAr": "سوهاج",
        "districts": [
          "شارع 15 مايو",
          "ميدان العارف",
          "شارع الجمهورية",
          "شرق النيل"
        ]
      },
      {
        "id": "city-akhmim",
        "nameAr": "أخميم",
        "districts": [
          "شارع أبو القاسم",
          "ميدان الخلوة"
        ]
      },
      {
        "id": "city-gerga",
        "nameAr": "جرجا",
        "districts": [
          "شارع الإمام الشاطبي",
          "ميدان المحطة"
        ]
      },
      {
        "id": "city-tahta",
        "nameAr": "طهطا",
        "districts": [
          "شارع صلاح سالم",
          "ميدان السوق"
        ]
      },
      {
        "id": "city-balyana",
        "nameAr": "البلينا",
        "districts": [
          "طريق أبيدوس",
          "الشارع السياحي"
        ]
      },
      {
        "id": "city-maragha",
        "nameAr": "المراغة",
        "districts": [
          "شارع المدارس",
          "المجلس"
        ]
      },
      {
        "id": "city-monshaah",
        "nameAr": "المنشأة",
        "districts": [
          "شارع البحر",
          "المحطة"
        ]
      }
    ]
  },
  {
    "id": "gov-qena",
    "nameAr": "قنا",
    "nameEn": "Qena",
    "cities": [
      {
        "id": "city-qena-center",
        "nameAr": "قنا",
        "districts": [
          "ميدان الساعة",
          "شارع 23 يوليو",
          "حي المصالح",
          "المعنا"
        ]
      },
      {
        "id": "city-naga-hammadi",
        "nameAr": "نجع حمادي",
        "districts": [
          "شارع 30 مارس",
          "مجمع الألومنيوم",
          "ميدان المحطة"
        ]
      },
      {
        "id": "city-dishna",
        "nameAr": "دشنا",
        "districts": [
          "شارع النادي",
          "المركز"
        ]
      },
      {
        "id": "city-qous",
        "nameAr": "قوص",
        "districts": [
          "شارع الجمهورية",
          "ميدان المسيد"
        ]
      },
      {
        "id": "city-farshout",
        "nameAr": "فرشوط",
        "districts": [
          "شارع بورسعيد",
          "المحطة"
        ]
      },
      {
        "id": "city-abu-tesht",
        "nameAr": "أبو تشت",
        "districts": [
          "الشارع العام",
          "ميدان الشهداء"
        ]
      }
    ]
  },
  {
    "id": "gov-luxor",
    "nameAr": "الأقصر",
    "nameEn": "Luxor",
    "cities": [
      {
        "id": "city-luxor-center",
        "nameAr": "الأقصر",
        "districts": [
          "شارع التلفزيون",
          "شارع المحطة",
          "كورنيش النيل",
          "العوامية"
        ]
      },
      {
        "id": "city-esna",
        "nameAr": "إسنا",
        "districts": [
          "شارع البحر",
          "منطقة القناطر الجديدة"
        ]
      },
      {
        "id": "city-armant",
        "nameAr": "أرمنت",
        "districts": [
          "شارع الشهيد",
          "الميدان الأوسط"
        ]
      },
      {
        "id": "city-tiba",
        "nameAr": "طيبة الجديدة",
        "districts": [
          "المدينة السكنية",
          "شارع الجامعة"
        ]
      },
      {
        "id": "city-qurna",
        "nameAr": "القرنة",
        "districts": [
          "البر الغربي",
          "طريق الملوك"
        ]
      }
    ]
  },
  {
    "id": "gov-aswan",
    "nameAr": "أسوان",
    "nameEn": "Aswan",
    "cities": [
      {
        "id": "city-aswan-center",
        "nameAr": "أسوان",
        "districts": [
          "شارع أبطال التحرير",
          "السوق السياحي",
          "كورنيش النيل",
          "شارع كسر الحجر"
        ]
      },
      {
        "id": "city-kom-ombo",
        "nameAr": "كوم أمبو",
        "districts": [
          "شارع الصاغة",
          "ميدان المحطة"
        ]
      },
      {
        "id": "city-edfu",
        "nameAr": "إدفو",
        "districts": [
          "شارع المعبد",
          "طريق الكورنيش"
        ]
      },
      {
        "id": "city-nasr-nuba",
        "nameAr": "نصر النوبة",
        "districts": [
          "ميدان الشهيد",
          "المركز الرئيسي"
        ]
      },
      {
        "id": "city-draw",
        "nameAr": "دراو",
        "districts": [
          "شارع الجمهورية",
          "سوق الجمال"
        ]
      }
    ]
  },
  {
    "id": "gov-red-sea",
    "nameAr": "البحر الأحمر",
    "nameEn": "Red Sea",
    "cities": [
      {
        "id": "city-hurghada",
        "nameAr": "الغردقة",
        "districts": [
          "الكوثر",
          "الدهار",
          "الممشى السياحي",
          "ميدان السقالة"
        ]
      },
      {
        "id": "city-safaga",
        "nameAr": "سفاجا",
        "districts": [
          "ميناء سفاجا",
          "شارع المركز"
        ]
      },
      {
        "id": "city-quseir",
        "nameAr": "القصير",
        "districts": [
          "القلعة التاريخية",
          "شارع بورسعيد"
        ]
      },
      {
        "id": "city-marsa-alam",
        "nameAr": "مرسى علم",
        "districts": [
          "المدينة",
          "بورت غالب"
        ]
      },
      {
        "id": "city-ras-ghareb",
        "nameAr": "رأس غارب",
        "districts": [
          "الشارع الأوسط",
          "منطقة البترول"
        ]
      }
    ]
  },
  {
    "id": "gov-new-valley",
    "nameAr": "الوادي الجديد",
    "nameEn": "New Valley",
    "cities": [
      {
        "id": "city-kharga",
        "nameAr": "الخارجة",
        "districts": [
          "ميدان البساتين",
          "شارع جمال عبد الناصر",
          "حي الأمل"
        ]
      },
      {
        "id": "city-dakhla",
        "nameAr": "الداخلة",
        "districts": [
          "موط",
          "القصر الإسلامية"
        ]
      },
      {
        "id": "city-farafra",
        "nameAr": "الفرافرة",
        "districts": [
          "المدينة",
          "الواحة القديمة"
        ]
      },
      {
        "id": "city-baris",
        "nameAr": "باريس",
        "districts": [
          "شارع العمدة",
          "المركز"
        ]
      }
    ]
  },
  {
    "id": "gov-matrouh",
    "nameAr": "مطروح",
    "nameEn": "Matrouh",
    "cities": [
      {
        "id": "city-marsa-matrouh",
        "nameAr": "مرسى مطروح",
        "districts": [
          "شارع إسكندرية",
          "علم الروم",
          "شارع الجلاء",
          "الفيروز"
        ]
      },
      {
        "id": "city-hammam",
        "nameAr": "الحمام",
        "districts": [
          "شارع المحطة",
          "السوق"
        ]
      },
      {
        "id": "city-dabaa",
        "nameAr": "الضبعة",
        "districts": [
          "شارع المجلس",
          "المدينة السكنية"
        ]
      },
      {
        "id": "city-alamein",
        "nameAr": "العلمين ومارينا",
        "districts": [
          "العلمين الجديدة",
          "مارينا العلمين"
        ]
      },
      {
        "id": "city-siwa",
        "nameAr": "سيوة",
        "districts": [
          "شالي القديمة",
          "ميدان الجامع"
        ]
      },
      {
        "id": "city-salloum",
        "nameAr": "السلوم",
        "districts": [
          "هضبة السلوم",
          "المعبر"
        ]
      }
    ]
  },
  {
    "id": "gov-north-sinai",
    "nameAr": "شمال سيناء",
    "nameEn": "North Sinai",
    "cities": [
      {
        "id": "city-arish",
        "nameAr": "العريش",
        "districts": [
          "شارع 23 يوليو",
          "الفواخرية",
          "ضاحية السلام",
          "ساحل البحر"
        ]
      },
      {
        "id": "city-sheikh-zuweid",
        "nameAr": "الشيخ زويد",
        "districts": [
          "الشارع العام",
          "المركز"
        ]
      },
      {
        "id": "city-bir-abd",
        "nameAr": "بئر العبد",
        "districts": [
          "شارع التحرير",
          "الميدان"
        ]
      },
      {
        "id": "city-rafah",
        "nameAr": "رفح",
        "districts": [
          "المدينة الجديدة",
          "الميدان"
        ]
      }
    ]
  },
  {
    "id": "gov-south-sinai",
    "nameAr": "جنوب سيناء",
    "nameEn": "South Sinai",
    "cities": [
      {
        "id": "city-sharm",
        "nameAr": "شرم الشيخ",
        "districts": [
          "خليج نعمة",
          "الهضبة",
          "نبق",
          "السوق القديم"
        ]
      },
      {
        "id": "city-tor-sinai",
        "nameAr": "طور سيناء",
        "districts": [
          "شارع المنشية",
          "ميدان المحافظة"
        ]
      },
      {
        "id": "city-dahab",
        "nameAr": "دهب",
        "districts": [
          "المسبط",
          "المشربة",
          "اللايت هاوس"
        ]
      },
      {
        "id": "city-nuweiba",
        "nameAr": "نويبع",
        "districts": [
          "الميناء",
          "الترابين"
        ]
      },
      {
        "id": "city-ras-sedr",
        "nameAr": "رأس سدر",
        "districts": [
          "منطقة القرى",
          "شارع السوق"
        ]
      }
    ]
  }
];

export const SEED_CLINICS: Clinic[] = [
  {
    "id": "clinic-1",
    "doctorId": "doc-1",
    "name": "عيادة دار القلب التخصصية — مدينة نصر",
    "address": "45 شارع مكرم عبيد، المنطقة السادسة، الدور الثالث",
    "governorate": "القاهرة",
    "city": "مدينة نصر",
    "district": "مكرم عبيد",
    "landmark": "أمام سيتي سنتر مكرم عبيد",
    "distanceKm": 1.5,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 350,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01001112233"
  },
  {
    "id": "clinic-2",
    "doctorId": "doc-2",
    "name": "مركز صقر التخصصي للقلب والأوعية — التجمع",
    "address": "مجمع مديكال بارك بريميير، شارع التسعين الجنوبي، عيادة 204",
    "governorate": "القاهرة",
    "city": "التجمع الخامس",
    "district": "شارع التسعين",
    "landmark": "خلف مستشفى الدفاع الجوي",
    "distanceKm": 2.3,
    "workingDays": [
      "الأحد",
      "الثلاثاء",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 450,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01005556677"
  },
  {
    "id": "clinic-3",
    "doctorId": "doc-3",
    "name": "مركز الكوربة لأمراض القلب والقسطرة",
    "address": "14 شارع بغداد، الكوربة، الدور الثاني",
    "governorate": "القاهرة",
    "city": "مصر الجديدة",
    "district": "الكوربة",
    "landmark": "بجوار كنيسة البازيليك",
    "distanceKm": 3.1,
    "workingDays": [
      "السبت",
      "الأحد",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 400,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01019998811"
  },
  {
    "id": "clinic-4",
    "doctorId": "doc-4",
    "name": "عيادة هارت لايف كير — المعادي",
    "address": "77 شارع 9، ميدان محطة المعادي، الدور الخامس",
    "governorate": "القاهرة",
    "city": "المعادي",
    "district": "شارع 9",
    "landmark": "فوق بنك مصر المعادي",
    "distanceKm": 3.9,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 380,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01023344112"
  },
  {
    "id": "clinic-5",
    "doctorId": "doc-5",
    "name": "مركز المهندسين لجراحات وقسطرة القلب",
    "address": "32 شارع جامعة الدول العربية، الدور الرابع",
    "governorate": "الجيزة",
    "city": "المهندسين",
    "district": "جامعة الدول العربية",
    "landmark": "أمام نادي الزمالك",
    "distanceKm": 4.7,
    "workingDays": [
      "السبت",
      "الثلاثاء",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 450,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01114445566"
  },
  {
    "id": "clinic-6",
    "doctorId": "doc-6",
    "name": "عيادة زايد كلينيك لأمراض القلب",
    "address": "توين تاورز، مبنى C، الدور الثالث، عيادة 308",
    "governorate": "الجيزة",
    "city": "الشيخ زايد",
    "district": "محور 26 يوليو",
    "landmark": "بجوار أركان بلازا",
    "distanceKm": 5.5,
    "workingDays": [
      "الأحد",
      "الاثنين",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 500,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01128889900"
  },
  {
    "id": "clinic-7",
    "doctorId": "doc-7",
    "name": "عيادة د. تامر المراكبي للقلب — الدقي",
    "address": "18 شارع مصدق، تقاطع شارع السودان، الدور الأول",
    "governorate": "الجيزة",
    "city": "الدقي",
    "district": "شارع مصدق",
    "landmark": "بجوار محطة مترو البحوث",
    "distanceKm": 6.3,
    "workingDays": [
      "السبت",
      "الأحد",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 350,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01149991122"
  },
  {
    "id": "clinic-8",
    "doctorId": "doc-8",
    "name": "مركز الإسكندرية الدولي للقلب — سموحة",
    "address": "ميدان فيكتور عمانويل، برج الصفوة الطبي، الدور الثالث",
    "governorate": "الإسكندرية",
    "city": "سموحة",
    "district": "فيكتور عمانويل",
    "landmark": "أمام نادي سموحة الرياضي بوابة 2",
    "distanceKm": 7.1,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 380,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01221113344"
  },
  {
    "id": "clinic-9",
    "doctorId": "doc-9",
    "name": "عيادة سان ستيفانو كير للقلب — الرمل",
    "address": "22 شارع سعد زغلول، الدور الرابع",
    "governorate": "الإسكندرية",
    "city": "محطة الرمل",
    "district": "سعد زغلول",
    "landmark": "بجوار فندق سيسل",
    "distanceKm": 7.9,
    "workingDays": [
      "الأحد",
      "الثلاثاء",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 320,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01227778899"
  },
  {
    "id": "clinic-10",
    "doctorId": "doc-10",
    "name": "مركز الدلتا لأمراض القلب والقسطرة — المنصورة",
    "address": "شارع المشاية السفلية، برج النور، الدور السادس",
    "governorate": "الدقهلية",
    "city": "المنصورة",
    "district": "المشاية السفلية",
    "landmark": "بجوار نادي جزيرة الورد",
    "distanceKm": 8.7,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 300,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01034445566"
  },
  {
    "id": "clinic-11",
    "doctorId": "doc-11",
    "name": "عيادة الصفوة للقلب والأوعية الدموية — طنطا",
    "address": "تقاطع شارع البحر مع النحاس، برج الأطباء، الدور الرابع",
    "governorate": "الغربية",
    "city": "طنطا",
    "district": "شارع البحر",
    "landmark": "أمام مبنى محافظة الغربية",
    "distanceKm": 1.5,
    "workingDays": [
      "السبت",
      "الثلاثاء",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 280,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01061112233"
  },
  {
    "id": "clinic-12",
    "doctorId": "doc-12",
    "name": "عيادة مطروح التخصصية للقلب — شارع إسكندرية",
    "address": "شارع إسكندرية التجاري، عمارة الأوقاف، الدور الثاني",
    "governorate": "مطروح",
    "city": "مرسى مطروح",
    "district": "شارع إسكندرية",
    "landmark": "بجوار البنك الأهلي المصري",
    "distanceKm": 2.3,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 250,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01090001122"
  },
  {
    "id": "clinic-13",
    "doctorId": "doc-13",
    "name": "عيادة د. سارة عبد الرحمن للباطنة — روكسي",
    "address": "12 شارع الخليفة المأمون، ميدان روكسي، الدور الثالث",
    "governorate": "القاهرة",
    "city": "مصر الجديدة",
    "district": "روكسي",
    "landmark": "أمام سينما روكسي",
    "distanceKm": 3.1,
    "workingDays": [
      "السبت",
      "الأحد",
      "الثلاثاء",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 300,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01112223344"
  },
  {
    "id": "clinic-14",
    "doctorId": "doc-14",
    "name": "مركز النيل لمناظير الجهاز الهضمي والكبد — مدينة نصر",
    "address": "88 شارع عباس العقاد، تقاطع البطراوي، الدور الخامس",
    "governorate": "القاهرة",
    "city": "مدينة نصر",
    "district": "عباس العقاد",
    "landmark": "بجوار جنينة مول",
    "distanceKm": 3.9,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 380,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01065554433"
  },
  {
    "id": "clinic-15",
    "doctorId": "doc-15",
    "name": "عيادة ديا-كير للسكر والغدد الصماء — المعادي",
    "address": "3 شارع النصر، المعادي الجديدة، الدور الثاني",
    "governorate": "القاهرة",
    "city": "المعادي",
    "district": "المعادي الجديدة",
    "landmark": "أمام القمر الصناعي",
    "distanceKm": 4.7,
    "workingDays": [
      "الأحد",
      "الثلاثاء",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 340,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01153332211"
  },
  {
    "id": "clinic-16",
    "doctorId": "doc-16",
    "name": "عيادة السلام الباطنية التخصصية — شبرا",
    "address": "150 شارع شبرا الرئيسي، محطة سانت تريزا، الدور الأول",
    "governorate": "القاهرة",
    "city": "شبرا",
    "district": "شبرا مصر",
    "landmark": "فوق صيدليات مصر",
    "distanceKm": 5.5,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الأربعاء",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 220,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01287776655"
  },
  {
    "id": "clinic-17",
    "doctorId": "doc-17",
    "name": "مركز الدقي للباطنة والكبد",
    "address": "55 شارع التحرير، ميدان الدقي، برج ساريدار، الدور السابع",
    "governorate": "الجيزة",
    "city": "الدقي",
    "district": "شارع التحرير",
    "landmark": "بجوار محطة مترو الدقي",
    "distanceKm": 6.3,
    "workingDays": [
      "السبت",
      "الثلاثاء",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 350,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01007778899"
  },
  {
    "id": "clinic-18",
    "doctorId": "doc-18",
    "name": "عيادة العافية للباطنة والمناعة — 6 أكتوبر",
    "address": "أبراج برعي بلازا، ميدان الحصري، المحور المركزي، الدور الثالث",
    "governorate": "الجيزة",
    "city": "6 أكتوبر",
    "district": "ميدان الحصري",
    "landmark": "بجوار مسجد الحصري",
    "distanceKm": 7.1,
    "workingDays": [
      "الأحد",
      "الاثنين",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 320,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01129990011"
  },
  {
    "id": "clinic-19",
    "doctorId": "doc-19",
    "name": "عيادة د. إبراهيم الدسوقي لأمراض الكلى والباطنة",
    "address": "شارع فوزي معاذ، عمارة اللوتس، الدور الثاني",
    "governorate": "الإسكندرية",
    "city": "سموحة",
    "district": "فوزي معاذ",
    "landmark": "بجوار سوبرماركت زهران",
    "distanceKm": 7.9,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 340,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01201112255"
  },
  {
    "id": "clinic-20",
    "doctorId": "doc-20",
    "name": "عيادة الشفاء للجهاز الهضمي والباطنة — سيدي بشر",
    "address": "42 شارع خالد بن الوليد، الدور الأول",
    "governorate": "الإسكندرية",
    "city": "سيدي بشر",
    "district": "خالد بن الوليد",
    "landmark": "بجوار مسجد سيدي بشر",
    "distanceKm": 8.7,
    "workingDays": [
      "السبت",
      "الأحد",
      "الثلاثاء",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 260,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01274443322"
  },
  {
    "id": "clinic-21",
    "doctorId": "doc-21",
    "name": "عيادة الصفوة للباطنة والمناظير — الزقازيق",
    "address": "22 شارع القومية، ميدان القومية، الدور الثالث",
    "governorate": "الشرقية",
    "city": "الزقازيق",
    "district": "القومية",
    "landmark": "بجوار مستشفى العبور",
    "distanceKm": 1.5,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 270,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01016667788"
  },
  {
    "id": "clinic-22",
    "doctorId": "doc-22",
    "name": "مركز المنصورة التخصصي للسكر والباطنة",
    "address": "شارع جيهان، أمام بوابة جامعة المنصورة، الدور الرابع",
    "governorate": "الدقهلية",
    "city": "المنصورة",
    "district": "حي الجامعة",
    "landmark": "أمام كلية التربية",
    "distanceKm": 2.3,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 300,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01025556677"
  },
  {
    "id": "clinic-23",
    "doctorId": "doc-23",
    "name": "عيادة قنديل التخصصية للباطنة — بنها",
    "address": "شارع الأهرام، تقاطع شارع فريد ندا، برج الأطباء، الدور الثاني",
    "governorate": "القليوبية",
    "city": "بنها",
    "district": "الأهرام",
    "landmark": "بجوار قصر الثقافة بنها",
    "distanceKm": 3.1,
    "workingDays": [
      "السبت",
      "الأحد",
      "الثلاثاء",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 240,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01141113355"
  },
  {
    "id": "clinic-24",
    "doctorId": "doc-24",
    "name": "مركز أسيوط الدولي لأمراض الجهاز الهضمي",
    "address": "شارع الجمهورية، برج الزراعيين، الدور الخامس",
    "governorate": "أسيوط",
    "city": "أسيوط",
    "district": "شارع الجمهورية",
    "landmark": "أمام محطة قطار أسيوط",
    "distanceKm": 3.9,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 250,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01228881100"
  },
  {
    "id": "clinic-25",
    "doctorId": "doc-25",
    "name": "عيادة الغردقة الدولية للباطنة وطب الأسرة",
    "address": "منطقة الكوثر، طريق المطار، الدور الأول",
    "governorate": "البحر الأحمر",
    "city": "الغردقة",
    "district": "الكوثر",
    "landmark": "بجوار البولينج سنتر",
    "distanceKm": 4.7,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الأربعاء",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 300,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01063332244"
  },
  {
    "id": "clinic-26",
    "doctorId": "doc-26",
    "name": "عيادة واحة الأمل التخصصية — الخارجة",
    "address": "شارع جمال عبد الناصر، عمارة بنك القاهرة، الدور الثاني",
    "governorate": "الوادي الجديد",
    "city": "الخارجة",
    "district": "شارع جمال عبد الناصر",
    "landmark": "أمام مجلس مدينة الخارجة",
    "distanceKm": 5.5,
    "workingDays": [
      "السبت",
      "الأحد",
      "الثلاثاء",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 200,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01115557799"
  },
  {
    "id": "clinic-27",
    "doctorId": "doc-27",
    "name": "مركز الشاذلي لجراحة العظام ومناظير المفاصل — سموحة",
    "address": "طريق 14 مايو، برج سموحة هايتس، الدور الثاني",
    "governorate": "الإسكندرية",
    "city": "سموحة",
    "district": "طريق 14 مايو",
    "landmark": "بجوار جرين بلازا مول",
    "distanceKm": 6.3,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 380,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01223334455"
  },
  {
    "id": "clinic-28",
    "doctorId": "doc-28",
    "name": "عيادة سباين كير للعمود الفقري والعظام — مدينة نصر",
    "address": "طريق النصر، عمارة النصر سنتر، الدور الرابع",
    "governorate": "القاهرة",
    "city": "مدينة نصر",
    "district": "طريق النصر",
    "landmark": "أمام طيبة مول",
    "distanceKm": 7.1,
    "workingDays": [
      "السبت",
      "الثلاثاء",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 420,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01008889911"
  },
  {
    "id": "clinic-29",
    "doctorId": "doc-29",
    "name": "مركز أورثو سبورت التخصصي — التجمع الخامس",
    "address": "مجمع سي إم سي الطبي، خلف المستشفى الجوي، الدور الأول",
    "governorate": "القاهرة",
    "city": "التجمع الخامس",
    "district": "شارع التسعين",
    "landmark": "مجمع عيادات CMC",
    "distanceKm": 7.9,
    "workingDays": [
      "الأحد",
      "الثلاثاء",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 450,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01017772233"
  },
  {
    "id": "clinic-30",
    "doctorId": "doc-30",
    "name": "عيادة سلامة لعظام الأطفال والمفاصل — مصر الجديدة",
    "address": "25 شارع الحجاز، ميدان المحكمة، الدور الثالث",
    "governorate": "القاهرة",
    "city": "مصر الجديدة",
    "district": "ميدان الحجاز",
    "landmark": "أمام محكمة مصر الجديدة",
    "distanceKm": 8.7,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 380,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01124445566"
  },
  {
    "id": "clinic-31",
    "doctorId": "doc-31",
    "name": "مركز المناوي لجراحة المفاصل الصناعية — المهندسين",
    "address": "50 شارع البطل أحمد عبد العزيز، الدور الخامس",
    "governorate": "الجيزة",
    "city": "المهندسين",
    "district": "شارع البطل أحمد عبد العزيز",
    "landmark": "أمام مطعم أرابياتا",
    "distanceKm": 1.5,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 450,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01091114422"
  },
  {
    "id": "clinic-32",
    "doctorId": "doc-32",
    "name": "عيادة د. شادي القاضي للعظام — الدقي",
    "address": "8 شارع المساحة، الدور الثاني",
    "governorate": "الجيزة",
    "city": "الدقي",
    "district": "ميدان المساحة",
    "landmark": "فوق فندق سفير",
    "distanceKm": 2.3,
    "workingDays": [
      "الأحد",
      "الثلاثاء",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 350,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01158883300"
  },
  {
    "id": "clinic-33",
    "doctorId": "doc-33",
    "name": "عيادة الميهي لجراحة العظام والكسور — الهرم",
    "address": "شارع الهرم الرئيسي، محطة المريوطية، برج الجيزة، الدور الأول",
    "governorate": "الجيزة",
    "city": "الهرم",
    "district": "المريوطية",
    "landmark": "بجوار مستشفى الهرم",
    "distanceKm": 3.1,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الثلاثاء",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 280,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01229995544"
  },
  {
    "id": "clinic-34",
    "doctorId": "doc-34",
    "name": "مركز الإسكندرية لجراحة العظام والعمود الفقري",
    "address": "35 شارع صفية زغلول، عمارة الفيروز، الدور الرابع",
    "governorate": "الإسكندرية",
    "city": "محطة الرمل",
    "district": "صفية زغلول",
    "landmark": "أمام سينما مترو الإسكندرية",
    "distanceKm": 3.9,
    "workingDays": [
      "السبت",
      "الأحد",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 330,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01281119944"
  },
  {
    "id": "clinic-35",
    "doctorId": "doc-35",
    "name": "عيادة الشامي التخصصية للعظام — طنطا",
    "address": "شارع النحاس، تقاطع بطرس، برج الصفوة، الدور الثالث",
    "governorate": "الغربية",
    "city": "طنطا",
    "district": "النحاس",
    "landmark": "بجوار مدرسة الأقباط",
    "distanceKm": 4.7,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 280,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01018882299"
  },
  {
    "id": "clinic-36",
    "doctorId": "doc-36",
    "name": "مركز الدقهلية لجراحة العظام والمناظير — المنصورة",
    "address": "شارع الجمهورية، أمام مجمع المحاكم، الدور الخامس",
    "governorate": "الدقهلية",
    "city": "المنصورة",
    "district": "شارع الجمهورية",
    "landmark": "بجوار البنك الأهلي",
    "distanceKm": 5.5,
    "workingDays": [
      "الأحد",
      "الثلاثاء",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 320,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01064441188"
  },
  {
    "id": "clinic-37",
    "doctorId": "doc-37",
    "name": "مركز سوهاج التخصصي للعظام والكسور",
    "address": "شارع 15 مايو، برج أطباء سوهاج، الدور الثالث",
    "governorate": "سوهاج",
    "city": "سوهاج",
    "district": "شارع 15 مايو",
    "landmark": "أمام مدرسة التجارة الثانوية",
    "distanceKm": 6.3,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 250,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01123339911"
  },
  {
    "id": "clinic-38",
    "doctorId": "doc-38",
    "name": "عيادة سيناء الدولية للعظام — شرم الشيخ",
    "address": "شارع الفنار، حي الهضبة، مجمع السلام الطبي، الدور الأول",
    "governorate": "جنوب سيناء",
    "city": "شرم الشيخ",
    "district": "الهضبة",
    "landmark": "بجوار مستشفى شرم الشيخ الدولي",
    "distanceKm": 7.1,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الأربعاء",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 350,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01098884400"
  },
  {
    "id": "clinic-39",
    "doctorId": "doc-39",
    "name": "عيادة الشاهد لجراحة العظام — العريش",
    "address": "شارع 23 يوليو، برج الأطباء، الدور الثاني",
    "governorate": "شمال سيناء",
    "city": "العريش",
    "district": "شارع 23 يوليو",
    "landmark": "أمام حديقة البلدية",
    "distanceKm": 7.9,
    "workingDays": [
      "السبت",
      "الأحد",
      "الثلاثاء",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 220,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01116664422"
  },
  {
    "id": "clinic-40",
    "doctorId": "doc-40",
    "name": "مركز الشناوي لرعاية الأمومة والخصوبة — مصر الجديدة",
    "address": "38 شارع نزيه خليفة، ميدان الإسماعيلية، الكوربة، الدور الرابع",
    "governorate": "القاهرة",
    "city": "مصر الجديدة",
    "district": "الكوربة",
    "landmark": "بجوار بنك CIB",
    "distanceKm": 8.7,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 380,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01004443322"
  },
  {
    "id": "clinic-41",
    "doctorId": "doc-41",
    "name": "عيادة فيتال كير لصحة المرأة والجنين — التجمع",
    "address": "مجمع كايرو ميديكال سنتر CMC، التسعين الشمالي، الدور الثاني",
    "governorate": "القاهرة",
    "city": "التجمع الخامس",
    "district": "المستثمرين",
    "landmark": "خلف البنك المركزي",
    "distanceKm": 1.5,
    "workingDays": [
      "الأحد",
      "الثلاثاء",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 450,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01146665500"
  },
  {
    "id": "clinic-42",
    "doctorId": "doc-42",
    "name": "مركز بدران لجراحات النساء والمناظير — المعادي",
    "address": "شارع الخمسين، عمارة ريحانة ريزيدنس، الدور الثالث",
    "governorate": "القاهرة",
    "city": "المعادي",
    "district": "زهراء المعادي",
    "landmark": "أمام كارفور المعادي",
    "distanceKm": 2.3,
    "workingDays": [
      "السبت",
      "الثلاثاء",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 400,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01021118833"
  },
  {
    "id": "clinic-43",
    "doctorId": "doc-43",
    "name": "عيادة د. مروة الألفي للنساء والتوليد — الدقي",
    "address": "40 شارع مصدق، الدور الثاني",
    "governorate": "الجيزة",
    "city": "الدقي",
    "district": "شارع مصدق",
    "landmark": "أمام بنك فيصل الإسلامي",
    "distanceKm": 3.1,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 350,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01118882244"
  },
  {
    "id": "clinic-44",
    "doctorId": "doc-44",
    "name": "مركز زايد لإخصاب ورعاية الأمومة — الشيخ زايد",
    "address": "مول ويست تاون هاب، مبنى B، الدور الثاني، عيادة 210",
    "governorate": "الجيزة",
    "city": "الشيخ زايد",
    "district": "بيفرلي هيلز",
    "landmark": "بجوار البوابة الرئيسية لبيفرلي هيلز",
    "distanceKm": 3.9,
    "workingDays": [
      "الأحد",
      "الثلاثاء",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 480,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01225557711"
  },
  {
    "id": "clinic-45",
    "doctorId": "doc-45",
    "name": "عيادة المنشاوي لرعاية المرأة والولادة — 6 أكتوبر",
    "address": "شارع جمال عبد الناصر، الحي المتميز، سنتر الأطباء، الدور الأول",
    "governorate": "الجيزة",
    "city": "6 أكتوبر",
    "district": "الحي المتميز",
    "landmark": "أمام مستشفى سعاد كفافي",
    "distanceKm": 4.7,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 320,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01067771199"
  },
  {
    "id": "clinic-46",
    "doctorId": "doc-46",
    "name": "مركز الخصوبة السكندري المتقدم — سموحة",
    "address": "ميدان فيكتور عمانويل، برج الصفوة الطبي، الدور الرابع",
    "governorate": "الإسكندرية",
    "city": "سموحة",
    "district": "فيكتور عمانويل",
    "landmark": "أمام بوابة نادي سموحة 1",
    "distanceKm": 5.5,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 400,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01203338877"
  },
  {
    "id": "clinic-47",
    "doctorId": "doc-47",
    "name": "عيادة دار الأمومة والخصوبة — سيدي بشر",
    "address": "33 شارع خالد بن الوليد، سيدي بشر بحري، الدور الأول",
    "governorate": "الإسكندرية",
    "city": "سيدي بشر",
    "district": "سيدي بشر بحري",
    "landmark": "بجوار بنك الإسكندرية",
    "distanceKm": 6.3,
    "workingDays": [
      "السبت",
      "الأحد",
      "الثلاثاء",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 280,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01223344660"
  },
  {
    "id": "clinic-48",
    "doctorId": "doc-48",
    "name": "عيادة عبد الهادي لطب النساء والتوليد — الزقازيق",
    "address": "شارع الجلاء، عمارة برج الأطباء، الدور الرابع",
    "governorate": "الشرقية",
    "city": "الزقازيق",
    "district": "شارع الجلاء",
    "landmark": "أمام محطة قطار الزقازيق",
    "distanceKm": 7.1,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الأربعاء",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 260,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01014449922"
  },
  {
    "id": "clinic-49",
    "doctorId": "doc-49",
    "name": "مركز الشوربجي لرعاية الأمومة والطفل — المنصورة",
    "address": "شارع سعد زغلول، حي توريل، الدور الثالث",
    "governorate": "الدقهلية",
    "city": "المنصورة",
    "district": "توريل",
    "landmark": "بجوار مدرسة العائلة المقدسة",
    "distanceKm": 7.9,
    "workingDays": [
      "السبت",
      "الأحد",
      "الثلاثاء",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 300,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01095552233"
  },
  {
    "id": "clinic-50",
    "doctorId": "doc-50",
    "name": "عيادة الأمل للنساء والتوليد — بني سويف",
    "address": "شارع عبد السلام عارف، برج الأطباء الجديد، الدور الثاني",
    "governorate": "بني سويف",
    "city": "بني سويف",
    "district": "عبد السلام عارف",
    "landmark": "بجوار ميدان المديرية",
    "distanceKm": 8.7,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 220,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01147771133"
  },
  {
    "id": "clinic-51",
    "doctorId": "doc-51",
    "name": "عيادة النور لطب النساء والتوليد — قنا",
    "address": "شارع 23 يوليو، برج الأطباء، الدور الثالث",
    "governorate": "قنا",
    "city": "قنا",
    "district": "شارع 23 يوليو",
    "landmark": "أمام بنك مصر فرع قنا",
    "distanceKm": 1.5,
    "workingDays": [
      "السبت",
      "الأحد",
      "الثلاثاء",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 220,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01221118855"
  },
  {
    "id": "clinic-52",
    "doctorId": "doc-52",
    "name": "مركز الجزار الدولي لأمراض المخ والأعصاب — مدينة نصر",
    "address": "60 شارع مكرم عبيد، الدور الخامس",
    "governorate": "القاهرة",
    "city": "مدينة نصر",
    "district": "مكرم عبيد",
    "landmark": "فوق صيدلية العزبي",
    "distanceKm": 2.3,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 400,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01007774411"
  },
  {
    "id": "clinic-53",
    "doctorId": "doc-53",
    "name": "عيادة نيفين محيي الدين للأعصاب — مصر الجديدة",
    "address": "15 شارع النزهة، أرض الجولف، الدور الثاني",
    "governorate": "القاهرة",
    "city": "مصر الجديدة",
    "district": "أرض الجولف",
    "landmark": "بجوار مستشفى الجولف الدولي",
    "distanceKm": 3.1,
    "workingDays": [
      "الأحد",
      "الثلاثاء",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 420,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01119994433"
  },
  {
    "id": "clinic-54",
    "doctorId": "doc-54",
    "name": "مركز نيورو لايف لأمراض الأعصاب — التجمع الخامس",
    "address": "مجمع بريمير الطبي، شارع التسعين الشمالي، عيادة 412",
    "governorate": "القاهرة",
    "city": "التجمع الخامس",
    "district": "شارع التسعين",
    "landmark": "أمام محطة مونوريل التسعين",
    "distanceKm": 3.9,
    "workingDays": [
      "السبت",
      "الثلاثاء",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 480,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01026665511"
  },
  {
    "id": "clinic-55",
    "doctorId": "doc-55",
    "name": "مركز السقا لجراحة المخ والأعصاب والعمود الفقري",
    "address": "4 شارع لبنان، ميدان لبنان، الدور الثالث",
    "governorate": "الجيزة",
    "city": "المهندسين",
    "district": "ميدان لبنان",
    "landmark": "أمام بنك HSBC",
    "distanceKm": 4.7,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 450,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01224446688"
  },
  {
    "id": "clinic-56",
    "doctorId": "doc-56",
    "name": "عيادة د. هاني الرفاعي للأعصاب — الدقي",
    "address": "70 شارع التحرير، برج الأطباء، الدور السادس",
    "governorate": "الجيزة",
    "city": "الدقي",
    "district": "شارع التحرير",
    "landmark": "محطة مترو الدقي",
    "distanceKm": 5.5,
    "workingDays": [
      "الأحد",
      "الثلاثاء",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 350,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01142228800"
  },
  {
    "id": "clinic-57",
    "doctorId": "doc-57",
    "name": "مركز أمل للأعصاب والنمو عند الأطفال — 6 أكتوبر",
    "address": "المحور المركزي، سنتر التعمير، الدور الثاني",
    "governorate": "الجيزة",
    "city": "6 أكتوبر",
    "district": "الحي الأول",
    "landmark": "بجوار جامعة 6 أكتوبر",
    "distanceKm": 6.3,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 320,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01015553377"
  },
  {
    "id": "clinic-58",
    "doctorId": "doc-58",
    "name": "مركز الإسكندرية للعلوم العصبية — سموحة",
    "address": "شارع فوزي معاذ، برج النحاس الطبي، الدور الرابع",
    "governorate": "الإسكندرية",
    "city": "سموحة",
    "district": "فوزي معاذ",
    "landmark": "أمام مسجد علي بن أبي طالب",
    "distanceKm": 7.1,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 380,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01228883311"
  },
  {
    "id": "clinic-59",
    "doctorId": "doc-59",
    "name": "عيادة د. غادة عبد المنعم للأعصاب — الرمل",
    "address": "18 شارع سعد زغلول، الدور الثالث",
    "governorate": "الإسكندرية",
    "city": "محطة الرمل",
    "district": "سعد زغلول",
    "landmark": "أمام محطة ترام الرمل",
    "distanceKm": 7.9,
    "workingDays": [
      "الأحد",
      "الثلاثاء",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 320,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01275551144"
  },
  {
    "id": "clinic-60",
    "doctorId": "doc-60",
    "name": "مركز الدلتا لجراحة المخ والأعصاب — المنصورة",
    "address": "شارع جيهان، تقاطع شارع أحمد ماهر، الدور الرابع",
    "governorate": "الدقهلية",
    "city": "المنصورة",
    "district": "حي الجامعة",
    "landmark": "بجوار بنك التعمير والإسكان",
    "distanceKm": 8.7,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الخميس"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 340,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01062228855"
  },
  {
    "id": "clinic-61",
    "doctorId": "doc-61",
    "name": "عيادة المنوفي التخصصية للأعصاب — طنطا",
    "address": "شارع البحر، أمام مبنى ديوان عام المحافظة، الدور الثالث",
    "governorate": "الغربية",
    "city": "طنطا",
    "district": "شارع البحر",
    "landmark": "أمام محطة قطار طنطا",
    "distanceKm": 1.5,
    "workingDays": [
      "السبت",
      "الثلاثاء",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 280,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01003337722"
  },
  {
    "id": "clinic-62",
    "doctorId": "doc-62",
    "name": "مركز الصعيد لطب المخ والأعصاب — أسيوط",
    "address": "شارع الجمهورية، برج الأطباء، الدور الرابع",
    "governorate": "أسيوط",
    "city": "أسيوط",
    "district": "شارع الجمهورية",
    "landmark": "بجوار البنك المركزي أسيوط",
    "distanceKm": 2.3,
    "workingDays": [
      "السبت",
      "الاثنين",
      "الأربعاء"
    ],
    "startTime": "13:00",
    "endTime": "22:00",
    "consultationPrice": 260,
    "followUpPrice": 0,
    "dailyPatientLimit": 30,
    "avgExamDurationMin": 10,
    "isActive": true,
    "bookingsPaused": false,
    "announcedDelayMin": 0,
    "closedDates": [],
    "phone": "01127774488"
  }
];
