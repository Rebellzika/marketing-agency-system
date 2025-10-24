# 🚀 Guia Completo: Deploy Dinâmico no Cloudflare Pages

## ✅ Tarefas Concluídas:
- ✅ Removido `output: 'export'` do next.config.mjs
- ✅ Verificado package.json (já estava correto)

## 📋 Próximos Passos:

### **Tarefa 3: Criar Repositório no GitHub**
1. Acesse [GitHub.com](https://github.com) e faça login
2. Clique no "+" → "New repository"
3. Nome: `marketing-agency-system`
4. **IMPORTANTE**: Deixe vazio (não marque README, .gitignore, license)
5. Clique "Create repository"
6. Copie a URL HTTPS (ex: `https://github.com/seu-usuario/marketing-agency-system.git`)

### **Tarefa 4: Enviar Projeto para GitHub**
Execute estes comandos no PowerShell na pasta do projeto:

```bash
git init
git add .
git commit -m "Versão inicial do projeto"
git remote add origin https://github.com/seu-usuario/marketing-agency-system.git
git branch -M main
git push -u origin main
```

### **Tarefa 5: Configurar Cloudflare Pages**
1. **Delete o projeto antigo** (o que usava upload direto)
2. **Criar novo projeto** → "Connect to Git"
3. **Autorizar GitHub** e selecionar o repositório
4. **Configurações importantes**:
   - **Build command**: `pnpm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/` (ou deixe vazio)
   - **Framework preset**: Next.js

### **Tarefa 6: Variáveis de Ambiente**
No Cloudflare Pages → Settings → Environment Variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBvNAjE8H6KyEg4wxBVkAozl09rhpzXNfA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=curso2-b3102.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=curso2-b3102
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=curso2-b3102.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=701286382065
NEXT_PUBLIC_FIREBASE_APP_ID=1:701286382065:web:796e6fa063cc892bc9ec50
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-58GED45K4Z
```

## 🎯 Resultado Esperado:
- ✅ Sistema dinâmico funcionando
- ✅ Firebase conectado
- ✅ APIs funcionando
- ✅ Autenticação real
- ✅ Banco de dados ativo

## ⚠️ Importante:
- Use **pnpm** (não npm) no Cloudflare Pages
- Build output directory deve ser **.next** (não out)
- Todas as variáveis devem ter prefixo **NEXT_PUBLIC_**
