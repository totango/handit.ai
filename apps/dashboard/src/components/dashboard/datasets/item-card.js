/**
 * @fileoverview ItemCard component for displaying dataset items in a card format
 * Provides a card-based view of dataset items with actions and detailed information
 */

'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { DotsThree as DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { Globe as GlobeIcon } from '@phosphor-icons/react/dist/ssr/Globe';
import { Star as StarIcon } from '@phosphor-icons/react/dist/ssr/Star';

import { dayjs } from '@/lib/dayjs';
import { usePopover } from '@/hooks/use-popover';
import { datasetTypes } from '@/constants/datasets';
import { modelTypes, providers } from '@/constants/models';

import { ItemIcon } from './item-icon';
import { ItemMenu } from './item-menu';

// Utility function to wrap text after 2 words
const wrapTextAfterTwoWords = (text) => {
  const words = text.split(' ');
  const wrappedText = words.reduce((acc, word, index) => {
    if (index !== 0 && index % 3 === 0) {
      acc.push(<br key={index} />);
    }
    acc.push(word + ' ');
    return acc;
  }, []);
  return wrappedText;
};

/**
 * ItemCard component for displaying dataset items in a card format
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.item - Dataset item data
 * @param {Function} props.onDelete - Function to handle item deletion
 * @param {Function} props.onFavorite - Function to handle favorite toggle
 * @param {Function} props.onOpen - Function to handle item opening
 * @param {Function} props.onMenuUpdate - Function to handle menu update
 * @returns {JSX.Element} Rendered card component
 * 
 * @description
 * This component provides:
 * - A card-based display of dataset information
 * - Favorite toggle functionality
 * - Item name with click handling
 * - Dataset type and size display
 * - Creation and update timestamps
 * - Context menu for additional actions
 */
export function ItemCard({ item, onDelete, onFavorite, onOpen, onMenuUpdate }) {
  const popover = usePopover();

  /**
   * Handles item deletion
   */
  const handleDelete = React.useCallback(() => {
    popover.handleClose();
    onDelete?.(item.id);
  }, [item, popover, onDelete]);

  const createdAt = item.datasetCreationDate ? dayjs(item.datasetCreationDate).format('MMM D, YYYY') : undefined;
  const updatedAt = item.updatedAt ? dayjs(item.updatedAt).format('MMM D, YYYY') : undefined;

  const datasetType = datasetTypes.find((type) => type.value === item.type);
  const modelTypeName = datasetType?.label || 'No type defined';

  return (
    <React.Fragment>
      <Card
        key={item.id}
        sx={{
          transition: 'box-shadow 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          '&:hover': { boxShadow: 'var(--mui-shadows-16)' },
        }}
      >
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
              sx={{ cursor: 'pointer', pt: 1.2 }}
              variant="h6"
            >
              {item.name}
            </Typography>
          </Stack>
          <IconButton onClick={popover.handleOpen} ref={popover.anchorRef}>
            <DotsThreeIcon weight="bold" />
          </IconButton>
        </Stack>

        <Stack divider={<Divider />} spacing={1} sx={{ p: 2 }}>
          <Box
            onClick={() => {
              onOpen?.(item.id);
            }}
            sx={{ display: 'inline-flex', cursor: 'pointer' }}
          >
            {/* TODO: In the future, have an icon for each model type */}
            <ItemIcon type={'folder'} />
          </Box>
          <div>
            <Stack direction={'row'} sx={{ flex: 1, justifyContent: 'space-between' }}>
              <Stack>
                <Typography
                  onClick={() => {
                    onOpen?.(item.id);
                  }}
                  sx={{ cursor: 'pointer' }}
                  variant="subtitle2"
                >
                  {modelTypeName}
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center', justifyContent: 'space-between', my: 1 }}
                >
                  <Typography color="text.secondary" variant="body2">
                    {<span> • Version {item?.version || 'not defined'} •</span>}
                  </Typography>
                </Stack>
              </Stack>
              <div>
                <Tooltip title="Public">
                  <Avatar sx={{ '--Avatar-size': '34px', m: 1 }}>
                    <GlobeIcon fontSize="var(--Icon-fontSize)" />
                  </Avatar>
                </Tooltip>
              </div>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Typography color="text.secondary" variant="caption">
                Created at {createdAt}
              </Typography>
              <Typography color="text.secondary" variant="caption" sx={{ mx: 4 }}>
                Updated at {updatedAt}
              </Typography>
            </Stack>
          </div>
        </Stack>
      </Card>
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
