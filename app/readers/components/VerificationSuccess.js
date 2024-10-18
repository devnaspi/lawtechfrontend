import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useRouter } from 'next/navigation';

const VerificationSuccess = ({ handleClose }) => {
  const router = useRouter();

  const handleSignInClick = () => {
    handleClose(); 
    router.push('/readers/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: 4,
      }}
    >
      <CheckCircleIcon sx={{ fontSize: 80, color: 'green', mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        Verification Successful
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Your account has been successfully verified. You can now sign in.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleSignInClick}>
        Sign In
      </Button>
    </Box>
  );
};

export default VerificationSuccess;
