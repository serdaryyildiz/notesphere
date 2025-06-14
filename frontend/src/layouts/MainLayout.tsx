import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/Sidebar';
import { Box, Container, Grid } from '@mui/material';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar onToggleSidebar={() => setIsOpen(!isOpen)} />
      <Box sx={{ display: 'flex', flex: 1, pt: '64px' }}>
        <LeftSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
          <Grid container spacing={3}>
            {children}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}; 