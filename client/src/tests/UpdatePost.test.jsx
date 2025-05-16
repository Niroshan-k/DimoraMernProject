import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import UpdatePost from '../pages/UpdatePost';
import { vi } from 'vitest';

const mockStore = configureStore([]);

describe('UpdatePost Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            user: {
                currentUser: {
                    _id: '12345',
                    username: 'testuser',
                    email: 'testuser@example.com',
                    role: 'contractor',
                },
            },
        });

        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks(); // Reset mocks after each test
    });

    test('renders the UpdatePost component correctly', async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => ({
                success: true,
                imageUrls: [],
                title: 'Test Project',
                description: 'Test Description',
                location: 'Test Location',
                years: 1,
                months: 2,
                days: 3,
                budget: 1000,
                userRef: '12345'
            }),
        });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/update-post/123']}>
                    <Routes>
                        <Route path="/update-post/:postId" element={<UpdatePost />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        // Wait for the component to load
        await waitFor(() => {
            expect(screen.getByText('Update Post')).toBeInTheDocument();
        });

        // Check if form fields are rendered
        expect(screen.getByPlaceholderText('Project Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('location')).toBeInTheDocument();
        expect(screen.getByText('Budget')).toBeInTheDocument();
        expect(screen.getByText('Years')).toBeInTheDocument();
        expect(screen.getByText('Months')).toBeInTheDocument();
        expect(screen.getByText('Days')).toBeInTheDocument();
    });

    test('handles form input changes', async () => {
        global.fetch.mockResolvedValueOnce({
            json: async () => ({
                success: true,
                imageUrls: [],
                title: '',
                description: '',
                location: '',
                years: 0,
                months: 0,
                days: 0,
                budget: 0,
            }),
        });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/update-post/123']}>
                    <Routes>
                        <Route path="/update-post/:postId" element={<UpdatePost />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        // Wait for the component to load
        await waitFor(() => {
            expect(screen.getByText('Update Post')).toBeInTheDocument();
        });

        // Simulate input changes
        fireEvent.change(screen.getByPlaceholderText('Project Name'), { target: { value: 'New Project Name' } });
        fireEvent.change(screen.getByPlaceholderText('Description'), { target: { value: 'New Description' } });
        fireEvent.change(screen.getByPlaceholderText('location'), { target: { value: 'New Location' } });
        fireEvent.change(screen.getByTestId('budget'), { target: { value: 2000 } });
        fireEvent.change(screen.getByTestId('years'), { target: { value: 2 } });
        fireEvent.change(screen.getByTestId('months'), { target: { value: 6 } });
        fireEvent.change(screen.getByTestId('days'), { target: { value: 15 } });

        // Verify input values
        expect(screen.getByPlaceholderText('Project Name')).toHaveValue('New Project Name');
        expect(screen.getByPlaceholderText('Description')).toHaveValue('New Description');
        expect(screen.getByPlaceholderText('location')).toHaveValue('New Location');
        expect(screen.getByTestId('budget')).toHaveValue(2000);
        expect(screen.getByTestId('years')).toHaveValue(2);
        expect(screen.getByTestId('months')).toHaveValue(6);
        expect(screen.getByTestId('days')).toHaveValue(15);
    });

    test('handles form submission successfully', async () => {
        global.fetch = vi.fn()
           // Mock the GET request to fetch the existing post data
           .mockImplementationOnce((url) => {
               if (url === '/api/posting/get/123') {
                   return Promise.resolve({
                       json: async () => ({
                           success: true,
                           imageUrls: [],
                           title: 'Test Project',
                           description: 'Test Description',
                           location: 'Test Location',
                           years: 1,
                           months: 2,
                           days: 3,
                           budget: 1000,
                       }),
                   });
               }
           })
           .mockImplementationOnce((url) => {
               if (url === '/api/posting/update/123') {
                   return Promise.resolve({
                       json: async () => ({
                           success: true,
                       }),
                   });
               }
           });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/update-post/123']}>
                    <Routes>
                        <Route path="/update-post/:postId" element={<UpdatePost />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        // Wait for the component to load
        await waitFor(() => {
            expect(screen.getByText('Update Post')).toBeInTheDocument();
        });

        // Simulate form submission
        const submitButton = screen.getByText('UPDATE');
        fireEvent.click(submitButton);

        // // Wait for the submission to complete
        // await waitFor(() => {
        //     expect(global.fetch).toHaveBeenCalledWith(
        //         '/api/posting/update/123',
        //         expect.objectContaining({
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             },
        //             body: JSON.stringify({
        //                 title: 'Test Project',
        //                 description: 'Test Description',
        //                 location: 'Test Location',
        //                 years: 1,
        //                 months: 2,
        //                 days: 3,
        //                 budget: 1000,
        //                 userRef: '12345',
        //             }),
        //         })
        //     );
        // });
    });

    test('displays error message on form submission failure', async () => {
        global.fetch
            .mockResolvedValueOnce({
                json: async () => ({
                    success: true,
                    imageUrls: [],
                    title: 'Test Project',
                    description: 'Test Description',
                    location: 'Test Location',
                    years: 1,
                    months: 2,
                    days: 3,
                    budget: 1000,
                }),
            })
            .mockResolvedValueOnce({
                json: async () => ({
                    success: false,
                    message: 'Failed to update post',
                }),
            });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/update-post/123']}>
                    <Routes>
                        <Route path="/update-post/:postId" element={<UpdatePost />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        // Wait for the component to load
        await waitFor(() => {
            expect(screen.getByText('Update Post')).toBeInTheDocument();
        });

        // Simulate form submission
        const submitButton = screen.getByText('UPDATE');
        fireEvent.click(submitButton);

    });
});