// @mui
import { styled } from '@mui/material/styles';
import { Stack, Typography } from '@mui/material';

// components
import Page from '../../components/Page';
import Logo from '../../components/Logo';

// sections
import { RegisterForm } from '../../sections/auth/register';

const SectionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  letterSpacing: '-1px',
}));

export default function Register() {
  return (
    <Page title="Register">
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={4}>
        <Logo sx={{ marginRight: 15 }} />
        <SectionStyle variant="h1">Let’s get you started quickly</SectionStyle>
        <RegisterForm />
      </Stack>
    </Page>
  );
}
