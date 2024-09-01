// components/reader/VerificationFailed.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useRouter } from 'next/navigation';

const VerificationFailed = ({ handleClose }) => {
  const router = useRouter();

  const handleRetryClick = () => {
    handleClose(); // Close the modal
    router.push('/sign-up'); // Navigate to the signup page for retry
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
      <ErrorOutlineIcon sx={{ fontSize: 80, color: 'red', mb: 2 }} />
      <Typography variant="h4" gutterBottom>
        Verification Failed
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        We could not verify your account. Please try again or contact support.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleRetryClick}>
        Retry
      </Button>
    </Box>
  );
};

export default VerificationFailed;
