import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {
  saveJournalEntry,
  getJournalEntry,
  getAllJournalEntries,
  deleteJournalEntry,
} from '../../services/storage';

export const loadJournalEntry = createAsyncThunk(
  'journal/loadJournalEntry',
  async (date) => {
    const entry = await getJournalEntry(date);
    return {date, entry};
  }
);

export const saveJournal = createAsyncThunk(
  'journal/saveJournal',
  async ({date, content}) => {
    await saveJournalEntry(date, content);
    return {date, content};
  }
);

export const loadAllEntries = createAsyncThunk(
  'journal/loadAllEntries',
  async () => {
    const entries = await getAllJournalEntries();
    return entries;
  }
);

export const deleteEntry = createAsyncThunk(
  'journal/deleteEntry',
  async (date) => {
    await deleteJournalEntry(date);
    return date;
  }
);

const journalSlice = createSlice({
  name: 'journal',
  initialState: {
    entries: {},
    currentEntry: '',
    currentDate: '',
    loading: false,
    saving: false,
    error: null,
    stats: {
      totalEntries: 0,
      currentStreak: 0,
      longestStreak: 0,
    },
  },
  reducers: {
    setCurrentEntry: (state, action) => {
      state.currentEntry = action.payload;
    },
    setCurrentDate: (state, action) => {
      state.currentDate = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateStats: (state) => {
      const dates = Object.keys(state.entries)
        .filter(date => state.entries[date]?.trim())
        .sort();
      
      state.stats.totalEntries = dates.length;
      
      // Calculate streaks
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      for (let i = dates.length - 1; i >= 0; i--) {
        const date = dates[i];
        const prevDate = i > 0 ? dates[i - 1] : null;
        
        if (i === dates.length - 1) {
          tempStreak = 1;
          if (date === today || date === yesterday) {
            currentStreak = 1;
          }
        } else if (prevDate) {
          const daysDiff = (new Date(date) - new Date(prevDate)) / (1000 * 60 * 60 * 24);
          if (daysDiff === 1) {
            tempStreak++;
            if (dates[dates.length - 1] === today || dates[dates.length - 1] === yesterday) {
              currentStreak = Math.max(currentStreak, tempStreak);
            }
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
      }
      
      state.stats.longestStreak = Math.max(longestStreak, tempStreak, currentStreak);
      if (dates[dates.length - 1] !== today && dates[dates.length - 1] !== yesterday) {
        state.stats.currentStreak = 0;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadJournalEntry.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadJournalEntry.fulfilled, (state, action) => {
        state.loading = false;
        const {date, entry} = action.payload;
        state.entries[date] = entry;
        if (date === state.currentDate) {
          state.currentEntry = entry || '';
        }
      })
      .addCase(loadJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(saveJournal.pending, (state) => {
        state.saving = true;
      })
      .addCase(saveJournal.fulfilled, (state, action) => {
        state.saving = false;
        const {date, content} = action.payload;
        state.entries[date] = content;
        journalSlice.caseReducers.updateStats(state);
      })
      .addCase(saveJournal.rejected, (state, action) => {
        state.saving = false;
        state.error = action.error.message;
      })
      .addCase(loadAllEntries.fulfilled, (state, action) => {
        state.entries = action.payload;
        journalSlice.caseReducers.updateStats(state);
      })
      .addCase(deleteEntry.fulfilled, (state, action) => {
        delete state.entries[action.payload];
        journalSlice.caseReducers.updateStats(state);
      });
  },
});

export const {setCurrentEntry, setCurrentDate, clearError, updateStats} = journalSlice.actions;
export default journalSlice.reducer;