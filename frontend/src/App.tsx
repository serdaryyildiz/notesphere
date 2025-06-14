import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './screens/LoginPage';
import RegisterPage from './screens/RegisterPage';
import HomePage from './screens/HomePage';
import { NotesPage } from './screens/NotesPage';
import { ProfilePage } from './screens/ProfilePage';
import { RepositoryPage } from './screens/RepositoryPage';
import { SettingsPage } from './screens/SettingsPage';
import { NotificationsPage } from './screens/NotificationsPage';
import { COLORS } from './styles/theme';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider, createTheme } from '@mui/material';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: COLORS.primary,
      },
      error: {
        main: COLORS.error,
      },
      background: {
        default: COLORS.background,
        paper: COLORS.surface,
      },
      text: {
        primary: COLORS.text,
        secondary: COLORS.textLight,
      },
    },
  });

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ 
        backgroundColor: COLORS.background,
        minHeight: '100vh',
        width: '100%'
      }}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } />
              <Route path="/notes" element={
                <ProtectedRoute>
                  <NotesPage />
                </ProtectedRoute>
              } />
              <Route path="/notes/:noteId" element={
                <ProtectedRoute>
                  <NotesPage />
                </ProtectedRoute>
              } />
              <Route path="/repositories" element={
                <ProtectedRoute>
                  <RepositoryPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/profile/friends" element={
                <ProtectedRoute>
                  <ProfilePage tab="friends" />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <NotificationsPage isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />
                </ProtectedRoute>
              } />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </div>
    </ThemeProvider>
  );
};

export default App;
