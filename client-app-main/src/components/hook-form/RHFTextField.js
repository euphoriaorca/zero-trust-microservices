import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { CssTextField } from '../TextField';

// --------------------------------------------------------------------//

RHFTextField.propTypes = {
  name: PropTypes.string,
};

export default function RHFTextField({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <CssTextField
          {...field}
          fullWidth
          error={!!error}
          helperText={error?.message}
          {...other}
          size="small"
          color="primary"
        />
      )}
    />
  );
}
