# Próximos Passos - Variáveis Configuradas ✅

As variáveis de ambiente estão configuradas corretamente! Agora você precisa:

## 1. Testar a Conexão com o Banco

Acesse este endpoint para verificar se a conexão está funcionando:

```
https://monetize-speed-six.vercel.app/api/test-connection
```

**O que esperar:**
- ✅ Se funcionar: Verá informações sobre a conexão e quais tabelas existem
- ❌ Se der erro: Verá detalhes sobre o problema de conexão

## 2. Inicializar o Banco de Dados

Se as tabelas não existirem, você precisa criá-las. Acesse:

```
https://monetize-speed-six.vercel.app/api/_init-db
```

**O que esperar:**
- ✅ Sucesso: `{"success": true, "message": "Banco de dados inicializado com sucesso"}`
- ❌ Erro: Verá detalhes sobre o que deu errado

**Importante**: Execute este endpoint apenas uma vez (ou quando precisar recriar as tabelas).

## 3. Testar o Login no Postman

### Passo a Passo Detalhado:

#### **Passo 1: Abrir o Postman**
- Abra o Postman (se não tiver, baixe em: https://www.postman.com/downloads/)

#### **Passo 2: Criar Nova Requisição**
- Clique em **"New"** (botão no canto superior esquerdo)
- Selecione **"HTTP Request"**
- Ou use o atalho: `Ctrl + N` (Windows) / `Cmd + N` (Mac)

#### **Passo 3: Configurar o Método HTTP**
- No dropdown à esquerda da URL, selecione **"POST"**
- (Por padrão vem como GET, mude para POST)

#### **Passo 4: Inserir a URL**
- No campo de URL, cole:
  ```
  https://monetize-speed-six.vercel.app/api/auth/login
  ```

#### **Passo 5: Configurar Headers**
- Clique na aba **"Headers"** (abaixo da URL)
- **IMPORTANTE**: Deixe apenas estes headers marcados (ativados):
  
  ✅ **Content-Type**: `application/json` (MARQUE ESTE)
  
  ❌ **NÃO marque** os outros headers automáticos como:
  - Host (deixe desmarcado - será calculado automaticamente)
  - Content-Length (deixe desmarcado - será calculado automaticamente)
  - User-Agent (deixe desmarcado - será calculado automaticamente)
  - Accept (deixe desmarcado - será calculado automaticamente)
  - Accept-Encoding (deixe desmarcado - será calculado automaticamente)
  - Connection (deixe desmarcado - será calculado automaticamente)

- **Como adicionar o Content-Type**:
  - Clique em **"Add Header"** ou na linha vazia
  - **Key**: Digite `Content-Type`
  - **Value**: Digite `application/json`
  - **Marque o checkbox** ✅ ao lado do header
  - Clique em **"Add"** ou pressione Enter

#### **Passo 6: Configurar o Body (JSON)**
- Clique na aba **"Body"** (ao lado de Headers)
- Selecione a opção **"raw"** (botão de opção)
- No dropdown à direita, selecione **"JSON"** (deve mostrar "Text" por padrão, mude para JSON)
- No campo de texto abaixo, cole o seguinte JSON:
  ```json
  {
    "email": "seu-email@exemplo.com",
    "password": "sua-senha"
  }
  ```
- **Importante**: Substitua `seu-email@exemplo.com` e `sua-senha` pelos valores reais

#### **Passo 7: Enviar a Requisição**
- Clique no botão **"Send"** (botão azul no canto superior direito)
- Ou pressione `Ctrl + Enter` (Windows) / `Cmd + Enter` (Mac)

#### **Passo 8: Verificar a Resposta**

**✅ Resposta de Sucesso (200 OK):**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "seu-email@exemplo.com",
    "name": "Seu Nome"
  }
}
```
- **Copie o `token`** - você precisará dele para outras requisições autenticadas!

**❌ Resposta de Erro (400 Bad Request):**
```json
{
  "error": "Email e senha são obrigatórios"
}
```
- Verifique se preencheu email e senha no body

**❌ Resposta de Erro (401 Unauthorized):**
```json
{
  "error": "Credenciais inválidas"
}
```
- Email ou senha incorretos, ou usuário não existe
- Crie um usuário primeiro usando `/api/auth/register`

**❌ Resposta de Erro (500 Internal Server Error):**
```json
{
  "error": "Erro ao fazer login",
  "message": "..."
}
```
- Verifique se inicializou o banco (`/api/_init-db`)
- Verifique os logs no Vercel

### 📸 Visualização no Postman:

```
┌─────────────────────────────────────────────────────────┐
│ POST  https://monetize-speed-six.vercel.app/api/auth/...│ [Send]
├─────────────────────────────────────────────────────────┤
│ Params | Authorization | Headers | Body | Pre-request │
├─────────────────────────────────────────────────────────┤
│ Headers (1)                                             │
│ ┌──────┬──────────────────┬──────────────────────────┐ │
│ │  ✅  │ Content-Type     │ application/json         │ │
│ │  ☐   │ Host             │ <calculated...>          │ │
│ │  ☐   │ Content-Length  │ <calculated...>          │ │
│ │  ☐   │ User-Agent      │ PostmanRuntime/...        │ │
│ └──────┴──────────────────┴──────────────────────────┘ │
│                                                         │
│ ⚠️ IMPORTANTE: Marque APENAS o Content-Type!           │
│    Os outros headers são calculados automaticamente     │
├─────────────────────────────────────────────────────────┤
│ Body                                                    │
│ ○ none  ○ form-data  ○ x-www-form-urlencoded          │
│ ● raw  ○ binary  ○ GraphQL                           │
│        [JSON ▼]                                        │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ {                                                    │ │
│ │   "email": "teste@exemplo.com",                      │ │
│ │   "password": "senha123"                             │ │
│ │ }                                                    │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### ⚠️ Solução para o Erro "missing required Host header"

Se você estiver vendo o erro **"400 Bad Request: missing required Host header"**:

**Causa**: O arquivo `vercel.json` estava redirecionando TODAS as rotas (incluindo `/api/*`) para o frontend, causando conflito.

**Solução**: O `vercel.json` foi corrigido para excluir as rotas `/api/*` do redirect. 

**Ações necessárias**:
1. ✅ Faça um **novo deploy** no Vercel (ou faça commit e push)
2. ✅ Aguarde o deploy completar
3. ✅ Teste novamente no Postman

**Se o erro persistir após o deploy**:

1. **No Postman, tente estas alternativas**:
   - Use a aba **"Params"** em vez de modificar headers manualmente
   - Certifique-se de que a URL está completa: `https://monetize-speed-six.vercel.app/api/auth/login`
   - Tente usar **"Send and Download"** em vez de apenas "Send"

2. **Verifique se o deploy foi bem-sucedido**:
   - Vá no painel do Vercel → Deployments
   - Verifique se o último deployment está com status "Ready" (verde)
   - Se houver erros no build, corrija antes de testar

3. **Teste diretamente no navegador** (para verificar se é problema do Postman):
   - Abra o DevTools (F12)
   - Vá na aba Console
   - Execute:
     ```javascript
     fetch('https://monetize-speed-six.vercel.app/api/health')
       .then(r => r.json())
       .then(console.log)
     ```
   - Se funcionar no navegador mas não no Postman, é configuração do Postman

**Nota**: O Postman calcula automaticamente o header `Host` baseado na URL. Não é necessário (e não deve) marcar manualmente.

### 💡 Dicas Importantes:

1. **Salvar a Requisição**: 
   - Clique em **"Save"** para salvar para uso futuro
   - Dê um nome como "Login - MonetizeSpeed"

2. **Criar uma Collection**:
   - Crie uma collection chamada "MonetizeSpeed API"
   - Organize todas as requisições lá

3. **Variáveis de Ambiente** (Opcional):
   - Crie uma variável `{{baseUrl}}` = `https://monetize-speed-six.vercel.app`
   - Use `{{baseUrl}}/api/auth/login` na URL
   - Facilita mudar o ambiente depois

4. **Testar com Dados Reais**:
   - Se ainda não tem usuário, primeiro crie um com `/api/auth/register`
   - Use o mesmo formato, mas mude a URL para `/api/auth/register`
   - Depois use essas credenciais para fazer login

### 🔄 Exemplo Completo de Requisição:

**URL:**
```
POST https://monetize-speed-six.vercel.app/api/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "usuario@teste.com",
  "password": "senha123456"
}
```

**Resposta Esperada (Sucesso):**
```json
{
  "message": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidXN1YXJpb0B0ZXN0ZS5jb20iLCJpYXQiOjE3MzQ1MjE2MDAsImV4cCI6MTczNzExMzYwMH0.abc123...",
  "user": {
    "id": 1,
    "email": "usuario@teste.com",
    "name": "Nome do Usuário"
  }
}
```

**Se ainda der erro 500:**
- Verifique os logs no Vercel (Deployments → Functions → api/auth/login)
- Verifique se executou o passo 2 (inicializar banco)
- Verifique se a conexão com o banco está funcionando (passo 1)

## 4. Criar um Usuário (se necessário)

Se você ainda não tem um usuário cadastrado:

```
POST https://monetize-speed-six.vercel.app/api/auth/register
Content-Type: application/json

{
  "email": "seu-email@exemplo.com",
  "password": "sua-senha",
  "name": "Seu Nome"
}
```

## Checklist Rápido

- [x] Variáveis de ambiente configuradas (`DATABASE_URL` e `JWT_SECRET`)
- [ ] Testar conexão: `/api/test-connection`
- [ ] Inicializar banco: `/api/_init-db`
- [ ] Testar login: `/api/auth/login`
- [ ] Criar usuário (se necessário): `/api/auth/register`

## Troubleshooting

### Erro: "Banco de dados não inicializado"
→ Execute `/api/_init-db` primeiro

### Erro: "Connection timeout" ou "ENOTFOUND"
→ Verifique se:
- A `DATABASE_URL` está correta
- O banco PostgreSQL está acessível publicamente
- O firewall permite conexões do Vercel
- Para Supabase: Verifique se o banco permite conexões externas

### Erro: "Tabela não existe"
→ Execute `/api/_init-db` para criar as tabelas

### Erro: "Credenciais inválidas"
→ Isso é normal se você ainda não criou um usuário. Use `/api/auth/register` primeiro.

## Endpoints Úteis

- `/api/debug` - Verificar configuração do ambiente
- `/api/test-connection` - Testar conexão com banco
- `/api/_init-db` - Inicializar/criar tabelas
- `/api/health` - Health check simples
- `/api/auth/register` - Criar novo usuário
- `/api/auth/login` - Fazer login
- `/api/auth/verify` - Verificar token JWT

