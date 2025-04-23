'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr/ArrowLeft';

import { useDialog } from '@/hooks/use-dialog';

export function GoBackButton({ buttonTitle, onClick }) {
  return (
    <React.Fragment>
      <Button onClick={onClick} startIcon={<ArrowLeft />} variant="contained">
        {buttonTitle}
      </Button>
    </React.Fragment>
  );
}
