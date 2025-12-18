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

## 3. Testar o Login

Agora você pode testar o endpoint de login:

```
POST https://monetize-speed-six.vercel.app/api/auth/login
Content-Type: application/json

{
  "email": "seu-email@exemplo.com",
  "password": "sua-senha"
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

