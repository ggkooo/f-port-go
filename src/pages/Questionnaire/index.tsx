import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppLeftSidebar, BrowserHeader, DarkModeToggle, PageContainer } from "../../components";
import {
  ACTIVITY_LABELS,
  DIFFICULTY_OPTIONS,
  GRADE_OPTIONS,
  HELP_ACTIONS,
  OPTION_STYLE_BY_INDEX,
  QUIZ_BY_ACTIVITY,
  RECOMMENDED_GRADE,
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

function Questionnaire() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activityParam = searchParams.get("activity") ?? searchParams.get("atividade");
  const activity: ActivityKey = activityParam === "grammar" || activityParam === "reading" ? activityParam : "grammar";

  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyKey | null>(null);
  const [hasStartedQuiz, setHasStartedQuiz] = useState(false);

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

  const quizQuestions = QUIZ_BY_ACTIVITY[activity];
  const selectedDifficultyData = DIFFICULTY_OPTIONS.find((option) => option.key === selectedDifficulty);

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

  const streakStorageKey = useMemo(() => `portgo.quiz.bestStreak.${activity}`, [activity]);

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
    setHasStartedQuiz(true);
    setCurrentRoundQuestionIds(quizQuestions.map((question) => question.id));
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
    setHelpMessage("DICA: Leia com calma o enunciado e elimine as alternativas que não se conectam com a ideia principal da pergunta.");
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
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center p-2 md:p-4">
      <PageContainer>
        <BrowserHeader />

        <div className="flex flex-1 min-h-0 bg-[#F0F4F8] dark:bg-neutral-950 overflow-hidden">
          <AppLeftSidebar />

          <main className="flex-1 min-h-0 p-4 md:p-6 lg:p-8 flex flex-col overflow-hidden">
            <header className="mb-6 flex items-center justify-between gap-4">
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
                  grades={GRADE_OPTIONS}
                  recommendedGrade={RECOMMENDED_GRADE}
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
                  options={DIFFICULTY_OPTIONS}
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
                  onStartQuiz={handleStartQuiz}
                />
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

      <DarkModeToggle />
    </div>
  );
}

export default Questionnaire;
