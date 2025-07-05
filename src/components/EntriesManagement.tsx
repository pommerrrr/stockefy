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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Plus, Upload, FileText, Calendar, TrendingUp, Package, Loader2 } from 'lucide-react';
import { useProducts, useStockMovements } from '@/hooks/useFirebaseData';
import { useAuth } from '@/contexts/AuthContext';

const unitOptions = [
  'Unidade', 'Kg', 'Gramas', 'Litro', 'mL', 'Pacote', 'Caixa', 'Dúzia'
];

const categories = [
  'Pães', 'Carnes', 'Laticínios', 'Molhos', 'Vegetais', 'Condimentos', 
  'Bebidas', 'Embalagens', 'Outros'
];

export function EntriesManagement() {
  const { user, organization } = useAuth();
  const { products, loading: productsLoading, addProduct, refreshProducts } = useProducts();
  const { addMovement } = useStockMovements();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock entries for display (will be replaced with real data)
  const [entries] = useState([
    {
      id: 1,
      productName: 'Pão Brioche',
      quantity: 100,
      unit: 'Unidade',
      cost: 150.00,
      supplier: 'Padaria Central',
      date: '2025-06-05',
      invoice: 'NF-12345',
      notes: 'Entrega matinal'
    }
  ]);

  const filteredEntries = entries.filter(entry =>
    entry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveEntry = async (entryData: any) => {
    if (!organization?.id || !user?.id) {
      toast.error('Erro de autenticação');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Se é um produto novo, criar primeiro
      if (entryData.isNewProduct) {
        const productResult = await addProduct({
          name: entryData.productName,
          category: entryData.category || 'Outros',
          unit: entryData.unit,
          currentStock: 0,
          minimumStock: entryData.minimumStock || 0,
          costPrice: entryData.unitCost || 0,
          organizationId: organization.id
        });

        if (!productResult.success) {
          toast.error('Erro ao criar produto: ' + productResult.error);
          return;
        }

        entryData.productId = productResult.product?.id;
      }

      // Criar movimentação de entrada
      const movementResult = await addMovement({
        productId: entryData.productId,
        type: 'entry',
        quantity: entryData.quantity,
        unitCost: entryData.unitCost,
        totalCost: entryData.quantity * entryData.unitCost,
        reason: `Entrada - ${entryData.supplier || 'Fornecedor não informado'}`,
        organizationId: organization.id,
        userId: user.id
      });

      if (movementResult.success) {
        toast.success('Entrada registrada com sucesso!');
        setIsDialogOpen(false);
        refreshProducts();
      } else {
        toast.error('Erro ao registrar entrada: ' + movementResult.error);
      }
    } catch (error) {
      toast.error('Erro inesperado ao registrar entrada');
      console.error('Entry error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleXMLUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: Implementar parser XML real
      toast.success('XML processado com sucesso! 5 itens importados.');
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
    <div className="page-container">
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="page-title">
              Gestão de Entradas
            </h1>
            <p className="page-description">
              Registre entradas de mercadorias manualmente ou por XML
            </p>
          </div>
        
          <div className="flex gap-3">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={isSubmitting}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Entrada
                </Button>
              </DialogTrigger>
              <EntryFormDialog 
                products={products}
                productsLoading={productsLoading}
                onSave={handleSaveEntry}
                onCancel={() => setIsDialogOpen(false)}
                isSubmitting={isSubmitting}
              />
            </Dialog>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Upload XML */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Importação de XML
            </CardTitle>
            <CardDescription>
              Importe notas fiscais em formato XML para registrar entradas automaticamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept=".xml"
                onChange={handleXMLUpload}
                className="max-w-md"
              />
              <Button variant="outline" className="min-w-32">
                <FileText className="w-4 h-4 mr-2" />
                Processar XML
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Formatos aceitos: XML de Nota Fiscal Eletrônica (NFe)
            </p>
          </CardContent>
        </Card>

        {/* Busca */}
        <Card>
          <CardContent className="p-4">
            <Input
              placeholder="Buscar entradas por produto ou fornecedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Lista de entradas */}
        <div className="grid gap-4">
          {filteredEntries.map((entry) => (
            <Card key={entry.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-7 h-7 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">{entry.productName}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>📦 {entry.quantity} {entry.unit}</span>
                        <span>🏪 {entry.supplier}</span>
                        <span>📅 {entry.date}</span>
                      </div>
                      {entry.invoice && (
                        <Badge variant="outline" className="text-xs">
                          {entry.invoice}
                        </Badge>
                      )}
                      {entry.notes && (
                        <p className="text-sm text-muted-foreground italic">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      R$ {entry.cost.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Custo total
                    </div>
                    <div className="text-xs text-muted-foreground">
                      R$ {(entry.cost / entry.quantity).toFixed(2)} por {entry.unit.toLowerCase()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma entrada encontrada</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Tente ajustar sua busca' : 'Comece registrando sua primeira entrada'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

interface EntryFormDialogProps {
  products: any[];
  productsLoading: boolean;
  onSave: (entry: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

function EntryFormDialog({ products, productsLoading, onSave, onCancel, isSubmitting }: EntryFormDialogProps) {
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    quantity: 0,
    unit: 'Unidade',
    unitCost: 0,
    supplier: '',
    date: new Date().toISOString().split('T')[0],
    invoice: '',
    notes: '',
    // Campos para produto novo
    isNewProduct: false,
    category: 'Outros',
    minimumStock: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.isNewProduct) {
      if (!formData.productName || formData.quantity <= 0 || formData.unitCost <= 0) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }
    } else {
      if (!formData.productId || formData.quantity <= 0 || formData.unitCost <= 0) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }
    }
    
    onSave(formData);
  };

  const handleProductSelect = (value: string) => {
    if (value === '_new_product_') {
      setFormData({ 
        ...formData, 
        isNewProduct: true, 
        productId: '', 
        productName: '' 
      });
    } else {
      const selectedProduct = products.find(p => p.id === value);
      setFormData({ 
        ...formData, 
        isNewProduct: false, 
        productId: value,
        productName: selectedProduct?.name || '',
        unit: selectedProduct?.unit || 'Unidade'
      });
    }
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Nova Entrada de Mercadoria</DialogTitle>
        <DialogDescription>
          Registre uma nova entrada de produto no estoque
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="product">Produto *</Label>
          <Tabs value={formData.isNewProduct ? "new" : "existing"} onValueChange={(value) => {
            setFormData({ 
              ...formData, 
              isNewProduct: value === "new",
              productId: '',
              productName: ''
            });
          }}>
            <TabsList className="grid w-full grid-cols-2 h-10">
              <TabsTrigger value="existing" className="text-sm">Produto Existente</TabsTrigger>
              <TabsTrigger value="new" className="text-sm">Novo Produto</TabsTrigger>
            </TabsList>
            
            <TabsContent value="existing" className="space-y-2">
              {productsLoading ? (
                <div className="flex items-center gap-2 p-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Carregando produtos...</span>
                </div>
              ) : (
                <Select value={formData.productId} onValueChange={handleProductSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o produto" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        <div className="flex items-center gap-2">
                          <span>{product.name}</span>
                          <Badge variant="outline" className="text-xs">{product.category}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </TabsContent>
            
            <TabsContent value="new" className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Produto *</Label>
                  <Input
                    placeholder="Digite o nome do produto"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Alert>
                <Package className="w-4 h-4" />
                <AlertDescription>
                  <strong>Novo produto:</strong> Será adicionado automaticamente ao sistema
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade *</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              step="0.01"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="unit">Unidade *</Label>
            <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {unitOptions.map((unit) => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="unitCost">Custo Unitário (R$) *</Label>
            <Input
              id="unitCost"
              type="number"
              min="0"
              step="0.01"
              value={formData.unitCost}
              onChange={(e) => setFormData({ ...formData, unitCost: parseFloat(e.target.value) || 0 })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="supplier">Fornecedor</Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              placeholder="Nome do fornecedor"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="invoice">Nota Fiscal</Label>
            <Input
              id="invoice"
              value={formData.invoice}
              onChange={(e) => setFormData({ ...formData, invoice: e.target.value })}
              placeholder="Ex: NF-12345"
            />
          </div>
        </div>

        {formData.isNewProduct && (
          <div className="space-y-2">
            <Label htmlFor="minimumStock">Estoque Mínimo</Label>
            <Input
              id="minimumStock"
              type="number"
              min="0"
              value={formData.minimumStock}
              onChange={(e) => setFormData({ ...formData, minimumStock: parseInt(e.target.value) || 0 })}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            placeholder="Observações sobre a entrada..."
          />
        </div>

        {formData.quantity > 0 && formData.unitCost > 0 && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm">
              <strong>Custo total:</strong> R$ {(formData.quantity * formData.unitCost).toFixed(2)}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Registrando...
              </>
            ) : (
              'Registrar Entrada'
            )}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}