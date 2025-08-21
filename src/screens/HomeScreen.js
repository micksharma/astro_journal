import React, {useEffect, useCallback} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {useHoroscope} from '../hooks/useHoroscope';
import {useJournal} from '../hooks/useJournal';
import HoroscopeCard from '../components/HoroscopeCard';
import ZodiacSelector from '../components/ZodiacSelector';
import StatsCard from '../components/StatsCard';
import { getToday , formatDate , getGreeting} from '../utils/constants';
import {COLORS, SPACING} from '../utils/constants';

const HomeScreen = ({navigation}) => {
  const {currentSign, horoscope, loading, error, loadHoroscope, changeSign, clearError} = useHoroscope();
  const {stats, currentEntry} = useJournal();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleSignChange = useCallback((newSign) => {
    changeSign(newSign);
  }, [changeSign]);

  const navigateToJournal = useCallback(() => {
    navigation.navigate('Journal');
  }, [navigation]);

  const navigateToHistory = useCallback(() => {
    navigation.navigate('History');
  }, [navigation]);

  const navigateToSettings = useCallback(() => {
    navigation.navigate('Settings');
  }, [navigation]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    clearError();
    await loadHoroscope(currentSign);
    setRefreshing(false);
  }, [currentSign, loadHoroscope, clearError]);

  const handleRetry = useCallback(() => {
    loadHoroscope(currentSign);
  }, [currentSign, loadHoroscope]);

  useEffect(() => {
    if (error) {
      Alert.alert(
        'Connection Error',
        'Unable to load your horoscope. Please check your internet connection.',
        [
          {text: 'OK', style: 'default'},
          {text: 'Retry', onPress: handleRetry, style: 'default'},
        ]
      );
    }
  }, [error, handleRetry]);

  const hasJournalEntry = currentEntry && currentEntry.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }>
        <View style={styles.content}>
        
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{getGreeting()} ✨</Text>
              <Text style={styles.dateText}>{formatDate(getToday())}</Text>
            </View>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={navigateToSettings}>
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>

         
          <ZodiacSelector
            selectedSign={currentSign}
            onSignChange={handleSignChange}
          />

          
          <HoroscopeCard
            horoscope={horoscope}
            loading={loading}
            error={error}
            onRetry={handleRetry}
          />

     
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                hasJournalEntry && styles.primaryButtonActive,
              ]}
              onPress={navigateToJournal}
              activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>
                {hasJournalEntry ? '✏️ Continue Writing' : '📝 Start Writing'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={navigateToHistory}
              activeOpacity={0.8}>
              <Text style={styles.secondaryButtonText}>📖 View History</Text>
            </TouchableOpacity>
          </View>

         
          <StatsCard stats={stats} />

         
          <View style={styles.inspirationContainer}>
            <Text style={styles.inspirationText}>
              "The stars guide us, but our thoughts shape our destiny. Write your story, one day at a time."
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  settingsButton: {
    padding: SPACING.sm,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
  },
  settingsIcon: {
    fontSize: 24,
  },
  actionContainer: {
    marginBottom: SPACING.lg,
  },
  primaryButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    shadowColor: COLORS.secondary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonActive: {
    backgroundColor: COLORS.accent,
    shadowColor: COLORS.accent,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  inspirationContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  inspirationText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default HomeScreen;

