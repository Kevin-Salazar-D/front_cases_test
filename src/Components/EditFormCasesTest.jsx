import  { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Icons from "../utils/icon";
import { useTheme } from "@mui/material/styles";

const EditFormCase = ({
  open,
  handleClose,
  testCase,
  nameTester,
  realises,
  handleUpdateCase 
}) => {
  const theme = useTheme();

  const [steps, setSteps] = useState([]);

  useEffect(() => {
    if (testCase?.steps) {
      setSteps(testCase.steps);
    }
  }, [testCase]);

  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index][field] = value;
    setSteps(updatedSteps);
  };

  const handleAddStep = () => {
    setSteps([
      ...steps,
      { step: steps.length + 1, description: "", result: "" },
    ]);
  };

  const handleRemoveStep = (index) => {
    const updatedSteps = steps.filter((_, idx) => idx !== index);
    setSteps(updatedSteps);
  };

  const handleSave = () => {
    const updatedCase = { ...testCase, steps };
    handleUpdateCase?.(updatedCase); 
    handleClose();
  };

  if (!testCase) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          p: 2,
          bgcolor: "#fafafa",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
        <IconButton
          onClick={handleClose}
          color="error"
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <Icons.CloseIcon sx={{ fontSize: 35 }} />
        </IconButton>
        <Icons.BiotechIcon
          sx={{
            fontSize: 50,
            color: theme.palette.orange.main,
            verticalAlign: "middle",
          }}
        />{" "}
        Detalle del caso de prueba
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {testCase.name}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          <Icons.UpgradeIcon
            sx={{ fontSize: 35, color: theme.palette.primary.main, verticalAlign: "middle" }}
          />{" "}
          {realises || "—"}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          <Icons.PsychologyIcon
            sx={{ fontSize: 35, color: theme.palette.primary.main, verticalAlign: "middle" }}
          />{" "}
          {nameTester || "—"}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
          Pasos:
        </Typography>

        {steps.length > 0 ? (
          steps.map((step, idx) => (
            <Paper
              key={idx}
              sx={{
                p: 2,
                mb: 2,
                borderRadius: "16px",
                background: "#ffffff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" fontWeight="bold">
                  Paso {idx + 1}
                </Typography>
                <IconButton color="error" onClick={() => handleRemoveStep(idx)}>
                  <Icons.DeleteIcon />
                </IconButton>
              </Box>

              <TextField
                label="Descripción"
                fullWidth
                margin="normal"
                value={step.description}
                onChange={(e) => handleStepChange(idx, "description", e.target.value)}
              />
              <TextField
                label="Resultado esperado"
                fullWidth
                margin="normal"
                value={step.result}
                onChange={(e) => handleStepChange(idx, "result", e.target.value)}
              />
            </Paper>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No hay pasos registrados para este caso.
          </Typography>
        )}

        <Button
          variant="contained"
          startIcon={<Icons.AddIcon />}
          sx={{ borderRadius: "16px", bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" } }}
          onClick={handleAddStep}
        >
          Agregar paso
        </Button>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Button
          variant="contained"
          sx={{ borderRadius: "16px", bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" } }}
          onClick={handleSave}
        >
          <Icons.SaveAsIcon sx={{ marginRight: 1 }} />
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFormCase;
