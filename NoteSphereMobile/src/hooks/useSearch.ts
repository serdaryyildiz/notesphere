import { useState } from 'react';
import axios from 'axios';
import {BASE_URL} from '../config';

type SearchType = 'notes' | 'repositories' | 'users';

export const useSearch = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string, type: SearchType) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/search`, {
        params: {
          q: query,
          type,
        },
      });
      setResults(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Arama yapılırken bir hata oluştu');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search };
}; 