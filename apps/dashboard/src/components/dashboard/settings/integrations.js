'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

export function Integrations({ productionKey, stagingKey }) {
  const [showKey, setShowKey] = React.useState(false);
  const [showStagingKey, setShowStagingKey] = React.useState(false);

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <PlugsConnectedIcon fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
        title="Integrations"
      />
      <CardContent>
        <Card sx={{ borderRadius: 1 }} variant="outlined">
          <Stack divider={<Divider />}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', px: 2, py: 1 }}>
              <PlugsConnectedIcon fontSize="var(--Icon-fontSize)" />
              <Box sx={{ flex: '1 1 auto' }}>
                <Typography variant="subtitle2">Production API Key</Typography>
                {/*
                  show integration key, please hide it as a password and if they click eye icon show it
                  */}

                {showKey ? (
                  <Typography variant="body2" color="text.secondary">
                    {productionKey}
                  </Typography>
                ) : (
                  <Typography variant="body2">****************</Typography>
                )}
              </Box>
              <Button color="secondary" size="small" variant="outlined" onClick={() => setShowKey(!showKey)}>
                Show Key
              </Button>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', px: 2, py: 1 }}>
              <PlugsConnectedIcon fontSize="var(--Icon-fontSize)" />
              <Box sx={{ flex: '1 1 auto' }}>
                <Typography variant="subtitle2">Staging API Key</Typography>
                {/*
                  show integration key, please hide it as a password and if they click eye icon show it
                  */}

                {showStagingKey ? (
                  <Typography variant="body2" color="text.secondary">
                    {stagingKey}
                  </Typography>
                ) : (
                  <Typography variant="body2">****************</Typography>
                )}
              </Box>
              <Button color="secondary" size="small" variant="outlined" onClick={() => setShowStagingKey(!showStagingKey)}>
                Show Key
              </Button>
            </Stack>
          </Stack>
        </Card>
      </CardContent>
    </Card>
  );
}
