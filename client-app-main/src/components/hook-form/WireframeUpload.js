import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormHelperText } from '@mui/material';
// type
import { UploadAvatar, UploadSingleFile } from '../upload';

// -------------------------../upload/RejectionFiles-----------------------------

RHFUploadAvatar.propTypes = {
  name: PropTypes.string,
};

export function RHFUploadAvatar({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const checkError = !!error && !field.value;

        return (
          <div>
            <UploadAvatar error={checkError} {...other} file={field.value} />
            {checkError && (
              <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                {error.message}
              </FormHelperText>
            )}
          </div>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

RHFUploadSingleFile.propTypes = {
  content: PropTypes.string,
  accept: PropTypes.string,
  imgUrl: PropTypes.string,
  loading: PropTypes.bool,
};

export function RHFUploadSingleFile({ content, accept, imgUrl, loading }) {
  return <UploadSingleFile accept={accept} content={content} imgUrl={imgUrl} loading={loading} />;
}
