import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import { LinkItem } from './LinkList';

const SectionStyle = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  lineHeight: theme.spacing(2),
  letterSpacing: '0.5px',
  fontWeight: theme.typography.fontWeightRegular,
  backgroundColor: theme.palette.background.default,

  display: 'flex',
  position: 'absolute',
  bottom: 0,
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  paddingLeft: theme.spacing(3),
  width: '-webkit-fill-available',
}));

const VerifyEmailNotice = () => (
  <SectionStyle>
    Click the link in your email to verify your account. Didn’t get the email ?
    <LinkItem
      to="#"
      primary={'    Request another link'}
      sx={{
        color: 'primary.main',
        textDecoration: 'none',
      }}
    />
  </SectionStyle>
);

export default VerifyEmailNotice;
