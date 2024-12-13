'use client';

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';
import axios from '@/lib/axios';
import ReactCodeInput from 'react-code-input';
import { useRouter } from 'next/navigation';
import useApiErrorHandler from '@/utils/useApiErrorHandler';

export default function OTPVerification({ open, handleClose, email, onVerificationSuccess }) {
    const [otp, setOtp] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const { handleApiError, loading } = useApiErrorHandler();

    const handleVerifyOTP = async () => {
        try {
            const response = await axios.post('/api/users/auth/verify-otp/', { email, otp });
            if (response.status === 200) {
                enqueueSnackbar('OTP verification successful!', { variant: 'success' });
                onVerificationSuccess(email)
            }
        } catch (error) {
            handleApiError(error)
        }
    };

    const handleChange = (value) => {
        setOtp(value);
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>Verify OTP</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={2} alignItems="center">
                    <ReactCodeInput
                        type="number"
                        fields={6}
                        value={otp}
                        onChange={handleChange}
                        inputStyle={{
                            width: '3rem',
                            height: '3rem',
                            margin: '0.5rem',
                            fontSize: '1.5rem',
                            textAlign: 'center',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                    />
                    <Button variant="contained" onClick={handleVerifyOTP}>Verify OTP</Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
