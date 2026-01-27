const LA_TZ = "America/Los_Angeles";

function assertValidDate(d: Date, label: string): Date {
  if (Number.isNaN(d.getTime())) throw new Error(`Invalid date: ${label}`);
  return d;
}

export function laYmdFromIso(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: LA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso)); // YYYY-MM-DD
}

export function parseLocalYmd(ymd: string): Date {
  const parts = ymd.split("-");
  if (parts.length !== 3) throw new Error(`Invalid YYYY-MM-DD: ${ymd}`);

  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);

  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) {
    throw new Error(`Invalid YYYY-MM-DD: ${ymd}`);
  }

  return assertValidDate(new Date(y, m - 1, d), ymd);
}

export function formatLocalYmdAsMDY(ymd: string): string {
  const dt = parseLocalYmd(ymd);
  const out = dt.toLocaleDateString("en-US");
  if (!out) throw new Error(`Failed to format date: ${ymd}`);
  return out;
}

export function formatIsoInLA(iso: string): string {
  const dt = assertValidDate(new Date(iso), iso);
  const out = dt.toLocaleString("en-US", { timeZone: LA_TZ });
  if (!out) throw new Error(`Failed to format ISO datetime: ${iso}`);
  return out;
}

export function formatIsoDateInLA(iso: string): string {
  const dt = assertValidDate(new Date(iso), iso);
  const out = dt.toLocaleDateString("en-US", { timeZone: LA_TZ });
  if (!out) throw new Error(`Failed to format ISO date: ${iso}`);
  return out;
}

/* Function to format ISO timestamp to hour and minute in Los Angeles timezone
--------------------------------------------------------------------------------
Params  | iso: string - ISO timestamp string
--------------------------------------------------------------------------------
Returns | Formatted time string in "HH:MM" format for Los Angeles timezone
------------------------------------------------------------------------------*/
export function formatIsoHourMinuteLA(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* Function to parse hour string to local DateTime
--------------------------------------------------------------------------------
Params  | reportDate: string - Date in YYYY-MM-DD format
        | hourStr: string - Hour representation (e.g., "14:00", "2:00 PM")
--------------------------------------------------------------------------------
Returns | Date object representing the local date and time
------------------------------------------------------------------------------*/
export function parseHourToLocalDateTime(reportDate: string, hourStr: string): Date {
    const trimmed = hourStr.trim();

    const m24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
    if (m24) {
        const hh = Number(m24[1]);
        const mm = Number(m24[2]);
        return new Date(`${reportDate}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00`);
    }

    const m12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (m12) {
        const [, hhStr, mmStr, apStr] = m12; 

        if (!hhStr || !mmStr || !apStr) {
            throw new Error(`Unrecognized hour format: ${hourStr}`);
        }

        let hh = Number(hhStr);
        const mm = Number(mmStr);
        const ap = apStr.toUpperCase();

        if (ap === "PM" && hh !== 12) hh += 12;
        if (ap === "AM" && hh === 12) hh = 0;

        return new Date(`${reportDate}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00`);
    }

    const dt = new Date(trimmed);
    if (!Number.isNaN(dt.getTime())) return dt;

    throw new Error(`Unrecognized hour format: ${hourStr}`);
}