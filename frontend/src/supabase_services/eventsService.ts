// frontend/src/supabase_services/eventsService.ts
import { supabase } from "../lib/supabaseClient";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/supabase";
import { 
    EventSummary, 
    GroupedEvents, 
    HourlyTotals, 
    EventStart, 
    EventEnd 
} from "../../types/eventTypes";

// Helper to get auth headers
async function getHeaders() {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) {
        console.error("No Supabase access token found. User may not be logged in.");
    }
    return {
        Authorization: `Bearer ${token}`,
        apikey: SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
    };
}

/* Fetch all event summaries for a given item
--------------------------------------------------------------------------------
Params  | itemId: number ID of the item to fetch events for.
--------------------------------------------------------------------------------
Returns | data: EventSummary[] array of all event summaries for the item.
------------------------------------------------------------------------------*/
export async function fetchAllEvents(itemId: number): Promise<EventSummary[]> {
    const headers = await getHeaders();
    const response = await fetch(
        `${SUPABASE_URL}/functions/v1/events/events/item/${itemId}`,
        { headers }
    );
    if (!response.ok) throw new Error("Failed to fetch event summaries");
    return response.json();
}

/* Fetch events grouped by date starting from a specific date
--------------------------------------------------------------------------------
Params  | startDate: string in 'YYYY-MM-DD' format
--------------------------------------------------------------------------------
Returns | data: GroupedEvents[] array of events grouped by date.
------------------------------------------------------------------------------*/
export async function fetchEventsByDate(startDate: string): Promise<GroupedEvents[]> {
    const headers = await getHeaders();
    const response = await fetch(
        `${SUPABASE_URL}/functions/v1/events/events/by_date/${startDate}`,
        { headers }
    );
    if (!response.ok) throw new Error("Failed to fetch events by date");
    return response.json();
}

/* Fetch daily usage totals for a given item
--------------------------------------------------------------------------------
Params  | itemId: number ID of the item to fetch daily totals for.
--------------------------------------------------------------------------------
Returns | data: DailyUsage[] array of daily usage totals.
------------------------------------------------------------------------------*/
export async function fetchItemDailyUsage(
    itemId: number
): Promise<{ usage_date: string, total_usage_minutes: number }[]> {
    const headers = await getHeaders();
    const response = await fetch(
        `${SUPABASE_URL}/functions/v1/events/end/item/${itemId}/daily_usage`,
        { headers }
    );
    if (!response.ok) throw new Error("Failed to fetch daily usage for item");
    return response.json();
}

/* Start a new event for an item
--------------------------------------------------------------------------------
Params  | item_id: number ID of the item
        | start_ts: string ISO timestamp for event start
--------------------------------------------------------------------------------
Returns | JSON response from the API
------------------------------------------------------------------------------*/
export async function startEvent(item_id: number, start_ts: string) {
    const headers = await getHeaders();
    console.log("Starting event for item_id:", item_id, "at", start_ts);
    const response = await fetch(
        `${SUPABASE_URL}/functions/v1/events/start`,
        {
            method: "POST",
            headers,
            body: JSON.stringify({ item_id, start_ts }),
        }
    );
    if (!response.ok) throw new Error("Failed to start event");
    return response.json();
}

/* End an existing event
--------------------------------------------------------------------------------
Params  | event_id: number ID of the event to end   
        | end_ts: string ISO timestamp for event end
--------------------------------------------------------------------------------
Returns | JSON response from the API
------------------------------------------------------------------------------*/
export async function endEvent(event_id: number, end_ts: string) {
    const headers = await getHeaders();
    console.log("Ending event for event_id:", event_id, "at", end_ts);
    const response = await fetch(
        `${SUPABASE_URL}/functions/v1/events/end`,
        {
            method: "POST",
            headers,
            body: JSON.stringify({ event_id, end_ts }),
        }
    );
    if (!response.ok) throw new Error("Failed to end event");
    return response.json();
}

/* Fetch the last start event for an item
--------------------------------------------------------------------------------
Params  | item_id: number ID of the item
--------------------------------------------------------------------------------
Returns | EventStart object with last start timestamp
------------------------------------------------------------------------------*/
export async function fetchLastStart(item_id: number) : Promise<EventStart> {
    const headers = await getHeaders();
    const response = await fetch(
        `${SUPABASE_URL}/functions/v1/events/start/item/${item_id}/latest_start`,
        { headers }
    );
    if (!response.ok) {
        console.log("lastStart response not ok:", response.status, response.statusText);
        throw new Error("Failed to fetch last start event"); 
    }
    return response.json();
}

/* Fetch the last end event for an item
--------------------------------------------------------------------------------
Params  | item_id: number ID of the item
--------------------------------------------------------------------------------
Returns | EventEnd object with last end timestamp
------------------------------------------------------------------------------*/
export async function fetchLastEnd(item_id: number) : Promise<EventEnd> {
    const headers = await getHeaders();
    const response = await fetch(
        `${SUPABASE_URL}/functions/v1/events/end/item/${item_id}/latest_end`,
        { headers }
    );
    if (!response.ok) {
        console.log("lastEnd response not ok:", response.status, response.statusText);
        throw new Error("Failed to fetch last end event");
    }
    return response.json();
}