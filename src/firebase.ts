import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'mock-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'aviasafe-systems.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'aviasafe-systems',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'aviasafe-systems.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:abcdef123456',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

if (import.meta.env.DEV && import.meta.env.VITE_USE_AUTH_EMULATOR !== 'false') {
  // Guard against Vite HMR duplicate connection errors
  if ((auth as unknown as { _canInitEmulator?: boolean })._canInitEmulator !== false) {
    try {
      connectAuthEmulator(
        auth,
        import.meta.env.VITE_AUTH_EMULATOR_URL || 'http://localhost:9099',
        { disableWarnings: true }
      );
    } catch {
      // Already connected during HMR
    }
  }
}

export default app;

