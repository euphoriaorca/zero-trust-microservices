import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Grid, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';

// components
import { ColoredButton } from './TextButton';

import Label from './Label';

const StyleHeader = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.primary,
  fontSize: '16px',
}));
const StyleDesc = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary,
  lineHeight: theme.spacing(2),
  fontSize: '12px',
}));
const StyleBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
}));

export default function ToastComponent({ title, description, buttonText }) {
  return (
    <StyleBox sx={{ flexGrow: 1, minHeight: 120 }}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <StyleHeader varient="h5">{title}</StyleHeader>
          <StyleDesc varient="h6">{description}</StyleDesc>
        </Grid>
        <Grid item xs={4}>
          <Stack spacing={2} alignItems="flex-end">
            <Label color="primary" sx={{ borderRadius: 0 }}>
              pending
            </Label>
            <ColoredButton sx={{ padding: '22px' }}>{buttonText}</ColoredButton>
          </Stack>
        </Grid>
      </Grid>
    </StyleBox>
  );
}

ToastComponent.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  buttonText: PropTypes.string,
};
