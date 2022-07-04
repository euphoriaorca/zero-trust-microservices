import { createSlice } from '@reduxjs/toolkit';
import { updateCandididate } from '../../utils/authUtils';

import { dispatch } from '../store';

// -------------------------------------------------------//

const initialState = {
  isLoading: false,
  error: null,
  candidate: {},
  isVerificationEmailSent: false,
  token: null,
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
    updateCandidateSuccess(state) {
      state.isLoading = false;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { hasError, startLoading, sentVerificationEmail, updateCandidateSuccess } = slice.actions;

// ----------------------------------------------------------------------

export function updateUser(userInfo) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const res = await updateCandididate(userInfo);
      console.log('response from update cand', res);
      // Email verification sent!
      dispatch(slice.actions.updateCandidateSuccess());
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
