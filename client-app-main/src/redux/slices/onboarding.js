// firebase
import { createSlice } from '@reduxjs/toolkit';

//
import { dispatch } from '../store';
import { uploadTask } from '../../utils/uploadTask';

// Config

import { IMAGE_PLACEHOLDER } from '../../config';

// -------------------------------------------------------//

const initialState = {
  isCvUpLoading: false,
  isPictureLoading: false,
  isVideoUpLoading: false,
  isUploadingVideoLoading: false,
  photoUrl: null,
  cvUrl: null,
  videoUrl: null,
  error: null,
};

const slice = createSlice({
  name: 'UploadSingleFile',
  initialState,
  reducers: {
    // START LOADING
    startCvLoading(state) {
      state.isCvUpLoading = true;
    },
    startPicLoading(state) {
      state.isPictureLoading = true;
    },
    startvideoLoading(state) {
      state.isVideoUpLoading = true;
    },
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update  Candidate

    uploadSuccess(state, action) {
      state.isPictureLoading = false;
      state.photoUrl = action.payload;
    },

    uploadCVSuccess(state, action) {
      state.isCvUpLoading = false;
      state.cvUrl = action.payload;
    },

    uploadVideoSuccess(state, action) {
      state.isVideoUpLoading = false;
      state.videoUrl = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { hasError, startLoading, sentVerificationEmail, updateCandidateSuccess } = slice.actions;

// ----------------------------------------------------------------------

export function uploadProfilePic(file, setProgess, user) {
  return async () => {
    dispatch(slice.actions.startPicLoading());
    try {
      // upload file
      const url = await uploadTask(file, setProgess, user);
      dispatch(slice.actions.uploadSuccess(url));
    } catch (error) {
      console.log(error.message);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function uploadCv(file, setProgess, user) {
  return async () => {
    dispatch(slice.actions.startCvLoading());
    try {
      // upload file
      const url = await uploadTask(file, setProgess, user);
      console.log('cv url', url);
      const tempUrl = IMAGE_PLACEHOLDER;
      dispatch(slice.actions.uploadCVSuccess(tempUrl));
    } catch (error) {
      console.log(error.message);
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function uploadVideo(file, setProgess, user) {
  return async () => {
    dispatch(slice.actions.startvideoLoading());
    try {
      // upload file
      const url = await uploadTask(file, setProgess, user);
      console.log('video url', url);
      const tempUrl = IMAGE_PLACEHOLDER;
      dispatch(slice.actions.uploadVideoSuccess(tempUrl));
    } catch (error) {
      console.log(error.message);

      dispatch(slice.actions.hasError(error));
    }
  };
}
