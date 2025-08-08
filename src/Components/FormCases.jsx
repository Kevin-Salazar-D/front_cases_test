// FormCases.jsx
import { useState, useRef } from 'react';

//importaciones materia ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FileDropZoneWrapper from './FileDropZoneWrapper';
import Chip from '@mui/material/Chip';
import axios from 'axios';

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
    release: '',
    name_tester: '',
    result: '',
    name_folder: '',
    url: '',
  
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);

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
    release: valuesForm.release.trim() === '',
    name_tester: valuesForm.name_tester.trim() === '',
  };

  setErrors(newErrors);
  if (Object.values(newErrors).some(Boolean)) return;

  setLoading(true);
  setApiError(null);
  setApiSuccess(null);

  try {
    const formData = new FormData();
    formData.append('excel', excelFile);
    formData.append('word', wordFile);
    formData.append('realises', valuesForm.release);
    formData.append('nameTester', valuesForm.name_tester);
    formData.append('result', valuesForm.result);
    formData.append('nameFolder', valuesForm.name_folder);


    console.log("FormData contents:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    const response = await axios.post(
      'http://localhost:3000/test_cases/generated/generatedTest',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const data = response.data;

    console.log("Respuesta del backend:", data);

    if (!data.casos || !Array.isArray(data.casos)) {
      throw new Error(data.message || 'Respuesta inesperada del servidor');
    }

    setCasesData(data); 
    setApiSuccess('Casos generados exitosamente!');

    setFormCase({
        result: valuesForm.result,
        nameTester: valuesForm.name_tester,
        release: valuesForm.release,
        nameFolder: valuesForm.name_folder,
        word: wordFile
});
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Error al generar los casos';
    setApiError(message);
    console.error("Error al generar casos:", message);
  } finally {
    setLoading(false);
  }
};



  return (
    <>
      <Grid container spacing={2}>
      
          <input
            type="file"
            hidden
            accept=".doc,.docx"
            ref={wordInputRef}
            onChange={(e) => handleFileChange(e, setWordFile, 'wordFile')}
          />
          <FileDropZoneWrapper error={errors.wordFile} onClick={() => wordInputRef.current.click()}>
            <DescriptionIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>Plantilla Word</Typography>
            {wordFile ? (
              <Chip
                icon={<CheckCircleOutlineIcon />}
                label={wordFile.name}
                color="success"
                variant="outlined"
                onDelete={() => clearInputFile(setWordFile, wordInputRef)}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">Haz clic para seleccionar</Typography>
            )}
            {errors.wordFile && (
              <Typography variant="caption" color="error">Se requiere un archivo</Typography>
            )}
          </FileDropZoneWrapper>
       

      
          <input
            type="file"
            hidden
            accept=".xlsx,.xls"
            ref={excelInputRef}
            onChange={(e) => handleFileChange(e, setExcelFile, 'excelFile')}
          />
          <FileDropZoneWrapper error={errors.excelFile} onClick={() => excelInputRef.current.click()}>
            <UploadFileIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>Matriz Excel</Typography>
            {excelFile ? (
              <Chip
                icon={<CheckCircleOutlineIcon />}
                label={excelFile.name}
                color="success"
                variant="outlined"
                onDelete={() => clearInputFile(setExcelFile, excelInputRef)}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">Haz clic para seleccionar</Typography>
            )}
            {errors.excelFile && (
              <Typography variant="caption" color="error">Se requiere un archivo</Typography>
            )}
          </FileDropZoneWrapper>
      

        
          <TextField
            fullWidth
            label="Release / Versión"
            value={valuesForm.release}
            error={errors.release}
            onChange={(e) =>
              setValuesForm((prev) => ({ ...prev, release: e.target.value }))
            }
          />
      

     
          <TextField
            fullWidth
            label="Nombre del Tester"
            value={valuesForm.name_tester}
            error={errors.name_tester}
            onChange={(e) =>
              setValuesForm((prev) => ({ ...prev, name_tester: e.target.value }))
            }
          />
    
          <TextField
            fullWidth
            label="Resultado esperado"
            value={valuesForm.result}
            onChange={(e) =>
              setValuesForm((prev) => ({ ...prev, result: e.target.value }))
            }
          />

          <TextField
            fullWidth
            label="Nombre de la carpeta"
            value={valuesForm.name_folder}
            onChange={(e) =>
              setValuesForm((prev) => ({ ...prev, name_folder: e.target.value }))
            }
          />
      
       
          <TextField
            fullWidth
            label="URL del sistema"
            value={valuesForm.url}
            onChange={(e) =>
              setValuesForm((prev) => ({ ...prev, url: e.target.value }))
            }
          />
      

    
      
          <Collapse in={!!apiError}>
            <Alert severity="error" sx={{ mb: 2 }}>{apiError}</Alert>
          </Collapse>
          <Collapse in={!!apiSuccess}>
            <Alert severity="success" sx={{ mb: 2 }}>{apiSuccess}</Alert>
          </Collapse>
       
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Generando...' : 'Generar Casos'}
          </Button>
        
      </Grid>
    </>
  );
};

export default FormCases;
