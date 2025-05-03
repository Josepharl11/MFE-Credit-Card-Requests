import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#003366', // Azul marino
    },
    secondary: {
      main: '#66a3cc', // Azul claro
    },
    background: {
      default: '#f5f5f5', // Gris claro
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#003366',
        },
      },
    },
  },
});

export default theme;