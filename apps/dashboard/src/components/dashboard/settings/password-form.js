'use client';

import * as React from 'react';
import { useState } from 'react';
import { useUpdatePasswordMutation } from '@/services/auth/authService';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import { Password as PasswordIcon } from '@phosphor-icons/react/dist/ssr/Password';

export function PasswordForm() {
  // Local state for form inputs
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Mutation hook to call the API
  const [updatePassword, { isLoading, isError, isSuccess }] = useUpdatePasswordMutation();

  const handleSubmit = async () => {
    // Validate password confirmation
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    // Reset error
    setErrorMessage('');

    try {
      // Call mutation to update the password
      await updatePassword({
        oldPassword,
        newPassword: password,
      }).unwrap();

      setOldPassword('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      // Handle error (optional: display error message)
      console.error('Failed to update password:', err);
      setErrorMessage('Failed to update password');
    }
  };

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar>
            <PasswordIcon fontSize="var(--Icon-fontSize)" />
          </Avatar>
        }
        title="Change password"
      />
      <CardContent>
        <Stack spacing={3}>
          <FormControl>
            <InputLabel>Old password</InputLabel>
            <OutlinedInput
              name="oldPassword"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <InputLabel>New password</InputLabel>
            <OutlinedInput
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <InputLabel>Re-type new password</InputLabel>
            <OutlinedInput
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>
          {errorMessage && <Box sx={{ color: 'red', mt: 2 }}>{errorMessage}</Box>}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update'}
            </Button>
          </Box>
          {isSuccess && <Box sx={{ color: 'green', mt: 2 }}>Password updated successfully!</Box>}
        </Stack>
      </CardContent>
    </Card>
  );
}
