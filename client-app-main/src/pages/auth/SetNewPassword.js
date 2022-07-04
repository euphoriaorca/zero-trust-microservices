// @mui
import { styled } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';

// components
import Page from '../../components/Page';
import Logo from '../../components/Logo';

// sections
import { SetPasswordForm } from '../../sections/auth/set-new-password';

const SectionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  letterSpacing: '-2px',
}));

export default function ResetPassword() {
  return (
    <Page title="Reset Password">
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={4}>
        <Logo sx={{ marginRight: 15 }} />
        <SectionStyle variant="h1">Reset your password</SectionStyle>
        <SetPasswordForm />
      </Stack>
    </Page>
  );
}
