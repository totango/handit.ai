import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { ContactlessPayment as ContactlessPaymentIcon } from '@phosphor-icons/react/dist/ssr/ContactlessPayment';
import { DotsThree as DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { ShoppingBag } from '@phosphor-icons/react/dist/ssr';
import { Box } from '@mui/system';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';

export function Subscriptions({ subscriptions }) {
  const router = useRouter();

  return (
    <Card style={{ height: '471px'}}>
      <CardHeader
        avatar={
          <Avatar>
            <ShoppingBag fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
        title="Model Monitoring"
      />
      <CardContent style={{
        overflow: 'scroll',
        paddingBottom: 0,
        paddingTop: 0,
        height: '70%',
        pb: 10,
      }}>
        <List disablePadding>
        {subscriptions.map((subscription) => (
            <SubscriptionItem key={subscription.id} subscription={subscription} />
          ))}
                  
        </List>
      </CardContent>
      <Divider />
      <CardActions>
        <Button color="secondary" endIcon={<ArrowRightIcon />} size="small" onClick={() => {
          router.push(paths.dashboard.monitoring.list);
        }}>
          See All Model Insights
        </Button>
      </CardActions>
    </Card>
  );
}

function SubscriptionItem({ subscription }) {
  const { label, color } = {
    success: { label: 'Stable', color: 'success' },
    error: { label: 'Outage', color: 'error' },
    warning: { label: 'Unstable', color: 'warning' },
    unknown: { label: 'Unknown', color: 'info' },
  }[subscription.status];

  const router = useRouter();

  return (
    <ListItem disableGutters sx={{marginBottom: 0.5}}>
      <ListItemAvatar>
      <Box
          sx={{
            bgcolor: 'var(--mui-palette-primary-main)',
            borderRadius: '50%',
            flex: '0 0 auto',
            height: '8px',
            width: '8px',
            mx: 1,
          }}
        />
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={
          <Typography noWrap variant="subtitle2">
            {subscription.title}
          </Typography>
        }
        secondary={
          <Typography sx={{ whiteSpace: 'nowrap' }} variant="body2">
            <Typography color="text.secondary" component="span" variant="inherit">
              {subscription.provider}
            </Typography>
          </Typography>
        }
      />
      <Chip color={color} label={label} size="small" variant="soft" />
      <IconButton onClick={
        () => {
          router.push(paths.dashboard.monitoring.details(subscription.id));
        }
      }>
        <ArrowRightIcon />
      </IconButton>
    </ListItem>
  );
}
