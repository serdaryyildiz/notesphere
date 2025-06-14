import { useState, useEffect } from 'react';
import axios from 'axios';
import {BASE_URL} from '../config';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/notes`);
      setNotes(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Notlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return { notes, loading, error, refetch: fetchNotes };
}; 