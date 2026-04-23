import {
  laYmdFromIso,
  parseLocalYmd,
  formatLocalYmdAsMDY,
  formatIsoInLA,
  formatIsoDateInLA,
  formatIsoHourMinuteLA,
  parseHourToLocalDateTime,
} from './dateUtils';

// All timezone-sensitive assertions use timestamps in January so the LA
// offset is always PST (UTC−8), not PDT, and expectations stay stable.

// ---------------------------------------------------------------------------
// laYmdFromIso
// ---------------------------------------------------------------------------
describe('laYmdFromIso', () => {
  test('returns YYYY-MM-DD for noon UTC (same day in LA)', () => {
    // noon UTC = 04:00 PST → still Jan 15
    expect(laYmdFromIso('2024-01-15T12:00:00Z')).toBe('2024-01-15');
  });

  test('crosses midnight: 04:00 UTC Jan 16 is 20:00 PST Jan 15', () => {
    expect(laYmdFromIso('2024-01-16T04:00:00Z')).toBe('2024-01-15');
  });

  test('01:00 PST is still the same calendar day', () => {
    // 09:00 UTC = 01:00 PST → same day
    expect(laYmdFromIso('2024-01-15T09:00:00Z')).toBe('2024-01-15');
  });

  test('differentiates consecutive days', () => {
    expect(laYmdFromIso('2024-01-16T12:00:00Z')).toBe('2024-01-16');
  });
});

// ---------------------------------------------------------------------------
// parseLocalYmd
// ---------------------------------------------------------------------------
describe('parseLocalYmd', () => {
  test('parses a valid YYYY-MM-DD string to a local Date', () => {
    const d = parseLocalYmd('2024-01-15');
    expect(d instanceof Date).toBe(true);
    expect(Number.isNaN(d.getTime())).toBe(false);
    expect(d.getFullYear()).toBe(2024);
    expect(d.getMonth()).toBe(0); // 0-indexed; January = 0
    expect(d.getDate()).toBe(15);
  });

  test('throws when the string has too few parts', () => {
    expect(() => parseLocalYmd('2024-01')).toThrow('Invalid YYYY-MM-DD');
  });

  test('throws when the string has too many parts', () => {
    expect(() => parseLocalYmd('2024-01-15-00')).toThrow('Invalid YYYY-MM-DD');
  });

  test('throws when parts are non-numeric', () => {
    expect(() => parseLocalYmd('abcd-ef-gh')).toThrow('Invalid YYYY-MM-DD');
  });
});

// ---------------------------------------------------------------------------
// formatLocalYmdAsMDY
// ---------------------------------------------------------------------------
describe('formatLocalYmdAsMDY', () => {
  test('formats YYYY-MM-DD as M/D/YYYY (en-US locale)', () => {
    expect(formatLocalYmdAsMDY('2024-01-15')).toMatch(/1\/15\/2024/);
  });

  test('formats single-digit month and day without zero-padding', () => {
    expect(formatLocalYmdAsMDY('2024-03-05')).toMatch(/3\/5\/2024/);
  });
});

// ---------------------------------------------------------------------------
// formatIsoInLA
// ---------------------------------------------------------------------------
describe('formatIsoInLA', () => {
  test('returns a non-empty string for a valid ISO timestamp', () => {
    const result = formatIsoInLA('2024-01-15T12:00:00Z');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  test('reflects the LA calendar date correctly for noon UTC', () => {
    // noon UTC Jan 15 = 04:00 PST Jan 15
    const result = formatIsoInLA('2024-01-15T12:00:00Z');
    expect(result).toContain('1/15/2024');
  });

  test('applies the midnight crossing when converting to LA date', () => {
    // 04:00 UTC Jan 16 = 20:00 PST Jan 15 → still Jan 15
    const result = formatIsoInLA('2024-01-16T04:00:00Z');
    expect(result).toContain('1/15/2024');
  });

  test('throws for an unparseable ISO string', () => {
    expect(() => formatIsoInLA('not-a-date')).toThrow('Invalid date');
  });
});

// ---------------------------------------------------------------------------
// formatIsoDateInLA
// ---------------------------------------------------------------------------
describe('formatIsoDateInLA', () => {
  test('returns the date portion in LA timezone', () => {
    const result = formatIsoDateInLA('2024-01-15T12:00:00Z');
    expect(result).toContain('1/15/2024');
  });

  test('applies midnight crossing correctly', () => {
    // 04:00 UTC Jan 16 = 20:00 PST Jan 15 → date is Jan 15
    const result = formatIsoDateInLA('2024-01-16T04:00:00Z');
    expect(result).toContain('1/15/2024');
  });

  test('throws for an unparseable ISO string', () => {
    expect(() => formatIsoDateInLA('bad')).toThrow('Invalid date');
  });
});

// ---------------------------------------------------------------------------
// formatIsoHourMinuteLA
// ---------------------------------------------------------------------------
describe('formatIsoHourMinuteLA', () => {
  test('formats noon UTC as 04:00 AM in January (PST = UTC−8)', () => {
    // 12:00 UTC − 8h = 04:00 PST
    const result = formatIsoHourMinuteLA('2024-01-15T12:00:00Z');
    expect(result).toMatch(/04:00\s*AM/i);
  });

  test('formats 20:00 UTC as 12:00 PM in January', () => {
    // 20:00 UTC − 8h = 12:00 PST
    const result = formatIsoHourMinuteLA('2024-01-15T20:00:00Z');
    expect(result).toMatch(/12:00\s*PM/i);
  });
});

// ---------------------------------------------------------------------------
// parseHourToLocalDateTime
// ---------------------------------------------------------------------------
describe('parseHourToLocalDateTime', () => {
  const date = '2024-01-15';

  test('parses 24-hour HH:MM format', () => {
    const d = parseHourToLocalDateTime(date, '14:00');
    expect(d.getHours()).toBe(14);
    expect(d.getMinutes()).toBe(0);
  });

  test('parses 24-hour format with minutes', () => {
    const d = parseHourToLocalDateTime(date, '09:30');
    expect(d.getHours()).toBe(9);
    expect(d.getMinutes()).toBe(30);
  });

  test('parses 12-hour AM format', () => {
    const d = parseHourToLocalDateTime(date, '2:30 AM');
    expect(d.getHours()).toBe(2);
    expect(d.getMinutes()).toBe(30);
  });

  test('parses 12-hour PM format (adds 12)', () => {
    const d = parseHourToLocalDateTime(date, '2:30 PM');
    expect(d.getHours()).toBe(14);
    expect(d.getMinutes()).toBe(30);
  });

  test('midnight edge case: 12:00 AM = hour 0', () => {
    const d = parseHourToLocalDateTime(date, '12:00 AM');
    expect(d.getHours()).toBe(0);
  });

  test('noon edge case: 12:00 PM = hour 12', () => {
    const d = parseHourToLocalDateTime(date, '12:00 PM');
    expect(d.getHours()).toBe(12);
  });

  test('throws on an unrecognized format', () => {
    expect(() => parseHourToLocalDateTime(date, 'not-a-time')).toThrow(
      'Unrecognized hour format',
    );
  });
});
