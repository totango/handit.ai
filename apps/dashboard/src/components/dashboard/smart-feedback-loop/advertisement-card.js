import * as React from 'react';
import { Button } from '@mui/material';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export function AdvertisementCard({ message, title, color, buttonColor, hoverColor, ctaMessage }) {
  return (
    <Card
      sx={{
        backgroundColor: color,
        color: 'black',
        p: 2,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        marginTop: '24px'
      }}
    >
      <Stack spacing={1} sx={{ p: 3,         justifyContent: 'space-around', height: '100%' }}>
        <Typography variant="h5" style={{color: 'white'}}>{title}</Typography>
        <Typography color="white" variant="body2">
          {message}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => {
            // open handit.ai/contact on a new page
            window.open('https://handit.ai/contact', '_blank');
          }}
          sx={{
            color: buttonColor,
            borderColor: buttonColor,
            maxWidth: '200px',
            ':hover': {
              color: buttonColor,
              backgroundColor: hoverColor,
              borderColor: buttonColor,
            },
            bottom: 0,
          }}
        >
          {ctaMessage}
        </Button>
      </Stack>
    </Card>
  );
}
