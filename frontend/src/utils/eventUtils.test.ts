import { groupEventsByDate, groupEventsByHour, formatElapsed } from './eventUtils';
import type { EventSummary, GroupedEvents } from '../../types/eventTypes';

// ---------------------------------------------------------------------------
// groupEventsByDate
// ---------------------------------------------------------------------------
describe('groupEventsByDate', () => {
  test('groups events by their LA-timezone calendar date', () => {
    // noon UTC = 04:00 PST Jan 15; 18:00 UTC = 10:00 PST Jan 15
    const events: EventSummary[] = [
      { event_id: 1, start_ts: '2024-01-15T12:00:00Z', end_ts: null },
      { event_id: 2, start_ts: '2024-01-15T18:00:00Z', end_ts: null },
      // 04:00 UTC Jan 16 = 20:00 PST Jan 15 → still grouped under Jan 15
      { event_id: 3, start_ts: '2024-01-16T04:00:00Z', end_ts: null },
    ];

    const result = groupEventsByDate(events);
    expect(Object.keys(result)).toHaveLength(1);
    expect(result['2024-01-15']).toHaveLength(3);
  });

  test('creates separate buckets for different calendar dates', () => {
    const events: EventSummary[] = [
      { event_id: 1, start_ts: '2024-01-15T12:00:00Z', end_ts: null },
      { event_id: 2, start_ts: '2024-01-16T12:00:00Z', end_ts: null },
    ];

    const result = groupEventsByDate(events);
    expect(Object.keys(result)).toHaveLength(2);
    expect(result['2024-01-15']).toHaveLength(1);
    expect(result['2024-01-16']).toHaveLength(1);
  });

  test('preserves event objects inside each bucket', () => {
    const events: EventSummary[] = [
      { event_id: 7, start_ts: '2024-01-15T12:00:00Z', end_ts: '2024-01-15T13:00:00Z' },
    ];
    const result = groupEventsByDate(events);
    expect(result['2024-01-15']?.[0]).toEqual(events[0]);
  });

  test('returns an empty object for an empty input array', () => {
    expect(groupEventsByDate([])).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// groupEventsByHour
// ---------------------------------------------------------------------------
describe('groupEventsByHour', () => {
  test('always returns exactly 24 entries (one per hour of day)', () => {
    expect(groupEventsByHour([])).toHaveLength(24);
  });

  test('first entry is labelled "00:00" and last is "23:00"', () => {
    const result = groupEventsByHour([]);
    expect(result[0]!.hour).toBe('00:00');
    expect(result[23]!.hour).toBe('23:00');
  });

  test('initialises all nickname totals to 0 when events array is empty', () => {
    const input: GroupedEvents[] = [
      { usage_date: '2024-01-15', nickname: 'Fridge', events: [] },
    ];
    const result = groupEventsByHour(input);
    result.forEach((entry) => {
      expect(entry['Fridge']).toBe(0);
    });
  });

  test('accumulates elapsed minutes into the correct local hour bucket', () => {
    // Build the ISO string from a local Date so getHours() gives a
    // deterministic bucket regardless of the test-runner timezone.
    const localDate = new Date(2024, 0, 15, 10, 0, 0); // local 10:00
    const input: GroupedEvents[] = [
      {
        usage_date: '2024-01-15',
        nickname: 'Washer',
        events: [
          {
            event_id: 1,
            start_ts: localDate.toISOString(),
            end_ts: null,
            elapsed_minutes: 45.7,
          },
        ],
      },
    ];

    const result = groupEventsByHour(input);
    // Math.round(45.7) = 46
    expect(result[10]!['Washer']).toBe(46);
  });

  test('keeps nicknames in separate hour buckets', () => {
    const fridgeDate = new Date(2024, 0, 15, 8, 0, 0);  // local 08:00
    const tvDate    = new Date(2024, 0, 15, 20, 0, 0); // local 20:00
    const input: GroupedEvents[] = [
      {
        usage_date: '2024-01-15',
        nickname: 'Fridge',
        events: [{ event_id: 1, start_ts: fridgeDate.toISOString(), end_ts: null, elapsed_minutes: 30 }],
      },
      {
        usage_date: '2024-01-15',
        nickname: 'TV',
        events: [{ event_id: 2, start_ts: tvDate.toISOString(), end_ts: null, elapsed_minutes: 60 }],
      },
    ];

    const result = groupEventsByHour(input);
    expect(result[8]!['Fridge']).toBe(30);
    expect(result[8]!['TV']).toBe(0);
    expect(result[20]!['TV']).toBe(60);
    expect(result[20]!['Fridge']).toBe(0);
  });

  test('accumulates minutes from multiple events in the same hour bucket', () => {
    const localDate = new Date(2024, 0, 15, 14, 0, 0);
    const input: GroupedEvents[] = [
      {
        usage_date: '2024-01-15',
        nickname: 'AC',
        events: [
          { event_id: 1, start_ts: localDate.toISOString(), end_ts: null, elapsed_minutes: 20 },
          { event_id: 2, start_ts: localDate.toISOString(), end_ts: null, elapsed_minutes: 15 },
        ],
      },
    ];

    const result = groupEventsByHour(input);
    expect(result[14]!['AC']).toBe(35);
  });
});

// ---------------------------------------------------------------------------
// formatElapsed
// ---------------------------------------------------------------------------
describe('formatElapsed', () => {
  test('returns "Ongoing" when end timestamp is null', () => {
    expect(formatElapsed('2024-01-15T10:00:00Z', null)).toBe('Ongoing');
  });

  test('formats sub-minute durations as seconds only', () => {
    // 45 000 ms = 45 s
    expect(
      formatElapsed('2024-01-15T10:00:00Z', '2024-01-15T10:00:45Z'),
    ).toBe('45s');
  });

  test('formats minutes and seconds (no hours)', () => {
    // 90 s = 1m 30s
    expect(
      formatElapsed('2024-01-15T10:00:00Z', '2024-01-15T10:01:30Z'),
    ).toBe('1m 30s');
  });

  test('formats hours, minutes, and seconds', () => {
    // 3690 s = 1h 1m 30s
    expect(
      formatElapsed('2024-01-15T10:00:00Z', '2024-01-15T11:01:30Z'),
    ).toBe('1h 1m 30s');
  });

  test('returns "0s" for identical start and end timestamps', () => {
    const ts = '2024-01-15T10:00:00Z';
    expect(formatElapsed(ts, ts)).toBe('0s');
  });

  test('formats exactly 1 hour as "1h 0m 0s"', () => {
    expect(
      formatElapsed('2024-01-15T10:00:00Z', '2024-01-15T11:00:00Z'),
    ).toBe('1h 0m 0s');
  });

  test('formats exactly 1 minute as "1m 0s"', () => {
    expect(
      formatElapsed('2024-01-15T10:00:00Z', '2024-01-15T10:01:00Z'),
    ).toBe('1m 0s');
  });
});
