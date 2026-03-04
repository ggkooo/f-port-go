const challengeTemplates = [
  { id: 1, title: "Lições concluídas", unit: "lessons", goal: "Meta: 4 / dia", reward: "80 XP" },
  { id: 2, title: "Tempo de estudo", unit: "minutes", goal: "Meta: 45 min", reward: "100 XP" },
  { id: 3, title: "Sequência correta", unit: "streak_exercises", goal: "Meta: 10 acertos", reward: "140 XP" },
];

export function AdministrationChallengesContent() {
  return (
    <main className="flex-1 min-h-0 p-4 pb-24 md:p-6 md:pb-6 lg:p-8 lg:pb-8 overflow-y-auto">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white mb-4 leading-tight">
          Desafios
        </h1>

        <div className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4EAFC] dark:bg-blue-900/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-700 dark:text-blue-200">sports_score</span>
            </div>
            <p className="text-neutral-500 dark:text-neutral-300 text-sm md:text-base">
              Defina metas, unidades e recompensas dos desafios diários.
            </p>
          </div>
        </div>
      </header>

      <section className="bg-white dark:bg-neutral-800 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700 p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {challengeTemplates.map((challenge) => (
            <article key={challenge.id} className="bg-[#D4EAFC] dark:bg-blue-900/20 rounded-2xl p-4 border border-blue-100 dark:border-blue-900/30">
              <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-1">{challenge.title}</h3>
              <p className="text-sm text-blue-700 dark:text-blue-200 mb-2">Unidade: {challenge.unit}</p>
              <p className="text-sm text-blue-800 dark:text-blue-200">{challenge.goal}</p>
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 mt-1">Recompensa: {challenge.reward}</p>

              <button
                type="button"
                className="mt-4 w-full px-4 py-2 rounded-full bg-white/80 dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Configurar
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}