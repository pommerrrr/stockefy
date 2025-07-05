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
    <div className="w-64 bg-white border-r border-border shadow-sm flex flex-col h-screen">
      <div className="p-6 border-b border-border bg-gradient-to-r from-primary to-primary/90">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Stockely</h1>
            <p className="text-xs text-white/80">Gestão de Estoque</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto">
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
                      ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
      
      <div className="p-4 border-t border-border">
        <div className="bg-muted rounded-xl p-4">
          <p className="text-xs text-muted-foreground font-medium">
            Stockely v2.0
          </p>
          <p className="text-xs text-muted-foreground/70">
            Para Restaurantes & Food Service
          </p>
        </div>
      </div>
    </div>
  );
}