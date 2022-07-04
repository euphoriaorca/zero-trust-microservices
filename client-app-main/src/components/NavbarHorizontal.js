// proptypes
import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';

import { memo } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Container, Stack, Button } from '@mui/material';
// config
import { HEADER } from '../config';
// components
import Logo from './Logo';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  transition: theme.transitions.create('top', {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),

  padding: theme.spacing(1, 0),
  top: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
  backgroundColor: '',
}));

const Item = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
  textAlign: 'center',
}));

const ColorButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.black,
  backgroundColor: theme.palette.common.white,
  fontWeight: 100,
  '&:hover': {
    backgroundColor: theme.palette.common.white,
  },
}));
// ----------------------------------------------------------------------
NavbarHorizontal.propTypes = {
  title: PropTypes.string,
  link: PropTypes.string,
};

function NavbarHorizontal({ title, link }) {
  return (
    <RootStyle>
      <Container>
        <Stack direction="row" justifyContent="space-between" spacing={{ xs: 1, sm: 2, md: 4 }}>
          <Item>
            <Logo sx={{ width: 28, height: 30 }} />
          </Item>
          {title && (
            <ColorButton component={RouterLink} to={`${link}`}>
              {title}
            </ColorButton>
          )}
        </Stack>
      </Container>
    </RootStyle>
  );
}

export default memo(NavbarHorizontal);
