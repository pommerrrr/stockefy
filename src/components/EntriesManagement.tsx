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
import { toast } from 'sonner';
import { Plus, Upload, FileText, Calendar, TrendingUp } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
}

interface Entry {
  id: number;
  productName: string;
  quantity: number;
  unit: string;
  cost: number;
  supplier: string;
  date: string;
  invoice?: string;
  notes: string;
}

// Produtos cadastrados
const mockProducts: Product[] = [
  { id: 1, name: 'Pão Brioche', category: 'Pães' },
  { id: 2, name: 'Carne Angus 180g', category: 'Carnes' },
  { id: 3, name: 'Queijo Cheddar', category: 'Laticínios' },
  { id: 4, name: 'Molho Especial', category: 'Molhos' },
  { id: 5, name: 'Batata Palito', category: 'Vegetais' },
  { id: 6, name: 'Alface Americana', category: 'Vegetais' },
  { id: 7, name: 'Tomate', category: 'Vegetais' },
  { id: 8, name: 'Cebola', category: 'Vegetais' }
];

const mockEntries: Entry[] = [
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
  },
  {
    id: 2,
    productName: 'Carne Angus 180g',
    quantity: 15,
    unit: 'Kg',
    cost: 525.00,
    supplier: 'Frigorífico Premium',
    date: '2025-06-04',
    invoice: 'NF-12346',
    notes: 'Carne premium'
  }
];

const unitOptions = [
  'Unidade', 'Kg', 'Gramas', 'Litro', 'mL', 'Pacote', 'Caixa', 'Dúzia'
];

export function EntriesManagement() {
  const [entries, setEntries] = useState<Entry[]>(mockEntries);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = entries.filter(entry =>
    entry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveEntry = (entryData: Omit<Entry, 'id'>) => {
    const newEntry = { ...entryData, id: Date.now() };
    setEntries([newEntry, ...entries]);
    setIsDialogOpen(false);
    toast.success('Entrada registrada com sucesso!');
  };

  const handleXMLUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simular processamento do XML
      toast.success('XML processado com sucesso! 5 itens importados.');
      // Aqui você implementaria a lógica real de parsing do XML
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
            Gestão de Entradas
          </h1>
          <p className="text-muted-foreground">
            Registre entradas de mercadorias manualmente ou por XML
          </p>
        </div>
        
        <div className="flex gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nova Entrada
              </Button>
            </DialogTrigger>
            <EntryFormDialog 
              onSave={handleSaveEntry}
              onCancel={() => setIsDialogOpen(false)}
            />
          </Dialog>
        </div>
      </div>

      {/* Upload XML */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-green-500" />
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
      <Card className="border-0 shadow-lg">
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
          <Card key={entry.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-blue-600" />
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
                  <div className="text-2xl font-bold text-green-600">
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
        <Card className="border-0 shadow-lg">
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
  );
}

interface EntryFormDialogProps {
  onSave: (entry: Omit<Entry, 'id'>) => void;
  onCancel: () => void;
}

function EntryFormDialog({ onSave, onCancel }: EntryFormDialogProps) {
  const [formData, setFormData] = useState({
    productName: '',
    quantity: 0,
    unit: 'Unidade',
    cost: 0,
    supplier: '',
    date: new Date().toISOString().split('T')[0],
    invoice: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName || formData.quantity <= 0) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    onSave(formData);
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="product">Produto *</Label>
            <Select value={formData.productName} onValueChange={(value) => setFormData({ ...formData, productName: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o produto" />
              </SelectTrigger>
              <SelectContent>
                {mockProducts.map((product) => (
                  <SelectItem key={product.id} value={product.name}>
                    <div className="flex items-center gap-2">
                      <span>{product.name}</span>
                      <Badge variant="outline" className="text-xs">{product.category}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="supplier">Fornecedor</Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              placeholder="Nome do fornecedor"
            />
          </div>
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
            <Label htmlFor="cost">Custo Total (R$)</Label>
            <Input
              id="cost"
              type="number"
              min="0"
              step="0.01"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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

        {formData.quantity > 0 && formData.cost > 0 && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-sm">
              <strong>Custo unitário:</strong> R$ {(formData.cost / formData.quantity).toFixed(2)} por {formData.unit.toLowerCase()}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Registrar Entrada
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}