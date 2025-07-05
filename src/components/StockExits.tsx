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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { 
  TrendingDown, 
  Minus, 
  ChefHat, 
  Package,
  AlertTriangle,
  Calculator,
  Loader2
} from 'lucide-react';
import { useProducts, useStockMovements } from '@/hooks/useFirebaseData';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Mock recipes data - will be replaced with real data later
// Função para buscar receitas do Firebase
const getRecipesFromFirebase = async (organizationId: string) => {
  try {
    const q = query(
      collection(db, 'recipes'),
      where('organizationId', '==', organizationId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao carregar receitas:', error);
    return [];
  }
};

export function StockExits() {
  const { user, organization } = useAuth();
  const { products, loading: productsLoading, refreshProducts } = useProducts();
  const { addMovement, movements, refreshMovements } = useStockMovements();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [exitMode, setExitMode] = useState<'individual' | 'recipe'>('individual');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar receitas do Firebase
  useEffect(() => {
    const loadRecipes = async () => {
      if (organization?.id) {
        const recipesData = await getRecipesFromFirebase(organization.id);
        setRecipes(recipesData);
      }
    };
    loadRecipes();
  }, [organization?.id]);

  const handleSaveExit = async (exitData: any) => {
    if (!organization?.id || !user?.id) {
      toast.error('Erro de autenticação');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (exitData.type === 'individual') {
        // Saída individual
        console.log('Registrando saída individual:', exitData);
        
        // Verificar se o produto existe
        const product = products.find(p => p.id === exitData.productId);
        if (!product) {
          toast.error(`Produto não encontrado com ID: ${exitData.productId}`);
          setIsSubmitting(false);
          return;
        }
        
        const result = await addMovement({
          productId: exitData.productId,
          type: exitData.exitType === 'loss' ? 'loss' : 'exit',
          quantity: exitData.quantity,
          reason: exitData.reason,
          organizationId: organization.id,
          userId: user.id
        });

        if (result.success) {
          toast.success('Saída registrada com sucesso!');
          setIsDialogOpen(false);
          // Atualizar produtos e movimentações
          await Promise.all([refreshProducts(), refreshMovements()]);
        } else {
          console.error('Erro ao registrar saída:', result.error);
          toast.error(`Erro ao registrar saída: ${result.error}`);
        }
      } else {
        // Saída por receita - processar múltiplos ingredientes
        const recipe = recipes.find(r => r.name === exitData.recipeName);
        if (!recipe) {
          toast.error('Receita não encontrada');
          setIsSubmitting(false);
          return;
        }

        // Criar movimentações para cada ingrediente
        const promises = recipe.ingredients.map(ingredient => {
          const product = products.find(p => p.name === ingredient.itemName);
          if (!product) {
            console.warn(`Produto não encontrado para receita: ${ingredient.itemName}`);
            return Promise.resolve({ success: true });
          }

          return addMovement({
            productId: product.id,
            type: 'exit',
            quantity: ingredient.quantity * exitData.quantity,
            reason: `Produção: ${exitData.recipeName} (${exitData.quantity} porções)`,
            organizationId: organization.id,
            userId: user.id
          });
        });

        const results = await Promise.all(promises);
        const failures = results.filter(r => !r.success);

        if (failures.length === 0) {
          toast.success(`Saída por receita registrada! ${recipe.ingredients.length} ingredientes processados.`);
          setIsDialogOpen(false);
          // Atualizar produtos e movimentações
          await Promise.all([refreshProducts(), refreshMovements()]);
        } else {
          toast.error(`Erro ao processar ${failures.length} ingredientes da receita`);
        }
      }
    } catch (error) {
      console.error('Erro inesperado ao registrar saída:', error);
      toast.error('Erro inesperado ao registrar saída');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!organization) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando dados da organização...</p>
          </div>
        </div>
      </div>
    );
  }

  const getExitIcon = (type: string) => {
    switch (type) {
      case 'exit':
        return <TrendingDown className="w-5 h-5 text-blue-600" />;
      case 'loss':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getExitBadge = (type: string) => {
    switch (type) {
      case 'exit':
        return <Badge className="bg-blue-100 text-blue-800">Saída</Badge>;
      case 'loss':
        return <Badge className="bg-red-100 text-red-800">Perda</Badge>;
      default:
        return <Badge>Movimento</Badge>;
    }
  };

  // Filter movements to show only exits and losses
  const exitMovements = movements.filter(m => m.type === 'exit' || m.type === 'loss');

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
            <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700" disabled={isSubmitting}>
              <TrendingDown className="w-4 h-4 mr-2" />
              Nova Saída
            </Button>
          </DialogTrigger>
          <ExitFormDialog 
            products={products}
            productsLoading={productsLoading}
            recipes={recipes}
            exitMode={exitMode}
            onModeChange={setExitMode}
            onSave={handleSaveExit}
            onCancel={() => setIsDialogOpen(false)}
            isSubmitting={isSubmitting}
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
        {exitMovements.map((exit) => {
          const product = products.find(p => p.id === exit.productId);
          return (
            <Card key={exit.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                      {getExitIcon(exit.type)}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">
                        {product?.name || 'Produto não encontrado'}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>📦 {exit.quantity} {product?.unit || 'un'}</span>
                        <span>📅 {exit.createdAt.toLocaleDateString('pt-BR')} às {exit.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-sm text-muted-foreground italic">
                        {exit.reason}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {getExitBadge(exit.type)}
                    {exit.totalCost && (
                      <div className="text-sm text-muted-foreground mt-1">
                        R$ {exit.totalCost.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {exitMovements.length === 0 && (
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
  products: any[];
  productsLoading: boolean;
  recipes: any[];
  exitMode: 'individual' | 'recipe';
  onModeChange: (mode: 'individual' | 'recipe') => void;
  onSave: (exit: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

function ExitFormDialog({ products, productsLoading, recipes, exitMode, onModeChange, onSave, onCancel, isSubmitting }: ExitFormDialogProps) {
  const [formData, setFormData] = useState({
    productId: '',
    recipeName: '',
    quantity: 0,
    reason: '',
    exitType: 'exit' as 'exit' | 'loss'
  });

  const selectedRecipe = recipes.find(r => r.name === formData.recipeName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Submitting exit form data:', formData);
    
    if (exitMode === 'individual') {
      if (!formData.productId || formData.quantity <= 0 || !formData.reason) {
        toast.error('Preencha todos os campos obrigatórios para saída individual');
        return;
      }
      
      onSave({
        type: 'individual',
        productId: formData.productId,
        quantity: formData.quantity,
        reason: formData.reason,
        exitType: formData.exitType
      });
    } else {
      if (!formData.recipeName || formData.quantity <= 0) {
        toast.error('Preencha todos os campos obrigatórios para saída por receita');
        return;
      }
      
      onSave({
        type: 'recipe',
        recipeName: formData.recipeName,
        quantity: formData.quantity,
        reason: formData.reason || `Produção: ${formData.recipeName}`
      });
    }
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
              <Select value={formData.exitType} onValueChange={(value: 'exit' | 'loss') => setFormData({ ...formData, exitType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exit">Saída Normal</SelectItem>
                  <SelectItem value="loss">Perda</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product">Produto *</Label>
                {productsLoading ? (
                  <div className="flex items-center gap-2 p-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Carregando produtos...</span>
                  </div>
                ) : (
                  <Select value={formData.productId} onValueChange={(value) => setFormData({ ...formData, productId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{product.name}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {product.currentStock} {product.unit}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Motivo/Observação *</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder={
                  formData.exitType === 'loss'
                    ? 'Ex: Produto vencido, contaminação, quebra'
                    : 'Ex: Produção, uso interno, venda'
                }
                required
              />
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
              <Alert>
                <Calculator className="w-4 h-4" />
                <AlertDescription>
                  <strong>Ingredientes que serão descontados:</strong>
                  <div className="mt-2 space-y-1 text-sm">
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{ingredient.itemName}</span>
                        <span className="font-medium">
                          {(ingredient.quantity * formData.quantity).toFixed(2)} {ingredient.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="recipeReason">Observação</Label>
              <Textarea
                id="recipeReason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Ex: Produção para vendas do almoço"
                rows={2}
              />
            </div>
          </TabsContent>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Registrando...
                </>
              ) : (
                'Registrar Saída'
              )}
            </Button>
          </div>
        </form>
      </Tabs>
    </DialogContent>
  );
}