
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from './App.js';

test('renders Home page at root route', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/Home/i)).toBeInTheDocument();
});

test('renders Auth page at /auth route', () => {
  render(
    <MemoryRouter initialEntries={['/auth']}>
      <App />
    </MemoryRouter>
  );
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
});

test('renders AccountDashboard at /account route', () => {
  render(
    <MemoryRouter initialEntries={['/account']}>
      <App />
    </MemoryRouter>
  );
  // Look for a unique element from AccountDashboard like header or label
  expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
});

test('toggles between Login and Register on Home page', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );
  // Should show Login by default
  expect(screen.getByText(/login/i)).toBeInTheDocument();
  // Click the toggle link
  const toggle = screen.getByText(/register here/i);
  fireEvent.click(toggle);
  // Should show Register form
  expect(screen.getByText(/already have an account\? login here\./i)).toBeInTheDocument();
});


