import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Search from '../pages/Search';
import React from 'react';

// Mock ListingItem
vi.mock('../components/ListingItem', () => ({
  __esModule: true,
  default: ({ listing }) => <div data-testid="listing-item">{listing.name || listing._id}</div>,
}));

// Mock useNavigate
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('Search Page', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({ json: async () => [] });
    mockedNavigate.mockReset();
  });

  test('renders search form and result section', () => {
    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );
    expect(screen.getByText(/Title:/i)).toBeInTheDocument();
    expect(screen.getByText(/Location:/i)).toBeInTheDocument();
    expect(screen.getByText(/Sort:/i)).toBeInTheDocument();
    expect(screen.getByText(/Result:/i)).toBeInTheDocument();
  });

  test('shows "No Listing Found" when no results', async () => {
    global.fetch
    .mockResolvedValue({ json: async () => [] });
    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/No Listing Found/i)).toBeInTheDocument();
    });
  });

  test('shows loading indicator when loading', async () => {
    let resolveFetch;
    global.fetch.mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve;
      })
    );
    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    resolveFetch({
      json: async () => [],
    });
  });

  test('renders listings when data is returned', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => [
        { _id: '1', name: 'Listing One' },
        { _id: '2', name: 'Listing Two' },
      ],
    });
    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/Listing One/i)).toBeInTheDocument();
      expect(screen.getByText(/Listing Two/i)).toBeInTheDocument();
    });
  });

  test('search form submits and navigates with correct query', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => [],
    });
    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText(/search by title.../i), { target: { value: 'villa' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalled();
      expect(mockedNavigate.mock.calls[0][0]).toMatch(/searchTerm=villa/);
    });
  });

  test('show more button fetches more listings', async () => {
    // First fetch returns 8 listings (to show "show more" button)
    global.fetch
      .mockResolvedValueOnce({
        json: async () =>
          Array.from({ length: 8 }, (_, i) => ({
            _id: `${i + 1}`,
            name: `Listing ${i + 1}`,
          })),
      })
      // Second fetch returns 2 more listings
      .mockResolvedValueOnce({
        json: async () => [
          { _id: '9', name: 'Listing 9' },
          { _id: '10', name: 'Listing 10' },
        ],
      });

    render(
      <MemoryRouter>
        <Search />
      </MemoryRouter>
    );

    // Wait for initial listings and show more button
    await waitFor(() => {
      expect(screen.getByText(/show more/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/show more/i));

    await waitFor(() => {
      expect(screen.getByText(/Listing 9/i)).toBeInTheDocument();
      expect(screen.getByText(/Listing 10/i)).toBeInTheDocument();
    });
  });
});