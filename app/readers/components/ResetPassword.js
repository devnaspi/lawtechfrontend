'use client';

import React, { useState } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    Box, 
    TextField, 
    Button, 
    Typography, 
    IconButton 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import axiosInstance from '@/lib/axios';
import useApiErrorHandler from '@/utils/useApiErrorHandler';

export default function ResetPassword({ open, handleClose, email }) {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const { handleApiError, loading } = useApiErrorHandler();
    const [new_password, setNewPassword] = useState('')
    const [confirm_password, setConfirmPassword] = useState('')

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await axiosInstance.post('/api/users/auth/reset-password/', {
                email,
                new_password,
                confirm_password
            });

            enqueueSnackbar('Password reset successful. You can now sign in with your new password.', { variant: 'success' });
            handleClose();
        } catch (error) {
            handleApiError(error)
        } 
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    padding: 2,
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                Reset Password
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
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
                    onSubmit={handleSubmit}
                >
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Enter your new password
                    </Typography>

                    <TextField
                        label="Email Address"
                        variant="outlined"
                        type="email"
                        value={email}
                        disabled
                        required
                        fullWidth
                    />

                    <TextField
                        label="New Password"
                        variant="outlined"
                        type="password"
                        value={new_password}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Confirm Password"
                        variant="outlined"
                        type="password"
                        value={confirm_password}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        fullWidth
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Sending Reset Link...' : 'Reset Password'}
                    </Button>

                    <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                        Remember your password?{' '}
                        <Button
                            variant="text"
                            color="primary"
                            onClick={() => router.push('/readers/login')}
                        >
                            Sign In
                        </Button>
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
}