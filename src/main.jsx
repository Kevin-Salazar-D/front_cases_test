
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './index.css';
import App from './App.jsx';

// Define tu tema
const theme = createTheme({
  palette: {
    background: { default: '#f9fafb' },  // ej. Tailwind bg-gray-50
    text: {
      primary: '#000',
      secondary: '#4B5563',               // text-gray-600
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h4: {
      color: '#4B5563',
      fontWeight: 600,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);
