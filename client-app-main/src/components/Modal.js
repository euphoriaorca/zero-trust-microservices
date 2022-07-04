import * as React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// styles
import { styled } from '@mui/material/styles';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2, 10, 0, 2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiBackdrop-root': {
    backgroundColor: theme.palette.common.white,
  },
}));

const StyledOutlinedButton = styled(Button)(({ theme }) => ({
  border: `1px solid  ${theme.palette.grey[300]}`,
  color: theme.palette.common.black,
  textTransform: 'none',
  fontWeight: 100,
  '&:hover': {
    border: `1px solid  ${theme.palette.grey[300]}`,
    color: theme.palette.common.black,
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        />
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function Dialogs(props) {
  const [open, setOpen] = React.useState(true);
  const { children } = props;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Complete your profile and start getting matched !
        </BootstrapDialogTitle>
        <DialogContent dividers color="red">
          {children}
        </DialogContent>
        <DialogActions>
          <StyledOutlinedButton variant="outlined">I'd do these later</StyledOutlinedButton>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

Dialogs.propTypes = {
  children: PropTypes.node,
};
