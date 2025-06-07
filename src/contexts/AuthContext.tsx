import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { 
  auth, 
  registerUser, 
  loginUser, 
  logoutUser, 
  getUserOrganization, 
  onAuthStateChange,
  User,
  Organization 
} from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string, organizationName: string, organizationType: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser: FirebaseUser | null) => {
      console.log('Auth state changed:', firebaseUser?.email);
      setLoading(true);
      
      if (firebaseUser) {
        // Sempre define usuário básico primeiro
        const basicUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName || 'Usuário',
          createdAt: new Date(),
          lastLogin: new Date(),
          currentOrganizationId: ''
        };
        
        setUser(basicUser);
        console.log('Basic user set:', basicUser.email);
        
        // Tenta buscar organização de forma não-bloqueante
        setTimeout(async () => {
          try {
            const userData = await getUserOrganization(firebaseUser.uid);
            
            if (userData.success && userData.organization) {
              console.log('Organization found, updating user');
              setUser({
                ...basicUser,
                currentOrganizationId: userData.organization.id
              });
              setOrganization(userData.organization);
            } else {
              console.log('No organization found, keeping basic user');
              setOrganization(null);
            }
          } catch (error) {
            console.error('Error loading organization (non-blocking):', error);
            setOrganization(null);
          }
        }, 100);
        
      } else {
        console.log('User logged out');
        setUser(null);
        setOrganization(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    console.log('Login attempt started for:', email);
    setLoading(true);
    
    try {
      const result = await loginUser(email, password);
      console.log('Login result:', result);
      
      if (result.success && result.user) {
        console.log('Setting user in context:', result.user.email);
        setUser(result.user);
        
        // Organization loading is handled by onAuthStateChange
        console.log('Login successful, auth state will update');
        return { success: true };
      } else {
        console.error('Login failed:', result.error);
        return result;
      }
    } catch (error: any) {
      console.error('Login exception:', error);
      return { success: false, error: error.message || 'Erro inesperado' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    organizationName: string, 
    organizationType: string
  ) => {
    setLoading(true);
    try {
      const result = await registerUser(email, password, name, organizationName, organizationType);
      
      if (result.success && result.user && result.organization) {
        setUser(result.user);
        setOrganization(result.organization);
      }
      
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      setOrganization(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    organization,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};