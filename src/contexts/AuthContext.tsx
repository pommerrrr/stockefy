import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface Organization {
  id: string;
  name: string;
  type: string;
}

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, orgName: string, orgType: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento inicial
    const checkAuth = async () => {
      try {
        // Verificar localStorage para usuário logado
        const savedUser = localStorage.getItem('stockely_user');
        const savedOrg = localStorage.getItem('stockely_organization');
        
        if (savedUser && savedOrg) {
          setUser(JSON.parse(savedUser));
          setOrganization(JSON.parse(savedOrg));
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'demo@stockely.com' && password === 'demo123') {
      const mockUser = {
        id: '1',
        email: 'demo@stockely.com',
        name: 'Usuário Demo'
      };
      
      const mockOrg = {
        id: '1',
        name: 'Restaurante Demo',
        type: 'restaurante'
      };
      
      setUser(mockUser);
      setOrganization(mockOrg);
      
      localStorage.setItem('stockely_user', JSON.stringify(mockUser));
      localStorage.setItem('stockely_organization', JSON.stringify(mockOrg));
    } else {
      throw new Error('Credenciais inválidas');
    }
    
    setLoading(false);
  };

  const register = async (email: string, password: string, name: string, orgName: string, orgType: string) => {
    setLoading(true);
    
    // Simular API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name
    };
    
    const mockOrg = {
      id: Math.random().toString(36).substr(2, 9),
      name: orgName,
      type: orgType
    };
    
    setUser(mockUser);
    setOrganization(mockOrg);
    
    localStorage.setItem('stockely_user', JSON.stringify(mockUser));
    localStorage.setItem('stockely_organization', JSON.stringify(mockOrg));
    
    setLoading(false);
  };

  const logout = async () => {
    setUser(null);
    setOrganization(null);
    localStorage.removeItem('stockely_user');
    localStorage.removeItem('stockely_organization');
  };

  return (
    <AuthContext.Provider value={{
      user,
      organization,
      loading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}