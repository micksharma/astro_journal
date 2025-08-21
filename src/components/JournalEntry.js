import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {COLORS, SPACING} from '../utils/constants';
import {getWordCount, getReadingTime} from '../utils/journalHelpers';

const JournalEntry = ({
  entry,
  onEntryChange,
  onSave,
  saving,
  placeholder = "What's on your mind today?",
  style,
}) => {
  const [localEntry, setLocalEntry] = useState(entry || '');
  const [hasChanges, setHasChanges] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const saveAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setLocalEntry(entry || '');
    setHasChanges(false);
  }, [entry]);

  useEffect(() => {
    if (saving) {
      Animated.sequence([
        Animated.timing(saveAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(saveAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [saving]);

  const handleTextChange = (text) => {
    setLocalEntry(text);
    setHasChanges(true);
    onEntryChange(text);
  };

  const handleSave = () => {
    onSave();
    setHasChanges(false);
  };

  const wordCount = getWordCount(localEntry);
  const readingTime = getReadingTime(localEntry);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.label}>Today's Journal Entry</Text>
        {wordCount > 0 && (
          <View style={styles.statsContainer}>
            <Text style={styles.stats}>
              {wordCount} words • {readingTime} min read
            </Text>
          </View>
        )}
      </View>

      <TextInput
        style={[
          styles.textInput,
          isFocused && styles.textInputFocused,
        ]}
        value={localEntry}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        multiline
        textAlignVertical="top"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      <View style={styles.footer}>
        <Text style={styles.charCount}>
          {localEntry.length} characters
        </Text>

        {hasChanges && (
          <Animated.View
            style={{
              opacity: saveAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.7],
              }),
              transform: [{
                scale: saveAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.95],
                }),
              }],
            }}>
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.savingButton]}
              onPress={handleSave}
              disabled={saving}
              activeOpacity={0.8}>
              {saving ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.saveButtonText}>💾 Save</Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  statsContainer: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
  },
  stats: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
    minHeight: 200,
    maxHeight: 400,
    fontFamily: COLORS.regular,
  },
  textInputFocused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  savingButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default JournalEntry;
