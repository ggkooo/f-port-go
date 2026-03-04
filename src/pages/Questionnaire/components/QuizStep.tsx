import type { AnswerResult, HelpAction, OptionStyle, QuizQuestion } from "../types";

interface HelpUsage {
  hint: boolean;
  removeTwo: boolean;
  skipQuestion: boolean;
}

interface QuizStepProps {
  activityLabel: string;
  retryRoundNumber: number;
  currentQuestionPointer: number;
  currentRoundLength: number;
  currentStreak: number;
  progressPercentage: number;
  lastAnswerResult: AnswerResult | null;
  helpMessage: string | null;
  currentQuestion: QuizQuestion;
  selectedOptionIndex: number | null;
  hiddenOptionIndexes: number[];
  optionStyles: OptionStyle[];
  helpActions: HelpAction[];
  helpUsage: HelpUsage;
  onUseHint: () => void;
  onUseRemoveThree: () => void;
  onUseSkipQuestion: () => void;
  onSelectOption: (index: number) => void;
  onAnswerAndContinue: () => void;
}

export function QuizStep({
  activityLabel,
  retryRoundNumber,
  currentQuestionPointer,
  currentRoundLength,
  currentStreak,
  progressPercentage,
  lastAnswerResult,
  helpMessage,
  currentQuestion,
  selectedOptionIndex,
  hiddenOptionIndexes,
  optionStyles,
  helpActions,
  helpUsage,
  onUseHint,
  onUseRemoveThree,
  onUseSkipQuestion,
  onSelectOption,
  onAnswerAndContinue,
}: QuizStepProps) {
  const getHelpButtonProps = (key: HelpAction["key"]) => {
    const isUsed = helpUsage[key];

    if (key === "hint") {
      return { onClick: onUseHint, isUsed };
    }

    if (key === "removeTwo") {
      return { onClick: onUseRemoveThree, isUsed };
    }

    return { onClick: onUseSkipQuestion, isUsed };
  };

  return (
    <div>
      <header className="mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-white mb-6">
          Questionário: {activityLabel}
        </h2>

        <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
          <span className="text-sm md:text-base font-semibold text-neutral-700 dark:text-neutral-200">
            {retryRoundNumber === 0
              ? `Questão ${currentQuestionPointer + 1} / ${currentRoundLength}`
              : `Revisão ${retryRoundNumber}: ${currentQuestionPointer + 1} / ${currentRoundLength}`}
          </span>
          <span className="text-sm font-bold text-neutral-600 dark:text-neutral-300">
            Acertos seguidos: {currentStreak}
          </span>
        </div>

        <div className="h-2.5 w-full bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-neutral-900 dark:bg-blue-500 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </header>

      {lastAnswerResult && (
        <div
          className={`mb-4 rounded-2xl p-4 border ${
            lastAnswerResult === "wrong"
              ? "bg-[#FDE68A] dark:bg-amber-900/30 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100"
              : "bg-[#A3E4A1]/60 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100"
          }`}
        >
          {lastAnswerResult === "wrong"
            ? "Resposta anterior incorreta. Essa questão voltará no final para você refazer."
            : "Resposta anterior correta. Continue assim!"}
        </div>
      )}

      {helpMessage && (
        <div className="mb-4 rounded-2xl p-4 border bg-[#D4EAFC] dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-100">
          {helpMessage}
        </div>
      )}

      <div className="mb-6 2xl:hidden">
        <h3 className="text-sm font-bold text-neutral-500 dark:text-neutral-300 uppercase tracking-wider mb-3">Ajudas da Lição</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {helpActions.map((action) => {
            const { onClick, isUsed } = getHelpButtonProps(action.key);

            return (
              <button
                key={action.title}
                type="button"
                onClick={onClick}
                disabled={isUsed}
                className={`flex items-center gap-3 ${action.containerClass} p-4 rounded-2xl text-left transition-all ${
                  isUsed ? "opacity-60 cursor-not-allowed" : "hover:brightness-95"
                }`}
              >
                <span className={`material-symbols-outlined ${action.iconClass}`}>{action.icon}</span>
                <div className="flex flex-col">
                  <span className={`text-xs font-extrabold ${action.textClass}`}>{action.title}</span>
                  <span className="text-[10px] font-bold text-neutral-600 dark:text-neutral-300">{isUsed ? "USADO" : "1/1"}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6 p-5 md:p-7 bg-neutral-100 dark:bg-neutral-700 rounded-2xl border border-neutral-200 dark:border-neutral-600">
        <p className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
          {currentQuestion.statement}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {currentQuestion.options.map((optionText, optionIndex) => {
          if (hiddenOptionIndexes.includes(optionIndex)) {
            return null;
          }

          const style = optionStyles[optionIndex] ?? optionStyles[3];
          const isSelected = selectedOptionIndex === optionIndex;

          return (
            <button
              key={`${currentQuestion.id}-${optionText}`}
              type="button"
              onClick={() => onSelectOption(optionIndex)}
              className={`${style.containerClass} h-20 md:h-24 px-5 flex items-center gap-4 rounded-2xl border-2 transition-all text-left ${
                isSelected ? style.activeBorderClass : "border-transparent"
              }`}
            >
              <div className={`w-7 h-7 rounded-full border-2 ${style.radioClass} bg-white flex items-center justify-center`}>
                <div
                  className={`w-3.5 h-3.5 rounded-full ${style.dotClass} transition-opacity ${
                    isSelected ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>

              <span className={`text-sm md:text-lg font-bold ${style.textClass}`}>
                {String.fromCharCode(65 + optionIndex)}: {optionText}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onAnswerAndContinue}
          disabled={selectedOptionIndex === null}
          className="px-5 py-3 rounded-full bg-neutral-900 dark:bg-blue-500 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Responder e continuar
        </button>
      </div>

    </div>
  );
}
