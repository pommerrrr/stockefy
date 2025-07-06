import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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

  const loadProducts = async () => {
    if (!organization?.id) return;
    
    console.log('Loading products for organization:', organization.id);
    setLoading(true);
    try {
      const result = await getOrganizationProducts(organization.id);
      console.log('Products loaded:', result);
      
      if (result.success && result.products) {
        setProducts(result.products);
      } else {
        console.error('Failed to load products:', result.error);
        setError(result.error || 'Erro ao carregar produtos');
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

  const loadRecipes = async () => {
    if (!organization?.id) return;
    
    console.log('Loading recipes for organization:', organization.id);
    setLoading(true);
    try {
      const result = await getOrganizationRecipes(organization.id);
      console.log('Recipes loaded:', result);
      
      if (result.success && result.recipes) {
        setRecipes(result.recipes);
      } else {
        console.error('Failed to load recipes:', result.error);
        setError(result.error || 'Erro ao carregar receitas');
      }
    } catch (err) {
      console.error('Exception loading recipes:', err);
      setError('Erro inesperado ao carregar receitas');
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

  const loadSuppliers = async () => {
    if (!organization?.id) return;
    
    console.log('Loading suppliers for organization:', organization.id);
    setLoading(true);
    try {
      const result = await getOrganizationSuppliers(organization.id);
      console.log('Suppliers loaded:', result);
      
      if (result.success && result.suppliers) {
        setSuppliers(result.suppliers);
      } else {
        console.error('Failed to load suppliers:', result.error);
        setError(result.error || 'Erro ao carregar fornecedores');
      }
    } catch (err) {
      console.error('Exception loading suppliers:', err);
      setError('Erro inesperado ao carregar fornecedores');
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