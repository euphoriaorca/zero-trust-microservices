/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';

// components
import Page from '../../components/Page';
import Logo from '../../components/Logo';
import EmailSent from '../../components/VerificationEMailSent';

// sections
import { ResetPasswordForm } from '../../sections/auth/reset-password';

// redux
import { useDispatch, useSelector } from '../../redux/store';
import { clearState } from '../../redux/slices/resetPassword';

const SectionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  letterSpacing: '-2px',
}));

const TypographyStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  lineHeight: theme.spacing(2),
  letterSpacing: '-2%',
  fontWeight: theme.typography.fontWeightRegular,
}));

export default function ResetPassword() {
  const appDispatch = useDispatch();
  const { sentRestPasswordEmail } = useSelector((state) => state.resetPassword);

  React.useEffect(() => {
    appDispatch(clearState());
  }, []);
  return (
    <Page title="Reset Password">
      {sentRestPasswordEmail && <EmailSent />}
      {!sentRestPasswordEmail && (
        <Stack direction="column" justifyContent="center" alignItems="center" spacing={4}>
          <Logo sx={{ marginRight: 15 }} />
          <SectionStyle variant="h1">Reset your password</SectionStyle>
          <TypographyStyle variant="body1" align="center">
            No worries, we’d send you instructions to help you get your account back
          </TypographyStyle>
          <ResetPasswordForm />
        </Stack>
      )}
    </Page>
  );
}
