# 🤝 Contribuindo para o Stockely

Obrigado por considerar contribuir para o **Stockely**! Sua ajuda é muito valiosa para tornar este projeto ainda melhor.

## 🚀 Como Contribuir

### **1. Reportar Bugs**
Se encontrou um bug, por favor:
- Verifique se o bug já foi reportado nas [Issues](https://github.com/seu-usuario/stockely/issues)
- Se não foi reportado, crie uma nova issue com:
  - Descrição clara do problema
  - Passos para reproduzir
  - Comportamento esperado vs atual
  - Screenshots (se aplicável)
  - Informações do ambiente (browser, OS)

### **2. Sugerir Melhorias**
Para sugerir uma nova funcionalidade:
- Abra uma issue com label "enhancement"
- Descreva a funcionalidade desejada
- Explique por que seria útil
- Forneça exemplos de uso

### **3. Contribuir com Código**

#### **Setup do Ambiente**
```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/seu-usuario/stockely.git
cd stockely

# Instale dependências
npm install

# Configure Firebase (veja README.md)
cp .env.example .env
# Edite .env com suas configurações

# Execute em modo desenvolvimento
npm run dev
```

#### **Fluxo de Contribuição**
1. **Crie uma branch**
   ```bash
   git checkout -b feature/nome-da-funcionalidade
   # ou
   git checkout -b fix/nome-do-bug
   ```

2. **Faça suas alterações**
   - Mantenha o código limpo e bem comentado
   - Siga os padrões de código existentes
   - Teste suas alterações

3. **Commit suas mudanças**
   ```bash
   git add .
   git commit -m "feat: adiciona nova funcionalidade X"
   # ou
   git commit -m "fix: corrige problema Y"
   ```

4. **Push para sua branch**
   ```bash
   git push origin feature/nome-da-funcionalidade
   ```

5. **Abra um Pull Request**
   - Descreva suas alterações
   - Referencie issues relacionadas
   - Aguarde review

## 📝 Padrões de Código

### **Commits**
Usamos [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `style:` formatação
- `refactor:` refatoração
- `test:` testes
- `chore:` tarefas gerais

### **TypeScript**
- Use tipagem estrita
- Evite `any`, prefira tipos específicos
- Documente tipos complexos

### **React**
- Componentes funcionais com hooks
- Props tipadas com interfaces
- Use memo para otimização quando necessário

### **Styling**
- Use Tailwind CSS
- Mantenha classes organizadas
- Prefira componentes ShadCN UI

## 🧪 Testes

### **Executar Testes**
```bash
# Executar todos os testes
npm run test

# Testes em modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

### **Escrever Testes**
- Teste funcionalidades críticas
- Use React Testing Library
- Mantenha testes simples e focados

## 📋 Checklist de PR

Antes de submeter um Pull Request, verifique:

- [ ] ✅ Código segue os padrões estabelecidos
- [ ] ✅ Testes passam
- [ ] ✅ Build funciona (`npm run build`)
- [ ] ✅ Lint passa (`npm run lint`)
- [ ] ✅ Documentação atualizada (se necessário)
- [ ] ✅ Commits seguem padrão convencional
- [ ] ✅ PR tem descrição clara
- [ ] ✅ Issues relacionadas referenciadas

## 🎯 Áreas de Contribuição

### **🔥 Prioridade Alta**
- Correção de bugs críticos
- Melhorias de performance
- Acessibilidade
- Segurança

### **🟡 Prioridade Média**
- Novas funcionalidades
- Refatoração de código
- Documentação
- Testes

### **🟢 Prioridade Baixa**
- Melhorias de UI/UX
- Otimizações menores
- Exemplos de código

## 🌟 Reconhecimento

Todos os contribuidores serão:
- Listados no README.md
- Creditados no changelog
- Convidados para o Discord da comunidade

## 📞 Suporte

Dúvidas sobre contribuição?
- Abra uma issue com label "question"
- Entre no Discord: [Stockely Community](https://discord.gg/stockely)
- Email: dev@stockely.com

## 📜 Código de Conduta

Ao participar deste projeto, você concorda em seguir nosso [Código de Conduta](CODE_OF_CONDUCT.md).

---

**Obrigado por contribuir com o Stockely! 🚀**