import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Repository } from '../types/repository';

interface RepositoryCardProps {
  repository: Repository;
  onPress?: () => void;
}

export const RepositoryCard = ({ repository, onPress }: RepositoryCardProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.name}>{repository.name}</Text>
      <Text style={styles.description}>{repository.description}</Text>
      <Text style={styles.url}>{repository.url}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  url: {
    fontSize: 12,
    color: '#999',
  },
}); 