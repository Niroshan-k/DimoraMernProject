import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('firebase/analytics', () => ({
    isSupported: vi.fn(() => Promise.resolve(false)),
    getAnalytics: vi.fn(() => ({})),
}));