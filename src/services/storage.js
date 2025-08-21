import AsyncStorage from '@react-native-async-storage/async-storage';

const JOURNAL_PREFIX = 'journal_';
const SETTINGS_KEY = 'app_settings';
const USER_PREFERENCES_KEY = 'user_preferences';

export const saveJournalEntry = async (date, content) => {
  try {
    await AsyncStorage.setItem(`${JOURNAL_PREFIX}${date}`, JSON.stringify({
      content,
      timestamp: new Date().toISOString(),
      wordCount: content.trim().split(/\s+/).length,
    }));
  } catch (error) {
    console.error('Error saving journal entry:', error);
    throw new Error('Failed to save journal entry');
  }
};

export const getJournalEntry = async (date) => {
  try {
    const entry = await AsyncStorage.getItem(`${JOURNAL_PREFIX}${date}`);
    if (entry) {
      const parsed = JSON.parse(entry);
      return parsed.content || parsed; // Handle both old and new format
    }
    return null;
  } catch (error) {
    console.error('Error loading journal entry:', error);
    return null;
  }
};

export const getAllJournalEntries = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const journalKeys = keys.filter(key => key.startsWith(JOURNAL_PREFIX));
    const entries = await AsyncStorage.multiGet(journalKeys);

    return entries.reduce((acc, [key, value]) => {
      const date = key.replace(JOURNAL_PREFIX, '');
      try {
        const parsed = JSON.parse(value);
        acc[date] = parsed.content || parsed;
      } catch {
        acc[date] = value; // Fallback for old format
      }
      return acc;
    }, {});
  } catch (error) {
    console.error('Error loading all journal entries:', error);
    return {};
  }
};

export const deleteJournalEntry = async (date) => {
  try {
    await AsyncStorage.removeItem(`${JOURNAL_PREFIX}${date}`);
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    throw new Error('Failed to delete journal entry');
  }
};

export const saveSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const getSettings = async () => {
  try {
    const settings = await AsyncStorage.getItem(SETTINGS_KEY);
    return settings ? JSON.parse(settings) : null;
  } catch (error) {
    console.error('Error loading settings:', error);
    return null;
  }
};
