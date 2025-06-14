import React, { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Tabs,
  Tab,
  Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from '../hooks/useAuth';

interface Repository {
  id: number;
  name: string;
  description: string;
  visibility: string;
  likes: number;
  followers: number;
  createdAt: string;
}

export const RepositoryPage: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    fetchRepositories();
  }, [activeTab]);

  const fetchRepositories = async () => {
    try {
      let endpoint = '/api/repositories/all';
      if (activeTab === 1) endpoint = '/api/repositories/me';
      if (activeTab === 2) endpoint = '/api/repositories/public';

      const response = await fetch(endpoint);
      const data = await response.json();
      setRepositories(data.content || []);
    } catch (error) {
      console.error('Error fetching repositories:', error);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="Tüm Repolar" />
            <Tab label="Benim Repolarım" />
            <Tab label="Herkese Açık" />
          </Tabs>
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          sx={{ mb: 3 }}
        >
          Yeni Repo Oluştur
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {repositories.map((repo) => (
          <Box key={repo.id} sx={{ width: { xs: '100%', md: '48%', lg: '31%' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {repo.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {repo.description}
                </Typography>
                <Typography variant="caption" display="block">
                  Görünürlük: {repo.visibility}
                </Typography>
                <Typography variant="caption" display="block">
                  Oluşturulma: {new Date(repo.createdAt).toLocaleDateString('tr-TR')}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <div>
                    <IconButton size="small" color="primary">
                      <FavoriteIcon />
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        {repo.likes}
                      </Typography>
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <PersonAddIcon />
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        {repo.followers}
                      </Typography>
                    </IconButton>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </MainLayout>
  );
}; 