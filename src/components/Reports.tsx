import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateConsumptionReportPDF, generateMovementReportPDF, downloadPDF } from '@/lib/pdfUtils';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  DollarSign,
  Package,
  AlertTriangle,
  ShoppingCart,
  Calculator,
  FileText
} from 'lucide-react';

// Mock data para relatórios
const mockConsumptionData = [
  { item: 'Pão Brioche', consumed: 150, unit: 'Unidades', cost: 225.00, percentage: 25 },
  { item: 'Carne Angus 180g', consumed: 27, unit: 'Kg', cost: 945.00, percentage: 35 },
  { item: 'Queijo Cheddar', consumed: 8, unit: 'Kg', cost: 231.20, percentage: 15 },
  { item: 'Molho Especial', consumed: 5, unit: 'Litros', cost: 75.00, percentage: 8 },
  { item: 'Batata Palito', consumed: 22, unit: 'Kg', cost: 330.00, percentage: 17 }
];

const mockLossData = [
  { item: 'Molho Especial', quantity: 2, unit: 'Litros', reason: 'Vencimento', cost: 30.00, date: '2025-06-04' },
  { item: 'Pão Brioche', quantity: 5, unit: 'Unidades', reason: 'Mofou', cost: 7.50, date: '2025-06-03' },
  { item: 'Queijo Cheddar', quantity: 0.5, unit: 'Kg', reason: 'Contaminação', cost: 14.45, date: '2025-06-02' }
];

const mockMovementSummary = {
  totalEntries: 15,
  totalExits: 48,
  totalLosses: 3,
  totalValueIn: 3250.80,
  totalValueOut: 1806.70,
  totalValueLost: 51.95
};

// Lista de compras inteligente
const mockShoppingList = [
  { 
    item: 'Molho Especial', 
    currentStock: 2, 
    minStock: 10, 
    suggestedQuantity: 20, 
    unit: 'Litros',
    supplier: 'Molhos & Cia',
    estimatedCost: 300.00,
    priority: 'high',
    daysToRunOut: 2
  },
  { 
    item: 'Batata Palito', 
    currentStock: 5, 
    minStock: 20, 
    suggestedQuantity: 30, 
    unit: 'Kg',
    supplier: 'Vegetais Fresh',
    estimatedCost: 450.00,
    priority: 'high',
    daysToRunOut: 3
  },
  { 
    item: 'Queijo Cheddar', 
    currentStock: 3, 
    minStock: 5, 
    suggestedQuantity: 15, 
    unit: 'Kg',
    supplier: 'Laticínios Brasil',
    estimatedCost: 433.50,
    priority: 'medium',
    daysToRunOut: 5
  },
  { 
    item: 'Pão Brioche', 
    currentStock: 85, 
    minStock: 20, 
    suggestedQuantity: 50, 
    unit: 'Unidades',
    supplier: 'Padaria Central',
    estimatedCost: 75.00,
    priority: 'low',
    daysToRunOut: 14
  }
];

export function Reports() {
  const [dateRange, setDateRange] = useState('30');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [demandIncrease, setDemandIncrease] = useState(0);

  const handleExportConsumptionReport = () => {
    const doc = generateConsumptionReportPDF(mockConsumptionData);
    const today = new Date().toISOString().split('T')[0];
    downloadPDF(doc, `relatorio-consumo-${today}.pdf`);
  };

  const handleExportMovementReport = () => {
    const doc = generateMovementReportPDF(mockMovementSummary);
    const today = new Date().toISOString().split('T')[0];
    downloadPDF(doc, `relatorio-movimentacoes-${today}.pdf`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Urgente';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return 'Normal';
    }
  };

  const totalShoppingCost = mockShoppingList.reduce((total, item) => total + item.estimatedCost, 0);

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            Relatórios e Análises
          </h1>
          <p className="text-muted-foreground">
            Insights inteligentes para otimizar sua operação
          </p>
        </div>
        
        <Button onClick={handleExportConsumptionReport} className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatório PDF
        </Button>
      </div>

      {/* Filtros */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex gap-4 items-end">
            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Últimos 7 dias</SelectItem>
                  <SelectItem value="30">Últimos 30 dias</SelectItem>
                  <SelectItem value="90">Últimos 3 meses</SelectItem>
                  <SelectItem value="365">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Data Início</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Data Fim</Label>
                <Input type="date" />
              </div>
            </div>
            
            <Button>
              <BarChart3 className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="consumption">Consumo</TabsTrigger>
          <TabsTrigger value="losses">Perdas</TabsTrigger>
          <TabsTrigger value="movements">Movimentações</TabsTrigger>
          <TabsTrigger value="shopping">Lista de Compras</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Cards de resumo */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-800">Entradas</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">{mockMovementSummary.totalEntries}</div>
                <p className="text-xs text-green-600">
                  R$ {mockMovementSummary.totalValueIn.toLocaleString('pt-BR')}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-800">Saídas</CardTitle>
                <TrendingDown className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{mockMovementSummary.totalExits}</div>
                <p className="text-xs text-blue-600">
                  R$ {mockMovementSummary.totalValueOut.toLocaleString('pt-BR')}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-red-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-800">Perdas</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-900">{mockMovementSummary.totalLosses}</div>
                <p className="text-xs text-red-600">
                  R$ {mockMovementSummary.totalValueLost.toFixed(2)}
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-800">Margem</CardTitle>
                <DollarSign className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">
                  R$ {(mockMovementSummary.totalValueIn - mockMovementSummary.totalValueOut - mockMovementSummary.totalValueLost).toFixed(2)}
                </div>
                <p className="text-xs text-purple-600">
                  Resultado líquido
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de consumo */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Consumo por Categoria (Últimos 30 dias)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockConsumptionData.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{item.item}</span>
                        <span className="text-sm text-muted-foreground">
                          {item.consumed} {item.unit}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all duration-300" 
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        R$ {item.cost.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consumption" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Relatório de Consumo Detalhado
              </CardTitle>
              <CardDescription>
                Análise detalhada do consumo de ingredientes no período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockConsumptionData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-xl bg-gradient-to-r from-gray-50 to-gray-100">
                    <div>
                      <h4 className="font-semibold">{item.item}</h4>
                      <p className="text-sm text-muted-foreground">
                        Consumido: {item.consumed} {item.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg">
                        R$ {item.cost.toFixed(2)}
                      </div>
                      <Badge variant="outline">
                        {item.percentage}% do total
                      </Badge>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Total Consumido:</span>
                    <span className="font-bold text-xl text-indigo-600">
                      R$ {mockConsumptionData.reduce((total, item) => total + item.cost, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="losses" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Relatório de Perdas e Desperdícios
              </CardTitle>
              <CardDescription>
                Análise das perdas registradas no período
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLossData.map((loss, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-red-200 rounded-xl bg-gradient-to-r from-red-50 to-red-100">
                    <div>
                      <h4 className="font-semibold">{loss.item}</h4>
                      <p className="text-sm text-muted-foreground">
                        Quantidade: {loss.quantity} {loss.unit}
                      </p>
                      <p className="text-sm text-red-600">
                        Motivo: {loss.reason}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-red-600">
                        R$ {loss.cost.toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {loss.date}
                      </p>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Total em Perdas:</span>
                    <span className="font-bold text-xl text-red-600">
                      R$ {mockLossData.reduce((total, loss) => total + loss.cost, 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Resumo de Movimentações
              </CardTitle>
              <CardDescription>
                Análise geral das movimentações de estoque
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                  <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {mockMovementSummary.totalEntries}
                  </div>
                  <div className="text-sm text-muted-foreground">Entradas</div>
                  <div className="text-lg font-semibold text-green-600">
                    R$ {mockMovementSummary.totalValueIn.toLocaleString('pt-BR')}
                  </div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <TrendingDown className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {mockMovementSummary.totalExits}
                  </div>
                  <div className="text-sm text-muted-foreground">Saídas</div>
                  <div className="text-lg font-semibold text-blue-600">
                    R$ {mockMovementSummary.totalValueOut.toLocaleString('pt-BR')}
                  </div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
                  <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">
                    {mockMovementSummary.totalLosses}
                  </div>
                  <div className="text-sm text-muted-foreground">Perdas</div>
                  <div className="text-lg font-semibold text-red-600">
                    R$ {mockMovementSummary.totalValueLost.toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <h4 className="font-semibold mb-2">Indicadores de Performance</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Taxa de Perdas:</span>
                    <span className="font-semibold ml-2">
                      {((mockMovementSummary.totalValueLost / mockMovementSummary.totalValueIn) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Giro de Estoque:</span>
                    <span className="font-semibold ml-2">
                      {(mockMovementSummary.totalExits / mockMovementSummary.totalEntries).toFixed(1)}x
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shopping" className="space-y-6">
          {/* Configurações da lista */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Configurações da Lista de Compras
              </CardTitle>
              <CardDescription>
                Ajuste os parâmetros para gerar uma lista de compras otimizada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Data da Próxima Compra</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="demandIncrease">Aumento de Demanda (%)</Label>
                  <Input
                    id="demandIncrease"
                    type="number"
                    min="0"
                    max="100"
                    value={demandIncrease}
                    onChange={(e) => setDemandIncrease(parseInt(e.target.value) || 0)}
                    placeholder="Ex: 20 para 20% mais"
                  />
                </div>
                
                <div className="flex items-end">
                  <Button className="w-full">
                    <Calculator className="w-4 h-4 mr-2" />
                    Recalcular Lista
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de compras */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Lista de Compras Inteligente
                  </CardTitle>
                  <CardDescription>
                    Baseada no consumo histórico e estoque mínimo configurado
                  </CardDescription>
                </div>
                <Button onClick={handleExportMovementReport} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Lista
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockShoppingList.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{item.item}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Atual: {item.currentStock} {item.unit}</span>
                          <span>Mín: {item.minStock} {item.unit}</span>
                          <span>🏪 {item.supplier}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Previsão de acabar em {item.daysToRunOut} dias
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold text-lg">
                          {item.suggestedQuantity} {item.unit}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          R$ {item.estimatedCost.toFixed(2)}
                        </div>
                      </div>
                      <Badge className={getPriorityColor(item.priority)}>
                        {getPriorityLabel(item.priority)}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Custo Total Estimado:</span>
                    <span className="font-bold text-2xl text-indigo-600">
                      R$ {totalShoppingCost.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}