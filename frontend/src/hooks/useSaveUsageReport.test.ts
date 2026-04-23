import { renderHook, act, waitFor } from '@testing-library/react';
import { useSaveUsageReport } from './useSaveUsageReport';

// ---------------------------------------------------------------------------
// Mock the service layer — no real network calls in unit tests.
// ---------------------------------------------------------------------------
jest.mock('../supabase_services/usageReportService', () => ({
  uploadUsageReport: jest.fn(),
}));

import { uploadUsageReport } from '../supabase_services/usageReportService';

const mockUpload = uploadUsageReport as jest.Mock;

const baseArgs = {
  property_id: 42,
  report_date: '2024-01-15',
  readings: [{ hour: '08:00', kWh: 1.5 }],
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('useSaveUsageReport', () => {
  beforeEach(() => {
    mockUpload.mockReset();
  });

  test('initial state: isSaving is false, saveError is null', () => {
    const { result } = renderHook(() => useSaveUsageReport());
    expect(result.current.isSaving).toBe(false);
    expect(result.current.saveError).toBeNull();
  });

  test('resolves with isSaving false and no error on success', async () => {
    mockUpload.mockResolvedValue(undefined);
    const { result } = renderHook(() => useSaveUsageReport());

    await act(async () => {
      await result.current.saveReport(baseArgs);
    });

    expect(result.current.isSaving).toBe(false);
    expect(result.current.saveError).toBeNull();
  });

  test('calls uploadUsageReport with the exact arguments provided', async () => {
    mockUpload.mockResolvedValue(undefined);
    const { result } = renderHook(() => useSaveUsageReport());

    await act(async () => {
      await result.current.saveReport({
        ...baseArgs,
        interval_minutes: 15,
        utility: 'PGE',
        meter_name: 'Main',
        source_filename: 'jan2024.xml',
      });
    });

    expect(mockUpload).toHaveBeenCalledTimes(1);
    expect(mockUpload).toHaveBeenCalledWith({
      property_id: 42,
      report_date: '2024-01-15',
      readings: [{ hour: '08:00', kWh: 1.5 }],
      interval_minutes: 15,
      utility: 'PGE',
      meter_name: 'Main',
      source_filename: 'jan2024.xml',
    });
  });

  test('applies default values for omitted optional arguments', async () => {
    mockUpload.mockResolvedValue(undefined);
    const { result } = renderHook(() => useSaveUsageReport());

    await act(async () => {
      await result.current.saveReport(baseArgs);
    });

    expect(mockUpload).toHaveBeenCalledWith(
      expect.objectContaining({
        interval_minutes: 60,
        utility: 'SDGE',
        meter_name: null,
        source_filename: null,
      }),
    );
  });

  test('sets saveError with the Error message on failure', async () => {
    mockUpload.mockRejectedValue(new Error('Network timeout'));
    const { result } = renderHook(() => useSaveUsageReport());

    await act(async () => {
      try {
        await result.current.saveReport(baseArgs);
      } catch {
        // saveReport re-throws; swallowed here so the test can assert state.
      }
    });

    expect(result.current.saveError).toBe('Network timeout');
    expect(result.current.isSaving).toBe(false);
  });

  test('sets saveError to stringified value for non-Error rejections', async () => {
    mockUpload.mockRejectedValue('server unavailable');
    const { result } = renderHook(() => useSaveUsageReport());

    await act(async () => {
      try {
        await result.current.saveReport(baseArgs);
      } catch {
        // expected re-throw
      }
    });

    expect(result.current.saveError).toBe('server unavailable');
  });

  test('re-throws on failure so callers can react to errors', async () => {
    const err = new Error('Upload failed');
    mockUpload.mockRejectedValue(err);
    const { result } = renderHook(() => useSaveUsageReport());

    await expect(
      act(async () => {
        await result.current.saveReport(baseArgs);
      }),
    ).rejects.toThrow('Upload failed');
  });

  test('saveError is reset to null at the start of a new save', async () => {
    // First call fails
    mockUpload.mockRejectedValueOnce(new Error('first error'));
    const { result } = renderHook(() => useSaveUsageReport());

    await act(async () => {
      try {
        await result.current.saveReport(baseArgs);
      } catch {
        // ignore
      }
    });

    expect(result.current.saveError).toBe('first error');

    // Second call succeeds — error should be cleared
    mockUpload.mockResolvedValue(undefined);
    await act(async () => {
      await result.current.saveReport(baseArgs);
    });

    expect(result.current.saveError).toBeNull();
  });

  test('isSaving is true while the upload is pending', async () => {
    let resolveFn!: () => void;
    mockUpload.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveFn = resolve;
      }),
    );

    const { result } = renderHook(() => useSaveUsageReport());

    // Start save without awaiting so we can inspect intermediate state.
    act(() => {
      result.current.saveReport(baseArgs).catch(() => {});
    });

    await waitFor(() => {
      expect(result.current.isSaving).toBe(true);
    });

    // Let the upload resolve and verify final state.
    await act(async () => {
      resolveFn();
    });

    expect(result.current.isSaving).toBe(false);
  });
});
