import React, { useCallback } from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const FileDropZone = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'error',
})(({ theme, error }) => ({
  width: '100%',
  flex: 1,
  borderRadius: 10,
  display: 'block',
  boxSizing: 'border-box',
  padding: theme.spacing(2),
  textAlign: 'center',
  border: `2px dashed ${error ? theme.palette.error.main : theme.palette.divider}`,
  backgroundColor: error ? '#ffebe6' : theme.palette.background.default,
  cursor: 'pointer',
  transition: 'background-color 0.3s, border-color 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.main,
  },
}));

const FileDropZoneWrapper = ({ children, error, onClick, onFilesSelected }) => {
  const handleDrop = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();

    const files = Array.from(event.dataTransfer.files);
    if (onFilesSelected && files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
  };

  return (
    <div style={{ width: '100%' }}>
      <FileDropZone
        error={error}
        elevation={0}
        onClick={onClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {children}
      </FileDropZone>
    </div>
  );
};

export default FileDropZoneWrapper;
