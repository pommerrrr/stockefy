// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  lastLogin: Date;
  currentOrganizationId?: string;
}

// Organization (Multi-tenant) Types
export interface Organization {
  id: string;
  name: string; // Nome da empresa/restaurante
  type: 'restaurant' | 'lanchonete' | 'cafeteria' | 'pizzaria' | 'other';
  ownerId: string; // ID do usuário proprietário
  members: OrganizationMember[];
  settings: OrganizationSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationMember {
  userId: string;
  role: 'owner' | 'admin' | 'manager' | 'employee';
  joinedAt: Date;
  permissions: string[];
}

export interface OrganizationSettings {
  autoStockCalculation: boolean;
  minimumStockAlerts: boolean;
  integrations: {
    ifood: {
      enabled: boolean;
      apiKey?: string;
      storeId?: string;
    };
    cardapioWeb: {
      enabled: boolean;
      apiKey?: string;
      storeId?: string;
    };
  };
  stockSettings: {
    alertDaysBefore: number;
    autoCalculateMinimum: boolean;
  };
}

// Branch/Filial Types
export interface Branch {
  id: string;
  organizationId: string;
  name: string;
  address: string;
  isMain: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Product/Item Types
export interface Product {
  id: string;
  organizationId: string;
  branchId: string;
  name: string;
  description?: string;
  category: string;
  unit: 'kg' | 'g' | 'l' | 'ml' | 'unit' | 'package';
  currentStock: number;
  minimumStock: number;
  costPrice: number;
  supplierId?: string;
  barcode?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Stock Movement Types
export interface StockMovement {
  id: string;
  organizationId: string;
  branchId: string;
  productId: string;
  type: 'entry' | 'exit' | 'loss' | 'transfer' | 'adjustment';
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  reason?: string;
  recipeId?: string; // Para saídas por receita
  userId: string;
  createdAt: Date;
}

// Recipe/Ficha Técnica Types
export interface Recipe {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  category: string;
  ingredients: RecipeIngredient[];
  yield: number; // Rendimento (quantas porções)
  costPrice: number; // Calculado automaticamente
  salePrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeIngredient {
  productId: string;
  quantity: number;
  unit: string;
}

// Supplier Types
export interface Supplier {
  id: string;
  organizationId: string;
  name: string;
  contact: {
    email?: string;
    phone?: string;
    address?: string;
  };
  cnpj?: string;
  products: string[]; // IDs dos produtos que fornece
  createdAt: Date;
  updatedAt: Date;
}

// Shopping List Types
export interface ShoppingListItem {
  productId: string;
  productName: string;
  currentStock: number;
  minimumStock: number;
  suggestedQuantity: number;
  urgency: 'high' | 'medium' | 'low';
  estimatedCost: number;
  supplierId?: string;
}

export interface ShoppingList {
  id: string;
  organizationId: string;
  branchId: string;
  items: ShoppingListItem[];
  totalEstimatedCost: number;
  status: 'pending' | 'ordered' | 'received';
  expectedDeliveryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Integration Types (iFood/CardápioWeb)
export interface SaleIntegration {
  id: string;
  organizationId: string;
  branchId: string;
  platform: 'ifood' | 'cardapio_web' | 'manual';
  externalOrderId?: string;
  items: SaleItem[];
  totalValue: number;
  createdAt: Date;
}

export interface SaleItem {
  recipeId: string;
  quantity: number;
  unitPrice: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form Types
export interface CreateOrganizationForm {
  name: string;
  type: Organization['type'];
}

export interface CreateBranchForm {
  name: string;
  address: string;
  isMain: boolean;
}

export interface CreateProductForm {
  name: string;
  description?: string;
  category: string;
  unit: Product['unit'];
  minimumStock: number;
  costPrice: number;
  supplierId?: string;
  barcode?: string;
}

export interface StockEntryForm {
  productId: string;
  quantity: number;
  unitCost: number;
  supplierId?: string;
  notes?: string;
}

export interface StockExitForm {
  type: 'loss' | 'usage' | 'recipe';
  items: {
    productId: string;
    quantity: number;
    reason?: string;
  }[];
  recipeId?: string;
}