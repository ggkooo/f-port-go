interface ReadyStepProps {
  activityLabel: string;
  selectedGrade: string;
  selectedDifficultyLabel: string;
  lessonXp: number;
  onStartQuiz: () => void;
}

export function ReadyStep({
  activityLabel,
  selectedGrade,
  selectedDifficultyLabel,
  lessonXp,
  onStartQuiz,
}: ReadyStepProps) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white mb-2">Questionário pronto</h2>
      <p className="text-neutral-600 dark:text-neutral-300 mb-5">
        Você selecionou <span className="font-semibold">{activityLabel}</span>,
        <span className="font-semibold"> {selectedGrade}</span> e dificuldade
        <span className="font-semibold"> {selectedDifficultyLabel}</span>.
      </p>

      <div className="bg-neutral-100 dark:bg-neutral-700 rounded-2xl p-5 mb-5">
        <p className="text-neutral-800 dark:text-neutral-100 font-semibold">Questões nesta sessão: 10</p>
        <p className="text-neutral-800 dark:text-neutral-100 font-semibold">XP da lição completa: {lessonXp} XP</p>
      </div>

      <button
        type="button"
        onClick={onStartQuiz}
        className="px-5 py-3 rounded-full bg-neutral-900 dark:bg-blue-500 text-white font-bold"
      >
        Iniciar Questionário
      </button>
    </div>
  );
}
