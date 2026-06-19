import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBwTfOG7WM6tDpOnKVtcT9w4KbXjTsm0Lg',
  authDomain: 'kyzer-website.firebaseapp.com',
  projectId: 'kyzer-website',
  storageBucket: 'kyzer-website.firebasestorage.app',
  messagingSenderId: '814475694751',
  appId: '1:814475694751:web:8a3e8ebd14795b5e1b48aa',
  measurementId: 'G-VMW3L90WZH',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
