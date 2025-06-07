# 🍽️ Stockely - Sistema de Gestão de Estoque

Sistema moderno e inteligente para gestão de estoque focado no ramo alimentício (restaurantes, lanchonetes, padarias, etc.).

## ✨ Funcionalidades

### 🔐 **Sistema Multi-tenant**
- Dados privados por cliente
- Autenticação segura
- Suporte a múltiplas organizações

### 📦 **Gestão de Estoque Completa**
- **Entradas**: Cadastro livre de produtos (existentes ou novos)
- **Controle de Estoque**: Monitoramento em tempo real
- **Saídas**: Registro de vendas, produção e perdas
- **Alertas**: Notificações de estoque baixo

### 🍳 **Específico para Alimentação**
- **Receitas**: Gestão de ingredientes por prato
- **Fornecedores**: Catálogo de fornecedores
- **Validade**: Controle de datas de vencimento

### 📊 **Relatórios Inteligentes**
- **PDF Completo**: Análise detalhada sem recomendações
- **Lista de Compras**: Sem valores (definidos na compra)
- **Consumo**: Análise por produto e período
- **Perdas**: Controle de desperdícios

### 🎨 **Design Refinado**
- **Paleta Consistente**: Tons de laranja harmoniosos
- **Layout Limpo**: Informações organizadas
- **Responsivo**: Funciona em todos os dispositivos

## 🚀 Tecnologias

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS V4
- **Components**: ShadCN UI
- **Icons**: Lucide React
- **PDF**: jsPDF
- **Build**: Vite 6
- **Notifications**: Sonner

## 🛠️ Instalação

```bash
# Clone o repositório
git clone <seu-repositorio>
cd stockely

# Instale as dependências
npm install
# ou
bun install

# Execute o projeto
npm run dev
# ou
bun dev
```

## 🔑 Login Demo

Para testar o sistema, use as credenciais:

- **Email**: `demo@stockely.com`
- **Senha**: `demo123`

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── auth/
│   │   └── AuthScreen.tsx          # Tela de login/registro
│   ├── layout/
│   │   └── Sidebar.tsx             # Menu lateral
│   ├── ui/                         # Componentes ShadCN
│   ├── Dashboard.tsx               # Dashboard principal
│   ├── EntriesManagement.tsx       # Gestão de entradas
│   ├── StockControl.tsx            # Controle de estoque
│   ├── StockExits.tsx              # Saídas de estoque
│   ├── RecipesManagement.tsx       # Gestão de receitas
│   ├── SuppliersManagement.tsx     # Fornecedores
│   ├── Reports.tsx                 # Relatórios
│   ├── ShoppingList.tsx            # Lista de compras
│   └── Settings.tsx                # Configurações
├── contexts/
│   └── AuthContext.tsx             # Contexto de autenticação
├── lib/
│   ├── utils.ts                    # Utilitários
│   └── pdfUtils.ts                 # Geração de PDFs
├── App.tsx                         # Componente principal
├── index.css                       # Estilos globais
└── main.tsx                        # Entry point
```

## 🎯 Próximos Passos

### 🔄 **Fase 2 - Expansão**
- [ ] Múltiplas filiais por cliente
- [ ] Integração APIs iFood/CardápioWeb
- [ ] Sistema de estoque mínimo inteligente (baseado em IA)
- [ ] Relatórios de previsão de demanda

### 🔄 **Fase 3 - Automação**
- [ ] Integração com balanças inteligentes
- [ ] Códigos de barras/QR codes
- [ ] App mobile para gestores
- [ ] Notificações push

## 🎨 Design System

### Cores Principais
- **Primária**: `#ea580c` (Laranja)
- **Secundária**: `#fb923c` (Laranja claro)
- **Gradiente**: `#fd9745` (Laranja suave)
- **Accent**: `#fed7aa` (Laranja muito claro)
- **Background**: `#fff7ed` (Creme)

### Componentes
- **Cards**: Sombras suaves com gradientes
- **Botões**: Gradientes laranja com hover effects
- **Headers**: Títulos com gradiente de texto
- **Stats**: Cards com ícones centralizados

## 📝 Funcionalidades Detalhadas

### ✅ **Correções Implementadas**
- [x] **Paleta de cores padronizada** em tons de laranja
- [x] **Campos de entrada** com tamanhos adequados
- [x] **Relatórios PDF** sem recomendações e textos limpos
- [x] **Lista de compras** sem fornecedor e valores
- [x] **Layout reorganizado** com informações alinhadas
- [x] **Cabeçalho fixo** com sombra adequada
- [x] **Rodapé não flutuante**

### 🆕 **Novidades**
- [x] **Cadastro livre de produtos** nas entradas
- [x] **Sistema multi-tenant** completo
- [x] **Autenticação** com demo
- [x] **Relatórios inteligentes** em PDF
- [x] **Dashboard** com métricas em tempo real

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte, entre em contato ou abra uma issue no repositório.

---

**Stockely** - Gestão inteligente para o seu negócio alimentício 🍽️