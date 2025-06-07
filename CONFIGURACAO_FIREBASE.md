# 🚀 Configuração Completa do Firebase - Stockely

## ✅ **PASSO A PASSO FINAL**

### **1. Configurar Authentication (2 min)**

1. No [Firebase Console](https://console.firebase.google.com), vá para seu projeto
2. No menu lateral, clique em **"Authentication"**
3. Clique em **"Começar"**
4. Aba **"Sign-in method"**
5. Clique em **"Email/senha"**
6. **Ative** a primeira opção (Email/senha)
7. Clique em **"Salvar"**

### **2. Configurar Firestore Database (3 min)**

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. **IMPORTANTE**: Escolha **"Começar no modo de produção"** (não teste!)
4. Localização: **`southamerica-east1 (São Paulo)`**
5. Clique em **"Concluído"**

### **3. Configurar Regras de Segurança (2 min)**

1. No Firestore, clique na aba **"Regras"**
2. **SUBSTITUA** todo o conteúdo por:

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

3. Clique em **"Publicar"**

### **4. Testar o Sistema (3 min)**

```bash
# Execute o projeto
npm run dev

# Acesse http://localhost:5173
# Teste:
# 1. Criar uma nova conta
# 2. Fazer login
# 3. Cadastrar um produto
# 4. Fazer uma entrada
```

## 🎯 **VERIFICAÇÕES IMPORTANTES**

### **✅ Checklist de Funcionamento:**

1. **Registro funciona?**
   - Criar conta com email/senha
   - Nome da empresa aparece no header

2. **Login funciona?**
   - Login com credenciais criadas
   - Redirecionamento para dashboard

3. **Dados persistem?**
   - Cadastrar um produto
   - Fazer logout e login novamente
   - Produto ainda está lá

4. **Segurança funciona?**
   - Cada conta vê apenas seus dados
   - Logout funciona corretamente

## 🔒 **SEGURANÇA CONFIGURADA**

### **✅ O que está protegido:**
- ✅ **Multi-tenant**: Cada empresa vê apenas seus dados
- ✅ **Autenticação obrigatória**: Sem login, sem acesso
- ✅ **Isolamento completo**: Usuário A nunca vê dados do usuário B
- ✅ **Regras de produção**: Não é modo teste

### **✅ Estrutura de dados:**
```
📊 Firestore Database:
├── 👤 users/{userId}
├── 🏢 organizations/{orgId} 
├── 📦 products/{productId}
├── 📈 stockMovements/{movementId}
├── 🍔 recipes/{recipeId}
├── 🚚 suppliers/{supplierId}
└── 🛒 shoppingLists/{listId}
```

## 🚨 **TROUBLESHOOTING**

### **Erro: "Permission denied"**
- Verifique se as regras foram publicadas corretamente
- Confirme se o usuário está logado

### **Erro: "Firebase config not found"**
- Verifique se o arquivo `.env` existe
- Confirme se todas as variáveis estão preenchidas

### **Erro: "Auth domain not authorized"**
- No Firebase Console → Authentication → Settings
- Adicione seu domínio nas "Authorized domains"

## 🎉 **PRONTO!**

Com isso configurado, o **Stockely** está funcionando completamente:

- ✅ **Autenticação real** com Firebase
- ✅ **Dados persistentes** no Firestore
- ✅ **Multi-tenant seguro**
- ✅ **Modo produção** ativo

Cada cliente que se cadastrar terá seus dados **completamente isolados** e seguros! 🔐