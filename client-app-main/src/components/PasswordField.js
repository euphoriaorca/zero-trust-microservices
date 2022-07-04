import * as React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';

// mui
import { IconButton, InputAdornment } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

// components
import Iconify from './Iconify';

import { RHFTextField } from './hook-form';

// styles
const PasswordField = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const { password } = props;

  React.useEffect(() => {
    console.log('password is', password);
  }, [password]);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const PasswordComponent = React.forwardRef((props, ref) => (
    <div {...props} ref={ref}>
      <RHFTextField
        name="password"
        label="Password"
        onBlur={handleTooltipClose}
        onClick={handleTooltipOpen}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  ));
  const longText = `
Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
Praesent non nunc mollis, fermentum neque at, semper arcu.
Nullam eget est sed sem iaculis gravida eget vitae justo.
`;

  return (
    <Tooltip
      PopperProps={{
        disablePortal: true,
      }}
      onClose={handleTooltipClose}
      open={open}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      title={longText}
      placement="right-start"
      arrow
    >
      <PasswordComponent />
    </Tooltip>
  );
};

PasswordField.propTypes = {
  password: PropTypes.string,
};
export default PasswordField;
