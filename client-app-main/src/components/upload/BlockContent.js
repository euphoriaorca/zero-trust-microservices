import PropTypes from 'prop-types';

// @mui
import { Box, Typography, Stack } from '@mui/material';

// components
import Image from '../Image';

// ----------------------------------------------------
BlockContent.propTypes = {
  content: PropTypes.string,
  downloadUrl: PropTypes.string,
};

export default function BlockContent({ content, downloadUrl }) {
  return (
    <Box sx={{ width: 90 }}>
      <Stack direction="column" spacing={1} alignItems="center">
        <Image alt="placehoder" src={downloadUrl || '/image.jpg'} sx={{ width: 80, height: 80, opacity: 1 }} />
        <Typography component="p" variant="body2" sx={{ textAlign: 'center' }}>
          {content}
        </Typography>
      </Stack>
    </Box>
  );
}
