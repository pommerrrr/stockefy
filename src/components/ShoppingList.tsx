import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ShoppingCart, 
  Calculator, 
  Download, 
  Calendar,
  Package,
  DollarSign,
  AlertTriangle,
  Truck,
  CheckCircle,
  Clock
} from 'lucide-react';

interface ShoppingItem {
  id: string;
  productName: string;
  currentStock: number;
  minStock: number;
  suggestedQuantity: number;
  unit: string;
  supplier: string;
  estimatedCost: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  daysToRunOut: number;
  category: string;
  selected: boolean;
}

// Mock data
const mockShoppingItems: ShoppingItem[] = [
  {
    id: '1',
    productName: 'Molho Especial',
    currentStock: 2,
    minStock: 10,
    suggestedQuantity: 20,
    unit: 'Litros',
    supplier: 'Molhos & Cia',
    estimatedCost: 300.00,
    priority: 'urgent',
    daysToRunOut: 1,
    category: 'Molhos',
    selected: true
  },
  {
    id: '2',
    productName: 'Batata Palito',
    currentStock: 5,
    minStock: 20,
    suggestedQuantity: 30,
    unit: 'Kg',
    supplier: 'Vegetais Fresh',
    estimatedCost: 450.00,
    priority: 'urgent',
    daysToRunOut: 2,
    category: 'Vegetais',
    selected: true
  },
  {
    id: '3',
    productName: 'Queijo Cheddar',
    currentStock: 3,
    minStock: 5,
    suggestedQuantity: 15,
    unit: 'Kg',
    supplier: 'Laticínios Brasil',
    estimatedCost: 433.50,
    priority: 'high',
    daysToRunOut: 4,
    category: 'Laticínios',
    selected: true
  },
  {
    id: '4',
    productName: 'Pão Brioche',
    currentStock: 85,
    minStock: 20,
    suggestedQuantity: 50,
    unit: 'Unidades',
    supplier: 'Padaria Central',
    estimatedCost: 75.00,
    priority: 'medium',
    daysToRunOut: 12,
    category: 'Pães',
    selected: false
  },
  {
    id: '5',
    productName: 'Óleo de Fritura',
    currentStock: 8,
    minStock: 6,
    suggestedQuantity: 10,
    unit: 'Litros',
    supplier: 'Distribuidora Geral',
    estimatedCost: 120.00,
    priority: 'low',
    daysToRunOut: 20,
    category: 'Óleos',
    selected: false
  }
];

export function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>(mockShoppingItems);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [demandIncrease, setDemandIncrease] = useState(0);
  const [groupBySupplier, setGroupBySupplier] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const toggleItemSelection = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems(items.map(item => 
      item.id === id ? { 
        ...item, 
        suggestedQuantity: quantity,
        estimatedCost: (quantity / item.suggestedQuantity) * item.estimatedCost
      } : item
    ));
  };

  const recalculateList = () => {
    // Simular recálculo baseado nos parâmetros
    console.log('Recalculando lista com:', { purchaseDate, demandIncrease });
    // Aqui seria implementada a lógica de recálculo real
  };

  const exportList = () => {
    const selectedItems = items.filter(item => item.selected);
    const csvContent = [
      ['Produto', 'Quantidade', 'Unidade', 'Fornecedor', 'Custo Estimado', 'Prioridade'],
      ...selectedItems.map(item => [
        item.productName,
        item.suggestedQuantity.toString(),
        item.unit,
        item.supplier,
        `R$ ${item.estimatedCost.toFixed(2)}`,
        item.priority
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lista-compras-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'Urgente';
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return 'Normal';
    }
  };

  const filteredItems = items.filter(item => 
    priorityFilter === 'all' || item.priority === priorityFilter
  );

  const selectedItems = filteredItems.filter(item => item.selected);
  const totalCost = selectedItems.reduce((sum, item) => sum + item.estimatedCost, 0);
  const urgentCount = filteredItems.filter(item => item.priority === 'urgent').length;

  const groupedBySupplier = groupBySupplier 
    ? filteredItems.reduce((groups, item) => {
        const supplier = item.supplier;
        if (!groups[supplier]) {
          groups[supplier] = [];
        }
        groups[supplier].push(item);
        return groups;
      }, {} as Record<string, ShoppingItem[]>)
    : null;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
            Lista de Compras Inteligente
          </h1>
          <p className="text-muted-foreground">
            Gerada automaticamente baseada no consumo e níveis de estoque
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button onClick={exportList} variant="outline" disabled={selectedItems.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Exportar Lista
          </Button>
          <Button onClick={recalculateList} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
            <Calculator className="w-4 h-4 mr-2" />
            Recalcular
          </Button>
        </div>
      </div>

      {/* Alertas urgentes */}
      {urgentCount > 0 && (
        <Alert className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Atenção!</strong> Você tem {urgentCount} itens com prioridade urgente que podem acabar em breve.
          </AlertDescription>
        </Alert>
      )}

      {/* Configurações */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Parâmetros da Lista
          </CardTitle>
          <CardDescription>
            Ajuste os parâmetros para otimizar sua lista de compras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Data da Compra</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="purchaseDate"
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="demandIncrease">Aumento de Demanda (%)</Label>
              <Input
                id="demandIncrease"
                type="number"
                min="0"
                max="100"
                value={demandIncrease}
                onChange={(e) => setDemandIncrease(parseInt(e.target.value) || 0)}
                placeholder="Ex: 20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priorityFilter">Filtrar por Prioridade</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="groupBySupplier" 
                  checked={groupBySupplier}
                  onCheckedChange={(checked) => setGroupBySupplier(checked as boolean)}
                />
                <Label htmlFor="groupBySupplier" className="text-sm">
                  Agrupar por fornecedor
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600">Total de Itens</p>
                <p className="text-2xl font-bold text-blue-900">{filteredItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-green-600">Selecionados</p>
                <p className="text-2xl font-bold text-green-900">{selectedItems.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-purple-600">Custo Total</p>
                <p className="text-2xl font-bold text-purple-900">R$ {totalCost.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-sm text-red-600">Urgentes</p>
                <p className="text-2xl font-bold text-red-900">{urgentCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de itens */}
      {groupedBySupplier ? (
        // Visualização agrupada por fornecedor
        <div className="space-y-6">
          {Object.entries(groupedBySupplier).map(([supplier, supplierItems]) => (
            <Card key={supplier} className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  {supplier}
                </CardTitle>
                <CardDescription>
                  {supplierItems.length} itens • R$ {supplierItems.reduce((sum, item) => sum + (item.selected ? item.estimatedCost : 0), 0).toFixed(2)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {supplierItems.map((item) => (
                    <ItemRow 
                      key={item.id} 
                      item={item} 
                      onToggle={toggleItemSelection}
                      onUpdateQuantity={updateQuantity}
                      getPriorityColor={getPriorityColor}
                      getPriorityLabel={getPriorityLabel}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Visualização normal
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Itens Sugeridos
            </CardTitle>
            <CardDescription>
              Marque os itens que deseja incluir na lista de compras
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <ItemRow 
                  key={item.id} 
                  item={item} 
                  onToggle={toggleItemSelection}
                  onUpdateQuantity={updateQuantity}
                  getPriorityColor={getPriorityColor}
                  getPriorityLabel={getPriorityLabel}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface ItemRowProps {
  item: ShoppingItem;
  onToggle: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  getPriorityColor: (priority: string) => string;
  getPriorityLabel: (priority: string) => string;
}

function ItemRow({ item, onToggle, onUpdateQuantity, getPriorityColor, getPriorityLabel }: ItemRowProps) {
  return (
    <div className={`flex items-center gap-4 p-4 border rounded-xl transition-all ${
      item.selected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
    }`}>
      <Checkbox 
        checked={item.selected}
        onCheckedChange={() => onToggle(item.id)}
      />
      
      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
        <Package className="w-6 h-6 text-blue-600" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold truncate">{item.productName}</h4>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Atual: {item.currentStock} {item.unit}</span>
          <span>Mín: {item.minStock} {item.unit}</span>
          <span>🏪 {item.supplier}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Previsão: acabar em {item.daysToRunOut} dias
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Quantidade</label>
          <Input
            type="number"
            min="0"
            value={item.suggestedQuantity}
            onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 0)}
            className="w-20 h-8 text-center"
          />
        </div>
        
        <div className="text-right">
          <div className="font-semibold">
            R$ {item.estimatedCost.toFixed(2)}
          </div>
          <Badge className={getPriorityColor(item.priority)}>
            {getPriorityLabel(item.priority)}
          </Badge>
        </div>
      </div>
    </div>
  );
}