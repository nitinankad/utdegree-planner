import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import Dashboard from './views/Dashboard';
import { getTheme } from './theme';

function App() {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const theme = getTheme(darkMode);

  return (
    <ThemeProvider theme={theme}>
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;
