import React, { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Divider
} from '@mui/material';
import {
  NotificationsNone as NotificationIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { COLORS } from '../styles/theme';

interface Notification {
  id: number;
  type: 'friend_request' | 'like' | 'comment';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleDismiss = async (notificationId: number) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        setNotifications(notifications.filter(n => n.id !== notificationId));
      }
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Notifications
            </Typography>
            <List>
              {notifications.map((notification, index) => (
                <React.Fragment key={notification.id}>
                  <ListItem
                    sx={{
                      backgroundColor: notification.isRead ? 'transparent' : 'rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <NotificationIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={notification.title}
                      secondary={
                        <>
                          {notification.message}
                          <Typography
                            component="span"
                            variant="body2"
                            color="textSecondary"
                            sx={{ display: 'block', mt: 1 }}
                          >
                            {new Date(notification.createdAt).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                    <IconButton
                      edge="end"
                      aria-label="dismiss"
                      onClick={() => handleDismiss(notification.id)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
              {notifications.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="No notifications"
                    secondary="You're all caught up!"
                  />
                </ListItem>
              )}
            </List>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
}; 