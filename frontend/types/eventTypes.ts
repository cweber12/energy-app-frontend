// Type definition for event object
export type Event = {
    event_id: number; // identifies start/end event pair
    start_ts: string; // ISO-8601 string ("2024-06-15T14:30:00Z")
    end_ts: string | null; // ISO-8601 string or null
    elapsed_minutes: number; // total time in minutes
};

// Type definition for grouped event by date and item nickname
export type GroupedEvents = {
    usage_date: string; // "2024-06-15"
    nickname: string; // (Fridge, Washer, etc.)
    events: Event[]; // array of events for that item on that date
};

export type HourlyTotals = {
    hour: string;
    [nickname: string]: number | string; // total time per item
};

export type EventSummary = {
    event_id: number;
    start_ts: string;
    end_ts: string | null;
};

export type DailyUsage = {
    usage_date: string;
    total_usage_minutes: number;
};

export type EventStart = {
    event_id: number;
    start_ts: string;
};

export type EventEnd = {
    event_id: number;
    end_ts: string;
};

export type LastEvent = {
    event_id: number;
    start_ts: string;
    end_ts: string | null;
};

