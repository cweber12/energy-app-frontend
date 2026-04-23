// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
//   expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// ---------------------------------------------------------------------------
// Web globals required by React Router v7
// ---------------------------------------------------------------------------
// The jsdom version bundled with react-scripts does not expose TextEncoder /
// TextDecoder as globals.  React Router v7 references them at module
// evaluation time, so we polyfill them before any test modules are imported.
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// ---------------------------------------------------------------------------
// Supabase environment stubs
// ---------------------------------------------------------------------------
// config/supabase.ts throws at module-evaluation time when these vars are
// absent.  Setting them here (setupFilesAfterFramework runs before any test
// file's imports are resolved) prevents that throw in every test suite.
// Individual tests that touch network calls must still mock lib/supabaseClient
// or the service modules so no real requests are made.
process.env.REACT_APP_SUPABASE_URL = 'https://test.supabase.co';
process.env.REACT_APP_SUPABASE_ANON_KEY = 'test-anon-key';

// ---------------------------------------------------------------------------
// window.matchMedia stub
// ---------------------------------------------------------------------------
// jsdom does not implement window.matchMedia; useColorScheme (and therefore
// ThemeProvider) calls it on initialisation.  Provide a minimal stub so
// rendering any component that uses ThemeProvider does not throw.
// Use a plain function (not jest.fn()) so Jest mock-clearing can never
// wipe the return value.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: function(query) {
    return {
      matches: false,
      media: query,
      onchange: null,
      addListener: function() {},
      removeListener: function() {},
      addEventListener: function() {},
      removeEventListener: function() {},
      dispatchEvent: function() { return false; },
    };
  },
});
