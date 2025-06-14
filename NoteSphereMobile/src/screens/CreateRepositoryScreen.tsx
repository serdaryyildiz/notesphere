import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { COLORS, FONTS, SIZES } from '../utils/theme';
import { repositoryService } from '../services/api';

const CreateRepositoryScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name) {
      Alert.alert('Error', 'Repository name could not be empty.');
      return;
    }
    setLoading(true);
    try {
      await repositoryService.create({ name, description });
      Alert.alert('Success', 'Repository created successfully!');
      setName('');
      setDescription('');
    } catch (error: any) {
      Alert.alert('Error', 'An error occurred while creating the repository.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Create Repository</Text>
        <TextInput
          label="Repository Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          mode="outlined"
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={loading}
        >
          <Text style={styles.createButtonText}>{loading ? 'Creating...' : 'Create'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SIZES.xl,
    justifyContent: 'center',
  },
  title: {
    ...FONTS.bold,
    fontSize: 24,
    color: COLORS.primary,
    marginBottom: SIZES.lg,
    textAlign: 'center',
  },
  input: {
    marginBottom: SIZES.md,
    backgroundColor: COLORS.surface,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SIZES.md,
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    color: COLORS.surface,
    ...FONTS.medium,
    fontSize: 16,
  },
});

export default CreateRepositoryScreen; 