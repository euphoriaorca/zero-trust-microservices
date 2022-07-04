import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
// slices
import UploadSingleFile from './slices/onboarding';
import emailVerification from './slices/emailVerification';
import resetPassword from './slices/resetPassword';

// ----------------------------------------------------------------------//

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const rootReducer = combineReducers({
  emailVerification,
  resetPassword,
  UploadSingleFile,
});

export { rootPersistConfig, rootReducer };
