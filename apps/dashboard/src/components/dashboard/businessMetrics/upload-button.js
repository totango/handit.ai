/**
 * @fileoverview UploadButton component for initiating KPI creation
 * Provides a button to open a dialog for creating new KPIs
 */

'use client';

import * as React from 'react';
import { useAddKpiMutation } from '@/services/kpiService';
import Button from '@mui/material/Button';
import { UploadSimple as UploadSimpleIcon } from '@phosphor-icons/react/dist/ssr/UploadSimple';

import { useDialog } from '@/hooks/use-dialog';

import { CreateKpiForm } from './create-kpi-form';

/**
 * UploadButton component for creating new KPIs
 * @component
 * @param {Object} props - Component props
 * @param {string} props.buttonTitle - Text to display on the button
 * @param {Function} props.onSubmit - Callback function when form is submitted
 * @returns {JSX.Element} Rendered upload button with dialog
 * 
 * @description
 * This component provides:
 * - A button to initiate KPI creation
 * - A dialog with a form for entering KPI details
 * - Integration with the KPI creation service
 */
export function UploadButton({ buttonTitle, onSubmit }) {
  // Dialog state management
  const uploadDialog = useDialog();

  return (
    <React.Fragment>
      {/* Upload button with icon */}
      <Button onClick={uploadDialog.handleOpen} startIcon={<UploadSimpleIcon />} variant="contained">
        {buttonTitle}
      </Button>
      {/* KPI creation form dialog */}
      <CreateKpiForm onClose={uploadDialog.handleClose} open={uploadDialog.open} onSubmit={onSubmit} />
    </React.Fragment>
  );
}
