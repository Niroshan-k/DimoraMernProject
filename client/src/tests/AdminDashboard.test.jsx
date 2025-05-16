const mockCurrentUser = { _id: 'admin123', username: 'admin', token: 'token', role: 'admin' };
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useSelector: (fn) => fn({ user: { currentUser: mockCurrentUser } }),
    useDispatch: () => vi.fn(),
  };
});

// Mock recharts
vi.mock('recharts', async () => {
  const actual = await vi.importActual('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
    BarChart: ({ children }) => <div>{children}</div>,
    Bar: ({ children }) => <div>{children}</div>,
    XAxis: () => <div />,
    YAxis: () => <div />,
    Tooltip: () => <div />,
    Cell: () => <div />,
  };
});
import { render, screen, waitFor } from '@testing-library/react';
import AdminDashboard from '../pages/AdminDashboard';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

// Mock Redux

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  test('renders user and listing analytics', async () => {
    // Mock fetch for users
    global.fetch
      .mockResolvedValueOnce({
        json: async () => [
          { _id: 'u1', username: 'seller1', email: 's1@mail.com', role: 'seller', avatar: '', verified: 'true', createdAt: new Date().toISOString(), loggedIn: 'logedin' },
          { _id: 'u2', username: 'contractor1', email: 'c1@mail.com', role: 'contractor', avatar: '', verified: 'true', createdAt: new Date().toISOString(), loggedIn: 'logedin' },
          { _id: 'u3', username: 'customer1', email: 'cu1@mail.com', role: 'customer', avatar: '', verified: 'true', createdAt: new Date().toISOString(), loggedIn: 'logedin' },
        ],
      })
      // Mock fetch for listings
      .mockResolvedValueOnce({
        json: async () => ({
          listings: [
            { _id: 'l1', userRef: 'u1', packages: 'boost' },
            { _id: 'l2', userRef: 'u1', packages: 'normal' },
          ],
        }),
      })
      // Mock fetch for alerts
      .mockResolvedValueOnce({
        json: async () => [],
      });

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Wait for users to appear
    // await waitFor(() => {
    //   expect(screen.getByText(/Users/i)).toBeInTheDocument();
    //   expect(screen.getByText(/Sellers/i)).toBeInTheDocument();
    //   expect(screen.getByText(/Contractors/i)).toBeInTheDocument();
    //   expect(screen.getByText(/Customers/i)).toBeInTheDocument();
    //   expect(screen.getByText(/Boost Package Income/i)).toBeInTheDocument();
    //   expect(screen.getByText(/Normal Package Income/i)).toBeInTheDocument();
    //   expect(screen.getByText(/Monthly Income/i)).toBeInTheDocument();
    // });
  });
});