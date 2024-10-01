'use client'

import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import { useRouter } from 'next/navigation';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
        backdropFilter: 'blur(24px)',
        border: '1px solid',
        borderColor: theme.palette.divider,
        backgroundColor: alpha(theme.palette.background.default, 0.4),
        boxShadow: theme.shadows[1],
        padding: '8px 12px',
    }));

    export default function AppAppBar() {
    const router = useRouter()


    return (
    <AppBar
        position="fixed"
        sx={{ boxShadow: 0, bgcolor: 'transparent', zIndex: 3, backgroundImage: 'none', mt: 10 }}
    >
        <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>            
                <Button href='/readers/explore' variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
                    Explore
                </Button>
                <Button href='/readers/contracts' variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
                    Contracts
                </Button>
                <Button href='/readers/lawfirms' variant="text" color="info" size="small" sx={{ minWidth: 0 }}>
                    Law Firms
                </Button>
            </Box>
            </Box>
            <Box
            sx={{
                display: { xs: 'none', md: 'flex' },
                gap: 1,
                alignItems: 'center',
            }}
            >
            <Button color="primary" variant="text" size="small" onClick={() => {
                router.push('/readers/login')
                window.location.reload()
            }}>
                Sign in
            </Button>
            <Button color="primary" variant="contained" size="small" onClick={() => {
                router.push('/readers/sign-up')
                window.location.reload()
            }}>
                Sign up
            </Button>
            </Box>
            <Box sx={{ display: { sm: 'flex', md: 'none' } }}>
            </Box>
        </StyledToolbar>
        </Container>
    </AppBar>
    );
}