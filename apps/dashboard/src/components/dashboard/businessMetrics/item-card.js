/**
 * @fileoverview ItemCard component for displaying KPI items in a card format
 * Provides a card-based view of KPI items with actions and detailed information
 */

'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { DotsThree as DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { Star as StarIcon } from '@phosphor-icons/react/dist/ssr/Star';

import { dayjs } from '@/lib/dayjs';
import { usePopover } from '@/hooks/use-popover';

import { ItemMenu } from './item-menu';

/**
 * ItemCard component for displaying KPI items in a card format
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.item - KPI item data
 * @param {Function} props.onDelete - Function to handle item deletion
 * @param {Function} props.onFavorite - Function to handle favorite toggle
 * @param {Function} props.onOpen - Function to handle item opening
 * @param {Function} props.onMenuUpdate - Function to handle menu update
 * @returns {JSX.Element} Rendered card component
 * 
 * @description
 * This component provides:
 * - A card-based display of KPI information
 * - Favorite toggle functionality
 * - Item name with click handling
 * - Current and target value display
 * - Creation and update timestamps
 * - Context menu for additional actions
 */
export function ItemCard({ item, onDelete, onFavorite, onOpen, onMenuUpdate }) {
  // Popover state for context menu
  const popover = usePopover();

  /**
   * Handles item deletion
   */
  const handleDelete = React.useCallback(() => {
    popover.handleClose();
    onDelete?.(item.id);
  }, [item, popover, onDelete]);

  // Format timestamps
  const createdAt = item.createdAt ? dayjs(item.createdAt).format('MMM D, YYYY') : undefined;
  const updatedAt = item.updatedAt ? dayjs(item.updatedAt).format('MMM D, YYYY') : undefined;

  return (
    <React.Fragment>
      <Card
        key={item.id}
        sx={{
          transition: 'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          '&:hover': { boxShadow: 'var(--mui-shadows-16)' },
        }}
      >
        {/* Card header with favorite button and name */}
        <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between', pt: 2, px: 2 }}>
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={() => {
                onFavorite?.(item.id, !item.isFavorite);
              }}
            >
              <StarIcon color="var(--mui-palette-warning-main)" weight={item.isFavorite ? 'fill' : undefined} />
            </IconButton>

            <Typography
              onClick={() => {
                onOpen?.(item.id);
              }}
              sx={{ cursor: 'pointer', pt: 1 }}
              variant="h6"
            >
              {item.name}
            </Typography>
          </Stack>
          <IconButton onClick={popover.handleOpen} ref={popover.anchorRef}>
            <DotsThreeIcon weight="bold" />
          </IconButton>
        </Stack>

        {/* Card content with KPI values and timestamps */}
        <Stack divider={<Divider />} spacing={1} sx={{ px: 2, pb: 2, pt: 1 }}>
          <Box
            onClick={() => {
              onOpen?.(item.id);
            }}
            sx={{ cursor: 'pointer' }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}></Stack>
            <Typography color="text.secondary" variant="body2">
              {`KPI Current value: ${item.currentValue ? `${item.currentValue}${item.type === 'percentage' ? '%' : ' Units'}` : 'Not defined'} `}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {`KPI Target value: ${item.target}${item.type === 'percentage' ? '%' : ' Units'}`}
            </Typography>
          </Box>
          <div>
            <Stack direction="row" spacing={6} sx={{ alignItems: 'center' }}>
              <Typography color="text.secondary" variant="caption">
                Created at {createdAt}
              </Typography>
              {updatedAt && (
                <Typography color="text.secondary" variant="caption">
                  Updated at {updatedAt}
                </Typography>
              )}
            </Stack>
          </div>
        </Stack>
      </Card>

      {/* Context menu */}
      <ItemMenu
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        onDelete={handleDelete}
        onMenuUpdate={() => onMenuUpdate?.(item.id)}
        open={popover.open}
      />
    </React.Fragment>
  );
}
