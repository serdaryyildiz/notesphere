import React, { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Box,
  Grid,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../hooks/useAuth';

interface Friend {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  nickname: string;
}

interface UserStats {
  totalNotes: number;
  totalRepositories: number;
  totalCollaborations: number;
}

interface ProfilePageProps {
  tab?: 'profile' | 'friends';
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ tab = 'profile' }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalNotes: 0,
    totalRepositories: 0,
    totalCollaborations: 0
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchFriends();
    fetchUserStats();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await fetch('/api/users/me');
      const data = await response.json();
      setFriends(data.friends || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/users/me/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ width: { xs: '100%', md: '33.333%' } }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{ width: 120, height: 120, margin: '0 auto 16px' }}
                src={user?.profileImage}
              >
                {user?.firstName?.[0]}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                @{user?.username}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user?.nickname}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{ mt: 2 }}
              >
                Profili Düzenle
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                İstatistikler
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Notlar
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalNotes}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Repolar
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalRepositories}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    İş Birlikleri
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalCollaborations}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ width: { xs: '100%', md: '66.666%' } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Arkadaşlar
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {friends.map((friend) => (
                  <ListItem key={friend.id}>
                    <ListItemAvatar>
                      <Avatar>{friend.firstName[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${friend.firstName} ${friend.lastName}`}
                      secondary={`@${friend.username}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" color="error">
                        <PersonRemoveIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </MainLayout>
  );
}; 