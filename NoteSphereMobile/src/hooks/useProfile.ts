import { useState, useEffect } from 'react';
import axios from 'axios';
import {BASE_URL} from '../config';

interface Profile {
  id: string;
  name: string;
  email: string;
  noteCount: number;
  repositoryCount: number;
  collaborationCount: number;
  createdAt: string;
  updatedAt: string;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/profile`);
      setProfile(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Profil yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return { profile, loading, error, refetch: fetchProfile };
}; 