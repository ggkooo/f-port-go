import { useCallback, useEffect, useMemo, useState } from "react";
import { getSession } from "../../../services/session";
import { getRanking, type RankingPlayer } from "../../../services/rankingService";

function getPositionBadge(position: number) {
  if (position === 1) {
    return "👑";
  }

  if (position === 2) {
    return "🥈";
  }

  if (position === 3) {
    return "🥉";
  }

  return `#${position}`;
}

function formatXp(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function RankingMainContent() {
  const [players, setPlayers] = useState<RankingPlayer[]>([]);
  const [top10Players, setTop10Players] = useState<RankingPlayer[]>([]);
  const [apiLoggedUser, setApiLoggedUser] = useState<RankingPlayer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sessionUuid = getSession()?.uuid ?? null;

  const loadRanking = useCallback(async () => {
    const session = getSession();

    if (!session?.token) {
      setPlayers([]);
      setErrorMessage("Sessão inválida para carregar o ranking.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const rankingData = await getRanking(session.token);
      setPlayers(rankingData.ranking);
      setTop10Players(rankingData.top10);
      setApiLoggedUser(rankingData.loggedUser);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível carregar o ranking.";
      setPlayers([]);
      setTop10Players([]);
      setApiLoggedUser(null);
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRanking();
  }, [loadRanking]);

  const topPlayers = useMemo(
    () => (top10Players.length > 0 ? top10Players : players.slice(0, 10)),
    [players, top10Players],
  );

  const loggedUser = useMemo(
    () =>
      apiLoggedUser ??
      players.find((player) => player.isCurrentUser || (sessionUuid !== null && player.uuid === sessionUuid)) ??
      null,
    [apiLoggedUser, players, sessionUuid],
  );

  const gapToTop10 =
    loggedUser && topPlayers.length > 0
      ? Math.max(0, topPlayers[topPlayers.length - 1].xp - loggedUser.xp)
      : 0;

  const topUserPositionLabel = loggedUser ? `#${loggedUser.position}` : "-";

  return (
    <main className="flex-1 min-h-0 p-4 pb-24 md:p-6 md:pb-6 lg:p-8 lg:pb-8 overflow-y-auto">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white mb-4 leading-tight">
          Ranking Geral
        </h1>

        <div className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4EAFC] dark:bg-blue-900/30 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-700 dark:text-blue-200">leaderboard</span>
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white">Disputa semanal ativa</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                  Continue estudando para subir posições e entrar no Top 10.
                </p>
              </div>
            </div>

            <span className="text-sm md:text-base font-semibold text-neutral-700 dark:text-neutral-200">
              Você está em {topUserPositionLabel}
            </span>
          </div>
        </div>
      </header>

      <section className="bg-white dark:bg-neutral-800 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white">Top 10 jogadores</h2>
          <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-300">Atualização em tempo real</p>
        </div>

        {isLoading && (
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-4">Carregando ranking...</p>
        )}

        {errorMessage && (
          <div className="mb-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10 p-4 flex flex-wrap gap-3 items-center justify-between">
            <p className="text-sm font-medium text-amber-700 dark:text-amber-200">{errorMessage}</p>
            <button
              type="button"
              onClick={loadRanking}
              className="px-4 py-2 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm font-semibold text-neutral-700 dark:text-neutral-200"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!isLoading && !errorMessage && topPlayers.length === 0 && (
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-4">
            Nenhum jogador encontrado no ranking.
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">Pos.</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">Jogador</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">Ofensiva</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">XP Total</th>
              </tr>
            </thead>

            <tbody>
              {topPlayers.map((player) => (
                <tr key={`${player.position}-${player.uuid ?? player.name}`} className="bg-neutral-100 dark:bg-neutral-700">
                  <td className="px-4 py-3 rounded-l-2xl font-bold text-neutral-900 dark:text-white">{getPositionBadge(player.position)}</td>
                  <td className="px-4 py-3 font-semibold text-neutral-800 dark:text-neutral-100">{player.name}</td>
                  <td className="px-4 py-3 text-neutral-700 dark:text-neutral-200">{player.streak} dias</td>
                  <td className="px-4 py-3 rounded-r-2xl text-neutral-900 dark:text-white font-bold">{formatXp(player.xp)}</td>
                </tr>
              ))}

              {loggedUser && !topPlayers.some((player) => player.uuid && player.uuid === loggedUser.uuid) && (
                <>
                  <tr>
                    <td colSpan={4} className="px-2 py-3">
                      <div className="h-px bg-neutral-200 dark:bg-neutral-700" />
                    </td>
                  </tr>

                  <tr className="bg-[#D4EAFC] dark:bg-blue-900/30">
                    <td className="px-4 py-4 rounded-l-2xl font-extrabold text-blue-900 dark:text-blue-100">
                      #{loggedUser.position}
                    </td>
                    <td className="px-4 py-4 font-extrabold text-blue-900 dark:text-blue-100">
                      {loggedUser.name} (usuário logado)
                    </td>
                    <td className="px-4 py-4 text-blue-800 dark:text-blue-200">{loggedUser.streak} dias</td>
                    <td className="px-4 py-4 rounded-r-2xl text-blue-900 dark:text-blue-100 font-extrabold">{formatXp(loggedUser.xp)}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>

        {loggedUser && topPlayers.length > 0 && (
          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-300">
            Faltam <span className="font-bold text-neutral-700 dark:text-white">{formatXp(gapToTop10)} XP</span> para alcançar o Top 10.
          </p>
        )}
      </section>
    </main>
  );
}