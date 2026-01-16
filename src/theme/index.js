import { createMuiTheme } from '@material-ui/core/styles';

const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#c75b12',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
  },
});

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#e07830',
    },
    background: {
      default: '#121212',
      paper: '#2f2f2f',
    },
  },
});

export const getTheme = (darkMode) => (darkMode ? darkTheme : lightTheme);
