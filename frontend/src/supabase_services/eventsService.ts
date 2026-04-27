// frontend/src/supabase_services/eventsService.ts
import { SUPABASE_URL } from "../config/supabase";
import { authedFetch } from "../lib/apiFetch";
import {
    EventSummary,
    GroupedEvents,
    EventStart,
    EventEnd,
} from "../../types/eventTypes";

const BASE = `${SUPABASE_URL}/functions/v1/events`;

export async function fetchAllEvents(itemId: number): Promise<EventSummary[]> {
    return authedFetch<EventSummary[]>(`${BASE}/events/item/${itemId}`);
}

export async function fetchEventsByDate(startDate: string): Promise<GroupedEvents[]> {
    return authedFetch<GroupedEvents[]>(`${BASE}/events/by_date/${startDate}`);
}

export async function fetchItemDailyUsage(
    itemId: number,
): Promise<{ usage_date: string; total_usage_minutes: number }[]> {
    return authedFetch<{ usage_date: string; total_usage_minutes: number }[]>(
        `${BASE}/end/item/${itemId}/daily_usage`,
    );
}

export async function startEvent(item_id: number, start_ts: string): Promise<EventStart> {
    return authedFetch<EventStart>(`${BASE}/start`, "POST", { item_id, start_ts });
}

export async function endEvent(event_id: number, end_ts: string): Promise<EventEnd> {
    return authedFetch<EventEnd>(`${BASE}/end`, "POST", { event_id, end_ts });
}

export async function fetchLastStart(item_id: number): Promise<EventStart> {
    return authedFetch<EventStart>(`${BASE}/start/item/${item_id}/latest_start`);
}

export async function fetchLastEnd(item_id: number): Promise<EventEnd> {
    return authedFetch<EventEnd>(`${BASE}/end/item/${item_id}/latest_end`);
}
