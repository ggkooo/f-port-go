interface CalendarEvent {
  id: number;
  day: number;
  title: string;
  time: string;
  colorClass: string;
}

const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const calendarDays = [
  null,
  null,
  null,
  null,
  null,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  null,
  null,
  null,
  null,
  null,
  null,
];

const events: CalendarEvent[] = [
  { id: 1, day: 5, title: "Aula ao vivo: Gramática", time: "19:00", colorClass: "bg-[#D4EAFC] text-blue-900" },
  { id: 2, day: 12, title: "Revisão semanal", time: "18:30", colorClass: "bg-[#A3E4A1]/70 text-emerald-900" },
  { id: 3, day: 18, title: "Simulado de interpretação", time: "20:00", colorClass: "bg-[#FDE68A] text-amber-900" },
  { id: 4, day: 24, title: "Mentoria de dúvidas", time: "19:30", colorClass: "bg-[#E9F3FF] text-blue-900" },
  { id: 5, day: 29, title: "Fechamento de metas", time: "17:30", colorClass: "bg-[#D4EAFC] text-blue-900" },
];

const today = 18;

export function CalendarMainContent() {
  return (
    <main className="flex-1 min-h-0 p-4 md:p-6 lg:p-8 overflow-y-auto">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white mb-4 leading-tight">
          Calendário de Estudos
        </h1>

        <div className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4EAFC] flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-700">calendar_month</span>
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white">Março 2026</h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-sm">5 eventos cadastrados neste mês.</p>
              </div>
            </div>

            <span className="text-sm md:text-base font-semibold text-neutral-700 dark:text-neutral-200">
              Próximo evento: dia 18 às 20:00
            </span>
          </div>
        </div>
      </header>

      <section className="bg-white dark:bg-neutral-800 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700 p-4 md:p-6">
        <div className="grid grid-cols-7 gap-2 mb-3">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs md:text-sm font-bold uppercase tracking-wider text-neutral-400 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="h-16 md:h-20 rounded-xl bg-neutral-50 dark:bg-neutral-700/40" />;
            }

            const hasEvent = events.some((event) => event.day === day);
            const isToday = day === today;

            return (
              <div
                key={day}
                className={`h-16 md:h-20 rounded-xl p-2 border transition-colors ${
                  isToday
                    ? "bg-[#D4EAFC] border-blue-200 dark:bg-neutral-700 dark:border-neutral-600"
                    : "bg-neutral-50 border-neutral-200 dark:bg-neutral-700/40 dark:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs md:text-sm font-bold ${isToday ? "text-blue-900 dark:text-white" : "text-neutral-700 dark:text-neutral-200"}`}>
                    {day}
                  </span>
                  {hasEvent && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <h2 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white mb-3">Eventos do mês</h2>

          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className={`${event.colorClass} rounded-2xl px-4 py-3 dark:bg-neutral-700 dark:text-neutral-100`}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-sm md:text-base leading-snug">{event.title}</p>
                  <span className="text-xs md:text-sm font-bold whitespace-nowrap">Dia {event.day} · {event.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}