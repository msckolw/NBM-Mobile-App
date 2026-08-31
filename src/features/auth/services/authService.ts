import {googleLogin} from '../../../services/auth/googleAuth';
import api from '../../../api/client'
// import api from '../../../api/api';
import {store} from '../../../store';
import {setAuth} from '../store/authslice';

export const loginWithGoogle = async () => {
  const googleResult = await googleLogin();

  const googleUser = googleResult?.user;

  if (!googleUser?.email) {
    throw new Error('Google user information not found');
  }

  const response = await api.post('/auth/googleSignIn', {
    email: googleUser.email,
    name: googleUser.name,
    googleId: googleUser.id,
    picture: googleUser.photo,
    idToken: googleResult?.idToken,
  });

  console.log('Backend Google login:', response.data);

  const backendUser = response.data?.user;

  if (!backendUser) {
    throw new Error('User information not returned by backend');
  }

  /**
   * The current backend does not return the JWT.
   * It sets it as an HTTP-only cookie.
   *
   * For now we keep the Redux token as null.
   * We will improve token/session handling later.
   */
  store.dispatch(
    setAuth({
      token: null as any,
      user: backendUser,
    }),
  );

  return {
    user: backendUser,
    idToken: googleResult?.idToken,
  };
};