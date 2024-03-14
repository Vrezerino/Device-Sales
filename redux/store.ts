import { configureStore } from '@reduxjs/toolkit';
import deviceReducer from './features/deviceSlice';
import revenueReducer from './features/revenueSlice';
import customerReducer from './features/customerSlice';
import invoiceReducer from './features/invoiceSlice';
import storage from 'redux-persist/lib/storage';

export const store = configureStore({
    reducer: {
        deviceReducer,
        revenueReducer,
        customerReducer,
        invoiceReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;