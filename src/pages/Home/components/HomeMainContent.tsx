import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getActivityTypes,
  type ActivityTypeOption,
} from "../../../services/catalogService";
import { getSession } from "../../../services/session";
import { getAndStoreTodayChallenges, type UserChallenge } from "../../../services/challengeService";
import { getUserStreak } from "../../../services/streakService";

type ActivityModuleStyle = {
  icon: string;
  containerClass: string;
  iconClass: string;
  textClass: string;
};

const DEFAULT_ACTIVITY_TYPE_MODULES: ActivityTypeOption[] = [
  { id: 1, name: "Gramática", slug: "gramatica" },
  { id: 2, name: "Interpretação Textual", slug: "interpretacao-textual" },
];

type ChallengeCardStyle = {
  containerClass: string;
  textClass: string;
  subTextClass: string;
  progressClass: string;
};

const CHALLENGE_CARD_STYLES: ChallengeCardStyle[] = [
  {
    containerClass: "bg-[#D4EAFC] dark:bg-blue-900/30",
    textClass: "text-blue-900 dark:text-blue-100",
    subTextClass: "text-blue-700 dark:text-blue-200",
    progressClass: "bg-blue-500 dark:bg-blue-400",
  },
  {
    containerClass: "bg-[#A3E4A1]/60 dark:bg-emerald-900/30",
    textClass: "text-emerald-900 dark:text-emerald-100",
    subTextClass: "text-emerald-700 dark:text-emerald-200",
    progressClass: "bg-emerald-500 dark:bg-emerald-400",
  },
  {
    containerClass: "bg-[#FDE68A] dark:bg-amber-900/30",
    textClass: "text-amber-900 dark:text-amber-100",
    subTextClass: "text-amber-700 dark:text-amber-200",
    progressClass: "bg-amber-500 dark:bg-amber-400",
  },
];

function getChallengeUnitLabel(unit: string, targetValue: number): string {
  if (unit === "minutes") {
    return "min";
  }

  if (unit === "lessons") {
    return targetValue === 1 ? "lição" : "lições";
  }

  if (unit === "streak_exercises") {
    return targetValue === 1 ? "exercício" : "exercícios";
  }

  return unit;
}

function getChallengeProgress(challenge: UserChallenge): number {
  if (challenge.target_value <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, (challenge.current_value / challenge.target_value) * 100));
}

function getActivityModuleStyle(slug: string): ActivityModuleStyle {
  if (slug === "gramatica") {
    return {
      icon: "text_fields",
      containerClass: "bg-[#D4EAFC] dark:bg-blue-900/30",
      iconClass: "text-blue-700 dark:text-blue-200",
      textClass: "text-blue-900 dark:text-blue-100",
    };
  }

  if (slug === "interpretacao-textual") {
    return {
      icon: "auto_stories",
      containerClass: "bg-[#A3E4A1]/60 dark:bg-emerald-900/30",
      iconClass: "text-emerald-700 dark:text-emerald-200",
      textClass: "text-emerald-900 dark:text-emerald-100",
    };
  }

  return {
    icon: "menu_book",
    containerClass: "bg-neutral-100 dark:bg-neutral-800",
    iconClass: "text-neutral-700 dark:text-neutral-200",
    textClass: "text-neutral-900 dark:text-neutral-100",
  };
}

export function HomeMainContent() {
  const navigate = useNavigate();
  const [activityTypes, setActivityTypes] = useState<ActivityTypeOption[]>([]);
  const [loadingActivityTypes, setLoadingActivityTypes] = useState(false);
  const [dailyChallenges, setDailyChallenges] = useState<UserChallenge[]>([]);
  const [loadingChallenges, setLoadingChallenges] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    const fetchActivityTypes = async () => {
      setLoadingActivityTypes(true);

      try {
        const response = await getActivityTypes();
        setActivityTypes(response.activity_types);
      } catch {
        setActivityTypes(DEFAULT_ACTIVITY_TYPE_MODULES);
      } finally {
        setLoadingActivityTypes(false);
      }
    };

    fetchActivityTypes();
  }, []);

  useEffect(() => {
    const fetchDailyChallenges = async () => {
      const session = getSession();

      if (!session?.uuid || !session.token) {
        setDailyChallenges([]);
        return;
      }

      setLoadingChallenges(true);

      try {
        const response = await getAndStoreTodayChallenges(session.uuid, session.token);
        const sortedChallenges = [...response.challenges].sort((a, b) => a.position - b.position);
        setDailyChallenges(sortedChallenges);
      } catch {
        setDailyChallenges([]);
      } finally {
        setLoadingChallenges(false);
      }
    };

    fetchDailyChallenges();
  }, []);

  useEffect(() => {
    const fetchUserStreak = async () => {
      const session = getSession();

      if (!session?.uuid || !session.token) {
        setCurrentStreak(0);
        return;
      }

      try {
        const response = await getUserStreak(session.uuid, session.token);
        setCurrentStreak(response.current_streak);
      } catch {
        setCurrentStreak(0);
      }
    };

    fetchUserStreak();
  }, []);

  const studyModules = useMemo(() => {
    const source = activityTypes.length > 0 ? activityTypes : DEFAULT_ACTIVITY_TYPE_MODULES;

    return source.map((activityType) => ({
      ...activityType,
      ...getActivityModuleStyle(activityType.slug),
    }));
  }, [activityTypes]);

  return (
    <main className="flex-1 min-h-0 p-4 pb-24 md:p-6 md:pb-6 lg:p-8 lg:pb-8 overflow-y-auto">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white mb-5 leading-tight">
          Dashboard de Aprendizado
        </h1>

        <div className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FDE68A] dark:bg-amber-900/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-700 dark:text-amber-200">local_fire_department</span>
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white">Ofensiva Atual</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                  {currentStreak} {currentStreak === 1 ? "dia" : "dias"} seguidos de estudo
                </p>
              </div>
            </div>

            <p className="text-sm md:text-base font-semibold text-neutral-700 dark:text-neutral-200 sm:max-w-[320px] sm:text-right">
              Cada dia de prática é um passo real rumo à fluência.
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-3 md:gap-4 lg:gap-5">
        {studyModules.map((module, index) => (
          <button
            key={module.id}
            type="button"
            onClick={() => navigate(`/questionnaire?activityTypeId=${module.id}`)}
            disabled={loadingActivityTypes}
            className={`${module.containerClass} p-4 md:p-5 rounded-2xl md:rounded-large flex flex-col justify-between min-h-[130px] md:min-h-[150px] hover:opacity-90 transition-all text-left md:col-start-1 ${
              index === 0 ? "md:row-start-1" : "md:row-start-2"
            } ${loadingActivityTypes ? "opacity-80 cursor-not-allowed" : ""}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-white/60 flex items-center justify-center">
                <span className={`material-symbols-outlined ${module.iconClass}`}>
                  {module.icon}
                </span>
              </div>
              <span className={`font-bold text-sm md:text-base lg:text-lg ${module.textClass}`}>{module.name}</span>
            </div>

            <div className="flex items-center">
              <span className={`material-symbols-outlined ${module.textClass} ml-auto`}>arrow_forward</span>
            </div>
          </button>
        ))}

        <div className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-2xl md:rounded-large border border-neutral-100 dark:border-neutral-700 shadow-sm md:col-start-2 md:row-start-1 md:row-span-2 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#D4EAFC] dark:bg-blue-900/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-700 dark:text-blue-200">target</span>
            </div>
            <h3 className="font-bold text-neutral-900 dark:text-white text-lg">Desafios do Dia</h3>
          </div>

          <ul className="space-y-3">
            {dailyChallenges.map((challenge, index) => {
              const cardStyle =
                CHALLENGE_CARD_STYLES[index] ?? {
                  containerClass: "bg-neutral-100 dark:bg-neutral-700",
                  textClass: "text-neutral-900 dark:text-neutral-100",
                  subTextClass: "text-neutral-600 dark:text-neutral-300",
                  progressClass: "bg-neutral-500 dark:bg-neutral-400",
                };

              const progress = getChallengeProgress(challenge);
              const progressLabel = `${challenge.current_value}/${challenge.target_value} ${getChallengeUnitLabel(
                challenge.unit,
                challenge.target_value,
              )}`;

              return (
                <li
                  key={challenge.id}
                  className={`${cardStyle.containerClass} rounded-2xl px-4 py-3`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className={`text-sm md:text-base ${cardStyle.textClass} font-semibold leading-snug`}>
                      {challenge.challenge_name}
                    </p>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <span className={`text-[11px] md:text-xs ${cardStyle.subTextClass} font-bold`}>
                        {progressLabel}
                      </span>
                      <span className="text-[10px] md:text-xs font-extrabold px-2 py-1 rounded-full bg-white/80 dark:bg-neutral-600 text-neutral-800 dark:text-neutral-100">
                        {challenge.xp_reward}XP
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2 rounded-full bg-white/80 dark:bg-neutral-600 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cardStyle.progressClass}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </li>
              );
            })}
            {!loadingChallenges && dailyChallenges.length === 0 && (
              <li className="rounded-2xl px-4 py-3 bg-neutral-100 dark:bg-neutral-700">
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  Nenhum desafio disponível para hoje.
                </p>
              </li>
            )}
            {loadingChallenges && (
              <li className="rounded-2xl px-4 py-3 bg-neutral-100 dark:bg-neutral-700">
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  Carregando desafios...
                </p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}
