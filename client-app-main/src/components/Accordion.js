import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

export default function SimpleAccordion() {
  const StyleAvater = styled(Avatar)(({ theme }) => ({
    backgroundColor: theme.palette.primary,
    '& .MuiAvatar-root ': {
      backgroundColor: theme.palette.primary,
    },
  }));

  return (
    <div>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
          <Stack direction="row" spacing={1}>
            <StyleAvater variant="square" sx={{ bgcolor: 'primary.dark' }}>
              PN
            </StyleAvater>
            <Stack spacing={2}>
              <Typography sx={{ fontWeight: 590 }}>Luke Gallows</Typography>
              <Typography varient="body1" sx={{ fontWeight: 400, color: '#7E858E99' }}>
                Productive People
              </Typography>
            </Stack>
          </Stack>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 1, color: '#7E858E99' }}>
          <Typography>Lorem ipsum dolor</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
