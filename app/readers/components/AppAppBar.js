import * as React from 'react';
import { alpha, styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';


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
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const toggleDrawer = (open) => (event) => {
        if (
          event.type === 'keydown' &&
          (event.key === 'Tab' || event.key === 'Shift')
        ) {
          return;
        }
        setDrawerOpen(open);
    };

    const drawerItems = (
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem button component="a" href="/readers/explore">
              <ListItemText primary="Explore" />
            </ListItem>
            <ListItem button component="a" href="/readers/contracts">
              <ListItemText primary="Contracts" />
            </ListItem>
            {!auth.isAuthenticated ? (
              <>
                <ListItem button onClick={() => router.push('/readers/login')}>
                  <ListItemText primary="Sign In" />
                </ListItem>
                <ListItem button onClick={() => router.push('/readers/sign-up')}>
                  <ListItemText primary="Sign Up" />
                </ListItem>
              </>
            ) : (
              <ListItem>
                <ListItemText primary={`Hello, ${auth.user?.username}`} />
              </ListItem>
            )}
          </List>
        </Box>
    );      

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
                    <Box sx={{ display: { sm: 'flex', md: 'none' } }}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                            {drawerItems}
                        </Drawer>
                    </Box>
                </StyledToolbar>
            </Container>
        </AppBar>
    );
}
