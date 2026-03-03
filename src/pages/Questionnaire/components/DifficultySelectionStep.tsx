import type { DifficultyOption } from "../types";

interface DifficultySelectionStepProps {
  selectedGrade: string;
  options: DifficultyOption[];
  onSelectDifficulty: (difficulty: DifficultyOption["key"]) => void;
  onBackToGrades: () => void;
}

export function DifficultySelectionStep({
  selectedGrade,
  options,
  onSelectDifficulty,
  onBackToGrades,
}: DifficultySelectionStepProps) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white mb-2">Escolha a dificuldade</h2>
      <p className="text-neutral-600 dark:text-neutral-300 mb-5">
        Série selecionada: <span className="font-semibold">{selectedGrade}</span>
      </p>

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
