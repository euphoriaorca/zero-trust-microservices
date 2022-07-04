/* eslint-disable no-unused-vars */
import * as React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import { MainListItems } from './listItems';
import Logo from '../../components/Logo';
import navConfig from './NavConfig';
import Accordion from '../../components/Accordion';
import VerifyEmailNotice from '../../components/VeriyEmailNotice';

import { AppBar, MainStyle, MainBody, StyleTypographyHeader, StyleTypographyDesc, Drawer } from './styles';

function DashboardLayout() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(true);
  };

  return (
    <Box sx={{ display: 'flex', height: '100%', overflowY: 'hidden' }}>
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: '24px',
          }}
        >
          <Stack component="div" nowrap="true" sx={{ flexGrow: 1 }} spacing={1}>
            <StyleTypographyHeader component="h3" variant="h3" nowrap="true" sx={{ flexGrow: 1 }}>
              Getting Started
            </StyleTypographyHeader>
            <StyleTypographyDesc component="h6" variant="h6" nowrap="true" sx={{ flexGrow: 1 }}>
              Getting Started
            </StyleTypographyDesc>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open} sx={{ overflowY: 'hidden' }}>
        <Stack direction="column" justifyContent="space-around" alignItems="stretch" spacing={2}>
          <Logo align="center" sx={{ marginLeft: 4 }} />
          <Stack spacing={30}>
            <List component="nav">
              <MainListItems navConfig={navConfig} />
            </List>
            <Accordion />
          </Stack>
        </Stack>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <MainStyle>
          <MainBody>
            <Outlet />
          </MainBody>
          <VerifyEmailNotice />
        </MainStyle>
      </Box>
    </Box>
  );
}

export default DashboardLayout;
