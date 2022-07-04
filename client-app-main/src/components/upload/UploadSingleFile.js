// React
import { useCallback, useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
// @mui
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
//
import RejectionFiles from './RejectionFiles';
import BlockContent from './BlockContent';

// redux
import { useDispatch } from '../../redux/store';
import { uploadProfilePic, uploadCv, uploadVideo } from '../../redux/slices/onboarding';

// Hooks
import useAuth from '../../hooks/useAuth';
// ----------------------------------------------------------------------

const DropZoneStyle = styled('div')(({ theme }) => ({
  outline: 'none',
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  '&:hover': { opacity: 0.72, cursor: 'pointer' },
}));

// ----------------------------------------------------------------------

UploadSingleFile.propTypes = {
  error: PropTypes.bool,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  helperText: PropTypes.node,
  sx: PropTypes.object,
  content: PropTypes.string,
  imgUrl: PropTypes.string,
  loading: PropTypes.bool,
};

export default function UploadSingleFile({ error = false, content, imgUrl, loading, helperText, ...other }) {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const [file, setFile] = useState({
    profilePic: null,
    cv: null,
    video: null,
  });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (file.profilePic) {
      dispatch(uploadProfilePic(file.profilePic, setProgress, user));
    }
    if (file.cv) {
      dispatch(uploadCv(file.cv, setProgress, user));
    }
    if (file.video) {
      dispatch(uploadVideo(file.video, setProgress, user));
    }
  }, [file, dispatch, user]);

  function getFileType(file) {
    if (file.type.match('image/*')) {
      setFile({
        ...file,
        profilePic: file,
      });
    }

    if (file.type.match('video/*')) {
      setFile({
        ...file,
        video: file,
      });
    }

    if (file.type.match('application/*')) {
      setFile({
        ...file,
        cv: file,
      });
    }
  }

  const onDrop = useCallback((acceptedFile) => {
    getFileType(acceptedFile[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple: false,
    onDrop,
    ...other,
  });

  return (
    <Box>
      <DropZoneStyle
        {...getRootProps()}
        sx={{
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && {}),
          ...(file && {}),
        }}
      >
        <input {...getInputProps()} />

        <BlockContent content={content} downloadUrl={imgUrl} />
        {loading && <p>uploading : {progress}</p>}
      </DropZoneStyle>

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}

      {helperText && helperText}
    </Box>
  );
}
