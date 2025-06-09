import { useState, useEffect, createContext, useContext } from 'react';
import { auth } from '../services/firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Busca informações adicionais do usuário no Firestore
        const userDoc = await getDoc(doc(db, 'pessoa', user.uid));
        if (userDoc.exists()) {
          setUser({
            uid: user.uid,
            email: user.email,
            ...userDoc.data()
          });
        } else {
          // Se o documento não existe, cria um novo com papel de avaliador
          const userData = {
            nome: user.displayName || user.email.split('@')[0],
            email: user.email,
            tipo: 'avaliador',
            createdAt: new Date().toISOString()
          };
          await setDoc(doc(db, 'pessoa', user.uid), userData);
          setUser({
            uid: user.uid,
            email: user.email,
            ...userData
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, nome, tipo) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Atualiza o perfil do usuário com o nome
      await updateProfile(user, {
        displayName: nome
      });

      // Cria o documento do usuário no Firestore
      await setDoc(doc(db, 'pessoa', user.uid), {
        nome,
        email,
        tipo,
        createdAt: new Date().toISOString()
      });

      return user;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const updateUserRole = async (tipo) => {
    try {
      if (!user) throw new Error('Usuário não está autenticado');
      
      await setDoc(doc(db, 'pessoa', user.uid), {
        ...user,
        tipo,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setUser(prev => ({
        ...prev,
        tipo
      }));
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    updateUserRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 