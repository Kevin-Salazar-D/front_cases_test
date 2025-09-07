import { useState, useRef, useEffect } from "react";

// importaciones materia ui
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import { Container } from "@mui/material";

//utils 
import Icons from "../utils/icon";
import urlApi from "../utils/urlApi";
import apiClientAxios from "../utils/apiClient";

//componentes personlizados
import FileDropZoneWrapper from "./FileDropZoneWrapper";




const FormCases = ({ setCasesData, setFormCase }) => {
  const [excelFile, setExcelFile] = useState(null);
  const [wordFile, setWordFile] = useState(null);

  const [errors, setErrors] = useState({
    excelFile: false,
    wordFile: false,
    release: false,
    result: false,
    name_tester: false,
  });

  const [valuesForm, setValuesForm] = useState({
    release: "",
    name_tester: "",
    result: "",
    name_folder: "",
    url: "",
  });

  const [loading, setLoading] = useState(false);
  const [statusApi, setStatusApi] = useState(false);
  const [messageApi, setApiMessage] = useState("");

  const excelInputRef = useRef();
  const wordInputRef = useRef();

  const clearInputFile = (refSetter, inputRef) => {
    refSetter(null);
    if (inputRef.current) {
      inputRef.current.value = null;
    }
  };

  const handleFileChange = (e, setFile, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setErrors((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleSubmit = async () => {
    const newErrors = {
      excelFile: !excelFile,
      wordFile: !wordFile,
      release: valuesForm.release.trim() === "",
      name_tester: valuesForm.name_tester.trim() === "",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("excel", excelFile);
      formData.append("word", wordFile);
      formData.append("realises", valuesForm.release);
      formData.append("nameTester", valuesForm.name_tester);
      formData.append("result", valuesForm.result || "");
      formData.append("nameFolder", valuesForm.name_folder);

      const response = await apiClientAxios(formData, urlApi.generatedTest, "POST");
      const data = response; 

      if (!data.casos || !Array.isArray(data.casos)) {
        throw new Error(data.message || "Respuesta inesperada del servidor");
      }

      setCasesData(data);
      setStatusApi(true);
      setApiMessage("Casos de prueba generados");
      setFormCase({
        result: valuesForm.result,
        nameTester: valuesForm.name_tester,
        release: valuesForm.release,
        nameFolder: valuesForm.name_folder,
        word: wordFile,
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error al generar los casos";
      setStatusApi(false);
      setApiMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setExcelFile(null);
    setWordFile(null);
    setErrors({
      excelFile: false,
      wordFile: false,
      release: false,
      result: false,
      name_tester: false,
    });
    setValuesForm({
      release: "",
      name_tester: "",
      result: "",
      name_folder: "",
      url: "",
    });
    setApiMessage("");
    setStatusApi(false);

    if (excelInputRef.current) excelInputRef.current.value = null;
    if (wordInputRef.current) wordInputRef.current.value = null;

    setCasesData([]);
    setFormCase(null);
  };

  useEffect(() => {
    if (messageApi) {
      const timer = setTimeout(() => {
        setApiMessage("");
        setStatusApi(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [messageApi]);

  return (
    <>
      <Grid container spacing={2}>
        {messageApi && (
          <Alert
            severity={statusApi ? "success" : "error"}
            sx={{ mb: 1, width: "100%" }}
          >
            {messageApi}
          </Alert>
        )}

        <Container
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <input
            type="file"
            hidden
            accept=".doc,.docx"
            ref={wordInputRef}
            onChange={(e) => handleFileChange(e, setWordFile, "wordFile")}
          />
          <FileDropZoneWrapper
            error={errors.wordFile}
            onClick={() => wordInputRef.current.click()}
            onFilesSelected={(files) => {
              const file = files[0];
              if (file) {
                setWordFile(file);
                setErrors((prev) => ({ ...prev, wordFile: false }));
              }
            }}
          >
            <Icons.DescriptionIcon
              sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
            />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Plantilla Word
            </Typography>
            {wordFile ? (
              <Chip
                icon={<Icons.CheckCircleOutlineIcon />}
                label={wordFile.name}
                color="success"
                variant="outlined"
                onDelete={() => clearInputFile(setWordFile, wordInputRef)}
                sx={{
                  maxWidth: 150,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Haz clic o arrastra el archivo aquí
              </Typography>
            )}
            {errors.wordFile && (
              <Typography variant="caption" color="error">
                Se requiere un archivo
              </Typography>
            )}
          </FileDropZoneWrapper>

          <input
            type="file"
            hidden
            accept=".xlsx,.xls"
            ref={excelInputRef}
            onChange={(e) => handleFileChange(e, setExcelFile, "excelFile")}
          />
          <FileDropZoneWrapper
            error={errors.excelFile}
            onClick={() => excelInputRef.current.click()}
            onFilesSelected={(files) => {
              const file = files[0];
              if (file) {
                setExcelFile(file);
                setErrors((prev) => ({ ...prev, excelFile: false }));
              }
            }}
          >
            <Icons.UploadFileIcon
              sx={{ fontSize: 40, color: "primary.main", mb: 1 }}
            />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Matriz Excel
            </Typography>
            {excelFile ? (
              <Chip
                icon={<Icons.CheckCircleOutlineIcon />}
                label={excelFile.name}
                color="success"
                variant="outlined"
                onDelete={() => clearInputFile(setExcelFile, excelInputRef)}
                sx={{
                  maxWidth: 150,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Haz clic o arrastra el archivo aquí
              </Typography>
            )}
            {errors.excelFile && (
              <Typography variant="caption" color="error">
                Se requiere un archivo
              </Typography>
            )}
          </FileDropZoneWrapper>
        </Container>

        <TextField
          fullWidth
          label="Release / Versión"
          value={valuesForm.release}
          error={errors.release}
          onChange={(e) =>
            setValuesForm((prev) => ({ ...prev, release: e.target.value }))
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icons.ConfirmationNumberIcon />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          label="Nombre del Tester"
          value={valuesForm.name_tester}
          error={errors.name_tester}
          onChange={(e) =>
            setValuesForm((prev) => ({ ...prev, name_tester: e.target.value }))
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icons.PersonIcon />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          label="Resultado esperado"
          value={valuesForm.result}
          onChange={(e) =>
            setValuesForm((prev) => ({ ...prev, result: e.target.value }))
          }
          sx={{ color: "text.primary" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icons.FactCheckIcon />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          label="Nombre de la carpeta"
          value={valuesForm.name_folder}
          onChange={(e) =>
            setValuesForm((prev) => ({ ...prev, name_folder: e.target.value }))
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icons.FolderIcon />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          label="URL del sistema"
          value={valuesForm.url}
          onChange={(e) =>
            setValuesForm((prev) => ({ ...prev, url: e.target.value }))
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Icons.LinkIcon />
              </InputAdornment>
            ),
          }}
          InputLabelProps={{ shrink: true }}
        />

        <Container sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
            sx={{
              height: 50,
              fontSize: 18,
            }}
          >
            <Icons.CasesIcon sx={{ marginRight: 1 }} />
            {loading ? "Generando..." : "Generar Casos"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleClear}
            disabled={loading}
            sx={{
              height: 50,
              fontSize: 18,
            }}
          >
            <Icons.ClearAllIcon sx={{ marginRight: 1 }} /> Limpiar
          </Button>
        </Container>
      </Grid>
    </>
  );
};

export default FormCases;
