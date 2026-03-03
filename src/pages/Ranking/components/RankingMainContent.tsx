interface RankingPlayer {
  position: number;
  name: string;
  streak: number;
  xp: number;
  weeklyGain: string;
}

const topPlayers: RankingPlayer[] = [
  { position: 1, name: "Ana Souza", streak: 87, xp: 32190, weeklyGain: "+1480" },
  { position: 2, name: "Pedro Lima", streak: 72, xp: 31550, weeklyGain: "+1360" },
  { position: 3, name: "Lucas Araújo", streak: 69, xp: 30840, weeklyGain: "+1310" },
  { position: 4, name: "Marina Alves", streak: 65, xp: 30210, weeklyGain: "+1240" },
  { position: 5, name: "Juliana Rocha", streak: 62, xp: 29870, weeklyGain: "+1190" },
  { position: 6, name: "Rafael Nunes", streak: 58, xp: 29430, weeklyGain: "+1175" },
  { position: 7, name: "Carla Mendes", streak: 56, xp: 29190, weeklyGain: "+1140" },
  { position: 8, name: "Diego Martins", streak: 54, xp: 28610, weeklyGain: "+1090" },
  { position: 9, name: "Beatriz Costa", streak: 51, xp: 28240, weeklyGain: "+1060" },
  { position: 10, name: "Eduardo Braga", streak: 48, xp: 27880, weeklyGain: "+1020" },
  { position: 11, name: "Fernanda Brito", streak: 46, xp: 27510, weeklyGain: "+980" },
  { position: 12, name: "Ricardo Teixeira", streak: 43, xp: 27030, weeklyGain: "+940" },
  { position: 13, name: "Natália Campos", streak: 41, xp: 26620, weeklyGain: "+920" },
  { position: 14, name: "Gustavo Pires", streak: 39, xp: 26140, weeklyGain: "+890" },
  { position: 15, name: "Patrícia Leal", streak: 37, xp: 25790, weeklyGain: "+850" },
];

const loggedUser: RankingPlayer = {
  position: 42,
  name: "Você",
  streak: 16,
  xp: 12450,
  weeklyGain: "+560",
};

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
  const gapToTop15 = topPlayers[topPlayers.length - 1].xp - loggedUser.xp;

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
                  Continue estudando para subir posições e entrar no Top 15.
                </p>
              </div>
            </div>

            <span className="text-sm md:text-base font-semibold text-neutral-700 dark:text-neutral-200">
              Você está em #{loggedUser.position}
            </span>
          </div>
        </div>
      </header>

      <section className="bg-white dark:bg-neutral-800 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white">Top 15 jogadores</h2>
          <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-300">Atualizado há 2 minutos</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">Pos.</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">Jogador</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">Ofensiva</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">XP Total</th>
                <th className="text-left text-xs font-bold uppercase tracking-wider text-neutral-400 px-4 py-2">XP Semana</th>
              </tr>
            </thead>

            <tbody>
              {topPlayers.map((player) => (
                <tr key={player.position} className="bg-neutral-100 dark:bg-neutral-700">
                  <td className="px-4 py-3 rounded-l-2xl font-bold text-neutral-900 dark:text-white">{getPositionBadge(player.position)}</td>
                  <td className="px-4 py-3 font-semibold text-neutral-800 dark:text-neutral-100">{player.name}</td>
                  <td className="px-4 py-3 text-neutral-700 dark:text-neutral-200">{player.streak} dias</td>
                  <td className="px-4 py-3 text-neutral-900 dark:text-white font-bold">{formatXp(player.xp)}</td>
                  <td className="px-4 py-3 rounded-r-2xl text-emerald-700 dark:text-emerald-300 font-semibold">
                    {player.weeklyGain}
                  </td>
                </tr>
              ))}

              <tr>
                <td colSpan={5} className="px-2 py-3">
                  <div className="h-px bg-neutral-200 dark:bg-neutral-700" />
                </td>
              </tr>

              <tr className="bg-[#D4EAFC] dark:bg-blue-900/30">
                <td className="px-4 py-4 rounded-l-2xl font-extrabold text-blue-900 dark:text-blue-100">#{loggedUser.position}</td>
                <td className="px-4 py-4 font-extrabold text-blue-900 dark:text-blue-100">{loggedUser.name} (usuário logado)</td>
                <td className="px-4 py-4 text-blue-800 dark:text-blue-200">{loggedUser.streak} dias</td>
                <td className="px-4 py-4 text-blue-900 dark:text-blue-100 font-extrabold">{formatXp(loggedUser.xp)}</td>
                <td className="px-4 py-4 rounded-r-2xl text-blue-800 dark:text-blue-200 font-bold">
                  {loggedUser.weeklyGain}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-300">
          Faltam <span className="font-bold text-neutral-700 dark:text-white">{formatXp(gapToTop15)} XP</span> para alcançar o Top 15.
        </p>
      </section>
    </main>
  );
}