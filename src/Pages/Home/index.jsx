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
    <Box sx={{ px: 2, mt: 4 }}>
      <Typography variant="h4" align="center" sx={{ fontWeight: 700, mb: 4 }}>
        Generador de Casos de Prueba
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 3,
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        {/* Columna del Formulario */}
        <Box
          sx={{
            flex: 1,
            minWidth: 300,
            width: isMobile ? '100%' : 'auto',
          }}
        >
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              height: '100%',
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
              Configuración de Generación
            </Typography>
            <FormCases setCasesData={setCasesData} setFormCase={setFormCase} />
          </Paper>
        </Box>

        {/* Columna del Resultado */}
        <Box
          sx={{
            flex: 2,
            minWidth: 300,
            width: isMobile ? '100%' : 'auto',
          }}
        >
          <TestCaseDisplay casesData={casesData} formCaseData={formCase} />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;