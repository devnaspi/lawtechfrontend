'use client'

import { Box, Container } from '@mui/material';
import MainContent from './components/MainContent';

export default function Home() {
  return (
    <Box>
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', mt: 24, mb: 16, gap: 4 }}
      >
        <MainContent />
      </Container>
    </Box>
  );
}
