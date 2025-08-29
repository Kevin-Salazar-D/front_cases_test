import { useState, useEffect } from "react";
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
import EditFormCase from "./EditFormCasesTest";

const TestCaseDisplay = ({ casesData, formCaseData }) => {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [openFormCases, setOpenFormCases] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [cases, setCases] = useState(casesData?.casos || []);

  const rowsPerPage = 10;

  useEffect(() => {
    if (casesData?.casos) setCases(casesData.casos);
  }, [casesData]);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const filteredCases =
    cases?.filter((testCase) =>
      testCase.name.toLowerCase().includes(searchText.toLowerCase())
    ) || [];

  const handleOpenFormCase = (testCase) => {
    setSelectedCase(testCase);
    setOpenFormCases(true);
  };

  const handleCloseFormCase = () => {
    setSelectedCase(null);
    setOpenFormCases(false);
  };

  const handleUpdateCase = (updatedCase) => {
    setCases((prev) =>
      prev.map((c) => (c.name === updatedCase.name ? updatedCase : c))
    );
  };

  // --- Función para descargar todos los documentos (Word + Excel)
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

  // --- Descargar documento individual (Word o Excel)
  const handleDownloadOnlyDoc = async (singleCase) => {
    if (!formCaseData?.word && !formCaseData?.excel) {
      setApiError("No hay plantilla Word ni Excel seleccionada.");
      return;
    }

    setLoading(true);
    setApiError(null);
    setApiSuccess(null);

    try {
      const formData = new FormData();
      if (formCaseData.word) formData.append("word", formCaseData.word);
      if (formCaseData.excel) formData.append("excel", formCaseData.excel);
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

      const extension = formCaseData.word ? ".docx" : ".xlsx";
      const blob = new Blob([response.data], {
        type: formCaseData.word
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);
      const fileName = `${singleCase.name.replace(
        /[\\/:*?"<>|]/g,
        "_"
      )}${extension}`;

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setApiSuccess("Documento individual descargado correctamente.");
    } catch (error) {
      setApiError("Error al descargar el documento individual.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- Renderizado
  if (!cases || cases.length === 0) {
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
                  <TableCell>{formCaseData?.nameTester || "—"}</TableCell>
                  <TableCell align="center">{formCaseData?.release}</TableCell>
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
                    <IconButton
                      aria-label="edit-cases-test"
                      color="primary"
                      size="medium"
                      onClick={() => handleOpenFormCase(testCase)}
                      disabled={loading}
                    >
                      <Icons.BorderColorRoundedIcon />
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

      <EditFormCase
        open={openFormCases}
        handleClose={handleCloseFormCase}
        testCase={selectedCase}
        nameTester={formCaseData?.nameTester}
        realises={formCaseData?.release}
        handleUpdateCase={handleUpdateCase}
      />
    </Paper>
  );
};

export default TestCaseDisplay;
