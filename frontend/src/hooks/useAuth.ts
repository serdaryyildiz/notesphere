import { useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  nickname: string;
  profileImage?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Burada gerçek kimlik doğrulama mantığınızı ekleyebilirsiniz
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/users/me');
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  return { user };
}; 