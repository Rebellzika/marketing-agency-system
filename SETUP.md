# Guia de Setup do Sistema

## Instalação Local

### 1. Clonar o Repositório

\`\`\`bash
git clone seu-repositorio
cd marketing-agency-system
\`\`\`

### 2. Instalar Dependências

\`\`\`bash
npm install
\`\`\`

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBvNAjE8H6KyEg4wxBVkAozl09rhpzXNfA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=curso2-b3102.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=curso2-b3102
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=curso2-b3102.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=701286382065
NEXT_PUBLIC_FIREBASE_APP_ID=1:701286382065:web:796e6fa063cc892bc9ec50
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-58GED45K4Z
\`\`\`

### 4. Iniciar o Servidor de Desenvolvimento

\`\`\`bash
npm run dev
\`\`\`

Acesse `http://localhost:3000`

## Configuração do Firebase

### 1. Criar Super Admin

1. Acesse o Firebase Console
2. Vá para Authentication > Users
3. Crie um novo usuário com seu email
4. Vá para Firestore Database
5. Crie um documento em `users/{uid}` com:

\`\`\`json
{
  "email": "seu@email.com",
  "name": "Seu Nome",
  "role": {
    "id": "super-admin",
    "name": "Super Admin",
    "level": 0,
    "permissions": ["*"]
  },
  "status": "active",
  "whatsappNumber": "",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
\`\`\`

### 2. Criar Cargos Padrão

No Firestore, crie documentos em `roles/`:

**Admin**
\`\`\`json
{
  "id": "admin",
  "name": "Admin",
  "level": 1,
  "description": "Administrador do sistema",
  "permissions": [
    "view_projects",
    "create_projects",
    "edit_projects",
    "delete_projects",
    "view_reviews",
    "create_reviews",
    "approve_projects",
    "manage_users",
    "view_analytics",
    "send_whatsapp"
  ]
}
\`\`\`

**Copywriter**
\`\`\`json
{
  "id": "copywriter",
  "name": "Copywriter",
  "level": 2,
  "description": "Responsável por criar conteúdo textual",
  "permissions": [
    "view_projects",
    "create_projects",
    "edit_projects",
    "view_reviews",
    "send_whatsapp"
  ]
}
\`\`\`

**Designer**
\`\`\`json
{
  "id": "designer",
  "name": "Designer",
  "level": 2,
  "description": "Responsável por criar designs",
  "permissions": [
    "view_projects",
    "create_projects",
    "edit_projects",
    "view_reviews",
    "send_whatsapp"
  ]
}
\`\`\`

**Revisor**
\`\`\`json
{
  "id": "revisor",
  "name": "Revisor",
  "level": 2,
  "description": "Responsável por revisar projetos",
  "permissions": [
    "view_projects",
    "view_reviews",
    "create_reviews",
    "approve_projects",
    "send_whatsapp"
  ]
}
\`\`\`

## Estrutura do Banco de Dados

### Coleções

- **users**: Dados dos usuários
- **roles**: Definição de cargos e permissões
- **projects**: Projetos em andamento
- **reviews**: Revisões de projetos
- **approved-projects**: Histórico de projetos aprovados

### Documentos de Exemplo

Veja a seção "Criar Cargos Padrão" acima para exemplos de estrutura.

## Primeiro Acesso

1. Acesse `http://localhost:3000`
2. Faça login com suas credenciais de Super Admin
3. Vá para "Usuários" e crie novos usuários
4. Vá para "Cargos" e customize as permissões
5. Comece a criar projetos!

## Dicas de Uso

- **Projetos**: Crie projetos e atribua múltiplos usuários
- **Revisões**: Envie projetos para revisão e aprove/rejeite
- **Comentários**: Adicione comentários nos projetos para feedback
- **WhatsApp**: Notifique usuários via WhatsApp quando projetos estão prontos
- **Histórico**: Acesse o histórico de projetos aprovados com filtros
