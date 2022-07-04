// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack } from '@mui/material';

// components
import Page from '../../../components/Page';
import Toast from '../../../components/Toast';

// config
import { onBoardingConfig } from './config';

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(5),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(4),
}));

const StyleHeader = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'left',
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.text.dark,
  lineHeight: theme.spacing(2),
  fontSize: '20px',
}));

export default function Home() {
  return (
    <Page title="Onboarding">
      <RootStyle>
        <Stack spacing={2}>
          <StyleHeader varient="h3">Hey there! Just a few more things to go</StyleHeader>
          {onBoardingConfig.map((item, index) => (
            <Toast key={index} title={item.title} description={item.description} buttonText={item.buttonText} />
          ))}
        </Stack>
      </RootStyle>
    </Page>
  );
}
