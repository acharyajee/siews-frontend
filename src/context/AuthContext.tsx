import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  IdTokenResult
} from 'firebase/auth';
import { auth } from '../firebase';

export interface UserRoleClaims {
  role?: string;
  tenant_id?: string;
}

interface AuthContextType {
  user: User | null;
  claims: UserRoleClaims | null;
  idToken: string | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [claims, setClaims] = useState<UserRoleClaims | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const tokenResult: IdTokenResult = await currentUser.getIdTokenResult(true);
          setClaims({
            role: tokenResult.claims.role as string | undefined,
            tenant_id: tokenResult.claims.tenant_id as string | undefined,
          });
          const rawToken = await currentUser.getIdToken();
          setIdToken(rawToken);
        } catch (error) {
          console.error('Failed to resolve custom claims:', error);
          setClaims(null);
          setIdToken(null);
        }
      } else {
        setClaims(null);
        setIdToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logOut = async () => {
    await signOut(auth);
    setUser(null);
    setClaims(null);
    setIdToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        claims,
        idToken,
        loading,
        signInWithEmail,
        signInWithGoogle,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

