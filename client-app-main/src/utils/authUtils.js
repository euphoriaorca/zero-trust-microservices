// firebase
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import axios from './axios';

// ----------------------------------------------------------------------//
export async function registerCandididate(userInfo) {
  const token = await getToken();

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const config = {
      method: 'post',
      url: '/api/users/candidate',
      headers,
      data: userInfo,
    };
    const response = await axios(config);
    return response;
  } catch (error) {
    console.error('Registration Error', error.message);
    throw new Error(error);
  }
}

export async function updateCandididate(userInfo) {
  const token = await getToken();

  const headers = {
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  try {
    const config = {
      method: 'patch',
      url: '/api/users',
      headers,
      data: userInfo,
    };
    const response = await axios(config);
    return response;
  } catch (error) {
    console.error('userUpdate Error', error);
    throw new Error(error);
  }
}

export async function sendResetPasswordEmail(email) {
  const auth = getAuth();
  sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log('email sent');
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log('error', errorMessage);
    });
}

async function getToken() {
  let token;
  try {
    token = await getAuth().currentUser.getIdToken();
    console.log('token', token);
  } catch (error) {
    console.error('getToken ERROR:', error.message);
  }
  return token;
}
