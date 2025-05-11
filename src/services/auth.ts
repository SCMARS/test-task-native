import { auth } from '../config/firebase';

export const verifyAuth = async () => {
  const user = auth.currentUser;
  if (!user) {
    console.log('No authenticated user found');
    return false;
  }

  console.log('User is authenticated:', {
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified
  });

  return true;
}; 