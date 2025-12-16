# Setup do Backend - MonetizeSpeed

## Configuração do Backend

### 1. Instalar dependências do servidor

```bash
cd server
npm install
```

### 2. Configurar variáveis de ambiente

**Opção 1: Usar o script automático**
```bash
cd server
npm run setup-env
```

**Opção 2: Criar manualmente**

Crie um arquivo `.env` na pasta `server` com o seguinte conteúdo:

**IMPORTANTE:** No Windows, se usar PowerShell, os caracteres `$` precisam ser escapados como `$$`. Se criar manualmente, use exatamente:

```
DATABASE_URL=postgresql://postgres:$$Ca*8627058##$$@db.msuthinujxghpoygotqh.supabase.co:5432/postgres
JWT_SECRET=monetize-speed-secret-key-change-in-production
PORT=3000
```

**Ou use aspas simples para evitar problemas com caracteres especiais:**

```
DATABASE_URL='postgresql://postgres:$$Ca*8627058##$$@db.msuthinujxghpoygotqh.supabase.co:5432/postgres'
JWT_SECRET=monetize-speed-secret-key-change-in-production
PORT=3000
```

### 3. Executar o servidor

```bash
cd server
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

## Configuração do Cliente

### 1. Configurar URL da API

Crie um arquivo `.env` na pasta `client` com:

```
VITE_API_URL=http://localhost:3000/api
```

### 2. Executar o cliente

```bash
cd client
npm run dev
```

## Endpoints da API

### Autenticação

- `POST /api/auth/register` - Cadastrar novo usuário
  ```json
  {
    "email": "usuario@email.com",
    "password": "senha123",
    "name": "Nome do Usuário" // opcional
  }
  ```

- `POST /api/auth/login` - Fazer login
  ```json
  {
    "email": "usuario@email.com",
    "password": "senha123"
  }
  ```

- `GET /api/auth/verify` - Verificar token (requer header Authorization: Bearer TOKEN)

## Estrutura do Banco de Dados

O sistema cria automaticamente as seguintes tabelas:

- `users` - Usuários do sistema
- `transactions` - Transações financeiras
- `budgets` - Orçamentos por categoria
- `goals` - Metas financeiras

