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
import { toast } from 'sonner';
import { Package, Plus } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  unit: string;
  minimumStock: number;
  costPrice: number;
  description?: string;
}

interface ProductFormDialogProps {
  onSave: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

const categories = [
  'Pães', 'Carnes', 'Laticínios', 'Molhos', 'Vegetais', 'Condimentos', 
  'Bebidas', 'Embalagens', 'Outros'
];

const unitOptions = [
  'Unidade', 'Kg', 'Gramas', 'Litro', 'mL', 'Pacote', 'Caixa', 'Dúzia'
];

export function ProductFormDialog({ onSave, onCancel }: ProductFormDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    unit: 'Unidade',
    minimumStock: 0,
    costPrice: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }
    onSave(formData);
    setFormData({
      name: '',
      description: '',
      category: '',
      unit: 'Unidade',
      minimumStock: 0,
      costPrice: 0
    });
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Cadastrar Novo Produto
        </DialogTitle>
        <DialogDescription>
          Cadastre um novo produto que não está na lista
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Pão Integral"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descrição opcional do produto..."
            rows={2}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="unit">Unidade de Medida *</Label>
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
            <Label htmlFor="minimumStock">Estoque Mínimo</Label>
            <Input
              id="minimumStock"
              type="number"
              min="0"
              step="0.01"
              value={formData.minimumStock}
              onChange={(e) => setFormData({ ...formData, minimumStock: parseFloat(e.target.value) || 0 })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="costPrice">Custo Estimado (R$)</Label>
            <Input
              id="costPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.costPrice}
              onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 <strong>Dica:</strong> Após cadastrar o produto, ele ficará disponível para usar em entradas, saídas e receitas.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Produto
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}