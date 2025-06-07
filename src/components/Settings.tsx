import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Calculator, 
  TrendingUp, 
  AlertTriangle,
  Mail,
  Clock,
  Info,
  Zap,
  Link,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';

interface StockSettings {
  autoCalculateMinStock: boolean;
  manualMinStockDays: number;
  demandCalculationPeriod: number;
  safetyMargin: number;
  enableEmailAlerts: boolean;
  alertEmail: string;
  lowStockThreshold: number;
  criticalStockThreshold: number;
  checkFrequency: 'daily' | 'weekly' | 'manual';
}

interface NotificationSettings {
  enablePushNotifications: boolean;
  enableEmailNotifications: boolean;
  alertOnLowStock: boolean;
  alertOnCriticalStock: boolean;
  alertOnExpiration: boolean;
  alertOnNegativeStock: boolean;
}

interface APIIntegration {
  enabled: boolean;
  connected: boolean;
  lastSync?: string;
  totalOrders?: number;
}

interface ExternalIntegrations {
  ifood: APIIntegration & {
    merchantId: string;
    apiKey: string;
  };
  cardapioweb: APIIntegration & {
    storeId: string;
    apiKey: string;
  };
}

export function Settings() {
  const [stockSettings, setStockSettings] = useState<StockSettings>({
    autoCalculateMinStock: true,
    manualMinStockDays: 7,
    demandCalculationPeriod: 30,
    safetyMargin: 20,
    enableEmailAlerts: true,
    alertEmail: 'gerente@stockely.com',
    lowStockThreshold: 20,
    criticalStockThreshold: 5,
    checkFrequency: 'daily'
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enablePushNotifications: true,
    enableEmailNotifications: true,
    alertOnLowStock: true,
    alertOnCriticalStock: true,
    alertOnExpiration: true,
    alertOnNegativeStock: true
  });

  const [integrations, setIntegrations] = useState<ExternalIntegrations>({
    ifood: {
      enabled: false,
      connected: false,
      merchantId: '',
      apiKey: '',
      lastSync: '2025-06-05 14:30',
      totalOrders: 1247
    },
    cardapioweb: {
      enabled: false,
      connected: false,
      storeId: '',
      apiKey: '',
      lastSync: '2025-06-05 15:15',
      totalOrders: 856
    }
  });

  const handleSaveSettings = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  const handleTestCalculation = () => {
    toast.success('Teste realizado! Novos níveis mínimos calculados para 15 produtos.');
  };

  const handleConnectAPI = async (platform: 'ifood' | 'cardapioweb') => {
    try {
      // Simular conexão com API
      setIntegrations(prev => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          connected: true,
          lastSync: new Date().toLocaleString('pt-BR')
        }
      }));
      toast.success(`Conexão com ${platform === 'ifood' ? 'iFood' : 'CardápioWeb'} estabelecida com sucesso!`);
    } catch (error) {
      toast.error('Erro ao conectar com a API. Verifique suas credenciais.');
    }
  };

  const handleDisconnectAPI = (platform: 'ifood' | 'cardapioweb') => {
    setIntegrations(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        connected: false,
        enabled: false
      }
    }));
    toast.success(`Desconectado do ${platform === 'ifood' ? 'iFood' : 'CardápioWeb'}`);
  };

  const handleSyncAPI = async (platform: 'ifood' | 'cardapioweb') => {
    try {
      // Simular sincronização
      setIntegrations(prev => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          lastSync: new Date().toLocaleString('pt-BR')
        }
      }));
      toast.success(`Sincronização com ${platform === 'ifood' ? 'iFood' : 'CardápioWeb'} concluída!`);
    } catch (error) {
      toast.error('Erro durante a sincronização.');
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-700 to-gray-600 bg-clip-text text-transparent">
          Configurações do Sistema
        </h1>
        <p className="text-muted-foreground">
          Personalize o Stockely de acordo com suas necessidades
        </p>
      </div>

      <Tabs defaultValue="stock" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stock">Estoque</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="integrations">Integrações</TabsTrigger>
          <TabsTrigger value="account">Conta</TabsTrigger>
        </TabsList>

        <TabsContent value="stock" className="space-y-6">
          {/* Configurações de Estoque */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-500" />
                Gestão de Estoque Mínimo
              </CardTitle>
              <CardDescription>
                Configure como o sistema deve calcular e gerenciar os níveis mínimos de estoque
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Modo de cálculo */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Cálculo Automático</Label>
                    <p className="text-sm text-muted-foreground">
                      O sistema calcula automaticamente o estoque mínimo baseado na demanda histórica
                    </p>
                  </div>
                  <Switch 
                    checked={stockSettings.autoCalculateMinStock}
                    onCheckedChange={(checked) => 
                      setStockSettings({ ...stockSettings, autoCalculateMinStock: checked })
                    }
                  />
                </div>

                {stockSettings.autoCalculateMinStock ? (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        O sistema analisará o histórico de saídas e calculará automaticamente os níveis mínimos ideais para cada produto.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="demandPeriod">Período de Análise (dias)</Label>
                        <Input
                          id="demandPeriod"
                          type="number"
                          min="7"
                          max="365"
                          value={stockSettings.demandCalculationPeriod}
                          onChange={(e) => setStockSettings({ 
                            ...stockSettings, 
                            demandCalculationPeriod: parseInt(e.target.value) || 30 
                          })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Quantos dias de histórico usar para calcular a demanda média
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="safetyMargin">Margem de Segurança (%)</Label>
                        <Input
                          id="safetyMargin"
                          type="number"
                          min="0"
                          max="100"
                          value={stockSettings.safetyMargin}
                          onChange={(e) => setStockSettings({ 
                            ...stockSettings, 
                            safetyMargin: parseInt(e.target.value) || 20 
                          })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Margem extra para cobrir variações na demanda
                        </p>
                      </div>
                    </div>

                    <Button onClick={handleTestCalculation} variant="outline" className="w-full">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Testar Cálculo Automático
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="manualDays">Estoque para Quantos Dias</Label>
                      <Input
                        id="manualDays"
                        type="number"
                        min="1"
                        max="30"
                        value={stockSettings.manualMinStockDays}
                        onChange={(e) => setStockSettings({ 
                          ...stockSettings, 
                          manualMinStockDays: parseInt(e.target.value) || 7 
                        })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Definir estoque mínimo baseado no consumo médio para X dias
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Configurações de alerta */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Níveis de Alerta</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lowStock">Estoque Baixo (%)</Label>
                    <Input
                      id="lowStock"
                      type="number"
                      min="0"
                      max="100"
                      value={stockSettings.lowStockThreshold}
                      onChange={(e) => setStockSettings({ 
                        ...stockSettings, 
                        lowStockThreshold: parseInt(e.target.value) || 20 
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Alertar quando o estoque atingir este % do mínimo
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="criticalStock">Estoque Crítico (%)</Label>
                    <Input
                      id="criticalStock"
                      type="number"
                      min="0"
                      max="100"
                      value={stockSettings.criticalStockThreshold}
                      onChange={(e) => setStockSettings({ 
                        ...stockSettings, 
                        criticalStockThreshold: parseInt(e.target.value) || 5 
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Alertar urgentemente quando atingir este % do mínimo
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          {/* Configurações de Notificação */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-500" />
                Notificações e Alertas
              </CardTitle>
              <CardDescription>
                Configure como e quando você deseja receber alertas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tipos de notificação */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Canais de Notificação</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Notificações Push</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba notificações diretamente no navegador
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.enablePushNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({ ...notificationSettings, enablePushNotifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Notificações por E-mail</Label>
                      <p className="text-sm text-muted-foreground">
                        Receba alertas importantes por e-mail
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.enableEmailNotifications}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({ ...notificationSettings, enableEmailNotifications: checked })
                      }
                    />
                  </div>
                </div>

                {notificationSettings.enableEmailNotifications && (
                  <div className="space-y-2 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Label htmlFor="alertEmail">E-mail para Alertas</Label>
                    <Input
                      id="alertEmail"
                      type="email"
                      value={stockSettings.alertEmail}
                      onChange={(e) => setStockSettings({ 
                        ...stockSettings, 
                        alertEmail: e.target.value 
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      E-mail principal que receberá os alertas importantes
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Tipos de alerta */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tipos de Alerta</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Estoque Baixo</Label>
                      <p className="text-sm text-muted-foreground">
                        Quando produtos atingirem o nível baixo configurado
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.alertOnLowStock}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({ ...notificationSettings, alertOnLowStock: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Estoque Crítico</Label>
                      <p className="text-sm text-muted-foreground">
                        Alertas urgentes quando o estoque estiver criticamente baixo
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.alertOnCriticalStock}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({ ...notificationSettings, alertOnCriticalStock: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Vendas Automáticas</Label>
                      <p className="text-sm text-muted-foreground">
                        Quando vendas das integrações afetarem o estoque
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.alertOnNegativeStock}
                      onCheckedChange={(checked) => 
                        setNotificationSettings({ ...notificationSettings, alertOnNegativeStock: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          {/* Integrações com APIs Externas */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-500" />
                Integrações Externas
              </CardTitle>
              <CardDescription>
                Conecte o Stockely com suas plataformas de vendas para automação completa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* iFood Integration */}
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-red-600 font-bold text-lg">iF</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">iFood</h3>
                      <p className="text-sm text-muted-foreground">
                        Automação de saídas baseada em vendas do iFood
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {integrations.ifood.connected ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Conectado
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <XCircle className="w-3 h-3 mr-1" />
                        Desconectado
                      </Badge>
                    )}
                  </div>
                </div>

                {integrations.ifood.connected ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Última Sincronização:</span>
                        <span className="font-medium ml-2">{integrations.ifood.lastSync}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total de Pedidos:</span>
                        <span className="font-medium ml-2">{integrations.ifood.totalOrders}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSyncAPI('ifood')}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sincronizar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDisconnectAPI('ifood')}
                      >
                        Desconectar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ifood-merchant">Merchant ID</Label>
                        <Input
                          id="ifood-merchant"
                          value={integrations.ifood.merchantId}
                          onChange={(e) => setIntegrations(prev => ({
                            ...prev,
                            ifood: { ...prev.ifood, merchantId: e.target.value }
                          }))}
                          placeholder="Seu Merchant ID do iFood"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ifood-api">API Key</Label>
                        <Input
                          id="ifood-api"
                          type="password"
                          value={integrations.ifood.apiKey}
                          onChange={(e) => setIntegrations(prev => ({
                            ...prev,
                            ifood: { ...prev.ifood, apiKey: e.target.value }
                          }))}
                          placeholder="Sua API Key do iFood"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleConnectAPI('ifood')}
                      disabled={!integrations.ifood.merchantId || !integrations.ifood.apiKey}
                    >
                      <Link className="w-4 h-4 mr-2" />
                      Conectar com iFood
                    </Button>
                  </div>
                )}

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Como funciona:</strong> A cada venda no iFood, o sistema automaticamente reduzirá o estoque dos ingredientes das receitas vendidas.
                  </AlertDescription>
                </Alert>
              </div>

              {/* CardápioWeb Integration */}
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">CW</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">CardápioWeb</h3>
                      <p className="text-sm text-muted-foreground">
                        Sincronização automática com seu cardápio online
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {integrations.cardapioweb.connected ? (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Conectado
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <XCircle className="w-3 h-3 mr-1" />
                        Desconectado
                      </Badge>
                    )}
                  </div>
                </div>

                {integrations.cardapioweb.connected ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Última Sincronização:</span>
                        <span className="font-medium ml-2">{integrations.cardapioweb.lastSync}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total de Pedidos:</span>
                        <span className="font-medium ml-2">{integrations.cardapioweb.totalOrders}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSyncAPI('cardapioweb')}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sincronizar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDisconnectAPI('cardapioweb')}
                      >
                        Desconectar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cw-store">Store ID</Label>
                        <Input
                          id="cw-store"
                          value={integrations.cardapioweb.storeId}
                          onChange={(e) => setIntegrations(prev => ({
                            ...prev,
                            cardapioweb: { ...prev.cardapioweb, storeId: e.target.value }
                          }))}
                          placeholder="Seu Store ID do CardápioWeb"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cw-api">API Key</Label>
                        <Input
                          id="cw-api"
                          type="password"
                          value={integrations.cardapioweb.apiKey}
                          onChange={(e) => setIntegrations(prev => ({
                            ...prev,
                            cardapioweb: { ...prev.cardapioweb, apiKey: e.target.value }
                          }))}
                          placeholder="Sua API Key do CardápioWeb"
                        />
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleConnectAPI('cardapioweb')}
                      disabled={!integrations.cardapioweb.storeId || !integrations.cardapioweb.apiKey}
                    >
                      <Link className="w-4 h-4 mr-2" />
                      Conectar com CardápioWeb
                    </Button>
                  </div>
                )}

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Como funciona:</strong> O sistema monitora vendas em tempo real e atualiza automaticamente seu estoque conforme os pedidos.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          {/* Informações do Sistema */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-gray-500" />
                Informações da Conta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <h3 className="text-2xl font-bold text-blue-600">v2.0</h3>
                  <p className="text-sm text-muted-foreground">Versão do Stockely</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-600">Premium</h3>
                  <p className="text-sm text-muted-foreground">Plano Atual</p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-purple-600">45</h3>
                  <p className="text-sm text-muted-foreground">Produtos Cadastrados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Botão de salvar */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          size="lg"
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}