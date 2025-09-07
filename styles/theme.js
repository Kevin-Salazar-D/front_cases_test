import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    background: {
      default: "#f9fafb",
    },
    primary: {
      main: "#3B82F6",
    },
    orange: {
      main: "#FF9800",
      light: "#FFB74D",
      dark: "#F57C00",
    },
     red: {
      main: "#F44336",  
      light: "#E57373",  
      dark: "#D32F2F",   
      contrastText: "#fff", 
    },
    text: {
      primary: "#000000",
      secondary: "#4B5563",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    body1: {
      color: "#2b2d31ff",
    },
    h4: {
      color: "#4B5563",
      fontWeight: 800,
    },
  },
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#606162ff",
          "&.Mui-focused": {
            color: "#1e4a87ff",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "20px", // Aquí le das el borde redondeado al input
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 600,
          textTransform: "none",
          background: "linear-gradient(90deg, #007BFF 0%, #3399FF 100%)",
          boxShadow: "0 4px 12px rgba(0, 123, 255, 0.4)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            background: "linear-gradient(90deg, #0056b3 0%, #007BFF 100%)",
            boxShadow: "0 6px 16px rgba(0, 123, 255, 0.5)",
          },
        },
      },
    },
  },
});

export default theme;
