import * as React from 'react';
import { alpha, styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AppBar from '@mui/material/AppBar';


const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    backdropFilter: 'blur(24px)',
    border: '1px solid',
    borderColor: alpha(theme.palette.divider, 0.2),
    backgroundColor: theme.palette.background.appBar,
    boxShadow: theme.shadows[1],
    padding: '8px 12px',
}));

export default function AppAppBar() {
    const router = useRouter();
    const { auth } = useAuth();
    const theme = useTheme();

    return (
        <AppBar
            position="fixed"
            sx={{
                boxShadow: 0,
                bgcolor: 'transparent',
                zIndex: 3,
                backgroundImage: 'none',
                mt: 10,
            }}
        >
            <Container maxWidth="lg">
                <StyledToolbar variant="dense" disableGutters>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <Button
                                href='/readers/explore'
                                variant="text"
                                size="small"
                                sx={{ minWidth: 0, color: theme.palette.primary.main }}
                            >
                                Explore
                            </Button>
                            <Button
                                href='/readers/contracts'
                                variant="text"
                                size="small"
                                sx={{ minWidth: 0, color: theme.palette.primary.main }}
                            >
                                Contracts
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
                        {auth.isAuthenticated ? (
                            <>
                                {/* User-specific options or content here */}
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={() => router.push('/readers/login')}
                                    sx={{ color: theme.palette.primary.light }}
                                >
                                    Sign in
                                </Button>
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => router.push('/readers/sign-up')}
                                    sx={{
                                        bgcolor: theme.palette.primary.main,
                                        '&:hover': {
                                            bgcolor: theme.palette.primary.dark,
                                        },
                                    }}
                                >
                                    Sign up
                                </Button>
                            </>
                        )}
                    </Box>
                    <Box sx={{ display: { sm: 'flex', md: 'none' } }}></Box>
                </StyledToolbar>
            </Container>
        </AppBar>
    );
}
