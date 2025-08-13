import React, { useState, useEffect } from "react";

import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

import Icons from "../utils/icon";

const TestCaseDisplay = ({ casesData, formCaseData }) => {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  const [searchText, setSearchText] = useState('');

  const rowsPerPage = 10;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Filtrado de casos en tiempo real
  const filteredCases = casesData?.casos?.filter((testCase) =>
    testCase.name.toLowerCase().includes(searchText.toLowerCase())
  ) || [];

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
      formData.append("word", formCaseData.word);
      formData.append("realises", formCaseData.release);
      formData.append(
        "nameTester",
        formCaseData.nameTester || formCaseData.name_tester
      );
      formData.append("result", formCaseData.result);
      formData.append(
        "nameFolder",
        formCaseData.name_folder || formCaseData.nameFolder
      );
      formData.append("cases", JSON.stringify(casesData.casos));

      await axios.post(
        "http://localhost:3000/test_cases/generated/generatedDocs",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
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
      formData.append("word", formCaseData.word);
      formData.append("realises", formCaseData.release);
      formData.append(
        "nameTester",
        formCaseData.nameTester || formCaseData.name_tester
      );
      formData.append("result", formCaseData.result);
      formData.append("cases", JSON.stringify([singleCase]));

      const response = await axios.post(
        "http://localhost:3000/test_cases/generated/generatedOnlyDocs",
        formData,
        {
          responseType: "blob",
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const fileName = `${singleCase.name.replace(/[\\/:*?"<>|]/g, "_")}.docx`;
      link.href = url;
      link.setAttribute("download", fileName);
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
      <Paper elevation={3} sx={{ p: 6, textAlign: "center", borderRadius: 3 }}>
        <Icons.ChecklistIcon sx={{ fontSize: 60, color: "grey.400", mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Los resultados aparecerán aquí
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Genera un nuevo conjunto de pruebas para ver los detalles.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 3, bgcolor: "#fafafa" }}>
      {/* Encabezado con cantidad, carpeta y buscador + botón */}
      <Box mb={3} display="flex" alignItems="center" gap={3} flexWrap="wrap">
        <Box
          display="flex"
          alignItems="center"
          gap={0.5}
          color="text.secondary"
        >
          <Icons.TagIcon fontSize="small" />
          <Typography>{casesData.cantidad}</Typography>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          gap={0.5}
          color="text.secondary"
        >
          <Icons.FolderIcon fontSize="small" />
          <Typography>{casesData.carpeta}</Typography>
        </Box>

        {/* Buscador y botón a la derecha */}
        <Box
          display="flex"
          marginLeft="auto"
          gap={2}
          alignItems="center"
          justifyContent="flex-end"
        >
          <TextField
           
            size="small"
            sx={{ minWidth: 200 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icons.SearchIcon />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{ shrink: true }}
          />

          <Button
            variant="contained"
            color="primary"
            startIcon={<Icons.CloudDownloadIcon />}
            onClick={handleDownloadALLDocs}
            disabled={loading}
            size="medium"
          >
            Descargar todo
          </Button>
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

      {/* Tabla */}
      <TableContainer
        sx={{
          borderRadius: 2,
          border: "1px solid #ddd",
          boxShadow: "0 2px 6px rgb(0 0 0 / 0.05)",
          bgcolor: "white",
          maxHeight: 440,
        }}
      >
        <Table stickyHeader>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre del Caso</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Número de Pasos
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Resultado
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Nombre del tester
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Release
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCases
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((testCase, idx) => (
                <TableRow key={idx} hover sx={{ cursor: "pointer" }}>
                  <TableCell>{testCase?.name || "—"}</TableCell>
                  <TableCell align="center">
                    {testCase?.steps?.length || "—"}
                  </TableCell>
                  <TableCell align="center">
                    {formCaseData?.result || "—"}
                  </TableCell>
                  <TableCell>
                    {formCaseData?.nameTester ||
                      formCaseData?.name_tester ||
                      "—"}
                  </TableCell>
                  <TableCell align="center">
                    {formCaseData?.release || formCaseData?.realises || "—"}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      aria-label="download-single-doc"
                      color="primary"
                      size="medium"
                      onClick={() => handleDownloadOnlyDoc(testCase)}
                      disabled={loading}
                    >
                      <Icons.DownloadForOfflineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredCases.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10]}
        sx={{ mt: 2 }}
      />
    </Paper>
  );
};

export default TestCaseDisplay;
