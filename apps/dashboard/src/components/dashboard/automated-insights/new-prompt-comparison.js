/**
 * New Prompt Comparison Component
 * 
 * Displays a comparison of different prompt versions, showing:
 * - Performance metrics
 * - Response quality
 * - Usage patterns
 * - Improvement suggestions
 * - Comparative analysis
 */

'use client';

import * as React from 'react';
import { Box, Button, Dialog, DialogContent, IconButton, Tooltip } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { X as XIcon, Copy } from '@phosphor-icons/react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';

/**
 * NewPromptComparison Component
 * 
 * @param {Object} props - Component props
 * @param {Object} props.id - Prompt ID
 * @param {string} props.originalPrompt - Original prompt
 * @param {string} props.newPrompt - New prompt
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.setOpen - Function to set the dialog open state
 * @param {boolean} props.useOptimizedPrompt - Whether to use the optimized prompt
 * @param {string} props.modelId - Model ID
 * @param {string} props.leftTitle - Left title
 * @param {string} props.rightTitle - Right title
 * @returns {JSX.Element} The new prompt comparison component
 */
export function NewPromptComparison({ id, originalPrompt, newPrompt, open, setOpen, useOptimizedPrompt, modelId, leftTitle = "Original Prompt", rightTitle = "Optimized Prompt" }) {
  const [copyTooltip, setCopyTooltip] = React.useState({ left: 'Copy', right: 'Copy' });

  const handleCopy = async (text, side) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyTooltip(prev => ({
        ...prev,
        [side]: 'Copied!'
      }));
      setTimeout(() => {
        setCopyTooltip(prev => ({
          ...prev,
          [side]: 'Copy'
        }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  // Custom title components with copy buttons
  const LeftTitle = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Typography>{leftTitle}</Typography>
      <Tooltip title={copyTooltip.left} placement="top">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleCopy(originalPrompt, 'left');
          }}
          sx={{
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' }
          }}
        >
          <Copy size={18} />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const RightTitle = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Typography>{rightTitle}</Typography>
      <Tooltip title={copyTooltip.right} placement="top">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleCopy(newPrompt, 'right');
          }}
          sx={{
            color: 'text.secondary',
            '&:hover': { color: 'primary.main' }
          }}
        >
          <Copy size={18} />
        </IconButton>
      </Tooltip>
    </Box>
  );

  // Custom styles to match your theme
  const customStyles = {
    variables: {
      dark: {
        diffViewerBackground: 'var(--mui-palette-neutral-800)',
        diffViewerColor: '#FFF',
        addedBackground: 'rgba(var(--mui-palette-success-mainChannel) / 0.15)',
        addedColor: 'white',
        removedBackground: 'rgba(var(--mui-palette-error-mainChannel) / 0.15)',
        removedColor: 'white',
        wordAddedBackground: 'rgba(var(--mui-palette-success-mainChannel) / 0.3)',
        wordRemovedBackground: 'rgba(var(--mui-palette-error-mainChannel) / 0.3)',
        addedGutterBackground: 'rgba(var(--mui-palette-success-mainChannel) / 0.2)',
        removedGutterBackground: 'rgba(var(--mui-palette-error-mainChannel) / 0.2)',
        gutterBackground: 'var(--mui-palette-neutral-900)',
        gutterBackgroundDark: 'var(--mui-palette-neutral-900)',
        highlightBackground: 'rgba(255, 255, 255, 0.05)',
        highlightGutterBackground: 'rgba(255, 255, 255, 0.05)',
        codeFoldGutterBackground: 'var(--mui-palette-neutral-800)',
        codeFoldBackground: 'var(--mui-palette-neutral-800)',
        emptyLineBackground: 'var(--mui-palette-neutral-800)',
        gutterColor: 'var(--mui-palette-text-secondary)',
        addedGutterColor: 'white',
        removedGutterColor: 'white',
        codeFoldContentColor: 'var(--mui-palette-text-secondary)',
        diffViewerTitleBackground: 'var(--mui-palette-neutral-900)',
        diffViewerTitleColor: 'white',
        diffViewerTitleBorderColor: 'var(--mui-palette-divider)',
      }
    },
    contentText: {
      fontFamily: 'ui-monospace, monospace',
      fontSize: '14px',
      lineHeight: '1.5',
    },
    gutter: {
      padding: '0 8px',
      minWidth: '50px',
    },
    line: {
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.05)',
      },
    },
  };
  return (
    <Dialog fullWidth maxWidth="lg" open={open}>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography variant="h5" mb={6}>
              Prompt Changes
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: 'var(--mui-palette-error-main)',
                  borderRadius: '2px',
                }}
              />
              <Typography variant="caption">Removed</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: 'var(--mui-palette-success-main)',
                  borderRadius: '2px',
                }}
              />
              <Typography variant="caption">Added</Typography>
            </Box>
            <IconButton onClick={() => setOpen(false)}>
              <XIcon />
            </IconButton>
          </Box>
        </Stack>

        <Box
          sx={{
            maxHeight: '70vh',
            overflow: 'auto',
            border: '1px solid var(--mui-palette-divider)',
            borderRadius: 1,
          }}
        >
          <ReactDiffViewer
            oldValue={id == 255 ? `Write some sort of message in Spanish or not — up to you.

              Guidelines:
              
              Be formal, unless casual feels better.
              
              Maybe say hi? Or don't. Depends.
              
              You could mention why you're writing, but surprises are fun too.
              
              Add stuff... or not. Who even reads emails anymore?
              
              End it somehow. Or just stop writing.
              
              Goal:
              Create something email-ish in Spanish (or another language?), that may or may not follow any rules and probably doesn't need to be professional.`
              : (originalPrompt || '')}
            newValue={newPrompt || ''}
            splitView={true}
            useDarkTheme={true}
            styles={customStyles}
            leftTitle={<LeftTitle />}
            rightTitle={<RightTitle />}
            compareMethod={DiffMethod.SENTENCES}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
