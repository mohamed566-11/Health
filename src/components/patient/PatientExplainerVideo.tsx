import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileText,
  MapPin,
  Maximize2,
  Mic,
  Minimize2,
  MousePointerClick,
  Pause,
  Pill,
  Play,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  UserCheck,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/UIPrimitives';
import { Modal } from '../modals/Overlays';

export type NarratorVoiceId = 'salma' | 'karim';

export interface NarratorVoiceProfile {
  id: NarratorVoiceId;
  nameAr: string;
  roleAr: string;
  dialectBadge: string;
}

export const NARRATOR_VOICES: Record<NarratorVoiceId, NarratorVoiceProfile> = {
  salma: {
    id: 'salma',
    nameAr: 'د. سلمى',
    roleAr: 'صوت بشري مصري نسائي طبيعي ١٠٠٪',
    dialectBadge: 'لهجة مصرية طبيعية',
  },
  karim: {
    id: 'karim',
    nameAr: 'د. كريم',
    roleAr: 'صوت بشري مصري رجالي طبيعي ١٠٠٪',
    dialectBadge: 'لهجة مصرية طبيعية',
  },
};

export interface MicroStep {
  title: string;
  detail: string;
}

export interface VideoScene {
  id: number;
  startSec: number;
  endSec: number;
  durationSec: number;
  title: string;
  shortLabel: string;
  simulatedUrl: string;
  narration: string;
  patientTakeaway: string;
  microSteps: [MicroStep, MicroStep, MicroStep];
  actionLabel: string;
  actionPath: string;
  audioFiles: Record<NarratorVoiceId, string>;
}

export const EXPLAINER_SCENES: VideoScene[] = [
  {
    id: 0,
    startSec: 0,
    endSec: 18.6,
    durationSec: 18.6,
    title: '١. الدخول السريع برقم الموبايل وتأمين ملفك الطبي',
    shortLabel: '١. الدخول وملف الأمان',
    simulatedUrl: 'maw3edy.eg/login-and-medical-safety',
    narration:
      'أهلاً بيك في منصة موعدي! عشان تبدأ، كل اللي عليك تدخّل رقم موبايلك المصري، وهتوصلك رسالة فيها كود تأكيد سريع في ثواني. وأول ما تدخل، تقدر تسجّل أي حساسية من أدوية معينة أو أي أمراض مزمنة، عشان الدكتور ياخد باله منها فوراً وإنت بتكشف، وتكون في أمان تام.',
    patientTakeaway:
      'مش محتاج تحفظ باسورد معقدة — دخولك برقم موبايلك المصري وملفك الصحي بيحذّر الدكتور تلقائياً من أي أدوية ممنوعة عليك.',
    microSteps: [
      {
        title: 'اكتب رقم موبايلك المصري',
        detail: 'دخول فوري بأرقام 010 أو 011 أو 012 أو 015 بدون تعقيد.',
      },
      {
        title: 'كود التفعيل السريع (OTP)',
        detail: 'رسالة تأكيد من ٤ أرقام بتفتحلك حسابك في ثواني.',
      },
      {
        title: 'تنبيه الحساسية والأمراض المزمنة',
        detail: 'بيظهر باللون الأحمر قدّام الدكتور وقت الكشف لحمايتك.',
      },
    ],
    actionLabel: 'افتح ملفي الصحي الآن',
    actionPath: '/patient/profile',
    audioFiles: {
      salma: '/audio/egyptian-salma-scene-0.wav',
      karim: '/audio/egyptian-karim-scene-0.wav',
    },
  },
  {
    id: 1,
    startSec: 18.6,
    endSec: 36.6,
    durationSec: 18.0,
    title: '٢. إزاي تختار الدكتور والعيادة الأقرب ليك؟',
    shortLabel: '٢. البحث والمقارنة',
    simulatedUrl: 'maw3edy.eg/patient/doctors?gov=cairo',
    narration:
      'من صفحة الأطباء، اختار التخصص اللي بتدور عليه، وحدد محافظتك والمنطقة القريبة منك. هتظهرلك قايمة بأشطر الدكاترة المعتمدين، تقدر تقارن بينهم بكل سهولة حسب التقييم الحقيقي لتجارب المرضى، وسنين الخبرة، وكمان سعر الكشف والاستشارة قبل ما تحجز.',
    patientTakeaway:
      'كل الدكاترة معتمدين — تقدر تعرف سعر الكشف والاستشارة ومواعيد العيادة وتقييمات المرضى الحقيقية قبل ما تاخد قرارك.',
    microSteps: [
      {
        title: 'حدد التخصص والمحافظة والمنطقة',
        detail: 'اختار مثلاً: باطنة أو قلب أو أطفال في منطقتك السكنية.',
      },
      {
        title: 'قارن التقييمات وسنين الخبرة',
        detail: 'شوف تقييمات مرضى حقيقيين كشفوا فعلاً عند الدكتور.',
      },
      {
        title: 'اعرف سعر الكشف والاستشارة مسبقاً',
        detail: 'شفافية كاملة في أسعار الكشف وأقرب معاد متاح.',
      },
    ],
    actionLabel: 'تصفح الأطباء (٢٤ طبيبًا)',
    actionPath: '/patient/doctors',
    audioFiles: {
      salma: '/audio/egyptian-salma-scene-1.wav',
      karim: '/audio/egyptian-karim-scene-1.wav',
    },
  },
  {
    id: 2,
    startSec: 36.6,
    endSec: 54.9,
    durationSec: 18.3,
    title: '٣. حجز المعاد في ٣ خطوات واستلام رقم دورك',
    shortLabel: '٣. حجز الكشف ورقم الدور',
    simulatedUrl: 'maw3edy.eg/patient/booking/dr-1',
    narration:
      'لما تختار الدكتور، حدد فرع العيادة الأقرب ليك، واختار اليوم والفترة الصباحية أو المسائية اللي تناسب وقتك. وبضغطة واحدة بس، حجزك بيتأكد فوراً وبيطلعلك رقم دورك في الكشف، والدفع بيكون كاش في العيادة لما تشرفنا من غير أي مصاريف إضافية.',
    patientTakeaway:
      'مش محتاج فيزا أو دفع إلكتروني — حجزك بيتأكد فوراً برقم دور رسمي في الطابور، وبتدفع كاش في الاستقبال لما توصل.',
    microSteps: [
      {
        title: 'اختار فرع العيادة الأقرب ليك',
        detail: 'لو الدكتور ليه أكتر من فرع، اختار الفرع الأنسب لمكانك.',
      },
      {
        title: 'حدد اليوم والفترة (صباحاً أو مساءً)',
        detail: 'مواعيد واضحة بالساعة والدقيقة حسب جدول العيادة.',
      },
      {
        title: 'استلم تذكرة الحجز ورقم الدور فوراً',
        detail: 'بيطلعلك كارت حجز رسمي برقم دورك (مثلاً #025).',
      },
    ],
    actionLabel: 'جرب حجز معاد دلوقتي',
    actionPath: '/patient/doctors',
    audioFiles: {
      salma: '/audio/egyptian-salma-scene-2.wav',
      karim: '/audio/egyptian-karim-scene-2.wav',
    },
  },
  {
    id: 3,
    startSec: 54.9,
    endSec: 74.5,
    durationSec: 19.6,
    title: '٤. متابعة الطابور اللايف لحظة بلحظة وإنت في بيتك',
    shortLabel: '٤. الطابور اللايف',
    simulatedUrl: 'maw3edy.eg/patient/queue/apt-5',
    narration:
      'بدل ما تنزل بدري وتقعد بالساعات في قاعة الانتظار، افتح شاشة الطابور اللايف من موبايلك وإنت قاعد في بيتك! هتشوف رقم المريض اللي جوّه عند الدكتور دلوقتي، وفاضل كام واحد قبلك، والوقت المتوقع لدخولك، وأول ما دورك يقرّب هيجيلك تنبيه عشان تتحرك للعيادة على ميعادك بالظبط.',
    patientTakeaway:
      'وداعاً للانتظار الممل في العيادة! شاشة الطابور اللايف بتتحدث أوتوماتيك مع كل مريض بيدخل أو يخرج من أوضة الكشف.',
    microSteps: [
      {
        title: 'شوف مين جوّه الكشف دلوقتي لايف',
        detail: 'الشاشة بتعرض رقم الكشف الحالي في العيادة لحظة بلحظة.',
      },
      {
        title: 'اعرف فاضل كام مريض وكام دقيقة',
        detail: 'حساب دقيق للوقت المتوقع لدخولك بناءً على سرعة الكشف.',
      },
      {
        title: 'تنبيه ذكي لما يفضل قبلك مريضين',
        detail: 'إشعار واضح يقولك: اتحرك للعيادة دلوقتي عشان تلحق دورك!',
      },
    ],
    actionLabel: 'افتح شاشة الطابور اللايف',
    actionPath: '/patient/queue/apt-5',
    audioFiles: {
      salma: '/audio/egyptian-salma-scene-3.wav',
      karim: '/audio/egyptian-karim-scene-3.wav',
    },
  },
  {
    id: 4,
    startSec: 74.5,
    endSec: 92.8,
    durationSec: 18.3,
    title: '٥. الروشتة الإلكترونية المطبوعة وسجلك الطبي الكامل',
    shortLabel: '٥. الروشتة والسجل',
    simulatedUrl: 'maw3edy.eg/patient/prescriptions/rx-2',
    narration:
      'وبعد ما تخلّص الكشف بالسلامة، الدكتور بيكتبلك روشتة إلكترونية واضحة جداً، مكتوب فيها اسم كل دوا والجرعة المظبوطة قبل أو بعد الأكل، تقدر تطبعها بي دي إف في أي وقت، وكل كشوفاتك وتحاليلك بتتحفظ تلقائياً في ملفك الطبي عشان ترجعلها وقت ما تحب.',
    patientTakeaway:
      'مفيش خط إيد غير مفهوم ولا روشتة بتضيع! كل أدويتك بجرعاتها ومواعيدها محفوظة على موبايلك وجاهزة للطباعة أو الصيدلية.',
    microSteps: [
      {
        title: 'روشتة إلكترونية واضحة ١٠٠٪',
        detail: 'اسم كل دوا، التركيز، عدد المرات، وقبل ولا بعد الأكل.',
      },
      {
        title: 'تحميل وطباعة PDF بضغطة واحدة',
        detail: 'تقدر تبعتها للصيدلية أو تطبعها في أي وقت من موبايلك.',
      },
      {
        title: 'أرشيف طبي كامل لكل زياراتك',
        detail: 'كل كشوفاتك السابقة وتشخيصاتك محفوظة بأمان تام.',
      },
    ],
    actionLabel: 'اعرض نموذج الروشتة الإلكترونية',
    actionPath: '/patient/prescriptions/rx-2',
    audioFiles: {
      salma: '/audio/egyptian-salma-scene-4.wav',
      karim: '/audio/egyptian-karim-scene-4.wav',
    },
  },
];

export const TOTAL_DURATION_SEC = 92.8;

function formatTimecode(seconds: number): string {
  const clamped = Math.max(0, Math.min(TOTAL_DURATION_SEC, Math.floor(seconds)));
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export interface PatientExplainerVideoPlayerProps {
  autoPlay?: boolean;
  compact?: boolean;
  onExpandModal?: () => void;
  onCloseModal?: () => void;
  hideHeaderBar?: boolean;
  narratorVoice?: NarratorVoiceId;
  onVoiceChange?: (v: NarratorVoiceId) => void;
}

export const PatientExplainerVideoPlayer: React.FC<PatientExplainerVideoPlayerProps> = ({
  autoPlay = false,
  compact = false,
  onExpandModal,
  onCloseModal,
  hideHeaderBar = false,
  narratorVoice: controlledVoice,
  onVoiceChange,
}) => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [sceneElapsedSec, setSceneElapsedSec] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<1 | 1.25>(1);
  const [internalVoice, setInternalVoice] = useState<NarratorVoiceId>('salma');
  const narratorVoice = controlledVoice ?? internalVoice;
  const [audioReady, setAudioReady] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);

  const currentScene = EXPLAINER_SCENES[sceneIndex] ?? EXPLAINER_SCENES[0];
  const currentTime = useMemo(
    () =>
      Math.min(
        TOTAL_DURATION_SEC,
        currentScene.startSec + Math.min(currentScene.durationSec, sceneElapsedSec)
      ),
    [currentScene, sceneElapsedSec]
  );

  const sceneProgressPct = useMemo(
    () =>
      Math.min(
        100,
        Math.max(0, (sceneElapsedSec / Math.max(1, currentScene.durationSec)) * 100)
      ),
    [currentScene.durationSec, sceneElapsedSec]
  );

  // Active sub-step (0, 1, or 2) synchronized with narrator voice progress
  const activeMicroStepIndex: 0 | 1 | 2 =
    sceneProgressPct < 34 ? 0 : sceneProgressPct < 68 ? 1 : 2;

  // Word-by-word karaoke highlighting synchronized with sceneProgressPct
  const narrationWords = useMemo(
    () => currentScene.narration.split(/\s+/).filter(Boolean),
    [currentScene.narration]
  );
  const highlightedWordCount = useMemo(() => {
    if (!isPlaying && sceneElapsedSec === 0) return 0;
    return Math.min(
      narrationWords.length,
      Math.max(1, Math.ceil((sceneProgressPct / 100) * narrationWords.length))
    );
  }, [isPlaying, narrationWords.length, sceneElapsedSec, sceneProgressPct]);

  // Advance to next scene or stop at the end of scene 4
  const advanceToNextScene = useCallback(() => {
    setSceneIndex((prevIdx) => {
      if (prevIdx < EXPLAINER_SCENES.length - 1) {
        setSceneElapsedSec(0);
        return prevIdx + 1;
      } else {
        setIsPlaying(false);
        setSceneElapsedSec(EXPLAINER_SCENES[EXPLAINER_SCENES.length - 1].durationSec);
        return prevIdx;
      }
    });
  }, []);

  // Sync HTML5 <audio> element with sceneIndex, narratorVoice, isPlaying, isMuted, playbackRate
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    const targetSrc = currentScene.audioFiles[narratorVoice];
    const currentSrcPath = audioEl.getAttribute('data-scene-src');

    if (currentSrcPath !== targetSrc) {
      audioEl.setAttribute('data-scene-src', targetSrc);
      audioEl.src = targetSrc;
      audioEl.currentTime = Math.min(sceneElapsedSec, currentScene.durationSec - 0.2);
    }

    audioEl.muted = isMuted;
    audioEl.playbackRate = playbackRate;

    if (isPlaying) {
      const playPromise = audioEl.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setAudioReady(true);
          })
          .catch(() => {
            // Fallback timer drives visuals smoothly
            setAudioReady(false);
          });
      }
    } else {
      audioEl.pause();
    }
  }, [
    currentScene,
    isMuted,
    isPlaying,
    narratorVoice,
    playbackRate,
  ]);

  // Fallback progression timer if <audio> is blocked or paused
  useEffect(() => {
    if (fallbackTimerRef.current) {
      window.clearInterval(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    if (!isPlaying) return;

    fallbackTimerRef.current = window.setInterval(() => {
      const audioEl = audioRef.current;
      if (audioEl && !audioEl.paused && !audioEl.ended && audioEl.currentTime > 0) {
        setSceneElapsedSec(audioEl.currentTime);
        return;
      }

      setSceneElapsedSec((prev) => {
        const next = prev + 0.15 * playbackRate;
        if (next >= currentScene.durationSec) {
          advanceToNextScene();
          return 0;
        }
        return next;
      });
    }, 150);

    return () => {
      if (fallbackTimerRef.current) {
        window.clearInterval(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
    };
  }, [advanceToNextScene, currentScene.durationSec, isPlaying, playbackRate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleTogglePlay = () => {
    const isAtVeryEnd =
      sceneIndex === EXPLAINER_SCENES.length - 1 &&
      sceneElapsedSec >= currentScene.durationSec - 0.3;

    if (isAtVeryEnd) {
      setSceneIndex(0);
      setSceneElapsedSec(0);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const handleSelectScene = (idx: number) => {
    setSceneIndex(idx);
    setSceneElapsedSec(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(true);
  };

  const handleSwitchVoice = (voiceId: NarratorVoiceId) => {
    if (voiceId === narratorVoice) return;
    const savedElapsed = sceneElapsedSec;
    if (onVoiceChange) {
      onVoiceChange(voiceId);
    } else {
      setInternalVoice(voiceId);
    }
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = savedElapsed;
        if (isPlaying) {
          audioRef.current.play().catch(() => {});
        }
      }
    }, 30);
  };

  const handleScrubTimeline = (newGlobalTime: number) => {
    const clamped = Math.max(0, Math.min(TOTAL_DURATION_SEC - 0.1, newGlobalTime));
    const targetSceneIdx = EXPLAINER_SCENES.findIndex(
      (s) => clamped >= s.startSec && clamped < s.endSec
    );
    const resolvedIdx =
      targetSceneIdx >= 0 ? targetSceneIdx : EXPLAINER_SCENES.length - 1;
    const resolvedScene = EXPLAINER_SCENES[resolvedIdx];
    const offsetInScene = Math.max(0, clamped - resolvedScene.startSec);

    setSceneIndex(resolvedIdx);
    setSceneElapsedSec(offsetInScene);
    if (audioRef.current) {
      audioRef.current.currentTime = offsetInScene;
    }
  };

  const activeVoiceProfile = NARRATOR_VOICES[narratorVoice];

  // Compact teaser card for patient dashboard
  if (compact) {
    return (
      <div className="relative rounded-[22px] bg-gradient-to-l from-[#031A20] via-[#062A32] to-[#0A434D] border border-cyan-500/30 p-5 sm:p-6 text-[var(--color-white)] shadow-[0_16px_45px_-12px_rgba(3,26,32,0.85)] ring-1 ring-[var(--color-neon-orange)]/20 overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 -left-20 w-72 h-72 bg-[var(--color-neon-orange)]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-3 max-w-[760px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-neon-orange)] text-[var(--color-white)] text-[12px] font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                فيديو توضيحي تفاعلي
              </span>
              <span className="px-3 py-1 rounded-full bg-[var(--color-white)]/15 text-[var(--color-white)] text-[12px] font-semibold">
                صوت مصري طبيعي ١٠٠٪ (د. سلمى / د. كريم)
              </span>
              <span className="px-3 py-1 rounded-full bg-[var(--color-white)]/10 text-[var(--color-white)]/90 text-[12px] font-semibold tabular-nums">
                ٥ فصول قصيرة • 01:32 دقيقة
              </span>
            </div>
            <div>
              <h2 className="text-[19px] sm:text-[23px] font-bold text-[var(--color-white)] leading-snug">
                الفيديو التوضيحي للمريض: إزاي تستخدم منصة موعدي خطوة بخطوة؟
              </h2>
              <p className="text-[13px] sm:text-[14px] text-[var(--color-white)]/80 leading-relaxed mt-1">
                جولة مرئية سريعة بصوت مصري طبيعي تشرح لك تسجيل الدخول وملف الأمان الطبي، حجز الموعد، متابعة طابور العيادة لايف، وطباعة الروشتة الإلكترونية.
              </p>
            </div>
            {/* Chapter preview chips */}
            <div className="flex flex-wrap gap-2 pt-0.5">
              {EXPLAINER_SCENES.map((sc, idx) => (
                <span
                  key={sc.id}
                  className="px-2.5 py-1 rounded-[var(--radius-sm)] bg-[#031518]/85 border border-[var(--color-white)]/15 text-[11px] font-bold text-[var(--color-white)]/90 flex items-center gap-1.5 shadow-xs"
                >
                  <span className="w-4 h-4 rounded-full bg-[var(--color-neon-orange)] text-[var(--color-white)] text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{sc.shortLabel}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              type="button"
              onClick={onExpandModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-[var(--radius-md)] bg-[var(--color-neon-orange)] hover:bg-[var(--color-neon-orange-hover)] text-[var(--color-white)] text-[15px] font-bold shadow-lg shadow-[var(--color-neon-orange)]/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>تشغيل الفيديو التوضيحي بالكامل</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        hideHeaderBar
          ? 'flex flex-col flex-1 bg-[#041E24] text-[var(--color-white)] overflow-hidden'
          : 'rounded-[22px] bg-[#041E24] text-[var(--color-white)] border border-[var(--color-white)]/15 ring-1 ring-black/30 overflow-hidden shadow-[0_24px_60px_-20px_rgba(0,0,0,0.85)]'
      }
    >
      {/* Hidden Real HTML5 Audio Element playing 24kHz Natural Human Egyptian Arabic WAV */}
      <audio
        ref={audioRef}
        preload="auto"
        onTimeUpdate={(e) => {
          const el = e.currentTarget;
          if (!el.paused) {
            setSceneElapsedSec(el.currentTime);
          }
        }}
        onEnded={() => {
          advanceToNextScene();
        }}
      />

      {/* 1. Top Broadcast Studio Header Bar (Only rendered when not embedded inside modal header) */}
      {!hideHeaderBar && (
        <div className="px-4 sm:px-6 py-3.5 bg-[#041E24] border-b border-[var(--color-white)]/15 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--color-neon-orange)] text-[var(--color-white)] text-[12px] font-bold">
              <Mic className="w-3.5 h-3.5" />
              <span>صوت بشري مصري طبيعي ١٠٠٪</span>
            </span>
            <h2 className="text-[15px] sm:text-[17px] font-bold text-[var(--color-white)]">
              الفيديو التوضيحي للمريض: إزاي تستخدم منصة موعدي خطوة بخطوة؟
            </h2>
          </div>

          {/* Egyptian Human Voice Selector + Expand Button */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              role="group"
              aria-label="اختيار المعلق الصوتي المصري"
              className="inline-flex items-center rounded-[var(--radius-sm)] bg-[#0B434C] p-0.5 border border-[var(--color-white)]/20"
            >
              {(['salma', 'karim'] as NarratorVoiceId[]).map((vId) => {
                const voice = NARRATOR_VOICES[vId];
                const selected = narratorVoice === vId;
                return (
                  <button
                    key={vId}
                    type="button"
                    onClick={() => handleSwitchVoice(vId)}
                    className={`px-2.5 py-1 rounded-[4px] text-[12px] font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      selected
                        ? 'bg-[var(--color-neon-orange)] text-[var(--color-white)] shadow-xs'
                        : 'text-[var(--color-white)]/80 hover:text-[var(--color-white)]'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>بصوت {voice.nameAr} (مصري)</span>
                  </button>
                );
              })}
            </div>

            {onExpandModal && (
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  onExpandModal();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-white)]/15 hover:bg-[var(--color-neon-orange)] text-[12px] font-bold text-[var(--color-white)] transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>تكبير الشاشة السينمائية</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. Interactive 5-Chapter Stepper Bar */}
      <div
        role="tablist"
        aria-label="فصول الفيديو التوضيحي الخمسة"
        className="grid grid-cols-2 sm:grid-cols-5 border-b border-[var(--color-white)]/15 bg-[#08343C]"
      >
        {EXPLAINER_SCENES.map((scene, idx) => {
          const isActive = sceneIndex === idx;
          const isCompleted = idx < sceneIndex;
          return (
            <button
              key={scene.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => handleSelectScene(idx)}
              className={`relative px-3.5 py-3 text-start transition-colors cursor-pointer flex flex-col justify-between gap-1 border-e border-[var(--color-white)]/10 last:border-e-0 ${
                isActive
                  ? 'bg-[#0D4D58] text-[var(--color-white)]'
                  : isCompleted
                  ? 'bg-[#08343C] text-[var(--color-white)]/90 hover:bg-[#0B434C]'
                  : 'bg-[#072C33] text-[var(--color-white)]/70 hover:bg-[#0B434C] hover:text-[var(--color-white)]'
              }`}
            >
              <div className="flex items-center justify-between gap-1 w-full">
                <span className="text-[12px] sm:text-[13px] font-bold truncate">
                  {scene.shortLabel}
                </span>
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-green)] shrink-0" />
                ) : (
                  <span className="text-[11px] tabular-nums opacity-75 shrink-0">
                    {formatTimecode(scene.startSec)}
                  </span>
                )}
              </div>

              {/* Individual Chapter Progress Bar */}
              <div className="w-full h-1 rounded-full bg-[var(--color-white)]/15 overflow-hidden mt-1">
                <div
                  className="h-full bg-[var(--color-neon-orange)] transition-all duration-150"
                  style={{
                    width: isActive
                      ? `${sceneProgressPct}%`
                      : isCompleted
                      ? '100%'
                      : '0%',
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Main Cinema Split Stage: High-Clarity App Screen Simulation + Synchronized Step Guide */}
      <div className="relative p-4 sm:p-6 bg-gradient-to-b from-[#08353E] to-[#052329]">
        {/* Scene Top Status Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--color-white)]/15">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--color-neon-orange)] text-[var(--color-white)] text-[12px] font-bold tabular-nums">
              الفصل {sceneIndex + 1} من {EXPLAINER_SCENES.length}
            </span>
            <h3 className="text-[16px] sm:text-[19px] font-bold text-[var(--color-white)]">
              {currentScene.title}
            </h3>
          </div>

          {/* Live Voice Equalizer Indicator + Quick Play Toggle */}
          <div className="flex items-center gap-2.5 bg-[#041E24] px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-white)]/15">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="px-2.5 py-1 rounded bg-[var(--color-neon-orange)] hover:bg-[var(--color-neon-orange-hover)] text-[11px] font-bold text-[var(--color-white)] inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3" />
                  <span>إيقاف</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>تشغيل الصوت</span>
                </>
              )}
            </button>
            <div className="flex items-end gap-0.5 h-4" aria-hidden="true">
              {[0.45, 0.85, 0.6, 1.0, 0.7, 0.9, 0.5, 0.8].map((heightRatio, barIdx) => {
                const animatedHeight =
                  isPlaying && !isMuted
                    ? Math.max(
                        25,
                        Math.min(
                          100,
                          Math.round(
                            heightRatio *
                              100 *
                              (0.6 +
                                0.4 *
                                  Math.sin(
                                    sceneElapsedSec * 6 + barIdx * 1.1
                                  ))
                          )
                        )
                      )
                    : 22;
                return (
                  <span
                    key={barIdx}
                    className="w-1 rounded-full bg-[var(--color-neon-orange)] transition-all duration-150"
                    style={{ height: `${animatedHeight}%` }}
                  />
                );
              })}
            </div>
            <span className="text-[12px] font-bold text-[var(--color-white)]">
              {isPlaying && !isMuted
                ? `يتحدث الآن: ${activeVoiceProfile.nameAr} (${activeVoiceProfile.dialectBadge})`
                : isMuted
                ? 'الصوت مكتوم حالياً'
                : `جاهز للتشغيل بصوت ${activeVoiceProfile.nameAr}`}
            </span>
          </div>
        </div>

        {/* Split Grid: 4 Columns Step-by-Step Breakdown | 8 Columns High-Contrast App Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Right Column (4 cols in RTL): 3 Synchronized Micro-Steps + Takeaway */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3 bg-[#041E24]/90 rounded-[var(--radius-md)] p-4 border border-[var(--color-white)]/15">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[12px] font-bold text-[var(--color-white)]/80 pb-1 border-b border-[var(--color-white)]/10">
                <span>الخطوات التوضيحية في هذه الشاشة:</span>
                <span className="text-[var(--color-neon-orange)]">
                  الخطوة الفرعية {activeMicroStepIndex + 1} / 3
                </span>
              </div>

              {currentScene.microSteps.map((mStep, sIdx) => {
                const isCurrentSubStep = activeMicroStepIndex === sIdx;
                const isDoneSubStep = sIdx < activeMicroStepIndex;
                return (
                  <div
                    key={sIdx}
                    className={`p-3 rounded-[var(--radius-sm)] border transition-all ${
                      isCurrentSubStep
                        ? 'bg-[#0D4D58] border-[var(--color-neon-orange)] shadow-sm'
                        : isDoneSubStep
                        ? 'bg-[#08343C]/70 border-[var(--color-green)]/50 opacity-90'
                        : 'bg-[#07282E]/50 border-[var(--color-white)]/10 opacity-70'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-full text-[12px] font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                          isCurrentSubStep
                            ? 'bg-[var(--color-neon-orange)] text-[var(--color-white)]'
                            : isDoneSubStep
                            ? 'bg-[var(--color-green)] text-[var(--color-white)]'
                            : 'bg-[var(--color-white)]/15 text-[var(--color-white)]'
                        }`}
                      >
                        {isDoneSubStep ? '✓' : sIdx + 1}
                      </span>
                      <div>
                        <div className="text-[14px] font-bold text-[var(--color-white)]">
                          {mStep.title}
                        </div>
                        <div className="text-[12px] text-[var(--color-white)]/80 leading-relaxed mt-0.5">
                          {mStep.detail}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Patient Takeaway Highlight Box */}
            <div className="p-3 rounded-[var(--radius-sm)] bg-[#0B434C] border border-[var(--color-white)]/20 space-y-2">
              <div className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--color-neon-orange)]">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>معلومة تهمك كمريض:</span>
              </div>
              <p className="text-[12px] sm:text-[13px] text-[var(--color-white)]/95 leading-relaxed">
                {currentScene.patientTakeaway}
              </p>
            </div>
          </div>

          {/* Left Column (7 cols in RTL): Ultra-Clear Simulated App Browser Frame */}
          <div className="lg:col-span-7 flex flex-col rounded-[var(--radius-md)] bg-[var(--color-white)] text-[var(--color-primary-text)] border-2 border-[var(--color-white)]/30 shadow-[var(--shadow-lg)] overflow-hidden">
            {/* Simulated Browser Top Bar */}
            <div className="px-3.5 py-2 bg-[#EEF5F6] border-b border-[var(--color-border)] flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D94848]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#23845C]" />
                <span className="ms-2 text-[12px] font-bold text-[var(--color-dark-teal)]">
                  شاشة تطبيق موعدي الحية
                </span>
              </div>
              <div
                dir="ltr"
                className="px-2.5 py-0.5 rounded bg-[var(--color-white)] border border-[var(--color-border)] text-[11px] font-semibold text-[var(--color-secondary-text)] truncate max-w-[230px]"
              >
                https://{currentScene.simulatedUrl}
              </div>
            </div>

            {/* High-Clarity Scene Canvas (Crisp Light UI for 100% Readability) */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-[#F8FBFB] space-y-4">
              {/* SCENE 0: Fast Login & Medical Safety Alert */}
              {sceneIndex === 0 && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-[var(--color-dark-teal)]" />
                      <span className="text-[15px] font-bold text-[var(--color-dark-teal)]">
                        تسجيل دخول المريض وملف الأمان الطبي
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] text-[12px] font-bold">
                      {activeMicroStepIndex === 0
                        ? '١. إدخال رقم الموبايل'
                        : activeMicroStepIndex === 1
                        ? '٢. تأكيد كود الـ SMS'
                        : '٣. تفعيل تنبيه الحساسية للدكتور'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Phone & OTP Card */}
                    <div
                      className={`p-3.5 rounded-[var(--radius-md)] bg-[var(--color-white)] border-2 transition-all space-y-3 ${
                        activeMicroStepIndex <= 1
                          ? 'border-[var(--color-neon-orange)] shadow-sm'
                          : 'border-[var(--color-border)]'
                      }`}
                    >
                      <div>
                        <div className="text-[12px] font-bold text-[var(--color-secondary-text)] mb-1">
                          ١. رقم الموبايل المصري:
                        </div>
                        <div
                          dir="ltr"
                          className="h-10 px-3 rounded-[var(--radius-sm)] bg-[#F2F7F8] border border-[var(--color-dark-teal)] flex items-center justify-between font-bold tabular-nums text-[15px] text-[var(--color-dark-teal)]"
                        >
                          <span>+20 101 234 5678</span>
                          <CheckCircle2 className="w-4 h-4 text-[var(--color-green)]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-[12px] font-bold text-[var(--color-secondary-text)] mb-1">
                          <span>٢. كود التأكيد السريع (OTP):</span>
                          <span className="text-[11px] text-[var(--color-green)]">
                            تم الإرسال في ثانية ✓
                          </span>
                        </div>
                        <div dir="ltr" className="grid grid-cols-4 gap-2">
                          {['4', '8', '2', '9'].map((digit, dIdx) => {
                            const filled =
                              activeMicroStepIndex >= 1 ||
                              sceneProgressPct > dIdx * 8;
                            return (
                              <div
                                key={dIdx}
                                className={`h-10 rounded-[var(--radius-sm)] border-2 flex items-center justify-center font-bold tabular-nums text-[16px] transition-all ${
                                  filled
                                    ? 'bg-[var(--color-dark-teal)] text-[var(--color-white)] border-[var(--color-dark-teal)]'
                                    : 'bg-[var(--color-white)] text-[var(--color-secondary-text)] border-[var(--color-border)]'
                                }`}
                              >
                                {filled ? digit : '•'}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Medical Alert Banner Preview */}
                    <div
                      className={`p-3.5 rounded-[var(--radius-md)] border-2 transition-all flex flex-col justify-between space-y-2.5 ${
                        activeMicroStepIndex === 2
                          ? 'bg-[#FDF2F2] border-[#D94848] ring-2 ring-[#D94848]/30 shadow-sm'
                          : 'bg-[var(--color-white)] border-[var(--color-border)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#D94848]">
                          <ShieldCheck className="w-4 h-4" />
                          <span>٣. بطاقة تنبيه الدكتور الفورية</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#D94848] text-[var(--color-white)] text-[11px] font-bold">
                          هام جداً لسلامتك
                        </span>
                      </div>

                      <p className="text-[12px] text-[var(--color-primary-text)] leading-relaxed">
                        أول ما الدكتور يفتح ملفك في العيادة، بيظهرله تحذير واضح بأي حساسية دوائية أو أمراض مزمنة سجلتها:
                      </p>

                      <div className="space-y-1.5 pt-1">
                        <div className="px-2.5 py-1.5 rounded bg-[var(--color-white)] border border-[#D94848]/40 text-[12px] font-bold text-[#D94848] flex items-center justify-between">
                          <span>⚠️ حساسية مسجلة: البنسلين (Penicillin)</span>
                          <span>مفعل ✓</span>
                        </div>
                        <div className="px-2.5 py-1.5 rounded bg-[var(--color-light-teal)] text-[12px] font-bold text-[var(--color-dark-teal)] flex items-center justify-between">
                          <span>🩺 أمراض مزمنة: ضغط الدم المرتفع</span>
                          <span>مفعل ✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SCENE 1: Search, Filter & Compare 24 Doctors */}
              {sceneIndex === 1 && (
                <div className="space-y-3.5">
                  {/* Simulated Filter Bar */}
                  <div
                    className={`p-3 rounded-[var(--radius-md)] bg-[var(--color-white)] border-2 transition-all grid grid-cols-1 sm:grid-cols-3 gap-2 ${
                      activeMicroStepIndex === 0
                        ? 'border-[var(--color-neon-orange)]'
                        : 'border-[var(--color-border)]'
                    }`}
                  >
                    <div className="px-2.5 py-1.5 rounded bg-[var(--color-light-teal)] text-[12px] font-bold text-[var(--color-dark-teal)] flex items-center justify-between">
                      <span>التخصص: قلب وأوعية دموية</span>
                      <Stethoscope className="w-3.5 h-3.5" />
                    </div>
                    <div className="px-2.5 py-1.5 rounded bg-[var(--color-light-teal)] text-[12px] font-bold text-[var(--color-dark-teal)] flex items-center justify-between">
                      <span>المحافظة: القاهرة</span>
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="px-2.5 py-1.5 rounded bg-[var(--color-dark-teal)] text-[12px] font-bold text-[var(--color-white)] flex items-center justify-center gap-1.5">
                      <Search className="w-3.5 h-3.5" />
                      <span>٢٤ دكتور معتمد متاح</span>
                    </div>
                  </div>

                  {/* Doctor Comparison Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        name: 'د. أحمد محمود',
                        title: 'استشاري أمراض القلب والقسطرة',
                        loc: 'القاهرة — مدينة نصر (دار القلب)',
                        rating: '4.9',
                        reviews: '320 تقييم حقيقي',
                        exp: '18 سنة خبرة',
                        examFee: '350 ج.م',
                        consultFee: '150 ج.م',
                        selected: activeMicroStepIndex >= 1,
                      },
                      {
                        name: 'د. مريم عبد اللطيف',
                        title: 'استشاري النساء والتوليد والحقن المجهري',
                        loc: 'القاهرة — مصر الجديدة (الميرغني)',
                        rating: '4.9',
                        reviews: '410 تقييم حقيقي',
                        exp: '16 سنة خبرة',
                        examFee: '400 ج.م',
                        consultFee: '180 ج.م',
                        selected: false,
                      },
                    ].map((doc, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-[var(--radius-md)] bg-[var(--color-white)] border-2 transition-all flex flex-col justify-between space-y-2.5 ${
                          doc.selected
                            ? 'border-[var(--color-neon-orange)] shadow-md ring-2 ring-[var(--color-neon-orange)]/20'
                            : 'border-[var(--color-border)] opacity-90'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-[15px] text-[var(--color-dark-teal)]">
                              {doc.name}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FFF4E5] text-[#B45309] text-[12px] font-bold tabular-nums">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              {doc.rating}
                            </span>
                          </div>
                          <div className="text-[12px] font-semibold text-[var(--color-secondary-text)] mt-0.5">
                            {doc.title}
                          </div>
                          <div className="text-[11px] text-[var(--color-secondary-text)] mt-1 flex items-center gap-2">
                            <span>📍 {doc.loc}</span>
                            <span>· {doc.exp}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-[12px]">
                          <div>
                            <span className="text-[var(--color-secondary-text)]">الكشف: </span>
                            <strong className="text-[var(--color-dark-teal)] text-[14px]">
                              {doc.examFee}
                            </strong>
                            <span className="text-[11px] text-[var(--color-secondary-text)] ms-1">
                              (الاستشارة {doc.consultFee})
                            </span>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded font-bold text-[12px] inline-flex items-center gap-1 ${
                              doc.selected
                                ? 'bg-[var(--color-neon-orange)] text-[var(--color-white)]'
                                : 'bg-[var(--color-light-teal)] text-[var(--color-dark-teal)]'
                            }`}
                          >
                            <MousePointerClick className="w-3.5 h-3.5" />
                            <span>احجز الآن</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SCENE 2: 3-Step Booking & Instant Queue Number #025 */}
              {sceneIndex === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-stretch">
                  <div className="sm:col-span-7 p-3.5 rounded-[var(--radius-md)] bg-[var(--color-white)] border border-[var(--color-border)] space-y-3">
                    <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-2">
                      <span className="font-bold text-[14px] text-[var(--color-dark-teal)]">
                        خطوات تأكيد الحجز السريع (د. أحمد محمود)
                      </span>
                      <span className="text-[11px] font-bold text-[var(--color-green)]">
                        الدفع كاش بالعيادة ✓
                      </span>
                    </div>

                    {/* Step 1: Branch */}
                    <div
                      className={`p-2.5 rounded border text-[12px] flex items-center justify-between ${
                        activeMicroStepIndex === 0
                          ? 'border-[var(--color-neon-orange)] bg-[#FFF8F6]'
                          : 'border-[var(--color-border)] bg-[#F8FBFB]'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-[var(--color-dark-teal)]">
                          ١. فرع العيادة:
                        </span>{' '}
                        <span>عيادة دار القلب التخصصية — مدينة نصر</span>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-[var(--color-green)] shrink-0" />
                    </div>

                    {/* Step 2: Day & Shift */}
                    <div
                      className={`p-2.5 rounded border text-[12px] space-y-1.5 ${
                        activeMicroStepIndex === 1
                          ? 'border-[var(--color-neon-orange)] bg-[#FFF8F6]'
                          : 'border-[var(--color-border)] bg-[#F8FBFB]'
                      }`}
                    >
                      <div className="font-bold text-[var(--color-dark-teal)]">
                        ٢. اختار اليوم والفترة المناسبة لوقتك:
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 text-center">
                        <div className="py-1 px-1.5 rounded bg-[var(--color-white)] border border-[var(--color-border)] text-[11px]">
                          الخميس · صباحاً
                        </div>
                        <div className="py-1 px-1.5 rounded bg-[var(--color-dark-teal)] text-[var(--color-white)] font-bold text-[11px]">
                          اليوم · 06:30 م ✓
                        </div>
                        <div className="py-1 px-1.5 rounded bg-[var(--color-white)] border border-[var(--color-border)] text-[11px]">
                          السبت · مساءً
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] font-semibold text-[var(--color-secondary-text)] flex items-center justify-between pt-0.5">
                      <span>💳 مش محتاج فيزا — الدفع نقداً عند الوصول</span>
                      <span className="text-[var(--color-green)] font-bold">
                        بدون مصاريف إضافية
                      </span>
                    </div>
                  </div>

                  {/* Step 3: Issued Queue Ticket #025 */}
                  <div
                    className={`sm:col-span-5 p-4 rounded-[var(--radius-md)] bg-[var(--color-dark-teal)] text-[var(--color-white)] flex flex-col items-center justify-center text-center space-y-2 border-2 transition-all ${
                      activeMicroStepIndex === 2
                        ? 'border-[var(--color-neon-orange)] scale-[1.01] shadow-md'
                        : 'border-[var(--color-dark-teal)]'
                    }`}
                  >
                    <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-green)] text-[var(--color-white)] text-[11px] font-bold">
                      ✓ تم تأكيد حجزك فوراً
                    </span>
                    <div className="text-[12px] text-[var(--color-white)]/85">
                      رقم دورك الرسمي في طابور العيادة:
                    </div>
                    <div className="text-[38px] font-bold tabular-nums text-[var(--color-neon-orange)] leading-none py-1">
                      #025
                    </div>
                    <div className="text-[11px] text-[var(--color-white)]/80">
                      الفترة المسائية · 06:30 م · كشف عادي (350 ج.م)
                    </div>
                  </div>
                </div>
              )}

              {/* SCENE 3: Live Queue Tracker from Home */}
              {sceneIndex === 3 && (
                <div className="space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-[var(--color-neon-orange)]" />
                      <span className="font-bold text-[15px] text-[var(--color-dark-teal)]">
                        شاشة متابعة الطابور اللايف (تتحدث تلقائياً من بيتك)
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[var(--color-green)] text-[12px] font-bold">
                      <span className="w-2 h-2 rounded-full bg-[var(--color-green)]" />
                      متصل بالعيادة الآن (مباشر)
                    </span>
                  </div>

                  {/* 4 Big Live Queue Counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                    <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-dark-teal)] text-[var(--color-white)]">
                      <div className="text-[11px] text-[var(--color-white)]/80">رقم حجزك إنت</div>
                      <div className="text-[26px] font-bold tabular-nums text-[var(--color-neon-orange)]">
                        #025
                      </div>
                    </div>

                    <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-white)] border-2 border-[var(--color-neon-orange)]">
                      <div className="text-[11px] font-bold text-[var(--color-secondary-text)]">
                        جوّه الكشف دلوقتي
                      </div>
                      <div className="text-[26px] font-bold tabular-nums text-[var(--color-dark-teal)]">
                        {activeMicroStepIndex === 0
                          ? '#021'
                          : activeMicroStepIndex === 1
                          ? '#022'
                          : '#023'}
                      </div>
                    </div>

                    <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-white)] border border-[var(--color-border)]">
                      <div className="text-[11px] font-bold text-[var(--color-secondary-text)]">
                        فاضل كام مريض قبلك؟
                      </div>
                      <div className="text-[20px] font-bold tabular-nums text-[var(--color-primary-text)] mt-1">
                        {activeMicroStepIndex === 0
                          ? '3 مرضى'
                          : activeMicroStepIndex === 1
                          ? 'مريضين بس'
                          : 'مريض واحد!'}
                      </div>
                    </div>

                    <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-white)] border border-[var(--color-border)]">
                      <div className="text-[11px] font-bold text-[var(--color-secondary-text)]">
                        الوقت المتوقع لدخولك
                      </div>
                      <div className="text-[20px] font-bold tabular-nums text-[var(--color-green)] mt-1">
                        {activeMicroStepIndex === 0
                          ? '35 دقيقة'
                          : activeMicroStepIndex === 1
                          ? '20 دقيقة'
                          : '10 دقايق'}
                      </div>
                    </div>
                  </div>

                  {/* Smart Push Alert Banner */}
                  <div
                    className={`p-3 rounded-[var(--radius-md)] border-2 flex items-center justify-between gap-3 transition-all ${
                      activeMicroStepIndex >= 1
                        ? 'bg-[#FFF4E5] border-[var(--color-neon-orange)] text-[var(--color-primary-text)] shadow-xs'
                        : 'bg-[var(--color-light-teal)] border-[var(--color-border)] text-[var(--color-dark-teal)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-[12px] sm:text-[13px] font-bold">
                      <Bell className="w-5 h-5 text-[var(--color-neon-orange)] shrink-0" />
                      <span>
                        {activeMicroStepIndex >= 1
                          ? 'تنبيه ذكي من موعدي: دورك قرّب جداً (فاضل قبلك مريضين بس) — تقدر تتحرك للعيادة دلوقتي عشان تدخل على ميعادك بالظبط!'
                          : 'إنت قاعد مرتاح في بيتك، وأول ما الرقم يقرب من #025 هنبعتلك تنبيه صوتي ورسالة فوراً.'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* SCENE 4: Digital Prescription (PDF) & Permanent Medical History */}
              {sceneIndex === 4 && (
                <div className="space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[var(--color-border)]">
                    <div className="flex items-center gap-2">
                      <Pill className="w-5 h-5 text-[var(--color-neon-orange)]" />
                      <span className="font-bold text-[15px] text-[var(--color-dark-teal)]">
                        روشتة إلكترونية رسمية واضحة + أرشيفك الطبي الكامل
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--color-dark-teal)] text-[var(--color-white)] text-[12px] font-bold">
                      <Download className="w-3.5 h-3.5 text-[var(--color-neon-orange)]" />
                      <span>جاهزة للطباعة PDF</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-white)] border-2 border-[var(--color-dark-teal)]/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[14px] text-[var(--color-dark-teal)]">
                          ١. كونكور 5 مجم (Concor 5mg)
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] text-[11px] font-bold">
                          بعد الفطار
                        </span>
                      </div>
                      <div className="text-[12px] text-[var(--color-secondary-text)]">
                        الجرعة: قرص واحد يومياً صباحاً بعد الأكل · المدة: 30 يوماً
                      </div>
                    </div>

                    <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-white)] border-2 border-[var(--color-dark-teal)]/30 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[14px] text-[var(--color-dark-teal)]">
                          ٢. أتور 20 مجم (Ator 20mg)
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] text-[11px] font-bold">
                          بعد العشاء
                        </span>
                      </div>
                      <div className="text-[12px] text-[var(--color-secondary-text)]">
                        الجرعة: قرص واحد يومياً مساءً بعد العشاء · المدة: 30 يوماً
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] border border-[var(--color-border)] flex flex-wrap items-center justify-between gap-2 text-[12px]">
                    <div className="flex items-center gap-2 font-bold text-[var(--color-dark-teal)]">
                      <FileText className="w-4 h-4 text-[var(--color-neon-orange)]" />
                      <span>
                        محفوظة تلقائياً في سجلك الطبي مع التشخيص وموعد الاستشارة القادمة
                      </span>
                    </div>
                    <span className="font-bold text-[var(--color-green)]">
                      ✓ لا تضيع أبداً
                    </span>
                  </div>
                </div>
              )}

              {/* Bottom Bar inside Simulated App Screen: Direct Interactive CTA */}
              <div className="pt-2.5 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-2">
                <span className="text-[12px] font-semibold text-[var(--color-secondary-text)]">
                  عايز تجرب الخطوة دي بنفسك دلوقتي جوّه التطبيق؟
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setIsPlaying(false);
                    onCloseModal?.();
                    navigate(currentScene.actionPath);
                  }}
                >
                  {currentScene.actionLabel}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Synchronized Word-by-Word Karaoke Egyptian Arabic Subtitle Box */}
        <div className="mt-4 p-3.5 sm:p-4 rounded-[var(--radius-md)] bg-[#03181C] border border-[var(--color-white)]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2 text-[12px] font-bold text-[var(--color-neon-orange)]">
              <Volume2 className="w-4 h-4" />
              <span>
                النص الصوتي المسموع الآن ({activeVoiceProfile.nameAr} — لهجة مصرية طبيعية ١٠٠٪):
              </span>
            </div>
            <p className="text-[14px] sm:text-[16px] leading-relaxed font-semibold">
              {narrationWords.map((word, wIdx) => {
                const isSpoken = wIdx < highlightedWordCount;
                const isCurrentWord =
                  isPlaying &&
                  (wIdx === highlightedWordCount - 1 ||
                    wIdx === highlightedWordCount);
                return (
                  <React.Fragment key={wIdx}>
                    <span
                      className={`transition-colors duration-150 rounded px-0.5 ${
                        isCurrentWord
                          ? 'bg-[var(--color-neon-orange)] text-[var(--color-white)] font-bold'
                          : isSpoken
                          ? 'text-[var(--color-white)] font-bold'
                          : 'text-[var(--color-white)]/65'
                      }`}
                    >
                      {word}
                    </span>{' '}
                  </React.Fragment>
                );
              })}
            </p>
          </div>

          {/* Play / Next / Previous Scene Quick Navigation */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-center">
            {!isPlaying && (
              <button
                type="button"
                onClick={handleTogglePlay}
                aria-label="تشغيل الفيديو التوضيحي بالصوت المصري الطبيعي"
                className="px-3.5 py-2 rounded-[var(--radius-sm)] bg-[var(--color-neon-orange)] hover:bg-[var(--color-neon-orange-hover)] text-[13px] font-bold text-[var(--color-white)] inline-flex items-center gap-1.5 shadow-sm cursor-pointer transition-transform hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>تشغيل الصوت المصري الآن</span>
              </button>
            )}
            <button
              type="button"
              disabled={sceneIndex === 0}
              onClick={() => handleSelectScene(Math.max(0, sceneIndex - 1))}
              className="px-2.5 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-white)]/10 hover:bg-[var(--color-white)]/20 disabled:opacity-40 text-[12px] font-bold text-[var(--color-white)] inline-flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
              <span>السابق</span>
            </button>
            <button
              type="button"
              disabled={sceneIndex === EXPLAINER_SCENES.length - 1}
              onClick={() =>
                handleSelectScene(
                  Math.min(EXPLAINER_SCENES.length - 1, sceneIndex + 1)
                )
              }
              className="px-2.5 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-white)]/10 hover:bg-[var(--color-white)]/20 disabled:opacity-40 text-[12px] font-bold text-[var(--color-white)] inline-flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>الفصل التالي</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Bottom Studio Controls Bar (Timeline Scrubber + Play/Pause + Voice Switcher + Speed) */}
      <div className="px-4 sm:px-6 py-3 bg-[#041E24] border-t border-[var(--color-white)]/15 space-y-2.5">
        {/* Global Timeline Scrubber */}
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-bold tabular-nums text-[var(--color-neon-orange)]">
            {formatTimecode(currentTime)}
          </span>
          <input
            type="range"
            aria-label="شريط تقدم الفيديو التوضيحي"
            min={0}
            max={TOTAL_DURATION_SEC}
            step={0.2}
            value={currentTime}
            onChange={(e) => handleScrubTimeline(Number(e.target.value))}
            className="flex-1 h-2 accent-[var(--color-neon-orange)] cursor-pointer"
          />
          <span className="text-[12px] tabular-nums text-[var(--color-white)]/75">
            {formatTimecode(TOTAL_DURATION_SEC)}
          </span>
        </div>

        {/* Transport & Audio Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-neon-orange)] hover:bg-[var(--color-neon-orange-hover)] text-[var(--color-white)] text-[13px] font-bold cursor-pointer transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>إيقاف مؤقت</span>
                </>
              ) : sceneIndex === EXPLAINER_SCENES.length - 1 &&
                sceneElapsedSec >= currentScene.durationSec - 0.3 ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>إعادة التشغيل</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>تشغيل الشرح الصوتي</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSelectScene(0)}
              aria-label="إعادة الفيديو من الفصل الأول"
              className="px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-white)]/10 hover:bg-[var(--color-white)]/20 text-[12px] font-semibold text-[var(--color-white)] cursor-pointer"
            >
              من البداية
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMuted((m) => !m)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-white)]/10 hover:bg-[var(--color-white)]/20 text-[12px] font-semibold text-[var(--color-white)] cursor-pointer"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-[var(--color-neon-orange)]" />
                  <span>الصوت مكتوم</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[var(--color-green)]" />
                  <span>صوت مصري طبيعي ({activeVoiceProfile.nameAr})</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setPlaybackRate((r) => (r === 1 ? 1.25 : 1))}
              className="px-2.5 py-1.5 rounded-[var(--radius-sm)] bg-[var(--color-white)]/10 hover:bg-[var(--color-white)]/20 text-[12px] font-bold tabular-nums text-[var(--color-white)] cursor-pointer"
            >
              السرعة: {playbackRate}x
            </button>
          </div>
        </div>
      </div>
   </div>
  );
};

export const PatientExplainerVideoModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const [narratorVoice, setNarratorVoice] = useState<NarratorVoiceId>('salma');

  return (
    <Modal
      open={open}
      onClose={onClose}
      maxWidthClass="w-[99vw] max-w-[99vw]"
      overlayClassName="items-center justify-center bg-[#010C0F]/90 backdrop-blur-md p-1 sm:p-2"
      panelClassName="bg-[#031A20] rounded-[16px] sm:rounded-[20px] border border-cyan-400/35 ring-2 ring-[var(--color-neon-orange)]/35 shadow-[0_35px_120px_rgba(0,0,0,0.95)] h-[98dvh] max-h-[98dvh] flex flex-col overflow-hidden text-[var(--color-white)]"
      bodyClassName="p-0 flex flex-col flex-1 overflow-y-auto bg-[#031A20]"
      customHeader={
        <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-l from-[#041E24] via-[#072E35] to-[#0A434D] border-b border-[var(--color-white)]/15 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Right Section: Live Badge + Title + Dialect */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 rounded-xl bg-[var(--color-neon-orange)] text-[var(--color-white)] flex items-center justify-center shrink-0 shadow-md shadow-[var(--color-neon-orange)]/30">
              <Play className="w-5 h-5 fill-current" />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--color-neon-orange)] text-[var(--color-white)] text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  عرض سينمائي تفاعلي
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-white)]/15 text-[var(--color-white)] text-[11px] font-semibold">
                  لهجة مصرية طبيعية ١٠٠٪
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-[var(--color-white)]/10 text-[var(--color-white)]/80 text-[11px] font-semibold tabular-nums">
                  01:32 دقيقة
                </span>
              </div>
              <h2 className="text-[16px] sm:text-[19px] font-bold text-[var(--color-white)] leading-snug mt-0.5 truncate">
                الفيديو التوضيحي للمريض — دليل موعدي التفاعلي
              </h2>
            </div>
          </div>

          {/* Left Section: Voice Switcher + Close Button */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Egyptian Voice Switcher */}
            <div
              role="group"
              aria-label="اختيار المعلق الصوتي المصري"
              className="inline-flex items-center rounded-lg bg-[#041E24] p-1 border border-[var(--color-white)]/20"
            >
              {(['salma', 'karim'] as NarratorVoiceId[]).map((vId) => {
                const voice = NARRATOR_VOICES[vId];
                const selected = narratorVoice === vId;
                return (
                  <button
                    key={vId}
                    type="button"
                    onClick={() => setNarratorVoice(vId)}
                    className={`px-3 py-1.5 rounded-md text-[12px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      selected
                        ? 'bg-[var(--color-neon-orange)] text-[var(--color-white)] shadow-sm'
                        : 'text-[var(--color-white)]/80 hover:text-[var(--color-white)] hover:bg-[var(--color-white)]/10'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>بصوت {voice.nameAr}</span>
                  </button>
                );
              })}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="إغلاق الفيديو"
              title="إغلاق (Esc)"
              className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--color-white)]/10 hover:bg-[var(--color-neon-orange)] text-[var(--color-white)] transition-colors cursor-pointer border border-[var(--color-white)]/15 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      }
    >
      <PatientExplainerVideoPlayer
        autoPlay
        hideHeaderBar
        narratorVoice={narratorVoice}
        onVoiceChange={setNarratorVoice}
        onCloseModal={onClose}
      />
    </Modal>
  );
};
