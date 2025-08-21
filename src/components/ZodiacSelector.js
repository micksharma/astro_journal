import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {ZODIAC_SIGNS, COLORS, SPACING} from '../utils/constants';

const ZodiacSelector = ({selectedSign, onSignChange, style}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>Choose Your Sign</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}>
        {ZODIAC_SIGNS.map((sign) => (
          <TouchableOpacity
            key={sign.value}
            style={[
              styles.signButton,
              selectedSign === sign.value && styles.selectedButton,
            ]}
            onPress={() => onSignChange(sign.value)}
            activeOpacity={0.7}>
            <Text style={styles.emoji}>{sign.emoji}</Text>
            <Text
              style={[
                styles.signText,
                selectedSign === sign.value && styles.selectedText,
              ]}>
              {sign.value.charAt(0).toUpperCase() + sign.value.slice(1)}
            </Text>
            <Text style={styles.dates}>{sign.dates}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
  },
  signButton: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: 16,
    marginRight: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    transform: [{scale: 1.05}],
  },
  emoji: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  signText: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 14,
    marginBottom: SPACING.xs,
  },
  selectedText: {
    color: COLORS.white,
  },
  dates: {
    color: COLORS.textMuted,
    fontSize: 10,
    textAlign: 'center',
  },
});

export default ZodiacSelector;