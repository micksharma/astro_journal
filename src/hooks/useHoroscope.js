import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {fetchHoroscope, setCurrentSign, clearError} from '../store/slices/horoscopeSlice';

export const useHoroscope = () => {
  const dispatch = useDispatch();
  const {currentSign, horoscope, loading, error, lastFetched, cache} = useSelector(
    state => state.horoscope
  );

  const loadHoroscope = (sign = currentSign, day = 'today') => {
    const cacheKey = `${sign}_${new Date().toDateString()}`;
    
    // Check cache first
    if (cache[cacheKey] && day === 'today') {
      return;
    }
    
    dispatch(fetchHoroscope({sign, day}));
  };

  const changeSign = (newSign) => {
    dispatch(setCurrentSign(newSign));
  };

  const clearHoroscopeError = () => {
    dispatch(clearError());
  };

  useEffect(() => {
    if (!horoscope || currentSign !== horoscope?.sign?.toLowerCase()) {
      loadHoroscope();
    }
  }, [currentSign]);

  return {
    currentSign,
    horoscope,
    loading,
    error,
    lastFetched,
    loadHoroscope,
    changeSign,
    clearError: clearHoroscopeError,
  };
};
