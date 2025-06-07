import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthScreen } from './components/auth/AuthScreen';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/Dashboard';
import { EntriesManagement } from './components/EntriesManagement';
import { StockControl } from './components/StockControl';
import { StockExits } from './components/StockExits';
import { RecipesManagement } from './components/RecipesManagement';
import { SuppliersManagement } from './components/SuppliersManagement';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { ShoppingList } from './components/ShoppingList';
import { Toaster } from './components/ui/sonner';
import { Button } from './components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Page = 'dashboard' | 'entries' | 'stock' | 'exits' | 'recipes' | 'suppliers' | 'reports' | 'shopping' | 'settings';

// Context global para dados
import { createContext, useContext } from 'react';

interface AppContextType {
  navigateToEntries: () => void;
  navigateToRecipes: () => void;
  navigateToReports: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContext');
  }
  return context;
};

function AppContent() {
  const { user, organization, loading, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const navigateToEntries = () => setCurrentPage('entries');
  const navigateToRecipes = () => setCurrentPage('recipes');
  const navigateToReports = () => setCurrentPage('reports');

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'entries':
        return <EntriesManagement />;
      case 'stock':
        return <StockControl />;
      case 'exits':
        return <StockExits />;
      case 'recipes':
        return <RecipesManagement />;
      case 'suppliers':
        return <SuppliersManagement />;
      case 'reports':
        return <Reports />;
      case 'shopping':
        return <ShoppingList />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando Stockely...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <AuthScreen />;
  }

  // User authenticated but no organization (show loading or setup)
  if (!organization && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando dados da organização...</p>
          <p className="text-xs text-gray-400 mt-2">Se esse problema persistir, faça logout e entre novamente</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="mt-4"
          >
            Fazer Logout
          </Button>
        </div>
      </div>
    );
  }

  // Authenticated - show main app
  return (
    <AppContext.Provider value={{ navigateToEntries, navigateToRecipes, navigateToReports }}>
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Sidebar currentPage={currentPage} onPageChange={(page: Page) => setCurrentPage(page)} />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {organization?.name || 'Stockely'}
                </h1>
                <p className="text-sm text-gray-500 capitalize">
                  {organization?.type || 'Sistema de Gestão'}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.email}
                  </p>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-auto">
            {renderCurrentPage()}
          </main>
        </div>
        
        <Toaster position="top-right" />
      </div>
    </AppContext.Provider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}