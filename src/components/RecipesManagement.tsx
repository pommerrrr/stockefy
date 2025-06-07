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
import { Plus, Search, Edit, Trash2, ChefHat, Calculator } from 'lucide-react';

interface RecipeIngredient {
  itemName: string;
  quantity: number;
  unit: string;
  cost: number;
}

interface Recipe {
  id: number;
  name: string;
  description: string;
  category: string;
  ingredients: RecipeIngredient[];
  totalCost: number;
  servings: number;
  costPerServing: number;
}

// Mock data
const mockRecipes: Recipe[] = [
  {
    id: 1,
    name: 'Hambúrguer Clássico',
    description: 'Hambúrguer tradicional com carne, queijo e molho especial',
    category: 'Hambúrgueres',
    ingredients: [
      { itemName: 'Pão Brioche', quantity: 1, unit: 'Unidade', cost: 1.50 },
      { itemName: 'Carne Angus 180g', quantity: 0.18, unit: 'Kg', cost: 6.30 },
      { itemName: 'Queijo Cheddar', quantity: 0.03, unit: 'Kg', cost: 0.87 },
      { itemName: 'Molho Especial', quantity: 0.02, unit: 'Litro', cost: 0.30 }
    ],
    totalCost: 8.97,
    servings: 1,
    costPerServing: 8.97
  },
  {
    id: 2,
    name: 'Batata Frita Média',
    description: 'Porção média de batata frita crocante',
    category: 'Acompanhamentos',
    ingredients: [
      { itemName: 'Batata Palito', quantity: 0.15, unit: 'Kg', cost: 2.25 }
    ],
    totalCost: 2.25,
    servings: 1,
    costPerServing: 2.25
  }
];

const mockItems = [
  { name: 'Pão Brioche', unit: 'Unidade', cost: 1.50 },
  { name: 'Carne Angus 180g', unit: 'Kg', cost: 35.00 },
  { name: 'Queijo Cheddar', unit: 'Kg', cost: 28.90 },
  { name: 'Molho Especial', unit: 'Litro', cost: 15.00 },
  { name: 'Batata Palito', unit: 'Kg', cost: 15.00 },
  { name: 'Alface Americana', unit: 'Unidade', cost: 2.50 },
  { name: 'Tomate', unit: 'Kg', cost: 8.00 }
];

export function RecipesManagement() {
  const [recipes, setRecipes] = useState<Recipe[]>(mockRecipes);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveRecipe = (recipeData: Omit<Recipe, 'id'>) => {
    if (editingRecipe) {
      setRecipes(recipes.map(recipe => 
        recipe.id === editingRecipe.id ? { ...recipeData, id: editingRecipe.id } : recipe
      ));
    } else {
      const newRecipe = { ...recipeData, id: Date.now() };
      setRecipes([...recipes, newRecipe]);
    }
    setIsDialogOpen(false);
    setEditingRecipe(null);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsDialogOpen(true);
  };

  const handleDeleteRecipe = (id: number) => {
    setRecipes(recipes.filter(recipe => recipe.id !== id));
  };

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
            onSave={handleSaveRecipe}
            onCancel={() => {
              setIsDialogOpen(false);
              setEditingRecipe(null);
            }}
          />
        </Dialog>
      </div>

      {/* Barra de pesquisa */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar receitas por nome ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Grid de receitas */}
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

      {filteredRecipes.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma receita encontrada</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Tente ajustar sua busca' : 'Comece criando sua primeira ficha técnica'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface RecipeFormDialogProps {
  recipe: Recipe | null;
  onSave: (recipe: Omit<Recipe, 'id'>) => void;
  onCancel: () => void;
}

function RecipeFormDialog({ recipe, onSave, onCancel }: RecipeFormDialogProps) {
  const [formData, setFormData] = useState({
    name: recipe?.name || '',
    description: recipe?.description || '',
    category: recipe?.category || '',
    servings: recipe?.servings || 1,
    ingredients: recipe?.ingredients || []
  });

  const [newIngredient, setNewIngredient] = useState({
    itemName: '',
    quantity: 0,
    unit: '',
    cost: 0
  });

  const calculateTotalCost = () => {
    return formData.ingredients.reduce((total, ingredient) => 
      total + (ingredient.quantity * ingredient.cost), 0
    );
  };

  const handleAddIngredient = () => {
    if (newIngredient.itemName && newIngredient.quantity > 0) {
      const item = mockItems.find(i => i.name === newIngredient.itemName);
      if (item) {
        const ingredientCost = (newIngredient.quantity * item.cost);
        setFormData({
          ...formData,
          ingredients: [...formData.ingredients, {
            ...newIngredient,
            unit: item.unit,
            cost: ingredientCost
          }]
        });
        setNewIngredient({ itemName: '', quantity: 0, unit: '', cost: 0 });
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
    const totalCost = calculateTotalCost();
    const costPerServing = totalCost / formData.servings;
    
    onSave({
      ...formData,
      totalCost,
      costPerServing
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
            <Label htmlFor="name">Nome da Receita</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
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
          <Label htmlFor="servings">Número de Porções</Label>
          <Input
            id="servings"
            type="number"
            min="1"
            value={formData.servings}
            onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) || 1 })}
            required
          />
        </div>

        {/* Ingredientes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Ingredientes</h3>
          
          {/* Adicionar ingrediente */}
          <div className="grid grid-cols-4 gap-2 p-4 border rounded-lg bg-gray-50">
            <Select value={newIngredient.itemName} onValueChange={(value) => setNewIngredient({ ...newIngredient, itemName: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Ingrediente" />
              </SelectTrigger>
              <SelectContent>
                {mockItems.map((item) => (
                  <SelectItem key={item.name} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              type="number"
              placeholder="Quantidade"
              min="0"
              step="0.01"
              value={newIngredient.quantity}
              onChange={(e) => setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) || 0 })}
            />
            
            <div className="flex items-center px-3 border rounded-md bg-white">
              <span className="text-sm text-muted-foreground">
                {mockItems.find(i => i.name === newIngredient.itemName)?.unit || 'Un'}
              </span>
            </div>
            
            <Button type="button" onClick={handleAddIngredient}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Lista de ingredientes */}
          <div className="space-y-2">
            {formData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <span className="font-medium">{ingredient.itemName}</span>
                  <span className="text-muted-foreground ml-2">
                    {ingredient.quantity} {ingredient.unit}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    R$ {ingredient.cost.toFixed(2)}
                  </span>
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
            ))}
          </div>

          {/* Resumo de custos */}
          {formData.ingredients.length > 0 && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
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
            </div>
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