# 🔥 Guia de Configuração Firebase - Stockely

## 📋 **CHECKLIST RÁPIDO**

### **1. Criar Projeto Firebase (5 min)**
1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em "Criar um projeto"
3. Nome: `stockely-app` (ou escolha seu nome)
4. Desabilite Google Analytics (por enquanto)
5. Clique em "Criar projeto"

### **2. Configurar Authentication (5 min)**
1. No painel lateral, clique em "Authentication"
2. Clique em "Começar"
3. Aba "Sign-in method"
4. Ative "Email/senha"
5. Salve

### **3. Configurar Firestore (5 min)**
1. No painel lateral, clique em "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Começar no modo de teste" (por enquanto)
4. Escolha localização: `southamerica-east1` (São Paulo)
5. Clique em "Concluído"

### **4. Obter Configurações (5 min)**
1. No painel lateral, clique no ⚙️ "Configurações do projeto"
2. Desça até "Seus aplicativos"
3. Clique no ícone "</>" (Web)
4. Nome do app: "Stockely Web"
5. **NÃO** marque "Firebase Hosting"
6. Clique em "Registrar app"
7. **COPIE** as configurações mostradas

### **5. Configurar Variáveis Locais (2 min)**
```bash
# No seu projeto, copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações do Firebase
```

**Exemplo do que copiar:**
```javascript
// Suas configurações do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "stockely-app.firebaseapp.com",
  projectId: "stockely-app",
  storageBucket: "stockely-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

**Cole no .env assim:**
```env
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=stockely-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=stockely-app
VITE_FIREBASE_STORAGE_BUCKET=stockely-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### **6. Configurar Regras de Segurança (3 min)**
1. No Firestore, clique em "Regras"
2. Substitua por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acesso apenas para usuários autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Clique em "Publicar"

### **7. Testar Configuração (2 min)**
```bash
# Instale dependências (se ainda não fez)
npm install

# Execute o projeto
npm run dev

# Abra http://localhost:5173
# Tente criar uma conta/fazer login
```

## 🚨 **PROBLEMAS COMUNS**

### **Erro: "Firebase config not found"**
- Verifique se o arquivo `.env` existe
- Confirme se todas as variáveis estão preenchidas
- Reinicie o servidor (`npm run dev`)

### **Erro: "Permission denied"**
- Verifique se as regras do Firestore estão configuradas
- Confirme se o usuário está autenticado

### **Erro: "Project not found"**
- Verifique se o `projectId` no `.env` está correto
- Confirme se o projeto Firebase foi criado

## 🎯 **TESTE FUNCIONAL**

Após configuração, você deve conseguir:
1. ✅ Acessar a página de login
2. ✅ Criar uma conta nova
3. ✅ Fazer login com a conta criada
4. ✅ Ver o dashboard carregando
5. ✅ Cadastrar novos produtos (salvo no Firebase)

## 📞 **SUPORTE**

Se tiver problemas:
1. Verifique o console do navegador (F12)
2. Verifique os logs do terminal
3. Confirme se seguiu todos os passos
4. Reinicie o projeto (`npm run dev`)

---

**Tempo estimado total: 20-25 minutos** ⏱️