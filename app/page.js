'use client'

import { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppAppBar from './components/readers/AppAppBar';
import NavBar from './components/readers/NavBar';

import { Box, Container, Dialog, DialogContent, DialogTitle, TextField, Button, Typography } from '@mui/material';
import MainContent from './components/readers/MainContent';
import Footer from './components/readers/Footer'
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

export default function Home() {
  const [openSignInModal, setOpenSignInModal] = useState(true);

  const handleOpenSignInModal = () => {
    setOpenSignInModal(true);
  };

  const handleCloseSignInModal = () => {
    setOpenSignInModal(false);
  };

  return (
    <Box>
        <CssBaseline />
        <NavBar />
        <AppAppBar onSignInClick={handleOpenSignInModal} />
        <Container
          maxWidth="lg"
          component="main"
          sx={{ display: 'flex', flexDirection: 'column', mt: 24, mb: 16, gap: 4 }}
        >
          <MainContent />
        </Container>
        <Footer />

        {/* Sign In Modal */}
<Dialog
  open={openSignInModal}
  onClose={handleCloseSignInModal}
  maxWidth="xs" // Adjust the maximum width of the dialog
  fullWidth
  PaperProps={{
    sx: {
      padding: 2, // Padding inside the dialog
    },
  }}
>
  <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    Sign In
    <IconButton
      aria-label="close"
      onClick={handleCloseSignInModal}
      sx={{
        color: (theme) => theme.palette.grey[500],
      }}
    >
      <CloseIcon />
    </IconButton>
    </DialogTitle>
    <DialogContent>
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mt: 2,
        }}
      >
        {/* Email Field */}
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          required
          fullWidth
        />

        {/* Password Field */}
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          required
          fullWidth
        />

        {/* Sign In Button */}
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          type="submit"
        >
          Sign In
        </Button>

        {/* Register Option */}
        <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
          Don't have an account?{' '}
          <Button variant="text" color="primary" onClick={() => {
            // Logic to navigate to the registration page or open registration modal
          }}>
            Register
          </Button>
        </Typography>
      </Box>
    </DialogContent>
  </Dialog>

    </Box>
  );

}