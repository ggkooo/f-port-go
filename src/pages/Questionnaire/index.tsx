import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppLeftSidebar, BrowserHeader, ConfirmationModal, PageContainer } from "../../components";
import {
  getActivityTypes,
  getClasses,
  getDifficulties,
  type ActivityTypeOption,
  type ClassOption,
} from "../../services/catalogService";
import { getProfile } from "../../services/profileService";
import { getSession } from "../../services/session";
import {
  getAndStoreTodayChallenges,
  syncChallengeProgressFromSession,
} from "../../services/challengeService";
import { syncTodayStreakCompletion } from "../../services/streakService";
import { updateUserXp } from "../../services/xpService";
import {
  HELP_ACTIONS,
  OPTION_STYLE_BY_INDEX,
  getDifficultyMeta,
  resolveDifficultyXp,
} from "./data";
import {
  DifficultySelectionStep,
  FinishedStep,
  GradeSelectionStep,
  QuestionnaireRightPanel,
  QuizStep,
  ReadyStep,
  StepIndicator,
} from "./components";
import type { AnswerResult, DifficultyKey } from "./types";
import type { QuizQuestion } from "./types";
import { getQuestions } from "../../services/questionService";

const MIN_QUESTION_QUANTITY = 10;
const MAX_QUESTION_QUANTITY = 15;

function getRandomQuestionQuantity(): number {
  return Math.floor(Math.random() * (MAX_QUESTION_QUANTITY - MIN_QUESTION_QUANTITY + 1)) + MIN_QUESTION_QUANTITY;
}

function getOptionIndexByAlternative(alternative: "a" | "b" | "c" | "d"): number {
  const optionIndexByAlternative: Record<"a" | "b" | "c" | "d", number> = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
  };

  return optionIndexByAlternative[alternative];
}

function Questionnaire() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activityTypeIdParam = searchParams.get("activityTypeId");
  const selectedActivityTypeId = activityTypeIdParam ? Number(activityTypeIdParam) : null;

  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [gradeOptions, setGradeOptions] = useState<ClassOption[]>([]);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [gradesError, setGradesError] = useState<string | null>(null);
  const [activityTypes, setActivityTypes] = useState<ActivityTypeOption[]>([]);
  const [loadingActivityTypes, setLoadingActivityTypes] = useState(false);
  const [activityTypesError, setActivityTypesError] = useState<string | null>(null);
  const [profileClassValue, setProfileClassValue] = useState<string | null>(null);
  const [difficultyOptions, setDifficultyOptions] = useState<{ key: number; label: string; xp: number; containerClass: string; textClass: string; badgeClass: string; }[]>([]);
  const [loadingDifficulties, setLoadingDifficulties] = useState(false);
  const [difficultiesError, setDifficultiesError] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyKey | null>(null);
  const [hasStartedQuiz, setHasStartedQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState<string | null>(null);

  const [currentRoundQuestionIds, setCurrentRoundQuestionIds] = useState<number[]>([]);
  const [currentQuestionPointer, setCurrentQuestionPointer] = useState(0);
  const [pendingRetryQuestionIds, setPendingRetryQuestionIds] = useState<number[]>([]);
  const [retryRoundNumber, setRetryRoundNumber] = useState(0);

  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [lastAnswerResult, setLastAnswerResult] = useState<AnswerResult | null>(null);
  const [helpMessage, setHelpMessage] = useState<string | null>(null);
  const [helpUsage, setHelpUsage] = useState({ hint: false, removeTwo: false, skipQuestion: false });
  const [hiddenOptionsByQuestionId, setHiddenOptionsByQuestionId] = useState<Record<number, number[]>>({});

  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [storedBestStreak, setStoredBestStreak] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [quizStartedAtMs, setQuizStartedAtMs] = useState<number | null>(null);
  const [challengeSyncStatus, setChallengeSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");
  const [challengeSyncError, setChallengeSyncError] = useState<string | null>(null);
  const [xpSyncStatus, setXpSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");
  const [xpSyncError, setXpSyncError] = useState<string | null>(null);
  const [isQuizFinished, setIsQuizFinished] = useState(false);
  const [isExitConfirmationOpen, setIsExitConfirmationOpen] = useState(false);
  const isQuizInProgress = hasStartedQuiz && !isQuizFinished;

  const selectedDifficultyData = difficultyOptions.find((option) => option.key === selectedDifficulty);
  const lessonXpAmount = selectedDifficultyData
    ? resolveDifficultyXp(selectedDifficultyData.key, selectedDifficultyData.label)
    : 0;
  const selectedActivityType = useMemo(
    () => activityTypes.find((activityType) => activityType.id === selectedActivityTypeId) ?? null,
    [activityTypes, selectedActivityTypeId],
  );
  const activityLabel = selectedActivityType?.name ?? "Atividade";

  const currentRoundQuestions = useMemo(
    () =>
      currentRoundQuestionIds
        .map((id) => quizQuestions.find((question) => question.id === id))
        .filter((question): question is (typeof quizQuestions)[number] => Boolean(question)),
    [currentRoundQuestionIds, quizQuestions],
  );

  const currentQuestion = currentRoundQuestions[currentQuestionPointer] ?? null;
  const isLastInRound = currentQuestionPointer === currentRoundQuestions.length - 1;
  const earnedXp = isQuizFinished ? lessonXpAmount : 0;
  const progressPercentage = currentRoundQuestions.length
    ? Math.round(((currentQuestionPointer + 1) / currentRoundQuestions.length) * 100)
    : 0;

  const currentStep = useMemo(() => {
    if (!selectedGrade) {
      return 1;
    }

    if (!selectedDifficulty) {
      return 2;
    }

    return 3;
  }, [selectedGrade, selectedDifficulty]);

  const recommendedGrade = useMemo(() => {
    if (!profileClassValue) {
      return null;
    }

    const matchedGrade = gradeOptions.find(
      (grade) => String(grade.id) === profileClassValue || grade.name === profileClassValue,
    );

    return matchedGrade?.name ?? null;
  }, [gradeOptions, profileClassValue]);

  const streakStorageKey = useMemo(
    () => `portgo.quiz.bestStreak.activityType.${selectedActivityTypeId ?? "unknown"}`,
    [selectedActivityTypeId],
  );
  const metricsStorageKey = useMemo(
    () => `portgo.quiz.sessionMetrics.activityType.${selectedActivityTypeId ?? "unknown"}`,
    [selectedActivityTypeId],
  );

  useEffect(() => {
    const fetchActivityTypes = async () => {
      setLoadingActivityTypes(true);
      setActivityTypesError(null);

      try {
        const response = await getActivityTypes();
        setActivityTypes(response.activity_types);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os tipos de atividade.";
        setActivityTypesError(message);
        setActivityTypes([]);
      } finally {
        setLoadingActivityTypes(false);
      }
    };

    fetchActivityTypes();
  }, []);

  useEffect(() => {
    const fetchProfileClass = async () => {
      const session = getSession();

      if (!session) {
        setProfileClassValue(null);
        return;
      }

      try {
        const { user } = await getProfile(session.uuid, session.token);
        setProfileClassValue(user.class !== null ? String(user.class) : null);
      } catch {
        setProfileClassValue(null);
      }
    };

    fetchProfileClass();
  }, []);

  useEffect(() => {
    const fetchDifficulties = async () => {
      setLoadingDifficulties(true);
      setDifficultiesError(null);

      try {
        const response = await getDifficulties();
        const mappedDifficulties = response.difficulties.map((difficulty) => ({
          key: difficulty.id,
          label: difficulty.name,
          ...getDifficultyMeta(difficulty.name),
        }));

        setDifficultyOptions(mappedDifficulties);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as dificuldades.";
        setDifficultiesError(message);
        setDifficultyOptions([]);
      } finally {
        setLoadingDifficulties(false);
      }
    };

    fetchDifficulties();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      setLoadingGrades(true);
      setGradesError(null);

      try {
        const response = await getClasses();
        setGradeOptions(response.classes);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as séries.";
        setGradesError(message);
        setGradeOptions([]);
      } finally {
        setLoadingGrades(false);
      }
    };

    fetchClasses();
  }, []);

  useEffect(() => {
    if (!selectedGrade) {
      return;
    }

    const hasSelectedGrade = gradeOptions.some((grade) => grade.name === selectedGrade);
    if (!hasSelectedGrade) {
      setSelectedGrade(null);
      resetQuizState();
    }
  }, [gradeOptions, selectedGrade]);

  useEffect(() => {
    if (selectedDifficulty === null) {
      return;
    }

    const hasSelectedDifficulty = difficultyOptions.some((difficulty) => difficulty.key === selectedDifficulty);
    if (!hasSelectedDifficulty) {
      setSelectedDifficulty(null);
      resetQuizState();
    }
  }, [difficultyOptions, selectedDifficulty]);

  useEffect(() => {
    const rawValue = window.localStorage.getItem(streakStorageKey);
    const parsedValue = rawValue ? Number(rawValue) : 0;
    const safeValue = Number.isFinite(parsedValue) ? parsedValue : 0;

    setStoredBestStreak(safeValue);
    setBestStreak(0);
    setCurrentStreak(0);
  }, [streakStorageKey]);

  useEffect(() => {
    if (bestStreak > storedBestStreak) {
      window.localStorage.setItem(streakStorageKey, String(bestStreak));
      setStoredBestStreak(bestStreak);
    }
  }, [bestStreak, storedBestStreak, streakStorageKey]);

  useEffect(() => {
    const session = getSession();

    if (!session?.uuid || !session.token) {
      return;
    }

    getAndStoreTodayChallenges(session.uuid, session.token).catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!hasStartedQuiz || isQuizFinished || quizStartedAtMs === null) {
      return;
    }

    const intervalId = window.setInterval(() => {
      const nextElapsedSeconds = Math.max(0, Math.floor((Date.now() - quizStartedAtMs) / 1000));
      setElapsedSeconds(nextElapsedSeconds);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [hasStartedQuiz, isQuizFinished, quizStartedAtMs]);

  useEffect(() => {
    if (!isQuizFinished || challengeSyncStatus !== "idle") {
      return;
    }

    const session = getSession();
    if (!session?.uuid || !session.token) {
      return;
    }

    const elapsedMinutesRounded = Math.max(0, Math.round(elapsedSeconds / 60));
    const consecutiveCorrectAnswers = Math.max(0, Math.round(bestStreak));
    const sessionMetrics = {
      elapsedMinutesRounded,
      completedLessons: 1,
      consecutiveCorrectAnswers,
    };

    window.localStorage.setItem(metricsStorageKey, JSON.stringify(sessionMetrics));
    setChallengeSyncStatus("syncing");
    setChallengeSyncError(null);

    syncTodayStreakCompletion(session.uuid, session.token).catch(() => undefined);

    syncChallengeProgressFromSession(session.uuid, session.token, sessionMetrics)
      .then(() => {
        setChallengeSyncStatus("success");
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : "Não foi possível atualizar os desafios do dia.";
        setChallengeSyncStatus("error");
        setChallengeSyncError(message);
      });
  }, [bestStreak, challengeSyncStatus, elapsedSeconds, isQuizFinished, metricsStorageKey]);

  useEffect(() => {
    if (!isQuizFinished || xpSyncStatus !== "idle" || !selectedDifficultyData) {
      return;
    }

    const session = getSession();
    if (!session?.uuid || !session.token) {
      return;
    }

    setXpSyncStatus("syncing");
    setXpSyncError(null);

    updateUserXp(session.uuid, lessonXpAmount, session.token)
      .then(() => {
        setXpSyncStatus("success");
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : "Não foi possível atualizar o XP da lição.";
        setXpSyncStatus("error");
        setXpSyncError(message);
      });
  }, [isQuizFinished, lessonXpAmount, selectedDifficultyData, xpSyncStatus]);

  useEffect(() => {
    if (!isQuizInProgress) {
      return;
    }

    const currentUrl = window.location.href;
    window.history.pushState({ questionnaireLocked: true }, "", currentUrl);

    const handlePopState = () => {
      window.history.pushState({ questionnaireLocked: true }, "", currentUrl);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isQuizInProgress]);

  const resetQuizState = () => {
    setHasStartedQuiz(false);
    setQuizQuestions([]);
    setLoadingQuestions(false);
    setQuestionsError(null);
    setCurrentRoundQuestionIds([]);
    setCurrentQuestionPointer(0);
    setPendingRetryQuestionIds([]);
    setRetryRoundNumber(0);
    setSelectedOptionIndex(null);
    setLastAnswerResult(null);
    setHelpMessage(null);
    setHelpUsage({ hint: false, removeTwo: false, skipQuestion: false });
    setHiddenOptionsByQuestionId({});
    setCurrentStreak(0);
    setBestStreak(0);
    setElapsedSeconds(0);
    setQuizStartedAtMs(null);
    setChallengeSyncStatus("idle");
    setChallengeSyncError(null);
    setXpSyncStatus("idle");
    setXpSyncError(null);
    setIsQuizFinished(false);
  };

  const handleStartQuiz = () => {
    const selectedClass = gradeOptions.find((grade) => grade.name === selectedGrade);

    if (!selectedClass || selectedDifficulty === null || selectedActivityTypeId === null || Number.isNaN(selectedActivityTypeId)) {
      setQuestionsError("Selecione uma atividade, série e dificuldade para iniciar o questionário.");
      return;
    }

    if (!selectedActivityType) {
      setQuestionsError("Tipo de atividade inválido. Volte para a home e selecione uma atividade.");
      return;
    }

    const loadQuestions = async () => {
      const randomQuestionQuantity = getRandomQuestionQuantity();

      setLoadingQuestions(true);
      setQuestionsError(null);

      try {
        const response = await getQuestions({
          class_id: String(selectedClass.id),
          difficulty_id: String(selectedDifficulty),
          activity_type_id: String(selectedActivityTypeId),
          quantity: String(randomQuestionQuantity),
        });

        const mappedQuestions: QuizQuestion[] = response.questions.map((question) => ({
          id: question.id,
          statement: question.statement,
          options: [
            question.alternative_a,
            question.alternative_b,
            question.alternative_c,
            question.alternative_d,
          ],
          correctOptionIndex: getOptionIndexByAlternative(question.correct_alternative),
          tip: question.tip,
        }));

        if (mappedQuestions.length === 0) {
          setQuestionsError("Nenhuma questão disponível para os filtros selecionados.");
          return;
        }

        setQuizQuestions(mappedQuestions);
        setHasStartedQuiz(true);
        setCurrentRoundQuestionIds(mappedQuestions.map((question) => question.id));
        setCurrentQuestionPointer(0);
        setPendingRetryQuestionIds([]);
        setRetryRoundNumber(0);
        setSelectedOptionIndex(null);
        setLastAnswerResult(null);
        setHelpMessage(null);
        setHelpUsage({ hint: false, removeTwo: false, skipQuestion: false });
        setHiddenOptionsByQuestionId({});
        setCurrentStreak(0);
        setBestStreak(0);
        setElapsedSeconds(0);
        setQuizStartedAtMs(Date.now());
        setChallengeSyncStatus("idle");
        setChallengeSyncError(null);
        setXpSyncStatus("idle");
        setXpSyncError(null);
        setIsQuizFinished(false);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Não foi possível carregar as questões.";
        setQuestionsError(message);
        setHasStartedQuiz(false);
      } finally {
        setLoadingQuestions(false);
      }
    };

    loadQuestions();
  };

  const advanceQuestionFlow = (nextRetryList: number[]) => {
    setHelpMessage(null);

    if (isLastInRound) {
      if (nextRetryList.length > 0) {
        setCurrentRoundQuestionIds(nextRetryList);
        setPendingRetryQuestionIds([]);
        setCurrentQuestionPointer(0);
        setRetryRoundNumber((previousValue) => previousValue + 1);
      } else {
        if (quizStartedAtMs !== null) {
          setElapsedSeconds(Math.max(0, Math.floor((Date.now() - quizStartedAtMs) / 1000)));
        }
        setHasStartedQuiz(false);
        setIsQuizFinished(true);
      }

      setSelectedOptionIndex(null);
      return;
    }

    setPendingRetryQuestionIds(nextRetryList);
    setCurrentQuestionPointer((previousValue) => previousValue + 1);
    setSelectedOptionIndex(null);
  };

  const handleAnswerAndContinue = () => {
    if (!currentQuestion || selectedOptionIndex === null) {
      return;
    }

    const isCorrect = selectedOptionIndex === currentQuestion.correctOptionIndex;
    const nextRetryList = isCorrect
      ? pendingRetryQuestionIds
      : pendingRetryQuestionIds.includes(currentQuestion.id)
        ? pendingRetryQuestionIds
        : [...pendingRetryQuestionIds, currentQuestion.id];

    if (isCorrect) {
      const nextStreak = currentStreak + 1;
      setCurrentStreak(nextStreak);
      setBestStreak((previousValue) => (nextStreak > previousValue ? nextStreak : previousValue));
      setLastAnswerResult("correct");
    } else {
      setCurrentStreak(0);
      setLastAnswerResult("wrong");
    }

    advanceQuestionFlow(nextRetryList);
  };

  const handleUseHint = () => {
    if (!hasStartedQuiz || !currentQuestion || helpUsage.hint) {
      return;
    }

    setHelpUsage((previousValue) => ({ ...previousValue, hint: true }));
    setHelpMessage(currentQuestion.tip ?? "DICA: Leia com calma o enunciado e elimine alternativas inconsistentes.");
  };

  const handleUseRemoveThree = () => {
    if (!hasStartedQuiz || !currentQuestion || helpUsage.removeTwo) {
      return;
    }

    const wrongIndexes = currentQuestion.options
      .map((_, index) => index)
      .filter((index) => index !== currentQuestion.correctOptionIndex);

    setHelpUsage((previousValue) => ({ ...previousValue, removeTwo: true }));
    setHiddenOptionsByQuestionId((previousValue) => ({
      ...previousValue,
      [currentQuestion.id]: wrongIndexes.slice(0, 2),
    }));
    if (selectedOptionIndex !== null && wrongIndexes.slice(0, 2).includes(selectedOptionIndex)) {
      setSelectedOptionIndex(null);
    }
    setHelpMessage("REMOVER 2 ALTERNATIVAS aplicado nesta questão.");
  };

  const handleUseSkipQuestion = () => {
    if (!hasStartedQuiz || !currentQuestion || helpUsage.skipQuestion) {
      return;
    }

    const nextRetryList = pendingRetryQuestionIds.includes(currentQuestion.id)
      ? pendingRetryQuestionIds
      : [...pendingRetryQuestionIds, currentQuestion.id];

    setHelpUsage((previousValue) => ({ ...previousValue, skipQuestion: true }));
    setCurrentStreak(0);
    setLastAnswerResult("wrong");
    setHelpMessage("PULAR QUESTÃO usado: esta questão foi enviada para revisão no final da rodada.");
    advanceQuestionFlow(nextRetryList);
  };

  const handleExitQuestionnaire = () => {
    if (!isQuizInProgress) {
      navigate("/");
      return;
    }

    setIsExitConfirmationOpen(true);
  };

  const handleCancelExitQuestionnaire = () => {
    setIsExitConfirmationOpen(false);
  };

  const handleConfirmExitQuestionnaire = () => {
    setIsExitConfirmationOpen(false);
    resetQuizState();
    navigate("/");
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center px-0 pt-0 pb-0 sm:px-2 sm:pt-2 sm:pb-0 md:px-4 md:pt-4 md:pb-0 lg:p-4">
      <PageContainer>
        <BrowserHeader />

        <div className="flex flex-1 min-h-0 bg-[#F0F4F8] dark:bg-neutral-950 overflow-hidden">
          <AppLeftSidebar navigationLocked={isQuizInProgress} />

          <main className="flex-1 min-h-0 p-4 pb-24 md:p-6 md:pb-6 lg:p-8 lg:pb-8 flex flex-col overflow-hidden">
            <header className="mb-6 flex items-start sm:items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white mb-2 leading-tight">
                  Preparação do Questionário
                </h1>
                <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300">
                  Atividade: <span className="font-bold">{activityLabel}</span>
                </p>
                {activityTypesError && (
                  <p className="text-xs text-amber-700 dark:text-amber-200 mt-1">{activityTypesError}</p>
                )}
              </div>

              <button
                type="button"
                onClick={handleExitQuestionnaire}
                className="px-4 py-2 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm font-semibold text-neutral-700 dark:text-neutral-200"
              >
                {isQuizInProgress ? "Desistir" : "Voltar"}
              </button>
            </header>

            <section className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-large border border-neutral-100 dark:border-neutral-700 shadow-sm flex-1 min-h-0 overflow-auto">
              <StepIndicator currentStep={currentStep} />

              {!selectedGrade && (
                <GradeSelectionStep
                  grades={gradeOptions}
                  isLoading={loadingGrades}
                  errorMessage={gradesError}
                  onRetryLoad={async () => {
                    setLoadingGrades(true);
                    setGradesError(null);

                    try {
                      const response = await getClasses();
                      setGradeOptions(response.classes);
                    } catch (error) {
                      const message =
                        error instanceof Error
                          ? error.message
                          : "Não foi possível carregar as séries.";
                      setGradesError(message);
                      setGradeOptions([]);
                    } finally {
                      setLoadingGrades(false);
                    }
                  }}
                  recommendedGrade={recommendedGrade}
                  onSelectGrade={(grade) => {
                    setSelectedGrade(grade);
                    setSelectedDifficulty(null);
                    resetQuizState();
                  }}
                />
              )}

              {selectedGrade && !selectedDifficulty && (
                <DifficultySelectionStep
                  selectedGrade={selectedGrade}
                  options={difficultyOptions}
                  isLoading={loadingDifficulties}
                  errorMessage={difficultiesError}
                  onRetryLoad={async () => {
                    setLoadingDifficulties(true);
                    setDifficultiesError(null);

                    try {
                      const response = await getDifficulties();
                      const mappedDifficulties = response.difficulties.map((difficulty) => ({
                        key: difficulty.id,
                        label: difficulty.name,
                        ...getDifficultyMeta(difficulty.name),
                      }));

                      setDifficultyOptions(mappedDifficulties);
                    } catch (error) {
                      const message =
                        error instanceof Error
                          ? error.message
                          : "Não foi possível carregar as dificuldades.";
                      setDifficultiesError(message);
                      setDifficultyOptions([]);
                    } finally {
                      setLoadingDifficulties(false);
                    }
                  }}
                  onSelectDifficulty={(difficulty) => {
                    setSelectedDifficulty(difficulty);
                    resetQuizState();
                  }}
                  onBackToGrades={() => {
                    setSelectedGrade(null);
                    resetQuizState();
                  }}
                />
              )}

              {selectedGrade && selectedDifficulty && selectedDifficultyData && !hasStartedQuiz && !isQuizFinished && (
                <ReadyStep
                  activityLabel={activityLabel}
                  selectedGrade={selectedGrade}
                  selectedDifficultyLabel={selectedDifficultyData.label}
                  lessonXp={lessonXpAmount}
                  questionCountLabel={`${MIN_QUESTION_QUANTITY} a ${MAX_QUESTION_QUANTITY} (sorteado ao iniciar)`}
                  isLoading={loadingQuestions || loadingActivityTypes}
                  onStartQuiz={handleStartQuiz}
                />
              )}

              {selectedGrade && selectedDifficulty && selectedDifficultyData && !hasStartedQuiz && !isQuizFinished && questionsError && (
                <div className="mt-4 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-4">
                  <p className="text-sm font-medium text-red-700 dark:text-red-200">{questionsError}</p>
                </div>
              )}

              {selectedGrade && selectedDifficulty && selectedDifficultyData && hasStartedQuiz && currentQuestion && (
                <QuizStep
                  activityLabel={activityLabel}
                  retryRoundNumber={retryRoundNumber}
                  currentQuestionPointer={currentQuestionPointer}
                  currentRoundLength={currentRoundQuestions.length}
                  currentStreak={currentStreak}
                  elapsedSeconds={elapsedSeconds}
                  progressPercentage={progressPercentage}
                  lastAnswerResult={lastAnswerResult}
                  helpMessage={helpMessage}
                  currentQuestion={currentQuestion}
                  selectedOptionIndex={selectedOptionIndex}
                  hiddenOptionIndexes={hiddenOptionsByQuestionId[currentQuestion.id] ?? []}
                  optionStyles={OPTION_STYLE_BY_INDEX}
                  helpActions={HELP_ACTIONS}
                  helpUsage={helpUsage}
                  onUseHint={handleUseHint}
                  onUseRemoveThree={handleUseRemoveThree}
                  onUseSkipQuestion={handleUseSkipQuestion}
                  onSelectOption={setSelectedOptionIndex}
                  onAnswerAndContinue={handleAnswerAndContinue}
                />
              )}

              {selectedGrade && selectedDifficulty && selectedDifficultyData && isQuizFinished && (
                <>
                  <FinishedStep earnedXp={earnedXp} bestStreak={bestStreak} onBackHome={() => navigate("/")} />
                  {xpSyncStatus === "syncing" && (
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300 mt-3">
                      Computando XP da lição...
                    </p>
                  )}
                  {xpSyncStatus === "success" && (
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mt-3">
                      XP da lição computado com sucesso.
                    </p>
                  )}
                  {xpSyncStatus === "error" && (
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mt-3">
                      {xpSyncError ?? "Não foi possível computar o XP da lição."}
                    </p>
                  )}
                  {challengeSyncStatus === "syncing" && (
                    <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300 mt-3">
                      Atualizando progresso dos desafios do dia...
                    </p>
                  )}
                  {challengeSyncStatus === "success" && (
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 mt-3">
                      Progresso dos desafios atualizado com sucesso.
                    </p>
                  )}
                  {challengeSyncStatus === "error" && (
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-300 mt-3">
                      {challengeSyncError ?? "Não foi possível atualizar os desafios do dia."}
                    </p>
                  )}
                </>
              )}
            </section>
          </main>

          <QuestionnaireRightPanel
            helpActions={HELP_ACTIONS}
            activityLabel={activityLabel}
            selectedGrade={selectedGrade}
            selectedDifficultyLabel={selectedDifficultyData?.label}
            lessonXp={selectedDifficultyData ? lessonXpAmount : undefined}
            currentStreak={currentStreak}
            bestStreak={bestStreak}
            storedBestStreak={storedBestStreak}
            isQuizActive={hasStartedQuiz && !!currentQuestion && !isQuizFinished}
            helpUsage={helpUsage}
            onUseHint={handleUseHint}
            onUseRemoveThree={handleUseRemoveThree}
            onUseSkipQuestion={handleUseSkipQuestion}
          />
        </div>

        <ConfirmationModal
          isOpen={isExitConfirmationOpen}
          title="Desistir da lição?"
          description="Se você sair agora, o progresso desta sessão não será contabilizado nos desafios."
          confirmLabel="Desistir"
          cancelLabel="Continuar"
          onConfirm={handleConfirmExitQuestionnaire}
          onCancel={handleCancelExitQuestionnaire}
        />
      </PageContainer>
    </div>
  );
}

export default Questionnaire;
