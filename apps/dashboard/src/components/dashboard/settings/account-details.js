'use client';

import * as React from 'react';
import { useGetUserQuery, useUpdatePasswordMutation, useUpdateUserMutation } from '@/services/auth/authService';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';

import { Option } from '@/components/core/option';
import { Alert, Typography } from '@mui/material';
import { set } from 'date-fns';

export function AccountDetails() {
  const { data: userData, error, isLoading } = useGetUserQuery();
  const [updatePassword, { isLoading: isUpdatingUser, error: updateUserError }] = useUpdatePasswordMutation();

  // State for form inputs
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [success, setSuccess] = React.useState(null);
  const [errors, setErrors] = React.useState(null);

  // Populate form when data is available
  React.useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || '');
      setLastName(userData.lastName || '');
      setEmail(userData.email || '');
      setPhoneNumber(userData.phoneNumber?.replace('+57', '') || ''); // Remove country code for input
      setTitle(userData.title || '');
    }
  }, [userData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading user data.</div>;
  }

  const handleSaveChanges = async () => {
    try {
      await updatePassword({
        newPassword: password,
      });
      setSuccess('Password updated successfully');
    } catch (error) {
      setErrors('Error updating user data');
      console.error('Error updating user data:', error);
    }
  }

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <UserIcon fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
        title="Basic details"
      />
      <CardContent>
        <Stack spacing={3}>
          {/* First and Last Name in the same row */}
          <Stack direction="row" spacing={2}>
            <FormControl sx={{ flex: '1 1 auto' }}>
              <InputLabel>First Name</InputLabel>
              <OutlinedInput disabled value={firstName} onChange={(e) => setFirstName(e.target.value)} name="firstName" />
            </FormControl>
            <FormControl sx={{ flex: '1 1 auto' }}>
              <InputLabel>Last Name</InputLabel>
              <OutlinedInput disabled value={lastName} onChange={(e) => setLastName(e.target.value)} name="lastName" />
            </FormControl>
          </Stack>

          {updateUserError && <div>Error updating user data.</div>}
        </Stack>
        <Stack spacing={3} sx={{mt: 5}}>
        {errors ? <Alert color="error">{errors}</Alert> : null}
        {success ? <Alert color="success">{success}</Alert> : null}
          <Typography sx={{
            fontSize: '1.2rem',
            lineHeight: '2.25rem',
            letterSpacing: '0.0075em',
          }}>
            Update Password
          </Typography>
          <FormControl sx={{ flex: '1 1 auto' }}>
            <InputLabel>New Password</InputLabel>
            <OutlinedInput value={password} onChange={(e) => setPassword(e.target.value)
            } name="password" type="password" />
          </FormControl>
          
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button color="secondary" disabled={isUpdatingUser}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSaveChanges} disabled={!password || password === ''}>
          {isUpdatingUser ? 'Saving...' : 'Save changes'}
        </Button>
      </CardActions>
    </Card>
  );
}
