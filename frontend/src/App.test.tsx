import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from './App';

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------
// Prevent real Supabase client initialisation.  Login, Register and OpenDemo
// call supabase.auth.* directly, so we replace the whole client module.
jest.mock('./lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      }),
      signUp: jest.fn().mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      }),
      getSession: jest.fn().mockResolvedValue({
        data: { session: null },
        error: null,
      }),
    },
  },
}));

// Prevent service-layer hooks from making real network calls.
jest.mock('./supabase_services/propertiesService', () => ({
  fetchMyProperties: jest.fn().mockResolvedValue([]),
  addProperty: jest.fn().mockResolvedValue({ property_id: 1 }),
}));

jest.mock('./supabase_services/itemsService', () => ({
  fetchItemsByProperty: jest.fn().mockResolvedValue([]),
  fetchItemCategories: jest.fn().mockResolvedValue({}),
  fetchUsageTypes: jest.fn().mockResolvedValue({}),
}));

jest.mock('./supabase_services/eventsService', () => ({
  fetchAllEvents: jest.fn().mockResolvedValue([]),
  fetchEventsByDate: jest.fn().mockResolvedValue([]),
  fetchItemDailyUsage: jest.fn().mockResolvedValue([]),
  fetchLastStart: jest.fn().mockResolvedValue(null),
  fetchLastEnd: jest.fn().mockResolvedValue(null),
}));

jest.mock('./supabase_services/usageReportService', () => ({
  fetchMetersByProperty: jest.fn().mockResolvedValue([]),
  fetchReportsByMeter: jest.fn().mockResolvedValue([]),
  fetchReportWithIntervalsByDate: jest.fn().mockResolvedValue({
    intervals: [],
    report: null,
    prev: null,
    next: null,
    used_date: '',
    is_exact: true,
  }),
  fetchMostRecentUsageReportForProperty: jest.fn().mockResolvedValue(null),
  uploadUsageReport: jest.fn().mockResolvedValue({}),
  ensureMeter: jest.fn().mockResolvedValue(1),
}));

// Provide a lightweight AccountDashboard stand-in so Recharts and the full
// dashboard component tree do not need to render in routing smoke tests.
jest.mock('./pages/AccountDashboard', () => {
  const MockDashboard = () => (
    <div data-testid="account-dashboard">Account Dashboard</div>
  );
  return { __esModule: true, default: MockDashboard };
});

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

// ---------------------------------------------------------------------------
// Home route ( / )
// ---------------------------------------------------------------------------
describe('Home route ( / )', () => {
  test('renders the Sign In form by default', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
  });

  test('renders the "Don\'t have an account?" toggle link', () => {
    renderAt('/');
    expect(
      screen.getByText(/don't have an account\?/i),
    ).toBeInTheDocument();
  });

  test('renders the "Try the Demo" button', () => {
    renderAt('/');
    expect(screen.getByText(/try the demo/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Login / Register toggle
// ---------------------------------------------------------------------------
describe('Login / Register toggle on Home', () => {
  test('switches from Sign In to Create Account when toggle is clicked', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();

    fireEvent.click(screen.getByText(/don't have an account\?/i));

    expect(screen.getByRole('heading', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
  });

  test('shows "Already have an account?" link after switching to Register', () => {
    renderAt('/');
    fireEvent.click(screen.getByText(/don't have an account\?/i));
    expect(
      screen.getByText(/already have an account\?/i),
    ).toBeInTheDocument();
  });

  test('toggles back to Sign In from Create Account', () => {
    renderAt('/');
    fireEvent.click(screen.getByText(/don't have an account\?/i));
    fireEvent.click(screen.getByText(/already have an account\?/i));
    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Catch-all redirect
// ---------------------------------------------------------------------------
describe('Catch-all route', () => {
  test('unknown path redirects to Home and shows Sign In', () => {
    renderAt('/this-does-not-exist');
    expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// /account route — lazy-loaded AccountDashboard
// ---------------------------------------------------------------------------
describe('/account route', () => {
  test('renders AccountDashboard after lazy-load resolves', async () => {
    renderAt('/account');
    await waitFor(() => {
      expect(
        screen.getByTestId('account-dashboard'),
      ).toBeInTheDocument();
    });
  });
});

