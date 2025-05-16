import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreatePost from '../pages/CreatePost';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

// Mock react-redux
const mockCurrentUser = { _id: 'user123', username: 'testuser' };
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useSelector: (fn) => fn({ user: { currentUser: mockCurrentUser } }),
  };
});

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    MemoryRouter: actual.MemoryRouter,
  };
});

// Mock firebase/storage
vi.mock('firebase/storage', () => ({
  getDownloadURL: vi.fn(() => Promise.resolve('https://fakeurl.com/image.jpg')),
  getStorage: vi.fn(),
  uploadBytesResumable: vi.fn(() => ({
    on: (event, progress, error, success) => {
      if (event === 'state_changed') {
        success();
      }
    },
    snapshot: { ref: {} },
  })),
  ref: vi.fn(),
}));

// Mock leaflet
vi.mock('leaflet', () => {
  const map = () => ({
    setView: () => ({
      on: () => {},
      remove: () => {},
    }),
    on: () => {},
    remove: () => {},
  });
  const tileLayer = () => ({
    addTo: () => {},
  });
  return {
    __esModule: true,
    default: {
      map,
      tileLayer,
    },
    map,
    tileLayer,
  };
});

describe('CreatePost', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  test('renders form fields and submit button', () => {
    render(
      <MemoryRouter>
        <CreatePost />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText(/project name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/location/i)).toBeInTheDocument();
    expect(screen.getByTestId(/budget/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /post/i })).toBeInTheDocument();
  });

  test('shows error if less than 2 images are uploaded', async () => {
    render(
      <MemoryRouter>
        <CreatePost />
      </MemoryRouter>
    );
    fireEvent.change(screen.getByPlaceholderText(/project name/i), { target: { value: 'My Project' } });
    fireEvent.change(screen.getByPlaceholderText(/description/i), { target: { value: 'A test project' } });
    fireEvent.change(screen.getByPlaceholderText(/location/i), { target: { value: 'Colombo' } });
    fireEvent.change(screen.getByTestId(/budget/i), { target: { value: 1000 } });
    fireEvent.change(screen.getByTestId(/years/i), { target: { value: 1 } });
    fireEvent.change(screen.getByTestId(/months/i), { target: { value: 2 } });
    fireEvent.change(screen.getByTestId(/days/i), { target: { value: 10 } });

    fireEvent.click(screen.getByRole('button', { name: /post/i }));

    await waitFor(() => {
      expect(screen.getByText(/please upload two images/i)).toBeInTheDocument();
    });
  });

  test('submits form with two images and navigates', async () => {
    // Mock fetch for post creation
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ success: true }),
    });

    render(
      <MemoryRouter>
        <CreatePost />
      </MemoryRouter>
    );

    // Fill form
    fireEvent.change(screen.getByPlaceholderText(/project name/i), { target: { value: 'My Project' } });
    fireEvent.change(screen.getByPlaceholderText(/description/i), { target: { value: 'A test project' } });
    fireEvent.change(screen.getByPlaceholderText(/location/i), { target: { value: 'Colombo' } });
    fireEvent.change(screen.getByTestId(/budget/i), { target: { value: 1000 } });
    fireEvent.change(screen.getByTestId(/years/i), { target: { value: 1 } });
    fireEvent.change(screen.getByTestId(/months/i), { target: { value: 2 } });
    fireEvent.change(screen.getByTestId(/days/i), { target: { value: 10 } });

  });
});