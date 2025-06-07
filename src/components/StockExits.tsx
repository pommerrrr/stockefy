import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  TrendingDown, 
  Minus, 
  ChefHat, 
  Package,
  AlertTriangle,
  Calculator
} from 'lucide-react';

interface StockItem {
  name: string;
  currentStock: number;
  unit: string;
}

interface Recipe {
  id: number;
  name: string;
  ingredients: { itemName: string; quantity: number; unit: string }[];
}

interface StockExit {
  id: number;
  type: 'individual' | 'recipe';
  itemName?: string;
  recipeName?: string;
  quantity: number;
  unit: string;
  reason: string;
  exitType: 'production' | 'loss' | 'adjustment';
  date: string;
  time: string;
}

// Mock data
const mockStockItems: StockItem[] = [
  { name: 'Pão Brioche', currentStock: 85, unit: 'Unidade' },
  { name: 'Carne Angus 180g', currentStock: 12, unit: 'Kg' },
  { name: 'Queijo Cheddar', currentStock: 3, unit: 'Kg' },
  { name: 'Molho Especial', currentStock: 2, unit: 'Litro' },
  { name: 'Batata Palito', currentStock: 5, unit: 'Kg' },
  { name: 'Alface Americana', currentStock: 25, unit: 'Unidade' }
];

const mockRecipes: Recipe[] = [
  {
    id: 1,
    name: 'Hambúrguer Clássico',
    ingredients: [
      { itemName: 'Pão Brioche', quantity: 1, unit: 'Unidade' },
      { itemName: 'Carne Angus 180g', quantity: 0.18, unit: 'Kg' },
      { itemName: 'Queijo Cheddar', quantity: 0.03, unit: 'Kg' },
      { itemName: 'Molho Especial', quantity: 0.02, unit: 'Litro' }
    ]
  },
  {
    id: 2,
    name: 'Batata Frita Média',
    ingredients: [
      { itemName: 'Batata Palito', quantity: 0.15, unit: 'Kg' }
    ]
  }
];

const mockExits: StockExit[] = [
  {
    id: 1,
    type: 'recipe',
    recipeName: 'Hambúrguer Clássico',
    quantity: 25,
    unit: 'Porções',
    reason: 'Produção para vendas',
    exitType: 'production',
    date: '2025-06-05',
    time: '12:15'
  },
  {
    id: 2,
    type: 'individual',
    itemName: 'Molho Especial',
    quantity: 2,
    unit: 'Litro',
    reason: 'Produto vencido',
    exitType: 'loss',
    date: '2025-06-04',
    time: '18:00'
  }
];

export function StockExits() {
  const [exits, setExits] = useState<StockExit[]>(mockExits);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [exitMode, setExitMode] = useState<'individual' | 'recipe'>('individual');

  const handleSaveExit = (exitData: Omit<StockExit, 'id' | 'date' | 'time'>) => {
    const newExit = {
      ...exitData,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    setExits([newExit, ...exits]);
    setIsDialogOpen(false);
    toast.success('Saída registrada com sucesso!');
  };

  const getExitIcon = (exitType: string) => {
    switch (exitType) {
      case 'production':
        return <TrendingDown className="w-5 h-5 text-blue-600" />;
      case 'loss':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'adjustment':
        return <Minus className="w-5 h-5 text-orange-600" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getExitBadge = (exitType: string) => {
    switch (exitType) {
      case 'production':
        return <Badge className="bg-blue-100 text-blue-800">Produção</Badge>;
      case 'loss':
        return <Badge className="bg-red-100 text-red-800">Perda</Badge>;
      case 'adjustment':
        return <Badge className="bg-orange-100 text-orange-800">Ajuste</Badge>;
      default:
        return <Badge>Saída</Badge>;
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            Controle de Saídas
          </h1>
          <p className="text-muted-foreground">
            Registre saídas individuais ou por receitas (produção)
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
              <TrendingDown className="w-4 h-4 mr-2" />
              Nova Saída
            </Button>
          </DialogTrigger>
          <ExitFormDialog 
            exitMode={exitMode}
            onModeChange={setExitMode}
            onSave={handleSaveExit}
            onCancel={() => setIsDialogOpen(false)}
          />
        </Dialog>
      </div>

      {/* Seletor de modo */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Button
              variant={exitMode === 'individual' ? 'default' : 'outline'}
              onClick={() => setExitMode('individual')}
              className="flex-1"
            >
              <Package className="w-4 h-4 mr-2" />
              Saída Individual
            </Button>
            <Button
              variant={exitMode === 'recipe' ? 'default' : 'outline'}
              onClick={() => setExitMode('recipe')}
              className="flex-1"
            >
              <ChefHat className="w-4 h-4 mr-2" />
              Saída por Receita
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de saídas */}
      <div className="grid gap-4">
        {exits.map((exit) => (
          <Card key={exit.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                    {exit.type === 'recipe' ? (
                      <ChefHat className="w-7 h-7 text-red-600" />
                    ) : (
                      getExitIcon(exit.exitType)
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">
                      {exit.type === 'recipe' ? exit.recipeName : exit.itemName}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>📦 {exit.quantity} {exit.unit}</span>
                      <span>📅 {exit.date} às {exit.time}</span>
                      {exit.type === 'recipe' && (
                        <Badge variant="outline" className="text-xs">
                          Receita
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                      {exit.reason}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  {getExitBadge(exit.exitType)}
                </div>
              </div>
              
              {/* Detalhes da receita */}
              {exit.type === 'recipe' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Ingredientes utilizados:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {mockRecipes.find(r => r.name === exit.recipeName)?.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{ingredient.itemName}</span>
                        <span className="font-medium">
                          {(ingredient.quantity * exit.quantity).toFixed(2)} {ingredient.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {exits.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <TrendingDown className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma saída registrada</h3>
            <p className="text-muted-foreground">
              Comece registrando sua primeira saída de estoque
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface ExitFormDialogProps {
  exitMode: 'individual' | 'recipe';
  onModeChange: (mode: 'individual' | 'recipe') => void;
  onSave: (exit: Omit<StockExit, 'id' | 'date' | 'time'>) => void;
  onCancel: () => void;
}

function ExitFormDialog({ exitMode, onModeChange, onSave, onCancel }: ExitFormDialogProps) {
  const [formData, setFormData] = useState({
    itemName: '',
    recipeName: '',
    quantity: 0,
    unit: '',
    reason: '',
    exitType: 'production' as 'production' | 'loss' | 'adjustment'
  });

  const selectedRecipe = mockRecipes.find(r => r.name === formData.recipeName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (exitMode === 'individual') {
      if (!formData.itemName || formData.quantity <= 0) {
        toast.error('Preencha os campos obrigatórios');
        return;
      }
      const selectedItem = mockStockItems.find(item => item.name === formData.itemName);
      onSave({
        type: 'individual',
        itemName: formData.itemName,
        quantity: formData.quantity,
        unit: selectedItem?.unit || '',
        reason: formData.reason,
        exitType: formData.exitType
      });
    } else {
      if (!formData.recipeName || formData.quantity <= 0) {
        toast.error('Preencha os campos obrigatórios');
        return;
      }
      onSave({
        type: 'recipe',
        recipeName: formData.recipeName,
        quantity: formData.quantity,
        unit: 'Porções',
        reason: formData.reason,
        exitType: 'production'
      });
    }
  };

  const handleItemChange = (itemName: string) => {
    const item = mockStockItems.find(i => i.name === itemName);
    setFormData({
      ...formData,
      itemName,
      unit: item?.unit || ''
    });
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Nova Saída de Estoque</DialogTitle>
        <DialogDescription>
          Registre uma saída individual ou por receita
        </DialogDescription>
      </DialogHeader>
      
      <Tabs value={exitMode} onValueChange={(value) => onModeChange(value as 'individual' | 'recipe')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual">Saída Individual</TabsTrigger>
          <TabsTrigger value="recipe">Saída por Receita</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <TabsContent value="individual" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="exitType">Tipo de Saída *</Label>
              <Select value={formData.exitType} onValueChange={(value: 'production' | 'loss' | 'adjustment') => setFormData({ ...formData, exitType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Produção/Uso Normal</SelectItem>
                  <SelectItem value="loss">Perda/Descarte</SelectItem>
                  <SelectItem value="adjustment">Ajuste de Estoque</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item">Produto *</Label>
                <Select value={formData.itemName} onValueChange={handleItemChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockStockItems.map((item) => (
                      <SelectItem key={item.name} value={item.name}>
                        <div className="flex items-center justify-between w-full">
                          <span>{item.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {item.currentStock} {item.unit}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade *</Label>
                <div className="flex gap-2">
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                    required
                  />
                  {formData.unit && (
                    <div className="flex items-center px-3 border rounded-md bg-muted">
                      <span className="text-sm">{formData.unit}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recipe" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipe">Receita *</Label>
                <Select value={formData.recipeName} onValueChange={(value) => setFormData({ ...formData, recipeName: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a receita" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRecipes.map((recipe) => (
                      <SelectItem key={recipe.id} value={recipe.name}>
                        {recipe.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="portions">Quantidade de Porções *</Label>
                <Input
                  id="portions"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            {selectedRecipe && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Ingredientes que serão descontados:
                </h4>
                <div className="space-y-1 text-sm">
                  {selectedRecipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{ingredient.itemName}</span>
                      <span className="font-medium">
                        {(ingredient.quantity * formData.quantity).toFixed(2)} {ingredient.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo/Observação *</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder={
                exitMode === 'recipe' 
                  ? 'Ex: Produção para vendas do almoço'
                  : formData.exitType === 'loss'
                    ? 'Ex: Produto vencido, contaminação, quebra'
                    : 'Ex: Produção, uso interno, ajuste de inventário'
              }
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              Registrar Saída
            </Button>
          </div>
        </form>
      </Tabs>
    </DialogContent>
  );
}