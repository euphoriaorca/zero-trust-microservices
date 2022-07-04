// @mui
import { styled } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';

// components
import Page from '../../components/Page';
import Logo from '../../components/Logo';

// sections
import { LoginForm } from '../../sections/auth/login';

const SectionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  letterSpacing: '-2px',
}));

export default function Login() {
  return (
    <Page title="Login">
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={4}>
        <Logo sx={{ marginRight: 15 }} />
        <SectionStyle variant="h1">Welcome back!</SectionStyle>
        <LoginForm />
      </Stack>
    </Page>
  );
}
