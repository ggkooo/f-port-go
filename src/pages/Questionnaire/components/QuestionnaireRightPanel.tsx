import type { HelpAction } from "../types";

interface HelpUsage {
  hint: boolean;
  removeTwo: boolean;
  skipQuestion: boolean;
}

interface QuestionnaireRightPanelProps {
  helpActions: HelpAction[];
  activityLabel: string;
  selectedGrade: string | null;
  selectedDifficultyLabel?: string;
  lessonXp?: number;
  currentStreak: number;
  bestStreak: number;
  storedBestStreak: number;
  isQuizActive: boolean;
  helpUsage: HelpUsage;
  onUseHint: () => void;
  onUseRemoveThree: () => void;
  onUseSkipQuestion: () => void;
}

export function QuestionnaireRightPanel({
  helpActions,
  activityLabel,
  selectedGrade,
  selectedDifficultyLabel,
  lessonXp,
  currentStreak,
  bestStreak,
  storedBestStreak,
  isQuizActive,
  helpUsage,
  onUseHint,
  onUseRemoveThree,
  onUseSkipQuestion,
}: QuestionnaireRightPanelProps) {
  const getHelpButtonProps = (key: HelpAction["key"]) => {
    const isUsed = helpUsage[key];
    const isDisabled = !isQuizActive || isUsed;

    if (key === "hint") {
      return { onClick: onUseHint, isUsed, isDisabled };
    }

    if (key === "removeTwo") {
      return { onClick: onUseRemoveThree, isUsed, isDisabled };
    }

    return { onClick: onUseSkipQuestion, isUsed, isDisabled };
  };

  return (
    <aside className="w-80 bg-neutral-100 dark:bg-neutral-800 m-3 rounded-[2rem] p-5 flex-col gap-5 hidden 2xl:flex">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white">
          <span className="material-symbols-outlined text-xl">notifications</span>
          PortGO
        </div>
        <button type="button" className="w-8 h-8 flex items-center justify-center text-neutral-500">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Painel de Ajuda</h2>

        {helpActions.map((action) => {
          const { onClick, isUsed, isDisabled } = getHelpButtonProps(action.key);

          return (
            <button
              key={action.title}
              type="button"
              onClick={onClick}
              disabled={isDisabled}
              className={`flex items-center gap-4 ${action.containerClass} p-5 rounded-large text-left transition-all ${
                isDisabled ? "opacity-60 cursor-not-allowed" : "hover:brightness-95"
              }`}
            >
              <div className="bg-white/50 dark:bg-neutral-900/30 p-3 rounded-2xl">
                <span className={`material-symbols-outlined ${action.iconClass}`}>{action.icon}</span>
              </div>
              <div className="flex flex-col">
                <span className={`font-bold ${action.textClass}`}>{action.title}</span>
                <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300">{isUsed ? "USADO" : "1/1 DISPONÍVEL"}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-white dark:bg-neutral-700 rounded-2xl p-4 mt-2">
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Resumo da sessão</p>
        <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-200">
          <li>Atividade: {activityLabel}</li>
          <li>Série: {selectedGrade ?? "-"}</li>
          <li>Dificuldade: {selectedDifficultyLabel ?? "-"}</li>
          <li>XP da lição: {lessonXp ?? 0}</li>
          <li>Acertos seguidos: {currentStreak}</li>
          <li>Maior sequência (sessão): {bestStreak}</li>
          <li>Maior sequência salva: {storedBestStreak}</li>
        </ul>
      </div>
    </aside>
  );
}
