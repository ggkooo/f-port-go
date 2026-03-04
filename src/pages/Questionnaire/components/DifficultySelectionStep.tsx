import type { DifficultyOption } from "../types";

interface DifficultySelectionStepProps {
  selectedGrade: string;
  options: DifficultyOption[];
  isLoading: boolean;
  errorMessage: string | null;
  onRetryLoad: () => void;
  onSelectDifficulty: (difficulty: DifficultyOption["key"]) => void;
  onBackToGrades: () => void;
}

export function DifficultySelectionStep({
  selectedGrade,
  options,
  isLoading,
  errorMessage,
  onRetryLoad,
  onSelectDifficulty,
  onBackToGrades,
}: DifficultySelectionStepProps) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white mb-2">Escolha a dificuldade</h2>
      <p className="text-neutral-600 dark:text-neutral-300 mb-5">
        Série selecionada: <span className="font-semibold">{selectedGrade}</span>
      </p>

      {isLoading && (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/40 p-4 text-sm text-neutral-600 dark:text-neutral-300">
          Carregando dificuldades...
        </div>
      )}

      {!isLoading && errorMessage && (
        <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 p-4">
          <p className="text-sm font-medium text-red-700 dark:text-red-200 mb-3">{errorMessage}</p>
          <button
            type="button"
            onClick={onRetryLoad}
            className="px-4 py-2 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm font-semibold text-neutral-700 dark:text-neutral-200"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!isLoading && !errorMessage && options.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {options.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => onSelectDifficulty(option.key)}
              className={`${option.containerClass} p-4 rounded-2xl hover:brightness-95 transition-all text-left`}
            >
              <p className={`text-lg font-bold ${option.textClass}`}>{option.label}</p>
              <p className={`text-sm font-semibold ${option.badgeClass} mt-1`}>Recompensa da lição: {option.xp} XP</p>
            </button>
          ))}
        </div>
      )}

      {!isLoading && !errorMessage && options.length === 0 && (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/40 p-4 text-sm text-neutral-600 dark:text-neutral-300">
          Nenhuma dificuldade disponível no momento.
        </div>
      )}

      <button
        type="button"
        onClick={onBackToGrades}
        className="mt-5 px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-700 text-sm font-semibold text-neutral-700 dark:text-neutral-200"
      >
        Alterar série
      </button>
    </div>
  );
}
