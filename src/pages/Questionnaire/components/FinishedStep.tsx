interface FinishedStepProps {
  earnedXp: number;
  bestStreak: number;
  onBackHome: () => void;
}

export function FinishedStep({ earnedXp, bestStreak, onBackHome }: FinishedStepProps) {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white mb-2">Questionário finalizado</h2>
      <p className="text-neutral-600 dark:text-neutral-300 mb-5">
        Você acertou todas as 10 questões. Resultado final com revisão das erradas concluída.
      </p>

      <div className="bg-[#A3E4A1]/60 dark:bg-emerald-900/30 rounded-2xl p-5 mb-5 border border-emerald-200 dark:border-emerald-700">
        <p className="text-emerald-900 dark:text-emerald-100 font-semibold">XP conquistado nesta sessão</p>
        <p className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-100 mt-1">{earnedXp} XP</p>
        <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mt-3">Maior sequência de acertos: {bestStreak}</p>
      </div>

      <button
        type="button"
        onClick={onBackHome}
        className="px-5 py-3 rounded-full bg-neutral-900 dark:bg-blue-500 text-white font-bold"
      >
        Voltar para a Página Inicial
      </button>
    </div>
  );
}
