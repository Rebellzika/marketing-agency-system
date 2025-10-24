# Guia Rápido de Início

## 1. Instalação (5 minutos)

\`\`\`bash
# Clonar repositório
git clone seu-repositorio
cd marketing-agency-system

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Firebase
\`\`\`

## 2. Iniciar Servidor (2 minutos)

\`\`\`bash
npm run dev
# Acesse http://localhost:3000
\`\`\`

## 3. Configurar Firebase (10 minutos)

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Crie um novo projeto
3. Ative Authentication (Email/Password)
4. Crie um Firestore Database
5. Copie as credenciais para `.env.local`

## 4. Criar Super Admin (5 minutos)

1. No Firebase Console, vá para Authentication > Users
2. Crie um novo usuário com seu email
3. Copie o UID
4. No Firestore, crie um documento em `users/{uid}`:

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

## 5. Inicializar Cargos (2 minutos)

Execute o script de inicialização:

\`\`\`bash
npx ts-node scripts/init-firebase.ts
\`\`\`

## 6. Primeiro Acesso (1 minuto)

1. Acesse http://localhost:3000
2. Faça login com suas credenciais
3. Vá para "Usuários" e crie novos usuários
4. Comece a criar projetos!

## Próximos Passos

- Leia [SETUP.md](./SETUP.md) para configuração detalhada
- Leia [DEPLOYMENT.md](./DEPLOYMENT.md) para deploy no Cloudflare
- Leia [FEATURES.md](./FEATURES.md) para ver todas as funcionalidades
