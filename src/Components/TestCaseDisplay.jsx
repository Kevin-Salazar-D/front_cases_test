import React, { useState, useEffect } from 'react';

import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import ChecklistIcon from '@mui/icons-material/Checklist';
import FolderIcon from '@mui/icons-material/Folder';
import TagIcon from '@mui/icons-material/Tag';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';

const TestCaseDisplay = ({ casesData, formCaseData }) => {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);

  const rowsPerPage = 10;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (casesData?.casos) {
      console.log("Todos los casos:", casesData.casos);
    }
  }, [casesData]);

  const handleDownloadALLDocs = async () => {
    if (!formCaseData?.word) {
      setApiError("No hay plantilla Word seleccionada.");
      return;
    }

    setLoading(true);
    setApiError(null);
    setApiSuccess(null);

    try {
      const formData = new FormData();
      formData.append('word', formCaseData.word);
      formData.append('realises', formCaseData.release);
      formData.append('nameTester', formCaseData.nameTester || formCaseData.name_tester);
      formData.append('result', formCaseData.result);
      formData.append('nameFolder', formCaseData.name_folder || formCaseData.nameFolder);
      formData.append('cases', JSON.stringify(casesData.casos));

      const response = await axios.post(
        'http://localhost:3000/test_cases/generated/generatedDocs',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      setApiSuccess("Documentos generados correctamente en el escritorio.");
    } catch (error) {
      setApiError("Error al generar los documentos. Revisa la consola.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadOnlyDoc = async (singleCase) => {
    if (!formCaseData?.word) {
      setApiError("No hay plantilla Word seleccionada.");
      return;
    }

    setLoading(true);
    setApiError(null);
    setApiSuccess(null);

    try {
      const formData = new FormData();
      formData.append('word', formCaseData.word);
      formData.append('realises', formCaseData.release);
      formData.append('nameTester', formCaseData.nameTester || formCaseData.name_tester);
      formData.append('result', formCaseData.result);
      formData.append('cases', JSON.stringify([singleCase]));

      const response = await axios.post(
        'http://localhost:3000/test_cases/generated/generatedOnlyDocs',
        formData,
        {
          responseType: 'blob',
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      const fileName = `${singleCase.name.replace(/[\\/:*?"<>|]/g, "_")}.docx`;
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setApiError("Error al descargar el documento individual.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!casesData || !casesData.casos || casesData.casos.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <ChecklistIcon sx={{ fontSize: 50, color: 'grey.400', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Los resultados aparecerán aquí
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Genera un nuevo conjunto de pruebas para ver los detalles.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Box mb={3}>
        <Typography variant="h6" color="primary" display="flex" alignItems="center" gutterBottom>
          <ChatBubbleOutlineIcon sx={{ mr: 1 }} />
          {casesData.message}
        </Typography>
        <Box display="flex" gap={3} color="text.secondary" alignItems="center">
          <Box display="flex" alignItems="center">
            <TagIcon sx={{ fontSize: 18, mr: 1 }} />
            {casesData.cantidad}
          </Box>
          <Box display="flex" alignItems="center">
            <FolderIcon sx={{ fontSize: 18, mr: 1 }} />
            {casesData.carpeta}
          </Box>
          <Box sx={{ marginLeft: 'auto' }}>
            <IconButton
              aria-label="generate-docs"
              color="primary"
              size="large"
              onClick={handleDownloadALLDocs}
              disabled={loading}
            >
              <CloudDownloadIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {apiError && (
        <Typography color="error" sx={{ mb: 2 }}>
          {apiError}
        </Typography>
      )}

      {apiSuccess && (
        <Typography color="success.main" sx={{ mb: 2 }}>
          {apiSuccess}
        </Typography>
      )}

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre del Caso</TableCell>
              <TableCell>Número de Pasos</TableCell>
              <TableCell>Resultado</TableCell>
              <TableCell>Nombre del tester</TableCell>
              <TableCell>Release</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {casesData.casos
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((testCase, idx) => (
                <TableRow key={idx}>
                  <TableCell>{testCase?.name || '—'}</TableCell>
                  <TableCell>{testCase?.steps.length || '—'}</TableCell>
                  <TableCell>{formCaseData?.result || '—'}</TableCell>
                  <TableCell>{formCaseData?.nameTester || formCaseData?.name_tester || '—'}</TableCell>
                  <TableCell>{formCaseData?.release || formCaseData?.realises || '—'}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="download-single-doc"
                      color="primary"
                      size="large"
                      onClick={() => handleDownloadOnlyDoc(testCase)}
                      disabled={loading}
                    >
                      <DownloadForOfflineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={casesData.casos.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10]}
      />
    </Paper>
  );
};

export default TestCaseDisplay;
