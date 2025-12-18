# Como Configurar Variáveis de Ambiente no Vercel

## Problema Identificado

O endpoint `/api/debug` mostrou que as variáveis de ambiente não estão configuradas:
- `hasDatabaseUrl: false`
- `hasJwtSecret: false`

Isso causa erro 500 em todas as requisições que precisam do banco de dados ou JWT.

## Solução: Configurar Variáveis no Vercel

### Passo a Passo:

1. **Acesse o Painel do Vercel**
   - Vá para https://vercel.com
   - Faça login na sua conta
   - Selecione o projeto `monetize-speed`

2. **Vá para Settings → Environment Variables**
   - No menu lateral, clique em **Settings**
   - Clique na aba **Environment Variables**

3. **Adicione as Variáveis**

   **Variável 1: DATABASE_URL**
   - **Key**: `DATABASE_URL`
   - **Value**: Sua string de conexão PostgreSQL
     ```
     postgresql://postgres:SENHA@HOST:5432/postgres
     ```
   - **Environments**: Marque todas as opções (Production, Preview, Development)
   - Clique em **Save**

   **Variável 2: JWT_SECRET**
   - **Key**: `JWT_SECRET`
   - **Value**: Uma string aleatória segura (ex: `monetize-speed-secret-key-change-in-production-2024`)
   - **Environments**: Marque todas as opções (Production, Preview, Development)
   - Clique em **Save**

   **Variável 3: WEBHOOK_SECRET (Opcional)**
   - **Key**: `WEBHOOK_SECRET`
   - **Value**: Uma string aleatória para webhooks (ex: `webhook-secret-key-2024`)
   - **Environments**: Marque todas as opções
   - Clique em **Save**

### Importante sobre DATABASE_URL:

Se sua senha do banco contém caracteres especiais (como `$`, `#`, `@`, etc.), você precisa codificá-la:

**Exemplo:**
- Senha original: `$Ca*8627058##$`
- Senha codificada: `%24Ca%2A8627058%23%23%24`

Você pode usar este site para codificar: https://www.urlencoder.org/

Ou usar JavaScript:
```javascript
encodeURIComponent('$Ca*8627058##$')
// Resultado: %24Ca%2A8627058%23%23%24
```

Então sua DATABASE_URL ficaria:
```
postgresql://postgres:%24Ca%2A8627058%23%23%24@db.msuthinujxghpoygotqh.supabase.co:5432/postgres
```

### Após Configurar:

1. **Faça um novo deploy**:
   - Vá em **Deployments**
   - Clique nos três pontos (...) do último deployment
   - Selecione **Redeploy**
   - Ou faça um novo commit/push para trigger automático

2. **Verifique novamente**:
   - Acesse: `https://seu-dominio.vercel.app/api/debug`
   - Agora deve mostrar:
     ```json
     {
       "env": {
         "hasDatabaseUrl": true,
         "hasJwtSecret": true,
         "databaseUrlPrefix": "postgresql://postgres:...",
         "jwtSecretLength": 45
       }
     }
     ```

3. **Inicialize o banco de dados**:
   - Acesse: `https://seu-dominio.vercel.app/api/_init-db`
   - Isso criará as tabelas necessárias

4. **Teste o login**:
   - Agora o endpoint `/api/auth/login` deve funcionar!

## Verificação Rápida

Após configurar, você pode verificar se está tudo certo:

```bash
# Teste o debug
curl https://seu-dominio.vercel.app/api/debug

# Deve retornar hasDatabaseUrl: true e hasJwtSecret: true
```

## Troubleshooting

**Se ainda não funcionar após configurar:**

1. Verifique se fez **Redeploy** após adicionar as variáveis
2. Verifique se marcou **todas as environments** (Production, Preview, Development)
3. Verifique se não há espaços extras no início/fim dos valores
4. Verifique os logs do Vercel para ver erros específicos
5. Certifique-se de que o banco PostgreSQL está acessível publicamente

