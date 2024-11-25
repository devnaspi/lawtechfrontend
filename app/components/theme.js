import { createTheme } from '@mui/material/styles';

const createAppTheme = (darkMode) => {
    return createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
            primary: {
                main: '#ee8822',
            },
            background: {
                default: darkMode ? '#000000' : '#ffffff',
                paper: darkMode ? '#1e1e1e' : '#ffffff',
                appBar: darkMode ? '#000000' : '#ffffff',
            },
            text: {
                primary: darkMode ? '#ffffff' : '#000000',
                secondary: darkMode ? '#eeeeee' : '#666666',
            },
        },
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    backgroundColor: 'transparent',
                    color: darkMode ? '#e67e22' : '#ee8822',
                    borderColor: '#e67e22',
                },
                deleteIcon: {
                color: '#e67e22',
                '&:hover': {
                    color: '#e67e22',
                },
                },
            },
        },
    });
};

export default createAppTheme;
