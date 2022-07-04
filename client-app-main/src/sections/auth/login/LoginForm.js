import * as Yup from 'yup';
import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Alert, IconButton, InputAdornment, Typography } from '@mui/material';

// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';

// components
import Iconify from '../../../components/Iconify';
import { LinkItem } from '../../../components/LinkList';
import { WireFrameColorButton } from '../../../components/TextButton';
import { FormProvider, RHFTextField } from '../../../components/hook-form';

// paths
import { PATH_AUTH } from '../../../routes/paths';
// ----------------------------------------------------------------------//

export default function LoginForm() {
  const { login } = useAuth();

  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error(error);
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="email" label="Work Email" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <WireFrameColorButton type="submit" variant="contained" loading={isSubmitting}>
          Sign In
        </WireFrameColorButton>
        <Typography variant="body1" align="right">
          <LinkItem
            to={PATH_AUTH.forgotPassword}
            primary={'   Forgot Password?'}
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
            }}
          />
        </Typography>
        <Typography variant="body1">
          Don’t have Distinct account?
          <LinkItem
            to="/"
            primary={'  Create one here'}
            sx={{
              color: 'primary.main',
              textDecoration: 'none',
            }}
          />
        </Typography>
      </Stack>
    </FormProvider>
  );
}
