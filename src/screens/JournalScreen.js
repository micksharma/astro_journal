// import React from "react";

// const JournalScreen = () => {
//     return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text>Journal Screen</Text>
//         </View>
//     );
// }

// export default JournalScreen

import React, {useEffect, useRef} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useJournal} from '../hooks/useJournal';
import {useHoroscope} from '../hooks/useHoroscope';
import JournalEntry from '../components/JournalEntry';
import { getToday ,formatDate } from '../utils/constants';
import {generateJournalPrompts} from '../utils/journalHelpers';
import {COLORS, SPACING} from '../utils/constants';

const JournalScreen = ({navigation, route}) => {
  const {
    currentEntry,
    currentDate,
    saving,
    error,
    updateEntry,
    saveEntry,
    clearError,
    loadEntry,
    setCurrentDate,
  } = useJournal();
  
  const {currentSign, horoscope} = useHoroscope();
  const autoSaveTimer = useRef(null);

  // Handle navigation from History screen with specific date
  useEffect(() => {
    console.log('Route params:', route?.params);
    if (route?.params?.selectedDate) {
      const selectedDate = route.params.selectedDate;
      setCurrentDate(selectedDate);
      loadEntry(selectedDate);
    }
  }, [route?.params?.selectedDate]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', 'Failed to save journal entry. Please try again.');
      clearError();
    }
  }, [error, clearError]);

  // Auto-save functionality with debounce
  useEffect(() => {
    if (currentEntry.trim().length > 0) {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
      
      autoSaveTimer.current = setTimeout(() => {
        saveEntry();
      }, 3000); // Auto-save after 3 seconds of inactivity

      return () => {
        if (autoSaveTimer.current) {
          clearTimeout(autoSaveTimer.current);
        }
      };
    }
  }, [currentEntry, saveEntry]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, []);

  const handleEntryChange = (text) => {
    updateEntry(text);
  };

  const handleSave = () => {
    saveEntry();
  };

  const handlePromptPress = (prompt) => {
    const newText = currentEntry + (currentEntry ? '\n\n' : '') + prompt + '\n\n';
    updateEntry(newText);
  };

  const prompts = generateJournalPrompts(currentSign, horoscope?.mood);
  const isToday = currentDate === getToday();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.dateText}>{formatDate(currentDate)}</Text>
            <Text style={styles.subtitle}>
              {isToday ? 'Express your thoughts and feelings' : 'Reflecting on this day'}
            </Text>
          </View>

          {/* Journal Entry Component */}
          <JournalEntry
            entry={currentEntry}
            onEntryChange={handleEntryChange}
            onSave={handleSave}
            saving={saving}
            placeholder={
              isToday 
                ? "How are you feeling today? What insights did your horoscope bring? Write about your day, your dreams, or anything on your mind..."
                : "What happened on this day? How were you feeling? What memories stand out?"
            }
            style={styles.journalEntry}
          />

          {/* Writing Prompts - Only show for today */}
          {isToday && prompts.length > 0 && (
            <View style={styles.promptsContainer}>
              <Text style={styles.promptsTitle}>Writing Prompts</Text>
              {prompts.map((prompt, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.promptItem}
                  onPress={() => handlePromptPress(prompt)}
                  activeOpacity={0.7}>
                  <Text style={styles.promptText}>• {prompt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Tips Container */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Journaling Tips</Text>
            <Text style={styles.tipText}>
              • Be honest and authentic with your feelings
            </Text>
            <Text style={styles.tipText}>
              • Reflect on your horoscope and how it resonated
            </Text>
            <Text style={styles.tipText}>
              • Write about gratitude and positive moments
            </Text>
            <Text style={styles.tipText}>
              • Set intentions for tomorrow
            </Text>
            <Text style={styles.tipText}>
              • Don't worry about perfect grammar or spelling
            </Text>
          </View>

          {/* Status Container */}
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              {saving ? 'Saving...' : currentEntry.trim() ? 'Auto-saved' : 'Start writing...'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  journalEntry: {
    marginBottom: SPACING.lg,
  },
  promptsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  promptsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  promptItem: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  promptText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  tipsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  tipText: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  statusContainer: {
    alignItems: 'center',
    padding: SPACING.md,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});

export default JournalScreen;