import { configureStore } from '@reduxjs/toolkit';
import deviceReducer from './features/deviceSlice';
import revenueReducer from './features/revenueSlice';
import storage from 'redux-persist/lib/storage'

/*
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}
const persistedReducer = persistReducer(persistConfig, deviceReducer)
*/

export const store = configureStore({
    reducer: {
        deviceReducer,
        revenueReducer
    },
    /*
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
    */
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;