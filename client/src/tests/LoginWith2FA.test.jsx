import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginWith2FA from '../pages/LoginWith2FA';
import React from 'react';

describe('LoginWith2FA', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    // Mock localStorage
    const localStorageMock = (() => {
      let store = {};
      return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        clear: () => { store = {}; },
        removeItem: (key) => { delete store[key]; },
      };
    })();
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });
  });

  test('renders form fields and login button', () => {
    render(<LoginWith2FA />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/2fa code/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows success message and saves token on successful login', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: true,
        access_token: 'jwt-token-123',
      }),
    });

    render(<LoginWith2FA />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/2fa code/i), { target: { value: '654321' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/login successful/i)).toBeInTheDocument();
      expect(window.localStorage.getItem('token')).toBe('jwt-token-123');
    });
  });

  test('shows error message on failed login', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        success: false,
        message: 'Invalid 2FA code.',
      }),
    });

    render(<LoginWith2FA />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/2fa code/i), { target: { value: '000000' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid 2fa code/i)).toBeInTheDocument();
    });
  });

  test('shows error message on network error', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<LoginWith2FA />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/2fa code/i), { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/an error occurred during login/i)).toBeInTheDocument();
    });
  });
});