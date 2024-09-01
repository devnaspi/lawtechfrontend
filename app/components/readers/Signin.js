// Signin.js
'use client'

import React from 'react';
import { Dialog, DialogTitle, DialogContent, Box, TextField, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';

export default function Signin({ open, handleClose }) {
    const router = useRouter()
    return (
    <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs" // Adjust the maximum width of the dialog
        fullWidth
        PaperProps={{
        sx: {
            padding: 2, // Padding inside the dialog
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
        Sign In
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
        >
            {/* Email Field */}
            <TextField label="Email" variant="outlined" type="email" required fullWidth />

            {/* Password Field */}
            <TextField label="Password" variant="outlined" type="password" required fullWidth />

            {/* Sign In Button */}
            <Button variant="contained" color="primary" sx={{ mt: 2 }} type="submit">
            Sign In
            </Button>

            {/* Register Option */}
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
            Don't have an account?{' '}
            <Button
                variant="text"
                color="primary"
                onClick={() => {
                    router.push('/sign-up')
                    window.location.reload()
                }}
            >
                Register
            </Button>
            </Typography>
        </Box>
        </DialogContent>
    </Dialog>
    );
}
