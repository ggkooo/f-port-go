const activeBoosts = [
  {
    title: "Poção 2x XP",
    detail: "Ativa por mais 10h",
    icon: "bolt",
  },
  {
    title: "Gelinho da Ofensiva",
    detail: "1 unidade disponível",
    icon: "ac_unit",
  },
];

const storeTips = [
  "Use poções em dias com mais tempo de estudo para multiplicar seu ganho.",
  "Guarde um gelinho para semanas mais corridas e mantenha sua ofensiva viva.",
];

export function StoreRightPanel() {
  return (
    <aside className="w-80 bg-neutral-100 dark:bg-neutral-800 m-3 rounded-[2rem] p-5 flex-col gap-5 hidden 2xl:flex">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white">
          <span className="material-symbols-outlined text-xl">storefront</span>
          PortGO Store
        </div>
        <button type="button" className="w-8 h-8 flex items-center justify-center text-neutral-500">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>

      <div className="bg-white dark:bg-neutral-700 rounded-2xl p-4 border border-neutral-100 dark:border-neutral-600">
        <p className="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-1">Saldo</p>
        <p className="text-2xl font-extrabold text-neutral-900 dark:text-white">640 moedas</p>
        <p className="text-sm text-neutral-500 dark:text-neutral-300 mt-1">Conquiste mais moedas ao concluir desafios diários.</p>
      </div>

      <div>
        <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3">Itens Ativos</h2>
        <div className="flex flex-col gap-3">
          {activeBoosts.map((boost) => (
            <div
              key={boost.title}
              className="bg-white dark:bg-neutral-700 p-4 rounded-2xl flex gap-3 items-center shadow-sm"
            >
              <div className="w-10 h-10 bg-[#D4EAFC] dark:bg-neutral-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-blue-700 dark:text-neutral-100">{boost.icon}</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white leading-tight">{boost.title}</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-300 mt-1">{boost.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#FDE68A] dark:bg-neutral-700 rounded-2xl p-4">
        <h3 className="text-sm font-bold text-amber-900 dark:text-white mb-2">Dicas de Compra</h3>
        <ul className="space-y-2">
          {storeTips.map((tip) => (
            <li key={tip} className="text-xs text-amber-800 dark:text-neutral-200 leading-relaxed">
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}