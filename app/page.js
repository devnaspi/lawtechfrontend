'use client'

import CssBaseline from '@mui/material/CssBaseline';
import AppAppBar from './components/readers/AppAppBar';
import NavBar from './components/readers/NavBar';

import { Box, Container } from '@mui/material';
import MainContent from './components/readers/MainContent';
import Footer from './components/readers/Footer';

export default function Home() {
  return (
    <Box>
        <CssBaseline />
        <NavBar />
        <AppAppBar />
        <Container
          maxWidth="lg"
          component="main"
          sx={{ display: 'flex', flexDirection: 'column', mt: 24, mb: 16, gap: 4 }}
        >
          <MainContent />
        </Container>
        <Footer />
    </Box>
  );

}