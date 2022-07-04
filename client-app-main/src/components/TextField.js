// @mui
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CssTextField = styled(TextField)(({ theme }) => ({
  // input label when focused
  '& label.Mui-focused': {
    color: theme.palette.text.primary,
  },
  '	& .MuiOutlinedInput-root': {
    borderRadius: 0,
  },
  // focused color for input with variant='standard'
  '& .MuiInput-underline:after': {
    borderBottomColor: theme.palette.grey[100],
    borderRaduis: 0,
  },
  // focused color for input with variant='filled'
  '& .MuiFilledInput-underline:after': {
    borderBottomColor: theme.palette.grey[100],
    borderRaduis: 0,
  },
  // focused color for input with variant='outlined'
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.grey[100],
    },
  },
}));
