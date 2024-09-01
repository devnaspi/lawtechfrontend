'use client'

import React, { useEffect, useState } from 'react';
import VerificationSuccess from '@/app/components/readers/VerificationSuccess';
import VerificationFailed from '@/app/components/readers/VerificationSuccess';
import CircularProgress from '@mui/material/CircularProgress';
import { Container, Dialog } from '@mui/material';

const Verification = () => {
    const [verificationStatus, setVerificationStatus] = useState('loading'); // 'loading', 'success', or 'failed'
    const [openModal, setOpenModal] = useState(false); // Modal open state
  
    useEffect(() => {
      // Function to query the backend to verify the account
      const verifyAccount = async () => {
        try {
          // Replace with your actual backend endpoint and logic
          const response = await fetch('/api/verify-account', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          const data = await response.json();
  
          if (response.ok && data.verified) {
            setVerificationStatus('success');
            setOpenModal(true); // Open the modal on success
          } else {
            setVerificationStatus('failed');
            setOpenModal(true); // Open the modal on failure
          }
        } catch (error) {
          console.error('Error verifying account:', error);
          setVerificationStatus('failed');
          setOpenModal(true); // Open the modal on error
        }
      };
  
      verifyAccount();
    }, []);
  
    const handleCloseModal = () => {
      setOpenModal(false);
    };
  
    return (
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        {verificationStatus === 'loading' && <CircularProgress />}
        
        {/* Verification Success Modal */}
        <Dialog open={openModal && verificationStatus === 'success'} onClose={handleCloseModal}>
          <VerificationSuccess handleClose={handleCloseModal} />
        </Dialog>
  
        {/* Verification Failed Modal */}
        <Dialog open={openModal && verificationStatus === 'failed'} onClose={handleCloseModal}>
          <VerificationFailed handleClose={handleCloseModal} />
        </Dialog>
      </Container>
    );
  };
  
  export default Verification;