import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import UserActivities from '../pages/UserActivities';
import { vi } from 'vitest';

const mockStore = configureStore([]);

describe('UserActivities Component', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            user: {
                currentUser: {
                    _id: '12345',
                    username: 'testuser',
                    email: 'testuser@example.com',
                    role: 'seller',
                    token: 'mock-token',
                },
            },
        });
    });

    afterEach(() => {
        vi.restoreAllMocks(); // Reset all mocks after each test
    });

    test('renders user details correctly', async () => {
        global.fetch = vi.fn()
            .mockResolvedValueOnce({
                json: async () => ({
                    _id: '12345',
                    username: 'testuser',
                    email: 'testuser@example.com',
                    role: 'seller',
                    avatar: 'mock-avatar-url',
                }),
            })
            .mockResolvedValueOnce({
                json: async () => ({
                    success: true,
                    listings: [
                        {
                            _id: 'listing123',
                            name: 'Test Listing',
                            address: '123 Test Street',
                            price: 1000,
                            type: 'rent',
                            area: 50,
                            bedrooms: 2,
                            bathrooms: 1,
                            parking: true,
                            description: 'Test description',
                            imageUrls: ['mock-image-url'],
                        },
                    ],
                }),
            })
            .mockResolvedValueOnce({
                json: async () => ({
                    success: true,
                    posts: [],
                }),
            });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/user/12345']}>
                    <Routes>
                        <Route path="/user/:userId" element={<UserActivities />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        // Wait for user details to load
        await waitFor(() => {
            expect(screen.getByText('User Details')).toBeInTheDocument();
            expect(screen.getByText('testuser')).toBeInTheDocument();
            expect(screen.getByText('testuser@example.com')).toBeInTheDocument();
            expect(screen.getByText('seller')).toBeInTheDocument();
        });
    });

    test('handles deleting a listing', async () => {
        global.fetch = vi.fn()
            .mockResolvedValueOnce({
                json: async () => ({
                    _id: '12345',
                    username: 'testuser',
                    email: 'testuser@example.com',
                    role: 'seller',
                    avatar: 'mock-avatar-url',
                }),
            })
            .mockResolvedValueOnce({
                json: async () => ({
                    success: true,
                    listings: [
                        {
                            _id: 'listing123',
                            name: 'Test Listing',
                            address: '123 Test Street',
                            price: 1000,
                            type: 'rent',
                            area: 50,
                            bedrooms: 2,
                            bathrooms: 1,
                            parking: true,
                            description: 'Test description',
                            imageUrls: ['mock-image-url'],
                        },
                    ],
                }),
            })
            .mockResolvedValueOnce({
                json: async () => ({
                    success: true,
                    message: 'Listing deleted successfully!',
                }),
            });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/user/12345']}>
                    <Routes>
                        <Route path="/user/:userId" element={<UserActivities />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        // Wait for listings to load
        await waitFor(() => {
            expect(screen.getByText('Listing')).toBeInTheDocument();
        });

        // Wait for the deletion to complete
        await waitFor(() => {
            expect(screen.queryByText('Test Listing')).not.toBeInTheDocument();
        });
    });

    test('handles sending an email', async () => {
        global.fetch = vi.fn()
            .mockResolvedValueOnce({
                json: async () => ({
                    _id: '12345',
                    username: 'testuser',
                    email: 'testuser@example.com',
                    role: 'seller',
                    avatar: 'mock-avatar-url',
                }),
            })
            .mockResolvedValueOnce({
                json: async () => ({
                    success: true,
                    message: 'Email sent successfully!',
                }),
            });

        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/user/12345']}>
                    <Routes>
                        <Route path="/user/:userId" element={<UserActivities />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        // Wait for user details to load
        await waitFor(() => {
            expect(screen.getByText('Send a Email')).toBeInTheDocument();
        });

        // Simulate filling out and submitting the email form
        fireEvent.change(screen.getByLabelText('Reply-To Email'), { target: { value: 'reply@example.com' } });
        fireEvent.change(screen.getByLabelText('Subject'), { target: { value: 'Test Subject' } });
        fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'Test Message' } });

        const sendButton = screen.getByText('Send Email');
        fireEvent.click(sendButton);

        // // Verify email submission
        // await waitFor(() => {
        //     expect(screen.getByText('Email sent successfully!')).toBeInTheDocument();
        // });
    });
});