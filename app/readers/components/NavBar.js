import Button from '@mui/material/Button';  
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useAuth } from '@/context/AuthContext';
import Search from './Search';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';


const StyledAppBar = styled(AppBar)(({ theme }) => ({
    position: 'fixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    borderBottom: '1px solid',
    borderColor: theme.palette.divider,
    padding: 4,
}));

function NavBar() {
    const router = useRouter()
    const { auth } = useAuth();
    const theme = useTheme();

    return (
            <StyledAppBar
            sx={{
                backgroundColor: theme.palette.background.default,
                // boxShadow: theme.shadows[1],
            }}>
                <Container maxWidth="lg">
                    <Toolbar
                        variant="dense"
                        disableGutters
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Button
                            variant="text"
                            size="small"
                            aria-label="PRAELEX"
                            component="a"
                            href="/readers/"
                            sx={{
                                color: theme.palette.primary.main,
                                display: { xs: 'none', sm: 'flex' }
                            }}
                        >
                            <img src="/logo.svg" alt="Praelex Logo" style={{ height: 32, marginRight: 8 }} />
                            <Typography variant="h6" fontWeight="bold">PRAELEX</Typography>
                        </Button>

                        <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
                            <Search />
                        </div>

                        {/* Conditionally render user information if authenticated */}
                        {auth.isAuthenticated && (
                            <Stack onClick={() => {
                                router.push('/readers/profile');
                            }} direction="row" alignItems="center" spacing={1} className='pointer'>
                                <Avatar
                                    alt={auth.user?.username}
                                    src={auth.user?.profile_picture || '/static/images/avatar/1.jpg'}
                                    sx={{ width: 32, height: 32 }}
                                />
                                
                                <Typography
                                    color='black' 
                                    variant="body1" 
                                    sx={{
                                        color: theme.palette.text,
                                        display: { xs: 'none', sm: 'flex', fontWeight: 'bold' }
                                    }}>
                                    {auth.user?.username}
                                </Typography>
                            </Stack>
                        )}
                    </Toolbar>
                </Container>
            </StyledAppBar>
    );
}

export default NavBar;
