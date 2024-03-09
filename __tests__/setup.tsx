import revenueReducer from '@/redux/features/revenueSlice';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { vi } from 'vitest';

export const preloadedState = {
    revenueList: [{ month: 'Jun', revenue: 3200 }]
};

export const mockStore = configureStore({
    reducer: {
        revenueReducer
    }
});

/*
Setup file needs to have a .tsx file extension so that Provider
doesn't merely refer to its type.
*/
export const ReduxMockProvider = ({ children }: { children: React.ReactNode }) => (
    <Provider store={mockStore}>{children}</Provider>
);

// To avoid "TypeError: {fontname} is not a function":
beforeEach(() => {
    vi.mock('next/font/google', async (importOriginal) => {
        const mod = await importOriginal<typeof import('next/font/google')>()
        return {
            ...mod,
            // replace exports
            Inter: () => ({
                style: {
                    fontFamily: 'mocked',
                },
            }),
            Lusitana: () => ({
                style: {
                    fontFamily: 'mocked',
                },
            }),
        }
    });
});

