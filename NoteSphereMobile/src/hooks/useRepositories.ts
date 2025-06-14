import { useState, useEffect } from 'react';
import axios from 'axios';
import {BASE_URL} from '../config';

interface Repository {
  id: string;
  name: string;
  description: string;
  noteCount: number;
  collaboratorCount: number;
  createdAt: string;
  updatedAt: string;
}

export const useRepositories = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/repositories`);
      setRepositories(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Depolar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return { repositories, loading, error, refetch: fetchRepositories };
}; 