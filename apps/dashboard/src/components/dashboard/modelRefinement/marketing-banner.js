'use client';

import * as React from 'react';
import { Box, CardContent, CardHeader, Divider } from '@mui/material';
import Card from '@mui/material/Card';

export function MarketingBanner({ title, image, style = {} }) {
  
  return (
    <Card style={{ paddingTop: '8px', paddingBottom: '8px', position: 'relative', overflow: 'hidden', height: '100%', marginBottom: style.marginBottom }}>
      <Box
        sx={{
          filter: 'none',
          pointerEvents: 'auto',
          height: '100%',
          transition: 'filter 0.3s',
        }}
      >
        <CardContent>
          <CardHeader title={title} />
          <Box>
            <img src={image} alt={title} style={{ width: '100%', height: '100%' }} />
          </Box>
          
          
        </CardContent>
      </Box>
    </Card>
  );
}
