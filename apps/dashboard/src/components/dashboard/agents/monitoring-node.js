/**
 * Monitoring Node Component
 * 
 * A specialized node component for displaying monitoring information in the agent flow.
 * Shows node status, metrics, and execution steps with visual indicators for errors,
 * selection state, and step progression.
 */

'use client';

import * as React from 'react';
import { Box, Button, Card, Chip, Grid, LinearProgress, Stack, Tooltip, Typography } from '@mui/material';
import { Brain, Database, Wrench } from '@phosphor-icons/react';
import { Handle, Position } from 'reactflow';

import { parseTitle } from '@/lib/text';

/**
 * Default node colors for different node types
 */
const nodeColors = {
  model: 'var(--mui-palette-primary-lighter)',
  tool: 'var(--mui-palette-primary-lighter)',
};

/**
 * MonitoringNode Component
 * 
 * A node component that displays monitoring information for models and tools in the agent flow.
 * Supports different node types (model/tool), status indicators, step progression,
 * and interactive features like selection and click handling.
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Unique identifier for the node
 * @param {Object} props.data - Node data including type, status, metrics, and callbacks
 * @param {boolean} props.isConnectable - Whether the node can be connected
 * @returns {JSX.Element} The monitoring node component
 */
export const MonitoringNode = React.memo(({ id, data, isConnectable }) => {
  /**
   * Renders connection handles for the node
   * @param {Array} handles - Array of handle configurations
   * @param {string} type - Handle type ('target' or 'source')
   * @param {Position} position - Handle position (Top or Bottom)
   * @returns {JSX.Element|null} The rendered handles or null if no handles
   */
  const renderHandles = (handles, type, position) => {
    if (!handles) return null;

    return handles.map((handle, index) => (
      <React.Fragment key={handle.id}>
        <Handle
          type={type}
          position={position}
          id={handle.id}
          isConnectable={isConnectable}
          style={{
            width: 8,
            height: 8,
            background: data.color || nodeColors[data.type],
            border: '1px solid #fff',
            [position === Position.Top ? 'top' : 'bottom']: '8px',
            left: `${(index + 1) * (100 / (handles.length + 1))}%`,
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.65rem',
            color: 'text.secondary',
            position: 'absolute',
            left: `${(index + 1) * (100 / (handles.length + 1))}%`,
            transform: 'translateX(-50%)',
            [position === Position.Top ? 'top' : 'bottom']: '24px',
          }}
        ></Typography>
      </React.Fragment>
    ));
  };

  /**
   * Determines the background color based on node state
   * @returns {string} The background color value
   */
  const getBackgroundColor = () => {
    if (data.color) {
      return data.color + '15';
    }
    if (data.isSelected) {
      // Selected state - more prominent
      return data.status === 'error'
        ? 'rgba(255,53,53, 0.4)'
        : data.color
          ? `${data.color}40` // Add 40% opacity to the color
          : data.type === 'model'
            ? 'rgba(117, 120, 255, 0.4)'
            : 'rgba(117, 120, 255, 0.4)';
    } else if (data.sequence && data.selectedCycle?.steps?.some(step => data.sequence.includes(step))) {
      // Part of the step - subtle highlight
      return data.status === 'error'
        ? 'rgba(255,53,53, 0.1)'
        : data.color
          ? `${data.color}10` // Add 10% opacity to the color
          : data.type === 'model'
            ? 'rgba(117, 120, 255, 0.1)'
            : 'rgba(117, 120, 255, 0.1)';
    }
    return 'transparent';
  };

  // Calculate node colors based on status and type
  const backgroundColor = getBackgroundColor();
  const borderColor = data.status === 'error'
    ? 'rgba(255,53,53, 1)'
    : data.color || (data.type === 'model'
      ? 'var(--mui-palette-primary-400)'
      : 'var(--mui-palette-primary-400)');
  const iconColor = data.status === 'error'
    ? 'rgba(255,53,53, 1)'
    : data.color || (data.type === 'model'
      ? 'var(--mui-palette-primary-400)'
      : 'var(--mui-palette-primary-400)');

  /**
   * Step Badge Component
   * Displays the current step number in a circular badge
   */
  const StepBadge = ({ steps, selectedCycle }) => {
    const index = selectedCycle?.steps?.findIndex(step => steps.includes(step));
    const title = selectedCycle?.steps?.[index];

    if (!title) return null;
    return (
      <Button
        sx={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          minWidth: '24px',
          width: '24px',
          height: '24px',
          p: 0,
          background: '#1976d2',
          color: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          transition: 'all 0.2s ease',
          transform: 'scale(1.1)',
          boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.3)',
          '&:hover': {
            background: '#1976d2',
          },
        }}
      >
        {title}
      </Button>
    )
  };

  /**
   * Gets the visible steps for the current node
   * @returns {Array} Array of visible step numbers
   */
  const getVisibleSteps = () => {
    if (!data.sequence?.length || !data.currentStep) return [];
    const currentStep = data.currentStep;
    const currentStepIndex = data.sequence.indexOf(data.currentStep);
    const nodeContainsCurrentStep = data.sequence.includes(data.currentStep);

    // Find the step immediately before current step
    const immediateBeforeStep = currentStep - 1;
    const hasImmediateBeforeStep = Boolean(immediateBeforeStep);

    // Find the step immediately after current step
    const immediateAfterStep = currentStep + 1;
    const hasImmediateAfterStep = Boolean(immediateAfterStep);

    // If node contains current step
    if (nodeContainsCurrentStep) {
      return [data.currentStep];
    }
    // If node contains the immediate before step
    if (hasImmediateBeforeStep && immediateBeforeStep === Math.max(...data.sequence.filter(step => step < data.currentStep))) {
      return [immediateBeforeStep];
    }

    // If node contains immediate after step
    if (hasImmediateAfterStep && immediateAfterStep === Math.min(...data.sequence.filter(step => step > data.currentStep))) {
      return [immediateAfterStep];
    }

    return [];
  };

  /**
   * Gets the remaining steps not currently visible
   * @returns {Array} Array of remaining step numbers
   */
  const getRemainingSteps = () => {
    if (!data.sequence?.length) return [];
    const visibleSteps = getVisibleSteps();
    return data.sequence.filter(step => !visibleSteps.includes(step));
  };

  // Calculate step visibility
  const visibleSteps = getVisibleSteps();
  const remainingSteps = getRemainingSteps();
  const showMoreButton = data.sequence?.length > 0;

  return (
    <Card
      sx={{
        padding: 1.5,
        borderRadius: 2,
        minWidth: 250,
        maxWidth: 250,
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        p: 3,
        py: 4,
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 2,
        },
        borderColor: data.highlightedForStep ? '#1976d2' : borderColor,
        backgroundColor: data.highlightedForStep ? 'rgba(25, 118, 210, 0.12)' : backgroundColor,
        transition: 'all 0.3s ease',
      }}
      onClick={data.onClick}
    >
      {/* Step Badge */}
      {(
        <>

          <StepBadge
            steps={data.sequence}
            selectedCycle={data.selectedCycle}
          />

        </>
      )}

      {/* Input Handles */}
      {renderHandles(data.inputs, 'target', Position.Top)}

      {/* Node Content */}
      <Box sx={{ mt: 1 }}>
        <Grid container sx={{ flexFlow: 'row' }}>
          {/* Node Icon */}
          <Grid
            xs={2}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              maxWidth: '50px',
              maxHeight: '50px',
              minWidth: '50px',
              minHeight: '50px',
              mr: 2,
            }}
          >
            {data.type === 'model' ? <Brain color={iconColor} size={32} /> : data.toolType === 'RAG' ? <Database color={iconColor} size={32} /> : <Wrench color={iconColor} size={32} />}
          </Grid>

          {/* Node Information */}
          <Grid xs={10}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, fontSize: '18px' }}>
                {data.label}
              </Typography>
            </Box>

            {/* Model Category */}
            {data.modelCategory && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  backgroundColor: 'transparent',
                  borderRadius: 1,
                  alignSelf: 'flex-start',
                  fontWeight: 600,
                  fontSize: '16px',
                }}
              >
                {parseTitle(data.modelCategory)}
              </Typography>
            )}

            {/* Tool Type */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {data.toolType && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    backgroundColor: 'transparent',
                    borderRadius: 1,
                    alignSelf: 'flex-start',
                    fontWeight: 600,
                    fontSize: '16px',
                  }}
                >
                  {data.toolType}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Output Handles */}
      {renderHandles(data.outputs, 'source', Position.Bottom)}
    </Card>
  );
});
