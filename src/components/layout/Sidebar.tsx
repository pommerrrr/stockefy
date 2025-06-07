import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Plus, 
  Archive, 
  TrendingDown,
  ChefHat, 
  Truck, 
  BarChart3,
  Settings,
  ShoppingCart,
  Building
} from 'lucide-react';

type Page = 'dashboard' | 'entries' | 'stock' | 'exits' | 'recipes' | 'suppliers' | 'reports' | 'shopping' | 'settings';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'entries', label: 'Entradas', icon: Plus },
  { id: 'stock', label: 'Controle de Estoque', icon: Archive },
  { id: 'exits', label: 'Saídas', icon: TrendingDown },
  { id: 'recipes', label: 'Fichas Técnicas', icon: ChefHat },
  { id: 'suppliers', label: 'Fornecedores', icon: Truck },
  { id: 'reports', label: 'Relatórios', icon: BarChart3 },
  { id: 'shopping', label: 'Lista de Compras', icon: ShoppingCart },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 shadow-lg">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-500 to-green-600">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <img src="/logo.png" alt="Stockely" className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Stockely</h1>
            <p className="text-sm text-orange-100">Gestão Inteligente de Estoque</p>
          </div>
        </div>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id as Page)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:shadow-md"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.id === 'shopping' && (
                    <div className="ml-auto w-2 h-2 bg-orange-400 rounded-full"></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
          <p className="text-xs text-gray-600 font-medium">
            Stockely v2.0
          </p>
          <p className="text-xs text-gray-500">
            Para Restaurantes & Food Service
          </p>
        </div>
      </div>
    </div>
  );
}