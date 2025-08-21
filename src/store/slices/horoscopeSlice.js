import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getHoroscope} from '../../services/horoscopeService';

export const fetchHoroscope = createAsyncThunk(
  'horoscope/fetchHoroscope',
  async ({sign, day}, {rejectWithValue}) => {
    try {
      const response = await getHoroscope(sign, day);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const horoscopeSlice = createSlice({
  name: 'horoscope',
  initialState: {
    currentSign: 'aries',
    horoscope: null,
    loading: false,
    error: null,
    lastFetched: null,
    cache: {},
  },
  reducers: {
    setCurrentSign: (state, action) => {
      state.currentSign = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCache: (state) => {
      state.cache = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHoroscope.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHoroscope.fulfilled, (state, action) => {
        state.loading = false;
        state.horoscope = action.payload;
        state.lastFetched = new Date().toISOString();
        const cacheKey = `${state.currentSign}_${new Date().toDateString()}`;
        state.cache[cacheKey] = action.payload;
      })
      .addCase(fetchHoroscope.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {setCurrentSign, clearError, clearCache} = horoscopeSlice.actions;
export default horoscopeSlice.reducer;
