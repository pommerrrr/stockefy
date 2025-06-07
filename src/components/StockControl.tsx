import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Activity,
  AlertTriangle
} from 'lucide-react';

interface StockItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  minStock: number;
  lastCost: number;
  supplier: string;
  lastUpdate: string;
}

interface StockMovement {
  id: number;
  itemName: string;
  type: 'entrada' | 'saida' | 'perda';
  quantity: number;
  unit: string;
  reason: string;
  date: string;
  time: string;
  cost?: number;
}

// Mock data
const mockStockItems: StockItem[] = [
  {
    id: 1,
    name: 'Pão Brioche',
    category: 'Pães',
    currentStock: 85,
    unit: 'Unidade',
    minStock: 20,
    lastCost: 1.50,
    supplier: 'Padaria Central',
    lastUpdate: '2025-06-05'
  },
  {
    id: 2,
    name: 'Carne Angus 180g',
    category: 'Carnes',
    currentStock: 12,
    unit: 'Kg',
    minStock: 10,
    lastCost: 35.00,
    supplier: 'Frigorífico Premium',
    lastUpdate: '2025-06-05'
  },
  {
    id: 3,
    name: 'Queijo Cheddar',
    category: 'Laticínios',
    currentStock: 3,
    unit: 'Kg',
    minStock: 5,
    lastCost: 28.90,
    supplier: 'Laticínios Brasil',
    lastUpdate: '2025-06-04'
  },
  {
    id: 4,
    name: 'Molho Especial',
    category: 'Molhos',
    currentStock: 2,
    unit: 'Litro',
    minStock: 10,
    lastCost: 15.00,
    supplier: 'Molhos & Cia',
    lastUpdate: '2025-06-04'
  },
  {
    id: 5,
    name: 'Batata Palito',
    category: 'Vegetais',
    currentStock: 5,
    unit: 'Kg',
    minStock: 20,
    lastCost: 15.00,
    supplier: 'Vegetais Fresh',
    lastUpdate: '2025-06-03'
  },
  {
    id: 6,
    name: 'Alface Americana',
    category: 'Vegetais',
    currentStock: 25,
    unit: 'Unidade',
    minStock: 15,
    lastCost: 2.50,
    supplier: 'Vegetais Fresh',
    lastUpdate: '2025-06-05'
  }
];

const mockMovements: StockMovement[] = [
  {
    id: 1,
    itemName: 'Pão Brioche',
    type: 'entrada',
    quantity: 100,
    unit: 'Unidade',
    reason: 'Compra - NF 12345',
    date: '2025-06-05',
    time: '09:30',
    cost: 150.00
  },
  {
    id: 2,
    itemName: 'Carne Angus 180g',
    type: 'saida',
    quantity: 3,
    unit: 'Kg',
    reason: 'Produção - 15 hambúrgueres',
    date: '2025-06-05',
    time: '12:15'
  },
  {
    id: 3,
    itemName: 'Molho Especial',
    type: 'perda',
    quantity: 2,
    unit: 'Litro',
    reason: 'Vencimento',
    date: '2025-06-04',
    time: '18:00'
  }
];

export function StockControl() {
  const [stockItems] = useState<StockItem[]>(mockStockItems);
  const [movements] = useState<StockMovement[]>(mockMovements);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = Array.from(new Set(stockItems.map(item => item.category)));

  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (currentStock: number, minStock: number) => {
    if (currentStock === 0) return { status: 'out', label: 'Esgotado', color: 'bg-red-500', textColor: 'text-red-600' };
    if (currentStock <= minStock) return { status: 'low', label: 'Baixo', color: 'bg-orange-500', textColor: 'text-orange-600' };
    return { status: 'good', label: 'OK', color: 'bg-green-500', textColor: 'text-green-600' };
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'entrada':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'saida':
        return <TrendingDown className="w-4 h-4 text-blue-600" />;
      case 'perda':
        return <Minus className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getMovementBadge = (type: string) => {
    switch (type) {
      case 'entrada':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Entrada</Badge>;
      case 'saida':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Saída</Badge>;
      case 'perda':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Perda</Badge>;
      default:
        return <Badge>Movimento</Badge>;
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
          Controle de Estoque
        </h1>
        <p className="text-muted-foreground">
          Visualize e acompanhe todos os produtos em estoque
        </p>
      </div>

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inventory">Inventário Atual</TabsTrigger>
          <TabsTrigger value="movements">Movimentações</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          {/* Filtros */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar produtos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCategoryFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      categoryFilter === 'all'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Todos
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setCategoryFilter(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        categoryFilter === category
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grid de produtos */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item) => {
              const stockStatus = getStockStatus(item.currentStock, item.minStock);
              return (
                <Card key={item.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className={`w-3 h-3 rounded-full ${stockStatus.color}`} />
                      </div>
                      
                      {/* Nome e categoria */}
                      <div>
                        <h3 className="font-semibold text-sm leading-tight">{item.name}</h3>
                        <Badge variant="outline" className="text-xs mt-1">
                          {item.category}
                        </Badge>
                      </div>
                      
                      {/* Estoque */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Estoque</span>
                          <Badge variant={stockStatus.status === 'good' ? 'default' : 'destructive'} className="text-xs">
                            {stockStatus.label}
                          </Badge>
                        </div>
                        <div className="text-lg font-bold">
                          {item.currentStock} <span className="text-sm font-normal text-muted-foreground">{item.unit}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${stockStatus.color}`}
                            style={{ 
                              width: `${Math.min(100, (item.currentStock / (item.minStock * 2)) * 100)}%` 
                            }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Mínimo: {item.minStock} {item.unit}
                        </div>
                      </div>
                      
                      {/* Info adicional */}
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>💰 R$ {item.lastCost.toFixed(2)}</div>
                        <div>🏪 {item.supplier}</div>
                        <div>📅 {item.lastUpdate}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? 'Tente ajustar sua busca' : 'Nenhum produto em estoque no momento'}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="movements">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Histórico de Movimentações
              </CardTitle>
              <CardDescription>
                Todas as entradas, saídas e perdas registradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {movements.map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getMovementIcon(movement.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold">{movement.itemName}</h4>
                        <p className="text-sm text-muted-foreground">{movement.reason}</p>
                        <p className="text-xs text-muted-foreground">
                          {movement.date} às {movement.time}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">
                          {movement.quantity} {movement.unit}
                        </div>
                        {movement.cost && (
                          <div className="text-sm text-muted-foreground">
                            R$ {movement.cost.toFixed(2)}
                          </div>
                        )}
                      </div>
                      {getMovementBadge(movement.type)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}