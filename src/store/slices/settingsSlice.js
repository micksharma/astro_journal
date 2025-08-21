import {createSlice} from '@reduxjs/toolkit';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    notifications: {
      enabled: true,
      horoscopeTime: '09:00',
      journalReminder: '20:00',
    },
    preferences: {
      theme: 'light',
      fontSize: 'medium',
      defaultSign: 'aries',
    },
    privacy: {
      analytics: true,
      crashReporting: true,
    },
  },
  reducers: {
    updateNotifications: (state, action) => {
      state.notifications = {...state.notifications, ...action.payload};
    },
    updatePreferences: (state, action) => {
      state.preferences = {...state.preferences, ...action.payload};
    },
    updatePrivacy: (state, action) => {
      state.privacy = {...state.privacy, ...action.payload};
    },
  },
});

export const {updateNotifications, updatePreferences, updatePrivacy} = settingsSlice.actions;
export default settingsSlice.reducer;