'use client'

import { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppAppBar from './components/readers/AppAppBar';
import NavBar from './components/readers/NavBar';

import { Box, Container, Dialog, DialogContent, DialogTitle, TextField, Button, Typography } from '@mui/material';
import MainContent from './components/readers/MainContent';
import Footer from './components/readers/Footer'
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Signin from './components/readers/Signin';
import Signup from './components/readers/Signup';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [openSignInModal, setOpenSignInModal] = useState(false);
  const [openSignUpModal, setOpenSignUpModal] = useState(false);
  const router = useRouter()

  useEffect(() => {
    if (window.location.pathname === '/login') {
      setOpenSignInModal(true);
    } else if (window.location.pathname === '/sign-up') {
      setOpenSignUpModal(true);
    } else if (window.location.pathname === '/'){
      // do nothing
    } else {
      router.push('/404');
    }
  }, []);

  const handleOpenSignInModal = () => {
    setOpenSignInModal(true);
    setOpenSignUpModal(false);
  };

  const handleCloseSignInModal = () => {
    setOpenSignInModal(false);
    router.push('/')
  };

  const handleOpenSignUpModal = () => {
    setOpenSignUpModal(true);
    setOpenSignInModal(false);
  };

  const handleCloseSignUpModal = () => {
    setOpenSignUpModal(false);
    router.push('/')
  };

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

        {/* Sign In Modal */}
        <Signin open={openSignInModal} handleClose={handleCloseSignInModal} handleOpenSignUp={handleOpenSignUpModal} />
        <Signup open={openSignUpModal} handleClose={handleCloseSignUpModal} handleOpenSignIn={handleOpenSignInModal} />

    </Box>
  );

}