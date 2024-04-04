import { CardsData, DevicesTable, InvoicesTable as InvoicesTableType } from '@/app/lib/definitions';
import { CardsState } from '@/redux/features/cardsSlice';
import { DeviceState } from '@/redux/features/deviceSlice';
import { InvoiceState } from '@/redux/features/invoiceSlice';

import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { vi } from 'vitest';

// Define mock Redux store.
const preloadedInvoiceState: InvoiceState = {
    invoiceList: [
        {
            _id: '66088d7f9f9de096ed429a63',
            name: 'Delba de Oliveira',
            email: 'delba@oliveira.com',
            imageUrl: 'https://device-sales-dev.s3.eu-north-1.amazonaws.com/img/customers/delba-de-oliveira.png',
            amountInCents: 123650,
            date: '2024-03-30',
            status: 'paid'
          },
          {
            _id: '66088fe29f9de096ed429a69',
            name: 'Patrick Park',
            email: 'abc@gmail.com',
            imageUrl: 'https://device-sales-dev.s3.eu-north-1.amazonaws.com/img/customers/patrick-park.png',
            amountInCents: 600000,
            date: '2024-02-5',
            status: 'paid'
          }
    ],
};

const preloadedDeviceState: DeviceState = {
    deviceList: []
};

const preloadedCardsState: CardsState = {
    cardsData: {} as CardsData
};

export const invoiceSlice = createSlice({
    name: 'invoices',
    initialState: preloadedInvoiceState,
    reducers: {
        setInvoices: (state, action: PayloadAction<InvoicesTableType[]>) => {
            state.invoiceList = action.payload;
        },
        addInvoice: (state, action) => {
            state.invoiceList.push(action.payload);
        },
        editInvoice: (state, action) => {
            state.invoiceList = state.invoiceList.map((invoice) => invoice._id === action.payload._id ? action.payload : invoice);
        },
        removeInvoice: (state, action) => {
            state.invoiceList = state.invoiceList.filter((invoice) => invoice._id !== action.payload);
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

export const cardsSlice = createSlice({
    name: 'cardsdata',
    initialState: preloadedCardsState,
    reducers: {
        setCardsData: (state, action: PayloadAction<CardsData>) => {
            state.cardsData = action.payload;
        }
    },
});

export const invoiceReducer = invoiceSlice.reducer;
export const deviceReducer = deviceSlice.reducer;
export const cardsReducer = cardsSlice.reducer;

export const mockStore = configureStore({
    reducer: {
        invoiceReducer,
        deviceReducer,
        cardsReducer
    },
});

/**
 * Setup file needs to have a .tsx file extension so that Provider
 * doesn't merely refer to its type.
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