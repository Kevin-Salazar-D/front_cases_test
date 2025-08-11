import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { Box, Paper, useMediaQuery, useTheme } from '@mui/material';
import FormCases from '../../Components/FormCases';
import TestCaseDisplay from '../../Components/TestCaseDisplay';

const Home = () => {
  const [casesData, setCasesData] = useState(null);
  const [formCase, setFormCase] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        maxWidth: 1700,
        mx: 'auto',
        px: 2,
        py: 4,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{ fontWeight: 700, mb: 4 }}
      >
        Generador de Casos de Prueba
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 4,
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        {/* Contenedor del formulario */}
        <Paper
          elevation={3}
          sx={{
            flexBasis: isMobile ? '100%' : 500,
            p: 2,
            borderRadius: 3,
            bgcolor: 'background.paper',
            height: isMobile ? '100%' : 'auto',
            width: '100%',
            overflowY: isMobile ? 'visible' : 'auto',
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}
          >
            Configuración de Generación
          </Typography>
          <FormCases setCasesData={setCasesData} setFormCase={setFormCase} />
        </Paper>

        {/* Contenedor de resultados */}
        <Box
          sx={{
            flexGrow: 1,
            minWidth: 0,
          }}
        >
          <TestCaseDisplay casesData={casesData} formCaseData={formCase} />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
