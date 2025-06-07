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
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Edit, Trash2, Truck, Phone, Mail, MapPin, Package } from 'lucide-react';

interface Supplier {
  id: number;
  name: string;
  cnpj: string;
  phone: string;
  email: string;
  address: string;
  products: string[];
  status: 'active' | 'inactive';
  notes: string;
  lastOrder?: string;
}

// Mock data
const mockSuppliers: Supplier[] = [
  {
    id: 1,
    name: 'Padaria Central',
    cnpj: '12.345.678/0001-90',
    phone: '(11) 99999-1111',
    email: 'contato@padariacentral.com.br',
    address: 'Rua das Flores, 123 - Centro',
    products: ['Pão Brioche', 'Pão de Hambúrguer', 'Pão Artesanal'],
    status: 'active',
    notes: 'Entrega sempre às terças e sextas-feiras',
    lastOrder: '2025-06-05'
  },
  {
    id: 2,
    name: 'Frigorífico Premium',
    cnpj: '98.765.432/0001-10',
    phone: '(11) 88888-2222',
    email: 'vendas@frigoríficopremium.com.br',
    address: 'Av. Industrial, 456 - Distrito Industrial',
    products: ['Carne Angus 180g', 'Carne Suína', 'Frango'],
    status: 'active',
    notes: 'Melhor qualidade de carnes da região',
    lastOrder: '2025-06-04'
  },
  {
    id: 3,
    name: 'Laticínios Brasil',
    cnpj: '11.222.333/0001-44',
    phone: '(11) 77777-3333',
    email: 'pedidos@laticiniosbrasil.com.br',
    address: 'Rodovia SP-123, Km 45',
    products: ['Queijo Cheddar', 'Queijo Mussarela', 'Requeijão'],
    status: 'active',
    notes: 'Produtos sempre frescos',
    lastOrder: '2025-06-03'
  },
  {
    id: 4,
    name: 'Distribuidora Antiga',
    cnpj: '55.666.777/0001-88',
    phone: '(11) 66666-4444',
    email: 'antigo@distribuidora.com.br',
    address: 'Rua Velha, 789',
    products: ['Diversos'],
    status: 'inactive',
    notes: 'Fornecedor inativo - problemas de qualidade'
  }
];

export function SuppliersManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.products.some(product => product.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    if (editingSupplier) {
      setSuppliers(suppliers.map(supplier => 
        supplier.id === editingSupplier.id ? { ...supplierData, id: editingSupplier.id } : supplier
      ));
    } else {
      const newSupplier = { ...supplierData, id: Date.now() };
      setSuppliers([...suppliers, newSupplier]);
    }
    setIsDialogOpen(false);
    setEditingSupplier(null);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsDialogOpen(true);
  };

  const handleDeleteSupplier = (id: number) => {
    setSuppliers(suppliers.filter(supplier => supplier.id !== id));
  };

  const handleToggleStatus = (id: number) => {
    setSuppliers(suppliers.map(supplier => 
      supplier.id === id 
        ? { ...supplier, status: supplier.status === 'active' ? 'inactive' : 'active' }
        : supplier
    ));
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-600 to-cyan-500 bg-clip-text text-transparent">
            Gestão de Fornecedores
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus parceiros e fornecedores de forma eficiente
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setEditingSupplier(null)}
              className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Fornecedor
            </Button>
          </DialogTrigger>
          <SupplierFormDialog 
            supplier={editingSupplier} 
            onSave={handleSaveSupplier}
            onCancel={() => {
              setIsDialogOpen(false);
              setEditingSupplier(null);
            }}
          />
        </Dialog>
      </div>

      {/* Filtros */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar fornecedores por nome ou produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="sm"
              >
                Todos
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('active')}
                size="sm"
              >
                Ativos
              </Button>
              <Button
                variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('inactive')}
                size="sm"
              >
                Inativos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid de fornecedores */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl flex items-center justify-center">
                      <Truck className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold leading-tight">{supplier.name}</h3>
                      <Badge 
                        variant={supplier.status === 'active' ? 'default' : 'secondary'}
                        className={supplier.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
                      >
                        {supplier.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditSupplier(supplier)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteSupplier(supplier.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Contato */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{supplier.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{supplier.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs">{supplier.address}</span>
                  </div>
                </div>
                
                {/* Produtos */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Produtos:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {supplier.products.slice(0, 3).map((product, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                    {supplier.products.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{supplier.products.length - 3} mais
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Última compra */}
                {supplier.lastOrder && (
                  <div className="text-xs text-muted-foreground">
                    Última compra: {supplier.lastOrder}
                  </div>
                )}
                
                {/* Observações */}
                {supplier.notes && (
                  <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded italic">
                    {supplier.notes}
                  </div>
                )}
                
                {/* Ações */}
                <div className="pt-2 border-t">
                  <Button
                    variant={supplier.status === 'active' ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => handleToggleStatus(supplier.id)}
                    className="w-full"
                  >
                    {supplier.status === 'active' ? 'Desativar' : 'Ativar'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum fornecedor encontrado</h3>
            <p className="text-muted-foreground">
              {searchTerm ? 'Tente ajustar sua busca' : 'Comece cadastrando seu primeiro fornecedor'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface SupplierFormDialogProps {
  supplier: Supplier | null;
  onSave: (supplier: Omit<Supplier, 'id'>) => void;
  onCancel: () => void;
}

function SupplierFormDialog({ supplier, onSave, onCancel }: SupplierFormDialogProps) {
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    cnpj: supplier?.cnpj || '',
    phone: supplier?.phone || '',
    email: supplier?.email || '',
    address: supplier?.address || '',
    products: supplier?.products.join(', ') || '',
    status: supplier?.status || 'active' as 'active' | 'inactive',
    notes: supplier?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      products: formData.products.split(',').map(p => p.trim()).filter(p => p.length > 0)
    });
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {supplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
        </DialogTitle>
        <DialogDescription>
          Preencha as informações do fornecedor
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome/Razão Social</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ/CPF</Label>
            <Input
              id="cnpj"
              value={formData.cnpj}
              onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(11) 99999-9999"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Endereço</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="products">Produtos Fornecidos</Label>
          <Textarea
            id="products"
            value={formData.products}
            onChange={(e) => setFormData({ ...formData, products: e.target.value })}
            placeholder="Separe os produtos por vírgula: Pão Brioche, Carne Angus, Queijo Cheddar"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Horários de entrega, condições especiais, etc."
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {supplier ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}