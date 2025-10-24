# Arquitetura do Sistema

## Visão Geral

O sistema é construído com Next.js 15 no frontend e Firebase como backend, com um design modular e escalável.

## Estrutura de Pastas

\`\`\`
marketing-agency-system/
├── app/
│   ├── api/                    # API Routes
│   ├── dashboard/              # Páginas do dashboard
│   ├── login/                  # Página de login
│   ├── layout.tsx              # Layout raiz
│   ├── page.tsx                # Página inicial
│   └── globals.css             # Estilos globais
├── components/
│   ├── layout/                 # Componentes de layout
│   ├── ui/                     # Componentes UI reutilizáveis
│   ├── rich-text-editor.tsx    # Editor de conteúdo
│   ├── comment-section.tsx     # Seção de comentários
│   ├── whatsapp-notifier.tsx   # Notificador WhatsApp
│   └── media-viewer.tsx        # Visualizador de mídia
├── contexts/
│   └── auth-context.tsx        # Contexto de autenticação
├── hooks/
│   └── use-toast.ts            # Hook de notificações
├── lib/
│   ├── firebase.ts             # Configuração Firebase
│   └── utils.ts                # Utilitários
├── firebase-rules/
│   ├── firestore.rules         # Regras de segurança
│   └── firestore-indexes.json  # Índices do Firestore
├── scripts/
│   └── init-firebase.ts        # Script de inicialização
├── cloudflare-pages/           # Configuração para deploy
├── package.json
├── tsconfig.json
├── next.config.mjs
└── README.md
\`\`\`

## Fluxo de Dados

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                      Cliente (Next.js)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React Components (UI)                               │   │
│  │  - Dashboard                                         │   │
│  │  - Projects                                          │   │
│  │  - Reviews                                           │   │
│  │  - Users                                             │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Auth Context (Gerenciamento de Estado)              │   │
│  │  - Usuário autenticado                               │   │
│  │  - Permissões                                        │   │
│  │  - Status                                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Firebase SDK                                        │   │
│  │  - Authentication                                    │   │
│  │  - Firestore                                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Firebase Backend                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Authentication                                      │   │
│  │  - Email/Password                                    │   │
│  │  - Token Management                                  │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Firestore Database                                  │   │
│  │  - users                                             │   │
│  │  - roles                                             │   │
│  │  - projects                                          │   │
│  │  - reviews                                           │   │
│  │  - approved-projects                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Security Rules                                      │   │
│  │  - Validação de permissões                           │   │
│  │  - Proteção de dados                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Componentes Principais

### 1. Autenticação
- Firebase Authentication
- Context API para gerenciamento de estado
- Proteção de rotas

### 2. Autorização
- Sistema de cargos e permissões
- Validação no cliente e servidor
- Regras de Firestore

### 3. Gerenciamento de Projetos
- CRUD completo
- Atribuição de usuários
- Histórico de versões

### 4. Editor de Conteúdo
- Formatação de texto
- Suporte a mídia
- Visualização em tempo real

### 5. Sistema de Revisão
- Fluxo de aprovação
- Comentários e feedback
- Histórico de projetos

### 6. Notificações
- Integração WhatsApp
- Mensagens customizáveis
- Abertura em navegador

## Segurança

### No Cliente
- Validação de entrada
- Proteção contra XSS
- CSRF tokens

### No Servidor
- Validação de permissões
- Regras de Firestore
- Criptografia de senhas

### No Banco de Dados
- Row-level security
- Índices otimizados
- Backup automático

## Performance

- Lazy loading de componentes
- Cache de dados
- Otimização de queries
- Compressão de assets
- CDN via Cloudflare

## Escalabilidade

- Arquitetura modular
- Separação de responsabilidades
- Fácil adição de novos recursos
- Suporte a múltiplos usuários
- Banco de dados escalável
\`\`\`

## Padrões de Design

### 1. Context API
Usado para gerenciamento global de autenticação e permissões.

### 2. Custom Hooks
Reutilização de lógica em múltiplos componentes.

### 3. Componentes Funcionais
Todos os componentes usam React Hooks.

### 4. Server Components
Quando possível, para melhor performance.

### 5. API Routes
Para operações que requerem segurança adicional.
