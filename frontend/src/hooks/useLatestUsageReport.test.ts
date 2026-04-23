import { renderHook, waitFor } from '@testing-library/react';
import { useLatestUsageReport } from './useLatestUsageReport';

// ---------------------------------------------------------------------------
// Mock the service layer so no real network calls are made.
// ---------------------------------------------------------------------------
jest.mock('../supabase_services/usageReportService', () => ({
  fetchMostRecentUsageReportForProperty: jest.fn(),
}));

import { fetchMostRecentUsageReportForProperty } from '../supabase_services/usageReportService';

const mockFetch = fetchMostRecentUsageReportForProperty as jest.Mock;

const sampleReadings = [
  { hour: '08:00', kWh: 1.2 },
  { hour: '09:00', kWh: 0.8 },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('useLatestUsageReport', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  // -------------------------------------------------------------------------
  // Zero / falsy propertyId
  // -------------------------------------------------------------------------
  test('does not call the service when propertyId is 0', () => {
    renderHook(() => useLatestUsageReport(0));
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test('returns stable empty state when propertyId is 0', () => {
    const { result } = renderHook(() => useLatestUsageReport(0));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.readings).toEqual([]);
    expect(result.current.date).toBe('');
    expect(result.current.error).toBeNull();
  });

  // -------------------------------------------------------------------------
  // Successful fetch
  // -------------------------------------------------------------------------
  test('sets readings and date on a successful response', async () => {
    mockFetch.mockResolvedValue({ readings: sampleReadings, date: '2024-01-15' });

    const { result } = renderHook(() => useLatestUsageReport(1));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.readings).toEqual(sampleReadings);
    expect(result.current.date).toBe('2024-01-15');
    expect(result.current.error).toBeNull();
  });

  test('calls the service with the correct property ID and utility', async () => {
    mockFetch.mockResolvedValue({ readings: [], date: '2024-01-15' });

    renderHook(() => useLatestUsageReport(7));

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

    expect(mockFetch).toHaveBeenCalledWith(
      expect.objectContaining({ propertyId: 7, utility: 'SDGE', meterName: null }),
    );
  });

  // -------------------------------------------------------------------------
  // Null / no-data response
  // -------------------------------------------------------------------------
  test('returns empty readings when the service returns null (no report found)', async () => {
    mockFetch.mockResolvedValue(null);

    const { result } = renderHook(() => useLatestUsageReport(1));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.readings).toEqual([]);
    expect(result.current.date).toBe('');
    expect(result.current.error).toBeNull();
  });

  // -------------------------------------------------------------------------
  // Error handling
  // -------------------------------------------------------------------------
  test('sets error and clears readings on fetch failure', async () => {
    mockFetch.mockRejectedValue(new Error('API down'));

    const { result } = renderHook(() => useLatestUsageReport(1));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe('API down');
    expect(result.current.readings).toEqual([]);
    expect(result.current.date).toBe('');
  });

  test('stringifies non-Error rejection values', async () => {
    mockFetch.mockRejectedValue('timeout');

    const { result } = renderHook(() => useLatestUsageReport(1));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe('timeout');
  });

  // -------------------------------------------------------------------------
  // refreshKey re-fetch
  // -------------------------------------------------------------------------
  test('re-fetches when refreshKey changes', async () => {
    mockFetch.mockResolvedValue({ readings: sampleReadings, date: '2024-01-15' });

    const { rerender } = renderHook(
      ({ propertyId, refreshKey }: { propertyId: number; refreshKey: number }) =>
        useLatestUsageReport(propertyId, refreshKey),
      { initialProps: { propertyId: 1, refreshKey: 0 } },
    );

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(1));

    rerender({ propertyId: 1, refreshKey: 1 });

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));
  });

  // -------------------------------------------------------------------------
  // Loading state
  // -------------------------------------------------------------------------
  test('sets isLoading to true initially when propertyId is provided', async () => {
    // Provide a promise we can inspect before resolution.
    let resolveFn!: (v: { readings: typeof sampleReadings; date: string }) => void;
    mockFetch.mockReturnValue(
      new Promise<{ readings: typeof sampleReadings; date: string }>((resolve) => {
        resolveFn = resolve;
      }),
    );

    const { result } = renderHook(() => useLatestUsageReport(1));

    await waitFor(() => expect(result.current.isLoading).toBe(true));

    resolveFn({ readings: sampleReadings, date: '2024-01-15' });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });
});
