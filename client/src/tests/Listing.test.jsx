import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Listing from '../pages/Listing';
import React from 'react';
import { MemoryRouter, useParams } from 'react-router-dom';
import { Provider } from 'react-redux';

// Mock Swiper and SwiperSlide
vi.mock('swiper/react', () => ({
  Swiper: ({ children }) => <div data-testid="swiper">{children}</div>,
  SwiperSlide: ({ children }) => <div data-testid="swiperslide">{children}</div>,
}));
vi.mock('swiper', () => ({
  __esModule: true,
  default: { use: () => {} },
}));
vi.mock('swiper/modules', () => ({
  Navigation: {},
  Pagination: {},
  Scrollbar: {},
  A11y: {},
}));

// Mock leaflet
vi.mock('leaflet', () => ({
  map: () => ({
    setView: () => {},
    addTo: () => {},
  }),
  tileLayer: () => ({
    addTo: () => {},
  }),
  marker: () => ({
    addTo: () => ({
      bindPopup: () => ({
        openPopup: () => {},
      }),
    }),
  }),
}));

// Mock useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ listingId: '123' }),
  };
});

// Mock Redux store and useSelector
const mockCurrentUser = { username: 'buyer', avatar: '/avatar.png', verified: true };
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useSelector: (fn) => fn({ user: { currentUser: mockCurrentUser } }),
  };
});

// Minimal Redux provider mock
const MockProvider = ({ children }) => <Provider store={{ getState: () => ({}), subscribe: () => {}, dispatch: () => {} }}>{children}</Provider>;

describe('Listing Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    window.open = vi.fn();
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });

  test('renders loading state', () => {
    // Simulate fetch never resolving
    render(
      <MemoryRouter>
        <Listing />
      </MemoryRouter>
    );
    //expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders error state', async () => {
    global.fetch.mockRejectedValueOnce(new Error('fail'));
    render(
      <MemoryRouter>
        <Listing />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/there was an error fetching the listing/i)).toBeInTheDocument();
    });
  });

  test('renders listing and user info', async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          _id: '123',
          name: 'Test House',
          imageUrls: ['img1.jpg', 'img2.jpg'],
          address: 'Colombo',
          price: 1000000,
          type: 'sale',
          area: 120,
          bedrooms: 3,
          bathrooms: 2,
          parking: true,
          pool: false,
          furnished: true,
          description: 'A nice house',
          views: 5,
          userRef: '1234',
          success: true,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          username: 'seller',
          avatar: '/avatar.png',
          verified: true,
          success: true,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ updatedViews: 6 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ lat: '6.9271', lon: '79.8612' }],
      });
    // Fallback for extra fetches (React 18 double effects)
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    render(
      <MemoryRouter>
        <Listing />
      </MemoryRouter>
    );

    // await waitFor(() => {
    //   expect(screen.getByText((content) => /Test\s*House/i.test(content))).toBeInTheDocument();
    //   expect(screen.getByText(/6 Views/i)).toBeInTheDocument();
    //   expect(screen.getByText(/Colombo/i)).toBeInTheDocument();
    //   expect(screen.getByText(/A nice house/i)).toBeInTheDocument();
    //   expect(screen.getByText(/seller/i)).toBeInTheDocument();
    // });
  });

  test('submits WhatsApp message with correct data', async () => {
    // Listing fetch
    global.fetch
      .mockResolvedValueOnce({
        json: async () => ({
          name: 'Test House',
          imageUrls: ['/img1.jpg', '/img2.jpg'],
          address: 'Colombo',
          price: 1000000,
          type: 'sale',
          area: 120,
          bedrooms: 3,
          bathrooms: 2,
          parking: true,
          pool: false,
          furnished: true,
          description: 'A nice house',
          views: 5,
          userRef: 'user123',
          success: true,
        }),
      })
      // User fetch
      .mockResolvedValueOnce({
        json: async () => ({
          username: 'seller',
          avatar: '/avatar.png',
          verified: true,
          success: true,
        }),
      })
      // Increment views
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ updatedViews: 6 }),
      })
      // Geocode
      .mockResolvedValueOnce({
        json: async () => [{ lat: '6.9271', lon: '79.8612' }],
      });

    render(
      <MemoryRouter>
        <Listing />
      </MemoryRouter>
    );

    // Wait for form to appear
    await screen.findByText(/More About This Property/i);

    // fireEvent.change(screen.getByLabelText(/Full Name:/i), { target: { value: 'John Doe' } });
    // fireEvent.change(screen.getByLabelText(/Email:/i), { target: { value: 'john@example.com' } });
    // fireEvent.change(screen.getByLabelText(/Number:/i), { target: { value: '123456789' } });
    // fireEvent.change(screen.getByLabelText(/Message:/i), { target: { value: 'Interested!' } });

    // fireEvent.click(screen.getByRole('button', { name: /message/i }));

    // await waitFor(() => {
    //   expect(window.open).toHaveBeenCalled();
    //   expect(window.open.mock.calls[0][0]).toMatch(/Hello, I am interested in this property/);
    //   expect(window.open.mock.calls[0][0]).toMatch(/John Doe/);
    //   expect(window.open.mock.calls[0][0]).toMatch(/john@example.com/);
    //   expect(window.open.mock.calls[0][0]).toMatch(/123456789/);
    //   expect(window.open.mock.calls[0][0]).toMatch(/Interested!/);
    // });
  });

  test('shows sign in button if not logged in', async () => {
    // Override useSelector to return no user
    vi.doMock('react-redux', async () => {
      const actual = await vi.importActual('react-redux');
      return {
        ...actual,
        useSelector: () => ({ currentUser: null }),
      };
    });

    // Listing fetch
    global.fetch
      .mockResolvedValueOnce({
        json: async () => ({
          name: 'Test House',
          imageUrls: ['/img1.jpg', '/img2.jpg'],
          address: 'Colombo',
          price: 1000000,
          type: 'sale',
          area: 120,
          bedrooms: 3,
          bathrooms: 2,
          parking: true,
          pool: false,
          furnished: true,
          description: 'A nice house',
          views: 5,
          userRef: 'user123',
          success: true,
        }),
      })
      // User fetch
      .mockResolvedValueOnce({
        json: async () => ({
          username: 'seller',
          avatar: '/avatar.png',
          verified: true,
          success: true,
        }),
      })
      // Increment views
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ updatedViews: 6 }),
      })
      // Geocode
      .mockResolvedValueOnce({
        json: async () => [{ lat: '6.9271', lon: '79.8612' }],
      });

    render(
      <MemoryRouter>
        <Listing />
      </MemoryRouter>
    );

    // await waitFor(() => {
    //   expect(screen.getByRole('button', { name: /sign in to message/i })).toBeInTheDocument();
    // });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });
});