import * as Yup from 'yup';
import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { styled } from '@mui/material/styles';
import { Stack, IconButton, InputAdornment, Alert, Typography, Link } from '@mui/material';

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

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const { register } = useAuth();

  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
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
      await register(data.email, data.password, data.firstName, data.lastName);
    } catch (error) {
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };

  const SectionStyle = styled(Typography)(({ theme }) => ({
    color: theme.palette.secondary.main,
    lineHeight: theme.spacing(2),
    letterSpacing: '0.5px',
    fontWeight: theme.typography.fontWeightRegular,
  }));

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="First name" sx={{ borderRadius: 0 }} />
          <RHFTextField name="lastName" label="Last name" />
        </Stack>

        <RHFTextField name="email" label="Work Email" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <SectionStyle component="p" variant="body1">
          By clicking Sign Up, I agree to Distinct’s
          <Link underline="none"> Terms of Service, Payments Terms of Service,</Link> and
          <Link underline="none"> Nondiscrimination Policy </Link> and acknowledge the{' '}
          <Link underline="none"> Privacy Policy.</Link>
        </SectionStyle>
        <WireFrameColorButton type="submit" variant="contained" loading={isSubmitting}>
          Sign Up
        </WireFrameColorButton>
        <Typography variant="body2" align="center">
          Already have an account?
          <LinkItem
            to={PATH_AUTH.login}
            primary={'   Login'}
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
