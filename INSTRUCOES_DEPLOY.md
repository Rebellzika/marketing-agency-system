# Instruções para Deploy no Cloudflare Pages

## Problemas Resolvidos ✅

1. **Arquivo wrangler.json problemático** - Removido
2. **Configuração tsconfig.json** - Corrigida (removida opção useDefineForEnumMembers)
3. **Configuração next.config.mjs** - Corrigida (removida opção swcMinify)
4. **Conflito entre npm e pnpm** - Resolvido usando npm

## Como Fazer o Build Manualmente

### Passo 1: Abrir Terminal
- Abra o PowerShell como Administrador
- Ou use o CMD (Prompt de Comando)

### Passo 2: Navegar para o Projeto
```bash
cd "C:\Users\paulo\OneDrive\Área de Trabalho\marketing\marketing\marketing-agency-system"
```

### Passo 3: Instalar Dependências
```bash
npm install --legacy-peer-deps
```

### Passo 4: Fazer Build
```bash
npm run build
```

### Passo 5: Verificar Resultado
- Deve aparecer uma pasta `out` com todos os arquivos estáticos
- Essa pasta `out` é o que você vai fazer upload

## Upload no Cloudflare Pages

1. **Nome do projeto**: Digite um nome (ex: `marketing-agency`)
2. **Carregue os arquivos**: Selecione TODA a pasta `out`
3. **Clique em "Implantar site"**

## Arquivos Corrigidos

- ✅ `tsconfig.json` - Removida opção problemática
- ✅ `next.config.mjs` - Removida opção obsoleta
- ✅ `package.json` - Scripts corretos
- ✅ `.gitignore` - Configuração adequada
- ✅ `public/_headers` - Configurações de cache
- ✅ `public/_redirects` - Configurações de roteamento

## Se Ainda Der Erro

1. Verifique se está no diretório correto
2. Verifique se o Node.js está instalado: `node --version`
3. Verifique se o npm está funcionando: `npm --version`
4. Tente deletar `node_modules` e `package-lock.json` e reinstalar

## Alternativa: Conexão com Git

Se o upload direto não funcionar, você pode:
1. Criar um repositório no GitHub
2. Fazer push do código
3. Conectar o GitHub ao Cloudflare Pages
4. Configurar build automático com:
   - Build command: `npm run build`
   - Build output directory: `out`
