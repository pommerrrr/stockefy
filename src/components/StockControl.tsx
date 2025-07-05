import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Package, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Activity,
  AlertTriangle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useProducts, useStockMovements } from '@/hooks/useFirebaseData';
import { useAuth } from '@/contexts/AuthContext';

export function StockControl() {
  const { organization } = useAuth();
  const { products, loading: productsLoading, refreshProducts } = useProducts();
  const { movements, loading: movementsLoading, refreshMovements } = useStockMovements();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = Array.from(new Set(products.map(item => item.category)));

  const filteredItems = products.filter(item => {
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
      case 'entry':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'exit':
        return <TrendingDown className="w-4 h-4 text-blue-600" />;
      case 'loss':
        return <Minus className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getMovementBadge = (type: string) => {
    switch (type) {
      case 'entry':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Entrada</Badge>;
      case 'exit':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Saída</Badge>;
      case 'loss':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Perda</Badge>;
      default:
        return <Badge>Movimento</Badge>;
    }
  };

  const handleRefresh = async () => {
    await Promise.all([refreshProducts(), refreshMovements()]);
  };
  
  // Carregar dados ao montar o componente
  React.useEffect(() => {
    handleRefresh();
  }, []);

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
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
            Controle de Estoque
          </h1>
          <p className="text-muted-foreground">
            Visualize e acompanhe todos os produtos em estoque
          </p>
        </div>
        
        <Button onClick={handleRefresh} variant="outline" disabled={productsLoading || movementsLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${(productsLoading || movementsLoading) ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      <Tabs defaultValue="inventory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inventory">Inventário Atual</TabsTrigger>
          <TabsTrigger value="movements">Movimentações</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-6">
          {/* Alertas de estoque baixo */}
          {products.filter(p => p.currentStock <= p.minimumStock).length > 0 && (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Atenção!</strong> Você tem {products.filter(p => p.currentStock <= p.minimumStock).length} produtos com estoque baixo.
              </AlertDescription>
            </Alert>
          )}

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

          {/* Loading state */}
          {productsLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="border-0 shadow-lg">
                  <CardContent className="p-4">
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
            /* Grid de produtos */
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => {
                const stockStatus = getStockStatus(item.currentStock, item.minimumStock);
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
                                width: `${Math.min(100, (item.currentStock / (item.minimumStock * 2)) * 100)}%` 
                              }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Mínimo: {item.minimumStock} {item.unit}
                          </div>
                        </div>
                        
                        {/* Info adicional */}
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>💰 R$ {item.costPrice.toFixed(2)}</div>
                          <div>📅 {item.updatedAt.toLocaleDateString('pt-BR')}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {!productsLoading && filteredItems.length === 0 && (
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
              {movementsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border rounded-xl animate-pulse">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                      </div>
                      <div className="w-16 h-6 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {movements.map((movement) => {
                    const product = products.find(p => p.id === movement.productId);
                    
                    if (!product) {
                      console.warn(`Produto não encontrado para movimento: ${movement.productId}`);
                    }
                    
                    return (
                      <div key={movement.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            {getMovementIcon(movement.type)}
                          </div>
                          <div>
                            <h4 className="font-semibold">{product?.name || 'Produto não encontrado'}</h4>
                            <p className="text-sm text-muted-foreground">{movement.reason}</p>
                            {movement.createdAt && (
                              <p className="text-xs text-muted-foreground">
                                {movement.createdAt.toLocaleDateString('pt-BR')} às {movement.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-semibold">
                              {movement.quantity} {product?.unit || 'un'}
                            </div>
                            {movement.totalCost && (
                              <div className="text-sm text-muted-foreground">
                                R$ {movement.totalCost.toFixed(2)}
                              </div>
                            )}
                          </div>
                          {getMovementBadge(movement.type)}
                        </div>
                      </div>
                    );
                  })}
                  
                  {movements.length === 0 && (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Nenhuma movimentação registrada</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}