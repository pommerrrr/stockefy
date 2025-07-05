import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAppContext } from '../App';
import { 
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
  ArrowRight
} from 'lucide-react';

// Mock data - em produção viria de uma API
const mockData = {
  totalItems: 45,
  lowStockItems: 8,
  totalValue: 12450.80,
  suppliersCount: 12,
  monthlyGrowth: 12.5,
  recentTransactions: [
    { id: 1, item: 'Pão Brioche', type: 'entrada', quantity: 100, date: '2025-06-05', time: '09:30' },
    { id: 2, item: 'Carne Angus 180g', type: 'saida', quantity: 25, date: '2025-06-05', time: '12:15' },
    { id: 3, item: 'Queijo Cheddar', type: 'entrada', quantity: 50, date: '2025-06-04', time: '14:20' },
    { id: 4, item: 'Molho Especial', type: 'perda', quantity: 2, date: '2025-06-04', time: '18:00' },
  ],
  lowStockAlerts: [
    { item: 'Molho Especial', current: 2, minimum: 10, unit: 'L' },
    { item: 'Batata Palito', current: 5, minimum: 20, unit: 'Kg' },
    { item: 'Embalagem Viagem', current: 15, minimum: 50, unit: 'Un' },
  ]
};

export function Dashboard() {
  const { navigateToEntries, navigateToRecipes, navigateToReports } = useAppContext();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
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

      {/* Cards de estatísticas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Total de Itens
            </CardTitle>
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Package className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.totalItems}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{mockData.monthlyGrowth}% este mês
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Estoque Baixo
            </CardTitle>
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.lowStockItems}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Itens precisam reposição
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor Total
            </CardTitle>
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {mockData.totalValue.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Valor total do estoque
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fornecedores
            </CardTitle>
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.suppliersCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Fornecedores ativos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de estoque baixo */}
      {mockData.lowStockAlerts.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <strong>Atenção!</strong> Você tem {mockData.lowStockAlerts.length} itens com estoque baixo.
                <div className="mt-3 space-y-2">
                  {mockData.lowStockAlerts.map((alert, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded-lg">
                      <span className="font-medium">{alert.item}</span>
                      <Badge variant="destructive" className="text-xs">
                        {alert.current} {alert.unit} / mín: {alert.minimum}
                      </Badge>
                    </div>
                  ))}
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
              {mockData.recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      transaction.type === 'entrada' ? 'bg-green-100' :
                      transaction.type === 'saida' ? 'bg-blue-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'entrada' ? (
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      ) : transaction.type === 'saida' ? (
                        <TrendingDown className="w-5 h-5 text-blue-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.item}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.date} às {transaction.time}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={transaction.type === 'entrada' ? 'default' : 
                             transaction.type === 'saida' ? 'secondary' : 'destructive'}
                  >
                    {transaction.quantity}
                  </Badge>
                </div>
              ))}
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
  );
}