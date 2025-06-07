# 🍔 Stockely - Sistema Inteligente de Gestão de Estoque

<div align="center">
  <img src="https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Firebase-10.14.1-orange?style=for-the-badge&logo=firebase" alt="Firebase" />
  <img src="https://img.shields.io/badge/TypeScript-5.6.3-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4.1.7-cyan?style=for-the-badge&logo=tailwindcss" alt="Tailwind" />
</div>

<br />

<div align="center">
  <h3>🚀 Sistema completo de gestão de estoque para restaurantes, lanchonetes e estabelecimentos alimentícios</h3>
  <p>Multi-tenant • Firebase • Tempo Real • Mobile-First</p>
</div>

---

## 🎯 **Sobre o Projeto**

**Stockely** é uma plataforma web moderna e intuitiva para controle de estoque, desenvolvida especificamente para o setor alimentício. Com foco na facilidade de uso e segurança de dados, oferece gestão completa de ingredientes, receitas, fornecedores e relatórios gerenciais.

### ✨ **Principais Funcionalidades**

- 🔐 **Multi-tenant Seguro** - Cada empresa com dados completamente isolados
- 📦 **Gestão de Produtos** - Cadastro direto nas telas de entrada/saída
- 📊 **Controle de Estoque** - Monitoramento em tempo real
- 🍔 **Fichas Técnicas** - Receitas com cálculo automático de custos
- 📈 **Relatórios Gerenciais** - Analytics completos
- 🛒 **Lista de Compras Inteligente** - Sugestões automáticas
- 📱 **Responsivo** - Funciona perfeitamente em todos os dispositivos

---

## 🚀 **Deploy Rápido**

### **Vercel (Recomendado)**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/seu-usuario/stockely)

### **Netlify**
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/seu-usuario/stockely)

---

## 📋 **Configuração Inicial**

### **1. Clone o Repositório**
```bash
git clone https://github.com/seu-usuario/stockely.git
cd stockely
```

### **2. Instale as Dependências**
```bash
npm install
# ou
yarn install
```

### **3. Configure o Firebase**

#### 3.1. Crie um projeto Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Crie um novo projeto
3. Ative **Authentication** (Email/senha)
4. Ative **Firestore Database** (modo produção)

#### 3.2. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações do Firebase:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### 3.3. Configure as regras de segurança
No Firestore Console → Regras, substitua por:
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
    
    // Helper function to get organization owner
    function getUserOrganizationOwnerId(organizationId) {
      return get(/databases/$(database)/documents/organizations/$(organizationId)).data.ownerId;
    }
  }
}
```

### **4. Execute o Projeto**
```bash
npm run dev
```

Acesse `http://localhost:5173` e crie sua primeira conta!

---

## 🏗️ **Tecnologias Utilizadas**

### **Frontend**
- **React 19** - Biblioteca JavaScript moderna
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Framework CSS utilitário
- **ShadCN UI** - Componentes acessíveis
- **Lucide React** - Ícones modernos

### **Backend & Infraestrutura**
- **Firebase Authentication** - Autenticação segura
- **Cloud Firestore** - Banco de dados NoSQL
- **Firebase Hosting** - Deploy automático
- **Vite** - Build tool rápido

### **Funcionalidades Avançadas**
- **Multi-tenant Architecture** - Isolamento de dados
- **Real-time Updates** - Sincronização automática
- **Progressive Web App** - Instalável como app
- **Mobile-First Design** - Responsivo por padrão

---

## 📁 **Estrutura do Projeto**

```
src/
├── components/           # Componentes React
│   ├── auth/            # Autenticação
│   ├── layout/          # Layout e navegação
│   └── ui/              # Componentes UI base
├── contexts/            # Contextos React
├── lib/                 # Utilitários e Firebase
├── types/               # Tipos TypeScript
└── hooks/              # Hooks customizados
```

---

## 🔒 **Segurança**

### **Recursos de Segurança**
- ✅ **Autenticação Firebase** - Login seguro
- ✅ **Firestore Security Rules** - Isolamento de dados
- ✅ **Multi-tenant** - Dados completamente separados
- ✅ **HTTPS** - Comunicação criptografada
- ✅ **Validação dupla** - Client e server-side

### **Compliance**
- 🔐 **LGPD Ready** - Proteção de dados pessoais
- 🛡️ **SOC 2** - Padrões de segurança Firebase
- 🔒 **ISO 27001** - Segurança da informação

---

## 📊 **Roadmap**

### **✅ Versão 1.0 (Atual)**
- Sistema multi-tenant completo
- CRUD de produtos/receitas/fornecedores
- Controle de estoque básico
- Relatórios essenciais
- Interface responsiva

### **🔄 Versão 1.1 (Próxima)**
- [ ] Integração iFood API
- [ ] Integração CardápioWeb
- [ ] Importação XML (NFe)
- [ ] App Mobile (PWA)
- [ ] Notificações push

### **📋 Versão 1.2 (Futuro)**
- [ ] IA para previsão de demanda
- [ ] Múltiplas filiais
- [ ] Controle de validade
- [ ] Código de barras
- [ ] Analytics avançado

---

## 🤝 **Contribuição**

Contribuições são sempre bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### **Desenvolvimento Local**
```bash
# Clone e configure
git clone https://github.com/seu-usuario/stockely.git
cd stockely
npm install

# Configure Firebase (veja instruções acima)
cp .env.example .env

# Execute em modo desenvolvimento
npm run dev

# Execute testes
npm run test

# Build para produção
npm run build
```

---

## 📱 **Demo & Screenshots**

### **Tela de Login**
Interface moderna e intuitiva para acesso seguro.

### **Dashboard**
Visão geral do estoque com métricas em tempo real.

### **Gestão de Produtos**
Cadastro rápido diretamente nas telas de entrada/saída.

### **Relatórios**
Analytics completos com gráficos interativos.

---

## 📄 **Licença**

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🌟 **Apoie o Projeto**

Se o **Stockely** foi útil para você, considere:

- ⭐ Dar uma estrela no GitHub
- 🐛 Reportar bugs
- 💡 Sugerir melhorias
- 🤝 Contribuir com código
- 📢 Compartilhar com outros

---

## 📞 **Suporte**

- 📧 **Email**: suporte@stockely.com
- 💬 **Discord**: [Stockely Community](https://discord.gg/stockely)
- 📖 **Documentação**: [docs.stockely.com](https://docs.stockely.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/seu-usuario/stockely/issues)

---

<div align="center">
  <strong>Feito com ❤️ para revolucionar a gestão de estoque</strong>
  
  <p>
    <a href="#top">⬆️ Voltar ao topo</a>
  </p>
</div>