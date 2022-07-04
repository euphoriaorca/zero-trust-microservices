// --@react
import * as React from 'react';
import { Outlet } from 'react-router-dom';

// --@mui
import { styled, Container, Typography, Stack } from '@mui/material';

const StyledContainer = styled(Container)(({ theme }) => ({
  background: theme.palette.background.default,
}));

const StyledBox = styled('div')(({ theme }) => ({
  background: theme.palette.background.paper,
  width: 630,
  margin: '6% auto 0 auto',
  padding: theme.spacing(5, 11),
  '& ::-webkit-scrollbar': {
    display: 'none',
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightRegular,
}));

export default function MainLayout() {
  return (
    <StyledContainer maxWidth="xl" component="main">
      <Stack spacing={4}>
        <StyledBox>
          <Outlet />
        </StyledBox>
        <StyledTypography variant="h6" align="center">
          ©2012–2022 All Rights Reserved. Distinct®
        </StyledTypography>
      </Stack>
    </StyledContainer>
  );
}
