import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAppContext } from '../App';
import { useDashboardStats } from '@/hooks/useFirebaseData';
import { 
  Loader2,
  Package, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  DollarSign,
  ShoppingCart,
  Users,
  Activity,
  Plus,
  ChefHat,
  FileText,
  Zap,
  ArrowRight,
} from 'lucide-react';

export function Dashboard() {
  const { navigateToEntries, navigateToRecipes, navigateToReports } = useAppContext();
  const { loading, ...stats } = useDashboardStats();
  
  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Carregando estatísticas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">
              Dashboard
            </h1>
            <p className="page-description">
              Visão geral inteligente do seu estoque e operações
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={navigateToEntries}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Entrada
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Cards de estatísticas */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Itens
              </CardTitle>
              <div className="stats-card-icon bg-primary">
                <Package className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="stats-card-value">{stats.totalItems}</div>
              <p className="stats-card-label flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Produtos cadastrados
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Estoque Baixo
              </CardTitle>
              <div className="stats-card-icon bg-orange-500">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="stats-card-value">{stats.lowStockItems}</div>
              <p className="stats-card-label">
                Itens precisam reposição
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Valor Total
              </CardTitle>
              <div className="stats-card-icon bg-green-500">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="stats-card-value">R$ {stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              <p className="stats-card-label">
                Valor total do estoque
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Movimentações
              </CardTitle>
              <div className="stats-card-icon bg-purple-500">
                <Activity className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="stats-card-value">{stats.recentMovements.length}</div>
              <p className="stats-card-label">
                Últimas atividades
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alertas de estoque baixo */}
        {stats.lowStockAlerts.length > 0 && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <strong>Atenção!</strong> Você tem {stats.lowStockAlerts.length} itens com estoque baixo.
                  <div className="mt-3 space-y-2">
                    {stats.lowStockAlerts.slice(0, 3).map((alert, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-2 rounded-lg">
                        <span className="font-medium">{alert.item}</span>
                        <Badge variant="destructive" className="text-xs">
                          {alert.current} {alert.unit} / mín: {alert.minimum}
                        </Badge>
                      </div>
                    ))}
                    {stats.lowStockAlerts.length > 3 && (
                      <p className="text-xs text-orange-600">
                        +{stats.lowStockAlerts.length - 3} outros itens
                      </p>
                    )}
                  </div>
                </div>
                <Button onClick={navigateToReports} className="ml-4" variant="outline">
                  Ver Lista de Compras
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Seção principal */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Atividade recente */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Movimentações Recentes
              </CardTitle>
              <CardDescription>
                Últimas atividades do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentMovements.length > 0 ? (
                  stats.recentMovements.map((movement) => (
                    <div key={movement.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          movement.type === 'entry' ? 'bg-green-100' :
                          movement.type === 'exit' ? 'bg-blue-100' : 'bg-red-100'
                        }`}>
                          {movement.type === 'entry' ? (
                            <TrendingUp className="w-5 h-5 text-green-600" />
                          ) : movement.type === 'exit' ? (
                      {movement && (
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          movement.type === 'entry' ? 'bg-green-100' :
                          movement.type === 'exit' ? 'bg-blue-100' : 'bg-red-100'
                        }`}>
                          {movement.type === 'entry' ? (
                            <TrendingUp className="w-5 h-5 text-green-600" />
                          ) : movement.type === 'exit' ? (
                            <TrendingDown className="w-5 h-5 text-blue-600" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                      )}
                      <Badge 
                        <p className="font-medium">Produto ID: {movement?.productId || 'N/A'}</p>
                        {movement?.createdAt && (
                          <p className="text-sm text-muted-foreground">
                            {movement.createdAt.toLocaleDateString('pt-BR')} às {movement.createdAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhuma movimentação recente</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ações rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Ações Rápidas
              </CardTitle>
              <CardDescription>
                Acesso direto às principais funções
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={navigateToEntries}
                className="w-full justify-start h-auto p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">Registrar Entrada</div>
                    <div className="text-xs opacity-90">Adicionar mercadorias ao estoque</div>
                  </div>
                </div>
              </Button>
              
              <Button 
                onClick={navigateToRecipes}
                className="w-full justify-start h-auto p-4"
                variant="outline"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">Nova Receita</div>
                    <div className="text-xs opacity-90">Criar ficha técnica de produto</div>
                  </div>
                </div>
              </Button>
              
              <Button 
                onClick={navigateToReports}
                className="w-full justify-start h-auto p-4"
                variant="outline"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">Gerar Relatório</div>
                    <div className="text-xs opacity-90">Analisar consumo e custos</div>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}