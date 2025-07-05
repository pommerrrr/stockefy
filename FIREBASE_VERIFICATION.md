# 🔥 Verificação Firebase - Stockely

## 📋 **CHECKLIST DE CONFIGURAÇÃO**

### **1. Firestore Database - Regras de Segurança**

Verifique se as regras estão configuradas corretamente:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users - only authenticated users can access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Organizations - only members can access
    match /organizations/{organizationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.ownerId;
    }
    
    // Products - only organization members can access
    match /products/{productId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == getUserOrganizationOwnerId(resource.data.organizationId);
    }
    
    // Stock Movements - only organization members can access
    match /stockMovements/{movementId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == getUserOrganizationOwnerId(resource.data.organizationId);
    }
    
    // Recipes - only organization members can access
    match /recipes/{recipeId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == getUserOrganizationOwnerId(resource.data.organizationId);
    }
    
    // Suppliers - only organization members can access
    match /suppliers/{supplierId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == getUserOrganizationOwnerId(resource.data.organizationId);
    }
    
    // Shopping Lists - only organization members can access
    match /shoppingLists/{listId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == getUserOrganizationOwnerId(resource.data.organizationId);
    }
    
    // Helper function to get organization owner
    function getUserOrganizationOwnerId(organizationId) {
      return get(/databases/$(database)/documents/organizations/$(organizationId)).data.ownerId;
    }
  }
}
```

### **2. Authentication - Métodos de Login**

Verifique se estão habilitados:
- ✅ Email/Password
- ❌ Google (opcional)
- ❌ Anonymous (não recomendado)

### **3. Firestore Database - Estrutura de Coleções**

Verifique se existem as coleções (serão criadas automaticamente):
- `users` - Dados dos usuários
- `organizations` - Dados das empresas
- `products` - Produtos cadastrados
- `stockMovements` - Movimentações de estoque
- `recipes` - Fichas técnicas
- `suppliers` - Fornecedores
- `shoppingLists` - Listas de compras

### **4. Configuração de Índices (Opcional)**

Para melhor performance, crie índices compostos:

```
Collection: products
Fields: organizationId (Ascending), name (Ascending)

Collection: stockMovements  
Fields: organizationId (Ascending), createdAt (Descending)

Collection: recipes
Fields: organizationId (Ascending), category (Ascending)
```

## 🔧 **PASSOS PARA ATUALIZAR**

### **Passo 1: Verificar Regras do Firestore**
1. Firebase Console → Firestore Database → Regras
2. Copiar as regras acima
3. Publicar

### **Passo 2: Verificar Authentication**
1. Firebase Console → Authentication → Sign-in method
2. Confirmar que Email/password está ativo

### **Passo 3: Testar Conexão**
1. Executar o projeto: `npm run dev`
2. Tentar criar uma conta
3. Verificar se dados aparecem no Firestore

## ⚠️ **PROBLEMAS COMUNS**

### **Erro: "Permission denied"**
- Regras do Firestore não estão corretas
- Usuário não está autenticado

### **Erro: "Firebase config not found"**
- Arquivo `.env` não existe ou está incompleto
- Variáveis não começam com `VITE_`

### **Erro: "Network request failed"**
- Problema de conectividade
- Configurações de proxy/firewall

## 🎯 **PRÓXIMO PASSO**

Após verificar essas configurações, vamos:
1. ✅ Conectar dados reais ao Dashboard
2. ✅ Implementar CRUD de produtos
3. ✅ Sistema de entradas/saídas real
4. ✅ Relatórios dinâmicos