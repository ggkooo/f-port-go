import { AUTH_API_BASE_URL, AUTH_API_KEY, requestJson } from "./apiClient";

export type CalendarEventPayload = {
  event_date: string;
  event_time: string;
  name: string;
  description: string;
};

export type CalendarEventsByMonthPayload = {
  month: string;
  year: string;
};

export type CalendarEventItem = {
  id: number;
  event_date: string;
  event_time: string;
  name: string;
  description: string;
};

type CalendarEventsResponse = {
  events?: unknown;
  calendar_events?: unknown;
};

function getStringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function normalizeCalendarEvent(item: unknown, index: number): CalendarEventItem | null {
  if (!item || typeof item !== "object") {
    return null;
  }

  const record = item as Record<string, unknown>;
  const eventDate = getStringValue(record.event_date || record.date);
  const eventTime = getStringValue(record.event_time || record.time || record.start_time);
  const name = getStringValue(record.name || record.title);
  const description = getStringValue(record.description);

  if (!eventDate || !name) {
    return null;
  }

  const idRaw = record.id;
  const parsedId = typeof idRaw === "number" ? idRaw : Number(idRaw);

  return {
    id: Number.isFinite(parsedId) ? parsedId : index + 1,
    event_date: eventDate,
    event_time: eventTime || "00:00",
    name,
    description,
  };
}

function getAuthorizationHeader(token?: string): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getCalendarEventsByMonth(
  payload: CalendarEventsByMonthPayload,
  token?: string,
): Promise<CalendarEventItem[]> {
  const body = await requestJson<CalendarEventsResponse | CalendarEventItem[]>(
    `${AUTH_API_BASE_URL}/calendar-events/by-month`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-API-KEY": AUTH_API_KEY,
        ...getAuthorizationHeader(token),
      },
      body: JSON.stringify(payload),
    },
    "Não foi possível carregar os eventos do calendário.",
  );

  const rawItems = Array.isArray(body)
    ? body
    : (Array.isArray(body.events)
        ? body.events
        : (Array.isArray(body.calendar_events) ? body.calendar_events : []));

  return rawItems
    .map((item, index) => normalizeCalendarEvent(item, index))
    .filter((item): item is CalendarEventItem => item !== null);
}

export async function createCalendarEvent(
  payload: CalendarEventPayload,
  token: string,
): Promise<void> {
  await requestJson<Record<string, unknown>>(
    `${AUTH_API_BASE_URL}/calendar-events`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-KEY": AUTH_API_KEY,
      },
      body: JSON.stringify(payload),
    },
    "Não foi possível cadastrar o evento.",
  );
}

export async function updateCalendarEvent(
  calendarEventId: number,
  payload: CalendarEventPayload,
  token: string,
): Promise<void> {
  await requestJson<Record<string, unknown>>(
    `${AUTH_API_BASE_URL}/calendar-events/${calendarEventId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-KEY": AUTH_API_KEY,
      },
      body: JSON.stringify(payload),
    },
    "Não foi possível atualizar o evento.",
  );
}

export async function deleteCalendarEvent(
  calendarEventId: number,
  token: string,
): Promise<void> {
  await requestJson<Record<string, unknown>>(
    `${AUTH_API_BASE_URL}/calendar-events/${calendarEventId}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-API-KEY": AUTH_API_KEY,
      },
    },
    "Não foi possível deletar o evento.",
  );
}