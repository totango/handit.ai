'use client';

import * as React from 'react';
import { useAddKpiMutation } from '@/services/kpiService';
import Button from '@mui/material/Button';
import { UploadSimple as UploadSimpleIcon } from '@phosphor-icons/react/dist/ssr/UploadSimple';

import { useDialog } from '@/hooks/use-dialog';

import { CreateKpiForm } from './create-kpi-form';

export function UploadButton({ buttonTitle, onSubmit }) {
  const uploadDialog = useDialog();

  return (
    <React.Fragment>
      <Button onClick={uploadDialog.handleOpen} startIcon={<UploadSimpleIcon />} variant="contained">
        {buttonTitle}
      </Button>
      <CreateKpiForm onClose={uploadDialog.handleClose} open={uploadDialog.open} onSubmit={onSubmit} />
    </React.Fragment>
  );
}
