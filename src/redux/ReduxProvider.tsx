'use client'; // ✅ client component

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  const FullPageLoader = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-900">
      <div className="space-y-4 w-1/4">
        {/* Big pulse block */}
        <div className="w-full h-6 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse" />
        <div className="w-full h-6 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse" />
        <div className="w-full h-6 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse" />
        <div className="w-full h-6 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse" />
        <div className="w-full h-6 bg-gray-200 dark:bg-slate-700 rounded-full animate-pulse" />
      </div>
    </div>
  )

  return (
    <Provider store={store}>
      <PersistGate loading={<FullPageLoader />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
