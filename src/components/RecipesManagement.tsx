import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { checkFirebaseIndexes } from '@/lib/firebase';
import { 
  getOrganizationProducts, 
  getStockMovements,
  getOrganizationRecipes,
  getOrganizationSuppliers,
  createProduct,
  createStockMovement,
  updateProductStock
} from '@/lib/firebase';
import type { Product, StockMovement, Recipe, Supplier } from '@/lib/firebase';

// Hook para gerenciar produtos
export const useProducts = () => {
  const { organization } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data para demonstração
  const mockProducts: Product[] = [
    {
      id: '1',
      organizationId: organization?.id || 'demo',
      name: 'MILHO CRUNCH',
      category: 'Condimentos',
      unit: 'Kg',
      currentStock: 10,
      minimumStock: 5,
      costPrice: 70,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      organizationId: organization?.id || 'demo',
      name: 'Pão Brioche',
      category: 'Pães',
      unit: 'Unidade',
      currentStock: 50,
      minimumStock: 20,
      costPrice: 1.5,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const loadProducts = async () => {
    if (!organization?.id) return;
    
    // Verificar índices antes de fazer consultas
    const indexesOK = await checkFirebaseIndexes(organization.id);
    if (!indexesOK) {
      setLoading(false);
      return; // Para aqui se índices estão faltando
    }
    
    console.log('Loading products for organization:', organization.id);
    setLoading(true);
    try {
      // Verificar se Firebase está configurado
      if (!organization.id.startsWith('demo')) {
        const result = await getOrganizationProducts(organization.id);
        if (result.success && result.products) {
          setProducts(result.products);
        } else {
          console.error('Failed to load products:', result.error);
          setError(result.error || 'Erro ao carregar produtos');
        }
      } else {
        console.log('Using mock products for demo');
        setProducts(mockProducts);
      }
    } catch (err) {
      console.error('Exception loading products:', err);
      setError('Erro inesperado ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!organization?.id) return { success: false, error: 'Organização não encontrada' };

    console.log('Adding product with organization ID:', organization.id);
    console.log('Product data:', productData);

    try {
      const result = await createProduct({
        ...productData,
        organizationId: organization.id
      });
      
      console.log('Create product result:', result);
      
      if (result.success && result.product) {
        setProducts(prev => [...prev, result.product!]);
        return { success: true, product: result.product };
      } else {
        console.error('Failed to create product:', result.error);
        return { success: false, error: result.error || 'Erro ao criar produto' };
      }
    } catch (err) {
      console.error('Exception creating product:', err);
      return { success: false, error: 'Erro ao criar produto' };
    }
  };

  useEffect(() => {
    loadProducts();
  }, [organization?.id]);

  return {
    products,
    loading,
    error,
    addProduct,
    refreshProducts: loadProducts
  };
};

// Hook para gerenciar movimentações de estoque
export const useStockMovements = () => {
  const { organization, user } = useAuth();
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMovements = async () => {
    if (!organization?.id) return;
    
    // Verificar índices antes de fazer consultas
    const indexesOK = await checkFirebaseIndexes(organization.id);
    if (!indexesOK) {
      setLoading(false);
      return; // Para aqui se índices estão faltando
    }
    
    console.log('Loading movements for organization:', organization.id);
    setLoading(true);
    try {
      const result = await getStockMovements(organization.id);
      console.log('Movements loaded:', result);
      
      if (result.success && result.movements) {
        setMovements(result.movements);
      } else {
        console.error('Failed to load movements:', result.error);
        setError(result.error || 'Erro ao carregar movimentações');
      }
    } catch (err) {
      console.error('Exception loading movements:', err);
      setError('Erro inesperado ao carregar movimentações');
    } finally {
      setLoading(false);
    }
  };

  const addMovement = async (movementData: Omit<StockMovement, 'id' | 'createdAt'>) => {
    if (!organization?.id || !user?.id) return { success: false, error: 'Dados de autenticação não encontrados' };

    console.log('Adding movement with data:', movementData);
    
    // Validação para garantir que productId está definido
    if (!movementData.productId) {
      console.error('Erro: productId não definido', movementData);
      return { success: false, error: 'ID do produto não definido' };
    }

    try {
      const result = await createStockMovement({
        ...movementData,
        organizationId: organization.id,
        userId: user.id
      });
      
      if (result.success && result.movement) {
        setMovements(prev => [result.movement!, ...prev]);
        
        // A atualização do produto é feita automaticamente no Firebase
        
        return { success: true };
      } else {
        console.error('Failed to create movement:', result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('Erro ao criar movimentação:', err);
      return { success: false, error: 'Erro ao criar movimentação' };
    }
  };

  useEffect(() => {
    loadMovements();
  }, [organization?.id]);

  return {
    movements,
    loading,
    error,
    addMovement,
    refreshMovements: loadMovements
  };
};

// Hook para estatísticas do dashboard
export const useDashboardStats = () => {
  const { products, loading: productsLoading } = useProducts();
  const { movements, loading: movementsLoading } = useStockMovements();
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    totalValue: 0,
    recentMovements: [] as any[],
    lowStockAlerts: [] as any[]
  });
  
  // Atualizar estatísticas quando os dados mudarem
  React.useEffect(() => {
    if (!productsLoading && !movementsLoading) {
      setStats({
        totalItems: products.length,
        lowStockItems: products.filter(p => p.currentStock <= p.minimumStock).length,
        totalValue: products.reduce((sum, p) => sum + (p.currentStock * p.costPrice), 0),
        recentMovements: movements.slice(0, 5),
        lowStockAlerts: products
          .filter(p => p.currentStock <= p.minimumStock)
          .map(p => ({
            item: p.name,
            current: p.currentStock,
            minimum: p.minimumStock,
            unit: p.unit
          }))
      });
    }
  }, [products, movements, productsLoading, movementsLoading]);

  return { ...stats, loading: productsLoading || movementsLoading };
};

// Hook para gerenciar receitas
export const useRecipes = () => {
  const { organization } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data para demonstração
  const mockRecipes: Recipe[] = [
    {
      id: '1',
      organizationId: organization?.id || 'demo',
      name: 'Hambúrguer Clássico',
      description: 'Hambúrguer tradicional com queijo e salada',
      category: 'Sanduíches',
      ingredients: [
        {
          productId: '1',
          itemName: 'Pão Brioche',
          quantity: 1,
          unit: 'Unidade',
          cost: 1.20
        },
        {
          productId: '2',
          itemName: 'Hambúrguer',
          quantity: 180,
          unit: 'g',
          cost: 1.50
        },
        {
          productId: '3',
          itemName: 'Queijo Cheddar',
          quantity: 1,
          unit: 'Fatia',
          cost: 1.20
        }
      ],
      totalCost: 4.20,
      servings: 1,
      costPerServing: 4.20,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const loadRecipes = async () => {
    if (!organization?.id) return;
    
    console.log('Loading recipes for organization:', organization.id);
    setLoading(true);
    try {
      // Verificar se Firebase está configurado corretamente
      try {
        // Tentar carregar do Firebase
        const result = await getOrganizationRecipes(organization.id);
        console.log('Recipes loaded:', result);
        
        if (result.success && result.recipes) {
          setRecipes(result.recipes);
        } else {
          console.warn('Failed to load recipes from Firebase, using mock data:', result.error);
          setRecipes(mockRecipes);
        }
      } catch (firebaseError) {
        // Se falhar, usar dados mock
        console.warn('Error loading recipes from Firebase, using mock data:', firebaseError);
        setRecipes(mockRecipes);
      }
    } catch (err) {
      console.error('Exception loading recipes, using mock data:', err);
      setRecipes(mockRecipes);
      setError('Erro ao carregar receitas. Usando dados de demonstração.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, [organization?.id]);

  return {
    recipes,
    loading,
    error,
    refreshRecipes: loadRecipes
  };
};

// Hook para gerenciar fornecedores
export const useSuppliers = () => {
  const { organization } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data para demonstração
  const mockSuppliers: Supplier[] = [
    {
      id: '1',
      organizationId: organization?.id || 'demo',
      name: 'Fornecedor Demo',
      cnpj: '12.345.678/0001-90',
      phone: '(11) 99999-9999',
      email: 'contato@fornecedor.com',
      address: 'Rua Demo, 123 - São Paulo, SP',
      products: ['Pão', 'Carne', 'Queijo'],
      status: 'active' as const,
      notes: 'Fornecedor de demonstração',
      lastOrder: '2025-01-01',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const loadSuppliers = async () => {
    if (!organization?.id) return;
    
    console.log('Loading suppliers for organization:', organization.id);
    setLoading(true);
    try {
      // Verificar se Firebase está configurado
      if (!organization.id.startsWith('demo')) {
        const result = await getOrganizationSuppliers(organization.id);
        console.log('Suppliers loaded:', result);
        
        if (result.success && result.suppliers) {
          setSuppliers(result.suppliers);
        } else {
          console.error('Failed to load suppliers, using mock data:', result.error);
          setSuppliers(mockSuppliers);
        }
      } else {
        // Usar dados mock para demonstração
        console.log('Using mock suppliers for demo');
        setSuppliers(mockSuppliers);
      }
    } catch (err) {
      console.error('Exception loading suppliers, using mock data:', err);
      setSuppliers(mockSuppliers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, [organization?.id]);

  return {
    suppliers,
    loading,
    error,
    refreshSuppliers: loadSuppliers
  };
};

// RecipesManagement Component
export function RecipesManagement() {
  const { recipes, loading, error } = useRecipes();

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Receitas</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Nova Receita
        </button>
      </div>

      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">{recipe.name}</h3>
              {recipe.description && (
                <p className="text-gray-600 text-sm mb-3">{recipe.description}</p>
              )}
              {recipe.category && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-3">
                  {recipe.category}
                </span>
              )}
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-500">Ingredientes:</p>
                <ul className="text-sm space-y-1">
                  {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                    <li key={index} className="flex justify-between">
                      <span>{ingredient.itemName}</span>
                      <span>{ingredient.quantity} {ingredient.unit}</span>
                    </li>
                  ))}
                  {recipe.ingredients.length > 3 && (
                    <li className="text-gray-400">
                      +{recipe.ingredients.length - 3} mais...
                    </li>
                  )}
                </ul>
              </div>
              
              <div className="flex justify-between items-center pt-3 border-t">
                <div>
                  <p className="text-sm text-gray-500">Custo por porção</p>
                  <p className="font-semibold text-green-600">
                    R$ {recipe.costPerServing.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Porções</p>
                  <p className="font-semibold">{recipe.servings}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Nenhuma receita cadastrada</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Criar primeira receita
          </button>
        </div>
      )}
    </div>
  );
}