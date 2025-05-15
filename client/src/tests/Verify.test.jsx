import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import Verify from '../pages/Verify';
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
                phone: '1234567890',
                role: 'customer',
            },
            loading: false,
            error: null,
        },
    },
});

describe('Verify Component', () => {
    test('renders Verify page correctly', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <Provider store={mockStore}>
                        <Verify />
                    </Provider>
                </MemoryRouter>
            );
        });

        // Check if the form fields are rendered
        expect(screen.getByText(/Verify Your Identity/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/ID Type/i)).toBeInTheDocument();
    });

    test('handles form input changes', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <Provider store={mockStore}>
                        <Verify />
                    </Provider>
                </MemoryRouter>
            );
        });

        // Simulate entering full name
        const fullNameInput = screen.getByPlaceholderText(/Full Name/i);
        fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
        expect(fullNameInput.value).toBe('John Doe');

        // Simulate selecting ID type
        const idTypeSelect = screen.getByLabelText(/ID Type/i);
        fireEvent.change(idTypeSelect, { target: { value: 'passport' } });
        expect(idTypeSelect.value).toBe('passport');
    });

    test('validates required fields on form submission', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <Provider store={mockStore}>
                        <Verify />
                    </Provider>
                </MemoryRouter>
            );
        });

        // Simulate form submission without filling required fields
        const submitButton = screen.getByText(/Submit/i);
        fireEvent.click(submitButton);

        // Check for validation error
        expect(screen.getByText(/Please fill in all required fields./i)).toBeInTheDocument();
    });

    test('displays success message on successful submission', async () => {
        await act(async () => {
            render(
                <MemoryRouter>
                    <Provider store={mockStore}>
                        <Verify />
                    </Provider>
                </MemoryRouter>
            );
        });

        // Fill in required fields
        fireEvent.change(screen.getByPlaceholderText(/Full Name/i), { target: { value: 'John Doe' } });
        fireEvent.change(screen.getByLabelText(/ID Type/i), { target: { value: 'passport' } });
        fireEvent.change(screen.getByLabelText(/Date of Birth/i), { target: { value: '2000-01-01' } });

        // Simulate form submission
        const submitButton = screen.getByText(/Submit/i);
        fireEvent.click(submitButton);

        // Check for success message
        expect(await screen.findByText(/Cancel/i)).toBeInTheDocument();
    });
});