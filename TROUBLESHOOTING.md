# Guia de Troubleshooting

## Problemas Comuns

### 1. Erro: "Firebase config not found"

**Solução:**
- Verifique se o arquivo `.env.local` existe
- Certifique-se de que todas as variáveis estão preenchidas
- Reinicie o servidor de desenvolvimento

### 2. Erro: "User not found"

**Solução:**
- Verifique se o usuário foi criado no Firebase Authentication
- Certifique-se de que o documento do usuário existe em Firestore
- Verifique se o UID corresponde

### 3. Erro: "Permission denied"

**Solução:**
- Verifique as regras de Firestore
- Certifique-se de que o usuário tem as permissões necessárias
- Verifique o nível de acesso do cargo

### 4. Erro: "Project not found"

**Solução:**
- Verifique se o projeto existe em Firestore
- Certifique-se de que você tem permissão para acessar
- Verifique se o ID do projeto está correto

### 5. WhatsApp não abre

**Solução:**
- Verifique se o número de telefone está no formato correto
- Certifique-se de que o navegador permite pop-ups
- Tente usar um navegador diferente

### 6. Comentários não aparecem

**Solução:**
- Verifique se a subcoleção de comentários foi criada
- Certifique-se de que você tem permissão para ler comentários
- Recarregue a página

### 7. Erro ao fazer upload de imagem

**Solução:**
- Verifique se a URL da imagem é válida
- Certifique-se de que a imagem é acessível publicamente
- Tente usar uma URL diferente

## Logs de Debug

Para ativar logs de debug, adicione ao seu `.env.local`:

\`\`\`env
NEXT_PUBLIC_DEBUG=true
\`\`\`

Então, verifique o console do navegador para mensagens de debug.

## Contato de Suporte

Se o problema persistir, abra uma issue no repositório com:
- Descrição do problema
- Passos para reproduzir
- Logs de erro
- Versão do navegador
