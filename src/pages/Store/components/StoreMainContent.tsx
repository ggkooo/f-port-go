const xpPotions = [
  {
    name: "Poção de XP 1.5x",
    multiplier: "1.5x XP",
    duration: "Duração: 24h",
    price: "120 moedas",
    containerClass: "bg-[#D4EAFC]",
    badgeClass: "bg-blue-500",
    textClass: "text-blue-900",
    subTextClass: "text-blue-700",
  },
  {
    name: "Poção de XP 2x",
    multiplier: "2x XP",
    duration: "Duração: 24h",
    price: "180 moedas",
    containerClass: "bg-[#E9F3FF]",
    badgeClass: "bg-blue-600",
    textClass: "text-blue-900",
    subTextClass: "text-blue-700",
  },
  {
    name: "Poção de XP 2.5x",
    multiplier: "2.5x XP",
    duration: "Duração: 24h",
    price: "240 moedas",
    containerClass: "bg-[#A3E4A1]/60",
    badgeClass: "bg-emerald-500",
    textClass: "text-emerald-900",
    subTextClass: "text-emerald-700",
  },
  {
    name: "Poção de XP 3x",
    multiplier: "3x XP",
    duration: "Duração: 12h",
    price: "300 moedas",
    containerClass: "bg-[#FDE68A]",
    badgeClass: "bg-amber-500",
    textClass: "text-amber-900",
    subTextClass: "text-amber-700",
  },
];

export function StoreMainContent() {
  return (
    <main className="flex-1 min-h-0 p-4 md:p-6 lg:p-8 overflow-y-auto">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white mb-4 leading-tight">
          Loja de Itens
        </h1>

        <div className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FDE68A] flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-700">local_fire_department</span>
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white">Melhore sua evolução</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                  Compre itens para ganhar mais XP e proteger sua ofensiva.
                </p>
              </div>
            </div>

            <span className="text-sm md:text-base font-semibold text-neutral-700 dark:text-neutral-200">
              Saldo atual: 640 moedas
            </span>
          </div>
        </div>
      </header>

      <section className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#D4EAFC] flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-700">bolt</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white">Poções de XP</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 lg:gap-5">
          {xpPotions.map((potion) => (
            <article
              key={potion.name}
              className={`${potion.containerClass} dark:bg-neutral-700 rounded-2xl md:rounded-large p-5 flex flex-col gap-4`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/70 dark:bg-neutral-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-blue-700 dark:text-neutral-100">science</span>
                  </div>

                  <div>
                    <h3 className={`font-bold text-base md:text-lg ${potion.textClass} dark:text-neutral-100`}>
                      {potion.name}
                    </h3>
                    <p className={`text-sm ${potion.subTextClass} dark:text-neutral-300 mt-1`}>{potion.duration}</p>
                  </div>
                </div>

                <span className={`${potion.badgeClass} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                  {potion.multiplier}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className={`font-extrabold ${potion.textClass} dark:text-neutral-100`}>{potion.price}</span>
                <button
                  type="button"
                  className="px-4 py-2 rounded-full bg-white/80 dark:bg-neutral-600 text-neutral-900 dark:text-neutral-100 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Comprar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#D4EAFC] flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-700">ac_unit</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white">Proteção de Ofensiva</h2>
        </div>

        <article className="bg-[#D4EAFC] dark:bg-neutral-700 rounded-2xl md:rounded-large p-5 md:p-6 border border-blue-100 dark:border-neutral-600">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/70 dark:bg-neutral-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-blue-700 dark:text-neutral-100">ac_unit</span>
              </div>

              <div>
                <h3 className="font-bold text-blue-900 dark:text-neutral-100 text-lg">Gelinho da Ofensiva</h3>
                <p className="text-blue-700 dark:text-neutral-300 mt-1 text-sm md:text-base">
                  Se esquecer de fazer uma lição em um dia, sua sequência é preservada.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-blue-900 dark:text-neutral-100 font-extrabold">90 moedas</span>
              <button
                type="button"
                className="px-4 py-2 rounded-full bg-white/80 dark:bg-neutral-600 text-neutral-900 dark:text-neutral-100 text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Comprar
              </button>
            </div>
          </div>

          <div className="mt-4 pl-[3.75rem] md:pl-0 md:flex md:justify-between md:items-center">
            <p className="text-xs text-blue-800 dark:text-neutral-300 font-semibold">
              Ative antes de dias corridos para não perder sua ofensiva.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}