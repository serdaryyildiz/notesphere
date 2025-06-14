import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { COLORS, FONTS, SIZES } from '../utils/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { Note } from '../types';
import { repositoryService } from '../services/api';

type RepositoryDetailScreenProps = Partial<NativeStackScreenProps<MainStackParamList, 'Repository'>>;

const RepositoryDetailScreen: React.FC<RepositoryDetailScreenProps> = ({ route }) => {
  const repositoryId = route?.params?.repositoryId;
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (repositoryId) {
      fetchNotes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repositoryId]);

  const fetchNotes = async () => {
    if (!repositoryId) return;
    try {
      setLoading(true);
      const data = await repositoryService.listNotes(repositoryId);
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      Alert.alert('Error', 'An error occurred while loading notes.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!repositoryId) return;
    if (!title || !content) {
      Alert.alert('Error', 'Title and content cannot be empty.');
      return;
    }
    setLoading(true);
    try {
      const newNote = await repositoryService.addNote(repositoryId, { title, content });
      setNotes([newNote, ...notes]);
      setTitle('');
      setContent('');
    } catch (error: any) {
      Alert.alert('Error', 'Not eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Repository Notes</Text>
        <View style={styles.formContainer}>
          <TextInput
            label="Note Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Note Content"
            value={content}
            onChangeText={setContent}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity
            style={[styles.addButton, loading && styles.addButtonDisabled]}
            onPress={handleAddNote}
            disabled={loading}
          >
            <Text style={styles.addButtonText}>{loading ? 'Adding...' : 'Add Note'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.notesList}>
          {notes.length === 0 ? (
            <Text style={styles.emptyText}>No notes in this repository.</Text>
          ) : (
            notes.map((note) => (
              <View key={note.id} style={styles.noteCard}>
                <Text style={styles.noteTitle}>{note.title}</Text>
                <Text style={styles.noteContent}>{note.content}</Text>
                <Text style={styles.noteDate}>{new Date(note.createdAt).toLocaleString()}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: SIZES.xl,
  },
  title: {
    ...FONTS.bold,
    fontSize: 24,
    color: COLORS.primary,
    marginBottom: SIZES.lg,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: SIZES.lg,
    marginBottom: SIZES.xl,
    elevation: 2,
  },
  input: {
    marginBottom: SIZES.md,
    backgroundColor: COLORS.surface,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SIZES.md,
  },
  addButtonDisabled: {
    opacity: 0.7,
  },
  addButtonText: {
    color: COLORS.surface,
    ...FONTS.medium,
    fontSize: 16,
  },
  notesList: {
    marginTop: SIZES.lg,
  },
  noteCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    elevation: 1,
  },
  noteTitle: {
    ...FONTS.bold,
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: SIZES.xs,
  },
  noteContent: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  noteDate: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'right',
  },
  emptyText: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: SIZES.xl,
  },
});

export default RepositoryDetailScreen; 