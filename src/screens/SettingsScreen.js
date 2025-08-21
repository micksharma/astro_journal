// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// const SettingsScreen = () => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Settings Screen</Text>
//     </View>
//   );
// }                                           


// export default SettingsScreen;

import React, {useState, useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {updateNotifications, updatePreferences, updatePrivacy} from '../store/slices/settingsSlice';
import {clearCache} from '../store/slices/horoscopeSlice';
import {ZODIAC_SIGNS, COLORS, SPACING} from '../utils/constants';
import ZodiacSelector from '../components/ZodiacSelector';

const SettingsScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settings);
  const horoscopeCache = useSelector(state => state.horoscope.cache);
  const journalStats = useSelector(state => state.journal.stats);
  
  const [showSignSelector, setShowSignSelector] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [currentTimeType, setCurrentTimeType] = useState(null);
  const [timeInput, setTimeInput] = useState('');

  const SettingSection = ({title, children}) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const SettingRow = ({
    title,
    subtitle,
    value,
    onPress,
    showSwitch = false,
    switchValue = false,
    onSwitchChange,
    showArrow = false,
  }) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      activeOpacity={showSwitch ? 1 : 0.7}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.settingValue}>
        {showSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{false: COLORS.border, true: COLORS.primary}}
            thumbColor={COLORS.white}
          />
        ) : (
          <>
            {value && <Text style={styles.valueText}>{value}</Text>}
            {showArrow && <Text style={styles.arrow}>></Text>}
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  const handleDefaultSignChange = (newSign) => {
    dispatch(updatePreferences({defaultSign: newSign}));
    setShowSignSelector(false);
  };

  const handleTimeChange = (timeType) => {
    setCurrentTimeType(timeType);
    setTimeInput(settings.notifications[timeType]);
    setShowTimeModal(true);
  };

  const confirmTimeChange = () => {
    if (currentTimeType && timeInput.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
      dispatch(updateNotifications({[currentTimeType]: timeInput}));
      setShowTimeModal(false);
      setCurrentTimeType(null);
      setTimeInput('');
    } else {
      Alert.alert('Invalid Time', 'Please enter time in HH:MM format (24-hour)');
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached horoscope data and force fresh downloads. Continue?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            dispatch(clearCache());
            Alert.alert('Success', 'Cache cleared successfully');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Export functionality would allow you to backup your journal entries. This feature would be implemented with file system access in a production app.',
      [{text: 'OK'}]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About Astro Journal',
      'Version 1.0.0\n\nAstro Journal helps you connect with your inner self through daily horoscopes and mindful journaling.\n\nCreated with ❤️ for self-discovery.',
      [{text: 'OK'}]
    );
  };

  const cacheSize = Object.keys(horoscopeCache).length;
  const currentSign = ZODIAC_SIGNS.find(sign => sign.value === settings.preferences.defaultSign);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          
          {/* Notifications Section */}
          <SettingSection title="🔔 Notifications">
            <SettingRow
              title="Enable Notifications"
              subtitle="Receive daily horoscope and journal reminders"
              showSwitch
              switchValue={settings.notifications.enabled}
              onSwitchChange={(value) => 
                dispatch(updateNotifications({enabled: value}))
              }
            />
            
            <SettingRow
              title="Daily Horoscope Time"
              subtitle="When to receive your horoscope"
              value={settings.notifications.horoscopeTime}
              onPress={() => handleTimeChange('horoscopeTime')}
              showArrow
            />
            
            <SettingRow
              title="Journal Reminder Time"
              subtitle="When to be reminded to journal"
              value={settings.notifications.journalReminder}
              onPress={() => handleTimeChange('journalReminder')}
              showArrow
            />
          </SettingSection>

          {/* Preferences Section */}
          <SettingSection title="⚙️ Preferences">
            <SettingRow
              title="Default Zodiac Sign"
              subtitle={`Currently: ${currentSign?.label || 'None selected'}`}
              onPress={() => setShowSignSelector(true)}
              showArrow
            />
            
            <SettingRow
              title="Theme"
              subtitle="App appearance"
              value={settings.preferences.theme === 'light' ? 'Light' : 'Dark'}
              onPress={() => {
                const newTheme = settings.preferences.theme === 'light' ? 'dark' : 'light';
                dispatch(updatePreferences({theme: newTheme}));
              }}
              showArrow
            />
            
            <SettingRow
              title="Font Size"
              subtitle="Text size in journal entries"
              value={settings.preferences.fontSize.charAt(0).toUpperCase() + settings.preferences.fontSize.slice(1)}
              onPress={() => {
                const sizes = ['small', 'medium', 'large'];
                const currentIndex = sizes.indexOf(settings.preferences.fontSize);
                const nextIndex = (currentIndex + 1) % sizes.length;
                dispatch(updatePreferences({fontSize: sizes[nextIndex]}));
              }}
              showArrow
            />
          </SettingSection>

          {/* Data & Privacy Section */}
          <SettingSection title="🔒 Data & Privacy">
            <SettingRow
              title="Analytics"
              subtitle="Help improve the app with usage data"
              showSwitch
              switchValue={settings.privacy.analytics}
              onSwitchChange={(value) => 
                dispatch(updatePrivacy({analytics: value}))
              }
            />
            
            <SettingRow
              title="Crash Reporting"
              subtitle="Send crash reports to improve stability"
              showSwitch
              switchValue={settings.privacy.crashReporting}
              onSwitchChange={(value) => 
                dispatch(updatePrivacy({crashReporting: value}))
              }
            />
            
            <SettingRow
              title="Export Journal Data"
              subtitle="Backup your journal entries"
              onPress={handleExportData}
              showArrow
            />
          </SettingSection>

          {/* App Info Section */}
          <SettingSection title="ℹ️ App Information">
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Journal Entries:</Text>
                <Text style={styles.infoValue}>{journalStats.totalEntries}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Current Streak:</Text>
                <Text style={styles.infoValue}>{journalStats.currentStreak} days</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Cache Size:</Text>
                <Text style={styles.infoValue}>{cacheSize} items</Text>
              </View>
            </View>
            
            <SettingRow
              title="Clear Cache"
              subtitle="Free up space and refresh horoscope data"
              onPress={handleClearCache}
              showArrow
            />
            
            <SettingRow
              title="About"
              subtitle="App version and information"
              onPress={handleAbout}
              showArrow
            />
          </SettingSection>
        </View>
      </ScrollView>

      {/* Zodiac Sign Selector Modal */}
      <Modal
        visible={showSignSelector}
        animationType="slide"
        presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowSignSelector(false)}
              style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Default Sign</Text>
            <View style={styles.modalSpacer} />
          </View>
          
          <ZodiacSelector
            selectedSign={settings.preferences.defaultSign}
            onSignChange={handleDefaultSignChange}
            style={styles.modalZodiacSelector}
          />
        </SafeAreaView>
      </Modal>

      {/* Time Input Modal */}
      <Modal
        visible={showTimeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTimeModal(false)}>
        <View style={styles.timeModalOverlay}>
          <View style={styles.timeModalContainer}>
            <Text style={styles.timeModalTitle}>
              Set {currentTimeType === 'horoscopeTime' ? 'Horoscope' : 'Journal Reminder'} Time
            </Text>
            <TextInput
              style={styles.timeInput}
              value={timeInput}
              onChangeText={setTimeInput}
              placeholder="HH:MM (24-hour format)"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
            />
            <View style={styles.timeModalButtons}>
              <TouchableOpacity
                style={[styles.timeModalButton, styles.timeCancelButton]}
                onPress={() => setShowTimeModal(false)}>
                <Text style={styles.timeCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.timeModalButton, styles.timeConfirmButton]}
                onPress={confirmTimeChange}>
                <Text style={styles.timeConfirmText}>Set Time</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingsScreen;

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
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  settingRow: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingContent: {
    flex: 1,
    marginRight: SPACING.md,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  settingSubtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 16,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 14,
    color: COLORS.primary,
    marginRight: SPACING.sm,
  },
  arrow: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
  infoContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.primary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalCloseButton: {
    padding: SPACING.sm,
  },
  modalCloseText: {
    fontSize: 16,
    color: COLORS.primary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  modalSpacer: {
    width: 60,
  },
  modalZodiacSelector: {
    marginTop: SPACING.lg,
  },
  timeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeModalContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    margin: SPACING.lg,
    minWidth: 280,
  },
  timeModalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  timeInput: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: SPACING.md,
    fontSize: 16,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  timeModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  timeModalButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  timeCancelButton: {
    backgroundColor: COLORS.background,
  },
  timeConfirmButton: {
    backgroundColor: COLORS.primary,
  },
  timeCancelText: {
    color: COLORS.text,
    fontWeight: '500',
  },
  timeConfirmText: {
    color: COLORS.white,
    fontWeight: '500',
  },
});

