import { useEffect } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';

// @mui
import { styled } from '@mui/material/styles';
import { Typography, Stack } from '@mui/material';

// components
import Page from '../../components/Page';
import Image from '../../components/Image';
import NavbarHorizontal from '../../components/NavbarHorizontal';
import TextButton, { WireFrameColorButton } from '../../components/TextButton';

// PATHS
import { PATH_AFTER_LOGIN } from '../../config';

// redux
import { useDispatch, useSelector } from '../../redux/store';
import { sendEmail, clearState } from '../../redux/slices/emailVerification';

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(5),
  paddingLeft: theme.spacing(15),
  paddingRight: theme.spacing(4),

  [theme.breakpoints.down('md')]: {
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
  },
}));

const SectionStyle = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(10, 1, 2, 2),
}));

export default function VerifyEmail() {
  const appDispatch = useDispatch();
  const { isLoading, isVerificationEmailSent } = useSelector((state) => state.candidate);

  useEffect(() => {
    appDispatch(clearState());
  }, [appDispatch]);

  const handleClick = () => appDispatch(sendEmail());

  return (
    <Page title="Verify Email">
      <RootStyle>
        <NavbarHorizontal />
        <SectionStyle>
          <Stack direction="column" spacing={3}>
            <Image alt="placehoder" src="/image.jpg" sx={{ width: 180, opacity: 1 }} />
            <Typography component="h5" variant="h5">
              Verify Your Email
            </Typography>
            <Typography component="p" variant="body1">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s,
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <WireFrameColorButton type="submit" variant="contained" loading={isLoading} onClick={handleClick}>
                {isVerificationEmailSent ? '   Verification email sent!' : 'Send Verification Email'}
              </WireFrameColorButton>
              <TextButton variant="text" color="primary" component={RouterLink} to={PATH_AFTER_LOGIN}>
                {isVerificationEmailSent ? 'Start Onboarding' : "I'd verify my account later"}
              </TextButton>
            </Stack>
          </Stack>
        </SectionStyle>
      </RootStyle>
    </Page>
  );
}
