'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      localStorage.setItem('bookings', JSON.stringify(state.booking.bookings));
    });
    return () => unsubscribe();
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
