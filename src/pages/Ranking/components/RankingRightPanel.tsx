const weeklyAwards = [
  "Top 1: 500 moedas + Badge Lendário",
  "Top 2-5: 300 moedas + Badge Elite",
  "Top 6-15: 150 moedas + Badge Destaque",
];

const rankingTips = [
  "Concluir desafios diários acelera seu ganho de XP semanal.",
  "Mantenha sua ofensiva ativa para bônus de consistência.",
  "Use poções de XP da loja em sessões longas de estudo.",
];

export function RankingRightPanel() {
  return (
    <aside className="w-80 bg-neutral-100 dark:bg-neutral-800 m-3 rounded-[2rem] p-5 flex-col gap-5 hidden 2xl:flex">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white">
          <span className="material-symbols-outlined text-xl">emoji_events</span>
          PortGO Ranking
        </div>
        <button type="button" className="w-8 h-8 flex items-center justify-center text-neutral-500">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-700 rounded-2xl p-4 border border-neutral-100 dark:border-neutral-600">
        <p className="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-1">Sua posição</p>
        <p className="text-2xl font-extrabold text-neutral-900 dark:text-white">#42</p>
        <p className="text-sm text-neutral-500 dark:text-neutral-300 mt-1">Você subiu 3 posições nesta semana.</p>
      </div>

      <div>
        <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">Premiações Semanais</h2>
        <div className="flex flex-col gap-3">
          {weeklyAwards.map((award) => (
            <div key={award} className="bg-white dark:bg-neutral-700 p-4 rounded-2xl shadow-sm">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white leading-relaxed">{award}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#FDE68A] dark:bg-amber-900/30 rounded-2xl p-4">
        <h3 className="text-sm font-bold text-amber-900 dark:text-amber-100 mb-2">Como subir mais rápido</h3>
        <ul className="space-y-2">
          {rankingTips.map((tip) => (
            <li key={tip} className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}