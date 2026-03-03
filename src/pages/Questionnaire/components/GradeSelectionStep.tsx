interface GradeSelectionStepProps {
  grades: string[];
  recommendedGrade: string;
  onSelectGrade: (grade: string) => void;
}

export function GradeSelectionStep({ grades, recommendedGrade, onSelectGrade }: GradeSelectionStepProps) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white mb-2">Escolha a série</h2>
      <p className="text-neutral-600 dark:text-neutral-300 mb-5">Selecione o nível das questões antes de continuar.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {grades.map((grade) => (
          <button
            key={grade}
            type="button"
            onClick={() => onSelectGrade(grade)}
            className="p-4 rounded-2xl bg-[#D4EAFC] hover:brightness-95 transition-all text-left"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-bold text-blue-900">{grade}</p>
              {grade === recommendedGrade && (
                <span className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-white/80 text-blue-700">
                  RECOMENDADO
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
