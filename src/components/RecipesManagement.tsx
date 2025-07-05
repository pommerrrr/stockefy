import { useState, useEffect } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Plus, Search, Edit, Trash2, ChefHat, Calculator, Loader2 } from 'lucide-react';
import { useProducts } from '@/hooks/useFirebaseData';
import { useAuth } from '@/contexts/AuthContext';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface RecipeIngredient {
  productId: string;
  itemName: string;
  quantity: number;
  unit: string;
  cost: number;
}

interface Recipe {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  category: string;
  ingredients: RecipeIngredient[];
  totalCost: number;
  servings: number;
  costPerServing: number;
  createdAt: Date;
  updatedAt: Date;
}

// Categorias predefinidas para receitas - AGORA SERÃO USADAS PARA FILTROS E ORGANIZAÇÃO
const recipeCategories = [
  'Hambúrgueres',
  'Acompanhamentos', 
  'Bebidas',
  'Sobremesas',
  'Pratos Principais',
  'Entradas',
  'Lanches',
  'Pizzas',
  'Massas',
  'Saladas',
  'Outros'
];

export function RecipesManagement() {
  const { organization, user } = useAuth();
  const { products, loading: productsLoading } = useProducts();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  // Carregar receitas do Firebase
  const loadRecipes = async () => {
    if (!organization?.id) return;
    
    setLoading(true);
    try {
      const q = query(
        collection(db, 'recipes'),
        where('organizationId', '==', organization.id),
        orderBy('name')
      );
      
      const querySnapshot = await getDocs(q);
      const recipesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      })) as Recipe[];
      
      setRecipes(recipesData);
    } catch (error) {
      console.error('Erro ao carregar receitas:', error);
      toast.error('Erro ao carregar receitas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, [organization?.id]);

  // Filtrar receitas por busca e categoria
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || recipe.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSaveRecipe = async (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!organization?.id || !user?.id) {
      toast.error('Erro de autenticação');
      return;
    }

    try {
      if (editingRecipe) {
        // Atualizar receita existente
        const recipeRef = doc(db, 'recipes', editingRecipe.id);
        await updateDoc(recipeRef, {
          ...recipeData,
          updatedAt: new Date()
        });
        
        setRecipes(recipes.map(recipe => 
          recipe.id === editingRecipe.id 
            ? { ...recipeData, id: editingRecipe.id, createdAt: editingRecipe.createdAt, updatedAt: new Date() }
            : recipe
        ));
        toast.success('Receita atualizada com sucesso!');
      } else {
        // Criar nova receita
        const newRecipeData = {
          ...recipeData,
          organizationId: organization.id,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const docRef = await addDoc(collection(db, 'recipes'), newRecipeData);
        
        const newRecipe = {
          id: docRef.id,
          ...newRecipeData
        };
        
        setRecipes([...recipes, newRecipe]);
        toast.success('Receita criada com sucesso!');
      }
      
      setIsDialogOpen(false);
      setEditingRecipe(null);
    } catch (error) {
      console.error('Erro ao salvar receita:', error);
      toast.error('Erro ao salvar receita');
    }
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsDialogOpen(true);
  };

  const handleDeleteRecipe = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'recipes', id));
      setRecipes(recipes.filter(recipe => recipe.id !== id));
      toast.success('Receita excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir receita:', error);
      toast.error('Erro ao excluir receita');
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

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
            Fichas Técnicas
          </h1>
          <p className="text-muted-foreground">
            Gerencie as receitas e calcule custos de produção automaticamente
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setEditingRecipe(null)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Receita
            </Button>
          </DialogTrigger>
          <RecipeFormDialog 
            recipe={editingRecipe} 
            products={products}
            productsLoading={productsLoading}
            onSave={handleSaveRecipe}
            onCancel={() => {
              setIsDialogOpen(false);
              setEditingRecipe(null);
            }}
          />
        </Dialog>
      </div>

      {/* Barra de pesquisa e filtros */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar receitas por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filtro por categoria */}
            <div className="flex gap-2">
              <Button
                variant={categoryFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setCategoryFilter('all')}
                size="sm"
              >
                Todas
              </Button>
              {recipeCategories.slice(0, 4).map((category) => (
                <Button
                  key={category}
                  variant={categoryFilter === category ? 'default' : 'outline'}
                  onClick={() => setCategoryFilter(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Mais..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {recipeCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading state */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-3 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-2 bg-gray-200 rounded w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Grid de receitas */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                      <ChefHat className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditRecipe(recipe)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteRecipe(recipe.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Título e categoria */}
                  <div>
                    <h3 className="text-lg font-semibold leading-tight">{recipe.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{recipe.description}</p>
                    <Badge variant="outline" className="mt-2">{recipe.category}</Badge>
                  </div>
                  
                  {/* Ingredientes */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Ingredientes:</h4>
                    <div className="space-y-1">
                      {recipe.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex justify-between text-xs bg-gray-50 p-2 rounded">
                          <span className="truncate">{ingredient.itemName}</span>
                          <span className="font-medium whitespace-nowrap ml-2">
                            {ingredient.quantity} {ingredient.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Custo */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Custo por porção</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-600">
                          R$ {recipe.costPerServing.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Total: R$ {recipe.totalCost.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredRecipes.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma receita encontrada</h3>
            <p className="text-muted-foreground">
              {searchTerm || categoryFilter !== 'all' ? 'Tente ajustar sua busca ou filtros' : 'Comece criando sua primeira ficha técnica'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface RecipeFormDialogProps {
  recipe: Recipe | null;
  products: any[];
  productsLoading: boolean;
  onSave: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

function RecipeFormDialog({ recipe, products, productsLoading, onSave, onCancel }: RecipeFormDialogProps) {
  const [formData, setFormData] = useState({
    name: recipe?.name || '',
    description: recipe?.description || '',
    category: recipe?.category || '',
    servings: recipe?.servings || 1,
    ingredients: recipe?.ingredients || []
  });

  const [newIngredient, setNewIngredient] = useState({
    productId: '',
    itemName: '',
    quantity: 0,
    unit: '',
    cost: 0
  });

  const calculateTotalCost = () => {
    return formData.ingredients.reduce((total, ingredient) => 
      total + ingredient.cost, 0
    );
  };

  const handleAddIngredient = () => {
    if (newIngredient.productId && newIngredient.quantity > 0) {
      const product = products.find(p => p.id === newIngredient.productId);
      if (product) {
        const ingredientCost = (newIngredient.quantity * product.costPrice);
        setFormData({
          ...formData,
          ingredients: [...formData.ingredients, {
            productId: newIngredient.productId,
            itemName: product.name,
            quantity: newIngredient.quantity,
            unit: product.unit,
            cost: ingredientCost
          }]
        });
        setNewIngredient({ productId: '', itemName: '', quantity: 0, unit: '', cost: 0 });
      }
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || formData.ingredients.length === 0) {
      toast.error('Preencha todos os campos obrigatórios e adicione pelo menos um ingrediente');
      return;
    }
    
    const totalCost = calculateTotalCost();
    const costPerServing = totalCost / formData.servings;
    
    onSave({
      ...formData,
      totalCost,
      costPerServing,
      organizationId: '' // Será preenchido no componente pai
    });
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {recipe ? 'Editar Receita' : 'Nova Receita'}
        </DialogTitle>
        <DialogDescription>
          Crie a ficha técnica com ingredientes e quantidades
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Receita *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {recipeCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="servings">Número de Porções *</Label>
          <Input
            id="servings"
            type="number"
            min="1"
            value={formData.servings}
            onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) || 1 })}
            required
          />
        </div>

        {/* Ingredientes - LAYOUT CORRIGIDO */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Ingredientes</h3>
          
          {/* Adicionar ingrediente - Layout melhorado */}
          <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
            {productsLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Carregando produtos...</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Ingrediente *</Label>
                    <Select value={newIngredient.productId} onValueChange={(value) => {
                      const product = products.find(p => p.id === value);
                      setNewIngredient({ 
                        ...newIngredient, 
                        productId: value,
                        itemName: product?.name || '',
                        unit: product?.unit || ''
                      });
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o ingrediente" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Quantidade *</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      step="0.01"
                      value={newIngredient.quantity}
                      onChange={(e) => setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Unidade</Label>
                    <div className="flex items-center px-3 py-2 border rounded-md bg-white">
                      <span className="text-sm text-muted-foreground">
                        {newIngredient.unit || 'Selecione um produto'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={handleAddIngredient} 
                    disabled={!newIngredient.productId || newIngredient.quantity <= 0}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Lista de ingredientes - Layout melhorado para evitar sobreposição */}
          <div className="space-y-2">
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="min-w-0">
                    <span className="font-medium text-sm block truncate">{ingredient.itemName}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-sm text-muted-foreground">
                      {ingredient.quantity} {ingredient.unit}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-green-600">
                      R$ {ingredient.cost.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoveIngredient(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumo de custos */}
          {formData.ingredients.length > 0 && (
            <Alert>
              <Calculator className="w-4 h-4" />
              <AlertDescription>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Custo Total:</span>
                  <span className="text-lg font-bold text-purple-600">
                    R$ {calculateTotalCost().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-muted-foreground">Custo por Porção:</span>
                  <span className="font-medium text-purple-600">
                    R$ {(calculateTotalCost() / formData.servings).toFixed(2)}
                  </span>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={formData.ingredients.length === 0}>
            {recipe ? 'Salvar Alterações' : 'Criar Receita'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}