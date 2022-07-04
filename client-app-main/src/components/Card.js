import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Typography, Stack } from '@mui/material';

const StylePLayBUtton = styled(Box)(() => ({
  position: 'relative',
  top: 60,
  zIndex: 2000,
  left: -105,
}));

const StyleHeader = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'left',
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.text.dark,
  lineHeight: theme.spacing(2),
  fontSize: '16px',
}));

const StyleDec = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'left',
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.text.grayText,
  lineHeight: theme.spacing(2),
  fontSize: '12px',
}));

export default function MediaControlCard() {
  return (
    <Card sx={{ display: 'flex', padding: '8px' }}>
      <CardMedia component="img" sx={{ width: 151 }} image="/images/card.png" alt="Live from space album cover" />
      <StylePLayBUtton>
        <IconButton aria-label="play/pause">
          <PlayArrowIcon sx={{ height: 38, width: 38, color: 'white' }} />
        </IconButton>
      </StylePLayBUtton>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Stack>
            <Box>
              <Button
                align="left"
                size="small"
                color="inherit"
                startIcon={<AccessTimeIcon fontSize="small" sx={{ fontWeight: 400 }} />}
              >
                2:30
              </Button>
            </Box>

            <StyleHeader>Quick Tour</StyleHeader>
            <StyleDec>This video shows you an overview of what distinct can help your organization do</StyleDec>

            <CardActions>
              <Button size="small" color="primary" endIcon={<NorthEastIcon sx={{ width: '13px' }} />}>
                Learn More
              </Button>
            </CardActions>
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
}
