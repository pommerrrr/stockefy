import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getOrganizationProducts, 
  getStockMovements,
  createProduct,
  createStockMovement,
  updateProductStock
} from '@/lib/firebase';
import type { Product, StockMovement } from '@/lib/firebase';

// Hook para gerenciar produtos
export const useProducts = () => {
  const { organization } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    if (!organization?.id) return;
    
    setLoading(true);
    try {
      const result = await getOrganizationProducts(organization.id);
      if (result.success && result.products) {
        setProducts(result.products);
      } else {
        setError(result.error || 'Erro ao carregar produtos');
      }
    } catch (err) {
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
    
    setLoading(true);
    try {
      const result = await getStockMovements(organization.id);
      if (result.success && result.movements) {
        setMovements(result.movements);
      } else {
        setError(result.error || 'Erro ao carregar movimentações');
      }
    } catch (err) {
      setError('Erro inesperado ao carregar movimentações');
    } finally {
      setLoading(false);
    }
  };

  const addMovement = async (movementData: Omit<StockMovement, 'id' | 'createdAt'>) => {
    if (!organization?.id || !user?.id) return { success: false, error: 'Dados de autenticação não encontrados' };

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
        return { success: true };
      } else {
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
  const { products } = useProducts();
  const { movements } = useStockMovements();

  const stats = {
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
  };

  return stats;
};