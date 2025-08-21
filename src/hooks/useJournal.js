import {useEffect, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  loadJournalEntry,
  saveJournal,
  setCurrentEntry,
  setCurrentDate,
  loadAllEntries,
  deleteEntry,
  clearError,
} from '../store/slices/journalSlice';
import { getToday } from '../utils/constants';
export const useJournal = () => {
  const dispatch = useDispatch();
  const {entries, currentEntry, currentDate, loading, saving, error, stats} = useSelector(
    state => state.journal
  );

  useEffect(() => {
    const today = getToday();
    dispatch(setCurrentDate(today));
    dispatch(loadJournalEntry(today));
    dispatch(loadAllEntries());
  }, []);

  const updateEntry = useCallback((content) => {
    dispatch(setCurrentEntry(content));
  }, [dispatch]);

  const saveEntry = useCallback((date = currentDate, content = currentEntry) => {
    if (content.trim()) {
      dispatch(saveJournal({date, content}));
    }
  }, [dispatch, currentDate, currentEntry]);

  const loadEntry = useCallback((date) => {
    dispatch(loadJournalEntry(date));
  }, [dispatch]);

  const deleteJournalEntry = useCallback((date) => {
    dispatch(deleteEntry(date));
  }, [dispatch]);

  const clearJournalError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

   const changeCurrentDate = useCallback(
    (date) => {
      dispatch(setCurrentDate(date));
    },
    [dispatch]
  );

  return {
    entries,
    currentEntry,
    currentDate,
    loading,
    saving,
    error,
    stats,
    updateEntry,
    saveEntry,
    loadEntry,
    deleteEntry: deleteJournalEntry,
    clearError: clearJournalError,
    setCurrentDate: changeCurrentDate,
  };
};
