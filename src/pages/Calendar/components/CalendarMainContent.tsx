import { useEffect, useMemo, useRef, useState } from "react";
import { getCalendarEventsByMonth, type CalendarEventItem } from "../../../services/calendarEventService";
import { getSession } from "../../../services/session";

const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const CALENDAR_QUERY_TIMEOUT_MS = 30000;
const CALENDAR_QUERY_TIMEOUT_MESSAGE = "A consulta de eventos demorou demais. Tente novamente.";
const monthOptions = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Março" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" },
];

type PickerOption = {
  value: number;
  label: string;
};

function getMonthLabel(month: number, year: number): string {
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" })
    .format(new Date(year, month - 1, 1));
}

function getMonthDaysGrid(month: number, year: number): Array<number | null> {
  const firstDay = new Date(year, month - 1, 1);
  const firstWeekDay = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month, 0).getDate();
  const totalCells = Math.ceil((firstWeekDay + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - firstWeekDay + 1;
    return dayNumber > 0 && dayNumber <= daysInMonth ? dayNumber : null;
  });
}

function getDayFromDate(value: string): number | null {
  const dateOnly = value.includes("T") ? value.split("T")[0] : value;
  const parts = dateOnly.split("-");

  if (parts.length < 3) {
    return null;
  }

  const day = Number(parts[2]);
  return Number.isFinite(day) ? day : null;
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMessage: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

async function getCalendarEventsByMonthWithRetry(month: number, year: number, token?: string): Promise<CalendarEventItem[]> {
  try {
    return await withTimeout(
      getCalendarEventsByMonth({ month: String(month), year: String(year) }, token),
      CALENDAR_QUERY_TIMEOUT_MS,
      CALENDAR_QUERY_TIMEOUT_MESSAGE,
    );
  } catch (error) {
    const isTimeoutError = error instanceof Error && error.message === CALENDAR_QUERY_TIMEOUT_MESSAGE;

    if (!isTimeoutError) {
      throw error;
    }

    return withTimeout(
      getCalendarEventsByMonth({ month: String(month), year: String(year) }, token),
      CALENDAR_QUERY_TIMEOUT_MS,
      CALENDAR_QUERY_TIMEOUT_MESSAGE,
    );
  }
}

export function CalendarMainContent() {
  const monthPickerRef = useRef<HTMLDivElement | null>(null);
  const yearPickerRef = useRef<HTMLDivElement | null>(null);

  const [events, setEvents] = useState<CalendarEventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [openPicker, setOpenPicker] = useState<"month" | "year" | null>(null);

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const yearOptions = useMemo(
    () => Array.from({ length: 7 }, (_, index) => currentYear - 3 + index),
    [currentYear],
  );

  const yearPickerOptions = useMemo<PickerOption[]>(
    () => yearOptions.map((value) => ({ value, label: String(value) })),
    [yearOptions],
  );

  const selectedMonthLabel = useMemo(
    () => monthOptions.find((monthOption) => monthOption.value === selectedMonth)?.label ?? "Mês",
    [selectedMonth],
  );

  const monthLabel = getMonthLabel(selectedMonth, selectedYear);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        monthPickerRef.current?.contains(target) ||
        yearPickerRef.current?.contains(target)
      ) {
        return;
      }

      setOpenPicker(null);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenPicker(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const fetchEvents = async () => {
    const session = getSession();

    setLoadingEvents(true);
    setEventsError(null);

    try {
      const data = await getCalendarEventsByMonthWithRetry(selectedMonth, selectedYear, session?.token);
      setEvents(data);
    } catch (error) {
      setEvents([]);
      const message =
        error instanceof Error ? error.message : "Não foi possível carregar os eventos do mês.";
      setEventsError(message);
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    setSelectedDay(null);
    void fetchEvents();
  }, [selectedMonth, selectedYear]);

  const eventsByDay = useMemo(() => {
    const grouped = new Map<number, CalendarEventItem[]>();

    events.forEach((event) => {
      const day = getDayFromDate(event.event_date);

      if (!day) {
        return;
      }

      const existingItems = grouped.get(day) ?? [];
      grouped.set(day, [...existingItems, event]);
    });

    return grouped;
  }, [events]);

  const calendarDays = useMemo(
    () => getMonthDaysGrid(selectedMonth, selectedYear),
    [selectedMonth, selectedYear],
  );

  const selectedDayEvents = useMemo(() => {
    if (!selectedDay) {
      return [];
    }

    return [...(eventsByDay.get(selectedDay) ?? [])].sort((firstEvent, secondEvent) =>
      firstEvent.event_time.localeCompare(secondEvent.event_time),
    );
  }, [eventsByDay, selectedDay]);

  return (
    <main className="flex-1 min-h-0 p-4 pb-24 md:p-6 md:pb-6 lg:p-8 lg:pb-8 overflow-y-auto">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 dark:text-white mb-4 leading-tight">
          Calendário
        </h1>

        <div className="bg-white dark:bg-neutral-800 p-5 md:p-6 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4EAFC] dark:bg-blue-900/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-700 dark:text-blue-200">calendar_month</span>
            </div>
            <p className="text-neutral-500 dark:text-neutral-300 text-sm md:text-base">
              Consulte os eventos por mês e clique em um dia para ver os detalhes.
            </p>
          </div>
        </div>
      </header>

      <section className="bg-white dark:bg-neutral-800 rounded-large shadow-sm border border-neutral-100 dark:border-neutral-700 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white">Eventos de {monthLabel}</h2>

          <div className="flex items-center gap-2">
            <div ref={monthPickerRef} className="relative">
              <button
                type="button"
                onClick={() => setOpenPicker((previousValue) => (previousValue === "month" ? null : "month"))}
                className="h-10 min-w-36 rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 pl-3 pr-9 text-sm font-medium text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-300 text-left"
              >
                {selectedMonthLabel}
              </button>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400 dark:text-neutral-300">
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </span>

              {openPicker === "month" ? (
                <div className="absolute z-20 mt-2 w-full max-h-60 overflow-y-auto rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 shadow-sm">
                  {monthOptions.map((monthOption) => {
                    const isActive = monthOption.value === selectedMonth;

                    return (
                      <button
                        key={monthOption.value}
                        type="button"
                        onClick={() => {
                          setSelectedMonth(monthOption.value);
                          setOpenPicker(null);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                          isActive
                            ? "bg-[#D4EAFC] dark:bg-blue-900/40 text-blue-900 dark:text-blue-100"
                            : "text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600"
                        }`}
                      >
                        {monthOption.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <div ref={yearPickerRef} className="relative">
              <button
                type="button"
                onClick={() => setOpenPicker((previousValue) => (previousValue === "year" ? null : "year"))}
                className="h-10 min-w-28 rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 pl-3 pr-9 text-sm font-medium text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-300 text-left"
              >
                {selectedYear}
              </button>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-neutral-400 dark:text-neutral-300">
                <span className="material-symbols-outlined text-[18px]">expand_more</span>
              </span>

              {openPicker === "year" ? (
                <div className="absolute z-20 mt-2 w-full max-h-60 overflow-y-auto rounded-xl border border-neutral-200 dark:border-neutral-600 bg-white dark:bg-neutral-700 shadow-sm">
                  {yearPickerOptions.map((yearOption) => {
                    const isActive = yearOption.value === selectedYear;

                    return (
                      <button
                        key={yearOption.value}
                        type="button"
                        onClick={() => {
                          setSelectedYear(yearOption.value);
                          setOpenPicker(null);
                        }}
                        className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                          isActive
                            ? "bg-[#D4EAFC] dark:bg-blue-900/40 text-blue-900 dark:text-blue-100"
                            : "text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600"
                        }`}
                      >
                        {yearOption.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={fetchEvents}
              disabled={loadingEvents}
              className="h-10 px-4 py-2 rounded-xl text-sm font-semibold bg-neutral-900 dark:bg-blue-500 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingEvents ? "Atualizando..." : "Atualizar"}
            </button>
          </div>
        </div>

        {eventsError ? <p className="text-sm text-red-600 dark:text-red-300 mb-4">{eventsError}</p> : null}

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
              return (
                <div
                  key={`empty-${index}`}
                  className="h-24 md:h-28 rounded-xl bg-neutral-50 dark:bg-neutral-700/40"
                />
              );
            }

            const dayEvents = eventsByDay.get(day) ?? [];
            const isSelected = selectedDay === day;

            return (
              <button
                type="button"
                onClick={() => setSelectedDay(day)}
                key={`${day}-${index}`}
                className={`h-24 md:h-28 rounded-xl p-2 border text-left transition-colors ${
                  isSelected
                    ? "bg-[#D4EAFC] border-blue-300 dark:bg-blue-900/30 dark:border-blue-500"
                    : "bg-neutral-50 border-neutral-200 dark:bg-neutral-700/40 dark:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs md:text-sm font-bold text-neutral-700 dark:text-neutral-200">{day}</span>
                  {dayEvents.length > 0 ? (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] md:text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                      {dayEvents.length}
                    </span>
                  ) : null}
                </div>

                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((calendarEvent) => (
                    <p
                      key={calendarEvent.id}
                      className="text-[10px] md:text-xs rounded-lg px-1.5 py-0.5 bg-[#D4EAFC] dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 truncate"
                    >
                      {calendarEvent.event_time} · {calendarEvent.name}
                    </p>
                  ))}

                  {dayEvents.length > 2 ? (
                    <p className="text-[10px] md:text-xs text-neutral-500 dark:text-neutral-300">
                      +{dayEvents.length - 2} evento(s)
                    </p>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        {selectedDay ? (
          <div className="mt-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700/40 p-4 md:p-5">
            <h3 className="text-base md:text-lg font-bold text-neutral-900 dark:text-white mb-3">
              Eventos do dia {selectedDay}
            </h3>

            {selectedDayEvents.length === 0 ? (
              <p className="text-sm text-neutral-500 dark:text-neutral-300">Nenhum evento cadastrado para este dia.</p>
            ) : (
              <div className="space-y-2">
                {selectedDayEvents.map((calendarEvent) => (
                  <div
                    key={calendarEvent.id}
                    className="rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 px-3 py-2"
                  >
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {calendarEvent.event_time} · {calendarEvent.name}
                    </p>
                    {calendarEvent.description ? (
                      <p className="text-xs text-neutral-500 dark:text-neutral-300 mt-1">{calendarEvent.description}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </section>
    </main>
  );
}
