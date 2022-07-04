import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';

import MuiAppBar from '@mui/material/AppBar';

import Typography from '@mui/material/Typography';

import { HEADER } from '../../config';

const drawerWidth = 240;

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    backgroundColor: theme.palette.background.paper,
    boxShadow: 'unset',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
export const MainStyle = styled('main')(({ theme }) => ({
  flexGrow: 1,
  paddingTop: HEADER.MOBILE_HEIGHT + 24,
  position: 'relative',
  backgroundColor: theme.palette.background.neutral,
}));

export const MainBody = styled('div')(({ theme }) => ({
  paddingLeft: theme.spacing(15),
  paddingRight: theme.spacing(15),
  minHeight: '100vh',
}));
export const Drawer = styled(MuiDrawer)(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    overflow: 'auto',
    paddingTop: theme.spacing(1),
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'auto',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export const StyleTypographyHeader = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontSize: '20px',
  letterSpacing: '-1px',
  fontWeight: theme.typography.fontWeightBold,
}));

export const StyleTypographyDesc = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.main,
  fontWeight: theme.typography.fontWeightRegular,
  overflow: 'visible',
}));
