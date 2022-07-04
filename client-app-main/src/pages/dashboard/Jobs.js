// @mui
import { styled } from '@mui/material/styles';
import { Stack } from '@mui/material';

// components
import Page from '../../components/Page';
import TextButton from '../../components/TextButton';
// Hooks
import useAuth from '../../hooks/useAuth';

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(5),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(4),
}));

export default function Jobs() {
  const { logout } = useAuth();

  return (
    <Page title="Jobs">
      <RootStyle>
        <Stack>
          <TextButton onClick={() => logout()}>Jobs page</TextButton>
          <TextButton onClick={() => logout()}>Engineers are working on this page</TextButton>
          <TextButton onClick={() => logout()}>Click here to logout!</TextButton>
        </Stack>
      </RootStyle>
    </Page>
  );
}
