import { Device, DevicesTable, Revenue } from '@/app/lib/definitions';
import { DeviceState } from '@/redux/features/deviceSlice';
import { RevenueState } from '@/redux/features/revenueSlice';
import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { vi } from 'vitest';

// Define mock Redux store.
const preloadedRevenueState: RevenueState = {
    revenueList: [
        { month: 'Jan', revenue: 3200 },
        { month: 'Feb', revenue: 4000 }
    ]
};

const preloadedDeviceState: DeviceState = {
    deviceList: []
};

export const revenueSlice = createSlice({
    name: 'revenue',
    initialState: preloadedRevenueState,
    reducers: {
        setRevenue: (state, action: PayloadAction<Revenue[]>) => {
            state.revenueList = action.payload;
        }
    },
});

export const deviceSlice = createSlice({
    name: 'devices',
    initialState: preloadedDeviceState,
    reducers: {
        setDevices: (state, action: PayloadAction<DevicesTable[]>) => {
            state.deviceList = action.payload;
        },
        addDevice: (state, action) => {
            state.deviceList.push(action.payload);
        },
        removeDevice: (state, action) => {
            state.deviceList = state.deviceList.filter((device) => device._id !== action.payload);
        }
    },
});

export const revenueReducer = revenueSlice.reducer;
export const deviceReducer = deviceSlice.reducer;

export const mockStore = configureStore({
    reducer: {
        revenueReducer,
        deviceReducer
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

