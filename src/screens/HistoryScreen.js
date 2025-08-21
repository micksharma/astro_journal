// import React from "react";

// const HistoryScreen = () => {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>History Screen</Text>
//     </View>
//   );
// }           

// export default HistoryScreen;


import React, {useEffect, useState, useCallback} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
} from 'react-native';
import {useJournal} from '../hooks/useJournal';
import { formatDate, formatDateShort, getDaysAgo } from '../utils/constants';
import {getWordCount, getReadingTime} from '../utils/journalHelpers';
import {COLORS, SPACING} from '../utils/constants';

const HistoryScreen = ({navigation}) => {
  const {entries, stats, deleteEntry, clearError, error} = useJournal();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sortBy, setSortBy] = useState('date'); // 'date', 'wordCount'

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error, clearError]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate refresh - in real app, this would reload from storage
    setTimeout(() => setRefreshing(false), 500);
  }, []);

  const handleDeleteEntry = useCallback((date) => {
    setSelectedEntry(date);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (selectedEntry) {
      deleteEntry(selectedEntry);
      setShowDeleteModal(false);
      setSelectedEntry(null);
    }
  }, [selectedEntry, deleteEntry]);

  const handleEditEntry = useCallback((date) => {
    console.log('Edit entry for date:', date);
    navigation.navigate('Journal', {selectedDate: date});
  }, [navigation]);

  const filteredEntries = Object.entries(entries)
    .filter(([date, content]) => {
      if (!content || !content.trim()) return false;
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      return (
        content.toLowerCase().includes(query) ||
        formatDate(date).toLowerCase().includes(query)
      );
    })
    .sort(([dateA, contentA], [dateB, contentB]) => {
      if (sortBy === 'date') {
        return new Date(dateB) - new Date(dateA); // Latest first
      } else if (sortBy === 'wordCount') {
        return getWordCount(contentB) - getWordCount(contentA); // Highest word count first
      }
      return 0;
    });

  const JournalEntryCard = ({date, content, onEdit, onDelete}) => {
    const wordCount = getWordCount(content);
    const readingTime = getReadingTime(content);
    const preview = content.length > 150 ? content.substring(0, 150) + '...' : content;

    return (
      <View style={styles.entryCard}>
        <View style={styles.entryHeader}>
          <View style={styles.entryDateContainer}>
            <Text style={styles.entryDate}>{formatDateShort(date)}</Text>
            <Text style={styles.entryDateAgo}>{getDaysAgo(date)}</Text>
          </View>
          <View style={styles.entryActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(date)}>
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => onDelete(date)}>
              <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <Text style={styles.entryContent}>{preview}</Text>
        
        <View style={styles.entryFooter}>
          <Text style={styles.entryStats}>
            {wordCount} words • {readingTime} min read
          </Text>
        </View>
      </View>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📖</Text>
      <Text style={styles.emptyTitle}>No Journal Entries Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start writing your thoughts and they'll appear here
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('Journal')}>
        <Text style={styles.emptyButtonText}>Write First Entry</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search and Filter Header */}
      <View style={styles.headerContainer}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search your entries..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={COLORS.textMuted}
          />
        </View>
        
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, sortBy === 'date' && styles.filterButtonActive]}
            onPress={() => setSortBy('date')}>
            <Text style={[styles.filterText, sortBy === 'date' && styles.filterTextActive]}>
              Date
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, sortBy === 'wordCount' && styles.filterButtonActive]}
            onPress={() => setSortBy('wordCount')}>
            <Text style={[styles.filterText, sortBy === 'wordCount' && styles.filterTextActive]}>
              Length
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Your Writing Journey</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.totalEntries}</Text>
            <Text style={styles.statLabel}>Entries</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {Object.values(entries).reduce((total, content) => 
                total + getWordCount(content || ''), 0
              )}
            </Text>
            <Text style={styles.statLabel}>Total Words</Text>
          </View>
        </View>
      </View>

      {/* Entries List */}
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
        <View style={styles.entriesContainer}>
          {filteredEntries.length === 0 ? (
            <EmptyState />
          ) : (
            filteredEntries.map(([date, content]) => (
              <JournalEntryCard
                key={date}
                date={date}
                content={content}
                onEdit={handleEditEntry}
                onDelete={handleDeleteEntry}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Delete Entry?</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete this journal entry? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmDelete}>
                <Text style={styles.confirmButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerContainer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  searchContainer: {
    marginBottom: SPACING.md,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  filterButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginHorizontal: SPACING.xs,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterText: {
    color: COLORS.text,
    fontWeight: '500',
  },
  filterTextActive: {
    color: COLORS.white,
  },
  statsContainer: {
    backgroundColor: COLORS.surface,
    margin: SPACING.lg,
    marginTop: 0,
    borderRadius: 16,
    padding: SPACING.lg,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  scrollView: {
    flex: 1,
  },
  entriesContainer: {
    padding: SPACING.lg,
    paddingTop: 0,
  },
  entryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  entryDateContainer: {
    flex: 1,
  },
  entryDate: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  entryDateAgo: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  entryActions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    marginLeft: SPACING.sm,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.primary,
  },
  deleteButtonText: {
    color: COLORS.white,
  },
  entryContent: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  entryFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.md,
  },
  entryStats: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  emptyButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SPACING.lg,
    margin: SPACING.lg,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  modalText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.background,
  },
  confirmButton: {
    backgroundColor: COLORS.error,
  },
  cancelButtonText: {
    color: COLORS.text,
    fontWeight: '500',
  },
  confirmButtonText: {
    color: COLORS.white,
    fontWeight: '500',
  },
});

