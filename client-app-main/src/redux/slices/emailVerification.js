// firebase
import { sendEmailVerification, getAuth } from 'firebase/auth';

import { createSlice } from '@reduxjs/toolkit';

//
import { dispatch } from '../store';

// -------------------------------------------------------//

const initialState = {
  isLoading: false,
  error: null,
  isVerificationEmailSent: false,
};

const slice = createSlice({
  name: 'candidate',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Update  Candidate

    resetState(state) {
      state.isLoading = false;
      state.isVerificationEmailSent = false;
    },

    // Sent Verification email

    sentVerificationEmail(state) {
      state.isLoading = false;
      state.isVerificationEmailSent = true;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { hasError, startLoading, sentVerificationEmail, resetState } = slice.actions;

// ----------------------------------------------------------------------

export function sendEmail() {
  const auth = getAuth();
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await sendEmailVerification(auth.currentUser);
      // Email verification sent!
      dispatch(slice.actions.sentVerificationEmail());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function clearState() {
  return async () => {
    dispatch(slice.actions.resetState());
  };
}
