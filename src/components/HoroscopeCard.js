import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator, TouchableOpacity} from 'react-native';
import {COLORS, SPACING} from '../utils/constants';

const HoroscopeCard = ({horoscope, loading, error, onRetry, style}) => {
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer, style]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your cosmic insights...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer, style]}>
        <Text style={styles.errorEmoji}>🔮</Text>
        <Text style={styles.errorText}>Unable to connect to the stars</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
        {onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (!horoscope) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.signContainer}>
          <Text style={styles.signName}>{horoscope.sign}</Text>
          <Text style={styles.date}>Today's Reading</Text>
        </View>
        <View style={styles.moodContainer}>
          <Text style={styles.moodLabel}>Mood</Text>
          <Text style={[styles.mood, {color: horoscope.color}]}>{horoscope.mood}</Text>
        </View>
      </View>
      
      <Text style={styles.horoscopeText}>{horoscope.horoscope}</Text>
      
      <View style={styles.footer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Lucky #</Text>
          <Text style={styles.infoValue}>{horoscope.luckyNumber}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Compatible</Text>
          <Text style={styles.infoValue}>{horoscope.compatibility}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  signContainer: {
    flex: 1,
  },
  signName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    textTransform: 'capitalize',
    marginBottom: SPACING.xs,
  },
  date: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  moodContainer: {
    alignItems: 'flex-end',
  },
  moodLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  mood: {
    fontSize: 16,
    fontWeight: '600',
  },
  horoscopeText: {
    fontSize: 16,
    lineHeight: 26,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  errorEmoji: {
    fontSize: 40,
    marginBottom: SPACING.md,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    fontWeight: '600',
  },
  errorSubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});

export default HoroscopeCard;
