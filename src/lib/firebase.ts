import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  orderBy, 
  limit, 
  Timestamp,
  writeBatch
} from 'firebase/firestore';

// Firebase configuration - hardcoded for debugging
const firebaseConfig = {
  apiKey: "AIzaSyDQRjmHBCWzYAfLq1afSQKuH7GySnsQV7w",
  authDomain: "stockely-5de11.firebaseapp.com",
  projectId: "stockely-5de11",
  storageBucket: "stockely-5de11.firebasestorage.app",
  messagingSenderId: "1016286736625",
  appId: "1:1016286736625:web:ffea50411798bc267df950"
};

// Debug environment variables
console.log('Environment variables:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  lastLogin: Date;
  currentOrganizationId?: string;
}

export interface Organization {
  id: string;
  name: string;
  type: 'restaurant' | 'lanchonete' | 'cafeteria' | 'pizzaria' | 'other';
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
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
  type: 'entry' | 'exit' | 'loss' | 'adjustment';
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  reason?: string;
  userId: string;
  createdAt: Date;
}

// Helper function to convert Firestore timestamps
const convertTimestamp = (data: any) => {
  const converted = { ...data };
  Object.keys(converted).forEach(key => {
    if (converted[key] instanceof Timestamp) {
      converted[key] = converted[key].toDate();
    }
  });
  return converted;
};

// Authentication functions
export const registerUser = async (email: string, password: string, name: string, organizationName: string, organizationType: string) => {
  try {
    // Create user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Create organization first
    const orgRef = doc(collection(db, 'organizations'));
    const organization: Omit<Organization, 'id'> = {
      name: organizationName,
      type: organizationType as Organization['type'],
      ownerId: firebaseUser.uid,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(doc(db, 'organizations', orgRef.id), organization);
    
    // Create user document
    const userData: Omit<User, 'id'> = {
      email: firebaseUser.email!,
      name,
      createdAt: new Date(),
      lastLogin: new Date(),
      currentOrganizationId: orgRef.id
    };
    
    await setDoc(doc(db, 'users', firebaseUser.uid), userData);
    
    return {
      success: true,
      user: { id: firebaseUser.uid, ...userData },
      organization: { id: orgRef.id, ...organization }
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    console.log('Firebase login attempt:', { email });
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    console.log('Firebase login successful:', firebaseUser.uid);
    
    // Try to update last login, but don't fail if it doesn't work
    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        lastLogin: new Date()
      });
      console.log('Last login updated');
    } catch (updateError) {
      console.warn('Could not update last login:', updateError);
    }
    
    // Try to get user data, but don't fail if it doesn't exist
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = convertTimestamp(userDoc.data()) as Omit<User, 'id'>;
        console.log('User data found:', userData);
        
        return {
          success: true,
          user: { id: firebaseUser.uid, ...userData }
        };
      } else {
        console.warn('User document not found, creating basic user');
        
        // Create basic user if document doesn't exist
        const basicUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName || 'Usuário',
          createdAt: new Date(),
          lastLogin: new Date(),
          currentOrganizationId: ''
        };
        
        return {
          success: true,
          user: basicUser
        };
      }
    } catch (firestoreError) {
      console.error('Firestore error, using basic user:', firestoreError);
      
      // Fallback to basic user from Firebase Auth
      const basicUser = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name: firebaseUser.displayName || 'Usuário',
        createdAt: new Date(),
        lastLogin: new Date(),
        currentOrganizationId: ''
      };
      
      return {
        success: true,
        user: basicUser
      };
    }
    
  } catch (error: any) {
    console.error('Firebase login error:', error);
    let friendlyMessage = 'Erro ao fazer login';
    
    if (error.code === 'auth/user-not-found') {
      friendlyMessage = 'Usuário não encontrado';
    } else if (error.code === 'auth/wrong-password') {
      friendlyMessage = 'Senha incorreta';
    } else if (error.code === 'auth/invalid-email') {
      friendlyMessage = 'Email inválido';
    }
    
    return {
      success: false,
      error: friendlyMessage
    };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Get current user organization
export const getUserOrganization = async (userId: string) => {
  try {
    console.log('Getting organization for user:', userId);
    
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      console.log('User document not found');
      return { success: false, error: 'User not found' };
    }
    
    const userData = userDoc.data() as User;
    console.log('User data:', userData);
    
    if (!userData.currentOrganizationId) {
      console.log('No organization ID found');
      return { success: false, error: 'No organization found' };
    }
    
    const orgDoc = await getDoc(doc(db, 'organizations', userData.currentOrganizationId));
    if (!orgDoc.exists()) {
      console.log('Organization document not found');
      return { success: false, error: 'Organization not found' };
    }
    
    const orgData = convertTimestamp(orgDoc.data()) as Omit<Organization, 'id'>;
    console.log('Organization found:', orgData);
    
    return {
      success: true,
      organization: { id: orgDoc.id, ...orgData }
    };
  } catch (error: any) {
    console.error('Error getting organization:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Product functions
export const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const productRef = doc(collection(db, 'products'));
    const product: Omit<Product, 'id'> = {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await setDoc(doc(db, 'products', productRef.id), product);
    
    return {
      success: true,
      product: { id: productRef.id, ...product }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const getOrganizationProducts = async (organizationId: string) => {
  try {
    const q = query(
      collection(db, 'products'),
      where('organizationId', '==', organizationId),
      orderBy('name')
    );
    
    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(doc => 
      convertTimestamp({ id: doc.id, ...doc.data() }) as Product
    );
    
    return {
      success: true,
      products
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

export const updateProductStock = async (productId: string, newStock: number) => {
  try {
    await updateDoc(doc(db, 'products', productId), {
      currentStock: newStock,
      updatedAt: new Date()
    });
    
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Stock Movement functions
export const createStockMovement = async (movementData: Omit<StockMovement, 'id' | 'createdAt'>) => {
  try {
    // Validação adicional para garantir que productId está definido
    if (!movementData.productId) {
      console.error('Erro: productId não definido em createStockMovement', movementData);
      return {
        success: false,
        error: 'ID do produto não definido'
      };
    }
    
    const batch = writeBatch(db);
    
    // Create movement
    const movementRef = doc(collection(db, 'stockMovements'));
    const movement: Omit<StockMovement, 'id'> = {
      ...movementData,
      createdAt: new Date()
    };
    
    batch.set(doc(db, 'stockMovements', movementRef.id), movement);
    
    // Update product stock
    const productRef = doc(db, 'products', movementData.productId);
    const productDoc = await getDoc(productRef);
    
    if (productDoc.exists()) {
      const currentStock = productDoc.data().currentStock || 0;
      const newStock = movementData.type === 'entry' 
        ? currentStock + movementData.quantity 
        : currentStock - movementData.quantity;
      
      batch.update(productRef, {
        currentStock: Math.max(0, newStock),
        updatedAt: new Date()
      });
    }
    
    await batch.commit();
    
    return {
      success: true,
      movement: { id: movementRef.id, ...movement }
    };
  } catch (error: any) {
    console.error('Erro em createStockMovement:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const getStockMovements = async (organizationId: string, limitCount = 50) => {
  try {
    const q = query(
      collection(db, 'stockMovements'),
      where('organizationId', '==', organizationId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const movements = querySnapshot.docs.map(doc => 
      convertTimestamp({ id: doc.id, ...doc.data() }) as StockMovement
    );
    
    return {
      success: true,
      movements
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
};

// Auth state observer
export const onAuthStateChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Validation functions
export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string) => {
  return password.length >= 6;
};