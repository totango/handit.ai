'use client';

import * as React from 'react';
import { ListItemButton, ListItemText } from '@mui/material';
import Button from '@mui/material/Button';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { useDialog } from '@/hooks/use-dialog';

export const UploadButton = React.forwardRef(function UploadButton({ buttonTitle, onSubmit, onSecondarySubmit, FormComponent, rowStyle = false, fullWidth = false }, ref) {
  const uploadDialog = useDialog();

  // Expose handleOpen to parent via ref
  React.useImperativeHandle(ref, () => ({
    handleOpen: uploadDialog.handleOpen,
  }), [uploadDialog.handleOpen]);

  return (
    <React.Fragment>
      {rowStyle ? (
        <ListItemButton onClick={uploadDialog.handleOpen}>
          <ListItemText primary={buttonTitle} />
        </ListItemButton>
      ) : (
        <Button
          onClick={uploadDialog.handleOpen}
          startIcon={<PlusIcon />}
          variant="outlined"
          color="primary"
          fullWidth={fullWidth}
          sx={{
            borderColor: 'transparent',
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
            },
            ...(fullWidth && { width: '100%' }),
            backgroundColor: 'rgba(117,120,255, 0.2)',
          }}
        >
          {buttonTitle}
        </Button>
      )}
      {FormComponent && (
        <FormComponent
          onClose={uploadDialog.handleClose}
          open={uploadDialog.open}
          onSubmit={onSubmit}
          onSecondarySubmit={onSecondarySubmit}
        />
      )}
    </React.Fragment>
  );
});
