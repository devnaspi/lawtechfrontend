'use client'

import React, { useEffect, useState } from 'react';
import VerificationSuccess from '@/app/components/VerificationSuccess';
import VerificationFailed from '@/app/components/VerificationSuccess';
import CircularProgress from '@mui/material/CircularProgress';
import { Container, Dialog } from '@mui/material';

const Verification = () => {
    const [verificationStatus, setVerificationStatus] = useState('loading');
    const [openModal, setOpenModal] = useState(false);
  
    useEffect(() => {
      const verifyAccount = async () => {
        try {
          const response = await fetch('/api/verify-account', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
  
          const data = await response.json();
  
          if (response.ok && data.verified) {
            setVerificationStatus('success');
            setOpenModal(true); 
          } else {
            setVerificationStatus('failed');
            setOpenModal(true);
          }
        } catch (error) {
          console.error('Error verifying account:', error);
          setVerificationStatus('failed');
          setOpenModal(true);
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