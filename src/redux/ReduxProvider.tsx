'use client'; // ✅ make this a client component

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      {/* TODO : Will add loading here */}
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
