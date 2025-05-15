import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Profile from '../pages/Profile';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import userReducer from '../redux/User/userSlice';

const mockStore = configureStore({
    reducer: {
        user: userReducer,
    },
    preloadedState: {
        user: {
            currentUser: {
                _id: '12345',
                username: 'testuser',
                email: 'testuser@example.com',
                avatar: 'https://example.com/avatar.png',
                isTwoFactorEnabled: false,
            },
            loading: false,
            error: null,
        },
    },
});

test('renders Profile page', async () => {
    await act(async () => {
        render(
            <MemoryRouter>
                <Provider store={mockStore}>
                    <Profile />
                </Provider>
            </MemoryRouter>
        );
    });

    expect(screen.getByText(/Sign Out/i)).toBeInTheDocument();
});

test('displays 2FA status', async () => {
    await act(async () => {
        render(
            <MemoryRouter>
                <Provider store={mockStore}>
                    <Profile />
                </Provider>
            </MemoryRouter>
        );
    });

    expect(screen.getByText(/2FA is not enabled for your account/i)).toBeInTheDocument();
});