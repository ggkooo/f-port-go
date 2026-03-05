import { useNavigate } from "react-router-dom";
import { ROUTE_PATHS } from "../../../routes/paths";

const adminModules = [
  {
    id: "questions",
    title: "Questões",
    description: "Cadastre e organize questões por turma, dificuldade e tipo.",
    path: ROUTE_PATHS.ADMINISTRATION_QUESTIONS,
    icon: "quiz",
  },
  {
    id: "challenges",
    title: "Desafios",
    description: "Gerencie metas diárias e recompensas para os estudantes.",
    path: ROUTE_PATHS.ADMINISTRATION_CHALLENGES,
    icon: "sports_score",
  },
  {
    id: "users",
    title: "Usuários",
    description: "Acompanhe alunos, status de acesso e desempenho.",
    path: ROUTE_PATHS.ADMINISTRATION_USERS,
    icon: "groups",
  },
  {
    id: "calendar",
    title: "Calendário",
    description: "Cadastre eventos e visualize as atividades por dia.",
    path: ROUTE_PATHS.ADMINISTRATION_CALENDAR,
    icon: "calendar_month",
  },
];

export function AdministrationMainContent() {
  const navigate = useNavigate();

  return (
    <main className="flex-1 min-h-0 p-4 pb-24 md:p-6 md:pb-6 lg:p-8 lg:pb-8 overflow-y-auto">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white mb-4 leading-tight">
          Administração
        </h1>

        <div className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4EAFC] dark:bg-blue-900/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-700 dark:text-blue-200">admin_panel_settings</span>
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white">Painel de gestão acadêmica</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                  Cadastre questões, acompanhe alunos e organize desafios diários.
                </p>
              </div>
            </div>

            <span className="text-sm md:text-base font-semibold text-neutral-700 dark:text-neutral-200">
              Última atualização: hoje, 09:42
            </span>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
        {adminModules.map((module) => (
          <article
            key={module.id}
            className="bg-white dark:bg-neutral-800 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700 p-5 md:p-6"
          >
            <div className="w-10 h-10 rounded-full bg-[#D4EAFC] dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-blue-700 dark:text-blue-200">{module.icon}</span>
            </div>

            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{module.title}</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-300 leading-relaxed">{module.description}</p>

            <button
              type="button"
              onClick={() => navigate(module.path)}
              className="mt-5 px-4 py-2 rounded-full bg-neutral-900 dark:bg-blue-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Acessar módulo
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}