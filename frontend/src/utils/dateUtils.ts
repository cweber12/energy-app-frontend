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