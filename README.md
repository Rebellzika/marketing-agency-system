# Marketing Agency Pro - Sistema de Gerenciamento de Agência

Um sistema completo e profissional para gerenciar projetos de marketing digital, com suporte a múltiplos usuários, permissões customizáveis, editor de conteúdo rico e integração com WhatsApp.

## Características

### Gerenciamento de Usuários e Permissões
- Sistema hierárquico de cargos (Super Admin > Admin > Cargos Customizáveis)
- Permissões granulares por cargo
- Controle de status de usuários (ativo, pausado, banido)
- Apenas admins podem criar contas

### Gerenciamento de Projetos
- Criar, editar, deletar e pausar projetos
- Atribuir múltiplos usuários a um projeto
- Grupos de trabalho para colaboração
- Editor de conteúdo rico com formatação
- Suporte a links de imagens e vídeos
- Comentários e feedback em tempo real

### Sistema de Revisão
- Enviar projetos para revisão
- Aprovar ou rejeitar com feedback
- Histórico de projetos aprovados
- Filtros por data e status

### Integração WhatsApp
- Notificações automáticas via WhatsApp
- Mensagens customizáveis
- Abre WhatsApp Web no navegador

### Segurança
- Autenticação com Firebase
- Regras de segurança do Firestore
- Validação no servidor
- Proteção contra acesso não autorizado

## Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Firebase (Firestore, Authentication)
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI, shadcn/ui
- **Deployment**: Cloudflare Pages

## Instalação

Veja [SETUP.md](./SETUP.md) para instruções detalhadas.

## Deploy

Veja [DEPLOYMENT.md](./DEPLOYMENT.md) para instruções de deploy no Cloudflare Pages.

## Estrutura do Projeto

\`\`\`
├── app/
│   ├── api/
│   ├── dashboard/
│   ├── login/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   ├── ui/
│   └── rich-text-editor.tsx
├── contexts/
│   └── auth-context.tsx
├── hooks/
│   └── use-toast.ts
├── lib/
│   ├── firebase.ts
│   └── utils.ts
├── firebase-rules/
│   ├── firestore.rules
│   └── firestore-indexes.json
├── cloudflare-pages/
│   ├── wrangler.json
│   └── package.json
└── package.json
\`\`\`

## Documentação

- [Setup Local](./SETUP.md)
- [Deploy no Cloudflare](./DEPLOYMENT.md)
- [Regras de Segurança Firebase](./firebase-rules/firestore.rules)

## Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

## Licença

MIT
