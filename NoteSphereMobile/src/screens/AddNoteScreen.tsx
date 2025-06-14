import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { TextInput, Text, Button, Checkbox } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { BASE_URL } from '../config';

const AddNoteScreen: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [document, setDocument] = useState<any>(null);
  const [isMarkdown, setIsMarkdown] = useState(false);
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (result.assets && result.assets.length > 0) {
      setDocument(result.assets[0]);
    }
  };

  const handleSave = async () => {
    if (!title || (!content && !image && !document) || !category) {
      Alert.alert('Error', 'Title, category and content/photo/file cannot be empty.');
      return;
    }

    try {
      const catRes = await fetch(`${BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
      });

      const categoryObj = await catRes.json();
      const categoryId = categoryObj.id;

      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('categoryId', categoryId);
      formData.append('visibility', visibility);

      if (image) {
        formData.append('image', {
          uri: image,
          name: 'note-image.jpg',
          type: 'image/jpeg'
        } as any);
      }

      if (document) {
        formData.append('file', {
          uri: document.uri,
          name: document.name,
          type: document.mimeType || 'application/octet-stream'
        } as any);
      }

      const noteRes = await fetch(`${BASE_URL}/notes/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!noteRes.ok) throw new Error('Note could not be sent');

      Alert.alert('Success', 'The note was saved successfully!');
      setTitle('');
      setContent('');
      setCategory('');
      setImage(null);
      setDocument(null);
    } catch (error) {
      console.error('Note sending error:', error);
      Alert.alert('Error', 'There was a problem saving the note.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Yeni Not Ekle</Text>
      <TextInput label="Title" value={title} onChangeText={setTitle} mode="outlined" style={styles.input} />

      <TextInput
        label="Category"
        value={category}
        onChangeText={setCategory}
        mode="outlined"
        style={styles.input}
      />

      <View style={styles.checkboxContainer}>
        <Checkbox status={isMarkdown ? 'checked' : 'unchecked'} onPress={() => setIsMarkdown(!isMarkdown)} />
        <Text>Markdown formatında yaz</Text>
      </View>

      {isMarkdown ? (
        <TextInput
          label="Content"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
          mode="outlined"
          style={styles.input}
        />
      ) : (
        <>
          <Button icon="camera" mode="outlined" onPress={pickImage} style={styles.button}>Fotoğraf Seç</Button>
          {image && <Image source={{ uri: image }} style={styles.preview} />}

          <Button icon="file" mode="outlined" onPress={pickDocument} style={styles.button}>Dosya Yükle</Button>
          {document && <Text style={{ marginTop: 5 }}>{document.name}</Text>}
        </>
      )}

      <View style={styles.checkboxContainer}>
        <Checkbox
          status={visibility === 'public' ? 'checked' : 'unchecked'}
          onPress={() => setVisibility(visibility === 'public' ? 'private' : 'public')}
        />
        <Text>{visibility === 'public' ? 'Public' : 'Private'}</Text>
      </View>

      <Button mode="contained" onPress={handleSave} style={styles.saveButton}>Kaydet</Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  input: { marginBottom: 16 },
  button: { marginVertical: 10 },
  preview: { width: '100%', height: 200, marginTop: 10 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  saveButton: { marginTop: 20 },
});

export default AddNoteScreen;
