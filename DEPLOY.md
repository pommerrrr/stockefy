# 🚀 Deploy do Stockely - Guia Completo

## 🎯 **Deploy Automático (Recomendado)**

### **🔵 Vercel (Mais Fácil)**
1. **Fork no GitHub**
   ```bash
   # No GitHub, clique em "Fork" neste repositório
   ```

2. **Deploy na Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Conecte sua conta GitHub
   - Clique "New Project"
   - Selecione seu fork do Stockely
   - Clique "Deploy"

3. **Configure Variáveis de Ambiente**
   - No painel Vercel → Settings → Environment Variables
   - Adicione suas variáveis Firebase:
   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Redeploy**
   - Vercel → Deployments → Redeploy

### **🟠 Netlify**
1. **Deploy Direto**
   - Acesse [netlify.com](https://netlify.com)
   - Arraste a pasta `dist` (após `npm run build`)
   - Ou conecte seu repositório GitHub

2. **Configure Variáveis**
   - Site Settings → Environment Variables
   - Adicione as mesmas variáveis Firebase

---

## 🛠️ **Deploy Manual**

### **1. Build Local**
```bash
# Instalar dependências
npm install

# Fazer build
npm run build

# A pasta 'dist' será criada
```

### **2. Opções de Hospedagem**

#### **🔥 Firebase Hosting (Gratuito)**
```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login no Firebase
firebase login

# Inicializar hosting
firebase init hosting

# Deploy
firebase deploy
```

#### **🌐 GitHub Pages**
```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Adicionar script no package.json
"homepage": "https://seu-usuario.github.io/stockely",
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

#### **☁️ Railway**
1. Conecte seu GitHub no [railway.app](https://railway.app)
2. Selecione o repositório
3. Adicione variáveis de ambiente
4. Deploy automático

#### **🟦 Azure Static Web Apps**
1. Acesse [portal.azure.com](https://portal.azure.com)
2. Crie "Static Web App"
3. Conecte GitHub
4. Configure build:
   ```yaml
   app_location: "/"
   api_location: ""
   output_location: "dist"
   ```

---

## 🔧 **Configuração Avançada**

### **Custom Domain**
1. **Vercel/Netlify**
   - Settings → Domains
   - Add Custom Domain
   - Configure DNS (CNAME)

2. **Firebase Hosting**
   ```bash
   firebase hosting:channel:deploy custom-domain
   ```

### **SSL/HTTPS**
- ✅ **Automático** na Vercel/Netlify/Firebase
- ✅ **Let's Encrypt** gratuito
- ✅ **HTTPS redirect** configurado

### **CDN e Cache**
- ✅ **CDN global** automático
- ✅ **Cache otimizado** para assets
- ✅ **Compressão Gzip/Brotli**

---

## 📊 **Monitoramento**

### **Analytics**
```bash
# Google Analytics (opcional)
# Adicionar ID no Firebase config
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### **Error Tracking**
```bash
# Sentry (opcional)
npm install @sentry/react
```

### **Performance**
- Lighthouse Score automático
- Web Vitals tracking
- Bundle size monitoring

---

## 🔒 **Segurança**

### **Environment Variables**
- ✅ **Nunca** commitar `.env`
- ✅ **Sempre** usar variáveis de ambiente na produção
- ✅ **Rotar** chaves periodicamente

### **Firebase Security**
- ✅ **Regras de segurança** configuradas
- ✅ **CORS** configurado corretamente
- ✅ **Rate limiting** ativo

### **Headers de Segurança**
```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

---

## 🚨 **Troubleshooting**

### **Build Fails**
```bash
# Limpar cache
rm -rf node_modules dist
npm install
npm run build
```

### **Environment Variables não funcionam**
- Verificar se começam com `VITE_`
- Reiniciar build após adicionar
- Verificar sintaxe no `.env`

### **Firebase não conecta**
- Verificar se todas as variáveis estão corretas
- Testar localmente primeiro
- Verificar regras do Firestore

### **404 em rotas**
```javascript
// vercel.json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 📈 **Otimização**

### **Performance**
- ✅ Code splitting automático
- ✅ Lazy loading de rotas
- ✅ Compressão de assets
- ✅ Cache otimizado

### **SEO**
```html
<!-- Adicionar no index.html -->
<meta name="description" content="Sistema de gestão de estoque">
<meta property="og:title" content="Stockely">
<meta property="og:description" content="Gestão inteligente de estoque">
```

### **Bundle Size**
```bash
# Analisar bundle
npm run build:analyze
```

---

## 🎉 **URLs de Exemplo**

Após deploy, você terá:
- **Vercel**: `https://stockely-seu-usuario.vercel.app`
- **Netlify**: `https://stockely-seu-usuario.netlify.app`
- **Firebase**: `https://stockely-xxxxx.web.app`

---

**🚀 Seu Stockely está pronto para conquistar o mundo! 🌍**