const quickActions = [
  {
    title: "Ver Dica",
    icon: "lightbulb",
    containerClass: "bg-[#D4EAFC] dark:bg-blue-900/30",
    iconClass: "text-blue-600 dark:text-blue-200",
    textClass: "text-blue-900 dark:text-blue-100",
  },
  {
    title: "Remover 3 Alternativas",
    icon: "filter_3",
    containerClass: "bg-[#E9F3FF] dark:bg-blue-900/20",
    iconClass: "text-blue-600 dark:text-blue-200",
    textClass: "text-blue-900 dark:text-blue-100",
  },
  {
    title: "Pular Questão",
    icon: "double_arrow",
    containerClass: "bg-[#A3E4A1]/70 dark:bg-emerald-900/30",
    iconClass: "text-emerald-600 dark:text-emerald-200",
    textClass: "text-emerald-900 dark:text-emerald-100",
  },
];

const achievements = [
  {
    category: "TI & Software",
    rating: "4.8",
    title: "Mestre do Código (Dart & Flutter)",
    icon: "computer",
    disabled: false,
  },
  {
    category: "Negócios",
    rating: "4.9",
    title: "Liderança Criativa",
    icon: "business_center",
    disabled: true,
  },
];

export function HomeRightPanel() {
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
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">Painel de Atividade</h2>

        {quickActions.map((action) => (
          <button
            key={action.title}
            type="button"
            className={`flex items-center gap-4 ${action.containerClass} p-5 rounded-large text-left hover:brightness-95 transition-all`}
          >
            <div className="bg-white/50 p-3 rounded-2xl">
              <span className={`material-symbols-outlined ${action.iconClass}`}>{action.icon}</span>
            </div>
            <span className={`font-bold ${action.textClass}`}>{action.title}</span>
          </button>
        ))}
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Minhas Conquistas</h2>
        </div>

        <div className="flex flex-col gap-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.title}
              className={`bg-white dark:bg-neutral-700 p-4 rounded-2xl flex gap-4 items-center shadow-sm ${
                achievement.disabled ? "opacity-60" : ""
              }`}
            >
              <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-neutral-400">{achievement.icon}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-300 uppercase">
                    {achievement.category}
                  </span>
                  <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-300 flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[10px]">star</span>
                    {achievement.rating}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-neutral-900 dark:text-white truncate leading-tight">
                  {achievement.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
