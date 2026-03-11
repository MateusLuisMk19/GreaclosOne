import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  signInAnonymously,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

interface UserProfile {
  username: string;
  age: number;
  email: string;
  isAnonymous?: boolean;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    username: string,
    age: number
  ) => Promise<void>;
  signInAnonymously: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        // Carregar perfil do usuário do Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserProfile({
              username: data.username || "",
              age: data.age || 0,
              email: user.email || "",
              isAnonymous: data.isAnonymous || false,
            });
          }
        } catch (error) {
          console.error("Erro ao carregar perfil:", error);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    username: string,
    age: number
  ) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Atualizar perfil do usuário
      await updateProfile(result.user, { displayName: username });

      // Salvar informações adicionais no Firestore
      await setDoc(doc(db, "users", result.user.uid), {
        username,
        age,
        email,
        createdAt: new Date().toISOString(),
      });

      setUserProfile({ username, age, email });
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      throw error;
    }
  };

  const handleAnonymousLogin = async () => {
    try {
      const result = await signInAnonymously(auth);

      // Criar perfil anônimo básico
      const anonymousProfile = {
        username: `Jogador${Math.floor(Math.random() * 10000)}`,
        age: 0,
        email: "",
        isAnonymous: true,
        createdAt: new Date().toISOString(),
      };

      // Salvar perfil anônimo no Firestore
      await setDoc(doc(db, "users", result.user.uid), anonymousProfile);

      setUserProfile(anonymousProfile);
    } catch (error) {
      console.error("Erro ao fazer login anônimo:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInAnonymously: handleAnonymousLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
