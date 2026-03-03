const quickSummary = [
  { label: "Eventos no mês", value: "5" },
  { label: "Concluídos", value: "2" },
  { label: "Próximo", value: "Dia 18" },
];

const reminders = [
  "Reserve 15 minutos para revisão antes de cada evento.",
  "Ative lembrete 30 minutos antes das aulas ao vivo.",
  "Após o evento, registre seu progresso no dashboard.",
];

export function CalendarRightPanel() {
  return (
    <aside className="w-80 bg-neutral-100 dark:bg-neutral-800 m-3 rounded-[2rem] p-5 flex-col gap-5 hidden 2xl:flex">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white">
          <span className="material-symbols-outlined text-xl">event_note</span>
          PortGO Agenda
        </div>
        <button type="button" className="w-8 h-8 flex items-center justify-center text-neutral-500">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {quickSummary.map((item) => (
          <div key={item.label} className="bg-white dark:bg-neutral-700 rounded-2xl p-4 border border-neutral-100 dark:border-neutral-600">
            <p className="text-xs uppercase font-bold tracking-wider text-neutral-400">{item.label}</p>
            <p className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#FDE68A] dark:bg-amber-900/30 rounded-2xl p-4">
        <h3 className="text-sm font-bold text-amber-900 dark:text-amber-100 mb-2">Lembretes úteis</h3>
        <ul className="space-y-2">
          {reminders.map((reminder) => (
            <li key={reminder} className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
              {reminder}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}