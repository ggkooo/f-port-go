import { useNavigate } from "react-router-dom";

const studyModules = [
  {
    key: "grammar",
    title: "Gramática",
    icon: "text_fields",
    containerClass: "bg-[#D4EAFC] dark:bg-blue-900/30",
    iconClass: "text-blue-700 dark:text-blue-200",
    textClass: "text-blue-900 dark:text-blue-100",
  },
  {
    key: "reading",
    title: "Interpretação Textual",
    icon: "auto_stories",
    containerClass: "bg-[#A3E4A1]/60 dark:bg-emerald-900/30",
    iconClass: "text-emerald-700 dark:text-emerald-200",
    textClass: "text-emerald-900 dark:text-emerald-100",
  },
];

const dailyChallenges = [
  {
    title: "Estude por 15 minutos",
    progress: 60,
    progressLabel: "9/15 min",
    xpLabel: "50XP",
    containerClass: "bg-[#D4EAFC] dark:bg-blue-900/30",
    textClass: "text-blue-900 dark:text-blue-100",
    subTextClass: "text-blue-700 dark:text-blue-200",
    progressClass: "bg-blue-500 dark:bg-blue-400",
  },
  {
    title: "Faça 3 lições",
    progress: 33,
    progressLabel: "1/3 lições",
    xpLabel: "50XP",
    containerClass: "bg-[#A3E4A1]/60 dark:bg-emerald-900/30",
    textClass: "text-emerald-900 dark:text-emerald-100",
    subTextClass: "text-emerald-700 dark:text-emerald-200",
    progressClass: "bg-emerald-500 dark:bg-emerald-400",
  },
  {
    title: "Acerte 5 exercícios seguidos em 2 lições",
    progress: 50,
    progressLabel: "1/2 lições",
    xpLabel: "70XP",
    containerClass: "bg-[#FDE68A] dark:bg-amber-900/30",
    textClass: "text-amber-900 dark:text-amber-100",
    subTextClass: "text-amber-700 dark:text-amber-200",
    progressClass: "bg-amber-500 dark:bg-amber-400",
  },
];

export function HomeMainContent() {
  const navigate = useNavigate();

  return (
    <main className="flex-1 min-h-0 p-4 pb-24 md:p-6 md:pb-6 lg:p-8 lg:pb-8 overflow-y-auto">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white mb-5 leading-tight">
          Dashboard de Aprendizado
        </h1>

        <div className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FDE68A] dark:bg-amber-900/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-700 dark:text-amber-200">local_fire_department</span>
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white">Ofensiva Atual</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">7 dias seguidos de estudo</p>
              </div>
            </div>

            <p className="text-sm md:text-base font-semibold text-neutral-700 dark:text-neutral-200 sm:max-w-[320px] sm:text-right">
              Cada dia de prática é um passo real rumo à fluência.
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-3 md:gap-4 lg:gap-5">
        {studyModules.map((module, index) => (
          <button
            key={module.title}
            type="button"
            onClick={() => navigate(`/questionnaire?activity=${module.key}`)}
            className={`${module.containerClass} p-4 md:p-5 rounded-2xl md:rounded-large flex flex-col justify-between min-h-[130px] md:min-h-[150px] hover:opacity-90 transition-all text-left md:col-start-1 ${
              index === 0 ? "md:row-start-1" : "md:row-start-2"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-9 h-9 rounded-full bg-white/60 flex items-center justify-center">
                <span className={`material-symbols-outlined ${module.iconClass}`}>
                  {module.icon}
                </span>
              </div>
              <span className={`font-bold text-sm md:text-base lg:text-lg ${module.textClass}`}>{module.title}</span>
            </div>

            <div className="flex items-center">
              <span className={`material-symbols-outlined ${module.textClass} ml-auto`}>arrow_forward</span>
            </div>
          </button>
        ))}

        <div className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-2xl md:rounded-large border border-neutral-100 dark:border-neutral-700 shadow-sm md:col-start-2 md:row-start-1 md:row-span-2 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#D4EAFC] dark:bg-blue-900/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-700 dark:text-blue-200">target</span>
            </div>
            <h3 className="font-bold text-neutral-900 dark:text-white text-lg">Desafios do Dia</h3>
          </div>

          <ul className="space-y-3">
            {dailyChallenges.map((challenge) => (
              <li
                key={challenge.title}
                className={`${challenge.containerClass} rounded-2xl px-4 py-3`}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className={`text-sm md:text-base ${challenge.textClass} font-semibold leading-snug`}>
                    {challenge.title}
                  </p>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className={`text-[11px] md:text-xs ${challenge.subTextClass} font-bold`}>
                      {challenge.progressLabel}
                    </span>
                    <span className="text-[10px] md:text-xs font-extrabold px-2 py-1 rounded-full bg-white/80 dark:bg-neutral-600 text-neutral-800 dark:text-neutral-100">
                      {challenge.xpLabel}
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-white/80 dark:bg-neutral-600 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${challenge.progressClass}`}
                    style={{ width: `${challenge.progress}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
