import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, Card, Title, Paragraph } from 'react-native-paper';
import { BASE_URL } from '../config';

interface Category {
  name: string;
}

interface Note {
  id: number;
  title: string;
  content: string;
  category?: Category;
  visibility: string;
  createdAt: string;
}

interface NoteListProps {
  endpoint?: string;
  categoryId?: number;
}

const NoteList: React.FC<NoteListProps> = ({ endpoint = '/notes', categoryId }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const url = new URL(`${BASE_URL}${endpoint}`);
      if (categoryId) url.searchParams.append('categoryId', categoryId.toString());

      const res = await fetch(url.toString());
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error('Notes could not be loaded:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [endpoint, categoryId]);

  const renderItem = ({ item }: { item: Note }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.title}</Title>
        <Paragraph numberOfLines={2}>{item.content}</Paragraph>
        {item.category && <Text>Kategori: {item.category.name}</Text>}
        <Text>Görünürlük: {item.visibility}</Text>
        <Text>Oluşturulma: {new Date(item.createdAt).toLocaleString()}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      {loading ? <ActivityIndicator animating={true} /> : (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff'
  },
  card: {
    marginBottom: 12
  }
});

export default NoteList;
