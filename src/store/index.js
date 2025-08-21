import {configureStore} from '@reduxjs/toolkit';
import horoscopeReducer from './slices/horoscopeSlice';
import journalReducer from './slices/journalSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    horoscope: horoscopeReducer,
    journal: journalReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
