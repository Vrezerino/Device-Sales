import { configureStore } from '@reduxjs/toolkit';
import deviceReducer from './features/deviceSlice';
import customerReducer from './features/customerSlice';
import invoiceReducer from './features/invoiceSlice';
import cardsReducer from './features/cardsSlice'

export const store = configureStore({
    reducer: {
        deviceReducer,
        customerReducer,
        invoiceReducer,
        cardsReducer
    },
});

//store.subscribe(() => console.log('State:', store.getState()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;