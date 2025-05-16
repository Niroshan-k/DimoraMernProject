import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignUp from '../pages/SignUp';
import React from 'react';

// Mock navigate
const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  };
});

// Mock OAuth
vi.mock('../components/OAuth', () => ({
  default: () => <div>OAuth Component</div>,
}));

describe('SignUp Component', () => {
  beforeEach(() => {
    mockedUsedNavigate.mockReset();
    global.fetch = vi.fn();
  });

  test('renders SignUp form', () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    const allSignUpElements = screen.getAllByText(/Sign Up/i);
    expect(allSignUpElements.length).toBeGreaterThan(1);
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Role:/i)).toBeInTheDocument();
    expect(screen.getByText(/OAuth Component/i)).toBeInTheDocument();
  });

  test('shows error if role is not selected', async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password:/i), { target: { value: 'Password1' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Password1' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Please select a role/i)).toBeInTheDocument();
    });
  });

  test('shows error for invalid email', async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalidemail' } });
    fireEvent.change(screen.getByLabelText(/^Password:/i), { target: { value: 'Password1' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Password1' } });
    fireEvent.click(screen.getByLabelText(/Customer/i)); // select role
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  test('shows error for weak password', async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password:/i), { target: { value: 'weak' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'weak' } });
    fireEvent.click(screen.getByLabelText(/Customer/i)); // select role
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      const allSignUpElements = screen.getAllByText(/Password must be at least 8 characters/i);
      expect(allSignUpElements.length).toBeGreaterThan(1);
    });
  });

  test('shows error if passwords do not match', async () => {
    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password:/i), { target: { value: 'Password1' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Password2' } });
    fireEvent.click(screen.getByLabelText(/Customer/i)); // select role
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });

  test('submits form and navigates on success', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: true }),
    });

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password:/i), { target: { value: 'Password1' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Password1' } });
    fireEvent.click(screen.getByLabelText(/Customer/i)); // select role
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/auth/signup',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'testuser',
            email: 'test@example.com',
            password: 'Password1',
            cPassword: 'Password1',
            role: 'customer',
          }),
        })
      );
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/sign-in');
    });
  });

  test('shows server error message', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: false, message: 'Email already exists' }),
    });

    render(
      <MemoryRouter>
        <SignUp />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password:/i), { target: { value: 'Password1' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'Password1' } });
    fireEvent.click(screen.getByLabelText(/Customer/i)); // select role
    fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Email already exists/i)).toBeInTheDocument();
    });
  });
});