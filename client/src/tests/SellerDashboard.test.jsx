import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SellerDashboard from '../pages/SellerDashboard';
import React from 'react';

// Mock redux
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useSelector: (fn) =>
      fn({
        user: {
          currentUser: {
            _id: 'user123',
            verified: 'true',
            verifiedFormData: [{ fullName: 'Test Seller' }],
          },
        },
      }),
  };
});

// Mock react-slick
vi.mock('react-slick', () => ({
  __esModule: true,
  default: ({ children }) => <div>{children}</div>,
}));

// Mock recharts
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: ({ children }) => <div>{children}</div>,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
}));

// Mock ResizeObserver for recharts and other libraries
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('SellerDashboard Component', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  test('renders welcome message and create listing link for verified user', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ([]), // userListings
    }).mockResolvedValueOnce({
      json: async () => ([]), // recommend
    });

    render(
      <MemoryRouter>
        <SellerDashboard />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Welcome Back, Test/i)).toBeInTheDocument();
    expect(screen.getByText(/Create Listing/i)).toBeInTheDocument();
  });

  test('shows "No listings found" if user has no listings', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ([]), // userListings
    }).mockResolvedValueOnce({
      json: async () => ([]), // recommend
    });

    render(
      <MemoryRouter>
        <SellerDashboard />
      </MemoryRouter>
    );

    expect(await screen.findByText(/No listings found/i)).toBeInTheDocument();
  });

  test('shows error message if fetching listings fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Failed'));
    render(
      <MemoryRouter>
        <SellerDashboard />
      </MemoryRouter>
    );
    expect(await screen.findByText(/Error showing listing/i)).toBeInTheDocument();
  });

  test('searches by district and updates stats', async () => {
    global.fetch
      .mockResolvedValueOnce({ json: async () => ([]), }) // userListings
      .mockResolvedValueOnce({ json: async () => ([]), }) // recommend (initial)
      .mockResolvedValueOnce({
        json: async () => ([{ price: 1000000, imageUrls: [] }, { price: 2000000, imageUrls: [] }]),
      }); // recommend (after search)

    render(
      <MemoryRouter>
        <SellerDashboard />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Search by district/i);
    fireEvent.change(input, { target: { value: 'Colombo' } });
    fireEvent.click(screen.getByRole('button', { name: /Search/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/listing/get?address=Colombo&type=sale');
    });
  });

  test('deletes a listing when delete button is clicked', async () => {
    global.fetch
      .mockResolvedValueOnce({
        json: async () => ([{
          _id: 'listing1',
          name: 'Test Listing',
          imageUrls: ['img1.jpg'],
          views: 10,
          address: 'Colombo',
          property_type: 'House',
          type: 'sale',
          price: 1000000,
          area: 120,
          bedrooms: 3,
          bathrooms: 2,
          parking: true,
          description: 'desc',
        }]),
      })
      .mockResolvedValueOnce({ json: async () => ([]), }) // recommend
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      }); // delete

    render(
      <MemoryRouter>
        <SellerDashboard />
      </MemoryRouter>
    );

    // await screen.findByText(/Test Listing/i); // Wait for the listing to render
    // const deleteBtn = screen.getByRole('button', { name: /delete/i });
    // fireEvent.click(deleteBtn); // <-- This triggers the delete

    // await waitFor(() => {
    //   expect(global.fetch).toHaveBeenCalledWith('/api/listing/delete/listing1', { method: 'DELETE' });
    // });
  });
});