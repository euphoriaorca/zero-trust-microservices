// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack } from '@mui/material';

// components
import Page from './Page';
import Logo from './Logo';
import Image from './Image';
import { LinkItem } from './LinkList';

const TypographyStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  letterSpacing: '-1px',
}));
const TypographyStyleTwo = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontWeight: theme.typography.fontWeightRegular,
}));

export default function VerifyEmailSent() {
  return (
    <Page title="Email Sent">
      <Stack direction="column" spacing={3} justifyContent="center" alignItems="center">
        <Logo sx={{ marginRight: 15 }} />
        <TypographyStyle component="h1" variant="h1" align="center">
          An email with reset instructions has been sent!
        </TypographyStyle>
        <Image src="/email.svg" alt="congratulations image" />
        <TypographyStyleTwo component="h5" variant="h5" sx={{ letterSpacing: -1 }}>
          Check your email and follow the steps to recover your account
        </TypographyStyleTwo>
        <Typography component="p" variant="body1">
          <LinkItem to="/" primary="Return to login" sx={{ color: 'primary.main', textDecoration: 'none' }} />
        </Typography>
      </Stack>
    </Page>
  );
}
