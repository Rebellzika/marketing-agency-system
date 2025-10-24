# Marketing Agency System - Cloudflare Pages Deploy

## Configuração para Cloudflare Pages

Este projeto está configurado para ser hospedado no Cloudflare Pages.

### Configurações Aplicadas

1. **Next.js Config**: Configurado com `output: 'export'` para gerar arquivos estáticos
2. **Build Directory**: Configurado para usar `out/` como diretório de build
3. **Headers**: Configurado cache e segurança via `_headers`
4. **Redirects**: Configurado roteamento via `_redirects`

### Como Fazer Deploy

1. **Conecte seu repositório** ao Cloudflare Pages
2. **Configure as seguintes configurações de build**:
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `/` (raiz do projeto)

### Variáveis de Ambiente

Configure as seguintes variáveis no Cloudflare Pages:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Arquivos Removidos

Os seguintes arquivos foram removidos pois não são necessários para Cloudflare Pages:
- `wrangler.json` (configuração para Workers)
- `wrangler.toml` (configuração para Workers)
- `wrangler-env.example.json` (exemplo de env para Workers)

### Estrutura Final

```
├── app/                 # App Router do Next.js
├── components/          # Componentes React
├── lib/                 # Utilitários e configurações
├── public/              # Arquivos estáticos
│   ├── _headers         # Configurações de cache e segurança
│   └── _redirects       # Configurações de redirecionamento
├── next.config.mjs      # Configuração do Next.js para Pages
├── package.json         # Dependências e scripts
└── .gitignore          # Arquivos ignorados pelo Git
```
