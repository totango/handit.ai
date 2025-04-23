/**
 * @fileoverview ItemRow component for displaying dataset items in a table row
 * Provides a row-based view of dataset items with actions and detailed information
 */

'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { DotsThree as DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { Star as StarIcon } from '@phosphor-icons/react/dist/ssr/Star';

import { dayjs } from '@/lib/dayjs';
import { usePopover } from '@/hooks/use-popover';
import { datasetTypes } from '@/constants/datasets';

import { ItemIcon } from './item-icon';
import { ItemMenu } from './item-menu';

/**
 * ItemRow component for displaying dataset items in a table row
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.item - Dataset item data
 * @param {Function} props.onDelete - Function to handle item deletion
 * @param {Function} props.onFavorite - Function to handle favorite toggle
 * @param {Function} props.onOpen - Function to handle item opening
 * @param {Function} props.onMenuUpdate - Function to handle menu update
 * @returns {JSX.Element} Rendered table row component
 * 
 * @description
 * This component provides:
 * - A table row display of dataset information
 * - Item icon and name with click handling
 * - Dataset type and version display
 * - Creation date display
 * - Favorite toggle functionality
 * - Context menu for additional actions
 */
export function ItemRow({ item, onDelete, onFavorite, onOpen, onMenuUpdate }) {
  // Popover state for context menu
  const popover = usePopover();

  /**
   * Handles item deletion
   */
  const handleDelete = React.useCallback(() => {
    popover.handleClose();
    onDelete?.(item.id);
  }, [item, popover, onDelete]);

  // Get dataset type name from type value
  const datasetType = datasetTypes.find((type) => type.value === item.type);
  const datasetTypeName = datasetType?.label;

  return (
    <React.Fragment>
      <TableRow
        key={item.id}
        sx={{
          bgcolor: 'var(--mui-palette-background-paper)',
          borderRadius: 1.5,
          boxShadow: 0,
          transition: 'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          '&:hover': { boxShadow: 'var(--mui-shadows-16)' },
          '& .MuiTableCell-root': {
            borderBottom: '1px solid var(--mui-palette-divider)',
            borderTop: '1px solid var(--mui-palette-divider)',
            '&:first-of-type': {
              borderTopLeftRadius: '12px',
              borderBottomLeftRadius: '12px',
              borderLeft: '1px solid var(--mui-palette-divider)',
            },
            '&:last-of-type': {
              borderTopRightRadius: '12px',
              borderBottomRightRadius: '12px',
              borderRight: '1px solid var(--mui-palette-divider)',
            },
          },
        }}
      >
        {/* Item name and type cell */}
        <TableCell sx={{ maxWidth: '250px' }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Box
              onClick={() => {
                onOpen?.(item.id);
              }}
              sx={{ cursor: 'pointer' }}
            >
              <ItemIcon type={'folder'} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                noWrap
                onClick={() => {
                  onOpen?.(item.id);
                }}
                sx={{ cursor: 'pointer' }}
                variant="subtitle2"
              >
                {item.name}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {datasetTypeName}
                {<span> • Version {item?.version || 'not defined'}</span>}
              </Typography>
            </Box>
          </Stack>
        </TableCell>

        {/* Creation date cell */}
        <TableCell>
          <Typography noWrap variant="subtitle2">
            Dataset Created at
          </Typography>
          {item.datasetCreationDate ? (
            <Typography color="text.secondary" noWrap variant="body2">
              {dayjs(item.datasetCreationDate).format('MMM D, YYYY')}
            </Typography>
          ) : undefined}
        </TableCell>

        {/* Empty cell for spacing */}
        <TableCell>
          <Box sx={{ display: 'flex' }}></Box>
        </TableCell>

        {/* Favorite button cell */}
        <TableCell align="right">
          <IconButton
            onClick={() => {
              onFavorite?.(item.id, !item.isFavorite);
            }}
          >
            <StarIcon color="var(--mui-palette-warning-main)" weight={item.isFavorite ? 'fill' : undefined} />
          </IconButton>
        </TableCell>

        {/* Menu button cell */}
        <TableCell align="right">
          <IconButton onClick={popover.handleOpen} ref={popover.anchorRef}>
            <DotsThreeIcon weight="bold" />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Context menu */}
      <ItemMenu
        anchorEl={popover.anchorRef.current || undefined}
        onClose={popover.handleClose}
        onDelete={handleDelete}
        open={popover.open}
        onMenuUpdate={() => onMenuUpdate(item.id)}
      />
    </React.Fragment>
  );
}
