# Documentação da API

## Endpoints

### WhatsApp

#### POST /api/send-whatsapp

Gera um link para enviar mensagem via WhatsApp.

**Request:**
\`\`\`json
{
  "phoneNumber": "+55 11 99999-9999",
  "message": "Sua mensagem aqui",
  "projectId": "project-123",
  "projectTitle": "Título do Projeto"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "url": "https://wa.me/5511999999999?text=...",
  "message": "Link do WhatsApp gerado com sucesso"
}
\`\`\`

### Comentários

#### POST /api/projects/[id]/comments

Adiciona um comentário a um projeto.

**Request:**
\`\`\`json
{
  "text": "Seu comentário",
  "authorId": "user-123",
  "authorName": "Nome do Autor"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "id": "comment-123",
  "message": "Comentário adicionado com sucesso"
}
\`\`\`

## Estrutura do Banco de Dados

### Coleção: users

\`\`\`json
{
  "uid": "user-123",
  "email": "usuario@email.com",
  "name": "Nome do Usuário",
  "role": {
    "id": "copywriter",
    "name": "Copywriter",
    "level": 2,
    "permissions": ["view_projects", "create_projects", ...]
  },
  "status": "active",
  "whatsappNumber": "+55 11 99999-9999",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
\`\`\`

### Coleção: roles

\`\`\`json
{
  "id": "copywriter",
  "name": "Copywriter",
  "level": 2,
  "description": "Responsável por criar conteúdo textual",
  "permissions": ["view_projects", "create_projects", ...],
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
\`\`\`

### Coleção: projects

\`\`\`json
{
  "id": "project-123",
  "title": "Título do Projeto",
  "description": "Descrição do projeto",
  "status": "active",
  "dueDate": "2024-12-31T00:00:00Z",
  "assignedUsers": ["user-123", "user-456"],
  "createdBy": "user-123",
  "content": "<p>Conteúdo do projeto</p>",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
\`\`\`

### Subcoleção: projects/{id}/comments

\`\`\`json
{
  "id": "comment-123",
  "text": "Texto do comentário",
  "authorId": "user-123",
  "authorName": "Nome do Autor",
  "createdAt": "2024-01-01T00:00:00Z"
}
\`\`\`

### Coleção: reviews

\`\`\`json
{
  "id": "review-123",
  "projectId": "project-123",
  "projectTitle": "Título do Projeto",
  "status": "pending",
  "submittedBy": "user-123",
  "submittedByName": "Nome do Autor",
  "reviewedBy": "user-456",
  "reviewedByName": "Nome do Revisor",
  "comments": "Feedback da revisão",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
\`\`\`

### Coleção: approved-projects

\`\`\`json
{
  "id": "approved-123",
  "projectId": "project-123",
  "projectTitle": "Título do Projeto",
  "approvedBy": "user-456",
  "approvedByName": "Nome do Revisor",
  "approvedAt": "2024-01-01T00:00:00Z"
}
\`\`\`

## Permissões

- `view_projects` - Visualizar projetos
- `create_projects` - Criar projetos
- `edit_projects` - Editar projetos
- `delete_projects` - Deletar projetos
- `view_reviews` - Visualizar revisões
- `create_reviews` - Criar revisões
- `approve_projects` - Aprovar projetos
- `manage_users` - Gerenciar usuários
- `manage_roles` - Gerenciar cargos
- `view_analytics` - Visualizar análises
- `send_whatsapp` - Enviar mensagens WhatsApp
