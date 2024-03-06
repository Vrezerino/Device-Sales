'use client';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { persistStore } from 'redux-persist';
//import { PersistGate } from 'redux-persist/integration/react';

//let persistor = persistStore(store);
export default function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        //<PersistGate loading={null} persistor={persistor}>
            <Provider store={store}>{children}</Provider>
        //</PersistGate>
    );
};
