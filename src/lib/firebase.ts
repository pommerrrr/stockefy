// Firebase configuration and database operations
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  updateDoc, 
  doc, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  organizationId: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  cnpj?: string;
  address?: string;
  phone?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  organizationId: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  costPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockMovement {
  id: string;
  organizationId: string;
  productId: string;
  productName: string;
  type: 'entry' | 'exit';
  quantity: number;
  unitPrice?: number;
  totalValue?: number;
  reason: string;
  userId: string;
  userName: string;
  createdAt: Date;
}

export interface Recipe {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  category?: string;
  ingredients: RecipeIngredient[];
  totalCost: number;
  servings: number;
  costPerServing: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeIngredient {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  cost: number;
}

export interface Supplier {
  id: string;
  organizationId: string;
  name: string;
  cnpj?: string;
  phone?: string;
  email?: string;
  address?: string;
  products: string[];
  status: 'active' | 'inactive';
  notes?: string;
  lastOrder?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to convert Firestore timestamps
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  return new Date();
};

// Check Firebase indexes
export const checkFirebaseIndexes = async (organizationId: string): Promise<boolean> => {
  try {
    console.log('Checking Firebase indexes for organization:', organizationId);
    
    // Test basic queries that require indexes
    const productsQuery = query(
      collection(db, 'products'),
      where('organizationId', '==', organizationId),
      orderBy('name')
    );
    
    const movementsQuery = query(
      collection(db, 'stockMovements'),
      where('organizationId', '==', organizationId),
      orderBy('createdAt', 'desc')
    );
    
    // Try to execute the queries
    await getDocs(productsQuery);
    await getDocs(movementsQuery);
    
    console.log('Firebase indexes are working correctly');
    return true;
  } catch (error: any) {
    console.error('Firebase index error:', error);
    
    if (error.code === 'failed-precondition' && error.message.includes('index')) {
      console.error('Missing Firebase indexes. Please check the Firebase console.');
      return false;
    }
    
    // For other errors, assume indexes are OK
    return true;
  }
};

// Authentication functions
export const signUp = async (email: string, password: string, userData: Partial<User>) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document
    const userDoc = {
      email: user.email,
      name: userData.name || '',
      organizationId: userData.organizationId || '',
      role: userData.role || 'user',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await addDoc(collection(db, 'users'), userDoc);
    
    return { success: true, user };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return { success: false, error: error.message };
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return { success: false, error: error.message };
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
};

// Product functions
export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    console.log('Creating product:', productData);
    
    const docData = {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'products'), docData);
    console.log('Product created with ID:', docRef.id);
    
    const product: Product = {
      ...productData,
      id: docRef.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return { success: true, product };
  } catch (error: any) {
    console.error('Error creating product:', error);
    return { success: false, error: error.message };
  }
};

export const getOrganizationProducts = async (organizationId: string) => {
  try {
    console.log('Fetching products for organization:', organizationId);
    
    const q = query(
      collection(db, 'products'),
      where('organizationId', '==', organizationId),
      orderBy('name')
    );
    
    const querySnapshot = await getDocs(q);
    const products: Product[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      products.push({
        id: doc.id,
        organizationId: data.organizationId,
        name: data.name,
        category: data.category,
        unit: data.unit,
        currentStock: data.currentStock,
        minimumStock: data.minimumStock,
        costPrice: data.costPrice,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt)
      });
    });
    
    console.log('Products fetched:', products.length);
    return { success: true, products };
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return { success: false, error: error.message };
  }
};

export const updateProductStock = async (productId: string, newStock: number) => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      currentStock: newStock,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating product stock:', error);
    return { success: false, error: error.message };
  }
};

// Stock movement functions
export const createStockMovement = async (movementData: Omit<StockMovement, 'id' | 'createdAt'>) => {
  try {
    console.log('Creating stock movement:', movementData);
    
    const docData = {
      ...movementData,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'stockMovements'), docData);
    console.log('Stock movement created with ID:', docRef.id);
    
    const movement: StockMovement = {
      ...movementData,
      id: docRef.id,
      createdAt: new Date()
    };
    
    return { success: true, movement };
  } catch (error: any) {
    console.error('Error creating stock movement:', error);
    return { success: false, error: error.message };
  }
};

export const getStockMovements = async (organizationId: string) => {
  try {
    console.log('Fetching stock movements for organization:', organizationId);
    
    const q = query(
      collection(db, 'stockMovements'),
      where('organizationId', '==', organizationId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const movements: StockMovement[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      movements.push({
        id: doc.id,
        organizationId: data.organizationId,
        productId: data.productId,
        productName: data.productName,
        type: data.type,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        totalValue: data.totalValue,
        reason: data.reason,
        userId: data.userId,
        userName: data.userName,
        createdAt: convertTimestamp(data.createdAt)
      });
    });
    
    console.log('Stock movements fetched:', movements.length);
    return { success: true, movements };
  } catch (error: any) {
    console.error('Error fetching stock movements:', error);
    return { success: false, error: error.message };
  }
};

// Recipe functions
export const getOrganizationRecipes = async (organizationId: string) => {
  try {
    console.log('Fetching recipes for organization:', organizationId);
    
    const q = query(
      collection(db, 'recipes'),
      where('organizationId', '==', organizationId),
      orderBy('name')
    );
    
    const querySnapshot = await getDocs(q);
    const recipes: Recipe[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      recipes.push({
        id: doc.id,
        organizationId: data.organizationId,
        name: data.name,
        description: data.description,
        category: data.category,
        ingredients: data.ingredients || [],
        totalCost: data.totalCost,
        servings: data.servings,
        costPerServing: data.costPerServing,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt)
      });
    });
    
    console.log('Recipes fetched:', recipes.length);
    return { success: true, recipes };
  } catch (error: any) {
    console.error('Error fetching recipes:', error);
    return { success: false, error: error.message };
  }
};

// Supplier functions
export const getOrganizationSuppliers = async (organizationId: string) => {
  try {
    console.log('Fetching suppliers for organization:', organizationId);
    
    const q = query(
      collection(db, 'suppliers'),
      where('organizationId', '==', organizationId),
      orderBy('name')
    );
    
    const querySnapshot = await getDocs(q);
    const suppliers: Supplier[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      suppliers.push({
        id: doc.id,
        organizationId: data.organizationId,
        name: data.name,
        cnpj: data.cnpj,
        phone: data.phone,
        email: data.email,
        address: data.address,
        products: data.products || [],
        status: data.status,
        notes: data.notes,
        lastOrder: data.lastOrder,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt)
      });
    });
    
    console.log('Suppliers fetched:', suppliers.length);
    return { success: true, suppliers };
  } catch (error: any) {
    console.error('Error fetching suppliers:', error);
    return { success: false, error: error.message };
  }
};