import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppLeftSidebar, BrowserHeader, PageContainer } from "../../components";
import {
  getClasses,
  getDifficulties,
  type ClassOption,
} from "../../services/catalogService";
import { getProfile } from "../../services/profileService";
import { getSession } from "../../services/session";
import {
  ACTIVITY_LABELS,
  HELP_ACTIONS,
  OPTION_STYLE_BY_INDEX,
  getDifficultyMeta,
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
import type { ActivityKey, AnswerResult, DifficultyKey } from "./types";
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

  const activityParam = searchParams.get("activity") ?? searchParams.get("atividade");
  const activity: ActivityKey = activityParam === "grammar" || activityParam === "reading" ? activityParam : "grammar";

  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [gradeOptions, setGradeOptions] = useState<ClassOption[]>([]);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [gradesError, setGradesError] = useState<string | null>(null);
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
  const [isQuizFinished, setIsQuizFinished] = useState(false);

  const selectedDifficultyData = difficultyOptions.find((option) => option.key === selectedDifficulty);

  const currentRoundQuestions = useMemo(
    () =>
      currentRoundQuestionIds
        .map((id) => quizQuestions.find((question) => question.id === id))
        .filter((question): question is (typeof quizQuestions)[number] => Boolean(question)),
    [currentRoundQuestionIds, quizQuestions],
  );

  const currentQuestion = currentRoundQuestions[currentQuestionPointer] ?? null;
  const isLastInRound = currentQuestionPointer === currentRoundQuestions.length - 1;
  const earnedXp = isQuizFinished && selectedDifficultyData ? selectedDifficultyData.xp : 0;
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

  const streakStorageKey = useMemo(() => `portgo.quiz.bestStreak.${activity}`, [activity]);

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
    setIsQuizFinished(false);
  };

  const handleStartQuiz = () => {
    const selectedClass = gradeOptions.find((grade) => grade.name === selectedGrade);

    if (!selectedClass || selectedDifficulty === null) {
      setQuestionsError("Selecione série e dificuldade para iniciar o questionário.");
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

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center px-0 pt-0 pb-0 sm:px-2 sm:pt-2 sm:pb-0 md:px-4 md:pt-4 md:pb-0 lg:p-4">
      <PageContainer>
        <BrowserHeader />

        <div className="flex flex-1 min-h-0 bg-[#F0F4F8] dark:bg-neutral-950 overflow-hidden">
          <AppLeftSidebar />

          <main className="flex-1 min-h-0 p-4 pb-24 md:p-6 md:pb-6 lg:p-8 lg:pb-8 flex flex-col overflow-hidden">
            <header className="mb-6 flex items-start sm:items-center justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white mb-2 leading-tight">
                  Preparação do Questionário
                </h1>
                <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300">
                  Atividade: <span className="font-bold">{ACTIVITY_LABELS[activity]}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-4 py-2 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm font-semibold text-neutral-700 dark:text-neutral-200"
              >
                Voltar
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
                  activityLabel={ACTIVITY_LABELS[activity]}
                  selectedGrade={selectedGrade}
                  selectedDifficultyLabel={selectedDifficultyData.label}
                  lessonXp={selectedDifficultyData.xp}
                  questionCountLabel={`${MIN_QUESTION_QUANTITY} a ${MAX_QUESTION_QUANTITY} (sorteado ao iniciar)`}
                  isLoading={loadingQuestions}
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
                  activityLabel={ACTIVITY_LABELS[activity]}
                  retryRoundNumber={retryRoundNumber}
                  currentQuestionPointer={currentQuestionPointer}
                  currentRoundLength={currentRoundQuestions.length}
                  currentStreak={currentStreak}
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
                <FinishedStep earnedXp={earnedXp} bestStreak={bestStreak} onBackHome={() => navigate("/")} />
              )}
            </section>
          </main>

          <QuestionnaireRightPanel
            helpActions={HELP_ACTIONS}
            activityLabel={ACTIVITY_LABELS[activity]}
            selectedGrade={selectedGrade}
            selectedDifficultyLabel={selectedDifficultyData?.label}
            lessonXp={selectedDifficultyData?.xp}
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
      </PageContainer>
    </div>
  );
}

export default Questionnaire;
