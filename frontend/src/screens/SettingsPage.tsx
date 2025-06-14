import React from 'react';
import { MainLayout } from '../layouts/MainLayout';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider
} from '@mui/material';
import { COLORS } from '../styles/theme';

export const SettingsPage: React.FC = () => {
  return (
    <MainLayout>
      <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Settings
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Email Notifications"
                  secondary="Receive email notifications for important updates"
                />
                <ListItemSecondaryAction>
                  <Switch />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Push Notifications"
                  secondary="Receive push notifications in your browser"
                />
                <ListItemSecondaryAction>
                  <Switch defaultChecked />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Profile Privacy"
                  secondary="Make your profile visible to everyone"
                />
                <ListItemSecondaryAction>
                  <Switch />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Box>
    </MainLayout>
  );
}; 