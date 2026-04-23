import { renderHook, act } from '@testing-library/react';
import { useColorScheme } from './useColorScheme';

// window.matchMedia is stubbed in setupTests.js (matches: false → light mode).

// Helper: reset the stub to its default (light-mode) implementation.
// Reassigns window.matchMedia to a fresh jest.fn() so that resetMocks:true
// (CRA default) doesn't break the mock between tests.
function setMatchMedia(matchesDark: boolean) {
  window.matchMedia = jest.fn().mockImplementation((query: string) => ({
    matches: matchesDark && query === '(prefers-color-scheme: dark)',
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('useColorScheme', () => {
  afterEach(() => {
    // Restore light-mode default so tests are independent.
    setMatchMedia(false);
  });

  test('returns "light" when prefers-color-scheme does not match dark', () => {
    setMatchMedia(false);
    const { result } = renderHook(() => useColorScheme());
    expect(result.current).toBe('light');
  });

  test('returns "dark" when prefers-color-scheme matches dark', () => {
    setMatchMedia(true);
    const { result } = renderHook(() => useColorScheme());
    expect(result.current).toBe('dark');
  });

  test('updates scheme to "dark" when the media-query change event fires', () => {
    let changeListener: ((e: Partial<MediaQueryListEvent>) => void) | null = null;

    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: false, // starts as light
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest
        .fn()
        .mockImplementation(
          (event: string, handler: (e: Partial<MediaQueryListEvent>) => void) => {
            if (event === 'change') changeListener = handler;
          },
        ),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })) as unknown as typeof window.matchMedia;

    const { result } = renderHook(() => useColorScheme());
    expect(result.current).toBe('light');

    act(() => {
      changeListener!({ matches: true });
    });

    expect(result.current).toBe('dark');
  });

  test('updates scheme to "light" when change event fires with matches: false', () => {
    let changeListener: ((e: Partial<MediaQueryListEvent>) => void) | null = null;

    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)', // starts dark
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest
        .fn()
        .mockImplementation(
          (event: string, handler: (e: Partial<MediaQueryListEvent>) => void) => {
            if (event === 'change') changeListener = handler;
          },
        ),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })) as unknown as typeof window.matchMedia;

    const { result } = renderHook(() => useColorScheme());
    expect(result.current).toBe('dark');

    act(() => {
      changeListener!({ matches: false });
    });

    expect(result.current).toBe('light');
  });

  test('writes data-theme to <html> after mount', () => {
    setMatchMedia(false);
    renderHook(() => useColorScheme());
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  test('updates data-theme to "dark" when scheme changes', () => {
    let changeListener: ((e: Partial<MediaQueryListEvent>) => void) | null = null;

    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest
        .fn()
        .mockImplementation(
          (event: string, handler: (e: Partial<MediaQueryListEvent>) => void) => {
            if (event === 'change') changeListener = handler;
          },
        ),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })) as unknown as typeof window.matchMedia;

    renderHook(() => useColorScheme());
    expect(document.documentElement.dataset.theme).toBe('light');

    act(() => {
      changeListener!({ matches: true });
    });

    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
