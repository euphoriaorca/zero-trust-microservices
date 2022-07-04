// @mui
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';

const TextButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.black,
  backgroundColor: theme.palette.common.white,
  borderRadius: 0,
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: theme.palette.common.white,
  },
}));

export const WireFrameColorButton = styled(LoadingButton)(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  borderRadius: 0,
  fontWeight: theme.typography.fontWeightBold,
  boxShadow: 'none',
  height: 29,
  padding: theme.spacing(2, 3),
  border: 0,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
  '& .MuiLoadingButton-loading': {
    backgroundColor: theme.palette.primary.main,
  },

  '& .MuiLoadingButton-loadingIndicator': {
    color: theme.palette.common.white,
  },
}));

export const ColoredButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  borderRadius: 0,
  fontWeight: theme.typography.fontWeightBold,
  boxShadow: 'none',
  height: 29,
  padding: theme.spacing(2, 3),
  border: 0,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
  '& .MuiLoadingButton-loadingIndicator': {
    color: theme.palette.common.white,
  },
}));
export default TextButton;
