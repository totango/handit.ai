/**
 * Item Card Component
 * 
 * A reusable card component that displays agent items with an icon, title, description,
 * and optional action button. Supports clickable titles and hover effects for better
 * user interaction.
 */

import * as React from 'react';
import { Card, CardContent, Typography, IconButton, Box, Stack } from '@mui/material';
import { PencilSimple as EditIcon } from '@phosphor-icons/react';

/**
 * ItemCard Component
 * 
 * A card component that displays an agent item with its icon, title, description,
 * and optional action button. The title can be clickable if an onClick handler is provided.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - The title of the item
 * @param {string} props.description - The description text of the item
 * @param {React.ComponentType} props.icon - The icon component to display
 * @param {React.ReactNode} [props.actionIcon] - Optional action icon button
 * @param {Function} [props.onClick] - Optional click handler for the title
 * @returns {JSX.Element} The item card component
 */
export function ItemCard({ title, description, icon: Icon, actionIcon, onClick = null }) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ flex: 1, p: 3 }}>
        <Stack spacing={2}>
          {/* Header Section: Icon, Title, and Action Button */}
          <Stack direction="row" spacing={2} alignItems="center">
            {/* Icon Container */}
            <Box
              sx={{
                display: 'flex',
                p: 1,
                borderRadius: 1,
                backgroundColor: 'primary.lighter',
              }}
            >
              <Icon size={24} color="var(--mui-palette-primary-main)" />
            </Box>
            {/* Title Container */}
            <Box sx={{ flex: 1 }}>
              {onClick ? (
                <Typography variant="subtitle1" onClick={onClick}

                  sx={{
                    cursor: 'pointer',
                  }}>{title}</Typography>
              ) : (
                <Typography variant="subtitle1">{title}</Typography>
              )}
            </Box>
            {/* Optional Action Icon */}
            {actionIcon}
          </Stack>
          {/* Description Section */}
          <Typography
            color="text.secondary"
            variant="body2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {description}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
} 