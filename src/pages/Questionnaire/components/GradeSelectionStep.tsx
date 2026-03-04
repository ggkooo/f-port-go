import type { ClassOption } from "../../../services/catalogService";

interface GradeSelectionStepProps {
  grades: ClassOption[];
  isLoading: boolean;
  errorMessage: string | null;
  onRetryLoad: () => void;
  recommendedGrade: string | null;
  onSelectGrade: (grade: string) => void;
}

export function GradeSelectionStep({
  grades,
  isLoading,
  errorMessage,
  onRetryLoad,
  recommendedGrade,
  onSelectGrade,
}: GradeSelectionStepProps) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white mb-2">Escolha a série</h2>
      <p className="text-neutral-600 dark:text-neutral-300 mb-5">Selecione a sua série para configurar o nível das questões.</p>

      {isLoading && (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/40 p-4 text-sm text-neutral-600 dark:text-neutral-300">
          Carregando séries...
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

      {!isLoading && !errorMessage && grades.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {grades.map((grade) => (
            <button
              key={grade.id}
              type="button"
              onClick={() => onSelectGrade(grade.name)}
              className="p-4 rounded-2xl bg-[#D4EAFC] dark:bg-blue-900/30 hover:brightness-95 transition-all text-left border border-transparent hover:border-blue-200 dark:hover:border-blue-700"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-blue-900 dark:text-blue-100">{grade.name}</p>
                </div>
                {grade.name === recommendedGrade && (
                  <span className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-white/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200">
                    RECOMENDADO
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {!isLoading && !errorMessage && grades.length === 0 && (
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/40 p-4 text-sm text-neutral-600 dark:text-neutral-300">
          Nenhuma série disponível no momento.
        </div>
      )}
    </div>
  );
}
