# Guia de Deploy no Cloudflare Pages

## Pré-requisitos

1. Conta no Cloudflare
2. Projeto Next.js configurado
3. Variáveis de ambiente do Firebase configuradas

## Passos para Deploy

### 1. Preparar o Projeto

\`\`\`bash
# Instalar dependências
npm install

# Testar build localmente
npm run build
\`\`\`

### 2. Configurar Variáveis de Ambiente no Cloudflare

1. Acesse o painel do Cloudflare Pages
2. Vá para Settings > Environment variables
3. Adicione as seguintes variáveis:

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=seu-valor
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-valor
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-valor
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-valor
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu-valor
NEXT_PUBLIC_FIREBASE_APP_ID=seu-valor
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=seu-valor
\`\`\`

### 3. Conectar Repositório Git

1. No Cloudflare Pages, clique em "Create a project"
2. Selecione "Connect to Git"
3. Autorize o Cloudflare a acessar seu repositório
4. Selecione o repositório do projeto

### 4. Configurar Build

- **Framework preset**: Next.js
- **Build command**: `npm run build`
- **Build output directory**: `.next`

### 5. Deploy

O deploy será automático a cada push para a branch principal.

## Estrutura de Pastas para Deploy

\`\`\`
cloudflare-pages/
├── .next/
├── public/
├── src/
├── package.json
├── next.config.mjs
├── tsconfig.json
└── wrangler.json
\`\`\`

## Troubleshooting

### Erro: "Firebase config not found"
- Verifique se as variáveis de ambiente estão configuradas no Cloudflare
- Certifique-se de que as variáveis começam com `NEXT_PUBLIC_`

### Erro: "Build failed"
- Verifique os logs no Cloudflare Pages
- Certifique-se de que todas as dependências estão instaladas
- Teste o build localmente com `npm run build`

## Monitoramento

1. Acesse o painel do Cloudflare Pages
2. Vá para "Analytics" para monitorar performance
3. Configure alertas em "Notifications"
