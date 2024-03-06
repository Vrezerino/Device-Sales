import { configureStore } from '@reduxjs/toolkit';
import deviceReducer from './features/deviceSlice';

export const store = configureStore({
    reducer: {
        deviceReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;