import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SignIn from '../pages/Signin';
import React from 'react';

// Mock redux hooks
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => vi.fn(),
    useSelector: () => ({ loading: false, error: null }),
  };
});

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

describe('SignIn Component', () => {
  beforeEach(() => {
    mockedUsedNavigate.mockReset();
    global.fetch = vi.fn();
  });

  test('renders SignIn form', () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
    const allSignUpElements = screen.getAllByText(/Sign in/i);
    expect(allSignUpElements.length).toBeGreaterThan(1);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/OAuth Component/i)).toBeInTheDocument();
  });

  test('shows error on failed login', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: false, message: 'Invalid login credentials.' }),
    });

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByLabelText(/Customer/i));
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid login credentials/i)).toBeInTheDocument();
    });
  });

  test('navigates to seller dashboard on seller login', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: true, role: 'seller' }),
    });

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'seller@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Password1' } });
    fireEvent.click(screen.getByLabelText(/Seller/i));
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/seller-dashboard');
    });
  });

  test('navigates to contractor dashboard on contractor login', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: true, role: 'contractor' }),
    });

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'contractor@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Password1' } });
    fireEvent.click(screen.getByLabelText(/Contractor/i));
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/contractor-dashboard');
    });
  });

  test('navigates to home on customer login', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: true, role: 'customer' }),
    });

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'customer@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'Password1' } });
    fireEvent.click(screen.getByLabelText(/Customer/i));
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('locks out after 3 failed attempts', async () => {
    global.fetch.mockResolvedValue({
      json: async () => ({ success: false, message: 'Invalid login credentials.' }),
    });

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'fail@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByLabelText(/Customer/i));

    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
      await waitFor(() => {
        expect(screen.getByText(/Invalid login credentials/i)).toBeInTheDocument();
      });
    }

    // After 3 failed attempts, button should be locked
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Locked/i })).toBeDisabled();
      expect(screen.getByText(/locked/i)).toBeInTheDocument();
    });
  });
});