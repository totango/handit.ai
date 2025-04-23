/**
 * Reset Password Form Component
 * 
 * This component provides a form for users to request a password reset with:
 * - Email validation using Zod schema
 * - Form state management with React Hook Form
 * - Error handling and display
 * - Loading state management
 * - Integration with custom auth client
 * 
 * The form handles the password reset request flow and provides
 * appropriate feedback to users during the process.
 */
'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/custom/client';
import { DynamicLogo } from '@/components/core/logo';

/**
 * Form validation schema using Zod
 * Validates that email is:
 * - Required
 * - Valid email format
 */
const schema = zod.object({ email: zod.string().min(1, { message: 'Email is required' }).email() });

/**
 * Default form values
 * Initializes the email field as empty
 */
const defaultValues = { email: '' };

/**
 * Reset Password Form Component
 * 
 * @returns {JSX.Element} The reset password form interface
 */
export function ResetPasswordForm() {
  // Loading state for form submission
  const [isPending, setIsPending] = React.useState(false);

  // Form state management with React Hook Form
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ defaultValues, resolver: zodResolver(schema) });

  /**
   * Form submission handler
   * Processes the password reset request and handles errors
   * @param {Object} values - Form values containing email
   */
  const onSubmit = React.useCallback(
    async (values) => {
      setIsPending(true);

      const { error } = await authClient.resetPassword(values);

      if (error) {
        setError('root', { type: 'server', message: error });
        setIsPending(false);
        return;
      }

      setIsPending(false);

      // Redirect to confirm password reset
    },
    [setError]
  );

  return (
    <Stack spacing={4}>
      {/* Logo and Home Link */}
      <div>
        <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block', fontSize: 0 }}>
          <DynamicLogo colorDark="light" colorLight="dark" height={32} width={122} />
        </Box>
      </div>

      {/* Form Header */}
      <Typography variant="h5">Reset password</Typography>

      {/* Reset Password Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* Email Input Field */}
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} type="email" />
                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
              </FormControl>
            )}
          />

          {/* Server Error Display */}
          {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}

          {/* Submit Button */}
          <Button disabled={isPending} type="submit" variant="contained">
            Send recovery link
          </Button>
        </Stack>
      </form>
    </Stack>
  );
}
