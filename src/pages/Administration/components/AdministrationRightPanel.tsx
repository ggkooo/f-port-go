import { useEffect, useState } from "react";
import { getOverviewStatistics, type OverviewStatistics } from "../../../services/overviewService";

const quickActions = [
  "Revisar questões pendentes de validação.",
  "Acompanhar alunos sem ofensiva hoje.",
  "Publicar novos desafios para a turma 8º Ano A.",
];

export function AdministrationRightPanel() {
  const [statistics, setStatistics] = useState<OverviewStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getOverviewStatistics();
        setStatistics(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Não foi possível carregar as estatísticas.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const summaryCards = statistics
    ? [
        { label: "Questões cadastradas", value: String(statistics.total_questions) },
        { label: "Alunos ativos", value: String(statistics.total_users) },
        { label: "Desafios em execução", value: String(statistics.total_challenges) },
      ]
    : [
        { label: "Questões cadastradas", value: "-" },
        { label: "Alunos ativos", value: "-" },
        { label: "Desafios em execução", value: "-" },
      ];

  return (
    <aside className="w-80 bg-neutral-100 dark:bg-neutral-800 m-3 rounded-[2rem] p-5 flex-col gap-5 hidden 2xl:flex">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white">
          <span className="material-symbols-outlined text-xl">monitoring</span>
          Painel Admin
        </div>
        <button type="button" className="w-8 h-8 flex items-center justify-center text-neutral-500">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-700 rounded-2xl p-4 shadow-sm">
        <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">
          Resumo geral
        </h2>

        {loading && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Carregando...</p>
        )}

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {!loading && !error && (
          <ul className="space-y-3">
            {summaryCards.map((item) => (
              <li key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-neutral-700 dark:text-neutral-200">{item.label}</span>
                <span className="font-bold text-neutral-900 dark:text-white">{item.value}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-[#D4EAFC] dark:bg-blue-900/30 rounded-2xl p-4">
        <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3">Ações rápidas</h3>
        <ul className="space-y-3">
          {quickActions.map((action) => (
            <li key={action} className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              • {action}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}