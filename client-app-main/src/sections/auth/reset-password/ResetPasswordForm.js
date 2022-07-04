import * as Yup from 'yup';
//
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Alert, Typography } from '@mui/material';

// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import { WireFrameColorButton } from '../../../components/TextButton';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import { LinkItem } from '../../../components/LinkList';

// paths
import { PATH_AUTH } from '../../../routes/paths';

// redux
import { useDispatch, useSelector } from '../../../redux/store';
import { sendResetPasswordEmail } from '../../../redux/slices/resetPassword';

export default function ResetPasswordForm() {
  const appDispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.resetPassword);

  const isMountedRef = useIsMountedRef();

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: '' },
  });

  const { reset, setError, handleSubmit } = methods;

  const onSubmit = async (data) => {
    try {
      await appDispatch(sendResetPasswordEmail(data.email));
      reset();
    } catch (error) {
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4} sx={{ width: '100%' }}>
        {error && <Alert severity="error">{error}</Alert>}
        <RHFTextField name="email" label="Email address" fullWidth />
        <WireFrameColorButton type="submit" variant="contained" loading={isLoading}>
          Reset password
        </WireFrameColorButton>
        <Typography variant="body2" align="center">
          <LinkItem
            to={PATH_AUTH.login}
            primary={'Return to login'}
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
