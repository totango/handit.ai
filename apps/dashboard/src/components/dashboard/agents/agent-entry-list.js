/**
 * Agent Entry List Component
 * 
 * A list component that displays agent execution entries with their status,
 * timestamps, and input data. Provides a clickable interface for selecting
 * entries to view their details.
 */

import * as React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Stack,
  Chip
} from '@mui/material';
import { CheckCircle, XCircle } from '@phosphor-icons/react';
import dayjs from 'dayjs';

/**
 * AgentEntryList Component
 * 
 * A list component that displays agent execution entries in a chronological order.
 * Each entry shows its timestamp, success/error status, and input data.
 * Supports entry selection through click interactions.
 * 
 * @param {Object} props - Component props
 * @param {Array<Object>} [props.entries=[]] - Array of agent execution entries
 * @param {Function} props.onEntrySelect - Callback function when an entry is selected
 * @returns {JSX.Element} The agent entry list component
 */
export const AgentEntryList = ({ entries = [], onEntrySelect }) => {
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {entries.map((entry) => (
        <ListItem key={entry.id} disablePadding>
          <ListItemButton onClick={() => onEntrySelect(entry)}>
            <Stack spacing={1} sx={{ width: '100%' }}>
              {/* Entry Header: Timestamp and Status */}
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2">
                  {dayjs(entry.createdAt).format('MMM D, HH:mm')}
                </Typography>
                <Chip
                  icon={entry.success ? <CheckCircle /> : <XCircle />}
                  label={entry.success ? "Success" : "Error"}
                  color={entry.success ? "success" : "error"}
                  size="small"
                />
              </Stack>
              {/* Entry Input Data */}
              <Typography variant="body2" color="text.secondary" noWrap>
                {entry.input}
              </Typography>
            </Stack>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}; 