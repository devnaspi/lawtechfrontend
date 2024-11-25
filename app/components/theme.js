import { createTheme } from '@mui/material/styles';


const getDarkModePreference = (darkModeState) => {
    if (darkModeState !== undefined) {
        return darkModeState; 
    }
    if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
};

const createAppTheme = (darkModeState) => {
    const darkMode = getDarkModePreference(darkModeState);

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
            orange: {
                100: '#ffcc80',
                200: '#ffab66',
                300: '#ff9900',
            },
        },
        typography: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        },
    });
};

export default createAppTheme;
