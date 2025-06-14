import React, { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Card, CardContent, Typography, Button, TextField, IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../hooks/useAuth';

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  category?: {
    id: number;
    name: string;
  };
}

export const NotesPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchNotes();
    fetchCategories();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ width: '100%', mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ mb: 3 }}
        >
          Yeni Not Oluştur
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {notes.map((note) => (
          <Box key={note.id} sx={{ width: { xs: '100%', md: '48%', lg: '31%' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {note.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {note.content.substring(0, 100)}...
                </Typography>
                <Typography variant="caption" display="block">
                  Kategori: {note.category?.name || 'Kategorisiz'}
                </Typography>
                <Typography variant="caption" display="block">
                  Oluşturulma: {new Date(note.createdAt).toLocaleDateString('tr-TR')}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton size="small" color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </MainLayout>
  );
}; 