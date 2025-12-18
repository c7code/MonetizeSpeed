# Deploy no Vercel - MonetizeSpeed

Este projeto foi configurado para fazer deploy completo (frontend + backend) no Vercel usando funções serverless.

## Estrutura do Projeto

- **Frontend**: `client/` - React + Vite
- **Backend**: `api/` - Funções serverless do Vercel
- **Configuração**: `vercel.json`

## Configuração no Vercel

### 1. Variáveis de Ambiente

No painel do Vercel, configure as seguintes variáveis de ambiente:

```
DATABASE_URL=postgresql://postgres:SENHA@HOST:5432/postgres
JWT_SECRET=sua-chave-secreta-jwt-aqui
WEBHOOK_SECRET=sua-chave-secreta-webhook-aqui (opcional)
```

**Importante**: 
- A `DATABASE_URL` deve conter a senha já codificada para URL (use `encodeURIComponent()` se necessário)
- O `JWT_SECRET` deve ser uma string aleatória segura
- O `WEBHOOK_SECRET` é opcional, usado apenas para webhooks do WhatsApp

### 2. Deploy

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente no painel do Vercel
3. O Vercel detectará automaticamente o `vercel.json` e fará o deploy

### 3. Build e Deploy Automático

O Vercel irá:
- Instalar dependências do projeto raiz (`package.json`)
- Fazer build do frontend (`cd client && npm run build`)
- Configurar as funções serverless na pasta `api/`
- Servir o frontend estático e as APIs

## Estrutura das APIs

Todas as rotas estão disponíveis em `/api/*`:

- `/api/auth/register` - POST - Cadastrar usuário
- `/api/auth/login` - POST - Fazer login
- `/api/auth/verify` - GET - Verificar token
- `/api/transactions` - GET, POST - Listar/criar transações
- `/api/transactions/[id]` - PUT, DELETE - Atualizar/deletar transação
- `/api/budgets` - GET, POST - Listar/criar orçamentos
- `/api/budgets/[id]` - PUT, DELETE - Atualizar/deletar orçamento
- `/api/goals` - GET, POST - Listar/criar metas
- `/api/goals/[id]` - PUT, DELETE - Atualizar/deletar meta
- `/api/user/whatsapp` - PUT - Atualizar número WhatsApp
- `/api/user/me` - GET - Obter informações do usuário
- `/api/webhook/whatsapp` - POST - Webhook para WhatsApp
- `/api/webhook/test-parse` - POST - Testar parser de mensagens
- `/api/health` - GET - Health check

## Desenvolvimento Local

Para desenvolvimento local, você ainda pode usar o servidor Express tradicional:

```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev

# Terminal 2 - Frontend
cd client
npm install
npm run dev
```

O frontend em desenvolvimento usará `http://localhost:3000/api` automaticamente.

## Notas Importantes

1. **Banco de Dados**: Certifique-se de que seu banco PostgreSQL está acessível publicamente (ou use um serviço como Supabase)

2. **CORS**: As funções serverless já estão configuradas para aceitar requisições de qualquer origem. Em produção, você pode querer restringir isso.

3. **Cold Start**: Funções serverless podem ter um pequeno delay no primeiro acesso (cold start). Isso é normal.

4. **Limites**: O Vercel tem limites no plano gratuito. Verifique os limites de execução de funções serverless.

5. **Variáveis de Ambiente**: Nunca commite arquivos `.env` no repositório. Use apenas as variáveis de ambiente do Vercel.

