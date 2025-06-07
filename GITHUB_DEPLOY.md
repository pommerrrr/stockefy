# 📚 Como subir no GitHub e fazer deploy

## 🚀 **PASSO A PASSO COMPLETO**

### **1. Preparar repositório local**
```bash
# Navegue até a pasta do projeto
cd burgerstock-v2

# Inicializar git (se ainda não foi)
git init

# Adicionar todos os arquivos
git add .

# Primeiro commit
git commit -m "feat: sistema Stockely completo com Firebase"
```

### **2. Criar repositório no GitHub**
1. Acesse [github.com](https://github.com)
2. Clique em **"New repository"**
3. Nome: `stockely` 
4. Descrição: `Sistema inteligente de gestão de estoque para restaurantes`
5. **Público** ou **Privado** (sua escolha)
6. **NÃO** marque "Add README" (já temos)
7. Clique **"Create repository"**

### **3. Conectar e enviar código**
```bash
# Adicionar origin (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/stockely.git

# Enviar código
git branch -M main
git push -u origin main
```

---

## 🌐 **DEPLOY AUTOMÁTICO**

### **🔵 Opção 1: Vercel (Recomendado)**

1. **Acesse [vercel.com](https://vercel.com)**
2. **Login** com GitHub
3. **"New Project"**
4. **Selecionar** o repositório `stockely`
5. **Configure variáveis ambiente:**
   - Settings → Environment Variables
   - Adicionar suas configurações Firebase:
   ```
   VITE_FIREBASE_API_KEY=sua_chave_aqui
   VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=seu_projeto
   VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
   VITE_FIREBASE_APP_ID=seu_app_id
   ```
6. **Deploy** → Aguardar build
7. **✅ Pronto!** Seu link estará disponível

### **🟠 Opção 2: Netlify**

1. **Acesse [netlify.com](https://netlify.com)**
2. **"New site from Git"**
3. **Conectar GitHub**
4. **Selecionar** repositório `stockely`
5. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
6. **Configure variáveis** (mesmo processo)
7. **Deploy**

---

## ⚙️ **CONFIGURAÇÕES IMPORTANTES**

### **Firebase Hosting (Alternativa)**
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar
firebase init hosting

# Deploy
firebase deploy
```

### **Domínio personalizado**
- **Vercel/Netlify:** Settings → Domains → Add custom domain
- **Firebase:** Hosting → Add custom domain

---

## 🔒 **SEGURANÇA**

### **✅ Nunca commitar:**
- ❌ Arquivo `.env` (já está no .gitignore)
- ❌ Chaves de API diretamente no código
- ❌ Senhas ou tokens

### **✅ Sempre usar:**
- ✅ Variáveis de ambiente
- ✅ .gitignore configurado
- ✅ .env.example como modelo

---

## 📋 **CHECKLIST PRE-DEPLOY**

Antes de fazer deploy, verifique:

- [ ] ✅ `.env` está no `.gitignore`
- [ ] ✅ Firebase configurado corretamente
- [ ] ✅ `npm run build` funciona local
- [ ] ✅ Todas variáveis no `.env.example`
- [ ] ✅ README.md atualizado
- [ ] ✅ Repository público/privado conforme desejado

---

## 🚨 **PROBLEMAS COMUNS**

### **"Build failed"**
```bash
# Testar local primeiro
npm install
npm run build

# Se funcionar local, problema são as variáveis ambiente
```

### **"Firebase não conecta"**
- Verificar se **todas** as variáveis estão configuradas
- Confirmar se nomes estão **exatos** (VITE_FIREBASE_...)
- Testar no ambiente local primeiro

### **"404 nas rotas"**
- Vercel/Netlify já configurados com `vercel.json` e `netlify.toml`
- Para outros provedores, configurar redirect para `index.html`

---

## 🎯 **RESULTADO FINAL**

Após seguir todos os passos:

### ✅ **Repositório GitHub**
- Código limpo e organizado
- Documentação completa
- Pronto para colaboração

### ✅ **Site Online**
- URL pública funcionando
- SSL automático
- CDN global
- Deploy automático a cada push

### ✅ **Exemplos de URLs:**
- `https://stockely-seunome.vercel.app`
- `https://stockely-seunome.netlify.app`
- `https://stockely.seu-dominio.com`

---

## 🆘 **SUPORTE**

Se tiver problemas:
1. ✅ Verificar logs de build no painel
2. ✅ Testar `npm run build` localmente  
3. ✅ Confirmar variáveis de ambiente
4. ✅ Verificar console do navegador (F12)

---

**🚀 EM 15 MINUTOS VOCÊ TERÁ O STOCKELY RODANDO ONLINE! 🌐**