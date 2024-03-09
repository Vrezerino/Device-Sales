import { Revenue } from '@/app/lib/definitions';
//import revenueReducer from '@/redux/features/revenueSlice';
import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { vi } from 'vitest';

// Define mock Redux store.
type RevenueState = {
    revenueList: Revenue[];
};

const preloadedState: RevenueState = {
    revenueList: [
        { month: 'Jan', revenue: 3200 },
        { month: 'Feb', revenue: 4000 }
    ]
};

const revenueSlice = createSlice({
    name: 'revenue',
    initialState: preloadedState,
    reducers: {
        setRevenue: (state, action: PayloadAction<Revenue[]>) => {
            state.revenueList = action.payload;
        }
    },
});

const revenueReducer = revenueSlice.reducer;

const mockStore = configureStore({
    reducer: {
        revenueReducer
    },
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

