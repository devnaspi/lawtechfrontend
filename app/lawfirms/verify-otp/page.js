'use client';

import React, { useState } from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import axiosInstance from '@/lib/axios';
import useApiErrorHandler from '@/utils/useApiErrorHandler';
import ReactCodeInput from 'react-code-input';
import { useRouter } from 'next/navigation';


export default function VerifyOtp() {
    const [otp, setOtp] = useState('');
    const router = useRouter();
    const { handleApiError, loading } = useApiErrorHandler();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const email = sessionStorage.getItem('email')

        try {
            const response = await axiosInstance.post('/api/users/auth/verify-otp/', {
                email,
                otp
            });
            if (response.status === 200) {
                router.push('reset-password');
            }
        } catch (error) {
            handleApiError(error)
        } 
    };

    const handleChange = (value) => {
        setOtp(value);
    };


    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 8,
                    gap: 2,
                }}
            >
                <Typography variant="h4" gutterBottom>
                    OTP Verification
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
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

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Verify
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
